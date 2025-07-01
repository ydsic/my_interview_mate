import { supabase } from '../supabaseClient';

// 유저 전체 조회
export async function fetchUsers() {
  return await supabase.from('user').select('*');
}

// 유저 정보 수정
export async function updateUser(user_id: string, data: any) {
  return await supabase.from('user').update(data).eq('user_id', user_id);
}

// 유저 삭제
export async function deleteUser(user_id: string) {
  return await supabase.from('user').delete().eq('user_id', user_id);
}

// 질문 전체 조회
export async function fetchQuestions() {
  return await supabase.from('questions').select('*');
}

// 질문 추가
export async function addQuestion(data: any) {
  return await supabase.from('question').insert([data]);
}

// 질문 수정
export async function updateQuestion(question_id: number, data: any) {
  return await supabase
    .from('questions')
    .update(data)
    .eq('question_id', question_id);
}

// 질문 삭제
export async function deleteQuestion(question_id: number) {
  return await supabase
    .from('questions')
    .delete()
    .eq('question_id', question_id);
}
