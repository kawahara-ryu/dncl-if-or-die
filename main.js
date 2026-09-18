// 『イフ・オア・ダイ 〜運命の条件分岐デスゲーム〜』メインゲームスクリプト

// === 1. オーディオシステム (Web Audio API & 魔王魂BGM) ===
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let bgmEnabled = true;

const audioTitle = document.getElementById('audio-title');
const audioGame = document.getElementById('audio-game');
if (audioTitle) audioTitle.volume = 0.35;
if (audioGame) audioGame.volume = 0.35;

function playSoundTone(freq, type, dur, vol = 0.1) {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  gain.gain.setValueAtTime(vol, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + dur);
  osc.stop(audioCtx.currentTime + dur);
}

function playCorrectSound() {
  playSoundTone(880, 'sine', 0.12, 0.15);
  setTimeout(() => playSoundTone(1174, 'sine', 0.15, 0.15), 80);
  setTimeout(() => playSoundTone(1760, 'sine', 0.25, 0.15), 160);
}

function playWrongSound() {
  playSoundTone(150, 'sawtooth', 0.2, 0.25);
  setTimeout(() => playSoundTone(90, 'square', 0.35, 0.3), 100);
}

function playAlarmSound() {
  playSoundTone(600, 'square', 0.1, 0.15);
  setTimeout(() => playSoundTone(400, 'square', 0.1, 0.15), 100);
}

function playFanfareSound() {
  const notes = [523.25, 659.25, 783.99, 1046.50];
  notes.forEach((freq, i) => {
    setTimeout(() => playSoundTone(freq, 'triangle', 0.35, 0.2), i * 140);
  });
}

function toggleBgm() {
  bgmEnabled = !bgmEnabled;
  const btn = document.getElementById('bgm-toggle-btn');
  if (bgmEnabled) {
    btn.innerText = '🎵 BGM: ON';
    btn.style.borderColor = 'var(--neon-cyan)';
    btn.style.color = 'var(--neon-cyan)';
    // 再生再開
    if (currentScreen === 'screen-title') playTitleBgm();
    else if (currentScreen === 'screen-game') playGameBgm();
  } else {
    btn.innerText = '🔇 BGM: OFF';
    btn.style.borderColor = '#666';
    btn.style.color = '#888';
    if (audioTitle) audioTitle.pause();
    if (audioGame) audioGame.pause();
  }
}

function playTitleBgm() {
  if (!bgmEnabled) return;
  if (audioGame) audioGame.pause();
  if (audioTitle) {
    audioTitle.currentTime = 0;
    audioTitle.play().catch(() => {});
  }
}

function playGameBgm() {
  if (!bgmEnabled) return;
  if (audioTitle) audioTitle.pause();
  if (audioGame) {
    audioGame.currentTime = 0;
    audioGame.play().catch(() => {});
  }
}

function stopAllBgm() {
  if (audioTitle) audioTitle.pause();
  if (audioGame) audioGame.pause();
}

// === 2. Matter.js 物理エンジン演出 ===
const { Engine, World, Bodies, Body, Runner } = Matter;
let engine, world, runner;
const physicsContainer = document.getElementById('physics-canvas');

function initPhysics() {
  engine = Engine.create();
  world = engine.world;
  world.gravity.y = 1.0;

  // 地面と左右壁
  const w = window.innerWidth;
  const h = window.innerHeight;
  const ground = Bodies.rectangle(w / 2, h + 30, w * 2, 60, { isStatic: true });
  const leftWall = Bodies.rectangle(-30, h / 2, 60, h * 2, { isStatic: true });
  const rightWall = Bodies.rectangle(w + 30, h / 2, 60, h * 2, { isStatic: true });
  World.add(world, [ground, leftWall, rightWall]);

  runner = Runner.create();
  Runner.run(runner, engine);

  window.addEventListener('resize', () => {
    Body.setPosition(ground, { x: window.innerWidth / 2, y: window.innerHeight + 30 });
    Body.setPosition(leftWall, { x: -30, y: window.innerHeight / 2 });
    Body.setPosition(rightWall, { x: window.innerWidth + 30, y: window.innerHeight / 2 });
  });
}

