


(function(){
  const DESKTOP = window.matchMedia('(min-width: 992px)');
  const dropdowns = Array.from(document.querySelectorAll('.navbar-component .navbar-menu-dropdown.w-dropdown'));
  if (!dropdowns.length) return;

  // Disable Webflow's built-in hover logic; we drive the state.
  dropdowns.forEach(dd => dd.setAttribute('data-hover', 'false'));

  const OPEN_DELAY  = 80;   // ms
  const CLOSE_DELAY = 150;  // ms

  const timers = new WeakMap();
  const pinned = new WeakMap(); // dd -> boolean (click "pinned" on desktop)

  function getToggle(dd){ return dd.querySelector('.w-dropdown-toggle, .navbar-dropdwn-toggle'); }
  function getList(dd){ return dd.querySelector('.w-dropdown-list'); }

  function setExpanded(dd, open){
    const t = getToggle(dd);
    if (t) t.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  function clearTimer(dd){
    const id = timers.get(dd);
    if (id){ clearTimeout(id); timers.delete(dd); }
  }
  function schedule(dd, fn, delay){
    clearTimer(dd);
    timers.set(dd, setTimeout(() => { fn(dd); timers.delete(dd); }, delay));
  }

  function isOpen(dd){ return dd.classList.contains('w--open'); }
  function isPinned(dd){ return pinned.get(dd) === true; }

  function show(dd){
    dropdowns.forEach(d => { if (d !== dd) hide(d); });
    dd.classList.add('w--open');
    setExpanded(dd, true);
  }
  function hide(dd){
    dd.classList.remove('w--open');
    setExpanded(dd, false);
  }
  function unpinAll(){ dropdowns.forEach(d => pinned.set(d, false)); }

  dropdowns.forEach(dd => {
    pinned.set(dd, false);
    const toggle = getToggle(dd);
    const list   = getList(dd);

    // Desktop hover intent
    dd.addEventListener('pointerenter', () => {
      if (!DESKTOP.matches) return;
      if (isPinned(dd)) return;
      schedule(dd, show, OPEN_DELAY);
    });
    dd.addEventListener('pointerleave', () => {
      if (!DESKTOP.matches) return;
      if (isPinned(dd)) return;
      schedule(dd, hide, CLOSE_DELAY);
    });

    // Click behavior
    if (toggle){
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        clearTimer(dd);

        if (DESKTOP.matches){
          const open = isOpen(dd);
          const pin  = isPinned(dd);

          if (!open){
            show(dd);
            pinned.set(dd, true);
          } else {
            if (pin){
              pinned.set(dd, false);
              hide(dd);
            } else {
              pinned.set(dd, true);
              show(dd);
            }
          }
        } else {
          // Mobile toggling
          isOpen(dd) ? hide(dd) : show(dd);
        }
      });
    }

    // Keyboard support
    dd.addEventListener('focusin', () => {
      if (DESKTOP.matches && !isPinned(dd)) show(dd);
    });
    dd.addEventListener('focusout', (e) => {
      if (!DESKTOP.matches) return;
      if (dd.contains(e.relatedTarget)) return;
      if (!isPinned(dd)) hide(dd);
    });

    // Clicking a link inside closes (both modes)
    if (list){
      list.addEventListener('click', (e) => {
        if (e.target.closest('a')){
          pinned.set(dd, false);
          hide(dd);
        }
      });
    }
  });

  // Outside click / Esc closes all
  document.addEventListener('click', (e) => {
    if (e.target.closest('.navbar-component .navbar-menu-dropdown')) return;
    unpinAll();
    dropdowns.forEach(hide);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    unpinAll();
    dropdowns.forEach(hide);
  });

  // Reset state on breakpoint change
  DESKTOP.addEventListener('change', () => {
    unpinAll();
    dropdowns.forEach(hide);
  });
})();

