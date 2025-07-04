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
import { deleteBookMark, insertBookMark } from '../api/bookMarkAPI';

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

  // 추가 질문 랜덤 함수
  function getRandomItems<T>(array: T[], count: number): T[] {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  // 질문 불러오기 get요청
  const fetchQuestion = useCallback(async () => {
    // API 요청 확인용
    console.log('rawCategory:', rawCategory, 'topicParam:', topicParam);

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
        rawCategory,
        topicParam,
      );
      // API 요청 확인용
      console.log('불러온 질문 수:', data.length);
      console.log('data 내용:', data);

      if (!data.length) throw new Error('질문 없음');

      const idx = Math.floor(Math.random() * data.length);
      const pick = data[idx];

      setQuestion({
        questionId: pick.question_id,
        category: rawCategory as CategoryKey,
        topic: pick.topic,
        question: pick.content,
      });

      // 추가 질문 나머지 질문 목록에서 랜덤으로 3개 뽑기
      const otherQuestion = data
        .filter((_, i) => i !== idx)
        .map((q) => ({
          questionId: q.question_id,
          category: rawCategory as CategoryKey,
          topic: q.topic,
          question: q.content,
        }));

      setFollowUpQuestions(getRandomItems(otherQuestion, 3));

      if (isFirstLoad.current) {
        isFirstLoad.current = false;
      } else {
        toast('새로운 질문이 도착했어요!', 'success');
      }
    } catch (e) {
      console.error(e);
      setQuestion({
        questionId: 0,
        category: rawCategory as CategoryKey,
        topic: topicParam || '',
        question: '질문을 불러오는 데 실패했습니다.',
      });
      setFollowUpQuestions([]);
      toast('질문 로딩에 실패했어요...', 'error');
    }
  }, [rawCategory, topicParam, toast]);

  const debouncedFetch = useMemo(
    () => debounce(fetchQuestion, 1000, { leading: true, trailing: false }),
    [fetchQuestion],
  );

  useEffect(() => {
    return () => {
      debouncedFetch.cancel();
    };
  }, [debouncedFetch]);

  useEffect(() => {
    fetchQuestion();
  }, [fetchQuestion]);

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

  // 질문이 바뀌면 즐겨찾기도 바꾸기!
  useEffect(() => {
    setIsBookMarked(false);
  }, [question]);

  // 즐겨찾기 디바운싱
  const deebounceBookMark = useMemo(
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
              toast('북마크 등록 완료!', 'success');
            } else {
              await deleteBookMark(userId, questionId);
              toast('북마크 삭제 완료!', 'success');
            }
          } catch (err: any) {
            console.error('[북마크 처리 중 에러] : ', err);
            onError();
          }
        },
        500,
      ),
    [],
  );

  // 즐겨찾기 등록 토글
  const handleBookMark = () => {
    const next = !isBookMarked;
    const questionId = question.questionId;

    console.log('[북마크 질문 id] : ', questionId);

    setIsBookMarked(next);
    deebounceBookMark(user_id, questionId, next, () => {
      setIsBookMarked(!next);
      toast('북마크 등록에 실패했습니다.', 'error');
    });
  };

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
            category={question.category}
            topic={question.topic}
            question={question.question}
            isBookmarked={isBookMarked}
            onToggleBookmark={handleBookMark}
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
