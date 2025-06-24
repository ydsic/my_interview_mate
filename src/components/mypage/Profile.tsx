import { useEffect } from 'react';
import { useUserDataStore } from '../../store/userData';
import Button from '../common/Button';
import { H3_sub_detail } from '../common/HTagStyle';

export default function Profile() {
  // 사용자 정보 불러오기
  const UserData = useUserDataStore((state) => state.userData);

  useEffect(() => {
    console.log('유저 데이터 : ', UserData);
  }, [UserData]);

  return (
    <div className="flex flex-col gap-10 mb-5 bg-white p-[30px] rounded-4xl shadow-md relative">
      <p className="font-semibold">프로필 정보</p>
      <div className="flex items-center gap-5 h-20">
        <img
          className="h-full aspect-square rounded-full object-cover"
          // src={defaultProfileImg}
          alt="프로필 사진"
        />
        <button hidden> 사진 변경 </button>
        <div className="flex flex-col justify-between h-full py-3">
          <H3_sub_detail> 김면접 </H3_sub_detail>
          <p> interview@gmail.com</p>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <div className="flex w-full gap-8 px-2 items-center">
          <p> 희망 직무</p>
          <input
            className="bg-gray-15 grow-1 px-5 py-3 focus:outline-none rounded-2xl"
            value="프론트엔드 개발자"
            disabled
          />
        </div>

        <div className="flex w-full gap-8 px-2 items-center">
          <p> 면접 목표</p>
          <input
            className="bg-gray-15 grow-1 px-5 py-3 focus:outline-none rounded-2xl"
            value="주 3회 이상 연습"
            disabled
          />
        </div>
      </div>

      <div className="flex justify-end mt-auto gap-5">
        <button className="px-12 py-3 bg-gray-25 text-gray-100 font-semibold rounded-xl cursor-pointer">
          되돌리기
        </button>
        <Button> 프로필 수정 </Button>
      </div>
    </div>
  );
}
