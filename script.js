/* ============================================================
   NEET Special Candidate Portal — script.js
   ============================================================ */

// ─── Page Navigation ───────────────────────────────────────
function goTo(pageNum) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById('page-' + pageNum);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  if (pageNum === 4) startProgressAnimation();
  if (pageNum === 5) startExamTimer();
}

// ─── PAGE 2: Category Selection ─────────────────────────────
const ROASTS = {
  ammer:   "then why are you even giving the damn paper SHERLOCK ? 🔍",
  cutie:   "Okay whatever i can't argue 😳",
  student: "no surprise you pick the most boring one 🫥",
  lost:    "MA'AM you need THERAPY yourself before becoming a doctor 🧑‍⚕️"
};

function selectCategory(el, val) {
  document.querySelectorAll('.radio-option').forEach(r => r.classList.remove('selected'));
  el.classList.add('selected');

  // Show roast message inline below the options
  const inlineRoast = document.getElementById('inline-roast');
  const inlineText  = document.getElementById('inline-roast-text');
  inlineText.textContent = ROASTS[val] || '';

  // Re-trigger animation each time
  inlineRoast.classList.add('hidden');
  inlineRoast.offsetHeight; // reflow
  inlineRoast.classList.remove('hidden');

  // Hide Continue button until roast is shown
  const continueBtn = document.getElementById('continue-btn');
  continueBtn.classList.add('hidden');

  // Show Continue button after roast settles
  setTimeout(() => {
    continueBtn.classList.remove('hidden');
  }, 900);
}

function triggerVerify() {
  // legacy — no-op now
}


// ─── PAGE 3: Photo Upload ────────────────────────────────────
function handlePhotoUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const preview = document.getElementById('uploaded-preview');
    const img = document.getElementById('preview-img');
    const uploadZone = document.getElementById('upload-zone');
    const btn = document.getElementById('analysis-btn');

    img.src = e.target.result;
    preview.classList.remove('hidden');
    uploadZone.style.display = 'none';
    btn.style.display = 'flex';
  };
  reader.readAsDataURL(file);
}

function startAnalysis() {
  const overlay = document.getElementById('analysis-overlay');
  overlay.classList.remove('hidden');
  document.getElementById('analysis-btn').style.display = 'none';

  // After 3.5 seconds of FBI GIF, go to page 4
  setTimeout(() => goTo(4), 3500);
}

// ─── PAGE 4: Progress Animation ──────────────────────────────
const PROGRESS_STEPS = [
  { pct: 0,   logIdx: 0, text: '✅ Initializing Candidate Database...',    warn: false },
  { pct: 15,  logIdx: 1, text: '✅ Checking Academic Records...',           warn: false },
  { pct: 30,  logIdx: 2, text: '✅ Checking MBBS Credentials...',           warn: false },
  { pct: 45,  logIdx: 3, text: '✅ Checking Previous NEET Attempts...',     warn: false },
  { pct: 60,  logIdx: 4, text: '✅ Analyzing Candidate Photo...',           warn: false },
  { pct: 75,  logIdx: 5, text: '✅ Analyzing Smile Pattern...',             warn: false },
  { pct: 85,  logIdx: 6, text: '⚠️ Unexpected Results Detected...',         warn: true  },
  { pct: 95,  logIdx: 7, text: '⚠️ Review Committee Notified...',           warn: true  },
  { pct: 100, logIdx: 8, text: '✅ Final Approval Processing...',           warn: false },
];

