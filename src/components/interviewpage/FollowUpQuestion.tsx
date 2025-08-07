import addQuestionIcon from '../../assets/ic-add-question.svg';
import type { QuestionData } from '../../types/interview';

import { H2_content_title, H4_placeholder } from '../common/HTagStyle';
interface FollowUpQuestionProps {
  questions: QuestionData[];
  onSelect: (question: QuestionData) => void;
  onClose: () => void;
}

export default function FolloUpQuestion({
  questions,
  onSelect,
}: FollowUpQuestionProps) {
  return (
    <div className="w-full rounded-xl border p-5 border-gray-300 bg-white shadow-sm  space-y-2 mt-4">
      <div className="mb-3">
        <div className="flex items-center gap-2">
          <img
            src={addQuestionIcon}
            alt="추가 질문하기 아이콘"
            className="w-6 h-6 max-sm:w-4 max-sm:h-4"
          />
          <H2_content_title className="font-semibold text-gray-100">
            추가 질문
          </H2_content_title>
        </div>
        <div>
          <H4_placeholder className="font-normal text-gray-500 mx-8 mb-3 max-sm:mx-1">
            질문을 클릭하면 해당 질문으로 이동합니다
          </H4_placeholder>
        </div>
      </div>
      {questions.length === 0 ? (
        <div className="flex justify-center items-center min-h-[120px] m-10 py-10 border max-sm:m-8 max-sm:py-8 border-gray-200 rounded-2xl">
          <H4_placeholder className="text-center text-g">
            추가 질문이 없습니다.
          </H4_placeholder>
        </div>
      ) : (
        questions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(q)}
            className="w-full text-left my-2 p-2 rounded-lg bg-orange-10 hover:bg-git-bg-tag border border-gray-300 transition cursor-pointer"
          >
            <div className="inline-block w-fit border border-gray-300 rounded-full px-3 m-1 text-gray-100 max-sm:text-xs">
              질문 {idx + 1}
            </div>
            <H4_placeholder className="text-gray-100 text-sm font-light px-2 py-1">
              {q.question}
            </H4_placeholder>
          </button>
        ))
      )}
    </div>
  );
}
