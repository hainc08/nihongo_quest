import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import { learningService } from '../services/learningService';

export default function LearningPath() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<any[]>([]);
  const [chapters, setChapters] = useState<any[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const c = await learningService.getCourses();
        setCourses(c);
        if (c.length > 0) {
          const ch = await learningService.getChapters(c[0].id);
          setChapters(ch);
          if (ch.length > 0) {
            const ls = await learningService.getLessons(ch[0].id);
            setLessons(ls);
          }
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchData();
  }, []);

  return (
    <section className="screen learning-path active">
      <div className="learning-path__header">
        <h2 className="learning-path__title">🗺️ Lộ trình {courses[0]?.level || 'N5'} của bạn</h2>
      </div>

      <div className="learning-path__content">
        {chapters.map((chapter) => (
          <div key={chapter.id} className="learning-path__chapter">
            <div className="chapter-header">
              <span className="chapter-header__title">{chapter.title}</span>
            </div>
            <div style={{ paddingLeft: 4 }}>
              {lessons.filter(l => l.chapter_id === chapter.id).map(lesson => (
                <div key={lesson.id} className="path-node path-node--current" onClick={() => navigate(`/lesson/${lesson.id}`)}>
                  <div className="path-node__line"></div>
                  <div className="path-node__dot">🐾</div>
                  <div className="path-node__content">
                    <div className="path-node__title">{lesson.title}</div>
                    <div className="path-node__xp">+{lesson.reward_xp} XP</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <BottomNav />
    </section>
  );
}
