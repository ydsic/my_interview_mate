import { Link, useNavigate } from 'react-router-dom';
import { useLoggedInStore, useUserDataStore } from '../../store/userData';
import logoutIcon from '../../assets/logout.svg';
import { supabase } from '../../supabaseClient';
import { useToast } from '../../hooks/useToast';
import { useState, useRef, useEffect } from 'react';

export default function Nav() {
  const isLoggedIn = useLoggedInStore((state) => state.isLoggedIn);
  const setIsLoggedIn = useLoggedInStore((state) => state.setIsLoggedIn);
  const navigate = useNavigate();
  const admin = useUserDataStore((state) => state.userData.admin);
  const clearUserData = useUserDataStore((state) => state.clearUserData);
  const toast = useToast();

  // 로그아웃 더블 클릭 상태 관리
  const [logoutClickCount, setLogoutClickCount] = useState(0);
  const logoutTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (logoutTimeoutRef.current) {
        clearTimeout(logoutTimeoutRef.current);
      }
    };
  }, []);

  const handleLogout = async () => {
    if (logoutClickCount === 0) {
      // 첫 번째 클릭
      setLogoutClickCount(1);
      toast('로그아웃하려면 3초 내에 다시 한 번 클릭하세요.', 'info');

      // 3초 후 상태 초기화
      logoutTimeoutRef.current = setTimeout(() => {
        setLogoutClickCount(0);
        toast('로그아웃이 취소되었습니다.', 'info');
      }, 3000);
    } else if (logoutClickCount === 1) {
      // 두 번째 클릭 - 실제 로그아웃 실행
      if (logoutTimeoutRef.current) {
        clearTimeout(logoutTimeoutRef.current);
      }
      setLogoutClickCount(0);

      await supabase.auth.signOut(); // 로그아웃 시 인증 토큰 삭제
      setIsLoggedIn(false);
      clearUserData();
      navigate('/');
      toast('로그아웃이 되었습니다!', 'success');
    }
  };

  return (
    <div className="fixed top-0 w-full h-[7vh] flex justify-around items-center bg-white z-[10000] shadow-sm">
      <div className="w-full max-w-7xl mx-auto px-5 h-full flex justify-between items-center ">
        <Link to="/">
          <p className="text-xl font-bold">Aimigo</p>
        </Link>

        {isLoggedIn ? (
          <div className="flex gap-15 font-heavy">
            {admin && <Link to="/admin">관리자페이지</Link>}
            <Link to="/mypage">마이페이지</Link>
            <button
              onClick={handleLogout}
              className={`cursor-pointer p-1 rounded transition-colors border ${
                logoutClickCount === 1
                  ? 'bg-red-100 border-red-300'
                  : 'hover:bg-gray-50 border-transparent'
              }`}
              title={
                logoutClickCount === 1
                  ? '3초 내에 다시 클릭하여 로그아웃'
                  : '로그아웃'
              }
            >
              <img
                src={logoutIcon}
                alt="로그아웃 아이콘"
                className={`w-4 h-4 transition-transform ${
                  logoutClickCount === 1 ? 'scale-110' : ''
                }`}
              />
            </button>
          </div>
        ) : (
          <div className="flex gap-15 max-sm:gap-5 font-heavy">
            <Link to="/login">로그인</Link>
            <Link to="/signup">회원가입</Link>
          </div>
        )}
      </div>
    </div>
  );
}
