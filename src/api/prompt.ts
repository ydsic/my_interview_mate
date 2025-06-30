import { supabase } from '../supabaseClient';

export async function OpenAIApi(question: string, input: string) {
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
    },
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const feedbackObj = await res.json();
  return feedbackObj;
}
