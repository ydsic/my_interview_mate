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
  //const toast = useToast();
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

  // 질문 불러오기 get요청
  useEffect(() => {
    const fetchQuestion = async () => {
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
        console.log('불러온 질문 수:', data.length);
        console.log('data 내용:', data);
        if (!data.length) throw new Error('질문 없음');
        const random = Math.floor(Math.random() * data.length);
        const randomQuestion = data[random];

        setQuestion({
          category: rawCategory,
          question: randomQuestion.content,
        });
      } catch (e) {
        console.error(e);
        setQuestion({
          category: rawCategory,
          question: '질문을 불러오는 데 실패했습니다.',
        });
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
        <div>
          <InterviewQuestion
            category={question.category}
            topic={topicParam || ''}
            question={question.question}
            onToggleBookmark={() => {}}
          />
        </div>
        <div>
          <AnswerInput
            question={question.question}
            onFeedback={handleFeedback}
            disabled={showFeedback}
          />
        </div>
        <div>
          <FollowUpQuestion
            questions={['추가질문1.', '추가질문2.', '추가질문3.']}
          />
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
