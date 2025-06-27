import RadarChart from '../../chart/RadarChart';
import {
  H1_big_title,
  H2_content_title,
  H4_placeholder,
} from '../../common/HTagStyle';
import EvaluationItems from './EvaluationItems';
import Imporvements from './Improvements';
import MyProgressBar from './ProgressBar';

type FeedbackCardProps = {
  feedbackData: {
    average: number;
    summary: string;
    scores: number[];
    feedback: string[];
  };
};

export default function AiFeedback({ feedbackData }: FeedbackCardProps) {
  const score = feedbackData.average;
  const scores = feedbackData.scores;
  const feedbacks = feedbackData.feedback;

  return (
    <div className="p-5 rounded-xl border border-gray-300 bg-white shadow-sm space-y-4 animate-fade-in">
      <div className="bg-gray-50 rounded-lg p-4 text-left whitespace-pre-line text-sm text-gray-800 border border-gray-200 mb-2">
        <H2_content_title>종합 평가</H2_content_title>
        <H4_placeholder className="text-gray-70 mb-3">
          AI가 분석한 답변 평가 결과입니다.
        </H4_placeholder>

        <H1_big_title>{feedbackData.average} 점</H1_big_title>
        <MyProgressBar score={score} />
        <H4_placeholder className="text-black mt-2">
          {feedbackData.summary}
        </H4_placeholder>
      </div>

      <RadarChart data={scores} />
      <EvaluationItems data={scores} />
      <Imporvements data={feedbacks} />
    </div>
  );
}
