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
  if (pageNum === 5) { currentQ = 0; startExamTimer(); renderQuestion(); }
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

// ─── PAGE 5: Exam Questions ───────────────────────────────────
const EXAM_QUESTIONS = [
  {
    num: 1,
    subject: '📗 Biology',
    text: 'The oxygen dissociation curve of haemoglobin shifts to the right under all of the following conditions EXCEPT:',
    options: [
      'Increased pCO₂',
      'Increased H⁺ concentration',
      'Increased temperature',
      'Decreased 2,3-BPG concentration'
    ]
  },
  {
    num: 2,
    subject: '⚗️ Chemistry',
    text: 'The major product formed when propene reacts with HBr in the absence of peroxide is:',
    options: [
      '1-Bromopropane',
      '2-Bromopropane',
      'Propanol',
      'Bromoethane'
    ]
  },
  {
    num: 3,
    subject: '⚛️ Physics',
    text: 'A particle moves in a circle of radius 2 m with constant speed 4 m/s. The magnitude of its centripetal acceleration is:',
    options: [
      '2 m/s²',
      '4 m/s²',
      '8 m/s²',
      '16 m/s²'
    ]
  },
  {
    num: 4,
    subject: '📗 Biology',
    text: 'Which of the following hormones is secreted by the juxtaglomerular cells of the kidney?',
    options: [
      'Aldosterone',
      'Renin',
      'Erythropoietin',
      'Vasopressin'
    ]
  },
  {
    num: 5,
    subject: '⚗️ Chemistry',
    text: 'For a first-order reaction, the half-life is:',
    options: [
      'Directly proportional to concentration',
      'Inversely proportional to concentration',
      'Independent of concentration',
      'Equal to the rate constant'
    ]
  },
  {
    num: 6,
    subject: '📘 General Knowledge (Special Section)',
    text: 'What is the primary reason this candidate has received special examination access from the National Testing Agency?',
    options: [
      'Academic Excellence',
      'Medical Qualification',
      'Government Recommendation',
      'Being Suspiciously Adorable'
    ]
  }
];

let currentQ = 0;
let qAnswered = false;

function renderQuestion() {
  const q = EXAM_QUESTIONS[currentQ];
  const labels = ['A', 'B', 'C', 'D'];

  document.getElementById('q-number').textContent = `Question ${q.num} of 180`;
  document.getElementById('q-subject').textContent = q.subject;
  document.getElementById('q-text').textContent    = q.text;

  const grid = document.getElementById('options-grid');
  grid.innerHTML = '';
  q.options.forEach((opt, i) => {
    const d = document.createElement('div');
    d.className = 'option-item';
    d.id = 'exam-opt-' + i;
    d.innerHTML = `<span class="opt-label">${labels[i]}</span><span>${opt}</span>`;
    d.onclick = () => selectExamAnswer(i);
    grid.appendChild(d);
  });

  // Reset UI
  qAnswered = false;
  document.getElementById('response-recorded').classList.add('hidden');
  document.getElementById('next-q-btn').classList.add('hidden');
}

function selectExamAnswer(idx) {
  // Clear previous selection, move highlight to new pick — always re-selectable
  document.querySelectorAll('.option-item').forEach(o => o.classList.remove('selected'));
  document.getElementById('exam-opt-' + idx).classList.add('selected');

  // Show "Response Recorded" + Next button only on the FIRST pick
  if (!qAnswered) {
    qAnswered = true;
    setTimeout(() => {
      document.getElementById('response-recorded').classList.remove('hidden');
      document.getElementById('next-q-btn').classList.remove('hidden');
    }, 350);
  }
}

function nextQuestion() {
  currentQ++;
  if (currentQ >= EXAM_QUESTIONS.length) {
    goTo(7); // after Q6 → Incident Report
    return;
  }
  renderQuestion();
}

// ─── PAGE 5: Exam Timer ───────────────────────────────────────
let timerInterval = null;
let timerSeconds  = 10785; // 2:59:45

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
