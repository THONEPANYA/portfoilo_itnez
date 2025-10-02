'use strict';

/* ==========================
   Typing animation
========================== */
const texts = ['Developer', 'Problem Solver', 'Coding'];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeText() {
  const typingElement = document.getElementById('typingText');
  if (!typingElement) return;

  const currentText = texts[textIndex];

  if (isDeleting) {
    typingElement.textContent = currentText.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typingElement.textContent = currentText.substring(0, charIndex + 1);
    charIndex++;
  }

  if (!isDeleting && charIndex === currentText.length) {
    setTimeout(() => (isDeleting = true), 2000);
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false; // แก้จาก faalse ➜ false
    textIndex = (textIndex + 1) % texts.length;
  }

  const speed = isDeleting ? 50 : 100;
  setTimeout(typeText, speed);
}

/* ==========================
   Scroll animations
========================== */
function animateOnScroll() {
  const elements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
  elements.forEach((el) => {
    const top = el.getBoundingClientRect().top;
    if (top < window.innerHeight - 150) el.classList.add('visible');
  });

  // Animate skill bars
  const skillBars = document.querySelectorAll('.skill-bar');
  skillBars.forEach((bar) => {
    const top = bar.getBoundingClientRect().top;
    if (top < window.innerHeight - 150) bar.classList.add('animate');
  });
}

/* ==========================
   Scroll progress indicator
========================== */
function updateScrollIndicator() {
  const bar = document.getElementById('scrollIndicator');
  if (!bar) return;
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const docHeight = document.body.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  bar.style.width = pct + '%';
}

/* ==========================
   Smooth scroll to section
========================== */
function scrollToSection(sectionId) {
  const target = document.getElementById(sectionId);
  if (!target) return;
  target.scrollIntoView({ behavior: 'smooth' });
}
window.scrollToSection = scrollToSection; // ให้ปุ่มใน HTML เรียกใช้ได้

/* ==========================
   Contact form validation
========================== */
function setupContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const inputs = form.querySelectorAll('input, textarea');
    let isValid = true;

    inputs.forEach((input) => {
      if (!input.value.trim()) {
        isValid = false;
        input.style.borderColor = '#ef4444';
      } else {
        input.style.borderColor = '#d1d5db';
      }
    });

    if (isValid) {
      alert("Thank you for your message! I'll get back to you soon.");
      form.reset();
    } else {
      alert('Please fill in all fields.');
    }
  });
}

/* ==========================
   Nav links smooth scroll
========================== */
function setupNavLinks() {
  document.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      scrollToSection(targetId);
    });
  });
}

/* ==========================
   Mobile menu toggle (basic)
========================== */
function setupMobileMenu() {
  const toggle = document.getElementById('menuToggle');
  const menu = document.querySelector('nav .md\\:flex'); // ตัวเมนูหลักที่ซ่อนบน mobile
  if (!toggle || !menu) return;

  // สร้างสำเนาเมนูสำหรับ mobile ถ้าอยากให้แยกชัดเจน สามารถเพิ่ม container ใหม่ใน HTML ได้
  toggle.addEventListener('click', () => {
    // สลับ hidden บนจอเล็ก
    menu.classList.toggle('hidden');
  });
}

/* ==========================
   Init
========================== */
function onScroll() {
  animateOnScroll();
  updateScrollIndicator();
}

// ใช้ defer ใน HTML แล้วจึงสามารถเรียก init ได้ทันที
(function init() {
  typeText();
  animateOnScroll();
  updateScrollIndicator();
  setupContactForm();
  setupNavLinks();
  setupMobileMenu();

  window.addEventListener('scroll', onScroll, { passive: true });
})();