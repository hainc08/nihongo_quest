import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import BottomNav from '../components/BottomNav';

export default function Home() {
  const navigate = useNavigate();
  const { profile } = useAppStore();

  const handleLessonClick = () => {
    // Navigate to Hiragana A row lesson id
    navigate('/lesson/L0000000-0000-0000-0000-000000000001');
  };

  return (
    <section className="screen home active">
      <div className="home__header">
        <div className="avatar">🐻</div>
        <div className="home__greeting">
          <div className="home__greeting-text">Xin chào, {profile?.display_name || 'Khách'}!</div>
          <div className="home__greeting-sub">Bé hãy tiếp tục khám phá nào!</div>
        </div>
        <div className="home__badges">
          <div className="streak-badge">🔥 {profile?.current_streak || 0} ngày</div>
        </div>
      </div>

      <div className="home__content">
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-8px' }}>
          <div className="xp-badge">⭐ {profile?.total_xp || 0} XP</div>
        </div>

        <div className="lesson-card" onClick={handleLessonClick}>
          <div className="lesson-card__header">
            <span className="lesson-card__label">🐾 Bài học hôm nay</span>
            <span className="lesson-card__xp">+20 XP</span>
          </div>
          <div className="lesson-card__title">Hiragana nhóm あ</div>
          <div className="lesson-card__progress-text">Chưa hoàn thành</div>
          <div className="progress-bar" style={{ marginBottom: 16 }}>
            <div className="progress-bar__fill" style={{ width: '0%' }}></div>
          </div>
          <button className="btn btn-primary btn-sm" onClick={(e) => { e.stopPropagation(); handleLessonClick(); }}>Tiếp tục học →</button>
        </div>

        <div className="card">
          <div className="xp-bar">
            <div className="xp-bar__level">{profile?.current_level || 1}</div>
            <div className="xp-bar__info">
              <div className="xp-bar__label">Level {profile?.current_level || 1}</div>
              <div className="progress-bar">
                <div className="progress-bar__fill progress-bar__fill--gold" style={{ width: '0%' }}></div>
              </div>
              <div className="xp-bar__numbers">{profile?.total_xp || 0} XP</div>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </section>
  );
}
