import { supabase } from '../lib/supabaseClient';

export const progressService = {
  async completeLesson(userId: string, lessonId: string, score: number = 100) {
    const { data, error } = await supabase
      .rpc('complete_lesson', {
        p_user_id: userId,
        p_lesson_id: lessonId,
        p_score: score
      });
    if (error) throw error;
    return data;
  },

  async completeQuizAttempt(userId: string, quizId: string, score: number, totalQuestions: number, correctAnswers: number) {
    const { data, error } = await supabase
      .rpc('complete_quiz_attempt', {
        p_user_id: userId,
        p_quiz_id: quizId,
        p_score: score,
        p_total_questions: totalQuestions,
        p_correct_answers: correctAnswers
      });
    if (error) throw error;
    return data;
  },

  async updateFlashcardReview(userId: string, flashcardId: string, reviewStatus: 'hard' | 'medium' | 'easy' | 'mastered') {
    // In MVP, we might just upsert directly from client, or create a simple RPC
    const { data, error } = await supabase
      .from('user_flashcard_reviews')
      .upsert({
        user_id: userId,
        flashcard_id: flashcardId,
        review_status: reviewStatus,
        last_reviewed_at: new Date().toISOString()
      }, { onConflict: 'user_id, flashcard_id' });
    if (error) throw error;
    return data;
  },

  async claimDailyMission(userId: string, missionId: string) {
    const { data, error } = await supabase
      .rpc('claim_daily_mission', {
        p_user_id: userId,
        p_mission_id: missionId
      });
    if (error) throw error;
    return data;
  },

  async checkAndAwardBadges(userId: string) {
    const { error } = await supabase
      .rpc('check_and_award_badges', {
        p_user_id: userId
      });
    if (error) throw error;
  }
};
