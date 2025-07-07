type ScoreItemProps = {
  score: number;
  label: string;
};

export default function ScoreItem({ score, label }: ScoreItemProps) {
  const maxScore = 100;

  return (
    <div className="flex flex-1 flex-col items-center w-20 mx-1 border p-2 border-gray-200 rounded-2xl">
      <p className="text-[28px] font-bold">{score}</p>
      <div className="w-8 h-32 bg-gray-40 rounded-lg flex items-end">
        <div
          className="w-full bg-gray-100 rounded-lg"
          style={{ height: `${(score / maxScore) * 100}%` }}
        />
      </div>
      <p className="text-sm mt-1 font-medium text-gray-800">{score}점</p>
      <p className="text-xs text-center mt-1 text-gray-700">{label}</p>
    </div>
  );
}
