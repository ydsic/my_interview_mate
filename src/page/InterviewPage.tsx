import Button from '../components/common/Button';
import AnswerInput from '../components/interviewpage/AnswerInput';
import InterviewQuestion from '../components/interviewpage/InterviewQuestion';

export default function InterviewPage() {
  return (
    <div className="h-full flex flex-col justify-around text-center ">
      <div>
        <InterviewQuestion
          category="react"
          question="React의 상태관리는 어떻게 하나요?"
        />
      </div>
      <div>
        <AnswerInput />
      </div>
      <div>
        <Button className="w-55 h-15">다음 질문</Button>
      </div>
    </div>
  );
}
