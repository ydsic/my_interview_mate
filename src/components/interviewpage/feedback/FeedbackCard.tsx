import { useState } from 'react';
import AiFeedback from './AiFeedback';
import Answer from './Answer';

type FeedbackCardProps = {
  feedback: any;
  answer: string;
};

export default function FeedbackCard({ feedback }: FeedbackCardProps) {
  const [selectedTab, setSelectedTab] = useState<'feedback' | 'answer'>(
    'feedback',
  );

  let feedbackObj;
  try {
    feedbackObj = feedback;
  } catch {
    feedbackObj = {
      average:
        'AI 피드백을 불러오는 데 실패했습니다. 다시 시도해주세요. 문제가 지속되면 관리자에게 문의해주세요.',
      summary: '',
    };
  }

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto ">
      <div className="flex justify-around items-center border p-2 border-gray-300 bg-gray-25 shadow-sm rounded-xl text-center mb-3">
        <div
          className={`text-md font-semibold w-full p-2 cursor-pointer rounded-xl ${
            selectedTab === 'feedback' ? 'bg-white' : ''
          }`}
          onClick={() => setSelectedTab('feedback')}
        >
          AI 피드백
        </div>
        <div
          className={`text-md font-semibold w-full p-2 cursor-pointer rounded-xl ${
            selectedTab === 'answer' ? 'bg-white' : ''
          }`}
          onClick={() => setSelectedTab('answer')}
        >
          모범 답안
        </div>
      </div>
      {selectedTab === 'feedback' ? (
        <AiFeedback feedbackData={feedbackObj} />
      ) : (
        <Answer feedbackData={feedbackObj} />
      )}
    </div>
  );
}
