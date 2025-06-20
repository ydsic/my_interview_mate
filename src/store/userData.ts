import { create } from 'zustand';

type dbUserDataType = {
  user_id: string;
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

export const useUserDataStore = create<UserDataStore>((set) => ({
  userData: {
    user_id: '',
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
        user_id: '',
        nickname: '',
        profile_img: '',
        job: '',
        goal: '',
      },
    }),
}));