function spawnPhysicsDOM(text, x, y, opts = {}) {
  const el = document.createElement('div');
  el.className = 'phys-item ' + (opts.className || '');
  el.style.position = 'fixed';
  el.style.left = '0';
  el.style.top = '0';
  el.style.pointerEvents = 'none';
  el.style.zIndex = '150';
  el.innerHTML = text;

  // インラインスタイリング
  if (opts.color) el.style.color = opts.color;
  if (opts.bg) el.style.background = opts.bg;
  if (opts.border) el.style.border = opts.border;
  if (opts.padding) el.style.padding = opts.padding;
  if (opts.borderRadius) el.style.borderRadius = opts.borderRadius;
  if (opts.fontSize) el.style.fontSize = opts.fontSize;
  if (opts.boxShadow) el.style.boxShadow = opts.boxShadow;

  physicsContainer.appendChild(el);

  const rect = el.getBoundingClientRect();
  const width = opts.w || (rect.width > 0 ? rect.width : 50);
  const height = opts.h || (rect.height > 0 ? rect.height : 50);

  const body = Bodies.rectangle(x, y, width, height, {
    restitution: opts.restitution !== undefined ? opts.restitution : 0.6,
    friction: 0.1,
    density: 0.005
  });

  if (opts.vx || opts.vy) {
    Body.setVelocity(body, { x: opts.vx || 0, y: opts.vy || 0 });
  }
  if (opts.angularVelocity) {
    Body.setAngularVelocity(body, opts.angularVelocity);
  }

  World.add(world, body);

  // 更新ループ
  const updatePos = () => {
    if (!body || !el) return;
    el.style.transform = `translate(${body.position.x - width / 2}px, ${body.position.y - height / 2}px) rotate(${body.angle}rad)`;
    if (body.position.y > window.innerHeight + 150) {
      cleanup();
    }
  };

  const timer = setInterval(updatePos, 16);
  const cleanup = () => {
    clearInterval(timer);
    if (body) World.remove(world, body);
    if (el) el.remove();
  };

  // 一定時間で消去
  setTimeout(cleanup, opts.life || 3500);
}

// 正解時の華やかな物理演出
function triggerSuccessPhysics() {
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight * 0.4;
  const gems = ['💎', '⭐', '✨', '🟢', '👑', '🎉', '🍀'];

  for (let i = 0; i < 15; i++) {
    const gem = gems[Math.floor(Math.random() * gems.length)];
    const vx = (Math.random() - 0.5) * 16;
    const vy = -(Math.random() * 12 + 6);
    spawnPhysicsDOM(gem, centerX, centerY, {
      fontSize: '2rem',
      vx,
      vy,
      angularVelocity: (Math.random() - 0.5) * 0.3,
      life: 2500
    });
  }
}

// 不正解時のシュールな処刑物理演出
function triggerFailurePhysics() {
  const w = window.innerWidth;
  const traps = [
    { text: '⚠️ 100t ELSE ⚠️', bg: '#ff2a6d', color: '#fff', w: 180, h: 60, border: '2px solid #fff' },
    { text: '🌭 ウインナー急行 🌭', bg: '#d90429', color: '#fff', w: 200, h: 50, border: '2px solid #ffb86c' },
    { text: '💥 文法エラー 💥', bg: '#7b2cbf', color: '#fff', w: 160, h: 50, border: '2px solid #00f3ff' },
    { text: '🐙 タコ焼き落とし 🐙', bg: '#ffb86c', color: '#000', w: 170, h: 50, border: '2px solid #000' }
  ];

  const trap = traps[Math.floor(Math.random() * traps.length)];
  const spawnX = Math.random() * (w - 200) + 100;
  spawnPhysicsDOM(trap.text, spawnX, -70, {
    bg: trap.bg,
    color: trap.color,
    w: trap.w,
    h: trap.h,
    border: trap.border,
    padding: '8px 12px',
    borderRadius: '8px',
    fontSize: '1.1rem',
    boxShadow: '0 0 20px rgba(255,42,109,0.7)',
    vx: (Math.random() - 0.5) * 6,
    vy: Math.random() * 4 + 8,
    angularVelocity: (Math.random() - 0.5) * 0.2,
    life: 3000
  });
}

// === 3. ゲーム進行ロジック ===
let currentScreen = 'screen-title';
let currentDifficulty = 'beginner';
let gameQuestions = [];
let currentIndex = 0;
let currentHP = 5;
let maxHP = 5;
let currentScore = 0;
let currentCombo = 0;
let maxCombo = 0;
let correctCount = 0;
let answeredLog = []; // 復習用ログ

let timerInterval = null;
let timeLeft = 0;
let maxTime = 0;
let isAnswerLocked = false;

