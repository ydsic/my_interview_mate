export type CategoryKey = 'react' | 'cs' | 'git';

export interface InterviewQuestionProps {
  category: CategoryKey;
  question: string;
  isBookmarked?: boolean;
  onToggleBookmark?: () => void;
}
