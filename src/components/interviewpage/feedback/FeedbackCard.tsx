interface FeedbackCardProps {
  feedback: string;
  answer: string;
}

export default function FeedbackCard({ feedback, answer }: FeedbackCardProps) {
  return (
    <div className="p-5 rounded-xl border border-gray-300 bg-white shadow-sm space-y-4 animate-fade-in">
      <div className="flex justify-between mb-5">
        <h2 className="text-lg font-semibold">AI 피드백</h2>
      </div>
      <p className="text-gray-600 mb-2">
        AI가 제공하는 피드백을 통해 답변을 개선해보세요.
      </p>
      <div className="bg-gray-50 rounded-lg p-4 text-left whitespace-pre-line text-sm text-gray-800 border border-gray-200 mb-2">
        <b>내 답변:</b> {answer}
      </div>
      <div className="bg-blue-50 rounded-lg p-4 text-left whitespace-pre-line text-sm text-blue-900 border border-blue-200 animate-fade-in">
        <b>AI 피드백:</b> {feedback}
      </div>
    </div>
  );
}
