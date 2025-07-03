import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import addQuestionIcon from '../../assets/ic-add-question.svg';
import micIcon from '../../assets/micIcon.png';
import { SubmitButton } from '../common/Button';
import { H2_content_title } from '../common/HTagStyle';
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { OpenAIApi } from '../../api/prompt';
import { useToast } from '../../hooks/useToast';
import { VoiceRecording } from '../../utils/voiceRecording';
import WaitingMessage from './WaitingMessage';
import { saveFeedback } from '../../api/feedbackApi';
import { useRadarChartData } from '../../store/radarchartData';
import debounce from 'lodash.debounce';
import { saveAnswer } from '../../api/answerAPI';
import { supabase } from '../../supabaseClient';

interface AnswerInputProps {
  question: string;
  questionId: number;
  onFeedback: (answer: string, feedback: string) => void;
  disabled?: boolean;
  isFollowUpOpen: boolean;
  onFollowUpToggle: () => void;
}

export default function AnswerInput({
  question,
  questionId,
  onFeedback,
  disabled,
  isFollowUpOpen,
  onFollowUpToggle,
}: AnswerInputProps) {
  const [answer, setAnswer] = useState('');

  const [loading, setLoading] = useState(false);

  const [hasFeedback, setHasFeedback] = useState(false);

  const [isDirty, setIsDirty] = useState(false);

  const [isRecording, setIsRecording] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);

  const toast = useToast();
  const isEmpty = answer.trim() === '';

  const [voiceRecording, setVoiceRecording] = useState<VoiceRecording | null>(
    null,
  );
  const [recordingTime, setRecordingTime] = useState(60);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const voiceRecordingRef = useRef<VoiceRecording | null>(null);

  const setRadarData = useRadarChartData((state) => state.setRadarData);

  // AbortController 적용
  const controllerRef = useRef<AbortController | null>(null);

  // VoiceRecording 세팅
  useEffect(() => {
    const recording = new VoiceRecording({
      onStart: () => {
        setIsRecording(true);
        setRecordingTime(60);

        timerRef.current = setInterval(() => {
          setRecordingTime((prev) => {
            if (prev <= 1) {
              // 타이머가 0이 되면 자동으로 녹음 중지
              setTimeout(() => {
                if (
                  voiceRecordingRef.current &&
                  voiceRecordingRef.current.recording
                ) {
                  voiceRecordingRef.current.stopRecording();
                }
              }, 0);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        toast('녹음을 시작합니다.', 'success');
      },
      onStop: () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }

        setRecordingTime(60);
        setIsRecording(false);
        setIsProcessing(false);

        toast('녹음을 중지합니다.', 'info');
      },
      onResult: (text: string) => {
        setAnswer(
          (prev) => prev + (prev && !prev.endsWith(' ') ? ' ' : '') + text,
        );
        toast('음성 인식 완료!', 'success');
      },
      onError: (error: string) => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        setIsRecording(false);
        setIsProcessing(false);
        setRecordingTime(60);
        toast(error, 'error');
      },
      onProcessingStart: () => {
        setIsProcessing(true);
        setIsRecording(false);
      },
      onProcessingEnd: () => {
        // 처리 완료 시 모든 상태 초기화
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        setIsProcessing(false);
        setIsRecording(false);
        setRecordingTime(60);
      },
    });
    setVoiceRecording(recording);
    voiceRecordingRef.current = recording;

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      recording.cleanup();
    };
  }, [toast]);

  // 마이크 토글
  const handleMicClick = () => {
    if (!voiceRecording || disabled || isProcessing) return;

    if (isRecording) {
      voiceRecording.stopRecording();
    } else {
      voiceRecording.startRecording();
    }

    setIsDirty(true);
  };

  // 답변 수정
  const handleAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAnswer(e.target.value);
    setIsDirty(true);
  };

  const handleFeedback = useCallback(async () => {
    if (!answer.trim()) {
      toast('먼저 질문에 대한 답변을 해주세요.', 'info');
      return;
    }
    controllerRef.current?.abort();
    controllerRef.current = new AbortController();

    setLoading(true);

    try {
      // 유저 ID 가져오기
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      console.log('getUser error:', userError);
      console.log('getUser user object:', user);
      console.log('getUser user.email:', user?.email);
      if (!user || !user.email) {
        throw new Error('로그인 정보가 없습니다.');
      }
      const userEmail: string = user.email;

      // 답변 저장하기
      const answerId = await saveAnswer(userEmail, questionId, answer);
      console.log('answerId:', answerId);
      toast('답변 저장 완료!', 'success');

      const feedbackObj = await OpenAIApi(
        question,
        answer,
        controllerRef.current.signal,
      );
      onFeedback(answer, feedbackObj);
      const { scores, feedback, summary } = feedbackObj;

      try {
        await saveFeedback(answerId, questionId, scores, feedback, summary);
        toast('피드백을 성공적으로 저장했어요!', 'success');
      } catch (error) {
        toast((error as Error).message, 'error');
      }

      setRadarData(scores);
      toast('피드백을 가져왔어요!', 'success');
      setHasFeedback(true);
      setIsDirty(false);
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        console.log('피드백 요청 취소됨');
      } else {
        console.error('피드백 요청 실패:', err);
        toast('피드백 요청에 실패했어요.', 'error');
      }
    } finally {
      setLoading(false);
    }
  }, [answer, question, questionId, toast, onFeedback]);

  // 디바운스 처리,
  const debounceRequest = useMemo(
    () => debounce(handleFeedback, 300, { leading: true, trailing: false }),
    [handleFeedback],
  );

  // 새로운 질문에 대한 답변을 위한 입력 초기화.
  useEffect(() => {
    setAnswer('');
    setIsDirty(false);
    setIsRecording(false);
    setIsProcessing(false);
    setRecordingTime(60);

    controllerRef.current?.abort();
  }, [question]);
  return (
    <div className="p-5 rounded-xl border border-gray-300 bg-white shadow-sm space-y-4 mt-3 relative">
      {/* 로딩 모달 */}
      {loading && <WaitingMessage />}

      <div className="flex justify-between mb-5">
        <H2_content_title>내 답변</H2_content_title>
      </div>

      {/* 답변 입력 + 음성 UI */}
      <div className="relative">
        {/* disabled 대신 reaonly로 전환하여 키 다운순간 readOnly를 false로 풀어 편집 가능하게  */}
        <textarea
          rows={4}
          className="w-full min-h-[120px] p-4 border border-gray-200 rounded-xl resize-none focus:outline-none pr-12"
          placeholder="답변을 작성하거나 음성으로 대답해주세요."
          value={answer}
          onChange={handleAnswerChange}
          readOnly={hasFeedback && !isDirty && isRecording && isProcessing}
        />
        <button
          type="button"
          onClick={handleMicClick}
          className={`
            absolute bottom-3 right-3 p-1 rounded-full transition
            ${isRecording ? 'bg-red-500' : 'bg-white hover:bg-gray-200'}
            ${disabled || isProcessing ? 'cursor-not-allowed' : ''}
          `}
          disabled={disabled || isProcessing}
        >
          <img src={micIcon} alt="마이크 아이콘" className="w-8 h-8" />
        </button>
        {isProcessing ? (
          <div className="absolute bottom-6 right-16 text-xs text-blue-500 font-medium">
            🔄 음성 처리 중...
          </div>
        ) : isRecording ? (
          <div className="absolute bottom-6 right-16 text-xs text-gray-700 font-medium">
            <span className="animate-pulse">
              ⏱️ {recordingTime}초 남음 (클릭하여 중지)
            </span>
          </div>
        ) : null}
      </div>

      {/* 버튼영역 */}

      <div className="flex justify-end gap-4">
        <SubmitButton
          onClick={debounceRequest}
          className="flex items-center gap-2 pl-3 pr-4"
          isDisabled={
            isEmpty ||
            loading ||
            isRecording ||
            isProcessing ||
            (hasFeedback && !isDirty)
          }
        >
          <FontAwesomeIcon icon={faCheck} className="text-white" size="lg" />
          {loading
            ? '피드백 생성 중...'
            : !hasFeedback
              ? '피드백 받기'
              : isDirty
                ? '피드백 다시 받기'
                : '피드백 받기'}
        </SubmitButton>

        {/* 추가 질문 버튼 */}
        <button
          onClick={onFollowUpToggle}
          className="
            flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-1 transition
            hover:bg-gray-40 cursor-pointer
          "
        >
          <img
            src={addQuestionIcon}
            alt="추가 질문하기 아이콘"
            className="w-4 h-4"
          />
          {isFollowUpOpen ? '추가 질문 닫기' : '추가 질문하기'}
        </button>
      </div>
    </div>
  );
}
