/* SciLand V8 — volumetric DNA and living molecular networks.
   Canvas overlays are generated from 3-D helix geometry and molecular bond graphs.
   The background image remains sharp: NO backdrop blur, no video, no dependency.
*/
(() => {
  'use strict';
  const hero = document.querySelector('.hero');
  const canvas = document.getElementById('dna-helix-canvas');
  if (!hero || !canvas) return;
  const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
  if (!ctx) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const TAU = 2 * Math.PI;
  const IMG_W = 2048, IMG_H = 1152;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const mix = (a,b,t) => a + (b-a)*t;
  const colors = ['100,219,255','195,137,255','121,180,255'];
  let w=0, h=0, scale=1, ox=0, oy=0, dpr=1;
  let active=false, visible=true, raf=0, lastDraw=0, lastTick=0, elapsed=0, resizePending=0;

  // Molecules are anchored in the image coordinate system; they float rather
  // than becoming separate, screen-locked stickers when the hero resizes.
  const molecules = [
    {cx:1140,cy:360,r:59,hue:0,phase:.4,speed:.35,opacity:.67},
    {cx:1465,cy:402,r:69,hue:1,phase:1.9,speed:.27,opacity:.61},
    {cx:1795,cy:341,r:68,hue:0,phase:3.0,speed:.31,opacity:.72},
    {cx:1965,cy:450,r:52,hue:1,phase:4.7,speed:.38,opacity:.58},
    {cx:1242,cy:525,r:39,hue:2,phase:2.8,speed:.20,opacity:.40}
  ];
  const satellites = Array.from({length:34},(_,i)=>({
    u:(i*.618034)%1,
    phi: i*2.399963,
    size:1.0+(i%5)*.27,
    hue:i%4===0?1:0,
    speed:.12+(i%7)*.034
  }));

  function resize(){
    const bounds=hero.getBoundingClientRect();
    w=bounds.width;h=bounds.height;
    if(w<1||h<1)return;
    dpr=Math.min(devicePixelRatio||1,window.innerWidth<1100?1.25:1.55);
    canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
    scale=Math.max(w/IMG_W,h/IMG_H);
    const bgX=window.innerWidth<=580?.61:window.innerWidth<=800?.59:.5;
    ox=(w-IMG_W*scale)*bgX;oy=(h-IMG_H*scale)*.5;
  }
  function at(x,y){return {x:ox+x*scale,y:oy+y*scale};}
  function glow(x,y,r,rgb,opacity){
    if(r<=0||opacity<=0)return;
    const g=ctx.createRadialGradient(x,y,0,x,y,r);
    g.addColorStop(0,`rgba(245,252,255,${opacity*.85})`);
    g.addColorStop(.14,`rgba(${rgb},${opacity*.88})`);
    g.addColorStop(.48,`rgba(${rgb},${opacity*.17})`);
    g.addColorStop(1,`rgba(${rgb},0)`);
    ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();
  }
  function bond(a,b,rgb,alpha,lineWidth=1){
    ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);
    ctx.lineWidth=lineWidth;ctx.lineCap='round';
    ctx.strokeStyle=`rgba(${rgb},${clamp(alpha,0,1)})`;ctx.stroke();
  }
  function sphere(p,r,rgb,alpha){
    glow(p.x,p.y,Math.max(2,r*3.25),rgb,alpha*.54);
    ctx.fillStyle=`rgba(${rgb},${clamp(alpha,0,1)})`;
    ctx.beginPath();ctx.arc(p.x,p.y,Math.max(.5,r),0,TAU);ctx.fill();
    if(r>1.8){ctx.fillStyle=`rgba(244,250,255,${alpha*.62})`;
      ctx.beginPath();ctx.arc(p.x-r*.27,p.y-r*.26,r*.23,0,TAU);ctx.fill();}
  }

  // True 3D parametric double helix: both strands and base-pair geometry
  // are projected on each frame. Not just a flat wiggle or moving dash.
  function helix(u,s,spin){
    const ang=u*2.85*TAU+spin+s*Math.PI;
    const r=(78+10*Math.sin(Math.PI*u))*(.85+.15*Math.sin(Math.PI*u));
    const perp=Math.sin(ang)*r;
    const depth=Math.cos(ang);
    const perspective=1+depth*.08;
    const x=mix(1060,1940,u)-.11*perp*perspective;
    const y=mix(224,126,u)-.994*perp*perspective;
    const p=at(x,y);
    return {x:p.x,y:p.y,z:depth,front:depth>=0};
  }

  function drawMolecules(t){
    // Organic molecular clusters: softly orbiting atom spheres and bond lattices.
    for(let ci=0;ci<molecules.length;ci++){
      const m=molecules[ci];
      const local=t*m.speed+m.phase;
      const cx=m.cx+Math.sin(local*.78)*13,cy=m.cy+Math.cos(local*.58)*12;
      const radius=m.r*(1+.042*Math.sin(local*1.2));
      const rot=.10*Math.sin(local*.43)+local*.085;
      const nodes=[];
      for(let k=0;k<6;k++){
        const a=TAU*k/6+rot;
        nodes.push(at(cx+radius*Math.cos(a),cy+radius*.75*Math.sin(a)));
      }
      const center=at(cx,cy);
      const rgb=colors[m.hue];
      const pulse=.78+.22*Math.sin(local*2.2);
      ctx.save();
      for(let k=0;k<6;k++){
        bond(nodes[k],nodes[(k+1)%6],rgb,.20*m.opacity*pulse,Math.max(.65,1.12*scale));
        if(k%2===0)bond(nodes[k],center,rgb,.13*m.opacity*pulse,Math.max(.6,.85*scale));
      }
      // Floating branches create the impression of continuous molecular assembly.
      for(let k=0;k<3;k++){
        const root=nodes[(k*2+1)%6];
        const a=TAU*(k*2+1)/6+rot;
        const leaf=at(cx+radius*1.54*Math.cos(a),cy+radius*1.24*Math.sin(a));
        bond(root,leaf,k===1?colors[1]:rgb,.21*m.opacity*pulse,Math.max(.6,.94*scale));
        sphere(leaf,Math.max(.7,2.0*scale),k===1?colors[1]:rgb,.48*m.opacity*pulse);
      }
      // An energy packet gently traces one molecular bond.
      const edge=((t*.12+ci*.24)%6),index=Math.floor(edge),fraction=edge-index;
      const aa=nodes[index],bb=nodes[(index+1)%6];
      glow(mix(aa.x,bb.x,fraction),mix(aa.y,bb.y,fraction),14*scale,rgb,.23*m.opacity);
      sphere(center,Math.max(1,2.0*scale),rgb,.35*m.opacity*pulse);
      for(let k=0;k<6;k++)sphere(nodes[k],Math.max(1.15,(2.5+(k%2)) *scale),rgb,.47*m.opacity*pulse);
      ctx.restore();
    }
    // A few very faint threads link molecular clusters across the lab space.
    for(let i=0;i<molecules.length-1;i++){
      const a=molecules[i],b=molecules[i+1];
      if(i===3)continue;
      const p=at(a.cx+Math.sin(t*a.speed+a.phase)*11,a.cy),q=at(b.cx+Math.sin(t*b.speed+b.phase)*11,b.cy);
      bond(p,q,colors[i%2],.055+.035*Math.sin(t*.8+i),Math.max(.55,.75*scale));
    }
  }

  function drawHelix(t){
    const samples=146,spin=t*.32;  // ~19.6 seconds per full axial rotation
    const rail=[[],[]];
    for(let k=0;k<=samples;k++){
      const u=k/samples;
      rail[0].push(helix(u,0,spin));
      rail[1].push(helix(u,1,spin));
    }
    const center=at(1480,188);
    glow(center.x,center.y,145*scale,'96,107,245',.038);
    // Rear rail appears translucent, adding correct cylindrical depth.
    for(let s=0;s<2;s++)for(let k=1;k<=samples;k++){
      const a=rail[s][k-1],b=rail[s][k],z=(a.z+b.z)*.5;
      if(z>=0)continue;
      const rgb=s?colors[1]:colors[0];
      bond(a,b,rgb,.115+.16*(1+z),Math.max(.7,2.5*scale));
    }
    // Rich base-pair details: each rung has short sugar/phosphate connectors,
    // colored pairing ends, and a thin luminous center bridge.
    const rungCount=54;
    for(let k=1;k<rungCount;k++){
      const u=k/rungCount;
      const a=helix(u,0,spin),b=helix(u,1,spin);
      const e1={x:mix(a.x,b.x,.22),y:mix(a.y,b.y,.22)};
      const e2={x:mix(a.x,b.x,.78),y:mix(a.y,b.y,.78)};
      const z=Math.max(a.z,b.z),pulse=.65+.35*Math.sin(t*1.1+u*32);
      bond(a,e1,colors[k%2],.30+.16*pulse,Math.max(.75,1.42*scale));
      bond(e1,e2,'191,220,255',.18+.16*(1+z)/2,Math.max(.68,1.13*scale));
      bond(e2,b,colors[(k+1)%2],.30+.16*pulse,Math.max(.75,1.42*scale));
      // Small base-pair atoms; the ladder has actual substructure up close.
      if(k%2===0){
        sphere(e1,Math.max(1.0,1.78*scale),colors[0],.45*pulse);
        sphere(e2,Math.max(1.0,1.78*scale),colors[1],.45*pulse);
      }
      if(k%6===0){
        const mid={x:mix(a.x,b.x,.5),y:mix(a.y,b.y,.5)};
        glow(mid.x,mid.y,11*scale,'179,171,255',.15*pulse);
      }
    }
    // Front rail has a soft bloom, a colored backbone, and a fine white highlight.
    for(let s=0;s<2;s++)for(let k=1;k<=samples;k++){
      const a=rail[s][k-1],b=rail[s][k],z=(a.z+b.z)*.5;
      if(z<0)continue;
      const rgb=colors[s],intensity=.50+.33*z;
      bond(a,b,rgb,intensity*.12,Math.max(1.5,8*scale));
      bond(a,b,rgb,intensity,Math.max(1.0,(2.8+.8*z)*scale));
      if(k%2===0)bond(a,b,'224,246,255',.18+.23*z,Math.max(.56,.9*scale));
      if(k%6===0)sphere(b,Math.max(1.0,(1.95+.45*z)*scale),rgb,.35+.27*z);
    }
    // Energy packets physically follow the changing 3D helix.
    for(let i=0;i<6;i++){
      const u=(t*(i%2?.046:.067)+i*.185)%1;
      const strand=i%2;
      const p=helix(u,strand,spin),a=.25+.40*(p.z+1)*.5;
      glow(p.x,p.y,(i%3===0?24:14)*scale,colors[strand],a);
      sphere(p,Math.max(.9,1.35*scale),'236,248,255',a*.7);
    }
    // Sparse drifting luminescent particles follow the whole assembly.
    for(const st of satellites){
      const u=(st.u+t*st.speed*.025)%1;
      const p=helix(u,Math.floor(st.phi)%2,spin);
      const q=st.phi+t*(.14+st.speed*.3);
      const x=p.x+Math.cos(q)*(12+11*st.size)*scale;
      const y=p.y+Math.sin(q)*(10+10*st.size)*scale;
      const alpha=.10+.16*(.5+.5*Math.sin(t*1.7+st.phi));
      glow(x,y,st.size*5*scale,colors[st.hue],alpha);
    }
  }

  function render(t){
    if(!w||!h)return;
    ctx.clearRect(0,0,w,h);
    ctx.save();
    drawMolecules(t);
    drawHelix(t);
    ctx.restore();
  }
  function pause(){active=false;if(raf)cancelAnimationFrame(raf);raf=0;lastTick=0;lastDraw=0;}
  function sync(){
    // Keep mobile hero and low-motion accessibility readable and inexpensive.
    if(innerWidth<=800){pause();return;}
    if(reduced.matches){pause();render(0);return;}
    if(!document.hidden&&visible&&!active){active=true;lastTick=0;lastDraw=0;raf=requestAnimationFrame(draw);}
    if((document.hidden||!visible)&&active)pause();
  }
  function draw(now){
    if(!active)return;
    raf=requestAnimationFrame(draw);
    if(now-lastDraw<33)return;  // ~30 fps
    const dt=lastTick?Math.min(.07,(now-lastTick)/1000):0;
    elapsed+=dt;lastDraw=now;lastTick=now;
    render(elapsed);
  }
  addEventListener('resize',()=>{
    if(resizePending)return;
    resizePending=requestAnimationFrame(()=>{resizePending=0;resize();if(innerWidth>800)render(elapsed);sync();});
  },{passive:true});
  document.addEventListener('visibilitychange',sync);
  if('IntersectionObserver' in window){
    new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();},{threshold:0}).observe(hero);
  }
  if(reduced.addEventListener)reduced.addEventListener('change',sync);
  else if(reduced.addListener)reduced.addListener(sync);
  resize();if(innerWidth>800)render(0);sync();
})();