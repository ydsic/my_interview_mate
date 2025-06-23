import { Doughnut } from 'react-chartjs-2';
import '../../chartConfig';

interface DoughnutChartProps {
  score: number;
}

export default function DoughnutChart({ score }: DoughnutChartProps) {
  const data = {
    datasets: [
      {
        data: [score, 100 - score],
        backgroundColor: ['#ffffff', '#ffffff99'],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    cutout: '85%',
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="relative">
      <Doughnut data={data} options={options} className="w-[200px]" />
      {/* 도넛 가운데 점수 표시 */}
      <p className="absolute inset-0 flex items-center justify-center text-4xl font-bold">
        {score}점
      </p>
    </div>
  );
}
