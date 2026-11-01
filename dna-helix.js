/* SciLand V7 · genuine rotating double-helix, mathematically projected from 3D.
 * The photograph remains a static backdrop; only the DNA geometry is animated.
 * Native Canvas, no CDN, dependencies, video or WebGL required.
 */
(() => {
  'use strict';
  const hero = document.querySelector('.hero');
  const canvas = document.querySelector('#dna-helix-canvas');
  if (!hero || !canvas) return;
  const ctx = canvas.getContext('2d', {alpha: true});
  if (!ctx) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const imageWidth = 2048, imageHeight = 1152;
  const tau = Math.PI * 2;
  const random = (a,b) => a + Math.random()*(b-a);
  const stars = Array.from({length: 36}, (_,i) => ({
    u: random(.02,.98), phase: random(0,tau), drift: random(.4,1.4),
    r:random(1.0,2.9), hue:i%3===0? 'violet':'cyan', z:random(-1,1)
  }));
  let width = 0, height = 0, dpr = 1, scale = 1, ox = 0, oy = 0;
  let running = false, visible = true, raf = 0, last = 0;
  let elapsed = 0, lastTick = 0;

  function resize() {
    const bounds = hero.getBoundingClientRect();
    width = bounds.width; height = bounds.height;
    if (!width || !height) return;
    dpr = Math.min(window.devicePixelRatio || 1, window.innerWidth < 750 ? 1.1 : 1.6);
    canvas.width = Math.round(width*dpr);
    canvas.height = Math.round(height*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
    scale = Math.max(width/imageWidth, height/imageHeight);
    // Matches CSS background-size: cover, background-position: center center.
    // Hero backgrounds use 59%-61% on narrow screens, but helix is kept right of copy.
    const backgroundX = window.innerWidth <= 580 ? .61 : window.innerWidth <= 800 ? .59 : .5;
    ox = (width-imageWidth*scale)*backgroundX;
    oy = (height-imageHeight*scale)*.5;
  }
  const at = (x,y) => ({x:ox+x*scale,y:oy+y*scale});
  const lerp = (a,b,u) => a+(b-a)*u;
  // Each strand is an actual 3D helix. The u-dependent axis is diagonal within
  // the user's original high-resolution hero photograph.
  function helix(u, strand, spin) {
    const phase = u*2.85*tau + spin + strand*Math.PI;
    const x = lerp(1060,1940,u);
    const y = lerp(224,126,u);
    const radius = (81+13*Math.sin(Math.PI*u)) * (0.72+0.28*Math.sin(Math.PI*Math.min(1,u)*.85));
    const lateral = Math.sin(phase)*radius;
    const depth = Math.cos(phase);
    // Perpendicular vector to axis (0.994,-0.11).
    const perspective = 1 + depth*.075;
    const p = at(x - .11*lateral*perspective,y-.994*lateral*perspective);
    return {x:p.x,y:p.y,z:depth,phase,front:depth>0};
  }
  function glowDot(x,y,r,rgb,a) {
    const grad=ctx.createRadialGradient(x,y,0,x,y,r);
    grad.addColorStop(0,`rgba(${rgb},${a})`);
    grad.addColorStop(.23,`rgba(${rgb},${a*.36})`);
    grad.addColorStop(1,`rgba(${rgb},0)`);
    ctx.fillStyle=grad;ctx.beginPath();ctx.arc(x,y,r,0,tau);ctx.fill();
  }
  function strokeSegment(a,b,rgb,alpha,w,blur) {
    ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);
    ctx.lineCap='round';ctx.lineWidth=w;ctx.strokeStyle=`rgba(${rgb},${alpha})`;
    if(blur){ctx.shadowColor=`rgba(${rgb},${alpha*.65})`;ctx.shadowBlur=blur;}
    ctx.stroke();ctx.shadowBlur=0;
  }

  function render(time) {
    if (!width || !height) return;
    ctx.clearRect(0,0,width,height);
    const compact = window.innerWidth < 750;
    const samples = compact ? 90 : 152;
    const spin = time*.34; // physically changing depth & spatial shape: ~18.5s per turn
    const strands = [[],[]];
    for (let k=0;k<=samples;k++) {
      const u=k/samples;
      strands[0].push(helix(u,0,spin));
      strands[1].push(helix(u,1,spin));
    }
    ctx.save();
    // Soft local halo behind the rotating geometry; no baked-in or duplicate DNA.
    const core=at(1555,185);
    glowDot(core.x,core.y,230*scale,'68,110,244',.085);

    // Back-facing rails first; their low intensity creates accurate occlusion.
    for(let s=0;s<2;s++) for(let k=1;k<=samples;k++){
      const a=strands[s][k-1],b=strands[s][k],depth=(a.z+b.z)/2;
      if(depth>=0)continue;
      const alpha=.13+.22*(depth+1);
      strokeSegment(a,b,s?'183,111,252':'77,161,254',alpha,Math.max(.8,2.0*scale),0);
    }
    // The transverse base-pair rungs rotate around the same spatial axis.
    for(let j=1;j<46;j++){
      const u=j/46;
      const a=helix(u,0,spin),b=helix(u,1,spin);
      const highlight=.5+.5*Math.sin(spin*1.1+u*24);
      const alpha=(.12+.30*highlight)*(.82+.18*Math.max(a.z,b.z));
      strokeSegment(a,b,j%2?'136,219,255':'195,144,255',alpha,Math.max(.7,1.55*scale),0);
      if(j%5===0){glowDot(a.x,a.y,4.5*scale,j%2?'112,225,255':'194,130,255',.44);}
    }
    // Front-facing rails are thick, bright, and naturally pass over the rungs.
    for(let s=0;s<2;s++) for(let k=1;k<=samples;k++){
      const a=strands[s][k-1],b=strands[s][k],depth=(a.z+b.z)/2;
      if(depth<0)continue;
      const rgb=s?'205,139,255':'108,223,255';
      const a1=.47+.4*depth;
      strokeSegment(a,b,rgb,a1,Math.max(1.1,(2.4+1.0*depth)*scale),s?7:9);
      if(k%5===0)strokeSegment(a,b,'230,246,255',.12+.22*depth,Math.max(.65,.9*scale),0);
    }
    // Travelling energy orbs physically follow the rotating front/back strands.
    for(let n=0;n<4;n++){
      const strand=n%2;
      const u=(time*(n%2?.052:.070)+n*.29)%1;
      const p=helix(u,strand,spin);
      const a=(.26+.42*(p.z+1)/2);
      const rgb=strand?'199,128,255':'100,224,255';
      glowDot(p.x,p.y,Math.max(6,18*scale),rgb,a);
      ctx.fillStyle=`rgba(237,251,255,${a*.7})`;
      ctx.beginPath();ctx.arc(p.x,p.y,Math.max(.9,2.1*scale),0,tau);ctx.fill();
    }
    // Faint drifting particles resonate near the helix, not over the text block.
    for(const star of stars){
      const u=(star.u + time*.008*star.drift)%1;
      const base=helix(u,Math.floor(star.phase)>3?1:0,spin);
      const q=star.phase+time*(.22*star.drift);
      const x=base.x+Math.cos(q)*randomless(star.r,24*scale);
      const y=base.y+Math.sin(q)*randomless(star.r,21*scale);
      const alpha=(.06+.17*(1+Math.sin(time*2+star.phase))/2);
      glowDot(x,y,Math.max(3,star.r*3*scale),star.hue==='violet'?'190,119,255':'91,216,255',alpha);
    }
    ctx.restore();
  }
  function randomless(seed,range) {return 3 + seed*range*.19;}
  function draw(now){
    if(!running) return;
    raf=requestAnimationFrame(draw);
    const frameMs = window.innerWidth<750 ? 45 : 33;
    if(now-last < frameMs) return;
    const dt=lastTick? Math.min(.09,(now-lastTick)/1000) : 0;
    last=now;lastTick=now;elapsed+=dt;
    render(elapsed);
  }
  function pause(){
    running=false;if(raf)cancelAnimationFrame(raf);raf=0;last=0;lastTick=0;
  }
  function sync(){
    if(reduced.matches){pause();render(0);return;}
    if(!document.hidden && visible && !running){running=true;raf=requestAnimationFrame(draw);}
    if((document.hidden||!visible)&&running)pause();
  }
  let pending=0;
  window.addEventListener('resize',()=>{if(pending)return;pending=requestAnimationFrame(()=>{
    pending=0;resize();render(elapsed);
  });},{passive:true});
  document.addEventListener('visibilitychange',sync);
  if('IntersectionObserver' in window){
    new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();},{threshold:0}).observe(hero);
  }
  if(reduced.addEventListener)reduced.addEventListener('change',sync);
  else if(reduced.addListener)reduced.addListener(sync);
  resize();render(0);sync();
})();