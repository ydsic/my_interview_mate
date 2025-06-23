import { Link } from 'react-router-dom';

export default function Nav() {
  return (
    <div className="w-full h-[7vh] shadow-[0px_1px_4px_1px_rgba(0,0,0,0.10)] flex justify-around items-center">
      <p className="font-semibold">나만의 인터뷰 메이트</p>
      <div className="flex gap-15 font-heavy">
        <Link to="/login">로그인</Link>
        <Link to="/signup">회원가입</Link>
      </div>
    </div>
  );
}
