import { supabase } from '../supabaseClient';

// 답변 데이터 입력 api
export const saveAnswer = async (
  user_id: string,
  question_id: number,
  content: string,
): Promise<{
  answer_id: number;
  created_at: string;
  updated_at: string;
}> => {
  // insert, update 둘 다 가능한 upsert
  const { data, error } = await supabase
    .from('answers')
    .upsert(
      [
        {
          user_id,
          question_id,
          content,
        },
      ],
      {
        onConflict: 'user_id,question_id',
      },
    )
    .select('answer_id, created_at, updated_at')
    .single();

  if (error) throw error;
  return {
    answer_id: data.answer_id,
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
};
