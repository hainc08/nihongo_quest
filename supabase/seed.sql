-- Clear existing data (optional, useful for clean reset)
-- DELETE FROM courses;
-- DELETE FROM badges;
-- DELETE FROM daily_missions;
-- DELETE FROM quests;

-- 1. Courses
INSERT INTO courses (id, slug, title, description, level, sort_order, is_published)
VALUES (
  'c0000000-0000-0000-0000-000000000001',
  'jlpt-n5',
  'JLPT N5 cho người mới bắt đầu',
  'Lộ trình học tiếng Nhật N5 từ con số 0.',
  'N5',
  1,
  true
) ON CONFLICT (id) DO NOTHING;

-- 2. Chapters
INSERT INTO chapters (id, course_id, slug, title, description, sort_order, is_published)
VALUES (
  'c1111111-0000-0000-0000-000000000001',
  'c0000000-0000-0000-0000-000000000001',
  'hiragana-basic',
  'Hiragana cơ bản',
  'Học bảng chữ cái Hiragana nền tảng.',
  1,
  true
) ON CONFLICT (id) DO NOTHING;

-- 3. Lessons
INSERT INTO lessons (id, chapter_id, slug, title, lesson_type, reward_xp, estimated_minutes, sort_order, is_locked_by_default, is_published)
VALUES (
  'L0000000-0000-0000-0000-000000000001',
  'c1111111-0000-0000-0000-000000000001',
  'hiragana-a-row',
  'Hiragana nhóm あ',
  'hiragana',
  20,
  5,
  1,
  false,
  true
) ON CONFLICT (id) DO NOTHING;

-- 4. Lesson Items
INSERT INTO lesson_items (id, lesson_id, item_type, japanese_text, romaji, meaning_vi, example_japanese, example_romaji, example_vi, sort_order)
VALUES 
  ('i0000000-0000-0000-0000-000000000001', 'L0000000-0000-0000-0000-000000000001', 'kana', 'あ', 'a', 'A', 'あめ', 'ame', 'mưa', 1),
  ('i0000000-0000-0000-0000-000000000002', 'L0000000-0000-0000-0000-000000000001', 'kana', 'い', 'i', 'I', 'いぬ', 'inu', 'chó', 2),
  ('i0000000-0000-0000-0000-000000000003', 'L0000000-0000-0000-0000-000000000001', 'kana', 'う', 'u', 'U', 'うみ', 'umi', 'biển', 3),
  ('i0000000-0000-0000-0000-000000000004', 'L0000000-0000-0000-0000-000000000001', 'kana', 'え', 'e', 'E', 'えき', 'eki', 'nhà ga', 4),
  ('i0000000-0000-0000-0000-000000000005', 'L0000000-0000-0000-0000-000000000001', 'kana', 'お', 'o', 'O', 'おかね', 'okane', 'tiền', 5)
ON CONFLICT (id) DO NOTHING;

-- 5. Flashcards
INSERT INTO flashcards (id, lesson_item_id, front_text, back_text, sort_order)
VALUES 
  ('f0000000-0000-0000-0000-000000000001', 'i0000000-0000-0000-0000-000000000001', 'あ', 'a - あめ - mưa', 1),
  ('f0000000-0000-0000-0000-000000000002', 'i0000000-0000-0000-0000-000000000002', 'い', 'i - いぬ - chó', 2),
  ('f0000000-0000-0000-0000-000000000003', 'i0000000-0000-0000-0000-000000000003', 'う', 'u - うみ - biển', 3),
  ('f0000000-0000-0000-0000-000000000004', 'i0000000-0000-0000-0000-000000000004', 'え', 'e - えき - nhà ga', 4),
  ('f0000000-0000-0000-0000-000000000005', 'i0000000-0000-0000-0000-000000000005', 'お', 'o - おかね - tiền', 5)
ON CONFLICT (id) DO NOTHING;

-- 6. Quizzes
INSERT INTO quizzes (id, lesson_id, title, passing_score, reward_xp)
VALUES (
  'q0000000-0000-0000-0000-000000000001',
  'L0000000-0000-0000-0000-000000000001',
  'Quiz Hiragana nhóm あ',
  70,
  15
) ON CONFLICT (id) DO NOTHING;

