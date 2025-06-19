import LiquidGlass from 'liquid-glass-react';
import bg from '../assets/login_bg.mp4';
import { useRef } from 'react';

export default function FirstLandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  const dontSeeAgain = () => {
    localStorage.setItem('firstLandingPage', JSON.stringify(false));
  };

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center"
    >
      <video
        autoPlay
        muted
        loop
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={bg} type="video/mp4" />
      </video>

      <LiquidGlass
        displacementScale={100}
        blurAmount={0}
        overLight={true}
        elasticity={0}
        cornerRadius={52}
        padding="100px 70px"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
        }}
      >
        <div className="relative flex flex-col items-center text-center space-y-8 px-6">
          <div className="flex items-center">
            <h2 className="text-4xl font-semibold text-blue-300">AI</h2>
            <h2 className="text-3xl font-semibold text-blue-100">
              와 함께하는
            </h2>
          </div>

          <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-blue-200 text-transparent bg-clip-text">
            스마트한 면접 준비
          </h1>
          <p className="text-gray-100 font-semibold text-xl leading-relaxed">
            개인 맞춤형 질문 생성부터 실시간 피드백까지,
            <br />
            AI가 도와주는 체계적인 면접 준비로 꿈의 직장에 한 걸음 더
            가까워지세요.
          </p>

          <LiquidGlass
            displacementScale={64}
            blurAmount={0.1}
            saturation={130}
            mouseContainer={containerRef}
            overLight={true}
            elasticity={0.3}
            cornerRadius={100}
            padding="0"
            style={{
              position: 'fixed',
              top: '85%',
              left: '50%',
            }}
          >
            <button
              onClick={dontSeeAgain}
              className="text-white px-10 py-5 rounded-xl font-semibold transition-all duration-300 hover:bg-white/20"
            >
              바로가기
            </button>
          </LiquidGlass>
        </div>
      </LiquidGlass>
    </div>
  );
}
