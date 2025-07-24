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
import { H3_sub_detail } from '../common/HTagStyle';
import { useModal } from '../../hooks/useModal';

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
  const storeUserData = useUserDataStore((state) => state.userData);

  const [userData, setUserData] = useState<UserData | null>(null);
  const [formData, setFormData] = useState<FormData>({
    nickname: '',
    job: '',
    goal: '',
    profile_img: '',
  });

  const [previewImg, setPreviewImg] = useState<string>(defaultProfileImg);
  const [isEditing, setIsEditing] = useState(false); // '수정하기' - 편집 상태 확인
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const modal = useModal();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await loginUserInfo(storeUserData.user_id);

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
      } catch (error: unknown) {
        const err = error as Error;
        console.log('유저 정보 불러오기 실패 : ', err);
        toast('유저 정보를 불러오는 데 실패 했습니다.', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    if (storeUserData.user_id) fetchUserData();
  }, [storeUserData.user_id, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userData) return;

    setPreviewImg(URL.createObjectURL(file));
    setSelectedImageFile(file);
  };

  const handleImageDelete = () => {
    setPreviewImg(defaultProfileImg);

    setFormData((prev) => ({
      ...prev,
      profile_img: '',
    }));

    setSelectedImageFile(null);
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
    setSelectedImageFile(null);
  };

  const saveChanges = async () => {
    if (!userData) return;

    // 닉네임 Validation 추가
    if (!formData.nickname.trim()) {
      toast('닉네임은 비워둘 수 없습니다.', 'error');
      return;
    }

    try {
      const profile_img = selectedImageFile
        ? await uploadUserImageOnly(selectedImageFile, userData.user_id)
        : formData.profile_img === ''
          ? ''
          : userData.profile_img;

      await updateUserProfile(userData.user_id, {
        ...formData,
        profile_img,
      });

      // 프로필 수정하고, 새로고침 없이 되돌리기 했을 때 이전 데이터 나오길래 수정
      const newUser = {
        ...userData,
        ...formData,
        profile_img,
      };
      setUserData(newUser);
      setFormData(newUser);
      setPreviewImg(profile_img || defaultProfileImg);

      useUserDataStore.getState().setUserData({
        ...storeUserData,
        nickname: formData.nickname,
      });

      toast('프로필이 성공적으로 저장되었습니다.', 'success');

      setIsEditing(false);
    } catch (err: unknown) {
      console.log('프로필 저장 실패 : ', err);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    saveChanges();
  };
  // 모달 적용
  const handleEditClick = () => {
    modal({
      title: '프로필 수정',
      description: '프로필을 저장하시겠습니까?',
      confirmText: '저장',
      cancelText: '닫기',
      onConfirm: () => saveChanges(),
    });
  };

  const handelCancelEdit = () => {
    modal({
      title: '수정 취소',
      description:
        '저장하지 않은 변경 사항이 모두 사라집니다.\n 계속하시겠습니까?',
      confirmText: '네',
      cancelText: '아니요',
      onConfirm: () => {
        resetForm();
        setIsEditing(false);
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-10 mb-5 bg-white p-[24px] rounded-4xl shadow-md relative h-[450px]"
    >
      <H3_sub_detail className="font-semibold">프로필 정보</H3_sub_detail>

      {isLoading ? (
        <div className="flex flex-col flex-1  justify-center items-center text-gray-85 gap-5 ">
          <div className="w-10 h-10 border-[5px] border-gray-70 border-t-transparent rounded-full animate-spin mb-4" />
          <p> 로딩중 ... </p>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-5.5 h-20 relative">
            <div className="relative">
              <img
                className="h-20 w-20 rounded-full object-cover"
                src={previewImg || defaultProfileImg}
                alt="프로필 사진"
              />
              {isEditing && (
                <>
                  <label
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-xs w-full text-center bg-white border text-gray-500 rounded-full shadow-sm cursor-pointer 
              hover:bg-green-10 hover:text-green-500 hover:border-green-500"
                  >
                    사진 변경
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={handleImageDelete}
                    className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs w-full text-center bg-white border text-gray-500 rounded-full shadow-sm cursor-pointer
               hover:bg-red-100 hover:text-red-500 hover:border-red-500"
                  >
                    사진 삭제
                  </button>
                </>
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
                  type="button"
                  className="px-10 py-3 bg-gray-25 text-gray-70 font-semibold rounded-xl cursor-pointer hover:bg-gray-40"
                  onClick={handelCancelEdit}
                >
                  되돌리기
                </button>
                <Button type="button" onClick={handleEditClick}>
                  {' '}
                  저장하기
                </Button>
              </>
            ) : (
              <>
                <Button onClick={() => setIsEditing(true)}>
                  {' '}
                  프로필 수정{' '}
                </Button>
              </>
            )}
          </div>
        </>
      )}
    </form>
  );
}
