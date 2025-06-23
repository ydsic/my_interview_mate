import { supabase } from '../supabaseClient';

export async function questionList(questionId: number, question: string) {
  return await supabase
    .from('question_data_list')
    .select('*')
    .eq('id', questionId)
    .eq('questions', question)
    .single();
}

export async function questionListById(questionId: number) {
  return await supabase
    .from('question_data_list')
    .select('*')
    .eq('id', questionId)
    .single();
}
