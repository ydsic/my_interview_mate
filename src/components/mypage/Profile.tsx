import { useEffect, useState } from 'react';
import { useUserDataStore } from '../../store/userData';
import Button from '../common/Button';
import defaultProfileImg from '../../assets/profile_default_img.png';
import { uploadAndSetUserImage } from '../../api/userInfo';
import { supabase } from '../../supabaseClient';
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
  const userData = useUserDataStore((state) => state.userData); // 사용자 정보 불러오기
  const setUserData = useUserDataStore((state) => state.setUserData);

  const [formData, setFormData] = useState<FormData>({
    nickname: '',
    job: '',
    goal: '',
    profile_img: defaultProfileImg,
  });

  const profileImg = userData.profile_img || defaultProfileImg;
  const [previewImg, setPreviewImg] = useState<string>(profileImg);

  const [isEditing, setIsEditing] = useState(false); // '수정하기' - 편집 상태 확인

  useEffect(() => {
    setFormData({
      nickname: userData.nickname,
      job: userData.job,
      goal: userData.goal,
      profile_img: profileImg,
    });

    setPreviewImg(profileImg);
  }, [userData, profileImg]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreviewImg(URL.createObjectURL(file));
    console.log(await supabase.auth.getUser());
    try {
      const publicUrl = await uploadAndSetUserImage(file, userData.email);
      setFormData((prev) => ({ ...prev, profile_img: publicUrl }));
    } catch (err) {
      console.log(err);
      alert('프로필 이미지 업로드 실패');
    }
  };

  const resetForm = () => {
    setFormData({
      nickname: userData.nickname,
      job: userData.job,
      goal: userData.goal,
      profile_img: profileImg,
    });
    setPreviewImg(profileImg);
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
    console.log('저장된 FormData : ', formData);
    await setUserData({
      ...userData,
      ...formData,
    });
    const { data, error } = await loginUserInfo(userData.email);

    if (data) {
      setUserData(data);
      toast('프로필 수정을 완료했어요!', 'success');
    }
    setIsEditing(false);
    /*** API 코드 추가하기 ***/
    if (error) {
      console.log(error);
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
            placeholder={userData.nickname}
            maxLength={15}
            onChange={handleInputChange}
          />
          <p className="text-sm text-gray-70">{userData.email}</p>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <div className="flex w-full gap-8 px-2 items-center">
          <p className="flex-shrink-0"> 희망 직무</p>
          <InputOrText
            isEditing={isEditing}
            name="job"
            value={formData.job}
            placeholder={userData.job}
            maxLength={20}
            onChange={handleInputChange}
          />
        </div>

        <div className="flex w-full gap-8 px-2 items-center">
          <p className="flex-shrink-0"> 면접 목표</p>
          <InputOrText
            isEditing={isEditing}
            name="goal"
            value={formData.goal}
            placeholder={userData.goal}
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
            <Button onClick={saveChanges}> 저장하기</Button>
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
