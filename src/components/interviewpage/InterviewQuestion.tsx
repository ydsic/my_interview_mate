import {
  H2_content_title,
  H3_sub_detail,
  H4_placeholder,
} from '../common/HTagStyle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons';
import type {
  CategoryKey,
  InterviewQuestionProps,
} from '../../types/interview';

const CATEGORY_FIELDS: Record<CategoryKey, string> = {
  'front-end': 'Front-end 분야',
  cs: 'CS 분야',
  git: 'Git 분야',
};

const CATEGORY_STYLES: Record<
  string,
  { bg: string; text: string; question_bg: string }
> = {
  'front-end': {
    bg: 'front-bg-tag',
    text: 'front-text-tag',
    question_bg: 'front-bg',
  },
  cs: {
    bg: 'cs-bg-tag',
    text: 'cs-text-tag',
    question_bg: 'cs-bg',
  },
  git: {
    bg: 'git-bg-tag',
    text: 'git-text-tag',
    question_bg: 'git-bg',
  },
};

export default function InterviewQuestion({
  category,
  topic,
  question,
  isBookmarked,
  onToggleBookmark,
  canBookmark = true,
}: InterviewQuestionProps) {
  const field = CATEGORY_FIELDS[category];
  const categoryStyle = CATEGORY_STYLES[category];

  // 유효하지 않은 카테고리 예외처리
  if (!categoryStyle) {
    return (
      <div className="p-5 rounded-xl border border-red-200 bg-red-50 text-red-600 text-center font-semibold">
        잘못된 경로 입니다.
        <div className="mt-5">오류 메시지 : {category}</div>
      </div>
    );
  }
  return (
    <div className="p-5 rounded-xl border border-gray-300 bg-white shadow-sm space-y-4">
      <div className="flex justify-between mb-5">
        <div className="flex items-center gap-4">
          {/* 왼쪽 상단 - 카테고리 */}
          <div
            className={`flex items-center px-6 pt-2 pb-3 rounded-md ${categoryStyle.bg} ${categoryStyle.text}`}
          >
            <H3_sub_detail>{topic}</H3_sub_detail>
          </div>
          {/* 면접 질문 / 분야 */}
          <div className="text-left">
            <H2_content_title>면접 질문</H2_content_title>
            <div className="text-sm text-gray-70">{field}</div>
          </div>
        </div>

        {/* 즐겨찾기 아이콘 */}
        <button
          onClick={onToggleBookmark}
          className={`
            text-[24px] transition
            ${canBookmark ? 'cursor-pointer' : 'cursor-not-allowed opacity-40'}
          `}
        >
          <FontAwesomeIcon
            icon={isBookmarked ? solidStar : regularStar}
            className={isBookmarked ? 'text-orange-100' : 'text-gray-100'}
          />
        </button>
      </div>

      {/* GPT 질문 내용 */}
      <div
        className={`rounded-lg px-4 py-5 text-left ${categoryStyle.question_bg}`}
      >
        <H4_placeholder>{question}</H4_placeholder>
      </div>
    </div>
  );
}
