/* ============================================
   NIHONGO QUEST — Mock Data
   ============================================ */

const AppData = {
  // ── User Profile ──
  user: {
    name: 'Bé Hai',
    avatar: '🐻',
    level: 3,
    title: 'Nhà thám hiểm nhí',
    xp: 240,
    nextLevelXp: 300,
    streakDays: 3,
    totalXp: 520,
    goal: 'JLPT N5',
    dailyGoalMinutes: 10,
    stats: {
      streak: 7,
      lessonsCompleted: 18,
      quizzesDone: 32,
      wordsMemorized: 120,
      accuracy: 84
    }
  },

  // ── Onboarding Slides ──
  onboarding: [
    {
      emoji: '🐶',
      illustration: '🗺️',
      title: 'Hành trình diệu kỳ',
      description: 'Cùng bắt đầu chuyến phiêu lưu học tiếng Nhật với các bạn động vật đáng yêu!'
    },
    {
      emoji: '🦄',
      illustration: '🏰',
      title: 'Khám phá thế giới',
      description: 'Hoàn thành nhiệm vụ để thu thập cà rốt và mở khóa những vùng đất mới.'
    },
    {
      emoji: '🚀',
      illustration: '🪐',
      title: 'Trở thành siêu nhân',
      description: 'Học mỗi ngày để tích lũy sức mạnh và trở thành siêu nhân tiếng Nhật!'
    }
  ],

  // ── Goal Options ──
  goals: [
    { id: 'zero', icon: '🐣', title: 'Bé mới bắt đầu', subtitle: 'Bé chưa biết tiếng Nhật' },
    { id: 'jlpt', icon: '🦸‍♂️', title: 'Siêu nhân N5', subtitle: 'Bé muốn có lộ trình bài bản' },
    { id: 'speak', icon: '🦜', title: 'Nói giỏi như vẹt', subtitle: 'Bé thích nói chuyện' },
    { id: 'work', icon: '👨‍🚀', title: 'Ước mơ bay cao', subtitle: 'Học cho tương lai của bé' }
  ],

  timeOptions: [
    { value: 5, label: '5 phút' },
    { value: 10, label: '10 phút' },
    { value: 15, label: '15 phút' },
    { value: 30, label: '30 phút' }
  ],

  // ── Today's Lesson ──
  todayLesson: {
    title: 'Hiragana nhóm あ',
    chapter: 'Chapter 1: Khởi động',
    progress: 2,
    total: 5,
    rewardXp: 20,
    duration: '5 phút',
    characterCount: '5 ký tự',
    flow: 'Học → Thẻ bài → Trò chơi'
  },

  // ── Lesson Items (Hiragana group あ) ──
  lessonItems: [
    { hiragana: 'あ', romaji: 'a', example: 'あめ', meaning: 'mưa', audio: '🐰' },
    { hiragana: 'い', romaji: 'i', example: 'いぬ', meaning: 'chó', audio: '🐰' },
    { hiragana: 'う', romaji: 'u', example: 'うみ', meaning: 'biển', audio: '🐰' },
    { hiragana: 'え', romaji: 'e', example: 'えき', meaning: 'nhà ga', audio: '🐰' },
    { hiragana: 'お', romaji: 'o', example: 'おかね', meaning: 'tiền', audio: '🐰' }
  ],

  // ── Quiz Questions ──
  quizQuestions: [
    {
      question: "Chữ 'あ' đọc là gì?",
      options: ['a', 'i', 'u', 'e'],
      correct: 0,
      explanation: 'あ được đọc là "a".'
    },
    {
      question: "Chữ 'い' đọc là gì?",
      options: ['u', 'e', 'i', 'a'],
      correct: 2,
      explanation: 'い được đọc là "i".'
    },
    {
      question: "Chữ 'う' đọc là gì?",
      options: ['o', 'u', 'a', 'e'],
      correct: 1,
      explanation: 'う được đọc là "u".'
    },
    {
      question: "Chữ nào đọc là 'e'?",
      options: ['あ', 'い', 'う', 'え'],
      correct: 3,
      explanation: 'え được đọc là "e".'
    },
    {
      question: "Chữ 'お' đọc là gì?",
      options: ['a', 'e', 'o', 'u'],
      correct: 2,
      explanation: 'お được đọc là "o".'
    },
    {
      question: "'あめ' có nghĩa là gì?",
      options: ['chó', 'biển', 'mưa', 'tiền'],
      correct: 2,
      explanation: 'あめ (ame) có nghĩa là "mưa".'
    },
    {
      question: "'いぬ' có nghĩa là gì?",
      options: ['mưa', 'chó', 'nhà ga', 'biển'],
      correct: 1,
      explanation: 'いぬ (inu) có nghĩa là "chó".'
    },
    {
      question: "Chữ nào đọc là 'a'?",
      options: ['お', 'い', 'あ', 'う'],
      correct: 2,
      explanation: 'あ được đọc là "a".'
    },
    {
      question: "'うみ' có nghĩa là gì?",
      options: ['biển', 'mưa', 'tiền', 'chó'],
      correct: 0,
      explanation: 'うみ (umi) có nghĩa là "biển".'
    },
    {
      question: "'えき' có nghĩa là gì?",
      options: ['tiền', 'biển', 'chó', 'nhà ga'],
      correct: 3,
      explanation: 'えき (eki) có nghĩa là "nhà ga".'
    }
  ],

  // ── Learning Path ──
  learningPath: [
    {
      chapter: 1,
      title: 'Đảo Khởi Hành',
      icon: '🏝️',
      status: 'active',
      lessons: [
        { id: 1, title: 'Làm quen tiếng Nhật', status: 'completed', xp: 15 },
        { id: 2, title: 'Nhóm chữ あ', status: 'current', xp: 20 },
        { id: 3, title: 'Nhóm chữ か', status: 'locked', xp: 20 },
        { id: 'boss1', title: 'Đánh bại quái thú Hiragana', status: 'locked', xp: 50, isBoss: true }
      ]
    },
    {
      chapter: 2,
      title: 'Rừng Katakana',
      icon: '🌲',
      status: 'locked',
      lessons: [
        { id: 4, title: 'Katakana nhóm ア', status: 'locked', xp: 20 },
        { id: 5, title: 'Katakana nhóm カ', status: 'locked', xp: 20 },
        { id: 'boss2', title: 'Giải cứu công chúa Katakana', status: 'locked', xp: 50, isBoss: true }
      ]
    },
    {
      chapter: 3,
      title: 'Làng Từ Vựng',
      icon: '🏡',
      status: 'locked',
      lessons: [
        { id: 6, title: 'Chào hỏi bạn bè', status: 'locked', xp: 25 },
        { id: 7, title: 'Đếm số 1-10', status: 'locked', xp: 25 },
        { id: 'boss3', title: 'Lễ hội từ vựng', status: 'locked', xp: 60, isBoss: true }
      ]
    },
    {
      chapter: 4,
      title: 'Lâu đài Ngữ Pháp',
      icon: '🏰',
      status: 'locked',
      lessons: [
        { id: 8, title: 'Cấu trúc は...です', status: 'locked', xp: 30 },
        { id: 9, title: 'Trợ từ siêu đẳng', status: 'locked', xp: 30 },
        { id: 'boss4', title: 'Đánh boss Ngữ pháp N5', status: 'locked', xp: 70, isBoss: true }
      ]
    }
  ],

  // ── Daily Missions ──
  dailyMissions: [
    {
      id: 1,
      icon: '🐾',
      title: 'Hoàn thành 1 bài học',
      reward: '+20 Cà rốt',
      current: 0,
      total: 1,
      status: 'not_started'
    },
    {
      id: 2,
      icon: '🧩',
      title: 'Làm 2 trò chơi quiz',
      reward: '+15 Cà rốt',
      current: 1,
      total: 2,
      status: 'in_progress'
    },
    {
      id: 3,
      icon: '🪄',
      title: 'Ôn tập 10 thẻ phép thuật',
      reward: '+10 Cà rốt',
      current: 5,
      total: 10,
      status: 'in_progress'
    },
    {
      id: 4,
      icon: '🦄',
      title: 'Học liên tục hôm nay',
      reward: 'Duy trì chuỗi ngày',
      current: 1,
      total: 1,
      status: 'completed'
    }
  ],

  // ── Badges ──
  badges: [
    { id: 1, icon: '🐣', name: 'Gà con mới nở', condition: 'Hoàn thành bài đầu tiên', unlocked: true },
    { id: 2, icon: '🐰', name: 'Thỏ con nhanh nhẹn', condition: 'Hoàn thành nhóm あ', unlocked: true },
    { id: 3, icon: '🐼', name: 'Gấu trúc thám hiểm', condition: 'Hoàn thành Hiragana', unlocked: false },
    { id: 4, icon: '🦄', name: 'Kỳ lân thông thái', condition: 'Đạt 100% trong một trò chơi', unlocked: false },
    { id: 5, icon: '🦊', name: 'Cáo nhỏ kiên trì 7', condition: 'Học 7 ngày liên tiếp', unlocked: true },
    { id: 6, icon: '🐨', name: 'Koala N5', condition: 'Hoàn thành 10 bài N5', unlocked: false },
    { id: 7, icon: '🐆', name: 'Báo đốm tốc độ', condition: 'Hoàn thành quiz dưới 1 phút', unlocked: false },
    { id: 8, icon: '🐢', name: 'Rùa con bền bỉ', condition: 'Học 30 ngày liên tiếp', unlocked: false },
    { id: 9, icon: '🦁', name: 'Sư tử chúa N5', condition: 'Hoàn thành toàn bộ N5', unlocked: false }
  ],

  // ── Settings ──
  settings: [
    { icon: '🐵', title: 'Tài khoản của bé', type: 'link' },
    { icon: '🎯', title: 'Mục tiêu học', type: 'link' },
    { icon: '⏰', title: 'Giờ học mỗi ngày', type: 'link' },
    { icon: '🐸', title: 'Nhắc nhở học', type: 'toggle', value: true },
    { icon: '🐰', title: 'Âm thanh', type: 'toggle', value: true },
    { icon: '🌎', title: 'Ngôn ngữ', type: 'link' },
    { icon: '📜', title: 'Thông tin', type: 'link' },
    { icon: '👋', title: 'Thoát ra', type: 'danger' }
  ]
};
