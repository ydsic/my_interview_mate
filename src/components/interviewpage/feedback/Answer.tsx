type FeedbackCardProps = {
  feedback: string;
  answer: string;
};

export default function Answer({ feedbackData, answer }: FeedbackCardProps) {
  return (
    <div className="p-5 rounded-xl border border-gray-300 bg-white shadow-sm space-y-4 animate-fade-in">
      test
    </div>
  );
}
