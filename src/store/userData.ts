import { create } from 'zustand';
import {
  updateUserJob,
  updateUserGoal,
  updateUserImage,
} from '../api/userInfo';

type dbUserDataType = {
  user_id: string;
  nickname: string;
  profile_img: string;
  job: string;
  goal: string;
  admin: boolean;
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
    user_id: '',
    nickname: '',
    profile_img: '',
    job: '',
    goal: '',
    admin: false,
  },

  setUserData: async (dbUserData: dbUserDataType) => {
    set({ userData: { ...dbUserData } });
    // DB 동기화
    if (dbUserData.user_id) {
      if (dbUserData.job)
        await updateUserJob(dbUserData.user_id, dbUserData.job);
      if (dbUserData.goal)
        await updateUserGoal(dbUserData.user_id, dbUserData.goal);
      if (dbUserData.profile_img)
        await updateUserImage(dbUserData.user_id, dbUserData.profile_img);
      // 추가 업데이트 필요시 여기에
    }
  },

  clearUserData: () =>
    set({
      userData: {
        user_id: '',
        nickname: '',
        profile_img: '',
        job: '',
        goal: '',
        admin: false,
      },
    }),
}));

export const useLoggedInStore = create<LoggedInType>((set) => ({
  isLoggedIn: false,
  setIsLoggedIn: (status) => set({ isLoggedIn: status }),
}));
