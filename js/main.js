// ── CURSOR ──────────────────────────────────────────────────────
const cur = document.getElementById('cur');
const curR = document.getElementById('cur-ring');
let mx=window.innerWidth/2, my=window.innerHeight/2, rx=mx, ry=my, curVis=false;

document.addEventListener('mousemove', e => {
  mx=e.clientX; my=e.clientY;
  if(!curVis){ curVis=true; cur.style.opacity='1'; curR.style.opacity='1'; }
});
document.addEventListener('mouseleave', ()=>{ cur.style.opacity='0'; curR.style.opacity='0'; });
document.addEventListener('mouseenter', ()=>{ if(curVis){ cur.style.opacity='1'; curR.style.opacity='1'; } });

(function animCur(){
  cur.style.left=mx+'px'; cur.style.top=my+'px';
  rx+=(mx-rx)*.13; ry+=(my-ry)*.13;
  curR.style.left=rx+'px'; curR.style.top=ry+'px';
  requestAnimationFrame(animCur);
})();

document.querySelectorAll('a,button,.a-card,.v-card,.t-card,.pain-item,.cred-item').forEach(el=>{
  el.addEventListener('mouseenter',()=>{
    cur.style.width='18px'; cur.style.height='18px'; cur.style.background='#00ffaa';
    curR.style.width='52px'; curR.style.height='52px';
  });
  el.addEventListener('mouseleave',()=>{
    cur.style.width='10px'; cur.style.height='10px'; cur.style.background='var(--green)';
    curR.style.width='36px'; curR.style.height='36px';
  });
});

// ── CANVAS VORTEX ───────────────────────────────────────────────
const cv = document.getElementById('vortex-canvas');
const cx2 = cv.getContext('2d');
let W, H, pts=[];
function resize(){ W=cv.width=window.innerWidth; H=cv.height=window.innerHeight; }
resize(); window.addEventListener('resize', resize);

class Pt{
  constructor(){ this.reset(); }
  reset(){
    this.a=Math.random()*Math.PI*2;
    this.r=80+Math.random()*Math.min(W,H)*.38;
    this.spd=(0.0008+Math.random()*.0025)*(Math.random()>.5?1:-1);
    this.sz=0.5+Math.random()*1.4;
    this.al=0.15+Math.random()*.5;
    this.hue=Math.random()>.7?160:195;
  }
  update(){
    this.a+=this.spd;
    this.r+=(Math.random()-.5)*.25;
    if(this.r<50||this.r>Math.min(W,H)*.55) this.spd*=-1;
    this.x=W/2+Math.cos(this.a)*this.r;
    this.y=H/2+Math.sin(this.a)*this.r;
  }
  draw(){
    cx2.beginPath(); cx2.arc(this.x,this.y,this.sz,0,Math.PI*2);
    cx2.fillStyle=`hsla(${this.hue},100%,62%,${this.al})`; cx2.fill();
  }
}
for(let i=0;i<200;i++) pts.push(new Pt());

(function loop(){
  cx2.fillStyle='rgba(8,10,15,0.2)'; cx2.fillRect(0,0,W,H);
  pts.forEach(p=>{ p.update(); p.draw(); });
  for(let i=0;i<pts.length;i++) for(let j=i+1;j<pts.length;j++){
    const dx=pts[i].x-pts[j].x, dy=pts[i].y-pts[j].y, d=Math.sqrt(dx*dx+dy*dy);
    if(d<75){
      cx2.beginPath(); cx2.moveTo(pts[i].x,pts[i].y); cx2.lineTo(pts[j].x,pts[j].y);
      cx2.strokeStyle=`rgba(0,255,136,${0.07*(1-d/75)})`; cx2.lineWidth=.5; cx2.stroke();
    }
  }
  requestAnimationFrame(loop);
})();