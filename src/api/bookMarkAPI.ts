import { supabase } from '../supabaseClient';

// 즐겨찾기 등록
export async function insertBookMark(userId: string, questionId: number) {
  // console.log('🔥 insert 호출 user:', userId, '| question:', questionId);
  const { error: insertError } = await supabase.from('bookmark').insert({
    user_id: userId,
    question_id: questionId,
    created_at: new Date(),
  });

  if (insertError) {
    throw new Error(`북마크 등록 에러 발생 : ${insertError.message}`);
  }
}

//즐겨찾기 삭제
export async function deleteBookMark(userId: string, questionId: number) {
  const { error: deleteError } = await supabase
    .from('bookmark')
    .delete()
    .match({
      user_id: userId,
      question_id: questionId,
    });

  if (deleteError) {
    throw new Error(`북마크 삭제 에러 발생 : ${deleteError.message}`);
  }
}
