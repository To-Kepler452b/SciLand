/* SciLand Lab: browser-native JS, no build tools or external libraries required. */
(() => {
  'use strict';
  const data = window.SCILAND_CONTENT;
  if (!data) { console.error('Missing site-content.js'); return; }
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const motionReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const escapeHtml = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const tr = (key) => window.SCILAND_I18N ? window.SCILAND_I18N.t(key) : key;

  // Editable page identity.
  document.title = `${data.labName} — ${tr('Scientific Embodied Intelligence')}`;
  $('#brand-name').textContent = data.labName;
  $('#footer-lab-name').textContent = data.labName;
  $('#footer-year').textContent = new Date().getFullYear();
  $('#hero-eyebrow').textContent = data.heroEyebrow;
  $('#hero-title-first').textContent = data.heroTitleFirst;
  $('#hero-title-second').textContent = data.heroTitleSecond;
  $('#hero-description').textContent = data.heroDescription;

  // Typewriter phrases restart cleanly when the site language changes.
  const typingNode = $('#hero-typewriter-text');
  let stopTypewriter = () => {};
  function startTypewriter() {
    stopTypewriter();
    const phrases = Array.isArray(data.heroTypewriterPhrases)
      ? data.heroTypewriterPhrases.filter(p => typeof p === 'string' && p.trim()).map(p => p.trim()).slice(0,8)
      : [];
    if (!typingNode || !phrases.length) return;
    typingNode.textContent = phrases[0];
    if (motionReduced || phrases.length < 2) return;
    let phraseIndex=0, charIndex=phrases[0].length, deleting=true, timer=0, heroVisible=true;
    let observer=null, disposed=false;
    function clearTyping(){ if(timer){clearTimeout(timer);timer=0;} }
    function queue(ms){clearTyping();timer=window.setTimeout(tick,ms);}
    function tick(){
      timer=0;
      if (disposed || document.hidden || !heroVisible) return;
      if (deleting) {
        charIndex=Math.max(0,charIndex-1);
        typingNode.textContent=phrases[phraseIndex].slice(0,charIndex);
        if(charIndex===0){
          deleting=false;phraseIndex=(phraseIndex+1)%phrases.length;queue(370);
        } else queue(38);
      } else {
        charIndex=Math.min(phrases[phraseIndex].length,charIndex+1);
        typingNode.textContent=phrases[phraseIndex].slice(0,charIndex);
        if(charIndex===phrases[phraseIndex].length){deleting=true;queue(2150);}
        else queue(70);
      }
    }
    function syncTyping(){
      if(disposed)return;
      if(document.hidden||!heroVisible) clearTyping();
      else if(!timer)queue(300);
    }
    document.addEventListener('visibilitychange',syncTyping);
    if('IntersectionObserver' in window){
      const hero=$('.hero');
      if(hero){
        observer=new IntersectionObserver(entries=>{
          heroVisible=entries[0].isIntersecting;syncTyping();
        },{threshold:0});
        observer.observe(hero);
      }
    }
    stopTypewriter=()=>{
      disposed=true;
      clearTyping();
      document.removeEventListener('visibilitychange',syncTyping);
      if(observer)observer.disconnect();
    };
    queue(2200);
  }
  startTypewriter();
  $('#mission-copy').textContent = data.missionCopy;
  const contactText = $('#contact-text');
  if (data.contactEmail) {
    const a = document.createElement('a'); a.href = `mailto:${data.contactEmail}`; a.textContent = data.contactEmail;
    contactText.replaceChildren(a);
  }

  // Research cards. A single SciLand project uses a dedicated wide layout.
  function drawProjects() {
  $('#project-grid').classList.toggle('single-project', data.projects.length === 1);
  $('#project-grid').innerHTML = data.projects.map((project, i) => `
    <article class="project-card reveal ${i === 0 ? 'project-featured' : ''}">
      <div class="project-cover"><img src="${escapeHtml(project.image)}" alt="${escapeHtml(tr('Project illustration:') + ' ' + project.title)}" loading="lazy" width="700" height="430"/><div class="project-image-index">${escapeHtml(project.number)} / 0${data.projects.length}</div></div>
      <div class="project-content"><div class="project-meta"><span>${escapeHtml(project.category)}</span><span class="project-status ${escapeHtml(project.statusTone)}"><i></i>${escapeHtml(project.status)}</span></div>
      <h3>${escapeHtml(project.title)}</h3><p class="project-subtitle">${escapeHtml(project.subtitle)}</p><p class="project-summary">${escapeHtml(project.summary)}</p>
      <div class="project-tags">${project.tags.map(tag => `<span>${escapeHtml(tag)}</span>`).join('')}</div>
      <button class="project-open" type="button" data-project="${escapeHtml(project.id)}" aria-label="${escapeHtml(tr('Read overview of'))} ${escapeHtml(project.title)}"><span>${escapeHtml(tr('Explore the project'))}</span><span class="project-arrow" aria-hidden="true">↗</span></button></div>
    </article>
  `).join('');
  }
  drawProjects();

  // Reports and filters.
  let activeFilter = 'all';
  const reportList = $('#report-list');
  function drawReports() {
    const reports = data.reports.filter(r => activeFilter === 'all' || (activeFilter === 'other' ? r.type !== 'Technical Report' : r.type === activeFilter));
    $('#report-count').textContent = `${String(reports.length).padStart(2,'0')} ${tr(reports.length === 1 ? 'ENTRY' : 'ENTRIES')}`;
    reportList.innerHTML = reports.map(report => `
      <article class="report-entry">
        <div class="report-icon" aria-hidden="true"><svg viewBox="0 0 32 32" fill="none"><path d="M8 3h11l6 6v20H8z" stroke="currentColor" stroke-width="1.5"/><path d="M19 3v7h6M12 16h9M12 20h9M12 24h6" stroke="currentColor" stroke-width="1.5"/></svg></div>
        <div class="report-main"><div class="report-meta"><span>${escapeHtml(tr(report.type))}</span><span class="report-meta-dot">•</span><span>${escapeHtml(report.year)}</span></div><h3>${escapeHtml(report.title)}</h3><p>${escapeHtml(report.description)}</p></div>
        <div class="report-action"><span class="report-state">${escapeHtml(report.status)}</span>${report.url ? `<a class="report-link" href="${escapeHtml(report.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(tr('Open PDF'))} <span aria-hidden="true">↗</span></a>` : `<button class="report-link" type="button" data-report="${escapeHtml(report.id)}">${escapeHtml(tr('Read overview'))} <span aria-hidden="true">↗</span></button>`}</div>
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
      if (r) showDetail({category: tr(r.type).toUpperCase(), title: r.title, subtitle: `${r.year} · ${r.status}`, description: r.summary, tags: [r.type, r.status], url: r.url});
    }
  });
  $('#dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });

  // Responsive navigation.
  const menuToggle = $('#menu-toggle');
  const mobileNav = $('#mobile-navigation');
  function closeMenu() {
    menuToggle.setAttribute('aria-expanded','false');
    menuToggle.setAttribute('aria-label',tr('Open navigation'));
    menuToggle.classList.remove('is-open');
    mobileNav.hidden = true;
    document.body.classList.remove('menu-open');
  }
  menuToggle.addEventListener('click', () => {
    const opening = menuToggle.getAttribute('aria-expanded') !== 'true';
    menuToggle.setAttribute('aria-expanded', String(opening));
    menuToggle.setAttribute('aria-label', tr(opening ? 'Close navigation' : 'Open navigation'));
    menuToggle.classList.toggle('is-open', opening);
    mobileNav.hidden = !opening;
    document.body.classList.toggle('menu-open', opening);
  });
  $$('#mobile-navigation a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => {if(e.key === 'Escape') closeMenu();});
  window.addEventListener('resize', () => {if(window.innerWidth > 800) closeMenu();});

  // Refresh programmatically generated areas without reloading or resetting other effects.
  window.addEventListener('sciland:languagechange', () => {
    document.title = data.labName + ' — ' + tr('Scientific Embodied Intelligence');
    $('#brand-name').textContent = data.labName;
    $('#footer-lab-name').textContent = data.labName;
    $('#hero-eyebrow').textContent = data.heroEyebrow;
    $('#hero-title-first').textContent = data.heroTitleFirst;
    $('#hero-title-second').textContent = data.heroTitleSecond;
    $('#hero-description').textContent = data.heroDescription;
    $('#mission-copy').textContent = data.missionCopy;
    drawProjects();
    $$('#project-grid .reveal').forEach(el => el.classList.add('visible'));
    drawReports();
    startTypewriter();
    menuToggle.setAttribute('aria-label', tr(menuToggle.getAttribute('aria-expanded')==='true' ? 'Close navigation':'Open navigation'));
    if(dialog.open)dialog.close();
  });

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

  // SciLand V3: cinematic cyan/violet dust, constellation edges and energy pulses.
  // Canvas is capped on mobile, paused off-screen, and disabled for reduced motion.
  const canvas = $('#particle-canvas');
  const context = canvas && canvas.getContext('2d', {alpha:true});
  if (context && !motionReduced) {
    const hero = $('.hero');
    const rand = (min,max) => min+Math.random()*(max-min);
    let particles=[], streaks=[], raf=0, width=0, height=0, dpr=1;
    let active=false, inView=true, pointerX=.64, pointerY=.36, lastFrame=0;
    function resize() {
      const rect=canvas.getBoundingClientRect();
      width=rect.width; height=rect.height;
      if(width<1 || height<1) return;
      dpr=Math.min(window.devicePixelRatio||1,1.6);
      canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);
      context.setTransform(dpr,0,0,dpr,0,0);
      const compact=window.innerWidth<700;
      const count=compact ? Math.min(52,Math.round(width*height/10000))
        : Math.min(145,Math.max(58,Math.round(width*height/10500)));
      particles=Array.from({length:count}, (_,i)=>({
        x:rand(0,width),y:rand(0,height),r:rand(.55,2.3),
        vx:rand(-.19,.19),vy:rand(-.22,.17),
        alpha:rand(.22,.82),phase:rand(0,Math.PI*2),
        purple:i%3===0, constellation:i%3===0 && !compact
      }));
      streaks=Array.from({length:compact?2:7},()=>({
        x:rand(width*.35,width),y:rand(0,height),
        vx:rand(-1.4,-.45),vy:rand(.12,.64),len:rand(17,65),
        alpha:rand(.12,.4),phase:rand(0,Math.PI*2)
      }));
    }
    function draw(t) {
      if(!active)return;
      raf=requestAnimationFrame(draw);
      if(t-lastFrame<33)return; // ~30fps limits GPU load on laptops and mobile
      const dt=Math.min(2,(t-lastFrame)/33||1);lastFrame=t;
      context.clearRect(0,0,width,height);
      if(width<1||height<1)return;
      const compact=window.innerWidth<700;
      for(const p of particles){
        p.x+=p.vx*dt;p.y+=p.vy*dt;p.phase+=.014*dt;
        if(p.x<0)p.x=width;if(p.x>width)p.x=0;
        if(p.y<0)p.y=height;if(p.y>height)p.y=0;
        const a=p.alpha*(.74+.26*Math.sin(p.phase));
        const color=p.purple?'168,110,255':'95,206,255';
        if(p.r>1.45){
          const halo=context.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*7);
          halo.addColorStop(0,'rgba('+color+','+(a*.25)+')');
          halo.addColorStop(1,'rgba('+color+',0)');
          context.fillStyle=halo;context.beginPath();
          context.arc(p.x,p.y,p.r*7,0,Math.PI*2);context.fill();
        }
        context.fillStyle='rgba('+color+','+a+')';
        context.beginPath();context.arc(p.x,p.y,p.r,0,Math.PI*2);context.fill();
      }
      // Sparse, localized network: brighter toward the right, not across headings.
      if(!compact)for(let i=0;i<particles.length;i+=2){
        const p=particles[i];if(p.x<width*.45)continue;
        for(let j=i+1;j<Math.min(i+17,particles.length);j++){
          const q=particles[j];const dx=p.x-q.x,dy=p.y-q.y;
          const dist2=dx*dx+dy*dy;
          if(dist2>175*175 || dist2<15*15)continue;
          const alpha=(1-Math.sqrt(dist2)/175)*.19;
          context.strokeStyle=p.purple?'rgba(174,109,255,'+alpha+')':'rgba(89,202,255,'+alpha+')';
          context.lineWidth=.8;context.beginPath();
          context.moveTo(p.x,p.y);context.lineTo(q.x,q.y);context.stroke();
        }
      }
      // Faint comet-like energy motes behind live content.
      for(const s of streaks){
        s.x+=s.vx*dt;s.y+=s.vy*dt;
        if(s.x<-90 || s.y>height+90){s.x=rand(width*.55,width+40);s.y=rand(-40,height*.7);}
        const g=context.createLinearGradient(s.x,s.y,s.x+s.len,s.y-s.len*.26);
        g.addColorStop(0,'rgba(170,107,255,0)');
        g.addColorStop(1,'rgba(103,207,255,'+s.alpha+')');
        context.strokeStyle=g;context.lineWidth=1.2;context.beginPath();
        context.moveTo(s.x,s.y);context.lineTo(s.x+s.len,s.y-s.len*.26);context.stroke();
      }
      // SciLand V6 DNA-linked resonance: low-cost synchronized energy nodes.
      // Positioned over the holographic network, not over the text.
      if(!compact){
        const phase=t*.00058;
        const nodes=9;
        for(let k=0;k<nodes;k++){
          const progress=k/(nodes-1);
          const nx=width*(.57+.34*progress);
          const ny=height*(.20+.10*Math.sin(progress*8.8+phase*.62)+.06*progress);
          const flicker=.42+.45*Math.sin(phase*2.0-k*.64);
          const alpha=.10+.17*flicker;
          const radius=2.5+2.5*flicker;
          const color=k%3===0?'185,125,255':'102,211,255';
          const halo=context.createRadialGradient(nx,ny,0,nx,ny,radius*9);
          halo.addColorStop(0,'rgba('+color+','+alpha+')');
          halo.addColorStop(.28,'rgba('+color+','+(alpha*.33)+')');
          halo.addColorStop(1,'rgba('+color+',0)');
          context.fillStyle=halo;
          context.beginPath();context.arc(nx,ny,radius*9,0,Math.PI*2);context.fill();
        }
      }
      // Gentle interactive parallax glow, without pointer handlers on the canvas itself.
      if(!compact){
        const gx=width*(.63+(pointerX-.5)*.08);
        const gy=height*(.36+(pointerY-.5)*.08);
        const glow=context.createRadialGradient(gx,gy,0,gx,gy,Math.min(width*.30,360));
        glow.addColorStop(0,'rgba(97,81,224,.048)');
        glow.addColorStop(1,'rgba(97,81,224,0)');
        context.fillStyle=glow;context.fillRect(0,0,width,height);
      }
    }
    function stop(){active=false;cancelAnimationFrame(raf);raf=0;}
    function sync(){
      if(!document.hidden && inView && !active){
        active=true;lastFrame=0;raf=requestAnimationFrame(draw);
      }else if((document.hidden||!inView)&&active)stop();
    }
    let resizeFrame=0;
    window.addEventListener('resize',()=>{
      if(resizeFrame)return;
      resizeFrame=requestAnimationFrame(()=>{resizeFrame=0;resize();});
    },{passive:true});
    if(hero)hero.addEventListener('pointermove',e=>{
      const r=hero.getBoundingClientRect();
      pointerX=(e.clientX-r.left)/Math.max(1,r.width);
      pointerY=(e.clientY-r.top)/Math.max(1,r.height);
    },{passive:true});
    document.addEventListener('visibilitychange',sync);
    if('IntersectionObserver' in window){
      new IntersectionObserver(entries=>{
        inView=entries[0].isIntersecting;sync();
      },{threshold:0}).observe(canvas);
    }
    resize();sync();
  }
})();
