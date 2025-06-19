import { H1_big_title } from '../common/HTagStyle';

export default function Greeting() {
  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <div className="relative flex flex-col items-center text-center space-y-8 px-6">
        <H1_big_title>AI와 함께하는</H1_big_title>

        <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-blue-200 text-transparent bg-clip-text">
          스마트한 면접 준비
        </h1>
        <p className="text-gray-100 font-semibold text-xl leading-relaxed">
          개인 맞춤형 질문 생성부터 실시간 피드백까지,
          <br />
          AI가 도와주는 체계적인 면접 준비로 꿈의 직장에 한 걸음 더
          가까워지세요.
        </p>

        <button className="text-white px-10 py-5 rounded-xl font-semibold transition-all duration-300 hover:bg-white/20">
          바로가기
        </button>
      </div>
    </div>
  );
}
