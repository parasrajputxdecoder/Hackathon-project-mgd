/*
  script.js — Margdarshak Career Quiz
  Written by: Team Career Compass

  Logic is pretty simple:
  - User answers 3 questions
  - Each answer gives +1 to one of 4 career streams
  - At the end we pick the stream with most votes
  - Tie? First stream in iteration order wins (fine for a demo)
*/

// ── 1. Career stream results ─────────────────────────────

const streamData = {
  science: {
    emoji: "🔬",
    title: "Science & Technology",
    desc: "You think in systems and love figuring out how things work. Engineering, data science, research, and tech are all strong fits for you.",
    careers: ["Software Engineer", "Data Scientist", "Researcher", "Biotechnologist", "Aerospace Engineer", "Cybersecurity Analyst"]
  },
  art: {
    emoji: "🎨",
    title: "Arts, Design & Media",
    desc: "You're a natural creator. Whether it's visual, written, or digital — you express ideas in ways other people can't. That's rare and valuable.",
    careers: ["Graphic Designer", "UX/UI Designer", "Journalist", "Filmmaker", "Animator", "Architect", "Content Creator"]
  },
  social: {
    emoji: "🤝",
    title: "Humanities & Social Sciences",
    desc: "You care about people and how society works. Careers in psychology, healthcare, law, teaching, or social work are built for personalities like yours.",
    careers: ["Psychologist", "Doctor / Nurse", "Teacher", "Lawyer", "Social Worker", "HR Manager", "NGO Professional"]
  },
  business: {
    emoji: "📊",
    title: "Commerce & Business",
    desc: "You're strategic, goal-oriented, and good at seeing the big picture. Finance, entrepreneurship, and management are natural homes for you.",
    careers: ["Entrepreneur", "CA / CFA", "Marketing Manager", "Investment Analyst", "Business Analyst", "MBA Graduate"]
  }
};

// ── 2. State ─────────────────────────────────────────────

// votes object — we just increment the right key on each answer
let votes = { science: 0, art: 0, social: 0, business: 0 };

// ── 3. DOM refs ───────────────────────────────────────────

const allSteps  = document.querySelectorAll('.qstep');
const allDots   = document.querySelectorAll('.qdot');
const retakeBtn = document.getElementById('retakeBtn');

// ── 4. Handle answer clicks ───────────────────────────────

/*
  Using event delegation instead of attaching a listener to
  every single button — one listener on the document catches all.
*/
document.addEventListener('click', function (e) {
  if (!e.target.classList.contains('qbtn')) return;

  const btn  = e.target;
  const step = parseInt(btn.dataset.step);   // 1, 2, or 3
  const val  = btn.dataset.val;              // science / art / social / business

  // highlight selected button
  btn.closest('.qopts').querySelectorAll('.qbtn').forEach(b => b.classList.remove('picked'));
  btn.classList.add('picked');

  // add vote
  votes[val]++;

  // small delay so user sees the highlight before we move
  setTimeout(() => {
    if (step < 3) {
      goToStep(step + 1);
    } else {
      showResult();
    }
  }, 280);
});

// ── 5. goToStep ───────────────────────────────────────────

function goToStep(n) {
  // hide everything
  allSteps.forEach(s => s.classList.remove('active'));

  // show the one we want
  document.getElementById('step' + n).classList.add('active');

  // update dots: done = filled teal, active = filled navy, rest = grey
  allDots.forEach((dot, i) => {
    dot.classList.remove('active', 'done');
    if (i + 1 < n)  dot.classList.add('done');
    if (i + 1 === n) dot.classList.add('active');
  });
}

// ── 6. showResult ─────────────────────────────────────────

function showResult() {
  // find which stream got the most votes
  let winner = 'science';
  let best   = -1;

  for (const key in votes) {
    if (votes[key] > best) {
      best   = votes[key];
      winner = key;
    }
  }

  const data = streamData[winner];

  // fill in the result UI
  document.getElementById('resEmoji').textContent = data.emoji;
  document.getElementById('resTitle').textContent = data.title;
  document.getElementById('resDesc').textContent  = data.desc;

  // build career tags
  const tagsEl = document.getElementById('resCareers');
  tagsEl.innerHTML = '';
  data.careers.forEach(career => {
    const tag = document.createElement('span');
    tag.className   = 'res-tag';
    tag.textContent = career;
    tagsEl.appendChild(tag);
  });

  // mark all dots done, then show result step
  allDots.forEach(d => { d.classList.remove('active'); d.classList.add('done'); });
  allSteps.forEach(s => s.classList.remove('active'));
  document.getElementById('result').classList.add('active');
}

// ── 7. Retake button ──────────────────────────────────────

retakeBtn.addEventListener('click', function () {
  // reset votes
  votes = { science: 0, art: 0, social: 0, business: 0 };

  // clear any picked buttons
  document.querySelectorAll('.qbtn').forEach(b => b.classList.remove('picked'));

  // go back to question 1
  goToStep(1);
});

// ── 8. Smooth scroll (accounts for sticky nav height) ─────

document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navH = document.querySelector('.nav').offsetHeight;
    window.scrollTo({ top: target.offsetTop - navH - 8, behavior: 'smooth' });
  });
});

// ── 9. Init ───────────────────────────────────────────────

goToStep(1);
