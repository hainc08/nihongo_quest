/* ============================================
   NIHONGO QUEST — App Controller
   ============================================ */
import { getLessonItems } from './supabaseServices.js';

// ── Audio: Text-to-Speech phát âm tiếng Nhật ──
function playAudio(text, btn) {
  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ja-JP';
  utterance.rate = 0.8;   // Chậm hơn để nghe rõ
  utterance.pitch = 1.1;

  // Try to find a Japanese voice
  const voices = window.speechSynthesis.getVoices();
  const jaVoice = voices.find(v => v.lang.startsWith('ja'));
  if (jaVoice) {
    utterance.voice = jaVoice;
  }

  // Visual feedback on button
  if (btn) {
    btn.classList.add('audio-playing');
    utterance.onend = () => btn.classList.remove('audio-playing');
    utterance.onerror = () => btn.classList.remove('audio-playing');
  }

  window.speechSynthesis.speak(utterance);
}

// Pre-load voices (some browsers load them async)
if (window.speechSynthesis) {
  window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices();
  };
}

const App = {
  currentScreen: 'splash',
  history: [],
  bottomNavScreens: ['home', 'learning-path', 'daily-mission', 'profile'],

  // ── Initialize App ──
  async init() {
    this.showScreen('splash');

    // 🚀 Test lấy dữ liệu từ Supabase khi App vừa khởi động
    try {
      const dataTuSupabase = await getLessonItems();
      console.log('✅ Dữ liệu từ Supabase đã tải thành công:', dataTuSupabase);
    } catch (err) {
      console.error('❌ Lỗi kết nối Supabase:', err);
    }

    // Auto-transition from splash after 2.5s
    setTimeout(() => {
      this.navigateTo('onboarding');
      Screens.initOnboarding();
    }, 2500);

    // Initialize bottom nav
    this.initBottomNav();
  },

  // ── Show Screen ──
  showScreen(screenId, animation = 'fade-in') {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(s => {
      s.classList.remove('active', 'slide-in-right', 'slide-in-left', 'fade-in');
    });

    const target = document.getElementById(screenId);
    if (target) {
      target.classList.add('active', animation);
      target.scrollTop = 0;
    }

    this.currentScreen = screenId;
    this.updateBottomNav(screenId);
  },

  // ── Navigate Forward ──
  navigateTo(screenId) {
    this.history.push(this.currentScreen);

    // Determine animation
    const isBottomNav = this.bottomNavScreens.includes(screenId);
    const animation = isBottomNav ? 'fade-in' : 'slide-in-right';

    this.showScreen(screenId, animation);

    // Screen-specific init
    if (screenId === 'home') {
      Screens.renderHome();
    } else if (screenId === 'flashcard-screen') {
      Screens.initFlashcards();
    } else if (screenId === 'quiz-screen') {
      Screens.initQuiz();
    }
  },

  // ── Navigate Back ──
  goBack() {
    if (this.history.length > 0) {
      const prevScreen = this.history.pop();
      this.showScreen(prevScreen, 'slide-in-left');

      if (prevScreen === 'home') {
        Screens.renderHome();
      }
    }
  },

  // ── Bottom Navigation ──
  initBottomNav() {
    const navItems = document.querySelectorAll('.bottom-nav__item');
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        const target = item.dataset.screen;
        if (target && target !== this.currentScreen) {
          this.history = []; // Clear history on tab switch
          this.navigateTo(target);
        }
      });
    });
  },

  updateBottomNav(screenId) {
    const navItems = document.querySelectorAll('.bottom-nav__item');
    navItems.forEach(item => {
      const isActive = item.dataset.screen === screenId;
      item.classList.toggle('bottom-nav__item--active', isActive);
    });
  }
};

// ── Start App ──
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
