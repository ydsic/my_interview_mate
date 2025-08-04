import { supabase } from '../supabaseClient';

// 유저 전체 조회
export async function fetchUsers(page: number = 1, perPage: number = 10) {
  // console.log('페이지네이션 : ', page);
  const functionName = `get-all-users?page=${page}&perPage=${perPage}`;
  return await supabase.functions.invoke(functionName);
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
export async function fetchQuestions(
  page: number = 1,
  perPage: number,
  filter?: { category?: string; topic?: string },
) {
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  let query = supabase
    .from('questions')
    .select('*', { count: 'exact' })
    .range(from, to)
    .order('question_id', { ascending: true });

  if (filter?.category) query = query.eq('category', filter.category);
  if (filter?.topic) query = query.eq('topic', filter.topic);

  const { data, count, error } = await query;
  if (error) throw error;

  return {
    questions: data ?? [],
    total: count ?? 0,
  };
}

// 질문 추가
export async function addQuestion(data: {
  category: string;
  topic: string;
  content: string;
}) {
  return await supabase.from('questions').insert([data]);
}

// 질문 수정
export async function updateQuestion(
  question_id: number,
  data: { content: string },
) {
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

// 카테고리 정보 가져오기
export async function fetchCategories() {
  const { data, error } = await supabase
    .from('questions')
    .select('category', { count: 'exact' })
    .neq('category', null)
    .order('category', { ascending: true });

  if (error) throw error;

  const uniqueCategories = [...new Set(data.map((q) => q.category))];
  return uniqueCategories;
}

// 토픽 정보 가져오기
export async function fetchTopics(category: string) {
  const { data, error } = await supabase
    .from('questions')
    .select('topic')
    .eq('category', category)
    .neq('topic', null);

  if (error) throw error;
  return [...new Set(data.map((row) => row.topic))];
}
