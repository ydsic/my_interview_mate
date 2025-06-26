import { useEffect, useState } from 'react';
import { useUserDataStore } from '../../store/userData';
import Button from '../common/Button';
import { H2_content_title } from '../common/HTagStyle';
//import defaultProfileImg from '../assets/profile_default_img.png';

type UserData = {
  user_id: string;
  nickname: string;
  email: string;
  profile_img: string;
  job: string;
  goal: string;
};

type FormData = Omit<UserData, 'user_id' | 'email'>;

export default function Profile(): React.JSX.Element {
  const userData = useUserDataStore((state) => state.userData); // 사용자 정보 불러오기

  const [formData, setFormData] = useState<FormData>({
    nickname: userData.nickname,
    job: userData.job,
    goal: userData.goal,
    profile_img: userData.profile_img,
  });

  const [previewImg, setPreviewImg] = useState<string>(userData.profile_img);
  const [isEditing, setIsEditing] = useState(false); // '수정하기' - 편집 상태 확인

  useEffect(() => {
    setFormData({
      nickname: userData.nickname,
      job: userData.job,
      goal: userData.goal,
      profile_img: userData.profile_img,
    });
    setPreviewImg(userData.profile_img);
  }, [userData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreviewImg(URL.createObjectURL(file));
    setFormData((prev) => ({ ...prev, profile_img: file.name }));
  };

  const resetForm = () => {
    setFormData({
      nickname: userData.nickname,
      job: userData.job,
      goal: userData.goal,
      profile_img: userData.profile_img,
    });
    setPreviewImg(userData.profile_img);
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

  const saveChanges = () => {
    console.log('저장된 FormData : ', formData);
    setIsEditing(false);
    /*** API 코드 추가하기 ***/
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
            src={previewImg}
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
          {isEditing ? (
            <input
              name="nickname"
              type="text"
              value={formData.nickname}
              className="font-semibold bg-gray-15 px-5 py-3 rounded-xl focus:outline-none w-full"
              placeholder={userData.nickname}
              maxLength={15}
              onChange={handleInputChange}
            />
          ) : (
            <H2_content_title>{userData.nickname}</H2_content_title>
          )}
          <p className="text-sm text-gray-70">{userData.email}</p>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <div className="flex w-full gap-8 px-2 items-center">
          <p> 희망 직무</p>

          {isEditing ? (
            <input
              name="job"
              type="text"
              className="bg-gray-15 grow-1 px-5 py-3 focus:outline-none rounded-2xl"
              value={formData.job}
              placeholder={userData.job}
              maxLength={20}
              onChange={handleInputChange}
            />
          ) : (
            <p className="bg-gray-15 grow-1 px-5 py-3 focus:outline-none rounded-2xl">
              {userData.job}
            </p>
          )}
        </div>

        <div className="flex w-full gap-8 px-2 items-center">
          <p> 면접 목표</p>
          {isEditing ? (
            <input
              name="goal"
              type="text"
              className="bg-gray-15 grow-1 px-5 py-3 focus:outline-none rounded-2xl"
              value={formData.goal}
              placeholder={userData.goal}
              maxLength={50}
              onChange={handleInputChange}
            />
          ) : (
            <p className="bg-gray-15 grow-1 px-5 py-3 focus:outline-none rounded-2xl">
              {userData.goal}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end mt-auto gap-5">
        {isEditing && (
          <button
            className="px-10 py-3 bg-gray-25 text-gray-70 font-semibold rounded-xl cursor-pointer hover:bg-gray-40"
            onClick={endEditing}
          >
            되돌리기
          </button>
        )}

        <Button onClick={isEditing ? saveChanges : startEditing}>
          {isEditing ? '저장하기' : '프로필 수정'}
        </Button>
      </div>
    </form>
  );
}
