import { useState } from 'react';
import Button, { SubmitButton } from '../components/common/Button';
import {
  H1_big_title,
  H3_sub_detail,
  H4_placeholder,
} from '../components/common/HTagStyle';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Input from '../components/common/Input';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [job, setJob] = useState('');
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    if (!password || !nickname || !email) {
      alert('비밀번호, 닉네임, 이메일을 모두 입력하세요.');
      return;
    }
    setLoading(true);
    // Supabase Auth 회원가입
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      setLoading(false);
      if (error.message.includes('already registered')) {
        alert('이미 가입된 이메일입니다.');
      } else {
        alert(error.message || '회원가입 중 오류가 발생했습니다.');
      }
      return;
    }
    // 추가 정보 저장 (예: profile 테이블)
    const { error: profileError } = await supabase.from('profile').insert([
      {
        email,
        nickname,
        job: job || '',
        goal: goal || '',
      },
    ]);
    setLoading(false);
    if (profileError) {
      alert('프로필 정보 저장 중 오류가 발생했습니다.');
      return;
    }
    alert('회원가입 성공! 이메일 인증 후 로그인하세요.');
    navigate('/login');
  };

  return (
    <div className="flex flex-col h-full justify-center items-center text-center gap-5 mt-5">
      <H1_big_title>회원가입</H1_big_title>
      <H3_sub_detail>정보를 입력해 주세요</H3_sub_detail>
      <form
        onSubmit={handleSignup}
        className="space-y-6 w-1/2 bg-gray-50 p-8 rounded-2xl border-2 border-gray-300 shadow-sm"
      >
        <div>
          <label className="flex font-medium text-gray-700 mb-2">
            이메일<span className="text-red-500 ml-1">*</span>
          </label>
          <H4_placeholder>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일을 입력하세요"
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
        <SubmitButton
          className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg"
          isDisabled={loading}
        >
          {loading ? '회원가입 중...' : '회원가입'}
        </SubmitButton>
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
