import { Link } from 'react-router-dom';
import Button from '../common/Button';
import { H1_big_title } from '../common/HTagStyle';
import { MainBannerAd } from '../common/AdLayouts';

export default function Greeting() {
  return (
    <div
      className="fixed inset-0
     min-h-screen overflow-hidden
    flex items-center justify-center 
    bg-gradient-to-br from-blue-50 to-purple-50"
    >
      <div
        className="flex flex-col items-center text-center space-y-3
      -translate-y-[5vh]"
      >
        <H1_big_title>AI와 함께하는</H1_big_title>

        <h1
          className="text-5xl font-bold bg-gradient-to-r text-blue-500 bg-clip-text
        max-sm:text-4xl"
        >
          스마트한 면접 준비
        </h1>
        <p
          className="text-gray-85 font-semibold text-xl my-15
        max-sm:text-base max-sm:my-10 max-sm:px-11"
        >
          개인 맞춤형 질문 생성부터 실시간 피드백까지,
          <br />
          AI가 도와주는 체계적인 면접 준비로 꿈의 직장에 한 걸음 더
          가까워지세요.
        </p>
        <div className="w-full max-lg:w-96 max-sm:w-52">
          <Link to="/login">
            <Button className="w-full">로그인</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