-- 7. Quiz Questions & Options
-- Q1
INSERT INTO quiz_questions (id, quiz_id, question_type, question_text, correct_answer, sort_order)
VALUES ('qq000000-0000-0000-0000-000000000001', 'q0000000-0000-0000-0000-000000000001', 'multiple_choice', 'Chữ “あ” đọc là gì?', 'a', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO quiz_options (question_id, option_text, is_correct) VALUES 
('qq000000-0000-0000-0000-000000000001', 'a', true),
('qq000000-0000-0000-0000-000000000001', 'i', false),
('qq000000-0000-0000-0000-000000000001', 'u', false),
('qq000000-0000-0000-0000-000000000001', 'e', false);

-- Q2
INSERT INTO quiz_questions (id, quiz_id, question_type, question_text, correct_answer, sort_order)
VALUES ('qq000000-0000-0000-0000-000000000002', 'q0000000-0000-0000-0000-000000000001', 'multiple_choice', 'Chữ “い” đọc là gì?', 'i', 2) ON CONFLICT (id) DO NOTHING;
INSERT INTO quiz_options (question_id, option_text, is_correct) VALUES 
('qq000000-0000-0000-0000-000000000002', 'a', false),
('qq000000-0000-0000-0000-000000000002', 'i', true),
('qq000000-0000-0000-0000-000000000002', 'u', false),
('qq000000-0000-0000-0000-000000000002', 'o', false);

-- Q3
INSERT INTO quiz_questions (id, quiz_id, question_type, question_text, correct_answer, sort_order)
VALUES ('qq000000-0000-0000-0000-000000000003', 'q0000000-0000-0000-0000-000000000001', 'choose_kana', 'Âm “u” là chữ nào?', 'う', 3) ON CONFLICT (id) DO NOTHING;
INSERT INTO quiz_options (question_id, option_text, is_correct) VALUES 
('qq000000-0000-0000-0000-000000000003', 'あ', false),
('qq000000-0000-0000-0000-000000000003', 'い', false),
('qq000000-0000-0000-0000-000000000003', 'う', true),
('qq000000-0000-0000-0000-000000000003', 'え', false);

-- Q4
INSERT INTO quiz_questions (id, quiz_id, question_type, question_text, correct_answer, sort_order)
VALUES ('qq000000-0000-0000-0000-000000000004', 'q0000000-0000-0000-0000-000000000001', 'match_meaning', '“いぬ” nghĩa là gì?', 'Chó', 4) ON CONFLICT (id) DO NOTHING;
INSERT INTO quiz_options (question_id, option_text, is_correct) VALUES 
('qq000000-0000-0000-0000-000000000004', 'Mèo', false),
('qq000000-0000-0000-0000-000000000004', 'Chó', true),
('qq000000-0000-0000-0000-000000000004', 'Cá', false),
('qq000000-0000-0000-0000-000000000004', 'Chim', false);

-- Q5
INSERT INTO quiz_questions (id, quiz_id, question_type, question_text, correct_answer, sort_order)
VALUES ('qq000000-0000-0000-0000-000000000005', 'q0000000-0000-0000-0000-000000000001', 'match_meaning', '“あめ” nghĩa là gì?', 'Mưa', 5) ON CONFLICT (id) DO NOTHING;
INSERT INTO quiz_options (question_id, option_text, is_correct) VALUES 
('qq000000-0000-0000-0000-000000000005', 'Mưa', true),
('qq000000-0000-0000-0000-000000000005', 'Biển', false),
('qq000000-0000-0000-0000-000000000005', 'Tiền', false),
('qq000000-0000-0000-0000-000000000005', 'Nhà ga', false);

-- 8. Badges
INSERT INTO badges (slug, title, condition_type, condition_value, reward_xp, is_active)
VALUES 
  ('first-lesson', 'Người mới bắt đầu', 'complete_first_lesson', 1, 5, true),
  ('hiragana-starter', 'Hiragana Starter', 'complete_hiragana_group', 1, 10, true),
  ('streak-7', 'Streak 7', 'streak_days', 7, 20, true),
  ('quiz-master', 'Quiz Master', 'quiz_perfect_score', 100, 15, true)
ON CONFLICT (slug) DO NOTHING;

-- 9. Daily Missions
INSERT INTO daily_missions (slug, title, mission_type, target_value, reward_xp, is_active)
VALUES 
  ('complete-1-lesson', 'Hoàn thành 1 bài học', 'complete_lessons', 1, 20, true),
  ('complete-2-quizzes', 'Làm 2 quiz', 'complete_quizzes', 2, 15, true),
  ('review-10-flashcards', 'Ôn tập 10 flashcard', 'review_flashcards', 10, 10, true)
ON CONFLICT (slug) DO NOTHING;

-- 10. Quests & Steps
INSERT INTO quests (id, slug, title, quest_type, reward_xp, is_active)
VALUES (
  'qst00000-0000-0000-0000-000000000001',
  'conquer-hiragana-a-row',
  'Chinh phục Hiragana nhóm あ',
  'learning_path',
  50,
  true
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO quest_steps (quest_id, step_type, lesson_id, title, target_value, sort_order)
VALUES (
  'qst00000-0000-0000-0000-000000000001',
  'lesson',
  'L0000000-0000-0000-0000-000000000001',
  'Học bài Hiragana nhóm あ',
  1,
  1
);

INSERT INTO quest_steps (quest_id, step_type, quiz_id, title, target_value, sort_order)
VALUES (
  'qst00000-0000-0000-0000-000000000001',
  'quiz',
  'q0000000-0000-0000-0000-000000000001',
  'Làm quiz Hiragana nhóm あ',
  1,
  2
);
