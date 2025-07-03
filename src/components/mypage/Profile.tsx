/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useUserDataStore } from '../../store/userData';
import Button from '../common/Button';
import defaultProfileImg from '../../assets/profile_default_img.png';
import {
  deleteImageFromStorage,
  updateUserProfile,
  uploadUserImageOnly,
} from '../../api/userInfo';
import { loginUserInfo } from '../../api/userInfo';
import { useToast } from '../../hooks/useToast';
import InputOrText from './InputOrText';

type UserData = {
  user_id: string;
  nickname: string;
  email: string;
  profile_img: string;
  job: string;
  goal: string;
};

type FormData = Omit<UserData, 'user_id' | 'email'>;

export default function Profile() {
  const toast = useToast();
  const user_id = useUserDataStore((state) => state.userData.user_id);

  // 받아오는 데이터는 userData
  // 보낼거는 formData
  const [userData, setUserData] = useState<UserData | null>(null);
  const [formData, setFormData] = useState<FormData>({
    nickname: '',
    job: '',
    goal: '',
    profile_img: '',
  });

  const [previewImg, setPreviewImg] = useState<string>(defaultProfileImg);
  const [isEditing, setIsEditing] = useState(false); // '수정하기' - 편집 상태 확인

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data, error } = await loginUserInfo(user_id);

        if (error) throw error;

        const user = data?.[0];

        if (user) {
          setUserData(user);
          setFormData({
            nickname: user.nickname,
            job: user.job,
            goal: user.goal,
            profile_img: user.profile_img,
          });

          setPreviewImg(user.profile_img || defaultProfileImg);
        }
      } catch (err: any) {
        console.log('유저 정보 불러오기 실패 : ', err);
        toast('유저 정보를 불러오는 데 실패 했습니다.', 'error');
      }
    };

    if (user_id) fetchUserData();
  }, [user_id, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userData) return;

    setPreviewImg(URL.createObjectURL(file));

    try {
      const publicUrl = await uploadUserImageOnly(file, userData.user_id);
      setFormData((prev) => ({
        ...prev,
        profile_img: publicUrl,
      }));
    } catch (err: any) {
      console.log('이미지 업로드 실패 : ', err);
    }
  };

  const resetForm = async () => {
    if (!userData) return;

    if (formData.profile_img && formData.profile_img !== userData.profile_img) {
      try {
        await deleteImageFromStorage(userData.user_id);
        console.log('임시 이미지 삭제 완료');
      } catch (err) {
        console.error('이미지 삭제 실패:', err);
      }
    }

    setFormData({
      nickname: userData.nickname,
      job: userData.job,
      goal: userData.goal,
      profile_img: userData.profile_img,
    });

    setPreviewImg(userData.profile_img || defaultProfileImg);
  };

  // 수정 모드
  const startEditing = () => {
    setIsEditing(true);
  };

  // 수정 모드 해제
  const endEditing = () => {
    resetForm();
    setIsEditing(false);
  };

  const saveChanges = async () => {
    if (!userData) return;

    try {
      await updateUserProfile(userData.user_id, formData);

      toast('프로필이 성공적으로 저장되었습니다.', 'success');

      setIsEditing(false);
    } catch (err: any) {
      console.log('프로필 저장 실패 : ', err);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    saveChanges();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-10 mb-5 bg-white p-[30px] rounded-4xl shadow-md relative"
    >
      <p className="font-semibold">프로필 정보</p>

      <div className="flex items-center gap-5.5 h-20 relative">
        <div className="relative">
          <img
            className="h-20 w-20 rounded-full object-cover"
            src={
              previewImg && previewImg !== '' ? previewImg : defaultProfileImg
            }
            alt="프로필 사진"
          />
          {isEditing && (
            <label className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-xs w-full text-center bg-white border text-gray-500 rounded-full shadow-sm cursor-pointer">
              사진 변경
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          )}
        </div>

        <div className="flex flex-col grow-1 justify-between h-full py-0.5">
          <InputOrText
            isEditing={isEditing}
            name="nickname"
            value={formData.nickname}
            placeholder={userData?.nickname || ''}
            maxLength={15}
            onChange={handleInputChange}
          />
          <p className="text-sm text-gray-70">{userData?.user_id}</p>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <div className="flex w-full gap-8 px-2 items-center">
          <p className="flex-shrink-0"> 희망 직무</p>
          <InputOrText
            isEditing={isEditing}
            name="job"
            value={formData.job}
            placeholder={userData?.job || '희망 직무를 작성해보세요.'}
            maxLength={20}
            onChange={handleInputChange}
          />
        </div>

        <div className="flex w-full gap-8 px-2 items-center">
          <p className="flex-shrink-0"> 면접 목표</p>
          <InputOrText
            isEditing={isEditing}
            name="goal"
            value={formData?.goal}
            placeholder={userData?.goal || '희망 목표를 작성해보세요.'}
            maxLength={50}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="flex justify-end mt-auto gap-5">
        {isEditing ? (
          <>
            <button
              className="px-10 py-3 bg-gray-25 text-gray-70 font-semibold rounded-xl cursor-pointer hover:bg-gray-40"
              onClick={endEditing}
            >
              되돌리기
            </button>
            <Button type="submit"> 저장하기</Button>
          </>
        ) : (
          <>
            <Button onClick={startEditing}> 프로필 수정 </Button>
          </>
        )}
      </div>
    </form>
  );
}
