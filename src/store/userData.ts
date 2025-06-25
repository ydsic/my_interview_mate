import { create } from 'zustand';

type dbUserDataType = {
  email: string;
  nickname: string;
  profile_img: string;
  job: string;
  goal: string;
};

type UserDataStore = {
  userData: dbUserDataType;
  setUserData: (data: dbUserDataType) => void;
  clearUserData: () => void;
};

type LoggedInType = {
  isLoggedIn: boolean;
  setIsLoggedIn: (status: boolean) => void;
};

export const useUserDataStore = create<UserDataStore>((set) => ({
  userData: {
    email: '',
    nickname: '',
    profile_img: '',
    job: '',
    goal: '',
  },

  setUserData: (dbUserData: dbUserDataType) =>
    set({ userData: { ...dbUserData } }),

  clearUserData: () =>
    set({
      userData: {
        email: '',
        nickname: '',
        profile_img: '',
        job: '',
        goal: '',
      },
    }),
}));

export const useLoggedInStore = create<LoggedInType>((set) => ({
  isLoggedIn: false,
  setIsLoggedIn: (status) => set({ isLoggedIn: status }),
}));
