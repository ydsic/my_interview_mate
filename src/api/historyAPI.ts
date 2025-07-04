import { supabase } from '../supabaseClient';

export interface InterviewHistoryItem {
  answer_id: number;
  created_at: string;
  updated_at: string;
  question: { content: string; category: string };
  feedback: { average: number } | null;
}

export async function getInterviewHistory(userEmail: string) {
  const { data, error } = await supabase
    .from('answers')
    .select(
      `
      answer_id,
      created_at,
      updated_at,                            
      questions!answers_question_id_fkey (content, category),
      feedback!feedback_answers_id_fkey(average)`,
    )
    .eq('user_id', userEmail)
    .order('updated_at', { ascending: false }); // 최신 수정 순으로 정렬
  console.log('raw history data:', data);

  if (error) throw error;
  return (data ?? []).map((item) => {
    console.log('raw item feedback:', item.feedback);
    // questions: 배열일 수도, 객체일 수도
    const q = Array.isArray(item.questions)
      ? item.questions[0]
      : item.questions;
    // feedback: 빈 배열일 수도, 평균값 객체 하나만 들어있을 수도
    const f =
      Array.isArray(item.feedback) && item.feedback.length > 0
        ? item.feedback[0]
        : null;

    return {
      answer_id: item.answer_id,
      created_at: item.created_at,
      updated_at: item.updated_at,
      question: q ?? { content: '알 수 없음', category: '' },
      feedback: f,
    };
  });
}
