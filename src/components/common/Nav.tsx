import { Link, useNavigate } from 'react-router-dom';
import { useLoggedInStore, useUserDataStore } from '../../store/userData';
import logoutIcon from '../../assets/logout.svg';
import { supabase } from '../../supabaseClient';
import { useToast } from '../../hooks/useToast';

export default function Nav() {
  const isLoggedIn = useLoggedInStore((state) => state.isLoggedIn);
  const setIsLoggedIn = useLoggedInStore((state) => state.setIsLoggedIn);
  const navigate = useNavigate();
  const admin = useUserDataStore((state) => state.userData.admin);
  const clearUserData = useUserDataStore((state) => state.clearUserData);
  const toast = useToast();

  const handleLogout = async () => {
    await supabase.auth.signOut(); // 로그아웃 시 인증 토큰 삭제
    setIsLoggedIn(false);
    clearUserData();
    navigate('/');
    toast('로그아웃이 되었습니다!', 'success');
  };

  return (
    <div className="fixed top-0 w-full h-[7vh] flex justify-around items-center bg-white z-[10000] shadow-sm">
      <div className="w-full max-w-7xl mx-auto px-5 h-full flex justify-between items-center ">
        <Link to="/">
          <p className="text-xl font-bold">나만의 인터뷰 메이트</p>
        </Link>

        {isLoggedIn ? (
          <div className="flex gap-15 font-heavy">
            {admin && <Link to="/admin">관리자페이지</Link>}
            <Link to="/mypage">마이페이지</Link>
            <button onClick={handleLogout} className="cursor-pointer">
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
    </div>
  );
}
