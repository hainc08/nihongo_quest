/* ============================================
   NIHONGO QUEST — Screen Logic
   ============================================ */

const Screens = {
  // ── Onboarding State ──
  onboardingIndex: 0,

  // ── Flashcard State ──
  flashcardIndex: 0,
  flashcardFlipped: false,
  flashcardRemembered: 0,

  // ── Quiz State ──
  quizIndex: 0,
  quizScore: 0,
  quizAnswered: false,

  // ── Selected Goal ──
  selectedGoal: null,
  selectedTime: 10,

  // ── Initialize Onboarding ──
  initOnboarding() {
    this.onboardingIndex = 0;
    this.renderOnboardingSlide();
  },

  renderOnboardingSlide() {
    const slide = AppData.onboarding[this.onboardingIndex];
    const illustration = document.getElementById('onboarding-illustration');
    const badge = document.getElementById('onboarding-badge');
    const title = document.getElementById('onboarding-title');
    const desc = document.getElementById('onboarding-desc');
    const dots = document.querySelectorAll('#onboarding-dots .dot');
    const nextBtn = document.getElementById('onboarding-next');
    const skipBtn = document.getElementById('onboarding-skip');

    if (!illustration) return;

    illustration.textContent = slide.illustration;
    badge.textContent = slide.emoji;
    title.textContent = slide.title;
    desc.textContent = slide.description;

    // Update dots
    dots.forEach((dot, i) => {
      dot.classList.toggle('dot--active', i === this.onboardingIndex);
    });

    // Update button text
    if (this.onboardingIndex === AppData.onboarding.length - 1) {
      nextBtn.textContent = '🚀 Bắt đầu học';
      skipBtn.style.visibility = 'hidden';
    } else {
      nextBtn.textContent = 'Tiếp tục';
      skipBtn.style.visibility = 'visible';
    }

    // Animate slide
    const slides = document.querySelector('.onboarding__slides');
    slides.style.animation = 'none';
    slides.offsetHeight; // trigger reflow
    slides.style.animation = 'fadeInUp 0.4s ease';
  },

  nextOnboarding() {
    if (this.onboardingIndex < AppData.onboarding.length - 1) {
      this.onboardingIndex++;
      this.renderOnboardingSlide();
    } else {
      App.navigateTo('goal-selection');
    }
  },

  skipOnboarding() {
    App.navigateTo('goal-selection');
  },

  // ── Goal Selection ──
  selectGoal(goalId) {
    this.selectedGoal = goalId;
    document.querySelectorAll('.goal-card').forEach(card => {
      const isSelected = card.dataset.goal === goalId;
      card.classList.toggle('selected', isSelected);
      const check = card.querySelector('.goal-card__check');
      check.innerHTML = isSelected ? '✓' : '';
    });
  },

  selectTime(minutes) {
    this.selectedTime = minutes;
    document.querySelectorAll('.time-option').forEach(opt => {
      opt.classList.toggle('selected', parseInt(opt.dataset.time) === minutes);
    });
  },

  // ── Flashcard Logic ──
  initFlashcards() {
    this.flashcardIndex = 0;
    this.flashcardFlipped = false;
    this.flashcardRemembered = 0;
    this.renderFlashcard();
  },

  renderFlashcard() {
    const item = AppData.lessonItems[this.flashcardIndex];
    if (!item) return;

    const card = document.getElementById('flashcard');
    const charFront = document.getElementById('fc-char-front');
    const charBack = document.getElementById('fc-char-back');
    const romaji = document.getElementById('fc-romaji');
    const example = document.getElementById('fc-example');
    const meaning = document.getElementById('fc-meaning');
    const progress = document.getElementById('fc-progress');
    const remembered = document.getElementById('fc-remembered');
    const flipBtn = document.getElementById('fc-flip-btn');
    const recallBtns = document.getElementById('fc-recall-btns');
    const quizBtn = document.getElementById('fc-quiz-btn');

    if (!charFront) return;

    charFront.textContent = item.hiragana;
    charBack.textContent = item.hiragana;
    romaji.textContent = item.romaji;
    example.textContent = item.example;
    meaning.textContent = item.meaning;
    progress.textContent = `${this.flashcardIndex + 1}/${AppData.lessonItems.length}`;
    remembered.textContent = `${this.flashcardRemembered}/${AppData.lessonItems.length} thẻ đã nhớ`;

    // Reset flip state
    card.classList.remove('flipped');
    this.flashcardFlipped = false;
    flipBtn.style.display = 'block';
    recallBtns.style.display = 'none';

    // Show quiz button on last card
    quizBtn.style.display = 'none';
  },

  flipFlashcard() {
    const card = document.getElementById('flashcard');
    const flipBtn = document.getElementById('fc-flip-btn');
    const recallBtns = document.getElementById('fc-recall-btns');

    card.classList.add('flipped');
    this.flashcardFlipped = true;
    flipBtn.style.display = 'none';
    recallBtns.style.display = 'flex';
  },

  recallFlashcard(level) {
    if (level === 'remembered') {
      this.flashcardRemembered++;
    }

    if (this.flashcardIndex < AppData.lessonItems.length - 1) {
      this.flashcardIndex++;
      this.renderFlashcard();
    } else {
      // Show quiz button
      const recallBtns = document.getElementById('fc-recall-btns');
      const quizBtn = document.getElementById('fc-quiz-btn');
      const remembered = document.getElementById('fc-remembered');
      recallBtns.style.display = 'none';
      quizBtn.style.display = 'block';
      remembered.textContent = `${this.flashcardRemembered}/${AppData.lessonItems.length} thẻ đã nhớ`;
    }
  },

  // ── Quiz Logic ──
  initQuiz() {
    this.quizIndex = 0;
    this.quizScore = 0;
    this.quizAnswered = false;
    this.renderQuizQuestion();
  },

  renderQuizQuestion() {
    const q = AppData.quizQuestions[this.quizIndex];
    if (!q) return;

    const counter = document.getElementById('quiz-counter');
    const progressFill = document.getElementById('quiz-progress-fill');
    const question = document.getElementById('quiz-question');
    const optionsContainer = document.getElementById('quiz-options');
    const feedback = document.getElementById('quiz-feedback');
    const continueBtn = document.getElementById('quiz-continue');

    if (!counter) return;

    counter.textContent = `Câu ${this.quizIndex + 1}/${AppData.quizQuestions.length}`;
    progressFill.style.width = `${((this.quizIndex) / AppData.quizQuestions.length) * 100}%`;
    question.textContent = q.question;
    feedback.style.display = 'none';
    continueBtn.style.display = 'none';
    this.quizAnswered = false;

    // Render options
    const letters = ['A', 'B', 'C', 'D'];
    optionsContainer.innerHTML = q.options.map((opt, i) => `
      <button class="quiz-option" onclick="Screens.answerQuiz(${i})" id="quiz-opt-${i}">
        <span class="quiz-option__letter">${letters[i]}</span>
        <span>${opt}</span>
      </button>
    `).join('');
  },

  answerQuiz(index) {
    if (this.quizAnswered) return;
    this.quizAnswered = true;

    const q = AppData.quizQuestions[this.quizIndex];
    const isCorrect = index === q.correct;
    const feedback = document.getElementById('quiz-feedback');
    const continueBtn = document.getElementById('quiz-continue');

    if (isCorrect) {
      this.quizScore++;
    }

    // Highlight answers
    const options = document.querySelectorAll('.quiz-option');
    options.forEach((opt, i) => {
      if (i === q.correct) {
        opt.classList.add('quiz-option--correct');
      } else if (i === index && !isCorrect) {
        opt.classList.add('quiz-option--wrong');
      }
      opt.classList.add('quiz-option--disabled');
    });

    // Show feedback
    feedback.style.display = 'block';
    feedback.className = `quiz-feedback quiz-feedback--${isCorrect ? 'correct' : 'wrong'}`;
    feedback.innerHTML = `
      <div class="quiz-feedback__title">${isCorrect ? '✅ Chính xác! +5 XP' : '❌ Chưa đúng'}</div>
      <div class="quiz-feedback__text">${q.explanation}</div>
    `;

    // Show continue button
    continueBtn.style.display = 'block';

    // Update label for last question
    if (this.quizIndex === AppData.quizQuestions.length - 1) {
      continueBtn.textContent = 'Xem kết quả';
    } else {
      continueBtn.textContent = 'Tiếp tục';
    }
  },

  nextQuizQuestion() {
    if (this.quizIndex < AppData.quizQuestions.length - 1) {
      this.quizIndex++;
      this.renderQuizQuestion();
    } else {
      this.showQuizResult();
    }
  },

  showQuizResult() {
    // Update result screen data
    const scoreText = document.getElementById('result-score');
    const scoreValue = document.getElementById('result-score-value');
    const xpValue = document.getElementById('result-xp');
    const progressFill = document.getElementById('result-progress-fill');
    const xpText = document.getElementById('result-xp-text');

    const total = AppData.quizQuestions.length;
    const xpEarned = this.quizScore * 5;

    if (scoreText) scoreText.textContent = `${this.quizScore}/${total}`;
    if (scoreValue) scoreValue.textContent = `${this.quizScore}`;
    if (xpValue) xpValue.textContent = `+${xpEarned} XP`;
    if (xpText) xpText.textContent = `${240 + xpEarned} / 300 XP`;

    // Update circular progress
    const circle = document.getElementById('result-circle');
    if (circle) {
      const percent = (this.quizScore / total) * 100;
      const circumference = 339.292;
      circle.style.strokeDashoffset = circumference - (percent / 100 * circumference);
    }

    if (progressFill) {
      progressFill.style.width = `${((240 + xpEarned) / 300) * 100}%`;
    }

    App.navigateTo('quiz-result');
  },

  // ── Render Home ──
  renderHome() {
    const data = AppData.user;
    const lesson = AppData.todayLesson;

    // Update greeting
    const greetingEl = document.getElementById('home-greeting');
    if (greetingEl) greetingEl.textContent = `Xin chào, ${data.name}!`;

    // Update progress bar
    const lessonProgress = document.getElementById('home-lesson-progress');
    if (lessonProgress) {
      lessonProgress.style.width = `${(lesson.progress / lesson.total) * 100}%`;
    }

    // Update XP bar
    const xpBar = document.getElementById('home-xp-bar');
    if (xpBar) {
      xpBar.style.width = `${(data.xp / data.nextLevelXp) * 100}%`;
    }
  },

  // ── Render Profile ──
  renderProfile() {
    // Stats are rendered in HTML, no dynamic updates needed for prototype
  }
};

