-- 1. profiles
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  avatar_url text,
  native_language text DEFAULT 'vi',
  target_language text DEFAULT 'ja',
  daily_goal_minutes integer DEFAULT 10,
  current_level integer DEFAULT 1,
  total_xp integer DEFAULT 0,
  current_streak integer DEFAULT 0,
  longest_streak integer DEFAULT 0,
  last_study_date date,
  onboarding_completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. courses
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  description text,
  level text,
  sort_order integer DEFAULT 0,
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 3. chapters
CREATE TABLE IF NOT EXISTS chapters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  slug text NOT NULL,
  title text NOT NULL,
  description text,
  sort_order integer DEFAULT 0,
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 4. lessons
CREATE TABLE IF NOT EXISTS lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id uuid REFERENCES chapters(id) ON DELETE CASCADE,
  slug text NOT NULL,
  title text NOT NULL,
  lesson_type text NOT NULL,
  description text,
  estimated_minutes integer DEFAULT 5,
  reward_xp integer DEFAULT 20,
  sort_order integer DEFAULT 0,
  is_locked_by_default boolean DEFAULT true,
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 5. lesson_items
CREATE TABLE IF NOT EXISTS lesson_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id uuid REFERENCES lessons(id) ON DELETE CASCADE,
  item_type text NOT NULL,
  japanese_text text NOT NULL,
  romaji text,
  meaning_vi text,
  example_japanese text,
  example_romaji text,
  example_vi text,
  audio_url text,
  image_url text,
  explanation_vi text,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 6. flashcards
CREATE TABLE IF NOT EXISTS flashcards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_item_id uuid REFERENCES lesson_items(id) ON DELETE CASCADE,
  front_text text NOT NULL,
  back_text text NOT NULL,
  hint_text text,
  audio_url text,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 7. quizzes
CREATE TABLE IF NOT EXISTS quizzes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id uuid REFERENCES lessons(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  passing_score integer DEFAULT 70,
  reward_xp integer DEFAULT 15,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 8. quiz_questions
CREATE TABLE IF NOT EXISTS quiz_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id uuid REFERENCES quizzes(id) ON DELETE CASCADE,
  question_type text NOT NULL,
  question_text text NOT NULL,
  question_audio_url text,
  correct_answer text NOT NULL,
  explanation_vi text,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 9. quiz_options
CREATE TABLE IF NOT EXISTS quiz_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid REFERENCES quiz_questions(id) ON DELETE CASCADE,
  option_text text NOT NULL,
  is_correct boolean DEFAULT false,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- 10. user_lesson_progress
CREATE TABLE IF NOT EXISTS user_lesson_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id uuid REFERENCES lessons(id) ON DELETE CASCADE,
  status text DEFAULT 'not_started',
  progress_percent integer DEFAULT 0,
  score integer,
  earned_xp integer DEFAULT 0,
  started_at timestamptz,
  completed_at timestamptz,
  last_accessed_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

-- 11. user_flashcard_reviews
CREATE TABLE IF NOT EXISTS user_flashcard_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  flashcard_id uuid REFERENCES flashcards(id) ON DELETE CASCADE,
  review_status text DEFAULT 'new',
  review_count integer DEFAULT 0,
  correct_count integer DEFAULT 0,
  wrong_count integer DEFAULT 0,
  last_reviewed_at timestamptz,
  next_review_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, flashcard_id)
);

-- 12. user_quiz_attempts
CREATE TABLE IF NOT EXISTS user_quiz_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_id uuid REFERENCES quizzes(id) ON DELETE CASCADE,
  score integer NOT NULL,
  total_questions integer NOT NULL,
  correct_answers integer NOT NULL,
  earned_xp integer DEFAULT 0,
  completed_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- 13. user_quiz_answers
CREATE TABLE IF NOT EXISTS user_quiz_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id uuid REFERENCES user_quiz_attempts(id) ON DELETE CASCADE,
  question_id uuid REFERENCES quiz_questions(id) ON DELETE CASCADE,
  selected_answer text,
  correct_answer text,
  is_correct boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- 14. badges
CREATE TABLE IF NOT EXISTS badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  description text,
  icon_url text,
  condition_type text NOT NULL,
  condition_value integer DEFAULT 1,
  reward_xp integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 15. user_badges
CREATE TABLE IF NOT EXISTS user_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id uuid REFERENCES badges(id) ON DELETE CASCADE,
  earned_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

-- 16. daily_missions
CREATE TABLE IF NOT EXISTS daily_missions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  description text,
  mission_type text NOT NULL,
  target_value integer NOT NULL,
  reward_xp integer DEFAULT 10,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 17. user_daily_missions
