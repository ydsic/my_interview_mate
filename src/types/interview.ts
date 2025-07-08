export type CategoryKey = 'front-end' | 'cs' | 'git';

export interface InterviewQuestionProps {
  questionId: number;
  category: CategoryKey;
  topic: string;
  question: string;
  isBookmarked?: boolean;
  onToggleBookmark?: () => void;
  canBookmark?: boolean;
}

export interface QuestionData {
  questionId: number;
  category: CategoryKey;
  topic: string;
  question: string;
}
