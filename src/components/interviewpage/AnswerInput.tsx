import { SubmitButton } from '../common/Button';
import { H2_content_title } from '../common/HTagStyle';
import { useState } from 'react';
import { OpenAIApi } from '../../api/prompt';

export default function AnswerInput() {
  const [answer, setAnswer] = useState('');

  const question = 'React의 상태관리는 어떻게 하나요?';

  const handleFeedback = async () => {
    console.log('피드백 요청 시작');
    try {
      const feedback = await OpenAIApi(question, answer);
      console.log(feedback);
    } catch (e) {
      console.error('피드백 요청 실패:', e);
    }
  };

  return (
    <div className="p-5 rounded-xl border border-gray-300 bg-white shadow-sm space-y-4">
      <div className="flex justify-between mb-5">
        <H2_content_title>내 답변</H2_content_title>
      </div>

      <div>
        <input
          type="text"
          className="w-full h-15 pl-4 pr-12 border border-gray-200 rounded-xl focus:outline-none"
          placeholder="답변을 작성하시거나, 음성으로 대답해주세요."
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />
      </div>
      <div className="flex justify-end gap-4">
        <SubmitButton onClick={handleFeedback}>피드백 받기</SubmitButton>
        <button>추가 질문하기</button>
      </div>
    </div>
  );
}
