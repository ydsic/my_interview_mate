export function validateField(
  name: string,
  value: string,
  relatedValues?: { [key: string]: string },
): string | null {
  switch (name) {
    case 'email':
      return /\S+@\S+\.\S+/.test(value)
        ? null
        : '이메일 형식이 올바르지 않습니다.';

    case 'password': {
      const passwordRegex =
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?]).{8,}$/;
      return passwordRegex.test(value)
        ? null
        : '비밀번호는 8자 이상, 영문/숫자/특수문자를 포함해야 합니다.';
    }

    case 'confirmPassword':
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
