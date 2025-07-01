import { loginUserInfo } from '../api/userInfo';
import { useUserDataStore, useLoggedInStore } from '../store/userData';

export async function setUserProfileByEmail(email: string) {
  const setUserData = useUserDataStore.getState().setUserData;
  const setIsLoggedIn = useLoggedInStore.getState().setIsLoggedIn;
  const { data: profile } = await loginUserInfo(email);
  setUserData({
    user_id: profile?.user_id ?? '',
    nickname: profile?.nickname ?? '',
    profile_img: profile?.profile_img ?? '',
    job: profile?.job ?? '',
    goal: profile?.goal ?? '',
    admin: profile?.admin ?? false,
  });
  setIsLoggedIn(true);
}
