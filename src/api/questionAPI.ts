import { supabase } from '../supabaseClient';

// 카테고리와 토픽별로 질문 받아오는 API
export const getQuestionsByCategoryAndTopic = async (
  category: string,
  topic: string,
  limit = 4,
) => {
  const { count, error: countError } = await supabase
    .from('questions')
    .select('*', { count: 'exact', head: true })
    .eq('category', category)
    .eq('topic', topic);

  if (countError) throw countError;

  const maxOffset = Math.max(0, (count ?? 0) - limit);
  const offset = Math.floor(Math.random() * (maxOffset + 1));

  const { data, error } = await supabase
    .from('questions')
    .select('question_id, category, topic, content')
    .eq('category', category)
    .eq('topic', topic)
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return data;
};
