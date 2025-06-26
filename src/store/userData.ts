import { create } from 'zustand';

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
        history: [],
        bookmark: [],
      },
    }),
}));

export const useLoggedInStore = create<LoggedInType>((set) => ({
  isLoggedIn: false,
  setIsLoggedIn: (status) => set({ isLoggedIn: status }),
}));
