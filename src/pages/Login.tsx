import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { useAppStore } from '../store/useAppStore';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser, setProfile } = useAppStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await authService.signIn(email, password);
      } else {
        await authService.signUp(email, password);
      }
      const user = await authService.getCurrentUser();
      if (user) {
        setUser(user);
        const profile = await authService.getProfile();
        setProfile(profile);
        navigate('/home');
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <section className="screen login active">
      <div className="login__logo">🐼</div>
      <h2 className="login__title">Lưu hành trình học<br/>của bạn</h2>
      <p className="login__subtitle">Đăng nhập để lưu tiến độ và đồng bộ giữa các thiết bị</p>

      {error && <div style={{ color: 'red', marginBottom: 10 }}>{error}</div>}

      <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 300, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          required 
          style={{ padding: 10, borderRadius: 8, border: '1px solid #ccc' }}
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          required 
          style={{ padding: 10, borderRadius: 8, border: '1px solid #ccc' }}
        />
        <button type="submit" className="btn btn-outline" style={{ marginTop: 10 }}>
          ✉️ {isLogin ? 'Đăng nhập' : 'Đăng ký'}
        </button>
      </form>

      <div style={{ marginTop: 20, cursor: 'pointer', color: 'var(--primary)' }} onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? 'Chưa có tài khoản? Đăng ký ngay' : 'Đã có tài khoản? Đăng nhập'}
      </div>

      <div className="login__guest" onClick={() => navigate('/home')}>
        Tiếp tục với tư cách khách →
      </div>
    </section>
  );
}