/* ============================================
   AD SYSTEM — Rewarded Video & Unlock
   ============================================ */

const AdManager = {
  // ── Show Ad Offer Modal ──
  // type: 'double_xp' | 'unlock_lesson' | 'hint'
  showAdOffer(type) {
    const overlay = document.getElementById('ad-overlay');
    const icon = document.getElementById('ad-modal-icon');
    const title = document.getElementById('ad-modal-title');
    const desc = document.getElementById('ad-modal-desc');
    const reward = document.getElementById('ad-modal-reward');
    const watchBtn = document.getElementById('ad-modal-watch');

    if (!overlay) return;

    // Configure modal based on type
    const configs = {
      double_xp: {
        icon: '⭐',
        title: 'Nhân đôi XP!',
        desc: 'Xem một video ngắn để nhân đôi điểm XP vừa nhận được.',
        reward: '🎁 Phần thưởng: x2 XP',
        btnText: '🎬 Xem video (5 giây)',
        rewardType: 'double_xp'
      },
      unlock_lesson: {
        icon: '🔓',
        title: 'Mở khóa bài học sớm!',
        desc: 'Xem video quảng cáo để mở khóa bài học tiếp theo mà không cần hoàn thành bài trước.',
        reward: '🎁 Phần thưởng: Mở khóa 1 bài',
        btnText: '🎬 Xem video (5 giây)',
        rewardType: 'unlock_lesson'
      },
      hint: {
        icon: '💡',
        title: 'Nhận gợi ý miễn phí!',
        desc: 'Xem một video ngắn để nhận gợi ý cho câu hỏi này.',
        reward: '🎁 Phần thưởng: 1 gợi ý',
        btnText: '🎬 Xem video (5 giây)',
        rewardType: 'hint'
      },
      bonus_xp: {
        icon: '🎰',
        title: 'Nhận XP bonus!',
        desc: 'Xem video quảng cáo để nhận thêm 50 XP miễn phí mỗi ngày.',
        reward: '🎁 Phần thưởng: +50 XP',
        btnText: '🎬 Xem video (5 giây)',
        rewardType: 'bonus_xp'
      }
    };

    const config = configs[type] || configs.bonus_xp;
    
    icon.textContent = config.icon;
    title.textContent = config.title;
    desc.textContent = config.desc;
    reward.textContent = config.reward;
    watchBtn.textContent = config.btnText;
    watchBtn.onclick = () => this.playAd(config.rewardType);

    overlay.classList.add('active');
  },

  // ── Close Ad Modal ──
  closeAdOffer() {
    document.getElementById('ad-overlay').classList.remove('active');
  },

  // ── Play Simulated Ad ──
  playAd(rewardType) {
    this.closeAdOffer();

    const adScreen = document.getElementById('ad-playing');
    const timer = document.getElementById('ad-timer');
    const progressFill = document.getElementById('ad-progress-fill');
    const closeBtn = document.getElementById('ad-close');
    
    if (!adScreen) return;

    adScreen.classList.add('active');
    closeBtn.classList.remove('visible');
    
    let countdown = 5;
    timer.textContent = `Quảng cáo kết thúc sau ${countdown} giây...`;
    progressFill.style.width = '0%';
    progressFill.style.transition = 'none';

    // Animate progress
    requestAnimationFrame(() => {
      progressFill.style.transition = 'width 5s linear';
      progressFill.style.width = '100%';
    });

    // Countdown timer
    const interval = setInterval(() => {
      countdown--;
      if (countdown > 0) {
        timer.textContent = `Quảng cáo kết thúc sau ${countdown} giây...`;
      } else {
        timer.textContent = 'Quảng cáo đã kết thúc!';
        closeBtn.classList.add('visible');
        closeBtn.onclick = () => this.onAdComplete(rewardType);
        clearInterval(interval);
      }
    }, 1000);
  },

  // ── Ad Completed → Show Reward ──
  onAdComplete(rewardType) {
    document.getElementById('ad-playing').classList.remove('active');

    const rewardScreen = document.getElementById('ad-reward');
    const rewardEmoji = document.getElementById('ad-reward-emoji');
    const rewardTitle = document.getElementById('ad-reward-title');
    const rewardValue = document.getElementById('ad-reward-value');

    if (!rewardScreen) return;

    const rewards = {
      double_xp: {
        emoji: '🌟',
        title: 'XP đã được nhân đôi!',
        value: '+70 XP'
      },
      unlock_lesson: {
        emoji: '🔓',
        title: 'Bài học đã mở khóa!',
        value: 'Hiragana nhóm か'
      },
      hint: {
        emoji: '💡',
        title: 'Đã nhận gợi ý!',
        value: 'Xem gợi ý bên dưới'
      },
      bonus_xp: {
        emoji: '🎁',
        title: 'Đã nhận XP bonus!',
        value: '+50 XP'
      }
    };

    const r = rewards[rewardType] || rewards.bonus_xp;
    rewardEmoji.textContent = r.emoji;
    rewardTitle.textContent = r.title;
    rewardValue.textContent = r.value;

    rewardScreen.classList.add('active');
  },

  // ── Close Reward Screen ──
  closeReward() {
    document.getElementById('ad-reward').classList.remove('active');
  }
};
