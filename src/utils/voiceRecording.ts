import { elevenLabsSTT, checkAuthStatus } from '../api/elevenlabsSTT';

export interface VoiceRecordingConfig {
  onStart?: () => void;
  onStop?: () => void;
  onResult?: (text: string) => void;
  onError?: (error: string) => void;
  onProcessingStart?: () => void;
  onProcessingEnd?: () => void;
}

export class VoiceRecording {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private isRecording = false;
  private isProcessing = false;
  private config: VoiceRecordingConfig;

  constructor(config: VoiceRecordingConfig = {}) {
    this.config = config;
  }

  public get recording(): boolean {
    return this.isRecording;
  }

  public get processing(): boolean {
    return this.isProcessing;
  }

  public async startRecording(): Promise<void> {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      this.config.onError?.('이 브라우저는 마이크를 지원하지 않습니다.');
      return;
    }

    // 음성 녹음 시작 전에 인증 상태 미리 체크
    try {
      await checkAuthStatus();
      console.log('인증 상태 확인 완료');
    } catch (authError) {
      console.error('사전 인증 체크 실패:', authError);
      if (authError instanceof Error) {
        this.config.onError?.(authError.message);
      } else {
        this.config.onError?.(
          '로그인 상태를 확인할 수 없습니다. 다시 로그인해주세요.',
        );
      }
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      let mimeType = 'audio/webm;codecs=opus';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'audio/webm';
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = 'audio/mp4';
          if (!MediaRecorder.isTypeSupported(mimeType)) {
            mimeType = '';
          }
        }
      }

      const mediaRecorder = new MediaRecorder(stream, {
        ...(mimeType && { mimeType }),
      });

      this.mediaRecorder = mediaRecorder;
      this.audioChunks = [];
      this.isRecording = true;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          this.audioChunks.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        this.isRecording = false;
        this.isProcessing = true;
        this.config.onProcessingStart?.();

        stream.getTracks().forEach((track) => track.stop());

        if (this.audioChunks.length === 0) {
          this.config.onError?.('녹음된 오디오가 없습니다.');
          this.isProcessing = false;
          this.config.onProcessingEnd?.();
          return;
        }

        const audioBlob = new Blob(this.audioChunks, {
          type: this.audioChunks[0]?.type || 'audio/webm',
        });

        console.log('Audio blob created:', {
          size: audioBlob.size,
          type: audioBlob.type,
        });

        if (audioBlob.size < 100) {
          this.config.onError?.(
            '녹음된 오디오가 너무 짧습니다. 다시 시도해주세요.',
          );
          this.isProcessing = false;
          this.config.onProcessingEnd?.();
          this.audioChunks = [];
          return;
        }

        try {
          const text = await elevenLabsSTT(audioBlob);
          if (text && text.trim()) {
            this.config.onResult?.(text.trim());
          } else {
            this.config.onError?.(
              '음성을 인식하지 못했습니다. 다시 시도해주세요.',
            );
          }
        } catch (error) {
          console.error('STT Error:', error);

          // 에러 타입에 따른 구체적인 메시지 처리
          if (error instanceof Error) {
            if (
              error.message.includes('로그인이 필요합니다') ||
              error.message.includes('인증 세션에 문제가 있습니다')
            ) {
              this.config.onError?.(
                '로그인이 만료되었습니다. 다시 로그인해주세요.',
              );
            } else if (error.message.includes('STT API 요청 실패')) {
              this.config.onError?.(
                '음성 인식 서버에 문제가 있습니다. 잠시 후 다시 시도해주세요.',
              );
            } else {
              this.config.onError?.(
                error.message || '음성 인식에 실패했습니다. 다시 시도해주세요.',
              );
            }
          } else {
            this.config.onError?.(
              '음성 인식에 실패했습니다. 다시 시도해주세요.',
            );
          }
        } finally {
          this.isProcessing = false;
          this.config.onProcessingEnd?.();
          this.audioChunks = [];
        }
      };

      mediaRecorder.onerror = (e) => {
        console.error('MediaRecorder error:', e);
        this.config.onError?.('녹음 중 오류가 발생했습니다.');
        this.isRecording = false;
        this.isProcessing = false;
      };

      mediaRecorder.start(1000);
      this.config.onStart?.();
    } catch (err) {
      console.error('Recording error:', err);
      this.isRecording = false;

      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          this.config.onError?.(
            '마이크 권한이 거부되었습니다. 브라우저 설정을 확인하세요.',
          );
        } else if (err.name === 'NotFoundError') {
          this.config.onError?.('마이크를 찾을 수 없습니다.');
        } else {
          this.config.onError?.('마이크 접근에 실패했습니다.');
        }
      } else {
        this.config.onError?.('마이크 권한이 필요합니다.');
      }
    }
  }

  public stopRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
      this.config.onStop?.();
    }
  }

  public toggleRecording(): void {
    if (this.isRecording) {
      this.stopRecording();
    } else {
      this.startRecording();
    }
  }

  public cleanup(): void {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.isRecording = false;
    this.isProcessing = false;
  }
}

export function useVoiceRecording(config: VoiceRecordingConfig = {}) {
  let voiceRecording: VoiceRecording | null = null;

  const createRecording = () => {
    if (!voiceRecording) {
      voiceRecording = new VoiceRecording(config);
    }
    return voiceRecording;
  };

  return {
    startRecording: () => createRecording().startRecording(),
    stopRecording: () => voiceRecording?.stopRecording(),
    toggleRecording: () => voiceRecording?.toggleRecording(),
    isRecording: () => voiceRecording?.recording || false,
    isProcessing: () => voiceRecording?.processing || false,
    cleanup: () => {
      voiceRecording?.cleanup();
      voiceRecording = null;
    },
  };
}
