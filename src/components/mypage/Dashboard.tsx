import DoughnutChart from '../chart/DoughnutChart';
import LineChart from '../chart/LineChart';
import RadarChart from '../chart/RadarChart';
import { H2_content_title } from '../common/HTagStyle';

export default function Dashboard(): React.JSX.Element {
  /************ 더미 데이터 ************ */
  // 평균 점수 데이터
  const avgScore: number = 80;

  const solvedCount: number = 47; // 임시 총 문제 수 값 47
  const bestScore: number = 92; // 임시 최고 점수 값 92

  // 라인차트 데이터
  const lineDays = ['6/13', '6/14', '6/15', '6/16', '6/17', '6/18', '6/19'];
  const lineData = [70, 82, 85, 92, 88, 75, 60];

  // 역량분석 Radar차트 데이터
  const RadarData = [80, 85, 87, 88, 90];

  return (
    <div className="flex flex-col items-center gap-6 mb-5">
      <section className="flex flex-col w-full bg-gradient-to-r from-blue-500 to-purple-500 p-[50px] rounded-4xl gap-3 text-white">
        <p className="text-4xl font-bold"> 안녕하세요 김면접 님 👋</p>
        <p> 지난 연습 기록을 한 눈에 확인해보세요. </p>

        <div className="flex flex-col items-center mt-10">
          <div className="flex w-full justify-between">
            <p> 평균 점수 </p>
            <DoughnutChart score={avgScore} />
          </div>
          <div className="flex w-full justify-around mt-15 border-t pt-8">
            <div className="flex items-center gap-6">
              <p> 총 문제 수</p>
              <H2_content_title>{solvedCount} 개</H2_content_title>
            </div>
            <div className="flex items-center gap-6">
              <p> 최고 점수</p>
              <H2_content_title>{bestScore} 점</H2_content_title>
            </div>
          </div>
        </div>
      </section>

      <section className="flex w-full justify-between gap-3">
        <div className="flex-col bg-white w-full p-5 rounded-4xl shadow-md">
          <p className="font-semibold">점수 변화 추이</p>
          <LineChart days={lineDays} data={lineData} />
        </div>
        <div className="flex-col items-center bg-white w-full p-5 rounded-4xl shadow-md">
          <p className="font-semibold">역량 분석</p>
          <RadarChart data={RadarData} />
        </div>
      </section>
    </div>
  );
}
