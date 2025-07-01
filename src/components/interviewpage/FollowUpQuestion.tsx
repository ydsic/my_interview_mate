import addQuestionIcon from '../../assets/ic-add-question.svg';

import { H2_content_title, H4_placeholder } from '../common/HTagStyle';
interface FollowUpQuestionProps {
  questions: string[];
  onSelect: (question: string) => void;
  onClose: () => void;
}

export default function FolloUpQuestion({ questions }: FollowUpQuestionProps) {
  return (
    <div className="w-full rounded-xl border p-5 border-gray-300 bg-white shadow-sm  space-y-2 mt-4">
      <div className="mb-3">
        <div className="flex items-center gap-2">
          <img
            src={addQuestionIcon}
            alt="추가 질문하기 아이콘"
            className="w-6 h-6"
          />
          <H2_content_title className="font-semibold text-gray-100">
            추가 질문
          </H2_content_title>
        </div>
        <div>
          <H4_placeholder className="font-normal text-gray-500 mx-8 mb-3">
            질문을 클릭하면 해당 질문으로 이동합니다
          </H4_placeholder>
          <p></p>
        </div>
      </div>
      {questions.map((q, idx) => (
        <button
          key={idx}
          className="w-full text-left my-2 p-2 rounded-lg bg-orange-10 hover:bg-git-bg-tag border border-gray-300 transition cursor-pointer"
        >
          <div className="inline-block w-fit border border-gray-300 rounded-full px-3 m-1 text-gray-100">
            질문 {idx + 1}
          </div>
          <H4_placeholder className="text-gray-100 text-sm font-light px-2 py-1">
            {q}
          </H4_placeholder>
        </button>
      ))}
      <div className="flex justify-end pt-2"></div>
    </div>
  );
}
