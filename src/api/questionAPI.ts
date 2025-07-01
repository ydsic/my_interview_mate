import { supabase } from '../supabaseClient';

// 카테고리와 토픽별로 질문 받아오는 API
export const getQuestionsByCategoryAndTopic = async (
  category: string,
  topic: string,
) => {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('category', category)
    .eq('topic', topic);

  if (error) throw error;
  return data;
};
