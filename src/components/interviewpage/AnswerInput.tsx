import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import addQuestionIcon from '../../assets/ic-add-question.svg';
import { SubmitButton } from '../common/Button';
import { H2_content_title } from '../common/HTagStyle';
import { useState } from 'react';
import { OpenAIApi } from '../../api/prompt';

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

  const handleFeedback = async () => {
    if (isEmpty || disabled) return;
    setLoading(true);
    try {
      const feedback = await OpenAIApi(question, answer);
      onFeedback(answer, feedback);
    } catch (e) {
      console.error('피드백 요청 실패:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 rounded-xl border border-gray-300 bg-white shadow-sm space-y-4 mt-3">
      <div className="flex justify-between mb-5">
        <H2_content_title>내 답변</H2_content_title>
      </div>

      <textarea
        rows={4}
        className="w-full min-h-[120px] p-4 border border-gray-200 rounded-xl resize-none focus:outline-none"
        placeholder="답변을 작성하시거나, 음성으로 대답해주세요."
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        disabled={disabled}
      />

      <div className="flex justify-end gap-4">
        <SubmitButton
          onClick={handleFeedback}
          className="flex items-center gap-2"
          disabled={isEmpty || disabled || loading}
        >
          <FontAwesomeIcon icon={faCheck} className="text-white" size="lg" />
          {loading ? '피드백 생성 중...' : '피드백 받기'}
        </SubmitButton>

        <button
          disabled={isEmpty || disabled}
          className={`flex items-center gap-2 border border-gray-200 rounded-xl 
            px-3 py-1 cursor-pointer hover:bg-gray-50 transition ${
              isEmpty || disabled
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
