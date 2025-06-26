import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import addQuestionIcon from '../../assets/ic-add-question.svg';
import { SubmitButton } from '../common/Button';
import { H2_content_title } from '../common/HTagStyle';
import { useState, useEffect } from 'react';
import { OpenAIApi } from '../../api/prompt';
import { useToast } from '../../hooks/useToast';
import { VoiceRecording } from '../../utils/voiceRecording';
import micIcon from '../../assets/micIcon.png';

interface AnswerInputProps {
  question: string;
  onFeedback: (answer: string, feedback: string) => void;
  disabled?: boolean;
}

export default function AnswerInput({
  question,
  onFeedback,
  disabled,
}: AnswerInputProps) {
  const [answer, setAnswer] = useState('');
  const isEmpty = answer.trim() === '';
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const toast = useToast();
  const [voiceRecording, setVoiceRecording] = useState<VoiceRecording | null>(
    null,
  );

  useEffect(() => {
    const recording = new VoiceRecording({
      onStart: () => {
        setIsRecording(true);
        toast('녹음을 시작합니다.', 'success');
      },
      onStop: () => {
        toast('녹음을 중지합니다.', 'info');
      },
      onResult: (text: string) => {
        setAnswer(
          (prev) => prev + (prev && !prev.endsWith(' ') ? ' ' : '') + text,
        );
        toast('음성 인식 완료!', 'success');
      },
      onError: (error: string) => {
        toast(error, 'error');
      },
      onProcessingStart: () => {
        setIsProcessing(true);
      },
      onProcessingEnd: () => {
        setIsProcessing(false);
        setIsRecording(false);
      },
    });

    setVoiceRecording(recording);

    return () => {
      recording.cleanup();
    };
  }, [toast]);

  const handleMicClick = () => {
    if (!voiceRecording || disabled || isProcessing) return;
    if (isRecording) {
      voiceRecording.stopRecording();
    } else {
      voiceRecording.startRecording();
    }
  };

  const handleFeedback = async () => {
    if (isEmpty) {
      toast('먼저 질문에 대한 답변을 해주세요.');
      return;
    }
    setLoading(true);
    try {
      const feedback = await OpenAIApi(question, answer);
      onFeedback(answer, feedback);
      toast('피드백을 가져왔어요!', 'success');
    } catch (e) {
      console.error('피드백 요청 실패:', e);
      toast('피드백 요청에 실패했어요.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFollowUp = () => {
    if (isEmpty) {
      toast('먼저 질문에 대한 답변을 해주세요!');
      return;
    }
    toast('추가 질문을 전송했어요!', 'success');
  };

  return (
    <div className="p-5 rounded-xl border border-gray-300 bg-white shadow-sm space-y-4 mt-3">
      <div className="flex justify-between mb-5">
        <H2_content_title>내 답변</H2_content_title>
      </div>

      <div className="relative">
        <textarea
          rows={4}
          className="w-full min-h-[120px] p-4 border border-gray-200 rounded-xl resize-none focus:outline-none pr-12"
          placeholder="답변을 작성해 주세요."
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          disabled={disabled || isRecording || isProcessing}
        />

        {/* 마이크 버튼 */}
        <button
          type="button"
          onClick={handleMicClick}
          className={`absolute bottom-3 right-3 p-1 rounded-full transition ${
            isRecording ? 'bg-red-500' : 'bg-white hover:bg-gray-200'
          } ${disabled || isProcessing ? 'cursor-not-allowed' : ''}`}
        >
          <img src={micIcon} alt="마이크 아이콘" className="w-8 h-8" />
        </button>

        {/* 상태 표시 */}
        {isProcessing ? (
          <div className="absolute bottom-6 right-16 text-xs text-blue-500 font-medium">
            🔄 음성 처리 중...
          </div>
        ) : isRecording ? (
          <div className="absolute bottom-6 right-16 text-xs text-red-500 font-medium">
            <span className="animate-pulse">🔴 녹음 중... (클릭하여 중지)</span>
          </div>
        ) : null}
      </div>

      {/* 피드백 받기 버튼 */}
      <div className="flex justify-end gap-4">
        <SubmitButton
          onClick={handleFeedback}
          className="flex items-center gap-2 pl-3 pr-4"
          isDisabled={
            isEmpty || disabled || loading || isRecording || isProcessing
          }
        >
          <FontAwesomeIcon icon={faCheck} className="text-white" size="lg" />
          {loading ? '피드백 생성 중...' : '피드백 받기'}
        </SubmitButton>

        {/* 추가 질문 버튼 */}
        <button
          disabled={isEmpty || disabled || isRecording || isProcessing}
          onClick={handleFollowUp}
          className={`flex items-center gap-2 border border-gray-200 rounded-xl 
            px-3 py-1 cursor-pointer hover:bg-gray-50 transition ${
              isEmpty || disabled || isRecording || isProcessing
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-gray-50'
            }`}
        >
          <img
            src={addQuestionIcon}
            alt="추가 질문하기 아이콘"
            className="w-4 h-4"
          />
          추가 질문하기
        </button>
      </div>
    </div>
  );
}
