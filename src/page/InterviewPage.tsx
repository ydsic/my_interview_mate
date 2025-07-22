import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import Button from '../components/common/Button';
import AnswerInput from '../components/interviewpage/AnswerInput';
import InterviewQuestion from '../components/interviewpage/InterviewQuestion';
import FeedbackCard from '../components/interviewpage/feedback/FeedbackCard';
import FollowUpQuestion from '../components/interviewpage/FollowUpQuestion';
import type { QuestionData, CategoryKey } from '../types/interview';
import { getQuestionsByCategoryAndTopic } from '../api/questionAPI';
import { useToast } from '../hooks/useToast';
import debounce from 'lodash.debounce';
import { useUserDataStore } from '../store/userData';
import {
  deleteBookMark,
  insertBookMark,
  Bookmarked as checkBookmarked,
} from '../api/bookMarkAPI';

function isCategoryKey(value: unknown): value is CategoryKey {
  return (
    typeof value === 'string' && ['front-end', 'cs', 'git'].includes(value)
  );
}

export default function InterviewPage() {
  const { category: rawCategory } = useParams<{ category: string }>();
  const [searchParams] = useSearchParams();
  const topicParam = searchParams.get('topic');
  const initialCategory: CategoryKey = isCategoryKey(rawCategory)
    ? rawCategory
    : 'front-end';

  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackContent, setFeedbackContent] = useState('');
  const [answer, setAnswer] = useState('');
  const toast = useToast();
  const isFirstLoad = useRef(true);
  const [question, setQuestion] = useState<QuestionData>({
    questionId: 0,
    category: initialCategory,
    topic: topicParam || '',
    question: '질문을 불러오는 중입니다...',
  });

  // 중복 질문 방지, 사용된 질문 id 저장
  const [usedQuestionIds, setUsedQuestionIds] = useState<number[]>([]);
  const [readyToFetch, setReadyToFetch] = useState(false);

  // 추가 질문하기 토글
  const [showFollowUp, setShowFollowUp] = useState(false);
  const toggleFollowUp = () => setShowFollowUp((prev) => !prev);
  // 추가 질문 useSate
  const [followUpQuestions, setFollowUpQuestions] = useState<QuestionData[]>(
    [],
  );

  /* 즐겨찾기(bookmark) 등록 부분 */

  // 유저 아이디 불러오기
  const user_id = useUserDataStore((state) => state.userData.user_id);
  const [isBookMarked, setIsBookMarked] = useState<boolean>(false);

  // 질문 불러오기 get요청
  const fetchQuestion = useCallback(async () => {
    // 유효성 체크
    if (!isCategoryKey(rawCategory) || !topicParam) {
      setQuestion({
        questionId: 0,
        category: rawCategory as CategoryKey,
        topic: topicParam || '',
        question: '잘못된 접근입니다.',
      });
      setFollowUpQuestions([]);
      return;
    }
    try {
      const data = await getQuestionsByCategoryAndTopic(
        rawCategory!,
        topicParam!,
        4,
      );

      const newQuestions = data.filter(
        (q) => !usedQuestionIds.includes(q.question_id),
      );
      // API 요청 확인용
      console.log('rawCategory:', rawCategory, 'topicParam:', topicParam);
      console.log('불러온 질문 수:', data.length);
      console.log('data 내용:', data);

      if (newQuestions.length === 0) {
        toast('해당 카테고리의 질문을 모두 사용했습니다.', 'info');
        return;
      } else if (!data.length) throw new Error('질문 없음');

      const [main, ...others] = newQuestions;

      // 메인 질문 세팅
      setQuestion({
        questionId: main.question_id,
        category: main.category as CategoryKey,
        topic: main.topic,
        question: main.content,
      });

      // 추가 질문 세팅
      setFollowUpQuestions(
        others.map((q) => ({
          questionId: q.question_id,
          category: q.category as CategoryKey,
          topic: q.topic,
          question: q.content,
        })),
      );

      setUsedQuestionIds((prev) => [
        ...prev,
        main.question_id,
        ...others.map((q) => q.question_id),
      ]);

      // 토스트 메시지
      if (isFirstLoad.current) isFirstLoad.current = false;
      else toast('새로운 질문이 도착했어요!', 'success');
    } catch (e) {
      console.error(e);
      setQuestion({
        questionId: 0,
        category: rawCategory as CategoryKey,
        topic: topicParam,
        question: '질문을 불러오는 데 실패했습니다.',
      });
      setFollowUpQuestions([]);
      toast('질문 로딩에 실패했어요...', 'error');
    }
  }, [rawCategory, topicParam, toast, usedQuestionIds]);

  const debouncedFetch = useMemo(
    () => debounce(fetchQuestion, 1000, { leading: true, trailing: false }),
    [fetchQuestion],
  );

  useEffect(() => {
    return () => {
      debouncedFetch.cancel();
    };
  }, [debouncedFetch]);

  const handleFeedback = async (answerText: string, feedback: string) => {
    setAnswer(answerText);
    setFeedbackContent(feedback);
    setShowFeedback(true);
  };

  const handleNext = () => {
    setShowFeedback(false);
    setAnswer('');
    setFeedbackContent('');
    setShowFollowUp(false);
    debouncedFetch();
  };

  useEffect(() => {
    if (!user_id || !question.questionId) {
      setIsBookMarked(false);
      return;
    }

    (async () => {
      try {
        const bookmarked = await checkBookmarked(user_id, question.questionId);
        setIsBookMarked(bookmarked);
      } catch (err) {
        console.error(err);
        toast('북마크 여부를 확인하지 못했어요.', 'error');
      }
    })();
  }, [user_id, question.questionId, toast]);

  // 즐겨찾기 디바운싱
  const debounceBookMark = useMemo(
    () =>
      debounce(
        async (
          userId: string,
          questionId: number,
          nextBookmarked: boolean,
          onError: () => void,
        ) => {
          try {
            if (nextBookmarked) {
              await insertBookMark(userId, questionId);
              toast('즐겨찾기 등록 완료!', 'success');
            } else {
              await deleteBookMark(userId, questionId);
              toast('즐겨찾기 삭제 완료!', 'success');
            }
          } catch (err: any) {
            console.error('북마크 처리 중 에러 : ', err);
            onError();
          }
        },
        500,
      ),
    [],
  );

  // 즐겨찾기 등록 토글
  const handleBookMark = () => {
    if (!showFeedback) {
      toast('질문에 대한 답변을 제출해 주세요.', 'info');
      return;
    }
    const next = !isBookMarked;
    const questionId = question.questionId;

    console.log('[북마크 질문 id] : ', questionId);

    setIsBookMarked(next);
    debounceBookMark(user_id, questionId, next, () => {
      setIsBookMarked(!next);
      toast('북마크 등록에 실패했습니다.', 'error');
    });
  };

  useEffect(() => {
    setUsedQuestionIds([]);
    setReadyToFetch(true);
  }, [rawCategory, topicParam]);

  // 중복 질문 상태 초기화
  useEffect(() => {
    if (readyToFetch) {
      fetchQuestion();
      setReadyToFetch(false);
    }
  }, [readyToFetch, fetchQuestion]);

  return (
    <div className="h-full flex flex-row justify-center items-start gap-6 w-full px-8">
      <div
        className={`flex-1 transition-all duration-500 ${
          showFeedback ? 'w-1/2' : 'w-full'
        }`}
      >
        {/* 인터뷰 질문 컴포넌트 */}
        <div>
          <InterviewQuestion
            questionId={question.questionId}
            category={question.category}
            topic={question.topic}
            question={question.question}
            isBookmarked={isBookMarked}
            onToggleBookmark={handleBookMark}
            canBookmark={showFeedback}
          />
        </div>
        {/* 답변 컴포넌트 */}
        <div>
          <AnswerInput
            question={question.question}
            questionId={question.questionId}
            onFeedback={handleFeedback}
            disabled={showFeedback}
            isFollowUpOpen={showFollowUp}
            onFollowUpToggle={toggleFollowUp}
          />
        </div>

        {/* 추가 질문 컴포넌트 */}
        <div
          className={`
            transition-all duration-500 ease-in-out
            ${showFollowUp ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}
          `}
        >
          {showFollowUp && (
            <FollowUpQuestion
              questions={followUpQuestions}
              onSelect={(selected) => {
                setQuestion(selected);
                setAnswer('');
                setFeedbackContent('');
                setShowFeedback(false);
                setShowFollowUp(false);
              }}
              onClose={() => setShowFollowUp(false)}
            />
          )}
        </div>
        <div className="flex justify-center items-center">
          <Button className="w-55 h-15 mt-8" onClick={handleNext}>
            다음 질문
          </Button>
        </div>
      </div>

      <div
        className={`flex-1 flex justify-center items-start transition-all duration-700 ${
          showFeedback
            ? 'opacity-100 translate-x-0'
            : 'opacity-0 translate-x-10 pointer-events-none'
        } animate-fade-in`}
        style={{
          minWidth: showFeedback ? 0 : '0',
          maxWidth: showFeedback ? '50%' : '0',
          transition: 'all 1s cubic-bezier(.4,0,.2,1)',
        }}
      >
        {showFeedback && (
          <FeedbackCard feedback={feedbackContent} answer={answer} />
        )}
      </div>
    </div>
  );
}
