import React from 'react';
import BottomNav from '../components/BottomNav';

export default function DailyMission() {
  return (
    <section className="screen daily-mission active">
      <div className="daily-mission__header">
        <h2 className="daily-mission__title">📋 Nhiệm vụ hôm nay</h2>
        <p className="daily-mission__subtitle">Hoàn thành nhiệm vụ để nhận XP bonus</p>
      </div>

      <div className="daily-mission__list">
        <div className="mission-card">
          <div className="mission-card__icon">📚</div>
          <div className="mission-card__content">
            <div className="mission-card__title">Hoàn thành 1 bài học</div>
          </div>
          <div className="mission-card__reward">+20 XP</div>
        </div>
      </div>
      <BottomNav />
    </section>
  );
}
