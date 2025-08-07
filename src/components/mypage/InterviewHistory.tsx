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
import clsx from 'clsx';

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
          await deleteInterviewHistory(answerId, questionId);
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
    <div className="pb-20">
      <section
        className="max-w-7xl mx-auto rounded-3xl 
    bg-white p-10 max-sm:p-3 shadow-md 
    flex flex-col
    gap-7 max-sm:gap-3 mb-5 justify-start min-h-[750px]"
      >
        {/* 제목 */}
        <div className="flex items-center justify-between w-full">
          <H3_sub_detail>최근 면접 기록</H3_sub_detail>

          {/* 모바일에서만 노출, 모바일 용 수정 버튼*/}
          <Button
            className="lg:hidden max-sm:px-3 max-sm:py-2 max-sm:text-xs max-sm:rounded-lg"
            onClick={toggleEditMode}
          >
            {editMode ? '수정 내용 저장하기' : '히스토리 수정'}
          </Button>
        </div>

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
            <motion.ul
              layout
              className="relative space-y-3 pt-6 pb-13 max-sm:pb-5 flex-grow"
            >
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
                    // ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
                    <motion.li
                      key={answer_id}
                      layout
                      initial={{ opacity: 0, x: direction > 0 ? 40 : -40 }}
                      animate={{
                        opacity: 1,
                        x: editMode ? 10 : 0,
                        width: editMode ? '97%' : '99%',
                      }}
                      exit={{ opacity: 0, x: direction > 0 ? -40 : 40 }}
                      transition={{ duration: 0.35 }}
                      className={clsx(
                        /* 모바일: 2열 3행 그리드 */
                        'grid grid-rows-[auto_auto_auto] grid-cols-[1fr_auto] gap-y-2',
                        'rounded-xl bg-gray-50 shadow-sm p-4',
                        /* PC: flex-row */
                        'sm:flex sm:items-center sm:justify-between sm:px-4 sm:py-5 sm:mb-5',
                        editMode ? 'ml-auto' : 'w-full',
                      )}
                    >
                      {/* 좌측 ------------------------------------------- */}

                      {/* 카테고리 칩 ------------------------------------------- */}
                      <div
                        className="flex flex-col gap-2 sm:flex-row sm:gap-4 sm:flex-1 sm:min-w-0
                row-start-1 col-span-2"
                      >
                        <span
                          className={clsx(
                            /* ── 고정 크기 ── */
                            'w-20 h-6 sm:w-28 sm:h-8 flex-none',
                            /* ── 가운데 정렬 ── */
                            'inline-flex items-center justify-center rounded-lg',
                            /* ── 글자 사이즈 ── */
                            'text-xs sm:text-base font-semibold',
                            /* ── 길면 말줄임 ── */
                            'truncate',
                            CATEGORY_STYLES[question.category]?.bg,
                            CATEGORY_STYLES[question.category]?.text,
                          )}
                        >
                          {question.category === 'front-end'
                            ? 'Front-end'
                            : question.category.toUpperCase()}
                        </span>

                        {/* 질문 내용 -------------------------------------------*/}
                        <div className="text-left sm:min-w-0">
                          <H3_sub_detail>{question.content}</H3_sub_detail>

                          {/* 작성일 ------------------------------------------- 테스크톱 하단 */}
                          <div className="max-sm:hidden mt-4 max-sm:row-start-3 col-start-1">
                            <H4_placeholder className="text-gray-70 font-extraligh">
                              {new Date(created_at).toLocaleDateString()}
                            </H4_placeholder>
                          </div>
                        </div>
                      </div>

                      {/* 우측(점수 + 버튼) ------------------------------------------- */}
                      <div
                        className="row-start-3 col-start-1 col-span-2
                      flex items-center justify-between 
                      gap-4 shrink-0 whitespace-nowrap 
                      sm:row-auto sm:col-auto sm:justify-end sm:gap-6"
                      >
                        {/* 작성일 ------------------------------------------- 모바일 칩 아래 */}
                        <div className="sm:hidden mt-2">
                          <H4_placeholder className="text-gray-70 font-extraligh">
                            {new Date(created_at).toLocaleDateString()}
                          </H4_placeholder>
                        </div>

                        <div className="flex items-center gap-4 shrink-0 whitespace-nowrap">
                          {/* 점수 -------------------------------------------*/}
                          <H2_content_title className="whitespace-nowrap">
                            {feedback?.average ?? '0'}점
                          </H2_content_title>

                          {/* 다시보기 / 수정하기 버튼 -------------------------------------------*/}
                          <WhiteButton
                            onClick={() =>
                              navigate(
                                editMode
                                  ? `/interview-view/${answer_id}?mode=edit`
                                  : `/interview-view/${answer_id}`,
                                { state: { answerId: answer_id } },
                              )
                            }
                          >
                            {editMode ? '수정하기' : '다시보기'}
                          </WhiteButton>
                        </div>
                      </div>

                      {/* 🗑 삭제 버튼 (편집 모드) */}
                      {editMode && (
                        <button
                          type="button"
                          onClick={() => handleDelete(answer_id, question_id)}
                          aria-label="delete history"
                          className="cursor-pointer absolute -left-10 top-1/2 -translate-y-1/2 flex 
                          h-7 w-7 max-sm:h-5 max-sm:w-5 max-sm:-left-7
                 items-center justify-center rounded-3xl border
                 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <FontAwesomeIcon icon={faXmark} />
                        </button>
                      )}
                    </motion.li>
                    // ---------------------------------------------------------------------------------------------------------------------------------
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
            <div className="absolute right-0 top-0 max-lg:hidden">
              <Button onClick={toggleEditMode}>
                {editMode ? '수정 내용 저장하기' : '히스토리 수정'}
              </Button>
            </div>

            {/* 페이지네이션 -------------------------------------------------------------------------------*/}
            <div className="flex justify-center w-full gap-1 sm:gap-2 text-sm sm:text-base max-sm:pb-7">
              <button
                onClick={() => handlePageChange(Math.max(pageParam - 1, 1))}
                disabled={pageParam === 1}
                className="px-2 py-1 sm:px-4 sm:py-2 rounded bg-gray-40 text-black text-sm sm:text-base
               disabled:opacity-50 cursor-pointer"
              >
                이전
              </button>

              {Array.from(
                { length: Math.ceil(total / PAGE_SIZE) },
                (_, idx) => {
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
                },
              )}

              <button
                onClick={() =>
                  handlePageChange(
                    Math.min(pageParam + 1, Math.ceil(total / PAGE_SIZE)),
                  )
                }
                disabled={pageParam >= Math.ceil(total / PAGE_SIZE)}
                className="px-2 py-1 sm:px-4 sm:py-2 rounded bg-gray-40 text-black text-sm sm:text-base
               disabled:opacity-50 cursor-pointer"
              >
                다음
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
