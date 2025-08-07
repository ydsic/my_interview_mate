interface BarScoreBarProps {
  score: number;
}

export default function BarChart({ score }: BarScoreBarProps) {
  return (
    <div className="flex items-center gap-3 w-full">
      <div className="flex-1 h-[15px] bg-white/30 rounded-sm overflow-hidden">
        <div
          className="h-full bg-white rounded-md transition-all duration-500"
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-base font-semibold whitespace-nowrap">
        {score}점
      </span>
    </div>
  );
}
