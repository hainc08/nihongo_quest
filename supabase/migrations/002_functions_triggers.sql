-- 1. Function update_updated_at_column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_chapters_updated_at BEFORE UPDATE ON chapters FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON lessons FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_lesson_items_updated_at BEFORE UPDATE ON lesson_items FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_flashcards_updated_at BEFORE UPDATE ON flashcards FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_quizzes_updated_at BEFORE UPDATE ON quizzes FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_quiz_questions_updated_at BEFORE UPDATE ON quiz_questions FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_user_lesson_progress_updated_at BEFORE UPDATE ON user_lesson_progress FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_user_flashcard_reviews_updated_at BEFORE UPDATE ON user_flashcard_reviews FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_badges_updated_at BEFORE UPDATE ON badges FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_daily_missions_updated_at BEFORE UPDATE ON daily_missions FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_user_daily_missions_updated_at BEFORE UPDATE ON user_daily_missions FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_quests_updated_at BEFORE UPDATE ON quests FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_quest_steps_updated_at BEFORE UPDATE ON quest_steps FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_user_quest_progress_updated_at BEFORE UPDATE ON user_quest_progress FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_user_quest_step_progress_updated_at BEFORE UPDATE ON user_quest_step_progress FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- 2. Function handle_new_user
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();

-- 3. Function add_user_xp
CREATE OR REPLACE FUNCTION add_user_xp(
  p_user_id uuid,
  p_xp integer,
  p_source_type text,
  p_source_id uuid DEFAULT NULL,
  p_description text DEFAULT NULL
)
RETURNS void AS $$
DECLARE
  v_new_total_xp integer;
  v_new_level integer;
BEGIN
  -- Insert into xp_events
  INSERT INTO xp_events (user_id, source_type, source_id, xp_amount, description)
  VALUES (p_user_id, p_source_type, p_source_id, p_xp, p_description);

  -- Update profiles total_xp
  UPDATE profiles
  SET total_xp = total_xp + p_xp
  WHERE id = p_user_id
  RETURNING total_xp INTO v_new_total_xp;

  -- Calculate new level (level 1 starts at 0, level 2 at 100, etc.)
  v_new_level := FLOOR(v_new_total_xp / 100) + 1;

  -- Update level if changed
  UPDATE profiles
  SET current_level = v_new_level
  WHERE id = p_user_id AND current_level < v_new_level;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Function update_user_streak
CREATE OR REPLACE FUNCTION update_user_streak(p_user_id uuid)
RETURNS void AS $$
DECLARE
  v_last_study_date date;
  v_current_streak integer;
  v_longest_streak integer;
BEGIN
  SELECT last_study_date, current_streak, longest_streak 
  INTO v_last_study_date, v_current_streak, v_longest_streak
  FROM profiles WHERE id = p_user_id;

  IF v_last_study_date = current_date - interval '1 day' THEN
    -- Studied yesterday, increment streak
    v_current_streak := v_current_streak + 1;
  ELSIF v_last_study_date = current_date THEN
    -- Already studied today, do nothing
    RETURN;
  ELSE
    -- Missed a day or first time, reset to 1
    v_current_streak := 1;
  END IF;

  IF v_current_streak > v_longest_streak THEN
    v_longest_streak := v_current_streak;
  END IF;

  UPDATE profiles
  SET current_streak = v_current_streak,
      longest_streak = v_longest_streak,
      last_study_date = current_date
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Function complete_lesson
CREATE OR REPLACE FUNCTION complete_lesson(
  p_user_id uuid,
  p_lesson_id uuid,
  p_score integer DEFAULT NULL
)
RETURNS jsonb AS $$
DECLARE
  v_reward_xp integer;
  v_new_total_xp integer;
  v_new_level integer;
