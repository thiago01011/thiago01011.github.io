'use strict';



// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });



// testimonials variables (optional)
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
}

// add click event to all modal items (guarded if elements exist)
if (testimonialsItem && testimonialsItem.length && modalContainer && modalCloseBtn && overlay) {
  for (let i = 0; i < testimonialsItem.length; i++) {
    testimonialsItem[i].addEventListener("click", function () {
      modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
      modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
      modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
      modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;
      testimonialsModalFunc();
    });
  }
  modalCloseBtn.addEventListener("click", testimonialsModalFunc);
  overlay.addEventListener("click", testimonialsModalFunc);
}



// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

select.addEventListener("click", function () { elementToggleFunc(this); });

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);

  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {

  for (let i = 0; i < filterItems.length; i++) {

    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }

  }

}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {

  filterBtn[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;

  });

}



// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {

    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }

  });
}



// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {
    const clickedText = this.textContent.trim().toLowerCase();

    // toggle pages and set active link to the clicked one
    for (let j = 0; j < pages.length; j++) {
      const isTarget = clickedText === pages[j].dataset.page;
      pages[j].classList.toggle("active", isTarget);
    }

    // ensure only the clicked nav link is active
    for (let j = 0; j < navigationLinks.length; j++) {
      navigationLinks[j].classList.toggle("active", navigationLinks[j] === this);
    }

    window.scrollTo(0, 0);

    // set current page on body
    const current = clickedText;
    document.body.setAttribute('data-page', current);

    // toggle sidebar game visibility explicitly
    const sidebarGame = document.querySelector('.sidebar-game');
    if (sidebarGame) {
      sidebarGame.style.display = (current === 'about') ? 'block' : 'none';
    }

    // toggle blog sidebar mode on body
    if (current === 'blog') {
      document.body.setAttribute('data-page-blog', 'true');
    } else {
      document.body.removeAttribute('data-page-blog');
    }
  });
}

// Scroll-reveal using IntersectionObserver (respects reduced motion)
(function () {
  const initial = document.querySelector('article.active');
  if (initial) {
    document.body.setAttribute('data-page', initial.dataset.page);
    const sidebarGame = document.querySelector('.sidebar-game');
    if (sidebarGame) sidebarGame.style.display = (initial.dataset.page === 'about') ? 'block' : 'none';
  }
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  const revealEls = document.querySelectorAll(
    '.service-item, .content-card, .clients-item, .timeline-item, .project-item, .blog-post-item'
  );
  if (!revealEls.length) return;

  revealEls.forEach(el => el.classList.add('reveal'));

  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('revealed');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(el => io.observe(el));
})();

// Animate skill bars when Resume is shown (respects reduced motion)
(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const skillFills = document.querySelectorAll('.skill-progress-fill');
  if (!skillFills.length) return;

  skillFills.forEach(el => {
    el.dataset.targetWidth = el.style.width || '0%';
    if (!reduceMotion) el.style.width = '0%';
  });

  function animateSkills() {
    if (reduceMotion) return;
    skillFills.forEach(el => { el.style.transition = 'width 900ms ease'; el.style.width = el.dataset.targetWidth; });
  }

  const navLinks = document.querySelectorAll('[data-nav-link]');
  const pages = document.querySelectorAll('[data-page]');

  function isResumeActive() {
    return Array.from(pages).some(p => p.dataset.page === 'resume' && p.classList.contains('active'));
  }

  navLinks.forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.textContent.trim().toLowerCase() === 'resume') {
        setTimeout(animateSkills, 50);
      }
    });
  });

  if (isResumeActive()) setTimeout(animateSkills, 50);
})();

// Blog topic switcher
(function () {
  const topicButtons = document.querySelectorAll('.blog-topic-btn');
  const panels = document.querySelectorAll('.blog-topic-panel');
  const blogTitle = document.getElementById('blogTitle');
  if (!topicButtons.length || !panels.length) return;

  let activeBtn = document.querySelector('.blog-topic-btn.active') || topicButtons[0];
  let activePanel = document.querySelector('.blog-topic-panel.active') || panels[0];

  topicButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-blog-topic');
      const nextPanel = document.querySelector(`[data-blog-panel="${key}"]`);
      if (!nextPanel) return;

      if (activeBtn) activeBtn.classList.remove('active');
      if (activePanel) activePanel.classList.remove('active');

      btn.classList.add('active');
      nextPanel.classList.add('active');

      if (blogTitle) {
        blogTitle.textContent = btn.textContent.trim();
      }

      activeBtn = btn;
      activePanel = nextPanel;
    });
  });
})();

