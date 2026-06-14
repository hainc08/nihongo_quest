import React from 'react';

export default function Splash() {
  return (
    <section className="screen splash active">
      <div className="splash__logo">🐱</div>
      <h1 className="splash__title">Nihongo Quest</h1>
      <p className="splash__subtitle">Học tiếng Nhật mỗi ngày như một cuộc phiêu lưu</p>
      <div className="splash__loader">
        <div className="splash__dot"></div>
        <div className="splash__dot"></div>
        <div className="splash__dot"></div>
      </div>
    </section>
  );
}
