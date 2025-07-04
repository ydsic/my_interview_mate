import Button, { WhiteButton } from '../common/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { useUserDataStore } from '../../store/userData';
import {
  H2_content_title,
  H3_sub_detail,
  H4_placeholder,
} from '../common/HTagStyle';
import {
  deleteInterviewHistory,
  getInterviewHistory,
} from '../../api/historyAPI';
import type { InterviewHistoryItem as RawItem } from '../../api/historyAPI';
import { useToast } from '../../hooks/useToast';

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

export default function InterviewHistory() {
  const { user_id } = useUserDataStore((s) => s.userData);
  const [items, setItems] = useState<RawItem[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    if (!user_id) return;

    async function fetchHistory() {
      try {
        const raw = await getInterviewHistory(user_id);
        const normalized = raw.map((item) => ({
          ...item,
          question: Array.isArray(item.question)
            ? item.question[0]
            : item.question,
          feedback: Array.isArray(item.feedback)
            ? item.feedback[0]
            : item.feedback,
        }));
        setItems(normalized);
      } catch {
        setError('면접 기록을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, [user_id]);

  // 수정버튼 토글
  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
  };

  // 삭제 로직,
  const handleDelete = async (id: number) => {
    try {
      await deleteInterviewHistory(id);
      setItems((prev) => prev.filter((item) => item.answer_id !== id));
      toast('면접 기록을 삭제했어요.', 'success');
    } catch {
      toast('기록 삭제에 실패했습니다.', 'error');
    }
  };

  return (
    <section className="max-w-7xl mx-auto rounded-3xl bg-white p-6 shadow-md">
      {/* 제목 */}
      <H3_sub_detail>최근 면접 기록</H3_sub_detail>

      {/* 면접 기록 불러오기 */}
      {loading ? (
        <div className="py-10 text-center text-gray-85">로딩 중...</div>
      ) : error ? (
        <div className="m-10 p-5 rounded-xl border border-red-200 bg-red-50 text-red-600 text-center font-semibold">
          {error}
        </div>
      ) : items.length === 0 ? (
        <div className="py-10 text-center text-gray-85">
          {/* 면접 질문이 없을 때 */}
          <H2_content_title>면접 기록이 없습니다</H2_content_title>
        </div>
      ) : (
        /* 리스트 */
        <ul className="relative space-y-3 pt-6 pb-13">
          <AnimatePresence>
            {items.map(({ answer_id, created_at, question, feedback }) => (
              <motion.li
                key={answer_id}
                layout
                initial={false}
                animate={{
                  x: editMode ? 10 : 0,
                  width: editMode ? '98%' : '100%',
                }}
                exit={{
                  opacity: 0,
                  x: -20,
                  height: 0,
                  marginTop: 0,
                  marginBottom: 0,
                  paddingTop: 0,
                  paddingBottom: 0,
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                style={{ transformOrigin: 'right center' }}
                className={`flex items-center justify-between rounded-md bg-gray-50 shadow-sm px-4 py-5 mb-5 ${editMode ? 'ml-auto' : 'w-full'}`}
              >
                {/* 삭제버튼 */}
                {editMode && (
                  <button
                    type="button"
                    onClick={() => handleDelete(answer_id)}
                    aria-label="delete history"
                    className="items-center justify-center flex border rounded-3xl h-7 w-7 absolute -left-10 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                  >
                    <FontAwesomeIcon
                      icon={faXmark}
                      className="items-center justify-center flex"
                    />
                  </button>
                )}

                {/* 면접 질문 / 카테고리 */}
                <div className="mt-1 flex flex-col gap-4 max-w-[65%]">
                  <H3_sub_detail>{question.content}</H3_sub_detail>
                  <div className="flex items-center gap-2 text-base font-semibold">
                    <span
                      className={`inline-flex justify-center items-center text-center h-7 min-w-28 py-4 rounded-lg  ${CATEGORY_STYLES[question.category]?.bg} ${CATEGORY_STYLES[question.category]?.text}`}
                    >
                      {question.category === 'front-end'
                        ? '프론트엔드'
                        : question.category.toUpperCase()}
                    </span>

                    <H4_placeholder className="ml-2 text-gray-70 font-extralight">
                      {new Date(created_at).toLocaleDateString()}
                    </H4_placeholder>
                  </div>
                </div>

                {/* 오른쪽: 점수 & 다시보기 */}
                <div className="flex items-center gap-3 shrink-0">
                  <H2_content_title>
                    {feedback?.average ?? '-'}점
                  </H2_content_title>
                  <WhiteButton>
                    {editMode ? '수정하기' : '다시보기'}
                  </WhiteButton>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
      {/* 하단 버튼 */}
      {items.length > 0 && (
        <div className="flex justify-end">
          <Button onClick={toggleEditMode}>
            {editMode ? '히스토리 내역 수정' : '히스토리 수정'}
          </Button>
        </div>
      )}
    </section>
  );
}
