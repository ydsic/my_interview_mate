import { useEffect, useMemo, useState } from 'react';
import { WhiteButton } from '../common/Button';
import {
  H2_content_title,
  H3_sub_detail,
  H4_placeholder,
} from '../common/HTagStyle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import { useUserDataStore } from '../../store/userData';
import {
  deleteBookMark,
  selectBookmarkedAnswer,
  selectBookMarks,
} from '../../api/bookMarkAPI';
import { useToast } from '../../hooks/useToast';
import { debounce } from 'lodash';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  cs: { bg: 'cs-bg-tag', text: 'cs-text-tag', question_bg: 'cs-bg' },
  git: { bg: 'git-bg-tag', text: 'git-text-tag', question_bg: 'git-bg' },
};

interface BookmarkedQuestions {
  question_id: number;
  question_content: string;
  question_category: string;
  bookmarked_at: string;
  average_score: number | null;
}

export default function Bookmark() {
  const [bookMarkList, setBookMarkList] = useState<BookmarkedQuestions[]>([]);
  // 페이지네이션
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = Number(searchParams.get('page')) || 1;
  const [total, setTotal] = useState<number>(0);
  const PAGE_SIZE = 4;
  const [direction, setDirection] = useState(0);

  const user_id = useUserDataStore((state) => state.userData.user_id);
  const toast = useToast();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  // 모달
  const modal = useModal();

  const fetchBookMarks = async (page: number) => {
    try {
      setIsLoading(true);
      const { data, total } = await selectBookMarks(user_id, page, PAGE_SIZE);
      // console.log(`[북마크 데이터] : `, )
      setBookMarkList(data);
      setTotal(total);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookMarks(pageParam);
  }, [user_id, pageParam]);

  const handleBookMark = useMemo(
    () =>
      debounce(async (questionId: number) => {
        modal({
          title: '즐겨찾기 삭제',
          description: '이 질문을 즐겨찾기에서 삭제하시겠습니까?',
          confirmText: '삭제',
          onConfirm: async () => {
            try {
              await deleteBookMark(user_id, questionId);
              toast('즐겨찾기에서 삭제했어요!', 'success');
              fetchBookMarks(pageParam);
            } catch (err: unknown) {
              console.error('[북마크 삭제 에러] : ', err);
              toast('즐겨찾기 삭제에 실패했어요.', 'error');
            }
          },
          onCancel: () => {},
        });
      }, 500),
    [user_id, pageParam, modal, toast],
  );

  const handleButtonClick = async (questionId: number) => {
    try {
      const answer_id = await selectBookmarkedAnswer(user_id, questionId);
      navigate(`/interview-view/${answer_id}`);
    } catch (err: unknown) {
      console.error('오류 : ', err);
    }
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
                        bg-white p-6 shadow-md 
                        flex flex-col 
                        gap-7 max-sm:gap-3 mb-5 justify-start min-h-[750px]"
      >
        {/* 제목 */}
        <H3_sub_detail>즐겨찾기 질문</H3_sub_detail>

        {/* 즐겨찾기 기록 불러오기 */}
        {isLoading && (
          <div className="flex flex-col flex-1 justify-center items-center text-gray-85 gap-5">
            <div className="w-10 h-10 border-[5px] border-gray-70 border-t-transparent rounded-full animate-spin mb-4" />
            <p> 로딩중 ... </p>
          </div>
        )}

        {!isLoading && bookMarkList.length === 0 && (
          <div className="py-20 text-center text-gray-70">
            <H2_content_title>아직 즐겨찾기한 질문이 없어요!</H2_content_title>
            <br />
            <span className="font-semibold mt-2">
              관심 있는 질문을 북마크해보세요 ⭐️
            </span>
          </div>
        )}

        {!isLoading && bookMarkList.length > 0 && (
          <>
            <motion.div
              layout
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="flex-grow"
            >
              <motion.ul
                layout
                className="relative space-y-3 pt-6 pb-13 max-sm:pb-5 flex-grow"
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  {bookMarkList.map((bookmark) => {
                    return (
                      <motion.li
                        key={`${bookmark.question_id}-${pageParam}`}
                        layout
                        custom={direction}
                        initial={{ opacity: 0, x: direction > 0 ? 40 : -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: direction > 0 ? -40 : 40 }}
                        transition={{ duration: 0.35 }}
                        className={clsx(
                          /* 📱 모바일: 2열·3행 그리드 */
                          'grid grid-rows-[auto_auto_auto] grid-cols-[1fr_auto] gap-y-2',
                          'rounded-xl bg-gray-50 shadow-sm p-4',
                          /* 🖥 PC: flex-row */
                          'sm:flex sm:items-center sm:justify-between sm:px-4 sm:py-5 sm:mb-5',
                        )}
                      >
                        <div className="flex flex-col gap-2 sm:flex-row sm:gap-4 sm:flex-1 sm:min-w-0 row-start-1 col-span-1">
                          {/* 카테고리 칩 ------------------------------------------- */}
                          <div className="flex items-center gap-2 justify-between">
                            <span
                              className={clsx(
                                'w-24 h-6 sm:w-30 sm:h-9 flex-none inline-flex items-center justify-center rounded-lg',
                                'text-xs sm:text-base font-semibold truncate',
                                CATEGORY_STYLES[bookmark.question_category]?.bg,
                                CATEGORY_STYLES[bookmark.question_category]
                                  ?.text,
                              )}
                            >
                              {bookmark.question_category === 'front-end'
                                ? 'Front-end'
                                : bookmark.question_category.toUpperCase()}
                            </span>

                            {/* 즐겨찾기 아이콘 */}
                            <button
                              onClick={() =>
                                handleBookMark(bookmark.question_id)
                              }
                              className="
                              row-start-1 col-start-2 justify-self-end
                              sm:satic sm:order-first sm:mr-2
                              text-[20px] sm:text-[30px] flex-none cursor-pointer"
                            >
                              <FontAwesomeIcon
                                icon={solidStar}
                                className="text-orange-100"
                              />
                            </button>
                          </div>

                          {/* 질문 내용 -------------------------------------------*/}
                          <div className="text-left sm:min-w-0">
                            <H3_sub_detail>
                              {bookmark.question_content}
                            </H3_sub_detail>

                            {/* 질문 내용 -------------------------------------------*/}
                            <H4_placeholder className="max-sm:hidden mt-4 text-gray-70 font-extralight">
                              {new Date(
                                bookmark.bookmarked_at,
                              ).toLocaleDateString()}
                            </H4_placeholder>
                          </div>
                        </div>

                        <div
                          className="
      row-start-3 col-span-2 flex items-center justify-between gap-4
      sm:row-auto sm:col-auto sm:justify-end sm:gap-6
    "
                        >
                          {/* 작성일 ------------------------------------------- 모바일 칩 아래 */}
                          <H4_placeholder className="sm:hidden text-gray-70 font-extralight">
                            {new Date(
                              bookmark.bookmarked_at,
                            ).toLocaleDateString()}
                          </H4_placeholder>

                          {/* 점수 + 다시보기 버튼 */}
                          <div className="flex items-center gap-4 shrink-0 whitespace-nowrap">
                            <H2_content_title>
                              {bookmark.average_score ?? '-'}점
                            </H2_content_title>
                            <WhiteButton
                              onClick={() =>
                                handleButtonClick(bookmark.question_id)
                              }
                            >
                              다시보기
                            </WhiteButton>
                          </div>
                        </div>
                      </motion.li>
                    );
                  })}
                </AnimatePresence>
              </motion.ul>
            </motion.div>

            {/* 페이지네이션 */}
            <div className="flex justify-center w-full gap-2">
              <button
                onClick={() => handlePageChange(Math.max(pageParam - 1, 1))}
                disabled={pageParam === 1}
                className="px-4 py-2 rounded bg-gray-40 text-black disabled:opacity-50 cursor-pointer"
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
                className="px-4 py-2 rounded bg-gray-40 text-black disabled:opacity-50 cursor-pointer"
              >
                다음
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
