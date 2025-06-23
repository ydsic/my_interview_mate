import Button from '../components/common/Button';
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
      <div className="border">면접 답변 컴포넌트가 들어갈 예정</div>
      <div>
        <Button className="w-55 h-15">다음 질문</Button>
      </div>
    </div>
  );
}
