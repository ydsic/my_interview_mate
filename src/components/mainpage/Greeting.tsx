import { Link } from 'react-router-dom';
import Button from '../common/Button';
import { H1_big_title } from '../common/HTagStyle';

export default function Greeting() {
  return (
    <div className="absolute left-0 h-full w-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="text-center space-y-3">
        <H1_big_title>AI와 함께하는</H1_big_title>

        <h1 className="text-5xl font-bold bg-gradient-to-r text-blue-500 bg-clip-text">
          스마트한 면접 준비
        </h1>
        <p className="text-gray-85 font-semibold text-xl my-15">
          개인 맞춤형 질문 생성부터 실시간 피드백까지,
          <br />
          AI가 도와주는 체계적인 면접 준비로 꿈의 직장에 한 걸음 더
          가까워지세요.
        </p>

        <Link to="/login">
          <Button className="w-full">로그인</Button>
        </Link>
      </div>
    </div>
  );
}
