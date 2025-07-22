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
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useModal } from '../../hooks/useModal';

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
  const [isFetching, setIsFetching] = useState(false);
  const [prevItems, setPrevItems] = useState<RawItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();
  const modal = useModal();
  // 페이지 네이션
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = Number(searchParams.get('page')) || 1;
  const [total, setTotal] = useState<number>(0);
  const PAGE_SIZE = 4;
  const navigate = useNavigate();
  const [direction, setDirection] = useState(0);

  const fetchHistory = async (page: number) => {
    if (!user_id) return;
    setIsFetching(true);
    try {
      const { data, total } = await getInterviewHistory(
        user_id,
        page,
        PAGE_SIZE,
      );
      const normalized = data.map((item) => ({
        ...item,
        question: Array.isArray(item.question)
          ? item.question[0]
          : item.question,
        feedback: Array.isArray(item.feedback)
          ? item.feedback[0]
          : item.feedback,
      }));
      setItems(normalized);
      setPrevItems(normalized);
      setTotal(total);
    } catch {
      setError('면접 기록을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchHistory(pageParam);
  }, [user_id, pageParam]);

  // 수정버튼 토글
  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
  };

  // 삭제 로직
  const handleDelete = async (answerId: number, questionId: number) => {
    modal({
      title: '면접 기록 삭제',
      description: '정말 삭제할까요?\n삭제시 즐겨찾기도 함께 삭제됩니다.',
      confirmText: '삭제',
      onConfirm: async () => {
        try {
          await deleteInterviewHistory(answerId, questionId, user_id);
          setItems((prev) =>
            prev.filter((item) => item.answer_id !== answerId),
          );
          toast('면접 기록을 삭제했어요.', 'success');
          fetchHistory(pageParam);
        } catch {
          toast('기록 삭제에 실패했습니다.', 'error');
        }
      },
      onCancel: () => {},
    });
  };

  const handlePageChange = (page: number) => {
    setDirection(page > pageParam ? 1 : -1);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', String(page));
    setSearchParams(newParams);
  };

  return (
    <section className="max-w-7xl mx-auto rounded-3xl bg-white p-6 shadow-md flex flex-col gap-7 mb-5 justify-start min-h-[750px]">
      {/* 제목 */}
      <H3_sub_detail>최근 면접 기록</H3_sub_detail>

      {/* 면접 기록 불러오기 */}
      {loading ? (
        <div className="flex flex-col flex-1 justify-center items-center text-gray-85 gap-5">
          <div className="w-10 h-10 border-[5px] border-gray-70 border-t-transparent rounded-full animate-spin mb-4" />
          <p> 로딩중 ... </p>
        </div>
      ) : error ? (
        <div className="m-10 p-5 rounded-xl border border-red-200 bg-red-50 text-red-600 text-center font-semibold">
          {error}
        </div>
      ) : items.length === 0 ? (
        <div className="py-20 text-center text-gray-70">
          {/* 면접 질문이 없을 때 */}
          <H2_content_title>아직 인터뷰 기록이 없어요!</H2_content_title>
          <br />
          <span className="font-semibold mt-2">
            나만의 인터뷰 실력을 보여주세요
          </span>
        </div>
      ) : (
        <motion.div
          layout
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="flex-grow"
        >
          {/* 리스트 */}
          <motion.ul layout className="relative space-y-3 pt-6 pb-13 flex-grow">
            <AnimatePresence mode="popLayout" initial={false}>
              {' '}
              {(isFetching ? prevItems : items).map(
                ({
                  answer_id,
                  question_id,
                  created_at,
                  question,
                  feedback,
                }) => (
                  <motion.li
                    key={answer_id}
                    layout
                    initial={{ opacity: 0, x: direction > 0 ? 40 : -40 }}
                    animate={{
                      opacity: 1,
                      x: editMode ? 10 : 0,
                      width: editMode ? '98%' : '100%',
                    }}
                    exit={{ opacity: 0, x: direction > 0 ? -40 : 40 }}
                    transition={{ duration: 0.35 }}
                    style={{ transformOrigin: 'right center' }}
                    className={`flex items-center justify-between rounded-md bg-gray-50 shadow-sm px-4 py-5 mb-5 ${
                      editMode ? 'ml-auto' : 'w-full'
                    }`}
                  >
                    {/* 삭제버튼 */}
                    {editMode && (
                      <button
                        type="button"
                        onClick={() => handleDelete(answer_id, question_id)}
                        aria-label="delete history"
                        className="items-center justify-center flex border rounded-3xl h-7 w-7 absolute -left-10 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                      >
                        <FontAwesomeIcon icon={faXmark} />
                      </button>
                    )}

                    {/* 면접 질문 / 카테고리 */}
                    <div className="mt-1 flex flex-col gap-4 max-w-[65%]">
                      <H3_sub_detail>{question.content}</H3_sub_detail>
                      <div className="flex items-center gap-2 text-base font-semibold">
                        <span
                          className={`inline-flex justify-center items-center text-center h-7 min-w-28 py-4 rounded-lg ${
                            CATEGORY_STYLES[question.category]?.bg
                          } ${CATEGORY_STYLES[question.category]?.text}`}
                        >
                          {question.category === 'front-end'
                            ? 'Front-end'
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
                        {feedback?.average ?? '-'} 점
                      </H2_content_title>
                      <WhiteButton
                        onClick={() =>
                          navigate(
                            editMode
                              ? `/interview-view/${answer_id}?mode=edit`
                              : `/interview-view/${answer_id}`,
                            {
                              state: {
                                answerId: answer_id,
                              },
                            },
                          )
                        }
                      >
                        {editMode ? '수정하기' : '다시보기'}
                      </WhiteButton>
                    </div>
                  </motion.li>
                ),
              )}
            </AnimatePresence>
          </motion.ul>
        </motion.div>
      )}

      {/* 하단 버튼 */}
      {items.length > 0 && (
        <div className="relative">
          {/* 수정버튼 */}
          <div className="absolute right-0 top-0">
            <Button onClick={toggleEditMode}>
              {editMode ? '히스토리 내역 수정' : '히스토리 수정'}
            </Button>
          </div>

          {/* 페이지네이션 */}
          <div className="flex justify-center w-full gap-2">
            <button
              onClick={() => handlePageChange(Math.max(pageParam - 1, 1))}
              disabled={pageParam === 1}
              className="px-4 py-2 rounded bg-gray-40 text-black disabled:opacity-50 cursor-pointer"
            >
              이전
            </button>

            {Array.from({ length: Math.ceil(total / PAGE_SIZE) }, (_, idx) => {
              const pageNumber = idx + 1;
              const isCurrent = pageNumber === pageParam;

              return (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  disabled={isCurrent}
                  className={`w-6 text-center text-base font-semibold cursor-pointer ${
                    isCurrent ? 'text-black' : 'text-gray-300'
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}

            <button
              onClick={() =>
                handlePageChange(
                  Math.min(pageParam + 1, Math.ceil(total / PAGE_SIZE)),
                )
              }
              disabled={pageParam >= Math.ceil(total / PAGE_SIZE)}
              className="px-4 py-2 rounded bg-gray-40 text-black disabled:opacity-50 cursor-pointer"
            >
              다음
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
