import thumbsUp from '../../../assets/ic_thumbs-up.svg';

type FeedbackCardProps = {
  feedbackData: {
    answer: string;
  };
};

export default function Answer({ feedbackData }: FeedbackCardProps) {
  const answer = feedbackData.answer;

  return (
    <div className="p-5 rounded-xl border border-gray-300 bg-white shadow-sm space-y-4 animate-fade-in">
      <div className="bg-gray-50 border border-gray-200 rounded-xl px-6 py-5 mx-4">
        <div className="flex items-center mb-4">
          <div className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-lg mr-3">
            <img src={thumbsUp} alt="thumbs up" className="w-6 h-6" />
          </div>
          <span className="font-bold text-lg text-gray-900">AI 모범 답안</span>
        </div>
        <div className="text-gray-700 text-base leading-relaxed whitespace-pre-wrap">
          {answer}
        </div>
      </div>
    </div>
  );
}
