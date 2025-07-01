// import { faQuestion, faUsers } from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// export default function AdminPage() {
//   return (
//     <div className="h-full bg-gray-50 flex justify-center items-center gap-8">
//       <div className="w-96 h-96 bg-white border-2 border-gray-200 flex flex-col justify-center items-center rounded-2xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
//         <FontAwesomeIcon icon={faUsers} size="3x" />
//         <h2 className="text-xl font-semibold text-gray-700">
//           유저 정보 리스트
//         </h2>
//         <p className="text-sm text-gray-500 mt-2">사용자 관리 및 편집</p>
//       </div>

//       <div className="w-96 h-96 bg-white border-2 border-gray-200 flex flex-col justify-center items-center rounded-2xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
//         <FontAwesomeIcon icon={faQuestion} size="3x" />
//         <h2 className="text-xl font-semibold text-gray-700">질문 리스트</h2>
//         <p className="text-sm text-gray-500 mt-2">질문 관리 및 편집</p>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from 'react';
import {
  fetchUsers,
  updateUser,
  deleteUser,
  fetchQuestions,
  addQuestion,
  updateQuestion,
  deleteQuestion,
} from '../api/adminPageApi';

interface User {
  user_id: string;
  nickname: string | null;
  profile_img: string;
  job: string;
  goal: string;
  admin: boolean | null;
  created_at: string;
}

interface Question {
  question_id: number;
  category: string;
  topic: string;
  content: string;
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [editQuestion, setEditQuestion] = useState<Question | null>(null);
  const [newQuestion, setNewQuestion] = useState<Omit<Question, 'question_id'>>(
    {
      category: '',
      topic: '',
      content: '',
    },
  );

  const fetchAll = async () => {
    const usersRes = await fetchUsers();
    setUsers(usersRes.data || []);
    const questionsRes = await fetchQuestions();
    setQuestions(questionsRes.data || []);
  };
  useEffect(() => {
    fetchAll();
  }, []);

  useEffect(() => {
    fetchUsers().then((res) => setUsers(res.data || []));
    fetchQuestions().then((res) => setQuestions(res.data || []));
  }, []);

  const handleUserUpdate = async (user: User) => {
    await updateUser(user.user_id, user);
    fetchUsers().then((res) => setUsers(res.data || []));
    setEditUser(null);
  };

  const handleUserDelete = async (user_id: string) => {
    await deleteUser(user_id);
    fetchUsers().then((res) => setUsers(res.data || []));
  };

  const handleAddQuestion = async () => {
    await addQuestion(newQuestion);
    fetchQuestions().then((res) => setQuestions(res.data || []));
    setNewQuestion({ category: '', topic: '', content: '' });
  };

  const handleQuestionUpdate = async (q: Question) => {
    await updateQuestion(q.question_id, q);
    fetchQuestions().then((res) => setQuestions(res.data || []));
    setEditQuestion(null);
  };

  const handleQuestionDelete = async (question_id: number) => {
    await deleteQuestion(question_id);
    fetchQuestions().then((res) => setQuestions(res.data || []));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          관리자 대시보드
        </h1>

        {/* 사용자 관리 섹션 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              👤 사용자 관리
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    사용자 ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    닉네임
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    프로필 이미지
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    직업
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    목표
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    관리자
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    가입일
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((u) =>
                  editUser?.user_id === u.user_id ? (
                    <tr key={u.user_id} className="bg-blue-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {u.user_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={editUser.nickname ?? ''}
                          onChange={(e) =>
                            setEditUser({
                              ...editUser,
                              nickname: e.target.value,
                            })
                          }
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={editUser.profile_img}
                          onChange={(e) =>
                            setEditUser({
                              ...editUser,
                              profile_img: e.target.value,
                            })
                          }
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={editUser.job}
                          onChange={(e) =>
                            setEditUser({ ...editUser, job: e.target.value })
                          }
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={editUser.goal}
                          onChange={(e) =>
                            setEditUser({ ...editUser, goal: e.target.value })
                          }
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          checked={editUser.admin === true}
                          onChange={(e) =>
                            setEditUser({
                              ...editUser,
                              admin: e.target.checked,
                            })
                          }
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {u.created_at}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleUserUpdate(editUser)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm transition-colors"
                        >
                          저장
                        </button>
                        <button
                          onClick={() => setEditUser(null)}
                          className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded-md text-sm transition-colors"
                        >
                          취소
                        </button>
                      </td>
                    </tr>
                  ) : (
                    <tr key={u.user_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {u.user_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            className="h-8 w-8 rounded-full mr-3"
                            src={u.profile_img}
                            alt=""
                          />
                          <span className="text-sm text-gray-900">
                            {u.nickname}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <img
                          className="h-8 w-8 rounded-full"
                          src={u.profile_img}
                          alt=""
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {u.job}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {u.goal}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            u.admin
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {u.admin ? '관리자' : '일반사용자'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {u.created_at}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => setEditUser(u)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm transition-colors"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => handleUserDelete(u.user_id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm transition-colors"
                        >
                          삭제
                        </button>
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 질문 관리 섹션 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              💬 질문 관리
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    질문 ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    카테고리
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    주제
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    내용
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {questions.map((q) =>
                  editQuestion?.question_id === q.question_id ? (
                    <tr key={q.question_id} className="bg-blue-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {q.question_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={editQuestion.category}
                          onChange={(e) =>
                            setEditQuestion({
                              ...editQuestion,
                              category: e.target.value,
                            })
                          }
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={editQuestion.topic}
                          onChange={(e) =>
                            setEditQuestion({
                              ...editQuestion,
                              topic: e.target.value,
                            })
                          }
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={editQuestion.content}
                          onChange={(e) =>
                            setEditQuestion({
                              ...editQuestion,
                              content: e.target.value,
                            })
                          }
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleQuestionUpdate(editQuestion)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm transition-colors"
                        >
                          저장
                        </button>
                        <button
                          onClick={() => setEditQuestion(null)}
                          className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded-md text-sm transition-colors"
                        >
                          취소
                        </button>
                      </td>
                    </tr>
                  ) : (
                    <tr key={q.question_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {q.question_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {q.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {q.topic}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {q.content}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => setEditQuestion(q)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm transition-colors"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => handleQuestionDelete(q.question_id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm transition-colors"
                        >
                          삭제
                        </button>
                      </td>
                    </tr>
                  ),
                )}

                {/* 새 질문 추가 행 */}
                <tr className="bg-green-50 border-t-2 border-green-200">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-800">
                    신규
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      placeholder="카테고리 입력"
                      className="w-full px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      value={newQuestion.category}
                      onChange={(e) =>
                        setNewQuestion({
                          ...newQuestion,
                          category: e.target.value,
                        })
                      }
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      placeholder="주제 입력"
                      className="w-full px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      value={newQuestion.topic}
                      onChange={(e) =>
                        setNewQuestion({
                          ...newQuestion,
                          topic: e.target.value,
                        })
                      }
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      placeholder="질문 내용 입력"
                      className="w-full px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      value={newQuestion.content}
                      onChange={(e) =>
                        setNewQuestion({
                          ...newQuestion,
                          content: e.target.value,
                        })
                      }
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={handleAddQuestion}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm transition-colors flex items-center gap-1"
                    >
                      ➕ 추가
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
