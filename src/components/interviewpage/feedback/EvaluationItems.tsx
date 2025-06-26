type ScoresType = {
  data: number[];
};

export default function EvaluationItems({ data }: ScoresType) {
  const itemClass =
    'flex justify-between items-center bg-white border border-gray-200 rounded-xl px-4 py-3 flex-1';

  function Item({ label, score }: { label: string; score?: number }) {
    return (
      <div className={itemClass}>
        <span className="text-gray-700 font-medium">{label}</span>
        <span className="font-bold text-gray-900">{score}점</span>
      </div>
    );
  }

  return (
    <div className="space-y-2 p-2">
      <div className="flex gap-2">
        <Item label="논리적 일관성" score={data[0]} />
        <Item label="명료성" score={data[1]} />
      </div>
      <div className="flex gap-2">
        <Item label="구조화" score={data[2]} />
        <Item label="기술적 명확성" score={data[3]} />
      </div>
      <div className="flex gap-2">
        <Item label="심층성" score={data[4]} />
        <div className={itemClass + ' border-0'} />
      </div>
    </div>
  );
}
