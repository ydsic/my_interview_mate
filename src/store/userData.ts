import { create } from 'zustand';
import {
  updateUserJob,
  updateUserGoal,
  updateUserImage,
} from '../api/userInfo';

type ProblemResult = {
  question: string;
  input: string;
  scores: number[];
  average: number;
  feedback: string[];
  summary: string;
  answer: string;
};

type ProblemItem = {
  id: number;
  category: string;
  problemData: ProblemResult[];
};

type dbUserDataType = {
  email: string;
  nickname: string;
  profile_img: string;
  job: string;
  goal: string;
  history: ProblemItem[];
  bookmark: ProblemItem[];
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
    history: [],
    bookmark: [],
  },

  setUserData: async (dbUserData: dbUserDataType) => {
    set({ userData: { ...dbUserData } });
    // DB 동기화
    if (dbUserData.email) {
      if (dbUserData.job) await updateUserJob(dbUserData.email, dbUserData.job);
      if (dbUserData.goal)
        await updateUserGoal(dbUserData.email, dbUserData.goal);
      if (dbUserData.profile_img)
        await updateUserImage(dbUserData.email, dbUserData.profile_img);
      // 추가 업데이트 필요시 여기에
    }
  },

  clearUserData: () =>
    set({
      userData: {
        email: '',
        nickname: '',
        profile_img: '',
        job: '',
        goal: '',
        history: [],
        bookmark: [],
      },
    }),
}));

export const useLoggedInStore = create<LoggedInType>((set) => ({
  isLoggedIn: false,
  setIsLoggedIn: (status) => set({ isLoggedIn: status }),
}));
