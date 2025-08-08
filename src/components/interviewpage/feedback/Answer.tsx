import thumbsUp from '../../../assets/ic_thumbs-up.svg';

type FeedbackCardProps = {
  feedbackData: {
    answer: string;
  };
};

export default function Answer({ feedbackData }: FeedbackCardProps) {
  const answer = feedbackData.answer;

  return (
    <div className="p-5 max-sm:p-3 rounded-xl border border-gray-300 bg-white shadow-sm space-y-4 animate-fade-in">
      <div className="bg-gray-50 border border-gray-200 rounded-xl px-6 max-sm:px-3 py-5 mx-4 max-sm:mx-0">
        <div className="flex items-center mb-4">
          <div className="flex items-center justify-center w-10 h-10 max-sm:w-8 max-sm:h-8 bg-gray-200 rounded-lg mr-3">
            <img
              src={thumbsUp}
              alt="thumbs up"
              className="w-6 h-6 max-sm:w-4 max-sm:h-4"
            />
          </div>
          <span className="font-bold text-lg max-sm:text-base text-gray-900">
            AI 모범 답안
          </span>
        </div>
        <div className="text-gray-700 text-base max-sm:text-sm leading-relaxed whitespace-pre-wrap">
          {answer}
        </div>
      </div>
    </div>
  );
}
