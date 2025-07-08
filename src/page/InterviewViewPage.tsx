import { useNavigate, useParams } from 'react-router-dom';
import { debounce } from 'lodash';
import { H2_content_title } from '../components/common/HTagStyle';
import Feedback from '../components/interviewViewpage/Feedback';
import { supabase } from '../supabaseClient';
import InterviewQuestion from '../components/interviewpage/InterviewQuestion';
import { useState, useEffect, useMemo } from 'react';
import AnswerInput from '../components/interviewpage/AnswerInput';
import { useToast } from '../hooks/useToast';

import type { QuestionData } from '../types/interview';
import type { CategoryKey } from '../types/interview';
import { selectFeedbackData } from '../api/bookMarkAPI';

import { useUserDataStore } from '../store/userData';
import { insertBookMark, deleteBookMark, Bookmarked } from '../api/bookMarkAPI';

type AnswerWithQuestion = {
  content: string;
  questions: {
    question_id: number;
    content: string;
    category: CategoryKey;
    topic: string;
  };
};

type FeedbackData = {
  average: number;
  feedback: string;
  summary: string;
  logic_score: number;
  clarity_score: number;
  technical_score: number;
  depth_score: number;
  structure_score: number;
};

interface ViewData {
  answer: string;
  question: QuestionData;
}

export default function InterviewViewPage() {
  const { answerId } = useParams<{ answerId: string }>();
  const navigate = useNavigate();

  const [data, setData] = useState<ViewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFollowUp, setShowFollowUp] = useState(false);

  const [feedbackData, setFeedbackData] = useState<FeedbackData | null>(null);

  const userId = useUserDataStore((s) => s.userData.user_id);
  const toast = useToast();
  const [isBookmarked, setIsBookmarked] = useState(false);

  //북마크
  useEffect(() => {
    if (!data?.question.questionId || !userId) return;
    (async () => {
      try {
        const result = await Bookmarked(userId, data.question.questionId);
        setIsBookmarked(result);
      } catch (err) {
        console.error('북마크 여부 조회 에러 : ', err);
        toast('북마크 여부를 확인하지 못했어요.', 'error');
      }
    })();
  }, [data?.question.questionId, userId, toast]);

  // 북마크
  const Bookmark = async () => {
    if (!userId || !data) return;

    try {
      if (isBookmarked) {
        const confirmed = window.confirm(
          '즐겨찾기에서 이 질문을 즐겨찾기에서 삭제하시겠습니까??',
        );
        if (!confirmed) return;

        await deleteBookMark(userId, data.question.questionId);
        toast('즐겨찾기에서 삭제했어요!', 'success');
      } else {
        await insertBookMark(userId, data.question.questionId);
        toast('즐겨찾기 등록 완료!', 'success');
      }
      setIsBookmarked((prev) => !prev);
    } catch (e) {
      console.error('북마크 토글 실패:', e);
      toast('북마크 작업에 실패했어요.', 'error');
    }
  };

  const toggleBookmark = useMemo(
    () =>
      debounce(Bookmark, 200, {
        leading: true,
        trailing: false,
      }),
    [isBookmarked, data?.question.questionId, userId, toast],
  );

  // 질문 답변 데이터 가져오기
  useEffect(() => {
    if (!answerId) return;

    (async () => {
      try {
        const { data, error } = await supabase
          .from('answers')
          .select(
            `content,
             questions!answers_question_id_fkey(question_id, content, category, topic)`,
          )
          .eq('answer_id', answerId)
          .single<AnswerWithQuestion>();

        if (error) throw error;

        setData({
          answer: data.content,
          question: {
            questionId: data.questions.question_id,
            category: data.questions.category,
            topic: data.questions.topic,
            question: data.questions.content,
          },
        });
      } catch (e) {
        console.error(e);
        setError('질문/답변을 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    })();
  }, [answerId]);

  // 피드백 데이터 가져오기
  const fetchFeedbackData = async () => {
    try {
      const feedback = await selectFeedbackData(
        data!.question.questionId,
        answerId!,
      );
      console.log('[다시보기 페이지] 피드백 데이터 : ', feedback);
      setFeedbackData(feedback);
    } catch (err) {
      console.error('피드백 조회 에러:', err);
    }
  };

  useEffect(() => {
    if (data?.question.questionId == null || answerId == null) return;
    fetchFeedbackData();
  }, [data, answerId]);

  if (loading) return <div className="py-20 text-center">로딩 중...</div>;
  if (error || !data)
    return (
      <div className="py-20 text-center text-red-600 font-semibold">
        {error ?? '데이터 없음'}
      </div>
    );

  return (
    <div className="px-6 space-y-6">
      {/* ← 돌아가기 */}
      <button
        className="flex items-center mb-2 text-sm font-semibold cursor-pointer mb-5"
        onClick={() => navigate(-1)}
      >
        <H2_content_title>← 돌아가기</H2_content_title>
      </button>

      {/* 질문 영역 */}
      <InterviewQuestion
        questionId={data.question.questionId}
        category={data.question.category}
        topic={data.question.topic}
        question={data.question.question}
        isBookmarked={isBookmarked}
        onToggleBookmark={toggleBookmark}
      />

      {/* 답변 영역 */}
      <AnswerInput
        question={data.question.question}
        questionId={data.question.questionId}
        initialAnswer={data.answer}
        isReviewMode={true}
        isFollowUpOpen={showFollowUp}
        onFollowUpToggle={() => setShowFollowUp((v) => !v)}
        onFeedback={() => {}}
        afterFeedbackSaved={fetchFeedbackData}
      />
      {/* 피드백 영역 */}
      <div className="p-5 rounded-xl text-gray-800 border border-gray-200 text-center bg-white">
        {feedbackData && <Feedback feedbackData={feedbackData} />}
      </div>
    </div>
  );
}
