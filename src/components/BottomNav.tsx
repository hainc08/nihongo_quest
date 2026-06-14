import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const getClassName = (path: string) => {
    return `bottom-nav__item ${location.pathname === path ? 'bottom-nav__item--active' : ''}`;
  };

  return (
    <nav className="bottom-nav">
      <div className={getClassName('/home')} onClick={() => navigate('/home')}>
        <span className="bottom-nav__icon">🍄</span>
        <span className="bottom-nav__label">Home</span>
      </div>
      <div className={getClassName('/learning-path')} onClick={() => navigate('/learning-path')}>
        <span className="bottom-nav__icon">🗺️</span>
        <span className="bottom-nav__label">Lộ trình</span>
      </div>
      <div className={getClassName('/daily-mission')} onClick={() => navigate('/daily-mission')}>
        <span className="bottom-nav__icon">📜</span>
        <span className="bottom-nav__label">Nhiệm vụ</span>
      </div>
      <div className={getClassName('/profile')} onClick={() => navigate('/profile')}>
        <span className="bottom-nav__icon">🐻</span>
        <span className="bottom-nav__label">Hồ sơ</span>
      </div>
    </nav>
  );
}
