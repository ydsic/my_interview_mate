import { useState } from 'react';
import { WhiteButton } from '../common/Button';
import {
  H2_content_title,
  H3_sub_detail,
  H4_placeholder,
} from '../common/HTagStyle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons';

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

interface mockItem {
  id: number;
  question: string;
  category: string;
  date: string;
  score: number;
}

const mock: mockItem[] = [
  {
    id: 1,
    question: 'TypeScript를 사용하는 이유는 무엇인가요?',
    category: 'front-end',
    date: '2025.06.16',
    score: 88,
  },
  {
    id: 2,
    question: 'RESTful API 설계 원칙에 대해 설명해주세요.',
    category: 'front-end',
    date: '2025.06.16',
    score: 81,
  },
  {
    id: 3,
    question: '프로젝트에서 발생한 가장 큰 문제와 해결 방법은?',
    category: 'cs',
    date: '2025.06.16',
    score: 60,
  },
] as const;

export default function Bookmark() {
  const [bookMarkList, setBookMarkList] = useState<mockItem[]>(mock);
  const [isBookmarked, setIsBookMarked] = useState<boolean>(true);

  return (
    <div className="flex flex-col gap-10 mb-5 bg-white p-[30px] rounded-4xl shadow-md relative">
      <p className="font-semibold">즐겨찾기 질문</p>
      <ul>
        {bookMarkList.map(({ id, question, category, date, score }) => {
          const { bg, text } = CATEGORY_STYLES[category] ?? {
            bg: 'bg-gray-200',
            text: 'text-gray-700',
          };
          return (
            <li
              key={id}
              className="flex items-center justify-between rounded-md bg-gray-50 shadow-sm px-4 py-5 mb-5"
            >
              <div className="flex w-full items-center gap-10 ml-3">
                <button className="text-[24px]">
                  <FontAwesomeIcon
                    icon={isBookmarked ? solidStar : regularStar}
                    className={
                      isBookmarked ? 'text-orange-100' : 'text-gray-100'
                    }
                  />
                </button>
                {/* 면접 질문 / 카테고리 */}
                <div className="mt-1 flex flex-col gap-4 max-w-[65%]">
                  <H3_sub_detail>{question}</H3_sub_detail>
                  <div className="flex items-center gap-2 text-base font-semibold">
                    <span
                      className={`inline-flex justify-center items-center h-7 min-w-28 py-4 rounded-lg text-center ${bg} ${text}`}
                    >
                      {category === 'front-end'
                        ? '프론트엔드'
                        : category.toUpperCase()}
                    </span>

                    <H4_placeholder className="ml-2 text-gray-70 font-extralight">
                      {date}
                    </H4_placeholder>
                  </div>
                </div>
              </div>

              {/* 오른쪽: 점수 & 다시보기 */}
              <div className="flex items-center gap-5 shrink-0">
                <H2_content_title>{score}점</H2_content_title>
                <WhiteButton>다시보기</WhiteButton>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
