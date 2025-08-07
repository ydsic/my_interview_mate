type FeedbackType = {
  data: string[];
};

export default function Improvements({ data }: FeedbackType) {
  const suggestions = Array.isArray(data)
    ? data.filter((sugg) => !!sugg && sugg.trim() !== '')
    : [];

  return (
    <div className="bg-yellow-10 border border-gray-200 rounded-xl p-4">
      <h3 className="text-lg font-bold text-gray-800 mb-4">개선점</h3>
      {suggestions.length === 0 ? (
        <div className="text-gray-400 italic">개선점이 없습니다.</div>
      ) : (
        <div className="space-y-3 max-sm:space-y-2">
          {suggestions.map((suggestion, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="w-2 h-2 bg-gray-600 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-gray-700 leading-relaxed max-sm:text-sm">
                {suggestion}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
