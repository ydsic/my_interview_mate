import { supabase } from '../supabaseClient';

// 카테고리와 토픽별로 질문 받아오는 API (중복 ID 제외)
export const getQuestionsByCategoryAndTopic = async (
  category: string,
  topic: string,
  limit = 3,
  excludeIds: number[] = [],
) => {
  const { count, error: countErr } = await supabase
    .from('questions')
    .select('*', { count: 'exact', head: true })
    .eq('category', category)
    .eq('topic', topic);

  if (countErr) throw countErr;

  const maxOffset = Math.max(0, (count ?? 0) - limit);
  const offset = Math.floor(Math.random() * (maxOffset + 1));

  const { data, error } = await supabase
    .from('questions')
    .select('question_id, category, topic, content')
    .eq('category', category)
    .eq('topic', topic)
    .not('question_id', 'in', `(${excludeIds.join(',') || 0})`)
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return data;
};
