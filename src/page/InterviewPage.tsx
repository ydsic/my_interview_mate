import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import Button from '../components/common/Button';
import AnswerInput from '../components/interviewpage/AnswerInput';
import InterviewQuestion from '../components/interviewpage/InterviewQuestion';
import FeedbackCard from '../components/interviewpage/feedback/FeedbackCard';
import FollowUpQuestion from '../components/interviewpage/FollowUpQuestion';
import type { QuestionData, CategoryKey } from '../types/interview';
import { getQuestionsByCategoryAndTopic } from '../api/questionAPI';

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
  const [question, setQuestion] = useState<QuestionData>({
    category: initialCategory,
    question: '질문을 불러오는 중입니다...',
  });
  // 추가 질문하기 토글
  const [showFollowUp, setShowFollowUp] = useState(false);
  const toggleFollowUp = () => setShowFollowUp((prev) => !prev);
  // 추가 질문 useSate
  const [followUpQuestions, setFollowUpQuestions] = useState<string[]>([]);

  // 추가 질문 랜덤 함수
  function getRandomItems<T>(array: T[], count: number): T[] {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  // 질문 불러오기 get요청
  useEffect(() => {
    const fetchQuestion = async () => {
      // API 요청 확인용
      console.log('rawCategory:', rawCategory);
      console.log('topicParam:', topicParam);

      if (!isCategoryKey(rawCategory) || !topicParam) {
        setQuestion({
          category: rawCategory as CategoryKey,
          question: '잘못된 접근입니다.',
        });
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
        const random = Math.floor(Math.random() * data.length);
        const randomQuestion = data[random];

        setQuestion({
          category: rawCategory,
          question: randomQuestion.content,
        });

        // 추가 질문 나머지 질문 목록에서 랜덤으로 3개 뽑기
        const otherQuestions = data
          .filter((_, i) => i !== random)
          .map((q) => q.content);

        setFollowUpQuestions(getRandomItems(otherQuestions, 3));
      } catch (e) {
        console.error(e);
        setQuestion({
          category: rawCategory,
          question: '질문을 불러오는 데 실패했습니다.',
        });
        setFollowUpQuestions([]);
      }
    };

    fetchQuestion();
  }, [rawCategory, topicParam]);

  const handleFeedback = async (answerText: string, feedback: string) => {
    setAnswer(answerText);
    setFeedbackContent(feedback);
    setShowFeedback(true);
  };

  const handleNext = () => {
    setShowFeedback(false);
    setAnswer('');
    setFeedbackContent('');
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
            topic={topicParam || ''}
            question={question.question}
            onToggleBookmark={() => {}}
          />
        </div>
        {/* 답변 컴포넌트 */}
        <div>
          <AnswerInput
            question={question.question}
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
                setQuestion({
                  category: question.category,
                  question: selected,
                });
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
