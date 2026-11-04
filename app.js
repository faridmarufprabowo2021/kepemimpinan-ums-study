const practiceCases = [
  {
    prompt: 'Apa yang membuat contoh sikap disiplin terasa meyakinkan dalam jawaban?',
    options: [
      'Saya adalah orang yang disiplin dan selalu berusaha menjadi lebih baik.',
      'Saya menyusun jadwal belajar, menaatinya, dan mengevaluasi saat ada tugas yang terlewat.',
      'Disiplin penting untuk mahasiswa dan semua pemimpin.',
    ],
    correct: 1,
    feedback: 'Tepat. Contoh ini menyebut tindakan yang terlihat dan apa yang dilakukan ketika rencana tidak berjalan.',
  },
  {
    prompt: 'Dua kelompok berselisih tentang penggunaan ruang bersama. Langkah awal pemimpin yang paling membantu?',
    options: [
      'Langsung memilih kelompok yang paling dekat dengan pemimpin.',
      'Menyebarkan cerita yang beredar agar semua pihak tahu konfliknya.',
      'Mendengar keterangan kedua pihak, memeriksa fakta, lalu memfasilitasi musyawarah.',
    ],
    correct: 2,
    feedback: 'Benar. Mendengar dan memeriksa fakta membantu keputusan yang adil sebelum solusi dipilih.',
  },
  {
    prompt: 'Soal meminta pengalaman nyata dalam tim multidisiplin. Apa yang sebaiknya kamu lakukan?',
    options: [
      'Mengisi kerangka STAR dengan pengalaman sendiri dan menjelaskan tindakan serta hasil yang sungguh terjadi.',
      'Menyalin contoh hipotetis meski tidak pernah mengalaminya.',
      'Hanya menyebut bahwa komunikasi itu penting tanpa cerita pendukung.',
    ],
    correct: 0,
    feedback: 'Tepat. Kerangka STAR akan kuat jika detailnya berasal dari pengalaman yang benar-benar kamu alami.',
  },
];

let activeCase = 0;
let answered = false;

const promptEl = document.querySelector('#practicePrompt');
const optionsEl = document.querySelector('#practiceOptions');
const feedbackEl = document.querySelector('#practiceFeedback');
const nextButton = document.querySelector('#nextCase');
const indexEl = document.querySelector('#practiceIndex');

function renderCase() {
  const item = practiceCases[activeCase];
  answered = false;
  indexEl.textContent = String(activeCase + 1).padStart(2, '0');
  promptEl.textContent = item.prompt;
  feedbackEl.textContent = '';
  feedbackEl.className = 'practice-feedback';
  nextButton.hidden = true;
  nextButton.textContent = activeCase === practiceCases.length - 1 ? 'Ulangi latihan ↺' : 'Kasus berikutnya →';
  optionsEl.replaceChildren(...item.options.map((label, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'practice-option';
    button.innerHTML = `<span class="option-key">${String.fromCharCode(65 + index)}</span><span>${label}</span>`;
    button.addEventListener('click', () => answerCase(index));
    return button;
  }));
}

function answerCase(selected) {
  if (answered) return;
  answered = true;
  const item = practiceCases[activeCase];
  const buttons = [...optionsEl.querySelectorAll('button')];
  buttons.forEach((button, index) => {
    button.disabled = true;
    if (index === item.correct) button.classList.add('correct');
    else if (index === selected) button.classList.add('incorrect');
  });
  const correct = selected === item.correct;
  feedbackEl.textContent = correct ? item.feedback : `Belum tepat. ${item.feedback}`;
  feedbackEl.classList.add(correct ? 'good' : 'bad');
  nextButton.hidden = false;
}

nextButton.addEventListener('click', () => {
  activeCase = (activeCase + 1) % practiceCases.length;
  renderCase();
});
renderCase();

const progress = document.querySelector('#readProgress');
let scheduled = false;
function updateProgress() {
  const available = document.documentElement.scrollHeight - window.innerHeight;
  const amount = available > 0 ? Math.min(100, (window.scrollY / available) * 100) : 0;
  progress.style.width = `${amount}%`;
  scheduled = false;
}
window.addEventListener('scroll', () => {
  if (!scheduled) {
    window.requestAnimationFrame(updateProgress);
    scheduled = true;
  }
}, { passive: true });
window.addEventListener('resize', updateProgress);
updateProgress();

const sectionLinks = [...document.querySelectorAll('.rail-link')];
const questionSections = sectionLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    sectionLinks.forEach((link) => {
      const current = link.getAttribute('href') === `#${visible.target.id}`;
      link.classList.toggle('active', current);
      if (current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }, { rootMargin: '-18% 0px -60% 0px', threshold: [0, 0.1, 0.35] });
  questionSections.forEach((section) => observer.observe(section));
}
