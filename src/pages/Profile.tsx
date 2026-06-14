import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { authService } from '../services/authService';
import BottomNav from '../components/BottomNav';

export default function Profile() {
  const { profile, logout } = useAppStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authService.signOut();
    logout();
    navigate('/login');
  };

  return (
    <section className="screen profile active">
      <div className="profile__header">
        <div className="profile__avatar">🐻</div>
        <h2 className="profile__name">{profile?.display_name || 'Khách'}</h2>
        <div className="profile__level">Level {profile?.current_level || 1}</div>
        <div className="profile__xp">⭐ {profile?.total_xp || 0} XP</div>
      </div>

      <div className="profile__content">
        <div className="profile__stats">
          <div className="stat-card">
            <div className="stat-card__value">🔥 {profile?.current_streak || 0}</div>
            <div className="stat-card__label">Streak</div>
          </div>
          <div className="stat-card">
            <div className="stat-card__value">🏆 0</div>
            <div className="stat-card__label">Huy hiệu</div>
          </div>
        </div>

        <button className="btn btn-outline" onClick={handleLogout} style={{ marginTop: 40 }}>Đăng xuất</button>
      </div>
      <BottomNav />
    </section>
  );
}
