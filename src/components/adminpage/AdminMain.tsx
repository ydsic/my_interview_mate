interface AdminPageProps {
  onUserClick?: () => void;
  onQuestionClick?: () => void;
}

import { faQuestion, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

export default function AdminMainPage({
  onUserClick,
  onQuestionClick,
}: AdminPageProps) {
  return (
    <div className="h-full bg-gray-50 flex flex-wrap justify-center items-center gap-8 p-4">
      <Link
        to="user"
        className="w-full sm:w-80 lg:w-96 h-64 sm:h-80 lg:h-96 
        bg-white border-2 border-gray-200 
        flex flex-col justify-center items-center 
        rounded-2xl shadow-lg hover:shadow-xl 
        transition-shadow cursor-pointer"
        onClick={onUserClick}
      >
        <FontAwesomeIcon icon={faUsers} size="3x" />
        <h2 className="text-xl font-semibold text-gray-700 mt-3">
          유저 정보 리스트
        </h2>
      </Link>

      <Link
        to="question"
        className="w-full sm:w-80 lg:w-96 h-64 sm:h-80 lg:h-96 
        bg-white border-2 border-gray-200 
        flex flex-col justify-center items-center 
        rounded-2xl shadow-lg hover:shadow-xl 
        transition-shadow cursor-pointer"
        onClick={onQuestionClick}
      >
        <FontAwesomeIcon icon={faQuestion} size="3x" />
        <h2 className="text-xl font-semibold text-gray-700 mt-3">
          질문 리스트
        </h2>
      </Link>
    </div>
  );
}
