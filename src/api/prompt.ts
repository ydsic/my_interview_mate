import { supabase } from '../supabaseClient';

export async function OpenAIApi(
  question: string,
  input: string,
  signal?: AbortSignal,
) {
  const { data } = await supabase.auth.getSession();
  const jwt = data?.session?.access_token;
  if (!jwt) throw new Error('로그인 정보가 없습니다.');

  const res = await fetch(
    'https://vlowdzoigoyaudsydqam.functions.supabase.co/openai-chat',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({ question, input }),
      signal,
    },
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const feedbackObj = await res.json();
  console.log(feedbackObj);
  return feedbackObj;
}

answer: 'Virtual DOM은 React에서 사용하는 개념으로, 실제 DOM의 가상 버전입니다. React는 UI의 변경 사항을 Virtual DOM에 먼저 반영해서 변경 내용을 계산한 뒤, 실제 DOM과 비교하여 필요한 부분만 최소한으로 업데이트해 성능을 최적화합니다. 실제 DOM은 브라우저가 렌더링하는 문서 구조 자체를 의미하며, Virtual DOM은 메모리 상에 존재하는 가벼운 객체 구조라는 점에서 차이가 있습니다.';
average: 5;
feedback: [
  'Virtual DOM과 실제 DOM의 차이점을 구체적으로 설명해야 합니다.',
  'React에서 Virtual DOM을 사용하는 이유와 장점을 언급해 보세요.',
  '단어 한 개로만 답변하기보다 문장 단위로 답변을 작성해야 합니다.',
];
input: 'Dom';
question: 'React의 Virtual DOM이란 무엇이고, 실제 DOM과 어떤 차이가 있나요?';
scores: [10, 5, 5, 5, 0];
summary: '답변이 단어 하나로 구성되어 있어 질문에 대한 충분한 답변이 되지 못했습니다. 전혀 내용을 전달하지 못하며, 구체적인 설명이 필요합니다.';
