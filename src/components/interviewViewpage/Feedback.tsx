import { H3_sub_detail } from '../common/HTagStyle';
import MyProgressBar from '../interviewpage/feedback/ProgressBar';
import Improvements from '../interviewpage/feedback/Improvements';
import ScoreItem from './ScoreItem';
import { useMemo } from 'react';

type FeedbackDataPropsType = {
  average: number;
  summary: string;
  feedback: string;
  logic_score: number;
  clarity_score: number;
  technical_score: number;
  depth_score: number;
  structure_score: number;
};

export default function Feedback({
  feedbackData,
}: {
  feedbackData: FeedbackDataPropsType;
}) {
  const scoreItems = [
    { label: '논리적 일관성', value: feedbackData.logic_score },
    { label: '명료성', value: feedbackData.clarity_score },
    { label: '기술적 정확성', value: feedbackData.technical_score },
    { label: '심층성', value: feedbackData.depth_score },
    { label: '구조화', value: feedbackData.structure_score },
  ];

  const parsedFeedback = useMemo(() => {
    try {
      return JSON.parse(feedbackData.feedback);
    } catch {
      try {
        return JSON.parse(JSON.parse(feedbackData.feedback));
      } catch {
        return ['피드백 데이터를 불러오는 데 실패했어요.'];
      }
    }
  }, [feedbackData.feedback]);

  return (
    <div className="flex flex-col items-baseline w-full gap-5 max-sm:gap-4">
      <H3_sub_detail> AI 피드백 </H3_sub_detail>

      <div
        className="w-full bg-gray-50 rounded-lg p-5 max-sm:p-3
       text-left whitespace-pre-line text-sm text-gray-800 border border-gray-200 mb-2"
      >
        <div className="flex justify-between sm:p-2 ">
          <div>
            <p className="text-lg font-bold text-gray-800 mb-1">종합 평가</p>
            <p className="text-gray-70 mb-3">
              AI가 분석한 답변 평가 결과입니다.
            </p>
          </div>
          <p className="text-2xl font-bold text-right mb-2 text-gray-800">
            {feedbackData.average}점
          </p>
        </div>
        <MyProgressBar score={feedbackData.average} />
        <p className="text-black mt-5 max-sm:text-ms">{feedbackData.summary}</p>
      </div>

      <div className="flex flex-col w-full gap-5 max-sm:gap-2">
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
        <Improvements data={parsedFeedback} />
      </div>
    </div>
  );
}
