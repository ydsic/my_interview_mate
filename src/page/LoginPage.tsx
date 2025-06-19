export default function LoginPage() {
  return (
    <div className="w-[1512px] h-[1656px] relative bg-gray-15 overflow-hidden">
      <div className="text-white">모의면접 플랫폼</div>
      <div className="left-[560px] top-[342px] absolute justify-start text-gray-100 text-3xl font-medium font-['Inter']">
        AI와 함께하는 스마트한 면접 준비
      </div>
      <div className="w-[866px] px-11 pt-11 pb-24 left-[347px] top-[445px] absolute bg-white rounded-[20px] shadow-[0px_0px_4.800000190734863px_4px_rgba(0,0,0,0.25)] inline-flex flex-col justify-center items-center gap-20">
        <div className="self-stretch text-center justify-start text-gray-100 text-4xl font-bold font-['Inter']">
          로그인
        </div>
        <div className="w-[767px] h-96 relative">
          <div className="w-20 left-0 top-0 absolute justify-start text-gray-100 text-3xl font-medium font-['Inter']">
            이메일
          </div>
          <div className="w-[767px] h-20 left-0 top-[54px] absolute rounded-[20px] border border-stone-300"></div>
          <div className="left-[40px] top-[76px] absolute justify-start text-gray-70 text-3xl font-medium font-['Inter']">
            이메일을 입력하세요
          </div>
          <div className="left-0 top-[185px] absolute justify-start text-gray-100 text-3xl font-medium font-['Inter']">
            비밀번호
          </div>
          <div className="w-[767px] h-20 left-0 top-[239px] absolute rounded-[20px] border border-stone-300"></div>
          <div className="left-[40px] top-[261px] absolute justify-start text-gray-70 text-3xl font-medium font-['Inter']">
            비밀번호를 입력하세요
          </div>
        </div>
        <div className="w-[767px] h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-[20px]"></div>
        <div className="justify-start text-white text-3xl font-bold font-['Inter']">
          로그인
        </div>
        <div className="justify-start">
          <span className="text-gray-100 text-3xl font-medium font-['Inter']">
            계정이 없으신가요? {' '}
          </span>
          <span className="text-blue-100 text-3xl font-bold font-['Inter']">
            회원가입
          </span>
        </div>
      </div>
    </div>
  );
}