CREATE TABLE IF NOT EXISTS user_daily_missions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  mission_id uuid REFERENCES daily_missions(id) ON DELETE CASCADE,
  mission_date date DEFAULT current_date,
  current_value integer DEFAULT 0,
  is_completed boolean DEFAULT false,
  is_claimed boolean DEFAULT false,
  completed_at timestamptz,
  claimed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, mission_id, mission_date)
);

-- 18. xp_events
CREATE TABLE IF NOT EXISTS xp_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  source_type text NOT NULL,
  source_id uuid,
  xp_amount integer NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- 19. quests
CREATE TABLE IF NOT EXISTS quests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  description text,
  quest_type text NOT NULL,
  reward_xp integer DEFAULT 50,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 20. quest_steps
CREATE TABLE IF NOT EXISTS quest_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quest_id uuid REFERENCES quests(id) ON DELETE CASCADE,
  step_type text NOT NULL,
  lesson_id uuid REFERENCES lessons(id) ON DELETE SET NULL,
  quiz_id uuid REFERENCES quizzes(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text,
  target_value integer DEFAULT 1,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 21. user_quest_progress
CREATE TABLE IF NOT EXISTS user_quest_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  quest_id uuid REFERENCES quests(id) ON DELETE CASCADE,
  status text DEFAULT 'not_started',
  progress_percent integer DEFAULT 0,
  started_at timestamptz,
  completed_at timestamptz,
  claimed_at timestamptz,
  earned_xp integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, quest_id)
);

-- 22. user_quest_step_progress
CREATE TABLE IF NOT EXISTS user_quest_step_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  quest_step_id uuid REFERENCES quest_steps(id) ON DELETE CASCADE,
  current_value integer DEFAULT 0,
  is_completed boolean DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, quest_step_id)
);

-- ROW LEVEL SECURITY (RLS) POLICIES
-- Bọc lại việc bật RLS nếu cần (Postgres cho phép chạy lại không lỗi, nhưng ta giữ nguyên)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_flashcard_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_quiz_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_daily_missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE xp_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_quest_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_quest_step_progress ENABLE ROW LEVEL SECURITY;

-- Hàm hỗ trợ drop policy nếu đã tồn tại để tránh lỗi "policy already exists"
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
    DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
    
    DROP POLICY IF EXISTS "Users can view own lesson progress" ON user_lesson_progress;
    DROP POLICY IF EXISTS "Users can insert own lesson progress" ON user_lesson_progress;
    DROP POLICY IF EXISTS "Users can update own lesson progress" ON user_lesson_progress;
    DROP POLICY IF EXISTS "Users can delete own lesson progress" ON user_lesson_progress;
    
    DROP POLICY IF EXISTS "Users can view own flashcard reviews" ON user_flashcard_reviews;
    DROP POLICY IF EXISTS "Users can insert own flashcard reviews" ON user_flashcard_reviews;
    DROP POLICY IF EXISTS "Users can update own flashcard reviews" ON user_flashcard_reviews;
    DROP POLICY IF EXISTS "Users can delete own flashcard reviews" ON user_flashcard_reviews;
    
    DROP POLICY IF EXISTS "Users can view own quiz attempts" ON user_quiz_attempts;
    DROP POLICY IF EXISTS "Users can insert own quiz attempts" ON user_quiz_attempts;
    
    DROP POLICY IF EXISTS "Users can view own quiz answers" ON user_quiz_answers;
    DROP POLICY IF EXISTS "Users can insert own quiz answers" ON user_quiz_answers;
    
    DROP POLICY IF EXISTS "Users can view own badges" ON user_badges;
    DROP POLICY IF EXISTS "Users can insert own badges" ON user_badges;
    
    DROP POLICY IF EXISTS "Users can view own daily missions" ON user_daily_missions;
    DROP POLICY IF EXISTS "Users can update own daily missions" ON user_daily_missions;
    DROP POLICY IF EXISTS "Users can insert own daily missions" ON user_daily_missions;
    
    DROP POLICY IF EXISTS "Users can view own xp events" ON xp_events;
    DROP POLICY IF EXISTS "Users can insert own xp events" ON xp_events;
    
    DROP POLICY IF EXISTS "Users can view own quest progress" ON user_quest_progress;
    DROP POLICY IF EXISTS "Users can insert own quest progress" ON user_quest_progress;
    DROP POLICY IF EXISTS "Users can update own quest progress" ON user_quest_progress;
    
    DROP POLICY IF EXISTS "Users can view own quest step progress" ON user_quest_step_progress;
    DROP POLICY IF EXISTS "Users can insert own quest step progress" ON user_quest_step_progress;
    DROP POLICY IF EXISTS "Users can update own quest step progress" ON user_quest_step_progress;
    
    DROP POLICY IF EXISTS "Public read active courses" ON courses;
    DROP POLICY IF EXISTS "Public read active chapters" ON chapters;
    DROP POLICY IF EXISTS "Public read active lessons" ON lessons;
    DROP POLICY IF EXISTS "Public read lesson items" ON lesson_items;
    DROP POLICY IF EXISTS "Public read flashcards" ON flashcards;
    DROP POLICY IF EXISTS "Public read quizzes" ON quizzes;
    DROP POLICY IF EXISTS "Public read quiz questions" ON quiz_questions;
    DROP POLICY IF EXISTS "Public read quiz options" ON quiz_options;
    DROP POLICY IF EXISTS "Public read active badges" ON badges;
    DROP POLICY IF EXISTS "Public read active daily missions" ON daily_missions;
    DROP POLICY IF EXISTS "Public read active quests" ON quests;
    DROP POLICY IF EXISTS "Public read active quest steps" ON quest_steps;
