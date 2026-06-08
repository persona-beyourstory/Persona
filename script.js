/* CURSOR */
const dot = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mx=0,my=0,rx=0,ry=0;

document.addEventListener('mousemove',e=>{ mx=e.clientX; my=e.clientY; dot.style.left=mx+'px'; dot.style.top=my+'px'; spawnTrail(mx,my); });
(function ar(){ rx+=(mx-rx)*.1; ry+=(my-ry)*.1; ring.style.left=rx+'px'; ring.style.top=ry+'px'; requestAnimationFrame(ar); })();
document.querySelectorAll('a,button,.drop-card,.shirt-swatch').forEach(el=>{
  el.addEventListener('mouseenter',()=>document.body.classList.add('hovering'));
  el.addEventListener('mouseleave',()=>document.body.classList.remove('hovering'));
});

/* TRAIL */
const SHAPES=['✦','★','◆','✧','◈','⬡'];
let lastTrail=0;
function spawnTrail(x,y){
  const now=Date.now(); if(now-lastTrail<65) return; lastTrail=now;
  const p=document.createElement('div');
  p.className='trail-particle';
  const s=7+Math.random()*9;
  p.style.cssText=`left:${x}px;top:${y}px;font-size:${s}px;color:rgba(201,168,76,${.35+Math.random()*.45})`;
  p.textContent=SHAPES[Math.floor(Math.random()*SHAPES.length)];
  document.body.appendChild(p);
  setTimeout(()=>p.remove(),750);
}

/* FOLLOWERS */
const fData=[
  {el:document.getElementById('f1'),x:0,y:0,lag:.052,ox:-42,oy:-36},
  {el:document.getElementById('f2'),x:0,y:0,lag:.038,ox: 38,oy:-28},
  {el:document.getElementById('f3'),x:0,y:0,lag:.028,ox:-30,oy: 40},
  {el:document.getElementById('f4'),x:0,y:0,lag:.065,ox: 45,oy: 32},
];
(function af(){
  fData.forEach(f=>{
    f.x+=(mx+f.ox-f.x)*f.lag;
    f.y+=(my+f.oy-f.y)*f.lag;
    f.el.style.left=f.x+'px';
    f.el.style.top=f.y+'px';
  });
  requestAnimationFrame(af);
})();

/* PARTICLE CANVAS */
const canvas=document.getElementById('particleCanvas');
const ctx=canvas.getContext('2d');
function rz(){ canvas.width=canvas.parentElement.offsetWidth; canvas.height=canvas.parentElement.offsetHeight; }
rz(); window.addEventListener('resize',rz);
const pts=Array.from({length:55},()=>({
  x:Math.random()*1400,y:Math.random()*800,
  r:.4+Math.random()*1.4,vx:(Math.random()-.5)*.28,vy:(Math.random()-.5)*.28,
  a:Math.random(),da:.002+Math.random()*.005
}));
(function dp(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  pts.forEach(p=>{
    p.x+=p.vx; p.y+=p.vy; p.a+=p.da;
    if(p.a>1||p.a<0) p.da*=-1;
    if(p.x<0||p.x>canvas.width) p.vx*=-1;
    if(p.y<0||p.y>canvas.height) p.vy*=-1;
    ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fillStyle=`rgba(201,168,76,${p.a*.48})`; ctx.fill();
  });
  requestAnimationFrame(dp);
})();

/* MANNEQUIN ROTATE */
const m3d=document.getElementById('mannequin-3d');
const mSvg=document.getElementById('mannequin-svg');
const shirtBody=document.getElementById('shirt-body');
const shirtDesign=document.getElementById('shirt-design');
let drag=false,sx=0,angle=0,tAngle=0,vel=0;

m3d.addEventListener('mousedown',e=>{ drag=true; sx=e.clientX; m3d.style.cursor='grabbing'; });
window.addEventListener('mouseup',()=>{ drag=false; m3d.style.cursor='grab'; });
window.addEventListener('mousemove',e=>{
  if(!drag) return;
  const dx=e.clientX-sx; sx=e.clientX; vel=dx; tAngle+=dx*.65;
});
m3d.addEventListener('touchstart',e=>{ drag=true; sx=e.touches[0].clientX; },{passive:true});
window.addEventListener('touchend',()=>{ drag=false; });
window.addEventListener('touchmove',e=>{
  if(!drag) return;
  const dx=e.touches[0].clientX-sx; sx=e.touches[0].clientX; vel=dx; tAngle+=dx*.65;
},{passive:true});

(function am(){
  if(!drag){ vel*=.92; tAngle+=vel; }
  angle+=(tAngle-angle)*.12;
  const rad=angle*Math.PI/180;
  const cosA=Math.cos(rad);
  const scaleX=Math.max(.12,Math.abs(cosA));
  const flip=cosA<0 ? -scaleX : scaleX;
  mSvg.style.transform=`scaleX(${flip})`;
  if(shirtDesign) shirtDesign.style.opacity=scaleX>.38 ? '1':'0';
  requestAnimationFrame(am);
})();

/* SHIRT COLOR */
document.querySelectorAll('.shirt-swatch').forEach(sw=>{
  sw.addEventListener('click',()=>{
    document.querySelectorAll('.shirt-swatch').forEach(s=>s.classList.remove('active'));
    sw.classList.add('active');
    const c=sw.getAttribute('data-color');
    shirtBody.setAttribute('fill',c);
    const lightColors=['#f0dfa0','#c9a84c'];
    const isLight=lightColors.includes(c);
    if(shirtDesign){
      const fill=isLight?'rgba(10,8,0,0.75)':'';
      const stroke=isLight?'rgba(10,8,0,0.5)':'';
      shirtDesign.querySelectorAll('text,polygon,line').forEach(el=>{
        el.style.fill=fill; el.style.stroke=stroke;
      });
    }
  });
});

/* SCROLL REVEAL */
const obs=new IntersectionObserver(es=>es.forEach(e=>{
  if(e.isIntersecting){ e.target.style.opacity='1'; e.target.style.transform='translateY(0)'; }
}),{threshold:.1});
document.querySelectorAll('.step,.drop-card,.about-content,.philosophy blockquote').forEach(el=>{
  el.style.opacity='0'; el.style.transform='translateY(38px)';
  el.style.transition='opacity .7s ease,transform .7s ease';
  obs.observe(el);
});
