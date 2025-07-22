import { supabase } from '../supabaseClient';

// 카테고리와 토픽별로 질문 받아오는 API (중복 ID 제외)
export const getQuestionsByCategoryAndTopic = async (
  category: string,
  topic: string,
  limit = 3,
  excludeIds: number[] = [],
) => {
  const excludeList = excludeIds.length ? excludeIds : [0];
  // 1) 남은 질문 개수부터 구하기,
  const { count, error: countErr } = await supabase
    .from('questions')
    .select('*', { count: 'exact', head: true })
    .eq('category', category)
    .eq('topic', topic)
    .not('question_id', 'in', `(${excludeList.join(',')})`);
  if (countErr) throw countErr;
  // 2) 남은 개수 기준으로 Offset
  const maxOffset = Math.max(0, (count ?? 0) - limit);
  const offset = Math.floor(Math.random() * (maxOffset + 1));

  // 3) 실제 데이터 가져올 때 똑같이 excludeIds 적용
  const { data, error } = await supabase
    .from('questions')
    .select('question_id, category, topic, content')
    .eq('category', category)
    .eq('topic', topic)
    .not('question_id', 'in', `(${excludeIds.join(',')})`)
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return data;
};
