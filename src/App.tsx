import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { authService } from './services/authService';
import { useAppStore } from './store/useAppStore';

// Temporary stubs for pages
import Splash from './pages/Splash';
import Login from './pages/Login';
import Home from './pages/Home';
import LearningPath from './pages/LearningPath';
import LessonDetail from './pages/LessonDetail';
import Flashcard from './pages/Flashcard';
import Quiz from './pages/Quiz';
import QuizResult from './pages/QuizResult';
import Profile from './pages/Profile';
import DailyMission from './pages/DailyMission';

export default function App() {
  const { user, setUser, setProfile } = useAppStore();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          const profile = await authService.getProfile();
          setProfile(profile);
        }
      } catch (err) {
        console.error('Auth init error', err);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, [setUser, setProfile]);

  if (loading) {
    return <Splash />;
  }

  return (
    <div id="app">
      <Routes>
        <Route path="/" element={<Navigate to={user ? "/home" : "/login"} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={user ? <Home /> : <Navigate to="/login" />} />
        <Route path="/learning-path" element={<LearningPath />} />
        <Route path="/lesson/:id" element={<LessonDetail />} />
        <Route path="/flashcard/:lessonId" element={<Flashcard />} />
        <Route path="/quiz/:lessonId" element={<Quiz />} />
        <Route path="/quiz-result" element={<QuizResult />} />
        <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/daily-mission" element={<DailyMission />} />
      </Routes>
    </div>
  );
}
