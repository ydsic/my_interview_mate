import { create } from 'zustand';

interface RadarChartDataState {
  radarData: number[];
  setRadarData: (data: number[]) => void;
}

export const useRadarChartData = create<RadarChartDataState>((set) => ({
  radarData: [],
  setRadarData: (data) => set({ radarData: data }),
}));

// 배열 위치별 종류
// 0번 : 논리적 일관성
// 1번 : 명료성
// 2번 : 구조화
// 3번 : 기술적 명확성
// 4번 : 심층성
