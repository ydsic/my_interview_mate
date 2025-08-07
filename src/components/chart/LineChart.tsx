import { Line } from 'react-chartjs-2';

type LineChartProps = {
  days: string[];
  data: number[];
};

export default function LineChart({ days, data }: LineChartProps) {
  const chartData = {
    labels: days,
    datasets: [
      {
        data: data,
        backgroundColor: '#3C82F6',
        borderColor: '#3C82F6',
        pointBorderColor: '#fff',
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
      y: {
        beginAtZero: true,
        suggestedMax: 100,
      },
    },
  };

  return (
    <div className="w-full h-full p-5">
      <Line data={chartData} options={options} />
    </div>
  );
}
