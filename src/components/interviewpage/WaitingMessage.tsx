import { useEffect, useState } from 'react';
import { H2_content_title } from '../common/HTagStyle';

const quotes = [
  '하루하루가 새로운 인생이다',
  '실패는 성공의 어머니입니다.',
  '포기하지 않는 자만이 결국 웃는다.',
  '한 걸음씩 나아가면 언젠간 도착한다.',
  '어제의 네 자신보다 오늘의 네 자신을 믿어라.',
  '명언을 추가해 주세요',
];

export default function WaitingMessage() {
  const [quote, setQuote] = useState<string>('');

  useEffect(() => {
    const idx = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[idx]);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-15/70">
      <div className="flex flex-col items-center bg-white p-6 rounded-2xl shadow-xl w-full sm:mx-4 max-w-xl -mt-16">
        <div
          className="
            w-10 h-10 
            border-[5px] border-blue-500 
            border-t-transparent 
            rounded-full 
            animate-spin 
            mb-4
          "
        />
        <H2_content_title>피드백을 불러오는 중입니다...</H2_content_title>
        <blockquote className="italic text-gray-70 mt-3">“{quote}”</blockquote>
      </div>
    </div>
  );
}
