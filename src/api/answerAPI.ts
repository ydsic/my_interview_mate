import { supabase } from '../supabaseClient';

// 답변 데이터 입력 api
export const saveAnswer = async (question_id: number, content: string) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated for saving answer.');

  const { data, error } = await supabase
    .from('answers')
    .upsert([{ user_id: user.id, question_id, content }], {
      onConflict: 'user_id,question_id',
    })
    .select()
    .single();

  if (error) throw error;
  return data.answer_id;
};
