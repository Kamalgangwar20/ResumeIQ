/* app.js — ResumeIQ Interactive Logic */

// ─── STATE ───────────────────────────────────────────────────────
let appState = 'landing'; // landing | uploading | analyzing | dashboard

// ─── MOCK DATA ────────────────────────────────────────────────────
const SCORE = 78;
const SECTIONS = [
  { name: 'Skills',      score: 85, status: 'Good' },
  { name: 'Experience',  score: 72, status: 'Needs Work' },
  { name: 'Projects',    score: 65, status: 'Needs Work' },
  { name: 'Education',   score: 90, status: 'Excellent' },
];
const SUGGESTIONS = [
  {
    icon: '🎯', iconClass: 'orange',
    title: 'Add Measurable Achievements',
    desc: 'Quantify your impact with numbers and metrics. Employers respond strongly to data-driven results.',
    example: '"Reduced load time by 40%" instead of "Improved application performance"',
  },
  {
    icon: '⚡', iconClass: 'blue',
    title: 'Improve Action Verbs',
    desc: 'Start every bullet point with a strong, active verb to make experiences sound more impactful.',
    example: '"Led", "Architected", "Delivered" instead of "Helped with", "Was involved in"',
  },
  {
    icon: '🛠', iconClass: 'purple',
    title: 'Include More Technical Skills',
    desc: 'Add industry-relevant tools and technologies to pass ATS systems and impress recruiters.',
    example: 'Add: TypeScript, Docker, Kubernetes, PostgreSQL, AWS, CI/CD',
  },
  {
    icon: '📌', iconClass: 'green',
    title: 'Strengthen Project Section',
    desc: 'Each project should include the tech stack used, your role, and the outcome or impact.',
    example: '"Built a payment gateway using Stripe API + Node.js, processing $50K MRR"',
  },
  {
    icon: '📝', iconClass: 'orange',
    title: 'Add a Professional Summary',
    desc: 'A concise 3–4 line summary at the top dramatically increases recruiter engagement.',
    example: '"Full-stack developer with 3+ years building scalable React/Node.js apps for fintech."',
  },
  {
    icon: '🔗', iconClass: 'blue',
    title: 'Include Portfolio & GitHub Links',
    desc: 'Direct links to your work let recruiters verify your skills and stand out from other candidates.',
    example: 'Add LinkedIn, GitHub, and personal portfolio URL in the contact section.',
  },
];
const MISSING_KWS = ['TypeScript','Kubernetes','CI/CD','Agile','REST APIs','PostgreSQL','System Design','Microservices'];
const SUGGESTED_KWS = ['React.js','Node.js','Docker','AWS','Git','JavaScript (ES6+)','Problem Solving','Collaboration'];

// ─── DOM REFS ─────────────────────────────────────────────────────
const sections = {
  hero:       document.getElementById('hero'),
  upload:     document.getElementById('upload-section'),
  uploading:  document.getElementById('uploading-section'),
  analyzing:  document.getElementById('analyzing-section'),
  dashboard:  document.getElementById('dashboard'),
};

// ─── THEME ────────────────────────────────────────────────────────
const html = document.documentElement;
const themeBtn = document.getElementById('theme-toggle');
const themeLabel = themeBtn.querySelector('.theme-label');
const savedTheme = localStorage.getItem('riq-theme') || 'light';
html.setAttribute('data-theme', savedTheme);
themeLabel.textContent = savedTheme === 'dark' ? 'Dark' : 'Light';

themeBtn.addEventListener('click', () => {
  const next = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  html.setAttribute('data-theme', next);
  localStorage.setItem('riq-theme', next);
  themeLabel.textContent = next === 'dark' ? 'Dark' : 'Light';
});

// ─── SHOW/HIDE SECTIONS ─────────────────────────────────────────────
function goTo(state) {
  appState = state;
  // Hide all
  Object.values(sections).forEach(el => el && el.classList.add('hidden'));
  if (state === 'landing') {
    sections.hero.classList.remove('hidden');
    sections.upload.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else if (state === 'uploading') {
    sections.uploading.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else if (state === 'analyzing') {
    sections.analyzing.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    runAnalyzingAnimation();
  } else if (state === 'dashboard') {
    sections.dashboard.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    animateDashboard();
  }
}

// ─── FILE UPLOAD FLOW ─────────────────────────────────────────────
function startUpload(file) {
  const name = file ? file.name : 'resume.pdf';
  const size = file ? formatBytes(file.size) : '245 KB';
  document.getElementById('file-name-disp').textContent = name;
  document.getElementById('file-size-disp').textContent = size;
  goTo('uploading');
  simulateUpload();
}

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1048576).toFixed(1) + ' MB';
}

