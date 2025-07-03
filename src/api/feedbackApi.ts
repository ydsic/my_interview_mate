import { supabase } from '../supabaseClient';

export const saveFeedback = async (
  answerId: number,
  questionId: number,
  scores: number[],
  feedback: string,
  summary: string,
) => {
  // Generate a unique feedback_id using answerId, questionId, and a timestamp
  const feedbackId = `feedback_${answerId}_${questionId}_${Date.now()}`;

  const { error } = await supabase.from('feedback').insert([
    {
      feedback_id: feedbackId,
      answers_id: answerId,
      questions_id: questionId,
      average: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
      feedback,
      summary,
      logic_score: Math.round(scores[0]),
      clarity_score: Math.round(scores[1]),
      technical_score: Math.round(scores[2]),
      depth_score: Math.round(scores[3]),
      structure_score: Math.round(scores[4]),
    },
  ]);

  if (error) {
    console.error('피드백 저장 실패:', error);
    throw new Error('피드백 저장에 실패했어요.');
  }
};
