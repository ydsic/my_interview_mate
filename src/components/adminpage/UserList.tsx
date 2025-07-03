type setViewType = {
  setView: (view: 'main' | 'user' | 'question') => void;
};

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { H4_placeholder } from '../common/HTagStyle';
import { faCaretLeft } from '@fortawesome/free-solid-svg-icons';

export default function UserList({ setView }: setViewType) {
  return (
    <div className="flex flex-col mx-auto mt-6 p-4 bg-white rounded-lg shadow border border-gray-200">
      <div
        className="flex items-center gap-2 cursor-pointer mb-4 text-gray-500 hover:text-blue-600 w-fit"
        onClick={() => setView('main')}
      >
        <FontAwesomeIcon icon={faCaretLeft} size={'lg'} />
        <H4_placeholder>뒤로가기</H4_placeholder>
      </div>
    </div>
  );
}
