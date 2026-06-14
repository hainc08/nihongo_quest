import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { learningService } from '../services/learningService';

export default function Flashcard() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [flashcards, setFlashcards] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    if (lessonId) {
      learningService.getFlashcardsForLesson(lessonId).then(setFlashcards).catch(console.error);
    }
  }, [lessonId]);

  if (flashcards.length === 0) return <div>Loading...</div>;

  const current = flashcards[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(c => c + 1);
    } else {
      navigate(`/quiz/${lessonId}`);
    }
  };

  return (
    <section className="screen flashcard-screen active">
      <div className="screen-header">
        <button className="screen-header__back" onClick={() => navigate(-1)}>←</button>
        <span className="screen-header__title">Thẻ bài</span>
        <span className="tag tag--purple">{currentIndex + 1}/{flashcards.length}</span>
      </div>

      <div className="flashcard-screen__content">
        <div className="flashcard-container" onClick={() => setIsFlipped(!isFlipped)}>
          <div className={`flashcard ${isFlipped ? 'flipped' : ''}`}>
            <div className="flashcard__face flashcard__front" style={{ display: isFlipped ? 'none' : 'flex' }}>
              <div className="flashcard__character">{current.front_text}</div>
            </div>
            <div className="flashcard__face flashcard__back" style={{ display: isFlipped ? 'flex' : 'none' }}>
              <div className="flashcard__meaning">{current.back_text}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flashcard-screen__footer">
        <button className="btn btn-primary" onClick={handleNext}>Tiếp theo</button>
      </div>
    </section>
  );
}
