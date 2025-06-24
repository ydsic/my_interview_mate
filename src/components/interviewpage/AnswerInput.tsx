import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import addQuestionIcon from '../../assets/ic-add-question.svg';
import { SubmitButton } from '../common/Button';
import { H2_content_title } from '../common/HTagStyle';
import { useState } from 'react';
import { OpenAIApi } from '../../api/prompt';
import { useToast } from '../../hooks/useToast';

export default function AnswerInput() {
  const [answer, setAnswer] = useState('');
  const toast = useToast();
  const question = 'React의 상태관리는 어떻게 하나요?';

  const isEmpty = answer.trim() === '';

  const handleFeedback = async () => {
    if (isEmpty) {
      toast('먼저 질문에 대한 답변을 해주세요.');
      return;
    }
    try {
      const feedback = await OpenAIApi(question, answer);
      console.log(feedback);
      toast('피드백을 가져왔어요!', 'success');
    } catch (e) {
      console.error('피드백 요청 실패:', e);
      toast('피드백 요청에 실패했어요.', 'error');
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
    <div className="p-5 rounded-xl border border-gray-300 bg-white shadow-sm space-y-4">
      <div className="flex justify-between mb-5">
        <H2_content_title>내 답변</H2_content_title>
      </div>

      <textarea
        rows={4}
        className="w-full min-h-[120px] p-4 border border-gray-200 rounded-xl resize-none focus:outline-none"
        placeholder="답변을 작성하시거나, 음성으로 대답해주세요."
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
      />

      <div className="flex justify-end gap-4">
        <SubmitButton
          onClick={handleFeedback}
          className="flex items-center gap-2"
          isDisabled={isEmpty}
        >
          <FontAwesomeIcon icon={faCheck} className="text-white" size="lg" />
          피드백 받기
        </SubmitButton>
        <button
          onClick={handleFollowUp}
          className={`flex items-center gap-2 border border-gray-200 rounded-xl 
            px-3 py-1 cursor-pointer hover:bg-gray-50 transition ${isEmpty ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
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