// ボスセリフリスト
const BOSS_QUOTES = {
  start: [
    "「フッ…生きてこのコロシアムを出られるかな？」",
    "「条件分岐を制する者が、デスゲームを制す！」",
    "「順次構造を甘く見ると、奈落へ落ちるぞ！」"
  ],
  correct: [
    "「グヌヌ…！見事な条件判定だ…！」",
    "「やるな…だが次の分岐はどうかな！？」",
    "「フン、たまたまTrueだっただけだ！」",
    "「ぬぅ…！アボカドの計算が狂ったか…！」"
  ],
  wrong: [
    "「フハハ！elseの奈落へ落ちるがよい！」",
    "「そのインデントでは生き残れんぞ！」",
    "「頭上注意！処刑トラップ発動だ！」",
    "「残念だったな！あまりはパーセントだ！」"
  ]
};

function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(screenId);
  if (target) target.classList.add('active');
  currentScreen = screenId;
}

function goToTitle() {
  clearInterval(timerInterval);
  showScreen('screen-title');
  playTitleBgm();
}

function goToDifficulty() {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  playSoundTone(1200, 'sine', 0.1, 0.1);
  showScreen('screen-difficulty');
}

function startGame(diff) {
  currentDifficulty = diff;
  showScreen('screen-game');
  playGameBgm();

  // 難易度別初期化
  if (diff === 'beginner') {
    maxHP = 5;
    maxTime = 0; // 制限時間なし
    gameQuestions = shuffleArray(QUESTIONS_DATA.filter(q => q.difficulties.includes('beginner'))).slice(0, 8);
  } else if (diff === 'intermediate') {
    maxHP = 4;
    maxTime = 45;
    gameQuestions = shuffleArray(QUESTIONS_DATA.filter(q => q.difficulties.includes('intermediate'))).slice(0, 10);
  } else if (diff === 'advanced') {
    maxHP = 3;
    maxTime = 30;
    gameQuestions = shuffleArray(QUESTIONS_DATA.filter(q => q.difficulties.includes('advanced'))).slice(0, 12);
  } else if (diff === 'survival') {
    maxHP = 3;
    maxTime = 25;
    gameQuestions = shuffleArray([...QUESTIONS_DATA]); // 全問から
  }

  currentHP = maxHP;
  currentIndex = 0;
  currentScore = 0;
  currentCombo = 0;
  maxCombo = 0;
  correctCount = 0;
  answeredLog = [];

  updateHUD();
  setBossQuote(BOSS_QUOTES.start[Math.floor(Math.random() * BOSS_QUOTES.start.length)]);
  loadQuestion();
}

function retryGame() {
  startGame(currentDifficulty);
}

function updateHUD() {
  // HP表示（ハート）
  const hudHp = document.getElementById('hud-hp');
  let hearts = '';
  for (let i = 0; i < maxHP; i++) {
    hearts += (i < currentHP) ? '♥' : '♡';
  }
  hudHp.innerHTML = hearts;

  // スコア表示
  document.getElementById('hud-score').innerText = currentScore.toLocaleString();

  // コンボ表示
  const comboEl = document.getElementById('hud-combo');
  if (currentCombo >= 2) {
    comboEl.style.display = 'inline-block';
    comboEl.innerText = `${currentCombo} COMBO!`;
  } else {
    comboEl.style.display = 'none';
  }
}

function setBossQuote(msg) {
  const box = document.getElementById('dialogue-box');
  if (box) box.innerText = msg;
}

function loadQuestion() {
  isAnswerLocked = false;
  document.getElementById('hint-popup').style.display = 'none';

  // サバイバルモードで問題プールが尽きたら再シャッフル補充
  if (currentDifficulty === 'survival' && currentIndex >= gameQuestions.length) {
    gameQuestions = gameQuestions.concat(shuffleArray([...QUESTIONS_DATA]));
  }

  const q = gameQuestions[currentIndex];
  if (!q) {
    finishGame(true);
    return;
  }

  // 進捗表示
  document.getElementById('q-category').innerText = q.category;
  if (currentDifficulty === 'survival') {
    document.getElementById('q-progress').innerText = `STAGE ${currentIndex + 1}`;
  } else {
    document.getElementById('q-progress').innerText = `Q ${currentIndex + 1} / ${gameQuestions.length}`;
  }

  // 問題文・コード
  document.getElementById('q-text').innerText = q.question;
  document.getElementById('q-code').innerText = q.code;

  // 選択肢ボタンの描画
  const grid = document.getElementById('options-grid');
  grid.innerHTML = '';
  q.options.forEach((optText, i) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.onclick = () => selectOption(i);
    btn.innerHTML = `
      <span class="opt-index">${i + 1}</span>
      <span class="opt-text">${escapeHtml(optText)}</span>
    `;
    grid.appendChild(btn);
  });

  // ヒントボタンのテキスト
  const hintBtn = document.getElementById('btn-hint');
  if (currentDifficulty === 'beginner') {
    hintBtn.innerText = '💡 ヒントを見る (無料)';
  } else {
    hintBtn.innerText = '💡 ヒントを見る (HP -1)';
  }

  // タイマー開始
  startTimer();
}

