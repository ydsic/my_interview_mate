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

// 즐겨찾기 조회
export async function selectBookMarks(userId: string, page: number, limit = 4) {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await supabase
    .from('user_bookmarked_questions_with_feedback')
    .select(
      'question_id, question_content, question_category,bookmarked_at, average_score',
      { count: 'exact' },
    )
    .eq('user_id', userId)
    .range(from, to);

  if (error) {
    throw new Error(`북마크 질문 조회 에러 발생 : ${error.message}`);
  }

  return {
    data,
    total: count ?? 0,
  };
}

// answer_id 찾기
export async function selectBookmarkedAnswer(
  userId: string,
  questionId: number,
) {
  const { data: answerIdData, error: answerIdError } = await supabase
    .from('user_bookmarked_answers')
    .select('answer_id')
    .eq('user_id', userId)
    .eq('question_id', questionId);

  if (answerIdError) {
    throw new Error(`북마크 answer id 조회 오류 :  ${answerIdError.message}`);
  }

  return answerIdData[0].answer_id;
}

// feedback_id 찾기
export async function selectFeedbackData(questionId: number, answerId: string) {
  const { data: feedbackData, error: feedbackError } = await supabase
    .from('feedback')
    .select(
      'average, feedback, summary, logic_score, clarity_score, technical_score, depth_score, structure_score',
    )
    .eq('questions_id', questionId)
    .eq('answers_id', answerId);

  if (feedbackError) {
    throw new Error(`피드백 조회 에러 발생 : ${feedbackError.message}`);
  }

  return feedbackData[0];
}

// 즐겨찾기 되어있는지 확인

export async function Bookmarked(userId: string, questionId: number) {
  const { data, error } = await supabase
    .from('bookmark')
    .select('question_id')
    .eq('user_id', userId)
    .eq('question_id', questionId)
    .maybeSingle();

  if (error) {
    throw new Error(`북마크 여부 조회 오류: ${error.message}`);
  }

  return !!data;
}
