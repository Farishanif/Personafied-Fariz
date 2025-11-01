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
    root.classList.remove('theme-blue','theme-cyber','theme-gray');
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