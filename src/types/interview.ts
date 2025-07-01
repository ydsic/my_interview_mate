export type CategoryKey = 'front-end' | 'cs' | 'git';

export interface InterviewQuestionProps {
  category: CategoryKey;
  topic: string;
  question: string;
  isBookmarked?: boolean;
  onToggleBookmark?: () => void;
}
export type QuestionData = Pick<
  InterviewQuestionProps,
  'category' | 'question'
>;
