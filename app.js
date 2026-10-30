/* SciLand Lab: browser-native JS, no build tools or external libraries required. */
(() => {
  'use strict';
  const data = window.SCILAND_CONTENT;
  if (!data) { console.error('Missing site-content.js'); return; }
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const motionReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const escapeHtml = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));

  // Editable page identity.
  document.title = `${data.labName} — Scientific Embodied Intelligence`;
  $('#brand-name').textContent = data.labName;
  $('#footer-lab-name').textContent = data.labName;
  $('#footer-year').textContent = new Date().getFullYear();
  $('#hero-eyebrow').textContent = data.heroEyebrow;
  $('#hero-title-first').textContent = data.heroTitleFirst;
  $('#hero-title-second').textContent = data.heroTitleSecond;
  $('#hero-description').textContent = data.heroDescription;
  $('#mission-copy').textContent = data.missionCopy;
  const contactText = $('#contact-text');
  if (data.contactEmail) {
    const a = document.createElement('a'); a.href = `mailto:${data.contactEmail}`; a.textContent = data.contactEmail;
    contactText.replaceChildren(a);
  }

  // Research cards. A single SciLand project uses a dedicated wide layout.
  $('#project-grid').classList.toggle('single-project', data.projects.length === 1);
  $('#project-grid').innerHTML = data.projects.map((project, i) => `
    <article class="project-card reveal ${i === 0 ? 'project-featured' : ''}">
      <div class="project-cover"><img src="${escapeHtml(project.image)}" alt="Illustration of ${escapeHtml(project.title)} research theme" loading="lazy" width="700" height="430"/><div class="project-image-index">${escapeHtml(project.number)} / 0${data.projects.length}</div></div>
      <div class="project-content"><div class="project-meta"><span>${escapeHtml(project.category)}</span><span class="project-status ${escapeHtml(project.statusTone)}"><i></i>${escapeHtml(project.status)}</span></div>
      <h3>${escapeHtml(project.title)}</h3><p class="project-subtitle">${escapeHtml(project.subtitle)}</p><p class="project-summary">${escapeHtml(project.summary)}</p>
      <div class="project-tags">${project.tags.map(tag => `<span>${escapeHtml(tag)}</span>`).join('')}</div>
      <button class="project-open" type="button" data-project="${escapeHtml(project.id)}" aria-label="Read overview of ${escapeHtml(project.title)}"><span>Explore the project</span><span class="project-arrow" aria-hidden="true">↗</span></button></div>
    </article>
  `).join('');

  // Reports and filters.
  let activeFilter = 'all';
  const reportList = $('#report-list');
  function drawReports() {
    const reports = data.reports.filter(r => activeFilter === 'all' || (activeFilter === 'other' ? r.type !== 'Technical Report' : r.type === activeFilter));
    $('#report-count').textContent = `${String(reports.length).padStart(2,'0')} ${reports.length === 1 ? 'ENTRY' : 'ENTRIES'}`;
    reportList.innerHTML = reports.map(report => `
      <article class="report-entry">
        <div class="report-icon" aria-hidden="true"><svg viewBox="0 0 32 32" fill="none"><path d="M8 3h11l6 6v20H8z" stroke="currentColor" stroke-width="1.5"/><path d="M19 3v7h6M12 16h9M12 20h9M12 24h6" stroke="currentColor" stroke-width="1.5"/></svg></div>
        <div class="report-main"><div class="report-meta"><span>${escapeHtml(report.type)}</span><span class="report-meta-dot">•</span><span>${escapeHtml(report.year)}</span></div><h3>${escapeHtml(report.title)}</h3><p>${escapeHtml(report.description)}</p></div>
        <div class="report-action"><span class="report-state">${escapeHtml(report.status)}</span>${report.url ? `<a class="report-link" href="${escapeHtml(report.url)}" target="_blank" rel="noopener noreferrer">Open PDF <span aria-hidden="true">↗</span></a>` : `<button class="report-link" type="button" data-report="${escapeHtml(report.id)}">Read overview <span aria-hidden="true">↗</span></button>`}</div>
      </article>
    `).join('');
    $$('.filter-button').forEach(button => {
      const active = button.dataset.filter === activeFilter;
      button.classList.toggle('selected', active);
      button.setAttribute('aria-pressed', String(active));
    });
  }
  drawReports();
  $$('.filter-button').forEach(button => button.addEventListener('click', () => {activeFilter = button.dataset.filter; drawReports();}));

  // Accessible document/project details dialog.
  const dialog = $('#detail-dialog');
  function showDetail({category, title, subtitle, description, tags = [], url = ''}) {
    $('#dialog-kicker').textContent = category;
    $('#dialog-title').textContent = title;
    $('#dialog-subtitle').textContent = subtitle;
    $('#dialog-description').textContent = description;
    $('#dialog-tags').replaceChildren(...tags.map(tag => {const el=document.createElement('span');el.textContent=tag;return el;}));
    const link = $('#dialog-external');
    link.hidden = !url;
    if (url) link.href = url; else link.removeAttribute('href');
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
  }
  document.addEventListener('click', e => {
    const projectButton = e.target.closest('[data-project]');
    if (projectButton) {
      const p = data.projects.find(x => x.id === projectButton.dataset.project);
      if (p) showDetail({category: p.category, title: p.title, subtitle: p.subtitle, description: p.details, tags: p.tags, url: p.link});
    }
    const reportButton = e.target.closest('[data-report]');
    if (reportButton) {
      const r = data.reports.find(x => x.id === reportButton.dataset.report);
      if (r) showDetail({category: r.type.toUpperCase(), title: r.title, subtitle: `${r.year} · ${r.status}`, description: r.summary, tags: [r.type, r.status], url: r.url});
    }
  });
  $('#dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });

  // Responsive navigation.
  const menuToggle = $('#menu-toggle');
  const mobileNav = $('#mobile-navigation');
  function closeMenu() {
    menuToggle.setAttribute('aria-expanded','false');
    menuToggle.setAttribute('aria-label','Open navigation');
    menuToggle.classList.remove('is-open');
    mobileNav.hidden = true;
    document.body.classList.remove('menu-open');
  }
  menuToggle.addEventListener('click', () => {
    const opening = menuToggle.getAttribute('aria-expanded') !== 'true';
    menuToggle.setAttribute('aria-expanded', String(opening));
    menuToggle.setAttribute('aria-label', opening ? 'Close navigation' : 'Open navigation');
    menuToggle.classList.toggle('is-open', opening);
    mobileNav.hidden = !opening;
    document.body.classList.toggle('menu-open', opening);
  });
  $$('#mobile-navigation a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => {if(e.key === 'Escape') closeMenu();});
  window.addEventListener('resize', () => {if(window.innerWidth > 800) closeMenu();});

  // Scroll progress and sticky header contrast.
  let scrollFrame = 0;
  function onScroll() {
    if (scrollFrame) return;
    scrollFrame = requestAnimationFrame(() => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      $('#scroll-progress').style.transform = `scaleX(${Math.min(1, window.scrollY/max)})`;
      $('#site-header').classList.toggle('scrolled', window.scrollY > 35);
      scrollFrame = 0;
    });
  }
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();

  // Animation-on-entry, respecting accessibility settings.
  const revealElements = $$('.reveal');
  if (motionReduced || !('IntersectionObserver' in window)) revealElements.forEach(el=>el.classList.add('visible'));
  else {
    const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => { if(entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); } }),{threshold:0.10,rootMargin:'0px 0px -22px 0px'});
    revealElements.forEach(el=>revealObserver.observe(el));
  }

  // Dynamic particle background. Runs only when visible, adjusts to viewport and user preferences.
  const canvas = $('#particle-canvas');
  const context = canvas.getContext('2d', {alpha:true});
  if (context && !motionReduced) {
    let particles=[], raf=0, width=0, height=0, dpr=1, active=true;
    function resize() {
      const rect=canvas.getBoundingClientRect();width=rect.width;height=rect.height;dpr=Math.min(window.devicePixelRatio||1,2);
      canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);context.setTransform(dpr,0,0,dpr,0,0);
      const target=Math.min(115,Math.max(34,Math.round((width*height)/11800)));
      particles=Array.from({length:target}, () => ({x:Math.random()*width,y:Math.random()*height,r:.5+Math.random()*1.6,vx:(Math.random()-.5)*.16,vy:(Math.random()-.5)*.16,a:.22+Math.random()*.52}));
    }
    function frame() {
      if(!active) return;
      context.clearRect(0,0,width,height);
      for(let i=0;i<particles.length;i++) {
        const p=particles[i];p.x+=p.vx;p.y+=p.vy;
        if(p.x<0)p.x=width;if(p.x>width)p.x=0;if(p.y<0)p.y=height;if(p.y>height)p.y=0;
        context.beginPath();context.arc(p.x,p.y,p.r,0,Math.PI*2);context.fillStyle=`rgba(160,220,246,${p.a})`;context.fill();
        if (i % 4 === 0) {
          for(let j=i+1;j<Math.min(i+8,particles.length);j++){
            const q=particles[j],dist=Math.hypot(p.x-q.x,p.y-q.y);
            if(dist<140){context.beginPath();context.moveTo(p.x,p.y);context.lineTo(q.x,q.y);context.strokeStyle=`rgba(100,193,234,${(1-dist/140)*.105})`;context.lineWidth=.7;context.stroke();}
          }
        }
      }
      raf=requestAnimationFrame(frame);
    }
    function start(){if(!active){active=true;raf=requestAnimationFrame(frame);}}
    function stop(){active=false;cancelAnimationFrame(raf);}
    resize();frame();
    window.addEventListener('resize',resize,{passive:true});
    document.addEventListener('visibilitychange',()=>document.hidden?stop():start());
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(entries=>{entries[0].isIntersecting?start():stop();},{threshold:0}).observe(canvas);
    }
  }
})();
