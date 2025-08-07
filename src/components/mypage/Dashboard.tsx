import { useEffect, useState } from 'react';
import { useUserDataStore } from '../../store/userData';
import DoughnutChart from '../chart/DoughnutChart';
import BarChart from '../chart/BarChart';
import LineChart from '../chart/LineChart';
import RadarChart from '../chart/RadarChart';
import { H2_content_title } from '../common/HTagStyle';
import { getScoreTrend, getUserDashboard } from '../../api/userInfo';
import { useToast } from '../../hooks/useToast';

type ScoreTrendItems = {
  date: string;
  avg_score: number;
};

export default function Dashboard() {
  const { user_id, nickname } = useUserDataStore((state) => state.userData);

  const [avgScore, setAvgScore] = useState<number>(0);
  const [solvedCount, setSolvedCount] = useState<number>(0);
  const [bestScore, setBestScore] = useState<number>(0);
  const [lineDays, setLineDays] = useState<string[]>([]);
  const [lineData, setLineData] = useState<number[]>([]);
  const [RadarData, setRadarData] = useState<number[]>([]);

  const toast = useToast();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        // 대시보드 값 불러오기
        const { data: dashboard, error: dashboardError } =
          await getUserDashboard(user_id);
        if (dashboardError) {
          console.error('[대시보드] 에러 발생:', dashboardError.message);
          toast('대시보드 데이터를 불러오지 못했어요!', 'error');
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
          const scoreTrendData = trendData as ScoreTrendItems[];

          const days = scoreTrendData.map((item) => item.date.slice(5));
          const scores = scoreTrendData.map((item) => item.avg_score);

          setLineDays(days);
          setLineData(scores);
        }
      } catch (error: unknown) {
        const err = error as Error;
        console.log(err);
        toast('점수 변화 데이터를 불러오지 못했어요!', 'error');
      }
    };

    if (user_id) {
      fetchDashboard();
    }
  }, [user_id, toast]);

  return (
    <div className="flex flex-col items-center gap-6 mb-5">
      <section
        className="flex flex-col w-full 
      bg-gradient-to-r from-blue-500 to-purple-500 
      p-[50px] rounded-4xl gap-3 text-white
      max-sm:px-10
      max-sm:pt-10   
      max-sm:pb-8
      
      max-sm:w-[calc(100%+32px)]
      max-sm:rounded-none  max-sm:gap-1"
      >
        <p
          className="text-4xl font-bold
        max-sm:text-2xl max-sm:font-medium"
        >
          안녕하세요 {nickname} 님 👋
        </p>
        <p className="max-sm:text-base">
          지난 연습 기록을 한 눈에 확인해보세요.
        </p>

        <div className="flex flex-col items-center mt-10 max-sm:mt-8">
          <div className="flex w-full justify-between items-center">
            <p> 평균 점수 </p>
            {/* 데스크톱 */}
            <div className="hidden sm:block">
              <DoughnutChart score={avgScore} />
            </div>
            {/* 모바일 */}
            <div className="block sm:hidden w-full max-w-[220px]">
              <BarChart score={avgScore} />
            </div>
          </div>

          {/* 하단부분 */}
          <div className="flex w-full justify-around mt-15 max-sm:mt-3 border-t pt-8 max-sm:pt-10">
            <div className="flex items-center gap-6 max-sm:gap-2">
              <p> 총 문제 수</p>
              <H2_content_title>{solvedCount} 개</H2_content_title>
            </div>
            <div className="flex items-center gap-6 max-sm:gap-2">
              <p> 최고 점수</p>
              <H2_content_title>{bestScore} 점</H2_content_title>
            </div>
          </div>
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-5 w-full max-sm:max-w-[340px] mx-auto max-sm:pb-5">
        <div
          className="bg-white p-5 rounded-4xl shadow-md
        w-full max-sm:max-w-full max-sm:overflow-hidden"
        >
          <p className="font-semibold">점수 변화 추이</p>
          <LineChart days={lineDays} data={lineData} />
        </div>
        <div
          className="bg-white p-5 rounded-4xl shadow-md
        w-full max-sm:max-w-full max-sm:overflow-hidden"
        >
          <p className="w-full font-semibold">역량 분석</p>
          <RadarChart data={RadarData} />
        </div>
      </section>
    </div>
  );
}