function startTimer() {
  clearInterval(timerInterval);
  const bar = document.getElementById('timer-bar');

  if (maxTime === 0) {
    bar.style.width = '100%';
    bar.classList.remove('warning');
    return;
  }

  // サバイバルならステージ進むごとに時間短縮（最短10秒）
  if (currentDifficulty === 'survival') {
    timeLeft = Math.max(10, 25 - Math.floor(currentIndex / 3) * 2);
  } else {
    timeLeft = maxTime;
  }

  const totalTime = timeLeft;
  bar.style.width = '100%';
  bar.classList.remove('warning');

  timerInterval = setInterval(() => {
    timeLeft -= 0.1;
    const pct = Math.max(0, (timeLeft / totalTime) * 100);
    bar.style.width = pct + '%';

    if (pct < 30) {
      bar.classList.add('warning');
    }

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      handleTimeUp();
    }
  }, 100);
}

function handleTimeUp() {
  if (isAnswerLocked) return;
  playAlarmSound();
  setBossQuote("「時間切れだ！elseの刑に処す！」");
  selectOption(-1); // 時間切れミス
}

function selectOption(selectedIndex) {
  if (isAnswerLocked) return;
  isAnswerLocked = true;
  clearInterval(timerInterval);

  const q = gameQuestions[currentIndex];
  const isCorrect = (selectedIndex === q.answer);

  // ログ記録
  answeredLog.push({
    question: q,
    selected: selectedIndex,
    isCorrect: isCorrect
  });

  const buttons = document.querySelectorAll('.option-btn');

  if (isCorrect) {
    // 正解処理
    correctCount++;
    currentCombo++;
    if (currentCombo > maxCombo) maxCombo = currentCombo;

    // スコア加算 (基本1000点 × コンボ倍率 + 残り時間ボーナス)
    const comboBonus = 1 + (currentCombo - 1) * 0.1;
    const timeBonus = maxTime > 0 ? Math.floor(timeLeft * 20) : 0;
    const earned = Math.floor(1000 * comboBonus) + timeBonus;
    currentScore += earned;

    playCorrectSound();
    triggerSuccessPhysics();
    triggerFlash('green');

    // ボタンのハイライト
    if (buttons[selectedIndex]) buttons[selectedIndex].classList.add('correct');

    const quote = BOSS_QUOTES.correct[Math.floor(Math.random() * BOSS_QUOTES.correct.length)];
    setBossQuote(quote);

  } else {
    // 不正解処理
    currentCombo = 0;
    currentHP--;

    playWrongSound();
    triggerFailurePhysics();
    triggerScreenShake();
    triggerFlash('red');

    // ボタンのハイライト
    if (buttons[selectedIndex]) buttons[selectedIndex].classList.add('wrong');
    if (buttons[q.answer]) buttons[q.answer].classList.add('correct');

    const quote = BOSS_QUOTES.wrong[Math.floor(Math.random() * BOSS_QUOTES.wrong.length)];
    setBossQuote(quote);
  }

  updateHUD();

  // 次のステップまたはゲーム終了へ
  setTimeout(() => {
    if (currentHP <= 0) {
      finishGame(false);
    } else {
      currentIndex++;
      if (currentDifficulty !== 'survival' && currentIndex >= gameQuestions.length) {
        finishGame(true);
      } else {
        loadQuestion();
      }
    }
  }, 1600);
}

function useHint() {
  const q = gameQuestions[currentIndex];
  if (!q || isAnswerLocked) return;

  const hintBox = document.getElementById('hint-popup');
  if (hintBox.style.display === 'block') return; // すでに表示中

  if (currentDifficulty !== 'beginner') {
    if (currentHP <= 1) {
      alert("HPが足りないため、ヒントを使えません！");
      return;
    }
    currentHP--;
    updateHUD();
    playSoundTone(300, 'sine', 0.1, 0.1);
  }

  hintBox.innerHTML = `💡 <strong>ヒント</strong>: ${q.hint}`;
  hintBox.style.display = 'block';
}

