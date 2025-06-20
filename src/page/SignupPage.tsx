import { useState } from 'react';
import Button from '../components/common/Button';
import {
  H1_big_title,
  H3_sub_detail,
  H4_placeholder,
} from '../components/common/HTagStyle';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Input from '../components/common/Input';

export default function SignupPage() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [job, setJob] = useState('');
  const [goal, setGoal] = useState('');
  const defaultProfileImg =
    'https://vlowdzoigoyaudsydqam.supabase.co/storage/v1/object/public/profileimgs//profile_default_img.png';
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userId || !password || !nickname) {
      alert('아이디, 비밀번호, 닉네임을 모두 입력하세요.');
      return;
    }

    if (userId.length < 3) {
      alert('아이디는 3자 이상이어야 합니다.');
      return;
    }

    const { data, error } = await supabase.from('user_info').insert([
      {
        user_id: userId,
        password,
        nickname,
        job: job || '',
        goal: goal || '',
        profile_img: defaultProfileImg,
      },
    ]);
    if (error) {
      if (error.message.includes('duplicate')) {
        alert('이미 가입된 아이디입니다.');
      } else {
        alert(error.message || '회원가입 중 오류가 발생했습니다.');
      }
      return;
    }
    alert('회원가입 성공! 로그인 페이지로 이동합니다.');
    navigate('/login');
  };

  return (
    <div className="flex flex-col h-full justify-center items-center text-center gap-5">
      <H1_big_title>회원가입</H1_big_title>
      <H3_sub_detail>정보를 입력해 주세요</H3_sub_detail>
      <form
        onSubmit={handleSignup}
        className="space-y-6 w-1/2 bg-gray-50 p-8 rounded-2xl border-2 border-gray-300 shadow-sm"
      >
        <div>
          <label className="flex font-medium text-gray-700 mb-2">
            아이디<span className="text-red-500 ml-1">*</span>
          </label>
          <H4_placeholder>
            <Input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="아이디를 입력하세요"
              required
            />
          </H4_placeholder>
        </div>
        <div>
          <label className="flex font-medium text-gray-700 mb-2">
            비밀번호<span className="text-red-500 ml-1">*</span>
          </label>
          <H4_placeholder>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              autoComplete="off"
              required
            />
          </H4_placeholder>
        </div>
        <div>
          <label className="flex font-medium text-gray-700 mb-2">
            닉네임<span className="text-red-500 ml-1">*</span>
          </label>
          <H4_placeholder>
            <Input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="닉네임을 입력하세요"
              required
            />
          </H4_placeholder>
        </div>
        <div>
          <label className="flex font-medium text-gray-700 mb-2">직업</label>
          <H4_placeholder>
            <Input
              type="text"
              value={job}
              onChange={(e) => setJob(e.target.value)}
              placeholder="직업을 입력하세요"
            />
          </H4_placeholder>
        </div>
        <div>
          <label className="flex font-medium text-gray-700 mb-2">목표</label>
          <H4_placeholder>
            <Input
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="목표를 입력하세요"
            />
          </H4_placeholder>
        </div>
        <Button
          type="submit"
          className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg"
        >
          회원가입
        </Button>
        <div className="mt-6 text-center">
          <span className="text-gray-600">이미 계정이 있으신가요? </span>
          <Link
            to="/login"
            className="text-blue-500 hover:text-blue-600 font-medium"
          >
            로그인
          </Link>
        </div>
      </form>
    </div>
  );
}