// Simple Breakout (Arkanoid) for About sidebar
(function () {
  const CANVAS_ID = 'arkanoid';
  let canvas, ctx, rafId = null;

  const state = {
    w: 240,
    h: 360,
    ball: { x: 120, y: 200, r: 6, dx: 2, dy: -2 },
    paddle: { w: 60, h: 10, x: 90, y: 340, speed: 5, vx: 0 },
    keys: { left: false, right: false },
    rows: 5, cols: 8, brickW: 26, brickH: 10, brickPad: 4, brickTop: 40, brickLeft: 10,
    bricks: []
  };

  function buildBricks() {
    state.bricks = [];
    for (let r = 0; r < state.rows; r++) {
      const row = [];
      for (let c = 0; c < state.cols; c++) row.push({ alive: true });
      state.bricks.push(row);
    }
  }

  function drawBricks() {
    for (let r = 0; r < state.rows; r++) {
      for (let c = 0; c < state.cols; c++) {
        const b = state.bricks[r][c];
        if (!b.alive) continue;
        const x = state.brickLeft + c * (state.brickW + state.brickPad);
        const y = state.brickTop + r * (state.brickH + state.brickPad);
        ctx.fillStyle = 'hsl(' + (35 + r * 8) + ', 80%, 55%)';
        ctx.fillRect(x, y, state.brickW, state.brickH);
      }
    }
  }

  function collideBricks() {
    for (let r = 0; r < state.rows; r++) {
      for (let c = 0; c < state.cols; c++) {
        const b = state.bricks[r][c];
        if (!b.alive) continue;
        const bx = state.brickLeft + c * (state.brickW + state.brickPad);
        const by = state.brickTop + r * (state.brickH + state.brickPad);
        if (state.ball.x > bx && state.ball.x < bx + state.brickW &&
            state.ball.y - state.ball.r < by + state.brickH &&
            state.ball.y + state.ball.r > by) {
          b.alive = false;
          state.ball.dy = -state.ball.dy;
          return;
        }
      }
    }
  }

  function step() {
    ctx.clearRect(0, 0, state.w, state.h);

    const b = state.ball;
    b.x += b.dx;
    b.y += b.dy;

    if (b.x < b.r || b.x > state.w - b.r) b.dx = -b.dx;
    if (b.y < b.r) b.dy = -b.dy;

    const p = state.paddle;
    if (state.keys.left) p.vx = -p.speed; else if (state.keys.right) p.vx = p.speed; else p.vx = 0;
    p.x += p.vx;
    p.x = Math.max(0, Math.min(state.w - p.w, p.x));

    if (b.y + b.r >= p.y && b.x > p.x && b.x < p.x + p.w && b.dy > 0) {
      b.dy = -b.dy;
      const hit = (b.x - (p.x + p.w / 2)) / (p.w / 2);
      b.dx = hit * 3;
    }

    if (b.y > state.h + 20) {
      b.x = state.w / 2; b.y = state.h / 2; b.dx = 2; b.dy = -2;
      buildBricks();
    }

    ctx.fillStyle = '#ffc857';
    ctx.fillRect(p.x, p.y, p.w, p.h);

    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.fill();

    collideBricks();
    drawBricks();

    rafId = requestAnimationFrame(step);
  }

  function keydown(e) {
    if (e.key === 'ArrowLeft' || e.key === 'a') state.keys.left = true;
    if (e.key === 'ArrowRight' || e.key === 'd') state.keys.right = true;
  }
  function keyup(e) {
    if (e.key === 'ArrowLeft' || e.key === 'a') state.keys.left = false;
    if (e.key === 'ArrowRight' || e.key === 'd') state.keys.right = false;
  }
  function mousemove(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    state.paddle.x = Math.max(0, Math.min(state.w - state.paddle.w, x - state.paddle.w / 2));
  }

  function startIfAbout() {
    if (document.body.getAttribute('data-page') !== 'about') return;
    canvas = document.getElementById(CANVAS_ID);
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    state.w = canvas.width;
    state.h = canvas.height;
    buildBricks();

    window.addEventListener('keydown', keydown);
    window.addEventListener('keyup', keyup);
    canvas.addEventListener('mousemove', mousemove);

    if (!rafId) rafId = requestAnimationFrame(step);
  }

  function stop() {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
    window.removeEventListener('keydown', keydown);
    window.removeEventListener('keyup', keyup);
    if (canvas) canvas.removeEventListener('mousemove', mousemove);
  }

  const navLinks = document.querySelectorAll('[data-nav-link]');
  navLinks.forEach(btn => {
    btn.addEventListener('click', () => {
      setTimeout(() => {
        if (document.body.getAttribute('data-page') === 'about') { stop(); startIfAbout(); }
        else { stop(); }
      }, 0);
    });
  });

  document.addEventListener('DOMContentLoaded', () => { startIfAbout(); });
})();