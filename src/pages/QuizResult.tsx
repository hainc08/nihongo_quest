import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function QuizResult() {
  const { state } = useLocation();
  const navigate = useNavigate();

  return (
    <section className="screen quiz-result active">
      <div className="quiz-result__hero">
        <div className="quiz-result__mascot">🐶🎉</div>
        <h2 className="quiz-result__title">Hoàn thành bài học!</h2>
      </div>

      <div className="quiz-result__score-section">
        <div className="circular-progress">
          <div className="circular-progress__text">
            <div className="circular-progress__value">{state?.score || 0}%</div>
            <div className="circular-progress__label">Điểm</div>
          </div>
        </div>
      </div>

      <div className="quiz-result__actions" style={{ marginTop: 40 }}>
        <button className="btn btn-primary" onClick={() => navigate('/home')}>Về trang chủ</button>
      </div>
    </section>
  );
}
