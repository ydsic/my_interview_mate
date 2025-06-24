import { useEffect, useState } from 'react';
import { useUserDataStore } from '../../store/userData';
import Button from '../common/Button';
import { H2_content_title } from '../common/HTagStyle';

type UserData = {
  user_id: string;
  nickname: string;
  email: string;
  profile_img: string;
  job: string;
  goal: string;
};

export default function Profile() {
  const userData = useUserDataStore((state) => state.userData); // 사용자 정보 불러오기
  const [isEditing, setIsEditing] = useState(false); // '수정하기' - 편집 상태 확인
  // 사용자 정보
  const [formData, setFormData] = useState<Omit<UserData, 'user_id' | 'email'>>(
    {
      nickname: ' ',
      job: ' ',
      goal: ' ',
      profile_img: '',
    },
  );
  const [previewImg, setPreviewImg] = useState<string>(userData.profile_img); // 첨부한 사진 미리보기
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    console.log(userData);
    setFormData({
      nickname: userData.nickname,
      job: userData.job,
      goal: userData.goal,
      profile_img: userData.profile_img,
    });
    setPreviewImg(userData.profile_img);
  }, [userData]);

  // 되돌리기 버튼 클릭
  const handleCancel = () => {
    setFormData({
      nickname: userData.nickname,
      job: userData.job,
      goal: userData.goal,
      profile_img: userData.profile_img,
    });
    setPreviewImg(userData.profile_img);
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 프로필 사진 변경
  const handleImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setPreviewImg(URL.createObjectURL(file));
    /*********************** 일단 formData에 이름으로 저장 ***********************/
    setFormData((prev) => ({ ...prev, profile_img: file.name }));
    console.log('선택된 파일:', selectedFile?.name);
  };

  // isEditing 상태 토글
  const toggleEditing = () => {
    setIsEditing((prev) => !prev);
  };

  // '저장하기' 버튼 클릭 시 동작
  const saveFormData = () => {
    console.log('저장된 formData : ', formData);
  };

  const handleButtonClick = () => {
    if (isEditing) {
      saveFormData();
      toggleEditing();
    } else {
      toggleEditing();
    }
  };

  return (
    <div className="flex flex-col gap-10 mb-5 bg-white p-[30px] rounded-4xl shadow-md relative">
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
                onChange={handleImgChange}
              />
            </label>
          )}
        </div>

        <div className="flex flex-col grow-1 justify-between h-full py-0.5">
          {isEditing ? (
            <input
              name="nickname"
              value={formData.nickname}
              className="font-semibold bg-gray-15 px-5 py-3 rounded-xl focus:outline-none w-full"
              placeholder={userData.nickname}
              onChange={handleChange}
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
          <input
            name="job"
            className="bg-gray-15 grow-1 px-5 py-3 focus:outline-none rounded-2xl"
            value={formData.job}
            placeholder={userData.job}
            disabled={!isEditing}
            onChange={handleChange}
          />
        </div>

        <div className="flex w-full gap-8 px-2 items-center">
          <p> 면접 목표</p>
          <input
            name="goal"
            className="bg-gray-15 grow-1 px-5 py-3 focus:outline-none rounded-2xl"
            value={formData.goal}
            placeholder={userData.goal}
            disabled={!isEditing}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="flex justify-end mt-auto gap-5">
        {isEditing ? (
          <button
            className="px-10 py-3 bg-gray-25 text-gray-70 font-semibold rounded-xl cursor-pointer hover:bg-gray-40"
            onClick={handleCancel}
          >
            되돌리기
          </button>
        ) : (
          <></>
        )}

        <Button onClick={handleButtonClick}>
          {isEditing ? '저장하기' : '프로필 수정'}
        </Button>
      </div>
    </div>
  );
}
