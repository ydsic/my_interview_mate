import './App.css';
import Button from './components/common/Button';
import Nav from './components/page/Nav';

function App() {
  return (
    <>
      <Nav />

      <div className="flex items-center justify-center min-h-screen bg-[#f5f7fa]">
        <div className="text-center space-y-5">
          <h2 className="text-3xl font-semibold text-gray-800">
            AI와 함께하는
          </h2>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
            스마트한 면접 준비
          </h1>
          <p className="text-gray-600 text-xl leading-relaxed">
            개인 맞춤형 질문 생성부터 실시간 피드백까지,
            <br />
            AI가 도와주는 체계적인 면접 준비로 꿈의 직장에 한 걸음 더
            가까워지세요.
          </p>
          <Button className="w-xl t-4 px-10 py-3 text-white font-semibold rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90 transition">
            로그인
          </Button>
        </div>
      </div>
    </>
  );
}

export default App;
