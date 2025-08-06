import { useState, useCallback, useRef, useEffect } from 'react';
import { SubmitButton } from '../components/common/Button';
import {
  H1_big_title,
  H3_sub_detail,
  H4_placeholder,
} from '../components/common/HTagStyle';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/common/Input';
import { validateField, validateEmailAsync } from '../utils/validation';
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
  const [emailChecking, setEmailChecking] = useState(false);
  const emailCheckTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();
  const toast = useToast();

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (emailCheckTimeoutRef.current) {
        clearTimeout(emailCheckTimeoutRef.current);
      }
    };
  }, []);

  // 폼 유효성 검사 - 모든 필수 필드가 채워져 있고 오류가 없는지 확인
  const isFormValid = () => {
    // 필수 필드 체크
    const requiredFields = [
      'userId',
      'password',
      'confirmPassword',
      'nickname',
    ];
    const hasRequiredValues = requiredFields.every(
      (field) => formData[field as keyof FormDataType].trim() !== '',
    );

    // 오류 체크 (필수 필드만)
    const hasErrors = requiredFields.some(
      (field) => formErrors[field as keyof FormErrors] !== null,
    );

    // 이메일 중복 체크 중이 아닌지 확인
    return hasRequiredValues && !hasErrors && !emailChecking;
  };

  // 이메일 중복 체크 함수 (debounced)
  const checkEmailDuplicate = useCallback(async (email: string) => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return;
    }

    setEmailChecking(true);
    try {
      const error = await validateEmailAsync(email);
      setFormErrors((prev) => ({
        ...prev,
        userId: error,
      }));
    } catch (error) {
      console.error('이메일 중복 체크 실패:', error);
    } finally {
      setEmailChecking(false);
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      // 이메일 필드의 경우 실시간 중복 체크
      if (name === 'userId') {
        // 기본 형식 검증
        const basicError = validateField(name, value);

        setFormErrors((prevErrors) => ({
          ...prevErrors,
          [name]: basicError,
        }));

        // 이전 타이머가 있다면 클리어
        if (emailCheckTimeoutRef.current) {
          clearTimeout(emailCheckTimeoutRef.current);
        }

        // 기본 형식이 올바르고 빈 값이 아닌 경우에만 중복 체크 (500ms 지연)
        if (!basicError && value.trim()) {
          emailCheckTimeoutRef.current = setTimeout(() => {
            checkEmailDuplicate(value);
          }, 500);
        } else if (basicError) {
          // 형식 오류가 있으면 중복 체크 중단
          setEmailChecking(false);
        }

        return updated;
      }

      // 다른 필드들의 기존 로직
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
    if (loading || !isFormValid()) return;

    // 이메일 중복 체크가 진행 중이면 대기
    if (emailChecking) {
      toast('이메일 확인 중입니다. 잠시만 기다려주세요.', 'info');
      return;
    }

    // 필수 필드 재검증
    if (!formData.password || !formData.nickname || !formData.userId) {
      toast('비밀번호, 닉네임, 이메일을 모두 입력하세요.', 'error');
      return;
    }

    // 오류 상태 재검증
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
        noValidate
      >
        <div>
          <label className="flex font-medium text-gray-700 mb-2">
            이메일<span className="text-red-500 ml-1">*</span>
            {emailChecking && (
              <span className="ml-2 text-sm text-blue-600">확인 중...</span>
            )}
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
            희망 직무 <span className="text-red-500 ml-1">*</span>
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
          className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          isDisabled={loading || !isFormValid()}
        >
          {loading
            ? '회원가입 중...'
            : emailChecking
              ? '이메일 확인 중...'
              : !isFormValid()
                ? '필수 정보를 입력해주세요'
                : '회원가입'}
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
