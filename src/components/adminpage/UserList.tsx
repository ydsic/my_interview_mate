type setViewType = {
  setView: (view: 'main' | 'user' | 'question') => void;
};

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function UserList({ setView }: setViewType) {
  return (
    <div>
      <div onClick={() => setView('main')}>
        <p>뒤로가기</p>
      </div>
    </div>
  );
}
