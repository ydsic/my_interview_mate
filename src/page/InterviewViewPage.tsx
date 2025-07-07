import { useNavigate } from 'react-router-dom';
import { H2_content_title } from '../components/common/HTagStyle';
import Feedback from '../components/interviewViewpage/Feedback';

export default function InterviewViewPage() {
  const navigate = useNavigate();

  return (
    <div className="py-10 px-6 space-y-6">
      {/* ← 돌아가기 */}
      <button
        className="flex items-center mb-2 text-sm font-semibold cursor-pointer"
        onClick={() => navigate(-1)}
      >
        <H2_content_title>← 돌아가기</H2_content_title>
      </button>

      {/* 질문 영역 */}
      <div className="p-5 rounded-xl border text-center">질문</div>

      {/* 답변 영역 */}
      <div className="p-5 rounded-xl border text-center">답변</div>

      {/* 피드백 영역 */}
      <div className="p-5 rounded-xl text-gray-800 border border-gray-200 text-center bg-white">
        <Feedback />
      </div>
    </div>
  );
}
