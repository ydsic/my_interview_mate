import LiquidGlass from 'liquid-glass-react';
import bg from '../../assets/login_bg.mp4';
import { useRef } from 'react';

type Props = {
  setFirstLandingPage: (show: boolean) => void;
};

export default function FirstLandingPage({ setFirstLandingPage }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  const dontSeeAgain = () => {
    localStorage.setItem('firstLandingPage', JSON.stringify(false));
    setFirstLandingPage(false);
  };

  return (
    <div
      ref={containerRef}
      className="absolute inset-0
      flex items-center justify-center
      overflow-x-hidden max-sm:overflow-y-auto
      max-sm:py-20
      min-h-[120vh]"
    >
      <video
        autoPlay
        muted
        loop
        className="absolute inset-0 w-full min-h-[120vh] object-cover"
      >
        <source src={bg} type="video/mp4" />
      </video>

      <LiquidGlass
        displacementScale={100}
        blurAmount={0}
        overLight={true}
        elasticity={0}
        cornerRadius={52}
        padding="130px 60px"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
        className="      
          mx-auto 
          max-sm:py-1                     
          max-sm:w-[90vw] 
        "
      >
        {/* 카드 내용 */}
        <div className="flex flex-col items-center text-center space-y-8 max-sm:space-y-6">
          <div className="flex items-center gap-2">
            <h2 className="text-4xl font-semibold text-blue-200 max-sm:text-3xl">
              AI
            </h2>
            <h2 className="text-3xl font-semibold text-white max-lg:text-xl max-sm:text-xl">
              와 함께하는
            </h2>
          </div>

          <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-blue-200 text-transparent bg-clip-text max-lg:text-3xl max-sm:text-3xl">
            스마트한 면접 준비
          </h1>

          <p className="font-semibold text-xl leading-relaxed max-lg:text-base max-sm:text-base">
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
              className="cursor-pointer text-white px-10 py-5 rounded-xl font-semibold transition-all duration-300 hover:bg-white/20"
            >
              바로가기
            </button>
          </LiquidGlass>
        </div>
      </LiquidGlass>
    </div>
  );
}
