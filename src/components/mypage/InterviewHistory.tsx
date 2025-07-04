import Button, { WhiteButton } from '../common/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import {
  H2_content_title,
  H3_sub_detail,
  H4_placeholder,
} from '../common/HTagStyle';

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

const mock = [
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

export default function InterviewHistory() {
  const [editMode, setEditMode] = useState(false);
  const [shrunk, setShrunk] = useState<Record<number, boolean>>({});
  const BASE_CONTENT_WIDTH = '65%';

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
    if (editMode) setShrunk({});
  };
  const handleShrink = (id: number) => {
    setShrunk((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section className="max-w-5xl mx-auto rounded-xl bg-white p-6 shadow-sm">
      {/* 제목 */}
      <H3_sub_detail>최근 면접 기록</H3_sub_detail>

      {/* 리스트 */}
      <ul className="relative space-y-3 pt-6 pb-13">
        <AnimatePresence>
          {mock.map(({ id, question, category, date, score }) => {
            const { bg, text } = CATEGORY_STYLES[category] ?? {
              bg: 'bg-gray-200',
              text: 'text-gray-700',
            };
            // const isShrunk = shrunk[id] ?? false;
            return (
              <motion.li
                key={id}
                layout
                initial={false}
                animate={{
                  x: editMode ? 10 : 0,
                  width: editMode ? '98%' : '100%',
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                style={{ transformOrigin: 'right center' }}
                className={`flex items-center justify-between rounded-md bg-gray-50 shadow-sm px-4 py-5 mb-5 ${editMode ? 'ml-auto' : 'w-full'}`}
              >
                {/* 삭제버튼 */}
                {editMode && (
                  <button
                    type="button"
                    aria-label="delete history"
                    // onClick={()=>handleDelete(id)}
                    className="border rounded-4xl h-7 w-7 absolute -left-10 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                  >
                    <FontAwesomeIcon icon={faXmark} className="h-5 w-5" />
                  </button>
                )}

                {/* 면접 질문 / 카테고리 */}
                <motion.div className="mt-1 flex flex-col gap-4 max-w-[65%]">
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
                </motion.div>

                {/* 오른쪽: 점수 & 다시보기 */}
                <div className="flex items-center gap-3 shrink-0">
                  <H2_content_title>{score}점</H2_content_title>
                  <WhiteButton onClick={() => handleShrink(id)}>
                    {editMode ? '수정하기' : '다시보기'}
                  </WhiteButton>
                </div>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>

      {/* 하단 버튼 */}
      <div className="flex justify-end">
        <Button onClick={toggleEditMode}>
          {editMode ? '히스토리 내역 수정' : '히스토리 수정'}
        </Button>
      </div>
    </section>
  );
}
