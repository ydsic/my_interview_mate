import { useState } from 'react';
import Button from '../components/common/Button';
import AnswerInput from '../components/interviewpage/AnswerInput';
import InterviewQuestion from '../components/interviewpage/InterviewQuestion';
import FeedbackCard from '../components/interviewpage/feedback/FeedbackCard';

export default function InterviewPage() {
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackContent, setFeedbackContent] = useState('');
  const [answer, setAnswer] = useState('');
  const [question, setQuestion] = useState({
    category: 'react',
    question: 'React의 상태관리는 어떻게 하나요?',
  });

  // AnswerInput에서 답변과 피드백 요청을 받아옴
  const handleFeedback = async (answerText: string, feedback: string) => {
    setAnswer(answerText);
    setFeedbackContent(feedback);
    setShowFeedback(true);
  };

  // 다음 질문 버튼 클릭 시 피드백 카드 사라짐
  const handleNext = () => {
    setShowFeedback(false);
    setAnswer('');
    setFeedbackContent('');
    // 실제로는 다음 질문으로 question 상태를 변경해야 함
  };

  return (
    <div className="h-full flex flex-row justify-center items-start gap-6 w-full px-8">
      {/* 왼쪽: 질문/답변 */}
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
      {/* 오른쪽: 피드백 카드 */}
      <div
        className={`flex-1 flex justify-center items-start transition-all duration-700 ${
          showFeedback
            ? 'opacity-100 translate-x-0'
            : 'opacity-0 translate-x-10 pointer-events-none'
        } animate-fade-in`}
        style={{
          minWidth: showFeedback ? 0 : '0',
          maxWidth: showFeedback ? '50%' : '0',
          transition: 'all 0.7s cubic-bezier(.4,0,.2,1)',
        }}
      >
        {showFeedback && (
          <FeedbackCard feedback={feedbackContent} answer={answer} />
        )}
      </div>
      <style>{`
        .animate-fade-in {
          transition: opacity 0.7s cubic-bezier(.4,0,.2,1), transform 0.7s cubic-bezier(.4,0,.2,1);
        }
      `}</style>
    </div>
  );
}
