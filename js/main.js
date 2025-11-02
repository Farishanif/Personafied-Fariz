// js/main.js — menu, modal, theme & accent logic
(function(){
  const menuToggle = document.getElementById('menuToggle');
  const menuDropdown = document.getElementById('menuDropdown');
  const menuBtn = document.getElementById('menuBtn');
  const openAppearance = document.getElementById('openAppearance');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const closeModal = document.getElementById('closeModal');
  const root = document.body;

  // Dropdown toggle
  menuToggle && menuToggle.addEventListener('click', (e)=>{
    e.stopPropagation();
    const shown = menuDropdown.style.display === 'block';
    menuDropdown.style.display = shown ? 'none' : 'block';
    menuDropdown.setAttribute('aria-hidden', String(shown));
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e)=>{
    if (!menuBtn.contains(e.target)) {
      menuDropdown.style.display = 'none';
    }
  });

  // Modal handling
  openAppearance && openAppearance.addEventListener('click', ()=>{
    modalBackdrop.style.display = 'flex';
    modalBackdrop.setAttribute('aria-hidden','false');
  });
  closeModal && closeModal.addEventListener('click', ()=>{ modalBackdrop.style.display = 'none'; modalBackdrop.setAttribute('aria-hidden','true'); });
  modalBackdrop && modalBackdrop.addEventListener('click', (e)=>{ if(e.target === modalBackdrop) { modalBackdrop.style.display = 'none'; modalBackdrop.setAttribute('aria-hidden','true'); } });

  // Theme & Accent logic
  const themeRadios = document.querySelectorAll('input[name="themeMode"]');
  const accentRadios = document.querySelectorAll('input[name="accent"]');

  function applyAccent(name){
    root.classList.remove('theme-blue','theme-neon','theme-gray');
    root.classList.add('theme-' + name);
    localStorage.setItem('accent', name);
  }

  function applyTheme(mode){
    if(mode === 'system'){
      localStorage.removeItem('theme');
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      if(prefersDark) root.classList.add('dark'); else root.classList.remove('dark');
    } else if(mode === 'dark'){
      root.classList.add('dark');
      localStorage.setItem('theme','dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme','light');
    }
  }

  /* ===== AOS-Like Scroll Animations (Repeat + Reverse Based on Scroll Direction) ===== */
  (function(){
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('[data-aos]').forEach(el => el.classList.add('aos-animate'));
      return;
    }

    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      document.querySelectorAll('[data-aos]').forEach(el => el.classList.add('aos-animate'));
      return;
    }

    let lastScrollY = window.scrollY;

    const observer = new IntersectionObserver((entries) => {
      const scrollingDown = window.scrollY > lastScrollY;
      lastScrollY = window.scrollY;

      entries.forEach(entry => {
        const el = entry.target;

        const delay = parseInt(el.getAttribute('data-aos-delay') || '0', 10);
        const duration = parseInt(el.getAttribute('data-aos-duration') || '500', 10);

        el.style.transitionDuration = duration + 'ms';
        el.style.transitionDelay = delay + 'ms';

        // Entering viewport
        if (entry.isIntersecting) {
          // Apply reverse class if scrolling up
          if (!scrollingDown) {
            el.classList.add('aos-reverse');
          } else {
            el.classList.remove('aos-reverse');
          }
          el.classList.add('aos-animate');
        } 
        // Leaving viewport
        else {
          // Reverse leave animation based on direction
          if (scrollingDown) {
            el.classList.add('aos-reverse');
          } else {
            el.classList.remove('aos-reverse');
          }

          el.classList.remove('aos-animate');
        }
      });
    }, {
      rootMargin: '0px 0px -8% 0px',
      threshold: 0.18
    });

    document.querySelectorAll('[data-aos]').forEach(el => {
      el.style.willChange = 'opacity, transform';
      observer.observe(el);
    });

  })();

  /* ===== Auto-Stagger Support ===== */
  (function(){
    const parents = document.querySelectorAll('[data-aos-stagger]');
    if (!parents.length) return;

    parents.forEach(parent => {
      const baseDelay = parseInt(parent.getAttribute('data-aos-stagger') || '120', 10);
      let delay = 0;

      const children = parent.querySelectorAll('[data-aos]');
      children.forEach(child => {
        child.setAttribute('data-aos-delay', delay);
        delay += baseDelay;
      });
    });
  })();


  // Load saved preferences
  const savedAccent = localStorage.getItem('accent') || 'blue';
  applyAccent(savedAccent);
  const savedTheme = localStorage.getItem('theme') || 'system';

  // initialize radios
  themeRadios.forEach(r=>{
    if(r.value === savedTheme) r.checked = true;
    r.addEventListener('change', ()=> applyTheme(r.value));
  });
  accentRadios.forEach(a=>{
    if(a.value === savedAccent) a.checked = true;
    a.addEventListener('change', ()=> applyAccent(a.value));
  });

  // respond to system changes when in 'system' mode
  window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e)=>{
    const theme = localStorage.getItem('theme') || 'system';
    if(theme === 'system'){
      if(e.matches) root.classList.add('dark'); else root.classList.remove('dark');
    }
  });

  // initial theme apply
  applyTheme(savedTheme);

  // Accessibility: keyboard open modal (press 't')
  document.addEventListener('keyup', (e)=>{ if(e.key === 't') { modalBackdrop.style.display = 'flex'; modalBackdrop.setAttribute('aria-hidden','false'); } });
})();
