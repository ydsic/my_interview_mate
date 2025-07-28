interface User {
  user_id: string;
  email: string;
  nickname: string;
  created_at: string;
}

import { useState, useEffect } from 'react';
import { fetchUsers, updateUser, deleteUser } from '../../api/adminPageApi';
import { H4_placeholder } from '../common/HTagStyle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft, faUser } from '@fortawesome/free-solid-svg-icons';
import Button from '../common/Button';
import { useModal } from '../../hooks/useModal';
import { useToast } from '../../hooks/useToast';
import { useNavigate } from 'react-router-dom';
import { useUserDataStore } from '../../store/userData';

export default function UserList() {
  const storeUserData = useUserDataStore((state) => state.userData);

  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('info');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedNickname, setEditedNickname] = useState('');
  const [isNameError, setIsNameError] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const navigate = useNavigate();

  // 모달 추가
  const modal = useModal();

  // 토스트 메시지 추가
  const toast = useToast();

  // 페이지 네이션
  const PAGE_SIZE = 10;
  const PAGE_GROUP_SIZE = 5;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const currentGroup = Math.floor((page - 1) / PAGE_GROUP_SIZE);
  const startPage = currentGroup * PAGE_GROUP_SIZE + 1;
  const endPage = Math.min(startPage + PAGE_GROUP_SIZE - 1, totalPages);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await fetchUsers(page);
        console.log('[관리자 유저 목록] : ', data);
        if (error) {
          throw new Error('사용자 정보를 불러오는데 실패했습니다.');
        }
        setUsers(data.users || []);
        setTotal(data.total);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadUsers();
  }, [page]);

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setEditedNickname('');
    setIsEditing(false);
    setActiveTab('info');
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;
    try {
      if (editedNickname.trim() === '') {
        setIsNameError(true);
        return;
      }

      const { error } = await updateUser(selectedUser.user_id, {
        nickname: editedNickname,
      });

      if (error) {
        throw new Error('사용자 정보 수정에 실패했습니다.');
      }

      const { data } = await fetchUsers(page);
      setUsers(data.users || []);
      setSelectedUser((prev) =>
        prev ? { ...prev, nickname: editedNickname } : null,
      );
      setIsEditing(false);
      toast('사용자 정보가 수정되었습니다.', 'success');

      // 닉네임 수정한 사용자와 현재 로그인한 사용자가 일치하면 zustand 닉네임 값 변경
      if (selectedUser.user_id === storeUserData.user_id) {
        useUserDataStore.getState().setUserData({
          ...storeUserData,
          nickname: editedNickname,
        });
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    modal({
      title: '사용자 삭제',
      description: `${selectedUser.nickname} 사용자를 정말 삭제하시겠습니까?`,
      confirmText: '삭제',
      onConfirm: async () => {
        try {
          const { error } = await deleteUser(selectedUser.user_id);
          if (error) {
            throw new Error('사용자 삭제에 실패했습니다.');
          }

          setUsers(users.filter((u) => u.user_id !== selectedUser.user_id));
          setSelectedUser(null);
          toast('사용자가 삭제되었습니다.', 'success');
        } catch (err: any) {
          alert(err.message);
        }
      },
      onCancel: () => {},
    });
  };

  const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEditedNickname(value);

    if (value.trim() === '') {
      setIsNameError(true);
    } else {
      setIsNameError(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  if (isLoading) {
    return (
      <div className="flex h-[85vh] bg-slate-50">
        <div className=" flex flex-col flex-1 w-full bg-white border-r border-slate-200 shadow-sm justify-center items-center  gap-5">
          <div className="w-10 h-10 border-[5px] border-gray-70 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-gray-85"> 로딩중 ... </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-500 bg-red-50 rounded-lg border border-red-200">
        {error}
      </div>
    );
  }

  return (
    <div className="flex  h-[85vh] bg-slate-50">
      <div className="w-1/4 flex flex-col bg-white border-r border-slate-200 overflow-y-auto shadow-sm">
        <div className="sticky top-0 bg-white p-6 border-b border-slate-100 flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer text-slate-500 hover:text-[#427CF5] transition-colors duration-200 w-fit"
            onClick={() => navigate('/admin')}
          >
            <FontAwesomeIcon icon={faCaretLeft} size={'lg'} />
            <H4_placeholder>뒤로가기</H4_placeholder>
          </div>
          <H4_placeholder>사용자 목록 {`(총 ${total}명)`}</H4_placeholder>
        </div>
        <div className="flex flex-1 flex-col justify-between pb-5">
          <ul className="p-2">
            {users.map((user) => (
              <li
                key={user.user_id}
                className={`p-4 m-2 cursor-pointer rounded-lg transition-all duration-100 hover:bg-slate-50 ${
                  selectedUser?.user_id === user.user_id
                    ? 'bg-slate-100 border-l-4 border-[#427CF5] shadow-sm'
                    : 'hover:shadow-sm'
                }`}
                onClick={() => handleUserSelect(user)}
              >
                <div className="font-medium text-slate-800">
                  {user.nickname || user.email}
                </div>
                {user.nickname && (
                  <div className="text-sm text-slate-500 mt-1">
                    {user.email}
                  </div>
                )}
              </li>
            ))}
          </ul>
          {/* 페이지네이션 */}
          <div className="flex justify-center items-center gap-2 ">
            <button
              onClick={() => handlePageChange(1)}
              disabled={page === 1}
              className="px-2 py-1 text-sm rounded bg-gray-40 text-black disabled:opacity-50 cursor-pointer"
            >
              &laquo;
            </button>

            <button
              onClick={() => handlePageChange(Math.max(startPage - 1, 1))}
              disabled={page <= PAGE_GROUP_SIZE}
              className="px-2 py-1 text-sm rounded bg-gray-40 text-black disabled:opacity-50 cursor-pointer"
            >
              &lsaquo;
            </button>

            {/* 페이지 번호 */}
            {Array.from({ length: endPage - startPage + 1 }, (_, idx) => {
              const pageNumber = startPage + idx;
              const isCurrent = pageNumber === page;
              return (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`w-8 h-8 rounded text-sm font-medium cursor-pointer ${
                    isCurrent
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}

            <button
              onClick={() =>
                handlePageChange(Math.min(endPage + 1, totalPages))
              }
              disabled={endPage >= totalPages}
              className="px-2 py-1 text-sm rounded bg-gray-40 text-black disabled:opacity-50 cursor-pointer"
            >
              &rsaquo;
            </button>

            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={page === totalPages}
              className="px-2 py-1 text-sm rounded bg-gray-40 text-black disabled:opacity-50 cursor-pointer "
            >
              &raquo;
            </button>
          </div>
        </div>
      </div>

      <div className="w-3/4 p-6 bg-white">
        {selectedUser ? (
          <div className="h-full">
            <div className="flex border-b border-slate-200 mb-6">
              <button
                className={`py-3 px-6 font-medium transition-all duration-200 border-b-2 ${
                  activeTab === 'info'
                    ? 'border-[#427CF5] text-slate-800 '
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
                onClick={() => setActiveTab('info')}
              >
                사용자 정보
              </button>
            </div>

            <div className="mt-4">
              {activeTab === 'info' && (
                <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
                  <H4_placeholder className="text-slate-800 mb-6">
                    사용자 상세 정보
                  </H4_placeholder>
                  <div className="space-y-6">
                    <div className="flex items-center">
                      <span className="font-medium text-slate-700 w-20">
                        Email:
                      </span>
                      <span className="text-slate-600 ml-4">
                        {selectedUser.email}
                      </span>
                    </div>
                    <div className="flex items-start">
                      <span className="font-medium text-slate-700 w-20">
                        Nickname:
                      </span>
                      {isEditing ? (
                        <div className="flex flex-col ml-4">
                          <input
                            type="text"
                            value={editedNickname}
                            placeholder={selectedUser.nickname}
                            onChange={onChangeName}
                            maxLength={15}
                            className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all duration-200"
                          />
                          {isNameError && (
                            <p className="text-sm text-red-500 mt-1">
                              * 이름은 공백으로 설정할 수 없습니다.
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-600 ml-4">
                          {selectedUser.nickname}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium text-slate-700 w-20">
                        가입일:
                      </span>
                      <span className="text-slate-600 ml-4">
                        {new Date(selectedUser.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="mt-8 flex space-x-3">
                    {isEditing ? (
                      <>
                        <Button onClick={handleUpdateUser}>저장</Button>
                        <Button
                          onClick={() => {
                            setIsEditing(false);
                            setEditedNickname('');
                          }}
                        >
                          취소
                        </Button>
                      </>
                    ) : (
                      <Button onClick={() => setIsEditing(true)}>수정</Button>
                    )}
                    <Button onClick={handleDeleteUser}>삭제</Button>
                  </div>
                </div>
              )}
              {activeTab === 'tab2' && (
                <div className="p-8 bg-white rounded-xl border border-slate-200 shadow-sm">
                  <p className="text-slate-600">탭 2 컨텐츠</p>
                </div>
              )}
              {activeTab === 'tab3' && (
                <div className="p-8 bg-white rounded-xl border border-slate-200 shadow-sm">
                  <p className="text-slate-600">탭 3 컨텐츠</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full flex-col gap-3">
            <FontAwesomeIcon icon={faUser} size="3x" />
            <p className="text-slate-500 font-medium">사용자를 선택해주세요.</p>
            <p className="text-slate-400 text-sm">
              좌측 목록에서 사용자를 클릭하여 상세 정보를 확인할 수 있습니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
