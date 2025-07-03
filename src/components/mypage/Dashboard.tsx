/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useUserDataStore } from '../../store/userData';
import DoughnutChart from '../chart/DoughnutChart';
import LineChart from '../chart/LineChart';
import RadarChart from '../chart/RadarChart';
import { H2_content_title } from '../common/HTagStyle';
import { getScoreTrend, getUserDashboard } from '../../api/userInfo';

export default function Dashboard() {
  const { user_id, nickname } = useUserDataStore((state) => state.userData);

  const [avgScore, setAvgScore] = useState<number>(0);
  const [solvedCount, setSolvedCount] = useState<number>(0);
  const [bestScore, setBestScore] = useState<number>(0);
  const [lineDays, setLineDays] = useState<string[]>([]);
  const [lineData, setLineData] = useState<number[]>([]);
  const [RadarData, setRadarData] = useState<number[]>([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        // 대시보드 값 불러오기
        const { data: dashboard, error: dashboardError } =
          await getUserDashboard(user_id);
        if (dashboardError) {
          console.error('[대시보드] 에러 발생:', dashboardError.message);
        } else if (dashboard) {
          setAvgScore(dashboard.avg_score || 0);
          setSolvedCount(dashboard.total_question || 0);
          setBestScore(dashboard.highest_score || 0);
          setRadarData([
            dashboard.logic_avg_score || 0,
            dashboard.clarity_avg_score || 0,
            dashboard.structure_avg_score || 0,
            dashboard.technical_avg_score || 0,
            dashboard.depth_avg_score || 0,
          ]);
        }

        // 점수 변화 추이 값 가져오기
        const { data: trendData, error: trendError } =
          await getScoreTrend(user_id);
        if (trendError) {
          console.error('[score_trend_view] 에러 : ', trendError.message);
        } else if (trendData) {
          const days = trendData.map((item: any) => item.date.slice(5)); // MM-DD 형식
          const scores = trendData.map((item: any) => item.avg_score);
          setLineDays(days);
          setLineData(scores);
        }
      } catch (err: any) {
        console.log(err);
      }
    };

    if (user_id) {
      fetchDashboard();
    }
  }, [user_id]);

  return (
    <div className="flex flex-col items-center gap-6 mb-5">
      <section className="flex flex-col w-full bg-gradient-to-r from-blue-500 to-purple-500 p-[50px] rounded-4xl gap-3 text-white">
        <p className="text-4xl font-bold"> 안녕하세요 {nickname} 님 👋</p>
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
