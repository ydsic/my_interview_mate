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

function toQuestionData(raw: any): QuestionData {
  return {
    questionId: raw.question_id,
    category: raw.category,
    topic: raw.topic,
    question: raw.content,
  };
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

  // 중복 제거 로직
  const noMoreRef = useRef(false);
  const mainUsedIdsRef = useRef<number[]>([]);
  const followUpUsedIdsRef = useRef<number[]>([]);

  const [followUpQuestions, setFollowUpQuestions] = useState<QuestionData[]>(
    [],
  );

  // 추가 질문하기 토글
  const [showFollowUp, setShowFollowUp] = useState(false);
  const toggleFollowUp = async () => {
    if (!showFollowUp && followUpQuestions.length === 0) {
      await fetchFollowUps();
    }
    setShowFollowUp((value) => !value);
  };
  // 추가 질문 useSate

  /*---- 즐겨찾기(bookmark) 등록 부분 ----*/

  // 유저 아이디 불러오기
  const user_id = useUserDataStore((state) => state.userData.user_id);
  const [isBookMarked, setIsBookMarked] = useState<boolean>(false);

  // 디바운스시, 버튼 비활성화
  const [nextDisabled, setNextDisabled] = useState(false);

  // 질문 불러오기 get요청

  const fetchMain = async () => {
    const [main] = await getQuestionsByCategoryAndTopic(
      rawCategory!,
      topicParam!,
      1,
      mainUsedIdsRef.current,
    );

    if (!main) {
      noMoreRef.current = true;
      toast('더 이상 질문이 없습니다.', 'info');
      return;
    }
    //console.log('가져온 질문:', main);

    setQuestion(toQuestionData(main));

    mainUsedIdsRef.current.push(main.question_id);

    if (!isFirstLoad.current) {
      toast('새로운 질문이 도착했어요!', 'success');
    } else {
      isFirstLoad.current = false;
    }
  };
  async function fetchFollowUps() {
    const data = await getQuestionsByCategoryAndTopic(
      rawCategory!,
      topicParam!,
      3,
      mainUsedIdsRef.current,
    );

    //console.log('추가질문:', data);

    const filtered = data.filter((q) => q.question_id !== question.questionId);

    if (filtered.length === 0) {
      toast('더 이상 추가 질문이 없습니다.', 'info');
      return;
    }

    setFollowUpQuestions(filtered.map(toQuestionData));

    followUpUsedIdsRef.current.push(...filtered.map((q) => q.question_id));
    toast('추가 질문을 불러왔어요!', 'success');
  }

  const handleFeedback = async (answerText: string, feedback: string) => {
    setAnswer(answerText);
    setFeedbackContent(feedback);
    setShowFeedback(true);
  };

  const handleNext = async () => {
    setShowFeedback(false);
    setAnswer('');
    setFeedbackContent('');
    setShowFollowUp(false);
    setFollowUpQuestions([]);
    if (noMoreRef.current) {
      toast('더 이상 질문이 없습니다.', 'info');
      return;
    }
    await fetchMain();
  };

  // 다음 질문 디바운싱
  const handleNextDebounced = useMemo(
    () =>
      debounce(() => {
        handleNext();
      }, 500),
    [question.questionId],
  );

  const onNextClick = () => {
    setNextDisabled(true);
    handleNextDebounced();
    setTimeout(() => setNextDisabled(false), 500);
  };

  // 추가 질문 디바운싱
  const debounceToggleFollowUp = useMemo(
    () => debounce(toggleFollowUp, 500),
    [showFollowUp, followUpQuestions.length],
  );

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

    //console.log('[북마크 질문 id] : ', questionId);

    setIsBookMarked(next);
    debounceBookMark(user_id, questionId, next, () => {
      setIsBookMarked(!next);
      toast('북마크 등록에 실패했습니다.', 'error');
    });
  };

  useEffect(() => {
    mainUsedIdsRef.current = [];
    setFollowUpQuestions([]);
    fetchMain();
  }, [rawCategory, topicParam]);

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
            onFollowUpToggle={debounceToggleFollowUp}
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
                setFollowUpQuestions([]);
                setShowFollowUp(false);
              }}
              onClose={() => setShowFollowUp(false)}
            />
          )}
        </div>
        <div className="flex justify-center items-center">
          <Button
            className={`w-55 h-15 mt-8 ${nextDisabled ? 'opacity-50' : ''}`}
            onClick={onNextClick}
            disabled={nextDisabled}
          >
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
