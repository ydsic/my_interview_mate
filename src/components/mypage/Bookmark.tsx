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

interface BookmarkedQuesetions {
  question_id: number;
  question_content: string;
  question_category: string;
  bookmarked_at: string;
  average_score: number | null;
}

export default function Bookmark() {
  const [bookMarkList, setBookMarkList] = useState<BookmarkedQuesetions[]>([]);
  // 페이지네이션
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = Number(searchParams.get('page')) || 1;
  const [total, setTotal] = useState<number>(0);
  const PAGE_SIZE = 4;

  const user_id = useUserDataStore((state) => state.userData.user_id);
  const toast = useToast();
  const navigation = useNavigate();

  const fetchBookMarks = async (page: number) => {
    try {
      const { data, total } = await selectBookMarks(user_id, page, PAGE_SIZE);
      // console.log('[북마크 데이터] : ', data);
      setBookMarkList(data);
      setTotal(total);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchBookMarks(pageParam);
  }, [user_id, pageParam]);

  const handleBookMark = useMemo(
    () =>
      debounce(async (questionId: number) => {
        const confirmed = window.confirm(
          '이 질문을 즐겨찾기에서 삭제하시겠습니까?',
        );
        if (!confirmed) return;

        try {
          await deleteBookMark(user_id, questionId);
          toast('즐겨찾기에서 삭제했어요!', 'success');
          await fetchBookMarks(pageParam);
        } catch (err: unknown) {
          const error = err as Error;
          console.error('[북마크 삭제 에러] : ', error);
          toast('북마크 삭제에 실패했어요.', 'error');
        }
      }, 500),
    [user_id, pageParam],
  );

  const handleButtonClick = async (questionId: number) => {
    try {
      const answer_id = await selectBookmarkedAnswer(user_id, questionId);
      // console.log('answer_id : ', answer_id);
      navigation(`/interview-view/${answer_id}`);
    } catch (err: unknown) {
      const error = err as Error;
      console.error('오류 : ', error);
    }
  };

  const handlePageChange = (page: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', String(page));
    setSearchParams(newParams);
  };

  return (
    <div className="flex flex-col gap-7 mb-5 justify-between bg-white p-[30px] h-[750px] rounded-3xl shadow-md relative">
      <H3_sub_detail>즐겨찾기 질문</H3_sub_detail>
      <ul className="flex-1">
        {bookMarkList.length === 0 ? (
          <div className="text-center text-gray-70 py-10">
            아직 즐겨찾기한 질문이 없어요! <br />
            <span className="font-semibold">
              관심 있는 질문을 북마크해보세요 ⭐️
            </span>
          </div>
        ) : (
          bookMarkList.map((bookmark) => {
            const { bg, text } = CATEGORY_STYLES[
              bookmark.question_category
            ] ?? {
              bg: 'bg-gray-200',
              text: 'text-gray-700',
            };
            return (
              <li
                key={bookmark.question_id}
                className="flex items-center justify-between rounded-md bg-gray-50 shadow-sm px-4 py-5 mb-5"
              >
                <div className="flex w-full items-center gap-10 ml-3">
                  <button
                    className="text-[24px] cursor-pointer"
                    onClick={() => handleBookMark(bookmark.question_id)}
                  >
                    <FontAwesomeIcon
                      icon={solidStar}
                      className="text-orange-100"
                    />
                  </button>
                  {/* 면접 질문 / 카테고리 */}
                  <div className="mt-1 flex flex-col gap-4 max-w-[80%] grow">
                    <H3_sub_detail>{bookmark.question_content}</H3_sub_detail>
                    <div className="flex items-center gap-2 text-base font-semibold">
                      <span
                        className={`inline-flex justify-center items-center h-7 min-w-28 py-4 rounded-lg text-center ${bg} ${text}`}
                      >
                        {bookmark.question_category === 'front-end'
                          ? 'Front-end'
                          : bookmark.question_category.toUpperCase()}
                      </span>

                      <H4_placeholder className="ml-2 text-gray-70 font-extralight">
                        {new Date(bookmark.bookmarked_at).toLocaleDateString()}
                      </H4_placeholder>
                    </div>
                  </div>
                </div>

                {/* 오른쪽: 점수 & 다시보기 */}
                <div className="flex items-center gap-5 shrink-0">
                  <H2_content_title>
                    {bookmark.average_score}점
                  </H2_content_title>
                  <WhiteButton
                    onClick={() => handleButtonClick(bookmark.question_id)}
                  >
                    다시보기
                  </WhiteButton>
                </div>
              </li>
            );
          })
        )}
      </ul>
      <div className="flex justify-center items-center gap-4">
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
          onClick={() => {
            handlePageChange(
              Math.min(pageParam + 1, Math.ceil(total / PAGE_SIZE)),
            );
          }}
          disabled={pageParam >= Math.ceil(total / PAGE_SIZE)}
          className="px-4 py-2 rounded bg-gray-40 text-black disabled:opacity-50 cursor-pointer"
        >
          다음
        </button>
      </div>
    </div>
  );
}
