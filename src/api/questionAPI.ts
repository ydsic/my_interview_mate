import { supabase } from '../supabaseClient';

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
