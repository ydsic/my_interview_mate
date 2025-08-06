import { checkEmailExists } from '../api/authAPI';

// 비동기 이메일 검증 함수
export async function validateEmailAsync(
  email: string,
): Promise<string | null> {
  // 기본 형식 검증
  if (!/\S+@\S+\.\S+/.test(email)) {
    return '이메일 형식이 올바르지 않습니다.';
  }

  // 이메일 중복 체크
  try {
    const emailExists = await checkEmailExists(email);
    if (emailExists) {
      return '이미 가입된 이메일입니다.';
    }
  } catch (error) {
    console.error('이메일 중복 체크 오류:', error);
    // 네트워크 오류 등의 경우 검증을 통과시킴 (회원가입 시에 다시 체크됨)
  }

  return null;
}

export function validateField(
  name: string,
  value: string,
  relatedValues?: { [key: string]: string },
): string | null {
  switch (name) {
    case 'email':
    case 'userId': // userId는 이메일로 사용되므로 동일한 검증 적용
      return /\S+@\S+\.\S+/.test(value)
        ? null
        : '이메일 형식이 올바르지 않습니다.';

    case 'password': {
      if (!value.trim()) {
        return '비밀번호를 입력해주세요.';
      }
      const passwordRegex =
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?]).{8,}$/;
      return passwordRegex.test(value)
        ? null
        : '비밀번호는 8자 이상, 영문/숫자/특수문자를 포함해야 합니다.';
    }

    case 'confirmPassword':
      if (!value.trim()) {
        return '비밀번호 확인을 입력해주세요.';
      }
      return value === relatedValues?.password
        ? null
        : '비밀번호가 일치하지 않습니다.';

    case 'nickname':
      return value.trim() !== '' ? null : '닉네임을 입력해주세요.';

    case 'job':
      return null;
    case 'goal':
      return null;
    default:
      return null;
  }
}
