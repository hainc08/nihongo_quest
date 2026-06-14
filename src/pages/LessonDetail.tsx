import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { learningService } from '../services/learningService';

export default function LessonDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    if (id) {
      learningService.getLessonDetail(id).then(setItems).catch(console.error);
    }
  }, [id]);

  return (
    <section className="screen lesson-detail active">
      <div className="screen-header">
        <button className="screen-header__back" onClick={() => navigate(-1)}>←</button>
        <span className="screen-header__title">Chi tiết bài học</span>
      </div>

      <div className="lesson-detail__chars" style={{ marginTop: 20 }}>
        {items.map(item => (
          <div key={item.id} className="char-card">
            <div className="char-card__hiragana">{item.japanese_text}</div>
            <div className="char-card__info">
              <div className="char-card__romaji">{item.romaji}</div>
              <div className="char-card__example">{item.example_japanese}</div>
              <div className="char-card__meaning">{item.meaning_vi}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="lesson-detail__footer">
        <button className="btn btn-primary" onClick={() => navigate(`/flashcard/${id}`)}>🪄 Bắt đầu thẻ bài</button>
      </div>
    </section>
  );
}
