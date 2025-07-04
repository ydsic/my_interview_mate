import { useEffect, useState } from 'react';
import { WhiteButton } from '../common/Button';
import {
  H2_content_title,
  H3_sub_detail,
  H4_placeholder,
} from '../common/HTagStyle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons';
import { useUserDataStore } from '../../store/userData';
import { selectBookMarks } from '../../api/bookMarkAPI';

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
  const [isBookmarked, setIsBookMarked] = useState<boolean>(true);

  const user_id = useUserDataStore((state) => state.userData.user_id);

  useEffect(() => {
    const loadBookmarks = async () => {
      try {
        const bookmarks = await selectBookMarks(user_id);
        console.log('북마크 데이터 : ', bookmarks);
        setBookMarkList(bookmarks);
      } catch (e) {
        console.log(e);
      }
    };

    loadBookmarks();
  }, [user_id]);

  return (
    <div className="flex flex-col gap-10 mb-5 bg-white p-[30px] rounded-4xl shadow-md relative">
      <p className="font-semibold">즐겨찾기 질문</p>
      <ul>
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
                  <button className="text-[24px]">
                    <FontAwesomeIcon
                      icon={isBookmarked ? solidStar : regularStar}
                      className={
                        isBookmarked ? 'text-orange-100' : 'text-gray-100'
                      }
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
                          ? '프론트엔드'
                          : bookmark.question_category.toUpperCase()}
                      </span>

                      <H4_placeholder className="ml-2 text-gray-70 font-extralight">
                        {bookmark.bookmarked_at.slice(0, 10)}
                      </H4_placeholder>
                    </div>
                  </div>
                </div>

                {/* 오른쪽: 점수 & 다시보기 */}
                <div className="flex items-center gap-5 shrink-0">
                  <H2_content_title>
                    {bookmark.average_score}점
                  </H2_content_title>
                  <WhiteButton>다시보기</WhiteButton>
                </div>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
