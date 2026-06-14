import { supabase } from '../lib/supabaseClient';

export const learningService = {
  async getCourses() {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('is_published', true)
      .order('sort_order');
    if (error) throw error;
    return data;
  },

  async getChapters(courseId: string) {
    const { data, error } = await supabase
      .from('chapters')
      .select('*')
      .eq('course_id', courseId)
      .eq('is_published', true)
      .order('sort_order');
    if (error) throw error;
    return data;
  },

  async getLessons(chapterId: string) {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('chapter_id', chapterId)
      .eq('is_published', true)
      .order('sort_order');
    if (error) throw error;
    return data;
  },

  async getLessonDetail(lessonId: string) {
    const { data, error } = await supabase
      .from('lesson_items')
      .select('*')
      .eq('lesson_id', lessonId)
      .order('sort_order');
    if (error) throw error;
    return data;
  },

  async getFlashcardsForLesson(lessonId: string) {
    const { data, error } = await supabase
      .from('flashcards')
      .select('*, lesson_items!inner(lesson_id)')
      .eq('lesson_items.lesson_id', lessonId)
      .order('sort_order');
    if (error) throw error;
    return data;
  },

  async getQuizForLesson(lessonId: string) {
    const { data, error } = await supabase
      .from('quizzes')
      .select('*, quiz_questions(*, quiz_options(*))')
      .eq('lesson_id', lessonId)
      .single();
    if (error && error.code !== 'PGRST116') throw error; // ignore no rows error
    return data;
  }
};
