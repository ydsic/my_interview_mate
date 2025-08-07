import { Radar } from 'react-chartjs-2';
import '../../chartConfig';

type RadarChartProps = {
  data: number[];
};

export default function RadarChart({ data }: RadarChartProps) {
  const RadarData = {
    labels: ['논리적 일관성', '명료성', '구조화', '기술적 정확성', '심층성'],
    datasets: [
      {
        data: data,
        fill: true,
        backgroundColor: '#3600F917',
        borderColor: '#8B5CF6',
        pointBackgroundColor: '#8B5CF6',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(255, 99, 132)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      r: {
        min: 0,
        max: 100,
      },
    },
  };

  return (
    <div className="w-[450px] h-[300px] max-sm:w-full max-sm:h-[270px] place-self-center">
      <Radar
        data={RadarData}
        options={{
          ...options,
          maintainAspectRatio: false,
        }}
      />
    </div>
  );
}
