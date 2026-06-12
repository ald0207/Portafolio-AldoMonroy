/* ── NAVEGACIÓN DE PÁGINAS ── */

const navMap = {
  'home':             'nav-home-center',
  'about':            'nav-about',
  'proyectos':        'nav-proyectos',
  'demo-reels':       'nav-demo',
  'servicios':        'nav-servicios',
  'contacto':         'nav-contacto',
  'proyecto-detalle': 'nav-proyectos',
  'detalle-3d-2':     'nav-proyectos',
  'detalle-3d-3':     'nav-proyectos',
  'detalle-wb-1':     'nav-proyectos',
  'detalle-wb-2':     'nav-proyectos',
  'detalle-wb-3':     'nav-proyectos',
  'detalle-brand-1':  'nav-proyectos',
  'detalle-brand-2':  'nav-proyectos',
  'detalle-brand-3':  'nav-proyectos'
};

function moveNavIndicator(btnId) {
  if (!btnId) return;
  const btn = document.getElementById(btnId);
  const indicator = document.getElementById('nav-indicator');
  const navIcons = document.querySelector('.nav-icons');
  if (!btn || !indicator || !navIcons) return;

  const btnRect = btn.getBoundingClientRect();
  const navRect = navIcons.getBoundingClientRect();
  indicator.style.left  = (btnRect.left - navRect.left) + 'px';
  indicator.style.width = btnRect.width + 'px';
}

function showPage(id) {
  const aboutEl = document.getElementById('about');
  if (aboutEl) {
    const aboutTargets = aboutEl.querySelectorAll(
      'h1, .sub, .sec-title, .about-txt, .sw, .btn-cta, .clink, p, h2, h3'
    );
    aboutTargets.forEach(el => {
      el.classList.remove('about-visible');
      el.style.opacity = '0';
      el.style.animation = 'none';
    });
  }

  const currentPage = document.querySelector('.page.active');

  const doTransition = () => {
    document.querySelectorAll('.page').forEach(p => {
      p.classList.remove('active', 'page-zoom-out');
    });

    const target = document.getElementById(id);
    if (target) target.classList.add('active');

    document.querySelectorAll('.nav-icon').forEach(b => b.classList.remove('active'));
    if (navMap[id]) {
      const btn = document.getElementById(navMap[id]);
      if (btn) btn.classList.add('active');
      moveNavIndicator(navMap[id]);
    }

    if (id === 'home') {
      const homeEl = document.getElementById('home');
      homeEl.classList.remove('home-loaded');
      setTimeout(() => homeEl.classList.add('home-loaded'), 50);
    }

    window.scrollTo(0, 0);

    if (id === 'about') {
      setTimeout(() => animateAboutPage(), 460);
    }
  };

  if (currentPage && currentPage.id !== id) {
    currentPage.classList.add('page-zoom-out');
    setTimeout(doTransition, 280);
  } else {
    doTransition();
  }
}

/* ── TABS CON SLIDE ANIMATION ── */

let currentTabIndex = { 'proyectos': 0, 'demo-reels': 0 };

const tabOrders = {
  'proyectos':  ['ptab-3d', 'ptab-wb', 'ptab-brand'],
  'demo-reels': ['dtab-3d', 'dtab-wb', 'dtab-ux',    'dtab-brand']
};

function switchTab(pageId, tabId, btn) {
  const page = document.getElementById(pageId);
  const currentTab = page.querySelector('.tab-content.active');
  const nextTab = document.getElementById(tabId);
  if (!currentTab || currentTab === nextTab) return;

  const order = tabOrders[pageId] || [];
  const currentIndex = order.indexOf(currentTab.id);
  const nextIndex    = order.indexOf(tabId);
  const goingRight   = nextIndex > currentIndex;

  page.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  const currentCards = currentTab.querySelectorAll('.proj-card');
  const currentDesc  = currentTab.querySelector('.proj-desc');
  const exitClass    = goingRight ? 'exit-right' : 'exit-left';
  const enterClass   = goingRight ? 'enter-left'  : 'enter-right';

  if (currentDesc) currentDesc.classList.add(exitClass);

  currentCards.forEach((card, i) => {
    setTimeout(() => card.classList.add(exitClass), i * 70);
  });

  const exitDuration = 280 + (currentCards.length * 70);

  setTimeout(() => {
    currentTab.classList.remove('active');
    currentTab.querySelectorAll('.proj-card').forEach(c => c.classList.remove(exitClass));
    if (currentDesc) currentDesc.classList.remove(exitClass);

    nextTab.classList.add('active');

    const nextDesc = nextTab.querySelector('.proj-desc');
    if (nextDesc) {
      nextDesc.classList.add(enterClass);
      setTimeout(() => nextDesc.classList.remove(enterClass), 400);
    }

    const nextCards = nextTab.querySelectorAll('.proj-card');
    nextCards.forEach((card, i) => {
      card.style.opacity = '0';
      setTimeout(() => {
        card.style.opacity = '';
        card.classList.add(enterClass);
        setTimeout(() => card.classList.remove(enterClass), 400);
      }, i * 90);
    });
  }, exitDuration);

  currentTabIndex[pageId] = nextIndex;
}

