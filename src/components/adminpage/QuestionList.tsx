interface Question {
  question_id: number;
  category: string;
  topic: string;
  content: string;
}

import { useEffect, useState } from 'react';
import {
  fetchQuestions,
  addQuestion,
  updateQuestion,
  deleteQuestion,
} from '../../api/adminPageApi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft } from '@fortawesome/free-solid-svg-icons';
import { H4_placeholder } from '../common/HTagStyle';
import { useToast } from '../../hooks/useToast';
import { useModal } from '../../hooks/useModal';
import { useNavigate } from 'react-router-dom';

export default function QuestionList() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [newContent, setNewContent] = useState('');
  const [adding, setAdding] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');
  const navigate = useNavigate();

  const toast = useToast();
  const modal = useModal();

  const categoryTopicMap: Record<string, string[]> = {
    'front-end': ['react', 'javascript', 'nextjs'],
    cs: ['network', 'rendering'],
    git: ['git'],
  };

  useEffect(() => {
    fetchQuestions().then((res) => {
      if (res.data) setQuestions(res.data);
    });
  }, []);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value;
    setSelectedCategory(newCategory);
    if (!categoryTopicMap[newCategory].includes(selectedTopic)) {
      setSelectedTopic('');
    }
  };

  const handleAddQuestion = async () => {
    if (!selectedCategory || !selectedTopic || !newContent.trim()) {
      toast('카테고리, 토픽, 질문 내용 모두 입력해주세요!', 'info');
      return;
    }

    setAdding(true);
    try {
      const res = await addQuestion({
        category: selectedCategory,
        topic: selectedTopic,
        content: newContent.trim(),
      });
      if (res.error) throw res.error;
      toast('질문이 성공적으로 추가되었습니다.', 'success');

      const refreshed = await fetchQuestions();
      setQuestions(refreshed.data ?? []);
      setNewContent('');
    } catch (err: any) {
      toast('질문 추가 실패: ' + err.message, 'error');
    } finally {
      setAdding(false);
    }
  };

  const handleEditClick = (q: Question) => {
    setEditId(q.question_id);
    setEditContent(q.content);
  };

  const handleEditSave = async (question_id: number) => {
    if (!editContent.trim()) {
      toast('질문 내용을 입력하세요', 'info');
      return;
    }
    const res = await updateQuestion(question_id, {
      content: editContent.trim(),
    });
    if (res.error) {
      alert('질문 수정 실패: ' + res.error.message);
      return;
    }
    setEditId(null);
    setEditContent('');
    fetchQuestions().then((res) => {
      if (res.data) setQuestions(res.data);
      toast('수정 완료!', 'success');
    });
  };

  const handleEditCancel = () => {
    setEditId(null);
    setEditContent('');
  };

  const handleDelete = async (question_id: number) => {
    modal({
      title: '질문 삭제하기',
      description: '정말 삭제하시겠습니까?',
      confirmText: '삭제',
      onConfirm: async () => {
        try {
          if (!question_id) throw new Error('question_id 가 비었습니다.');
          const { error } = await deleteQuestion(question_id);
          if (error) throw error;

          toast('질문이 삭제되었습니다.', 'success');

          const { data } = await fetchQuestions();
          if (data) setQuestions(data);
          close();
        } catch (err: any) {
          if (err.code == '23503') {
            toast(
              '해당 질문에 대한 답변으로 인해 삭제가 불가능합니다.\n질문 삭제 이전에 관련 답변을 먼저 삭제해 주세요.',
              'error',
            );
          } else {
            toast(err.message ?? '질문 삭제에 실패했습니다.', 'error');
          }
          console.error(err);
        }
      },
      onCancel: () => {},
    });
  };

  return (
    <div className="flex flex-col mx-auto mt-6 p-6 bg-white rounded-xl shadow-sm border border-slate-200">
      <div
        className="flex items-center gap-2 cursor-pointer mb-6 text-slate-500 hover:text-slate-700 transition-colors duration-200 w-fit"
        onClick={() => navigate('/admin')}
      >
        <FontAwesomeIcon icon={faCaretLeft} size={'lg'} />
        <H4_placeholder>뒤로가기</H4_placeholder>
      </div>

      <div className="mb-6 flex gap-4">
        <select
          className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#427CF5] focus:border-[#427CF5] transition-all duration-200"
          required
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          <option value="" disabled>
            카테고리
          </option>
          {Object.keys(categoryTopicMap).map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <select
          className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#427CF5] focus:border-[#427CF5] transition-all duration-200"
          required
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.target.value)}
          disabled={!selectedCategory}
        >
          <option value="" disabled>
            토픽
          </option>
          {selectedCategory &&
            categoryTopicMap[selectedCategory].map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
        </select>
        <input
          className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#427CF5] focus:border-[#427CF5] transition-all duration-200 flex-1"
          placeholder="추가할 질문을 입력하세요."
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
        />
        <button
          className="bg-[#427CF5] hover:bg-[#3b70f4] text-white font-medium rounded-lg px-5 py-2 shadow-sm transition-colors duration-200 border border-[#427CF5] cursor-pointer"
          onClick={handleAddQuestion}
          disabled={adding}
        >
          추가
        </button>
      </div>
      <div>
        <ul className="flex rounded-lg font-medium text-slate-700 text-sm mb-2 bg-slate-50 py-3">
          <li className="flex-[0.8] text-center">#</li>
          <li className="flex-[2] text-center">카테고리</li>
          <li className="flex-[2] text-center">토픽</li>
          <li className="flex-[9] text-center pl-5">질문 내용</li>
          <li className="flex-[1.2] text-center">설정</li>
        </ul>
        {questions.map((q, idx) => (
          <ul
            key={q.question_id}
            className="flex border-b border-slate-200 last:border-b-0 hover:bg-slate-50 transition-colors duration-150 text-sm items-center"
          >
            <li className="flex-[0.8] py-3 text-center text-slate-500">
              {idx}
            </li>
            <li className="flex-[2] text-center text-slate-600">
              {q.category}
            </li>
            <li className="flex-[2] text-center text-slate-600">{q.topic}</li>
            <li className="flex-[9] text-left pl-5 py-3">
              {editId === q.question_id ? (
                <input
                  className="border border-slate-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#427CF5] focus:border-[#427CF5] transition-all duration-200"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  autoFocus
                />
              ) : (
                <span className="text-slate-800">{q.content}</span>
              )}
            </li>
            <li className="flex-[1.2]">
              <div className="flex justify-center gap-1">
                {editId === q.question_id ? (
                  <>
                    <button
                      className="text-sm font-medium text-emerald-600 px-2 py-1 hover:bg-emerald-50 rounded transition-colors duration-150 cursor-pointer"
                      onClick={() => handleEditSave(q.question_id)}
                    >
                      저장
                    </button>
                    <button
                      className="text-sm font-medium text-slate-500 px-2 py-1 hover:bg-slate-100 rounded transition-colors duration-150 cursor-pointer"
                      onClick={handleEditCancel}
                    >
                      취소
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="text-sm font-medium text-[#427CF5] px-2 py-1 hover:bg-blue-50 rounded transition-colors duration-150 cursor-pointer"
                      onClick={() => handleEditClick(q)}
                    >
                      수정
                    </button>
                    <button
                      className="text-sm font-medium text-red-500 px-2 py-1 hover:bg-red-50 rounded transition-colors duration-150 cursor-pointer"
                      onClick={() => handleDelete(q.question_id)}
                    >
                      삭제
                    </button>
                  </>
                )}
              </div>
            </li>
          </ul>
        ))}
      </div>
    </div>
  );
}
