import { useState, useEffect } from 'react';
import Button from '../components/common/Button';
import AnswerInput from '../components/interviewpage/AnswerInput';
import InterviewQuestion from '../components/interviewpage/InterviewQuestion';
import FeedbackCard from '../components/interviewpage/feedback/FeedbackCard';
import type { QuestionData } from '../types/interview';
//import { useToast } from '../hooks/useToast';

export default function InterviewPage() {
  // const toast = useToast();
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackContent, setFeedbackContent] = useState('');
  const [answer, setAnswer] = useState('');
  const [question, setQuestion] = useState<QuestionData>({
    category: 'git',
    question: 'React의 상태관리는 어떻게 하나요?',
  });

  /**
   * fetchQuestion
   * - 면접 질문 API 호출 로직
   * - 성공/ 실패시 예외처리 및 토스트 알림
   */

  // useEffect(() => {
  //   const fetchQuestion = async () => {
  //     try {
  //       const res = await fetch('/api/interview/question');
  //       if (!res.ok) throw new Error('Network response was not ok');
  //       const data: QuestionData = await res.json();
  //       setQuestion(data);
  //       toast('새 질문을 불러왔어요!', 'success');
  //     } catch (e) {
  //       console.error('질문 로드 실패:', e);
  //       setQuestion({
  //         category: 'git',
  //         question: '질문을 불러오는 데 실패했습니다.',
  //       });
  //       toast('질문을 불러오는 데 실패했어요.', 'error');
  //     }
  //   };

  //   fetchQuestion();
  // }, [toast]);

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
            question={question.question}
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
