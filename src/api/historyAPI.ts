import { supabase } from '../supabaseClient';

export interface InterviewHistoryItem {
  answer_id: number;
  question_id: number;
  created_at: string;
  updated_at: string;
  question: { content: string; category: string };
  feedback: { average: number } | null;
}

// 면접 기록 조회 api
export async function getInterviewHistory(
  userEmail: string,
  page: number,
  limit = 4,
) {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await supabase
    .from('answers')
    .select(
      `
      answer_id,
      question_id,
      created_at,
      updated_at,                            
      questions!answers_question_id_fkey (content, category),
      feedback!feedback_answers_id_fkey(average)`,
      { count: 'exact' },
    )
    .eq('user_id', userEmail)
    .order('updated_at', { ascending: false }) // 최신 수정 순으로 정렬
    .range(from, to);
  console.log('history data:', data);

  if (error) throw error;
  const items = (data ?? []).map((item: any) => {
    console.log('item feedback:', item.feedback);
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
      question_id: item.question_id,
      created_at: item.created_at,
      updated_at: item.updated_at,
      question: q ?? { content: '알 수 없음', category: '' },
      feedback: f,
    };
  });

  return {
    data: items,
    total: count ?? 0,
  };
}

// 면접 기록 삭제 + 북마크도 같이 삭제됨 api
export async function deleteInterviewHistory(
  answerId: number,
  questionId: number,
  uwerId: string,
) {
  //feedback에서 먼저 삭제
  const { error: fbErr } = await supabase
    .from('feedback')
    .delete()
    .eq('answers_id', answerId);

  if (fbErr) {
    console.error('피드백 삭제 실패:', fbErr);
    throw fbErr;
  }

  //answers에서 삭제
  const { error: ansErr } = await supabase
    .from('answers')
    .delete()
    .eq('answer_id', answerId);

  if (ansErr) {
    console.error('답변 삭제 실패:', ansErr);
    throw ansErr;
  }

  // bookmark 삭제
  const { error: bmErr } = await supabase
    .from('bookmark')
    .delete()
    .eq('question_id', questionId);
  if (bmErr) {
    console.error('즐겨찾기 삭제 실패');
    throw bmErr;
  }
}
