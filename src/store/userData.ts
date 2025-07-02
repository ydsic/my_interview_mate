import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type UserData = {
  user_id: string;
  nickname: string;
};

type UserDataStore = {
  userData: UserData;
  setUserData: (data: UserData) => void;
  clearUserData: () => void;
};

type LoggedInType = {
  isLoggedIn: boolean;
  setIsLoggedIn: (status: boolean) => void;
};

// user_id(email), nickname만 저장
export const useUserDataStore = create<UserDataStore>()(
  persist(
    (set) => ({
      userData: {
        user_id: '',
        nickname: '',
      },
      setUserData: (data) => set({ userData: data }),
      clearUserData: () =>
        set({
          userData: {
            user_id: '',
            nickname: '',
          },
        }),
    }),
    {
      name: 'user-storage',
    },
  ),
);

// 로그인 상태
export const useLoggedInStore = create<LoggedInType>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      setIsLoggedIn: (status) => set({ isLoggedIn: status }),
    }),
    {
      name: 'login-status',
    },
  ),
);
