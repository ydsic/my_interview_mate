import { Link } from 'react-router-dom';
import { useLoggedInStore } from '../../store/userData';
import logoutIcon from '../../assets/logout.svg';

export default function Nav() {
  const isLoggedIn = useLoggedInStore((state) => state.isLoggedIn);
  const setIsLoggedIn = useLoggedInStore((state) => state.setIsLoggedIn);

  return (
    <div className="w-full h-[7vh] shadow-[0px_1px_4px_1px_rgba(0,0,0,0.10)] flex justify-around items-center">
      <Link to="/">
        <p className="text-xl font-bold">나만의 인터뷰 메이트</p>
      </Link>

      {isLoggedIn ? (
        <div className="flex gap-15 font-heavy">
          <Link to="/mypage">마이페이지</Link>
          <button
            onClick={() => setIsLoggedIn(false)}
            className="cursor-pointer"
          >
            <img src={logoutIcon} alt="로그아웃 아이콘" className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="flex gap-15 font-heavy">
          <Link to="/login">로그인</Link>
          <Link to="/signup">회원가입</Link>
        </div>
      )}
    </div>
  );
}
