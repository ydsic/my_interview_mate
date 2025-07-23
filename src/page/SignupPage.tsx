import { useState } from 'react';
import { SubmitButton } from '../components/common/Button';
import {
  H1_big_title,
  H3_sub_detail,
  H4_placeholder,
} from '../components/common/HTagStyle';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/common/Input';
import { validateField } from '../utils/validation';
import { signUpUser } from '../api/authAPI';
import { useToast } from '../hooks/useToast';

type FormDataType = {
  userId: string;
  password: string;
  confirmPassword: string;
  nickname: string;
  job: string;
  goal: string;
};

type FormErrors = {
  userId: string | null;
  password: string | null;
  confirmPassword: string | null;
  nickname: string | null;
  job: string | null;
  goal: string | null;
};

export default function SignupPage() {
  const [formData, setFormData] = useState<FormDataType>({
    userId: '',
    password: '',
    confirmPassword: '',
    nickname: '',
    job: 'frontend',
    goal: '',
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({
    userId: null,
    password: null,
    confirmPassword: null,
    nickname: null,
    job: null,
    goal: null,
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      const error = validateField(name, value, {
        password: name === 'confirmPassword' ? prev.password : value,
      });

      const updatedErrors = {
        ...formErrors,
        [name]: error,
      };

      // 비밀번호 변경 시 → 비밀번호 확인도 재검증
      if (name === 'password' && prev.confirmPassword) {
        updatedErrors.confirmPassword = validateField(
          'confirmPassword',
          prev.confirmPassword,
          {
            password: value,
          },
        );
      }

      setFormErrors(updatedErrors);
      return updated;
    });
  };

  const resetFromData = () => {
    setFormData({
      userId: '',
      password: '',
      confirmPassword: '',
      nickname: '',
      job: 'frontend',
      goal: '',
    });
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;

    if (!formData.password || !formData.nickname || !formData.userId) {
      toast('비밀번호, 닉네임, 이메일을 모두 입력하세요.', 'error');
      return;
    }

    const hasError = Object.values(formErrors).some((error) => error != null);
    if (hasError) {
      toast('입력란을 다시 확인해주세요!', 'error');
      return;
    }

    setLoading(true);

    try {
      await signUpUser({
        userId: formData.userId,
        password: formData.password,
        nickname: formData.nickname,
        job: formData.job || '',
        goal: formData.goal || '',
        profile_img: '',
      });

      toast('회원가입 성공!! 이메일 인증 후 로그인하세요.', 'success');
      resetFromData(); // 성공했을 때만 폼 데이터 초기화
      navigate('/login');
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : '회원가입 중 오류가 발생했습니다.';
      toast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full justify-center items-center text-center gap-5 mt-5">
      <H1_big_title>회원가입</H1_big_title>
      <H3_sub_detail>정보를 입력해 주세요</H3_sub_detail>
      <form
        onSubmit={handleSignup}
        className="space-y-6 w-1/2 bg-white p-8 rounded-2xl border-2 border-gray-300 shadow-sm"
      >
        <div>
          <label className="flex font-medium text-gray-700 mb-2">
            이메일<span className="text-red-500 ml-1">*</span>
          </label>
          <H4_placeholder>
            <Input
              type="email"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              placeholder="이메일을 입력하세요"
              error={formErrors.userId}
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
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="비밀번호를 입력하세요"
              autoComplete="off"
              required
              error={formErrors.password}
            />
          </H4_placeholder>
        </div>
        <div>
          <label className="flex font-medium text-gray-700 mb-2">
            비밀번호 확인<span className="text-red-500 ml-1">*</span>
          </label>
          <H4_placeholder>
            <Input
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="비밀번호를 확인헤주세요."
              autoComplete="off"
              required
              error={formErrors.confirmPassword}
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
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
              placeholder="닉네임을 입력하세요"
              required
              error={formErrors.nickname}
            />
          </H4_placeholder>
        </div>
        <div>
          <label className="flex font-medium text-gray-700 mb-2">
            희망 직무
          </label>
          <H4_placeholder>
            <select
              className="flex w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              name="job"
              value={formData.job}
              onChange={handleChange}
            >
              <option value="frontend">프론트엔드</option>
              <option value="backend">백엔드</option>
              <option value="fullstack">풀스택</option>
              <option value="devops">DevOps</option>
              <option value="data">데이터 분석</option>
              <option value="design">디자인</option>
              <option value="qa">QA</option>
              <option value="other">기타</option>
            </select>
          </H4_placeholder>
        </div>
        <div>
          <label className="flex font-medium text-gray-700 mb-2">
            면접 목표
          </label>
          <H4_placeholder>
            <Input
              type="text"
              name="goal"
              value={formData.goal}
              onChange={handleChange}
              placeholder="목표를 입력하세요"
              error={formErrors.goal}
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
