import { supabase } from '../supabaseClient';

// 답변 데이터 입력 api
export const saveAnswer = async (
  user_id: string,
  question_id: number,
  content: string,
) => {
  // insert, update 둘 다 가능한 upsert
  const { data, error } = await supabase
    .from('answers')
    .upsert([{ user_id, question_id, content }], {
      onConflict: 'user_id,question_id',
    })
    .select()
    .single();

  if (error) throw error;
  return data.answer_id;
};
