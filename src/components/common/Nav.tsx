import { Link } from 'react-router-dom';

export default function Nav() {
  return (
    <div className="w-full h-[7vh] border-b-2 border-black flex justify-around items-center shadow-2xl">
      <p className="font-semibold">나만의 인터뷰 메이트</p>
      <div className="flex gap-15 font-heavy">
        <Link to="/login">로그인</Link>
        <p>회원가입</p>
      </div>
    </div>
  );
}
