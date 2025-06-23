import { Line } from 'react-chartjs-2';

export default function LineChart() {
  const data = {
    labels: ['6/13', '6/14', '6/15', '6/16', '6/17', '6/18', '6/19'],
    datasets: [
      {
        data: [70, 82, 85, 92, 88, 75, 60],
        backgroundColor: ['#000'],
        color: ['#000'],
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
    <div className="w-full p-5">
      <Line data={data} options={options} />
    </div>
  );
}
