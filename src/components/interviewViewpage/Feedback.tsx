import { H3_sub_detail } from '../common/HTagStyle';
import MyProgressBar from '../interviewpage/feedback/ProgressBar';
import Improvements from '../interviewpage/feedback/Improvements';
import ScoreItem from './ScoreItem';

type FeedbackDataType = {
  average: number;
  summary: string;
  feedback: string[];
  logic_score: number;
  clarity_score: number;
  technical_score: number;
  depth_score: number;
  structure_score: number;
};

const feedbackData: FeedbackDataType = {
  average: 63,
  feedback: [
    'merge와 rebase의 실제 동작 방식과 차이점을 더 구체적으로 설명해 보세요.',
    '용어의 의미를 명확하게 풀어서 설명하는 것이 좋습니다.',
    '예시나 실제 사용 사례를 덧붙이면 심층성이 향상됩니다.',
  ],
  summary:
    '간단하게 핵심을 언급했으나, 구체적 설명이 부족합니다. 용어의 의미가 모호하게 전달됩니다. 실제 동작과 차이점을 예시와 함께 설명하면 좋습니다.',
  logic_score: 65,
  clarity_score: 70,
  technical_score: 60,
  depth_score: 65,
  structure_score: 55,
};

const scoreItems = [
  { label: '논리적 일관성', value: feedbackData.logic_score },
  { label: '명료성', value: feedbackData.clarity_score },
  { label: '기술적 정확성', value: feedbackData.technical_score },
  { label: '심층성', value: feedbackData.depth_score },
  { label: '구조화', value: feedbackData.structure_score },
];

export default function Feedback() {
  return (
    <div className="flex flex-col items-baseline w-full gap-5">
      <H3_sub_detail> AI 피드백 </H3_sub_detail>

      <div className="w-full bg-gray-50 rounded-lg p-4 text-left whitespace-pre-line text-sm text-gray-800 border border-gray-200 mb-2">
        <p className="text-lg font-bold text-gray-800 mb-1">종합 평가</p>
        <p className="text-gray-70 mb-3">AI가 분석한 답변 평가 결과입니다.</p>
        <p className="text-2xl font-bold text-right mb-2 text-gray-800">
          {feedbackData.average}점
        </p>
        <MyProgressBar score={feedbackData.average} />
        <p className="text-black mt-4">{feedbackData.summary}</p>
      </div>

      <div className="flex flex-col w-full  gap-5">
        <p className="text-lg font-bold text-gray-800 text-left px-4">
          세부 평가 항목
        </p>
        <section className="flex w-full">
          {scoreItems.map((item, index) => (
            <ScoreItem key={index} score={item.value} label={item.label} />
          ))}
        </section>
      </div>

      <div className="w-full text-left">
        <Improvements data={feedbackData.feedback} />
      </div>
    </div>
  );
}