function simulateUpload() {
  const fill = document.getElementById('prog-fill');
  const pct  = document.getElementById('prog-pct');
  const lbl  = document.getElementById('prog-label');
  let progress = 0;
  const iv = setInterval(() => {
    progress += Math.random() * 18 + 6;
    if (progress >= 100) {
      progress = 100;
      clearInterval(iv);
      fill.style.width = '100%';
      pct.textContent = '100%';
      lbl.textContent = 'Upload complete!';
      setTimeout(() => goTo('analyzing'), 700);
    } else {
      fill.style.width = progress + '%';
      pct.textContent = Math.round(progress) + '%';
    }
  }, 180);
}

// ─── ANALYZING ANIMATION ─────────────────────────────────────────
function runAnalyzingAnimation() {
  const steps = [
    document.getElementById('step-1'),
    document.getElementById('step-2'),
    document.getElementById('step-3'),
    document.getElementById('step-4'),
  ];
  steps.forEach(s => { s.classList.remove('active','done'); });
  let i = 0;
  const next = () => {
    if (i > 0) { steps[i-1].classList.remove('active'); steps[i-1].classList.add('done'); }
    if (i < steps.length) {
      steps[i].classList.add('active');
      i++;
      setTimeout(next, 900);
    } else {
      setTimeout(() => { buildDashboard(); goTo('dashboard'); }, 600);
    }
  };
  setTimeout(next, 400);
}

// ─── BUILD DASHBOARD ─────────────────────────────────────────────
function buildDashboard() {
  buildSections();
  buildSuggestions();
  buildKeywords();
}

function buildSections() {
  const list = document.getElementById('sections-list');
  list.innerHTML = '';
  SECTIONS.forEach(sec => {
    const statusClass = sec.status === 'Excellent' ? 's-good' : sec.status === 'Good' ? 's-good' : 's-warn';
    list.innerHTML += `
      <div class="section-row">
        <div class="section-row-top">
          <span class="section-name">${sec.name}</span>
          <div style="display:flex;align-items:center;gap:8px">
            <span class="section-score">${sec.score}</span>
            <span class="section-status ${statusClass}">${sec.status}</span>
          </div>
        </div>
        <div class="section-bar-track">
          <div class="section-bar-fill" style="width:${sec.score}%;animation-delay:${SECTIONS.indexOf(sec)*0.1}s"></div>
        </div>
      </div>`;
  });
}

function buildSuggestions() {
  const grid = document.getElementById('suggestions-grid');
  grid.innerHTML = SUGGESTIONS.map(s => `
    <div class="sug-card">
      <div class="sug-icon ${s.iconClass}">${s.icon}</div>
      <div class="sug-title">${s.title}</div>
      <div class="sug-desc">${s.desc}</div>
      <div class="sug-example">
        <div class="sug-example-lbl">✏ Example Fix</div>
        ${s.example}
      </div>
    </div>`).join('');
}

function buildKeywords() {
  document.getElementById('missing-kws').innerHTML =
    MISSING_KWS.map(k => `<span class="kw-tag missing">${k}</span>`).join('');
  document.getElementById('suggested-kws').innerHTML =
    SUGGESTED_KWS.map(k => `<span class="kw-tag suggested">${k}</span>`).join('');
}

// ─── ANIMATE DASHBOARD SCORE ────────────────────────────────────
function animateDashboard() {
  const arc   = document.getElementById('dash-arc');
  const num   = document.getElementById('score-num');
  const grade = document.getElementById('score-grade');
  const circumference = 414.7;
  const offset = circumference - (SCORE / 100) * circumference;

  // Animate arc
  requestAnimationFrame(() => {
    arc.style.transition = 'stroke-dashoffset 1.4s cubic-bezier(.4,0,.2,1)';
    arc.style.strokeDashoffset = offset;
  });

  // Animate number
  let current = 0;
  const iv = setInterval(() => {
    current += 2;
    if (current >= SCORE) { current = SCORE; clearInterval(iv); }
    num.textContent = current;
  }, 28);

  // Grade
  if (SCORE >= 85) grade.textContent = 'Excellent';
  else if (SCORE >= 70) grade.textContent = 'Good';
  else if (SCORE >= 50) grade.textContent = 'Fair';
  else grade.textContent = 'Needs Work';

  if (SCORE < 60) { grade.className = 'score-grade'; grade.style.cssText='background:var(--err-bg);color:var(--err)'; }
  else if (SCORE < 75) { grade.style.cssText='background:var(--warn-bg);color:var(--warn)'; }
  else { grade.style.cssText='background:var(--ok-bg);color:var(--ok)'; }
}