/* ── PROCESO CON GOTA Y GLOW ── */

function switchProc(tabId, btn) {
  const page = btn.closest('.page');
  const currentProc = page.querySelector('.proc-content.active');
  const nextProc = document.getElementById(tabId);
  if (!currentProc || currentProc === nextProc) return;

  document.querySelectorAll('.proc-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  const drop = document.createElement('div');
  drop.className = 'drop-ripple';

  const dropBody    = document.createElement('div');
  const dropSplash  = document.createElement('div');
  const dropSplash2 = document.createElement('div');
  dropBody.className    = 'drop-body';
  dropSplash.className  = 'drop-splash';
  dropSplash2.className = 'drop-splash-2';

  drop.appendChild(dropBody);
  drop.appendChild(dropSplash);
  drop.appendChild(dropSplash2);

  btn.style.position = 'relative';
  btn.style.overflow = 'visible';
  btn.appendChild(drop);
  setTimeout(() => drop.remove(), 900);

  currentProc.classList.add('fading-out');
  setTimeout(() => {
    currentProc.classList.remove('active', 'fading-out');
    nextProc.classList.add('active', 'fading-in');
    setTimeout(() => nextProc.classList.remove('fading-in'), 300);
    triggerProcContentGlow(nextProc);
  }, 200);
}

/* ── ANIMACIONES ── */

function triggerProcContentGlow(procEl) {
  const oldSvg = procEl.querySelector('.proc-glow-svg');
  if (oldSvg) oldSvg.remove();

  const w = procEl.offsetWidth + 6;
  const h = procEl.offsetHeight + 6;
  const r = 14;

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'proc-glow-svg');
  svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
  svg.setAttribute('width', w);
  svg.setAttribute('height', h);

  const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  rect.setAttribute('x', '2');
  rect.setAttribute('y', '2');
  rect.setAttribute('width', w - 4);
  rect.setAttribute('height', h - 4);
  rect.setAttribute('rx', r);
  rect.setAttribute('ry', r);

  const perimeter = 2 * ((w - 4) + (h - 4));
  rect.style.strokeDasharray = `0, ${perimeter}`;

  svg.appendChild(rect);
  procEl.appendChild(svg);

  void svg.offsetWidth;
  svg.classList.add('animating');

  setTimeout(() => {
    svg.classList.remove('animating');
    svg.classList.add('meeting');
    setTimeout(() => svg.remove(), 650);
  }, 1050);
}

function animateAboutPage() {
  const aboutPage = document.getElementById('about');
  if (!aboutPage) return;

  const targets = aboutPage.querySelectorAll(
    'h1, .sub, .sec-title, .about-txt, .sw, .btn-cta, .clink, p, h2, h3'
  );

  targets.forEach(el => {
    el.classList.remove('about-visible');
    el.style.opacity = '0';
    el.style.animation = 'none';
  });

  void aboutPage.offsetWidth;

  targets.forEach(el => {
    el.style.animation = '';
  });

  targets.forEach((el, i) => {
    setTimeout(() => {
      el.style.opacity = '';
      el.classList.add('about-visible');
    }, i * 55);
  });
}

/* ── INICIALIZACIÓN ── */

document.addEventListener('DOMContentLoaded', function () {
  const homeEl = document.getElementById('home');
  if (homeEl) {
    setTimeout(() => homeEl.classList.add('home-loaded'), 50);
  }
});
