import { useEffect, useState } from 'react';
import { H2_content_title } from '../common/HTagStyle';

const quotes = [
  '하루하루가 새로운 인생이다',
  '실패는 성공의 어머니입니다.',
  '포기하지 않는 자만이 결국 웃는다.',
  '한 걸음씩 나아가면 언젠간 도착한다.',
  '어제의 네 자신보다 오늘의 네 자신을 믿어라.',
  '시작이 반이다',
  '고생 끝에 낙이 온다',
  '끝까지 가보면 길은 있다',
  '오늘의 노력이 내일의 나를 만든다',
  '멈추지 않으면 언젠가는 도착한다',
  '노력은 배신하지 않는다',
  '내 자신을 믿어라',
  '어리석은 질문이 위대한 아이디어를 부른다',
  '작은 의문이 큰 혁신을 부른다',
  '삶이 있는 한 희망은 있다',
  '일하는 시간과 노는 시간을 뚜렷이 구분하라',
  '고개 숙이지 마십시오. 세상을 똑바로 정면으로 바라보십시오',
  '겨울이 오면 봄이 멀지 않으리',
  '실패는 잊어라 그러나 그것이 준 교훈은 절대 잊으면 안된다',
  '계획 없는 목표는 그냥 바램에 불과하다',
  '인생은 짧다. 그러니 웃으며 살아라',
  '평생을 학습에 헌신하라. 성장하고 발전하라',
  '승리는 불가능할 때 더 가까워진다',
  '최고의 복수는 무시하고 성공하는 것이다',
  '당신이 할 수 있다고 믿든, 할 수 없다고 믿든, 맞습니다',
  '자신을 위해 생각하고, 남을 위해 행동하라',
  '목적 없는 삶은 허전하다',
  '사랑합니다',
  '생각은 사상이다. 사상은 행동이다. 행동은 습관이다',
  '가장 어두운 밤이 가장 빛나는 별을 만든다',
  '남들이 보는 모습보다 당신이 스스로를 어떻게 보느냐가 더 중요하다',
  '바람이 불지 않을 때는 노를 저어야 한다',
  '결단이 없다면 진정한 리더십도 없다',
  '경험이 많은 사람을 고용하되, 열정이 없는 사람은 고용하지 마라',
  '열정 없이 오래 가는 성공은 없다',
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