// ─── TAB SWITCHING ─────────────────────────────────────────────────
document.getElementById('tab-bar') || 0; // safety
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-pane').forEach(p => p.classList.add('hidden'));
    tab.classList.add('active');
    const pane = document.getElementById('pane-' + tab.dataset.tab);
    if (pane) pane.classList.remove('hidden');
  });
});

// ─── DROP ZONE ─────────────────────────────────────────────────────
const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const browseLink = document.getElementById('browse-link');

dropZone.addEventListener('click', () => fileInput.click());
browseLink.addEventListener('click', (e) => { e.stopPropagation(); fileInput.click(); });

dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('over'); });
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('over'));
dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.classList.remove('over');
  const file = e.dataTransfer.files[0];
  if (file) handleFile(file);
});

fileInput.addEventListener('change', () => {
  if (fileInput.files[0]) handleFile(fileInput.files[0]);
});

dropZone.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') fileInput.click();
});

function handleFile(file) {
  const allowed = ['.pdf','.docx','.doc'];
  const ext = '.' + file.name.split('.').pop().toLowerCase();
  if (!allowed.includes(ext)) { showToast('⚠ Please upload a PDF or DOCX file.'); return; }
  startUpload(file);
}

// ─── CTA BUTTONS ─────────────────────────────────────────────────
document.getElementById('hero-cta').addEventListener('click', () => {
  document.getElementById('upload-section').scrollIntoView({ behavior: 'smooth', block: 'center' });
});
document.getElementById('nav-cta').addEventListener('click', () => {
  if (appState === 'landing') {
    document.getElementById('upload-section').scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
});
document.getElementById('logo-link').addEventListener('click', (e) => {
  e.preventDefault(); goTo('landing');
});

// Re-analyze
document.getElementById('re-analyze-btn').addEventListener('click', () => {
  goTo('landing');
  showToast('🔄 Ready for a new resume upload!');
});
document.getElementById('download-btn').addEventListener('click', () => {
  showToast('✅ Improved resume downloaded successfully!');
});
document.getElementById('dl-preview-btn').addEventListener('click', () => {
  showToast('✅ Improved resume downloaded successfully!');
});
// ─── EDIT MODE ───────────────────────────────────────────────────
let editMode = false;

function toggleEditMode() {
  const editBtn    = document.getElementById('edit-btn');
  const resumeMock = document.querySelector('.resume-mock.improved');
  editMode = !editMode;

  if (editMode) {
    // Enter edit mode
    resumeMock.setAttribute('contenteditable', 'true');
    resumeMock.classList.add('editing');
    resumeMock.focus();
    editBtn.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v14a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg> Save Changes`;
    editBtn.classList.remove('btn-outline');
    editBtn.classList.add('btn-primary');
    showToast('✏️ Edit mode active — click any text to edit it!');
  } else {
    // Exit edit mode
    resumeMock.removeAttribute('contenteditable');
    resumeMock.classList.remove('editing');
    editBtn.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> Edit Resume`;
    editBtn.classList.remove('btn-primary');
    editBtn.classList.add('btn-outline');
    showToast('✅ Changes saved successfully!');
  }
}

document.getElementById('edit-btn').addEventListener('click', toggleEditMode);

// ─── DEMO mode: click drop zone without file to demo ──────────────
// If user just clicks quickly without a real file, kick off demo
let demoClickCount = 0;
dropZone.addEventListener('click', () => {
  demoClickCount++;
  if (demoClickCount === 1) {
    setTimeout(() => { demoClickCount = 0; }, 400);
  }
});

// ─── KEYWORD TAG interaction ─────────────────────────────────────
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('kw-tag')) {
    const kw = e.target.textContent;
    e.target.style.transform = 'scale(0.95)';
    setTimeout(() => e.target.style.transform = '', 150);
    showToast(`💡 Add "${kw}" to your Skills or Experience section.`);
  }
});

// ─── NAVBAR scroll shadow ────────────────────────────────────────
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  nav.style.boxShadow = window.scrollY > 10 ? '0 2px 20px rgba(0,0,0,.08)' : 'none';
});

// ─── TOAST ───────────────────────────────────────────────────────
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 3200);
}

// ─── INIT ─────────────────────────────────────────────────────────
goTo('landing');

// Quick demo: if someone presses 'D' on keyboard, go straight to dashboard
document.addEventListener('keydown', (e) => {
  if (e.key === 'd' && e.ctrlKey) {
    e.preventDefault();
    buildDashboard();
    goTo('dashboard');
    showToast('🎉 Demo dashboard loaded!');
  }
});