function triggerScreenShake() {
  document.body.classList.add('shake-effect');
  setTimeout(() => document.body.classList.remove('shake-effect'), 400);
}

function triggerFlash(color) {
  const overlay = document.getElementById('flash-overlay');
  overlay.className = color;
  setTimeout(() => overlay.className = '', 300);
}

// === 4. リザルト画面 ===
function finishGame(isCleared) {
  clearInterval(timerInterval);
  stopAllBgm();

  showScreen('screen-result');

  const badge = document.getElementById('res-badge');
  const rankEl = document.getElementById('res-rank');
  const titleEl = document.getElementById('res-title');

  const totalQ = answeredLog.length;
  const accPct = totalQ > 0 ? Math.round((correctCount / totalQ) * 100) : 0;

  document.getElementById('res-score').innerText = currentScore.toLocaleString();
  document.getElementById('res-accuracy').innerText = `${accPct}% (${correctCount}/${totalQ})`;
  document.getElementById('res-combo').innerText = maxCombo;

  if (isCleared) {
    playFanfareSound();
    badge.className = 'result-badge clear';
    badge.innerText = 'DESK GAME SURVIVED!';

    let rank = 'B';
    if (accPct >= 90) rank = 'S';
    else if (accPct >= 75) rank = 'A';
    else if (accPct >= 50) rank = 'B';
    else rank = 'C';

    rankEl.className = `rank-display rank-${rank}`;
    rankEl.innerText = rank;

    const titles = TITLES_DATA[rank] || TITLES_DATA.B;
    const awarded = titles[Math.floor(Math.random() * titles.length)];
    titleEl.innerText = `称号：${awarded}`;
  } else {
    playSoundTone(100, 'sawtooth', 0.8, 0.3);
    badge.className = 'result-badge over';
    badge.innerText = 'ELSE ROUTE: GAME OVER';
    rankEl.className = 'rank-display rank-D';
    rankEl.innerText = 'D';
    titleEl.innerText = '称号：エルスに落ちた野菜';
  }

  buildReviewList();
}

// あいことばワンクリックコピー
function copyKeyword() {
  const text = "あまりはパーセント";
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.querySelector('.copy-btn');
    const originalText = btn.innerText;
    btn.innerText = '✅ コピー完了！';
    btn.style.background = 'var(--neon-green)';
    setTimeout(() => {
      btn.innerText = originalText;
      btn.style.background = 'var(--neon-cyan)';
    }, 2000);
  }).catch(() => {
    alert("コピーに失敗しました。手動で「あまりはパーセント」をコピーしてください。");
  });
}

// 復習リスト構築
function buildReviewList() {
  const container = document.getElementById('review-list');
  container.innerHTML = '';

  if (answeredLog.length === 0) {
    container.innerHTML = '<p style="color:#aaa;">出題データがありません。</p>';
    return;
  }

  answeredLog.forEach((item, i) => {
    const div = document.createElement('div');
    div.className = 'review-item';
    const statusIcon = item.isCorrect ? '⭕ 正解' : '❌ 不正解';
    const statusColor = item.isCorrect ? 'var(--neon-green)' : 'var(--neon-red)';
    const correctOpt = item.question.options[item.question.answer];

    div.innerHTML = `
      <div class="review-q">
        <span style="color:${statusColor}; margin-right:8px;">${statusIcon}</span>
        Q${i + 1}. ${escapeHtml(item.question.title)}
      </div>
      <div style="font-family:var(--font-code); font-size:0.85rem; color:#cbd5e1; margin-bottom:4px; white-space:pre-wrap;">${escapeHtml(item.question.code)}</div>
      <div class="review-ans">正解：${escapeHtml(correctOpt)}</div>
      <div class="review-exp">解説：${escapeHtml(item.question.explanation)}</div>
    `;
    container.appendChild(div);
  });
}

function openReview() {
  document.getElementById('review-modal').classList.add('active');
}

function closeReview() {
  document.getElementById('review-modal').classList.remove('active');
}

// ユーティリティ
function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>"']/g, m => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  })[m]);
}

// 起動時初期化
window.addEventListener('DOMContentLoaded', () => {
  initPhysics();
  goToTitle();
});
