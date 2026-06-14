import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { learningService } from '../services/learningService';
import { progressService } from '../services/progressService';
import { useAppStore } from '../store/useAppStore';

export default function Quiz() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { user, profile, setProfile } = useAppStore();
  const [quiz, setQuiz] = useState<any>(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (lessonId) {
      learningService.getQuizForLesson(lessonId).then(setQuiz).catch(console.error);
    }
  }, [lessonId]);

  if (!quiz) return <div>Loading...</div>;

  const questions = quiz.quiz_questions || [];
  if (questions.length === 0) return <div>No questions</div>;

  const currentQ = questions[currentQIndex];
  const options = currentQ.quiz_options || [];

  const handleOptionClick = async (option: any) => {
    let newScore = score;
    if (option.is_correct) {
      newScore += 1;
      setScore(newScore);
    }

    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(c => c + 1);
    } else {
      // Finish quiz
      const finalScorePercent = Math.round((newScore / questions.length) * 100);
      try {
        await progressService.completeQuizAttempt(user.id, quiz.id, finalScorePercent, questions.length, newScore);
        await progressService.completeLesson(user.id, lessonId!);
        
        // Refresh profile
        // Note: In MVP, simple direct update or refetching
        navigate('/quiz-result', { state: { score: finalScorePercent, correct: newScore, total: questions.length } });
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <section className="screen quiz-screen active">
      <div className="screen-header">
        <button className="screen-header__back" onClick={() => navigate(-1)}>←</button>
        <span className="screen-header__title">Quiz</span>
      </div>

      <div className="quiz-screen__header">
        <div className="quiz-screen__counter">Câu {currentQIndex + 1}/{questions.length}</div>
      </div>

      <div className="quiz-screen__content">
        <div className="quiz-screen__question">{currentQ.question_text}</div>
        <div className="quiz-screen__options">
          {options.map((opt: any) => (
            <div key={opt.id} className="quiz-option" onClick={() => handleOptionClick(opt)}>
              {opt.option_text}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