function startProgressAnimation() {
  const bar  = document.getElementById('prog-bar');
  const pct  = document.getElementById('prog-pct');
  const logs = document.querySelectorAll('.log-entry');
  const done = document.getElementById('analysis-complete');

  // Reset
  bar.style.width = '0%';
  pct.textContent = '0%';
  logs.forEach(l => {
    l.classList.remove('log-active', 'log-done', 'log-warning');
    l.classList.add('log-pending');
  });
  done.classList.add('hidden');

  let step = 0;
  const delays = [600, 1200, 1000, 1000, 1200, 1200, 900, 900, 800];

  function runStep() {
    if (step >= PROGRESS_STEPS.length) {
      // Finished
      setTimeout(() => done.classList.remove('hidden'), 600);
      return;
    }
    const s = PROGRESS_STEPS[step];
    const log = document.getElementById('log-' + s.logIdx);

    // Mark previous as done
    if (step > 0) {
      const prev = document.getElementById('log-' + PROGRESS_STEPS[step - 1].logIdx);
      prev.classList.remove('log-active');
      prev.classList.add(PROGRESS_STEPS[step - 1].warn ? 'log-warning' : 'log-done');
      prev.textContent = PROGRESS_STEPS[step - 1].text;
    }

    // Mark current as active
    log.classList.remove('log-pending');
    log.classList.add('log-active');

    bar.style.width = s.pct + '%';
    pct.textContent = s.pct + '%';

    step++;
    setTimeout(runStep, delays[step - 1] || 800);
  }

  // Last step finalize
  const origRunStep = runStep;
  setTimeout(() => {
    runStep();
    // After all steps, finalize last log
    const totalTime = delays.reduce((a, b) => a + b, 0);
    setTimeout(() => {
      const last = PROGRESS_STEPS[PROGRESS_STEPS.length - 1];
      const lastLog = document.getElementById('log-' + last.logIdx);
      lastLog.classList.remove('log-active');
      lastLog.classList.add('log-done');
      lastLog.textContent = last.text;
    }, totalTime + 200);
  }, 300);
}

// ─── PAGE 5: Exam Answer ──────────────────────────────────────
let answerSelected = false;

function selectAnswer(letter) {
  if (answerSelected) return;
  answerSelected = true;

  const opts = { A: 'opt-a', B: 'opt-b', C: 'opt-c', D: 'opt-d' };

  // Mark selected as wrong (brief moment), then reveal correct
  const selectedEl = document.getElementById(opts[letter]);
  selectedEl.classList.add('selected');

  setTimeout(() => {
    // All options: wrong except D
    Object.keys(opts).forEach(k => {
      const el = document.getElementById(opts[k]);
      if (k === 'D') {
        el.classList.add('correct');
        el.querySelector('.opt-label').textContent = '✓';
      } else if (k === letter && letter !== 'D') {
        el.classList.add('wrong');
      }
    });

    // Show reveal
    document.getElementById('answer-reveal').classList.remove('hidden');
  }, 600);
}

// ─── PAGE 5: Exam Timer ───────────────────────────────────────
let timerInterval = null;
let timerSeconds = 10785; // 2:59:45

function startExamTimer() {
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timerSeconds = Math.max(0, timerSeconds - 1);
    const h = Math.floor(timerSeconds / 3600);
    const m = Math.floor((timerSeconds % 3600) / 60);
    const s = timerSeconds % 60;
    document.getElementById('exam-timer').textContent =
      `⏱ ${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    if (timerSeconds === 0) clearInterval(timerInterval);
  }, 1000);
}

// ─── PAGE 9: Appeal ───────────────────────────────────────────
function triggerAppeal() {
  document.getElementById('appeal-modal').classList.remove('hidden');
}

function closeAppeal() {
  document.getElementById('appeal-modal').classList.add('hidden');
}

// ─── Close modal on backdrop click ───────────────────────────
document.addEventListener('click', function(e) {
  const modal = document.getElementById('appeal-modal');
  if (e.target === modal) closeAppeal();
});

// ─── Easter Egg: Konami Code → Certificate ────────────────────
let konamiSeq = [];
const KONAMI = [38,38,40,40,37,39,37,39,66,65];
document.addEventListener('keydown', (e) => {
  konamiSeq.push(e.keyCode);
  konamiSeq = konamiSeq.slice(-10);
  if (konamiSeq.toString() === KONAMI.toString()) {
    goTo(10);
  }
});