END $$;

-- Profiles
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- user_lesson_progress
CREATE POLICY "Users can view own lesson progress" ON user_lesson_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own lesson progress" ON user_lesson_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own lesson progress" ON user_lesson_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own lesson progress" ON user_lesson_progress FOR DELETE USING (auth.uid() = user_id);

-- user_flashcard_reviews
CREATE POLICY "Users can view own flashcard reviews" ON user_flashcard_reviews FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own flashcard reviews" ON user_flashcard_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own flashcard reviews" ON user_flashcard_reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own flashcard reviews" ON user_flashcard_reviews FOR DELETE USING (auth.uid() = user_id);

-- user_quiz_attempts
CREATE POLICY "Users can view own quiz attempts" ON user_quiz_attempts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own quiz attempts" ON user_quiz_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);

-- user_quiz_answers
CREATE POLICY "Users can view own quiz answers" ON user_quiz_answers FOR SELECT USING (
  EXISTS (SELECT 1 FROM user_quiz_attempts a WHERE a.id = user_quiz_answers.attempt_id AND a.user_id = auth.uid())
);
CREATE POLICY "Users can insert own quiz answers" ON user_quiz_answers FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM user_quiz_attempts a WHERE a.id = attempt_id AND a.user_id = auth.uid())
);

-- user_badges
CREATE POLICY "Users can view own badges" ON user_badges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own badges" ON user_badges FOR INSERT WITH CHECK (auth.uid() = user_id);

-- user_daily_missions
CREATE POLICY "Users can view own daily missions" ON user_daily_missions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own daily missions" ON user_daily_missions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own daily missions" ON user_daily_missions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- xp_events
CREATE POLICY "Users can view own xp events" ON xp_events FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own xp events" ON xp_events FOR INSERT WITH CHECK (auth.uid() = user_id);

-- user_quest_progress
CREATE POLICY "Users can view own quest progress" ON user_quest_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own quest progress" ON user_quest_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own quest progress" ON user_quest_progress FOR UPDATE USING (auth.uid() = user_id);

-- user_quest_step_progress
CREATE POLICY "Users can view own quest step progress" ON user_quest_step_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own quest step progress" ON user_quest_step_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own quest step progress" ON user_quest_step_progress FOR UPDATE USING (auth.uid() = user_id);

-- Content Tables RLS
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE quest_steps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read active courses" ON courses FOR SELECT USING (is_published = true);
CREATE POLICY "Public read active chapters" ON chapters FOR SELECT USING (is_published = true);
CREATE POLICY "Public read active lessons" ON lessons FOR SELECT USING (is_published = true);
CREATE POLICY "Public read lesson items" ON lesson_items FOR SELECT USING (true);
CREATE POLICY "Public read flashcards" ON flashcards FOR SELECT USING (true);
CREATE POLICY "Public read quizzes" ON quizzes FOR SELECT USING (true);
CREATE POLICY "Public read quiz questions" ON quiz_questions FOR SELECT USING (true);
CREATE POLICY "Public read quiz options" ON quiz_options FOR SELECT USING (true);
CREATE POLICY "Public read active badges" ON badges FOR SELECT USING (is_active = true);
CREATE POLICY "Public read active daily missions" ON daily_missions FOR SELECT USING (is_active = true);
CREATE POLICY "Public read active quests" ON quests FOR SELECT USING (is_active = true);
CREATE POLICY "Public read active quest steps" ON quest_steps FOR SELECT USING (true);
