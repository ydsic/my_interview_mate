type setViewType = {
  setView: (view: 'main' | 'user' | 'question') => void;
};

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

export default function QuestionList({ setView }: setViewType) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [newContent, setNewContent] = useState('');
  const [adding, setAdding] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');

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
      alert('카테고리, 토픽, 질문 내용을 모두 입력하세요.');
      return;
    }

    setAdding(true);
    const res = await addQuestion({
      category: selectedCategory,
      topic: selectedTopic,
      content: newContent.trim(),
    });
    setAdding(false);
    if (res.error) {
      alert('질문 추가 실패: ' + res.error.message);
      return;
    }

    fetchQuestions().then((res) => {
      if (res.data) setQuestions(res.data);
    });
    setNewContent('');
  };

  const handleEditClick = (q: Question) => {
    setEditId(q.question_id);
    setEditContent(q.content);
  };

  const handleEditSave = async (question_id: number) => {
    if (!editContent.trim()) {
      alert('질문 내용을 입력하세요.');
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
    });
  };

  const handleEditCancel = () => {
    setEditId(null);
    setEditContent('');
  };

  const handleDelete = async (question_id: number) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    const res = await deleteQuestion(question_id);
    if (res.error) {
      alert('질문 삭제 실패: ' + res.error.message);
      return;
    }
    fetchQuestions().then((res) => {
      if (res.data) setQuestions(res.data);
    });
  };

  return (
    <div className="flex flex-col mx-auto mt-6 p-4 bg-white rounded-lg shadow border border-gray-200">
      <div
        className="flex items-center gap-2 cursor-pointer mb-4 text-gray-500 hover:text-blue-600 w-fit"
        onClick={() => setView('main')}
      >
        <FontAwesomeIcon icon={faCaretLeft} size={'lg'} />
        <H4_placeholder>뒤로가기</H4_placeholder>
      </div>

      <div className="mb-4 flex gap-4">
        <select
          className="border rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
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
          className="border rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
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
          className="border rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:blue-200 flex-1"
          placeholder="추가할 질문을 입력하세요."
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
        />
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md px-5 py-2 shadow-sm transition-colors duration-150 border border-blue-500 cursor-pointer"
          onClick={handleAddQuestion}
          disabled={adding}
        >
          추가
        </button>
      </div>
      <div>
        <ul className="flex rounded font-semibold text-gray-700 text-sm mb-1">
          <li className="flex-[0.9] text-center">#</li>
          <li className="flex-[2] text-center">카테고리</li>
          <li className="flex-[2] text-center">토픽</li>
          <li className="flex-[9] text-center pl-5">질문 내용</li>
          <li className="flex-[1.1] text-center">설정</li>
        </ul>
        {questions.map((q, idx) => (
          <ul
            key={q.question_id}
            className="flex border-b last:border-b-0 hover:bg-gray-50 text-sm items-center"
          >
            <li className="flex-[0.9] py-2 text-center text-gray-500">{idx}</li>
            <li className="flex-[2] text-center">{q.category}</li>
            <li className="flex-[2] text-center">{q.topic}</li>
            <li className="flex-[9] text-left pl-5">
              {editId === q.question_id ? (
                <input
                  className="border rounded px-2 py-1 w-full"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  autoFocus
                />
              ) : (
                q.content
              )}
            </li>
            <li className="flex-[1.1]">
              <div className="flex justify-center">
                {editId === q.question_id ? (
                  <>
                    <button
                      className="text-md font-bold text-green-600 px-2 py-1 hover:underline cursor-pointer"
                      onClick={() => handleEditSave(q.question_id)}
                    >
                      저장
                    </button>
                    <button
                      className="text-md font-bold text-gray-500 px-2 py-1 hover:underline cursor-pointer"
                      onClick={handleEditCancel}
                    >
                      취소
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="text-md font-bold text-blue-500 px-2 py-1 hover:underline cursor-pointer"
                      onClick={() => handleEditClick(q)}
                    >
                      수정
                    </button>
                    <button
                      className="text-md font-bold text-red-500 px-2 py-1 hover:underline cursor-pointer"
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
