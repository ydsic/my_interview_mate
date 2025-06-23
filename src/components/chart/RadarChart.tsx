import { Radar } from 'react-chartjs-2';
import '../../chartConfig';

export default function RadarChart() {
  const data = {
    labels: [
      '논리적 일관성',
      '명료성',
      '구조화',
      '간결성',
      '기술적 정확성',
      '심층성',
    ],
    datasets: [
      {
        data: [80, 85, 87, 88, 90, 98],
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
    <div className="w-[450px] h-[300px] justify-self-center">
      <Radar
        data={data}
        options={{
          ...options,
          maintainAspectRatio: false,
        }}
      />
    </div>
  );
}
