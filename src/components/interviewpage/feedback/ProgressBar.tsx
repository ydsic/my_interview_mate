type MyProgressBarProps = {
  score: number;
};

import ProgressBar from '@ramonak/react-progress-bar';

const MyProgressBar = ({ score }: MyProgressBarProps) => {
  return <ProgressBar completed={score} />;
};

export default MyProgressBar;

// 참고 npm package: https://www.npmjs.com/package/@ramonak/react-progress-bar