BEGIN
  -- Get reward_xp
  SELECT reward_xp INTO v_reward_xp FROM lessons WHERE id = p_lesson_id;
  
  -- Upsert progress
  INSERT INTO user_lesson_progress (user_id, lesson_id, status, progress_percent, score, earned_xp, completed_at)
  VALUES (p_user_id, p_lesson_id, 'completed', 100, p_score, v_reward_xp, now())
  ON CONFLICT (user_id, lesson_id) 
  DO UPDATE SET 
    status = 'completed',
    progress_percent = 100,
    score = EXCLUDED.score,
    earned_xp = EXCLUDED.earned_xp,
    completed_at = COALESCE(user_lesson_progress.completed_at, now()),
    updated_at = now();

  -- Add XP
  PERFORM add_user_xp(p_user_id, v_reward_xp, 'lesson_completed', p_lesson_id, 'Hoàn thành bài học');

  -- Update streak
  PERFORM update_user_streak(p_user_id);

  -- Return some stats
  SELECT total_xp, current_level INTO v_new_total_xp, v_new_level FROM profiles WHERE id = p_user_id;

  RETURN jsonb_build_object(
    'earned_xp', v_reward_xp,
    'total_xp', v_new_total_xp,
    'current_level', v_new_level
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Function complete_quiz_attempt
CREATE OR REPLACE FUNCTION complete_quiz_attempt(
  p_user_id uuid,
  p_quiz_id uuid,
  p_score integer,
  p_total_questions integer,
  p_correct_answers integer
)
RETURNS jsonb AS $$
DECLARE
  v_passing_score integer;
  v_reward_xp integer;
  v_earned_xp integer := 0;
  v_attempt_id uuid;
BEGIN
  -- Get passing score and reward xp
  SELECT passing_score, reward_xp INTO v_passing_score, v_reward_xp 
  FROM quizzes WHERE id = p_quiz_id;

  -- Calculate if passed
  IF p_score >= v_passing_score THEN
    v_earned_xp := v_reward_xp;
    -- Add XP
    PERFORM add_user_xp(p_user_id, v_earned_xp, 'quiz_completed', p_quiz_id, 'Hoàn thành quiz');
  END IF;

  -- Record attempt
  INSERT INTO user_quiz_attempts (user_id, quiz_id, score, total_questions, correct_answers, earned_xp)
  VALUES (p_user_id, p_quiz_id, p_score, p_total_questions, p_correct_answers, v_earned_xp)
  RETURNING id INTO v_attempt_id;

  -- Update streak
  PERFORM update_user_streak(p_user_id);

  RETURN jsonb_build_object(
    'attempt_id', v_attempt_id,
    'earned_xp', v_earned_xp,
    'passed', p_score >= v_passing_score
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Function claim_daily_mission
CREATE OR REPLACE FUNCTION claim_daily_mission(
  p_user_id uuid,
  p_mission_id uuid
)
RETURNS jsonb AS $$
DECLARE
  v_reward_xp integer;
BEGIN
  -- Get mission reward
  SELECT reward_xp INTO v_reward_xp FROM daily_missions WHERE id = p_mission_id;

  -- Update mission to claimed
  UPDATE user_daily_missions
  SET is_claimed = true,
      claimed_at = now()
  WHERE user_id = p_user_id 
    AND mission_id = p_mission_id 
    AND mission_date = current_date
    AND is_completed = true 
    AND is_claimed = false;

  IF FOUND THEN
    -- Award XP
    PERFORM add_user_xp(p_user_id, v_reward_xp, 'daily_mission_claimed', p_mission_id, 'Nhận thưởng nhiệm vụ ngày');
    RETURN jsonb_build_object('success', true, 'earned_xp', v_reward_xp);
  ELSE
    RETURN jsonb_build_object('success', false, 'error', 'Mission not completed or already claimed');
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Function check_and_award_badges
CREATE OR REPLACE FUNCTION check_and_award_badges(p_user_id uuid)
RETURNS void AS $$
DECLARE
  v_badge record;
  v_earned boolean;
  v_val integer;
BEGIN
  FOR v_badge IN SELECT * FROM badges WHERE is_active = true LOOP
    -- Check if already earned
    IF NOT EXISTS (SELECT 1 FROM user_badges WHERE user_id = p_user_id AND badge_id = v_badge.id) THEN
      v_earned := false;
      
      IF v_badge.condition_type = 'complete_first_lesson' THEN
        SELECT count(*) INTO v_val FROM user_lesson_progress WHERE user_id = p_user_id AND status = 'completed';
        IF v_val >= v_badge.condition_value THEN v_earned := true; END IF;
      
      ELSIF v_badge.condition_type = 'streak_days' THEN
        SELECT current_streak INTO v_val FROM profiles WHERE id = p_user_id;
        IF v_val >= v_badge.condition_value THEN v_earned := true; END IF;
      
      ELSIF v_badge.condition_type = 'quiz_perfect_score' THEN
        SELECT count(*) INTO v_val FROM user_quiz_attempts WHERE user_id = p_user_id AND score = v_badge.condition_value;
        IF v_val > 0 THEN v_earned := true; END IF;
      
      ELSIF v_badge.condition_type = 'total_xp' THEN
        SELECT total_xp INTO v_val FROM profiles WHERE id = p_user_id;
        IF v_val >= v_badge.condition_value THEN v_earned := true; END IF;
      END IF;

      IF v_earned THEN
        INSERT INTO user_badges (user_id, badge_id) VALUES (p_user_id, v_badge.id);
        IF v_badge.reward_xp > 0 THEN
          PERFORM add_user_xp(p_user_id, v_badge.reward_xp, 'badge_earned', v_badge.id, 'Nhận huy hiệu: ' || v_badge.title);
        END IF;
      END IF;

    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
