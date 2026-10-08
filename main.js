const C=document.getElementById("canvas"),X=C.getContext("2d");
const T=document.getElementById("text"),A=document.getElementById("action"),V=document.getElementById("veil");
let W=innerWidth,H=innerHeight,D=devicePixelRatio||1,started=false,scene=0,t0=0;
let particles=[],stars=[],arrows=[],bursts=[],rings=[],lines=[],shards=[],waves=[],orbiters=[];
let pointer={x:0,y:0,down:false};
let clickResolve=null, raf=0, last=performance.now();

function resize(){
  W=innerWidth;H=innerHeight;D=Math.min(devicePixelRatio||1,2);
  C.width=W*D;C.height=H*D;X.setTransform(D,0,0,D,0,0);
}
addEventListener("resize",resize);resize();

const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const rnd=(a,b)=>a+Math.random()*(b-a);
const pick=a=>a[(Math.random()*a.length)|0];
function rgba(hex,a){
  const n=parseInt(hex.slice(1),16);
  return `rgba(${n>>16},${(n>>8)&255},${n&255},${a})`;
}
function clearAll(){
  particles=[];stars=[];arrows=[];bursts=[];rings=[];lines=[];shards=[];waves=[];orbiters=[];
}
function fadeText(s="",small=false,glitch=false){
  T.classList.toggle("small",small);T.classList.toggle("glitch",glitch);
  T.style.opacity=0;
  setTimeout(()=>{T.textContent=s;T.style.opacity=s?1:0},260);
}
async function say(s,ms=2300,opt={}){
  fadeText(s,!!opt.small,!!opt.glitch);
  await sleep(ms);
}
function waitClick(label="продолжить"){
  return new Promise(resolve=>{
    clickResolve=resolve;
    showAction(label);
  });
}
function burst(x,y,color="#fff",count=90,power=4){
  for(let i=0;i<count;i++){
    const a=Math.random()*Math.PI*2,s=rnd(.5,power);
    bursts.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,r:rnd(.7,2.8),life:rnd(.7,1.7),max:1,c:color});
  }
}
function makeField(n,colors){
  particles=Array.from({length:n},()=>({
    x:rnd(0,W),y:rnd(0,H),vx:rnd(-.35,.35),vy:rnd(-.35,.35),
    r:rnd(.7,2.1),c:pick(colors),a:rnd(.35,.9),phase:rnd(0,7)
  }));
}
function constellation(n=130){
  stars=Array.from({length:n},()=>({x:rnd(.06,.94)*W,y:rnd(.08,.9)*H,r:rnd(.5,1.7),p:rnd(0,6.28)}));
}
function arrowField(n=28){
  arrows=Array.from({length:n},()=>({x:rnd(-W,W),y:rnd(0,H),a:rnd(0,6.28),s:rnd(.7,2),curve:rnd(.002,.008),c:pick(["#55aaff","#9d7cff","#ffffff","#5ff0c0","#ffbd5a"])}));
}
function heartPoint(i,n,scale=1){
  const t=(i/n)*Math.PI*2;
  const x=16*Math.pow(Math.sin(t),3);
  const y=-(13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t));
  return {x:W/2+x*scale,y:H/2+y*scale};
}
function heartTargets(n,scale){
  const a=[];
  for(let i=0;i<n;i++){
    const p=heartPoint(i,n,scale);
    const jitter=rnd(-2.5,2.5);
    a.push({x:p.x+jitter,y:p.y+jitter});
  }
  return a;
}
function drawBg(){
  X.fillStyle="#050507";X.fillRect(0,0,W,H);
}
function draw(){
  drawBg();
  const now=performance.now(),dt=Math.min((now-last)/16.67,2);last=now;
  if(scene===1)drawOpening(now);
  if(scene===2)drawQuestion(now);
  if(scene===3)drawColor(now);
  if(scene===4)drawArrows(now,dt);
  if(scene===5)drawParticles(now,dt);
  if(scene===6)drawLoader(now);
  if(scene===7)drawGeometry(now,dt);
  if(scene===8)drawConstellation(now,dt);
  if(scene===9)drawPicture(now,dt);
  if(scene===10)drawGlitch(now,dt);
  if(scene===11)drawRecovery(now,dt);
  if(scene===12)drawGrid(now);
  if(scene===13)drawQuiet(now);
  if(scene===14)drawAnomaly(now,dt);
  if(scene===15)drawPink(now,dt);
  if(scene===16)drawConvergence(now,dt);
  if(scene===17)drawCollapse(now,dt);
  if(scene===18)drawAssembly(now,dt);
  if(scene===19)drawHeart(now,dt);
  if(scene===20)drawPortrait(now,dt);
  if(scene===21)drawFinalQuiet(now,dt);
  for(const b of bursts){
    b.x+=b.vx*dt;b.y+=b.vy*dt;b.vx*=.985;b.vy*=.985;b.life-=.012*dt;
    if(b.life>0){X.globalAlpha=clamp(b.life,0,1);X.fillStyle=b.c;X.beginPath();X.arc(b.x,b.y,b.r,0,7);X.fill();}
  }
  X.globalAlpha=1;
  bursts=bursts.filter(b=>b.life>0);
  raf=requestAnimationFrame(draw);
}
function drawOpening(now){
  const p=Math.min(1,(now-t0)/7000),x=W/2,y=H/2;
  const rr=3+p*Math.min(W,H)*.24;
  X.strokeStyle=`rgba(255,255,255,${.08+.25*(1-p)})`;X.lineWidth=1;
  X.beginPath();X.arc(x,y,rr,0,7);X.stroke();
  for(let i=0;i<90;i++){
    const a=i*.7+p*3,r=(i/90)*rr;
    X.fillStyle=`rgba(150,190,255,${.18*(1-p)})`;
    X.fillRect(x+Math.cos(a)*r,y+Math.sin(a)*r,1.5,1.5);
  }
  X.fillStyle="#fff";X.shadowBlur=22;X.shadowColor="#fff";X.beginPath();X.arc(x,y,2.2,0,7);X.fill();X.shadowBlur=0;
}
function drawQuestion(now){
  const p=(now-t0)/1000;
  for(let i=0;i<140;i++){
    const a=i*.53+p*.2,r=(i%17)*Math.min(W,H)/45;
    X.fillStyle=`hsla(${(i*29)%360},80%,70%,.4)`;
    X.fillRect(W/2+Math.cos(a)*r,H/2+Math.sin(a)*r,1.5,1.5);
  }
}
function drawColor(now){
  const p=(now-t0)/1000;
  for(let i=0;i<260;i++){
    const a=i*.31+p*.8,r=20+(i%31)*Math.min(W,H)/34;
    const x=W/2+Math.cos(a)*r,y=H/2+Math.sin(a*1.13)*r*.62;
    X.fillStyle=`hsla(${(i*17+p*35)%360},90%,65%,.65)`;
    X.shadowBlur=12;X.shadowColor=X.fillStyle;X.beginPath();X.arc(x,y,rnd(.7,2.4),0,7);X.fill();
  }
  X.shadowBlur=0;
}
function drawArrows(now,dt){
  for(const a of arrows){
    a.a+=Math.sin(now*.0005+a.y)*.004;
    a.x+=Math.cos(a.a)*a.s*dt;a.y+=Math.sin(a.a)*a.s*dt;
    if(a.x>W+40)a.x=-40;if(a.x<-40)a.x=W+40;if(a.y>H+40)a.y=-40;if(a.y<-40)a.y=H+40;
    X.save();X.translate(a.x,a.y);X.rotate(a.a);
    X.strokeStyle=rgba(a.c,.7);X.lineWidth=1.4;X.beginPath();X.moveTo(-12,0);X.lineTo(12,0);X.lineTo(5,-6);X.moveTo(12,0);X.lineTo(5,6);X.stroke();X.restore();
  }
  for(let i=0;i<9;i++){
    const r=Math.min(W,H)*(.1+i*.07),a=now*.00035*(i%2?1:-1);
    X.strokeStyle=`rgba(120,150,255,${.12-i*.009})`;X.beginPath();X.arc(W/2,H/2,r,a,a+1.1);X.stroke();
  }
}
function drawParticles(now,dt){
  for(const p of particles){
    p.x+=p.vx*dt;p.y+=p.vy*dt;
    if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1;
    const dx=pointer.x-p.x,dy=pointer.y-p.y,d=Math.hypot(dx,dy);
    if(pointer.down&&d<150){p.x-=dx/d*1.7;p.y-=dy/d*1.7}
    X.fillStyle=rgba(p.c,p.a);X.beginPath();X.arc(p.x,p.y,p.r,0,7);X.fill();
  }
  X.lineWidth=.45;
  for(let i=0;i<particles.length;i+=2){
    for(let j=i+1;j<Math.min(i+8,particles.length);j++){
      const a=particles[i],b=particles[j],d=Math.hypot(a.x-b.x,a.y-b.y);
      if(d<75){X.strokeStyle=`rgba(130,150,190,${.13*(1-d/75)})`;X.beginPath();X.moveTo(a.x,a.y);X.lineTo(b.x,b.y);X.stroke()}
    }
  }
}
function drawLoader(now){
  const p=(now-t0)/1000;
  const x=W/2,y=H/2;
  for(let k=0;k<6;k++){
    const r=30+k*18+Math.sin(p*2+k)*4,a=p*(.8+k*.12)*(k%2?1:-1);
    X.strokeStyle=`hsla(${180+k*28},90%,70%,${.65-k*.07})`;X.lineWidth=1.4;
    X.beginPath();X.arc(x,y,r,a,a+Math.PI*1.55);X.stroke();
  }
  for(let i=0;i<100;i++){
    const a=i*.35+p*1.8,r=80+Math.sin(i)*25;
    X.fillStyle=`hsla(${190+i%100},90%,70%,.55)`;
    X.fillRect(x+Math.cos(a)*r,y+Math.sin(a)*r,2,2);
  }
}
function drawGeometry(now,dt){
  const p=(now-t0)*.0004,cx=W/2,cy=H/2;
  X.save();X.translate(cx,cy);X.rotate(p);
  const s=Math.min(W,H)*.25;
  const pts=[[-s,-s],[s,-s],[s,s],[-s,s]];
  for(let k=0;k<5;k++){
    const q=s*(1-k*.14),alpha=.35-k*.05;
    X.strokeStyle=`hsla(${190+k*30},90%,70%,${alpha})`;X.lineWidth=1;
    X.beginPath();X.rect(-q,-q,q*2,q*2);X.stroke();
  }
  X.strokeStyle="rgba(255,255,255,.35)";X.beginPath();
  X.moveTo(-s,-s);X.lineTo(s,s);X.moveTo(s,-s);X.lineTo(-s,s);X.stroke();
  X.restore();
  for(let i=0;i<80;i++){
    const a=i*.27+p*3,r=s*(.7+((i*13)%10)/20);
    X.fillStyle=`hsla(${200+i*3},80%,70%,.6)`;X.fillRect(cx+Math.cos(a)*r,cy+Math.sin(a)*r,1.5,1.5);
  }
}
function drawConstellation(now,dt){
  const pulse=1+Math.sin(now*.002)*.25;
  for(const s of stars){
    const x=s.x,y=s.y;
    X.fillStyle=`rgba(210,225,255,${.35+.3*Math.sin(now*.001+s.p)})`;
    X.beginPath();X.arc(x,y,s.r*pulse,0,7);X.fill();
  }
  for(let i=0;i<stars.length;i++){
    for(let j=i+1;j<stars.length;j++){
      const a=stars[i],b=stars[j],d=Math.hypot(a.x-b.x,a.y-b.y);
      if(d<105){
        X.strokeStyle=`rgba(100,145,220,${.13*(1-d/105)})`;X.lineWidth=.55;
        X.beginPath();X.moveTo(a.x,a.y);X.lineTo(b.x,b.y);X.stroke();
      }
    }
  }
  const cx=W*.5,cy=H*.52;
  X.strokeStyle="rgba(150,110,255,.18)";X.lineWidth=1;
  X.beginPath();X.arc(cx,cy,Math.min(W,H)*.28+Math.sin(now*.001)*8,0,7);X.stroke();
}
function drawPicture(now,dt){
  const p=(now-t0)*.001,cx=W/2,cy=H/2;
  for(let i=0;i<700;i++){
    const u=i/700,a=i*2.399+p*.35;
    const r=Math.sqrt(u)*Math.min(W,H)*.43;
    const x=cx+Math.cos(a)*r*(.72+.18*Math.sin(a*3+p));
    const y=cy+Math.sin(a*1.7+p*.2)*r*.58;
    const hue=190+90*Math.sin(a*2+p);
    X.fillStyle=`hsla(${hue},85%,65%,.38)`;
    X.fillRect(x,y,1.4,1.4);
  }
  for(let k=0;k<8;k++){
    const rr=50+k*34+Math.sin(p+k)*8;
    X.strokeStyle=`rgba(255,255,255,${.06})`;X.beginPath();X.arc(cx,cy,rr,p+k,p+k+Math.PI*.8);X.stroke();
  }
}
function drawGlitch(now,dt){
  for(let i=0;i<18;i++){
    const y=rnd(0,H),h=rnd(2,20),x=rnd(-30,W),w=rnd(30,W*.55);
    X.fillStyle=`hsla(${(i*43+now*.03)%360},80%,60%,.07)`;
    X.fillRect(x,y,w,h);
  }
  X.strokeStyle="rgba(255,80,110,.25)";
  for(let i=0;i<12;i++){let y=(i+.5)*H/12;X.beginPath();X.moveTo(0,y);X.lineTo(W,y+rnd(-3,3));X.stroke()}
}
function drawRecovery(now,dt){
  if(!stars.length)constellation(110);
  for(const s of stars){
    const pulse=1+Math.sin(now*.001+s.p)*.22;
    X.fillStyle=`rgba(210,225,255,${.28+.28*Math.sin(now*.001+s.p)})`;
    X.beginPath();X.arc(s.x,s.y,s.r*pulse,0,7);X.fill();
  }
  for(let i=0;i<stars.length;i+=2){
    const a=stars[i],b=stars[(i+9)%stars.length];
    if(Math.hypot(a.x-b.x,a.y-b.y)<150){
      X.strokeStyle="rgba(120,160,220,.08)";X.beginPath();X.moveTo(a.x,a.y);X.lineTo(b.x,b.y);X.stroke();
    }
  }
  for(let i=0;i<220;i++){
    const a=i*.4+now*.0004,r=20+i%80*3;
    X.fillStyle=`hsla(${190+i%120},80%,70%,.35)`;X.fillRect(W/2+Math.cos(a)*r,H/2+Math.sin(a)*r,1.5,1.5);
  }
}
function drawGrid(now){
  const gap=Math.max(28,Math.min(W,H)/11),off=(now*.018)%gap;
  X.lineWidth=.5;X.strokeStyle="rgba(120,150,190,.11)";
  for(let x=-gap+off;x<W+gap;x+=gap){X.beginPath();X.moveTo(x,0);X.lineTo(x,H);X.stroke()}
  for(let y=-gap+off;y<H+gap;y+=gap){X.beginPath();X.moveTo(0,y);X.lineTo(W,y);X.stroke()}
}
function drawQuiet(now){
  const r=Math.min(W,H)*.045+Math.sin(now*.001)*3;
  X.shadowBlur=25;X.shadowColor="#fff";X.fillStyle="#fff";X.beginPath();X.arc(W/2,H/2,rnd(1.5,3),0,7);X.fill();X.shadowBlur=0;
  X.strokeStyle="rgba(255,255,255,.08)";X.beginPath();X.arc(W/2,H/2,r,0,7);X.stroke();
}
function drawAnomaly(now,dt){
  for(let i=0;i<260;i++){
    const a=i*.51+now*.00015,r=(i%100)*Math.min(W,H)/130;
    X.fillStyle=i<8?"rgba(255,90,190,.95)":`rgba(100,150,190,${.18})`;
    X.fillRect(W/2+Math.cos(a)*r,H/2+Math.sin(a)*r,1.5,1.5);
  }
  const p=Math.min(1,(now-t0)/9000);
  X.shadowBlur=35;X.shadowColor="#ff59bd";X.fillStyle=`rgba(255,80,190,${.5+.4*Math.sin(now*.003)})`;
  X.beginPath();X.arc(W/2,H/2,2+p*7,0,7);X.fill();X.shadowBlur=0;
}
function drawPink(now,dt){
  const p=(now-t0)/1000;
  for(let i=0;i<900;i++){
    const a=i*.37+p*.18,r=(i%180)*Math.min(W,H)/210;
    const col=i%7===0?"#ff62c1":(i%3===0?"#b36cff":"#62a8ff");
    X.fillStyle=rgba(col,.34+.15*Math.sin(i+p));
    X.fillRect(W/2+Math.cos(a)*r,H/2+Math.sin(a*1.11)*r*.7,1.7,1.7);
  }
  X.shadowBlur=50;X.shadowColor="#ff62c1";X.fillStyle="#ff62c1";X.beginPath();X.arc(W/2,H/2,5+Math.sin(p*3)*2,0,7);X.fill();X.shadowBlur=0;
}
function drawConvergence(now,dt){
  const p=Math.min(1,(now-t0)/15000),cx=W/2,cy=H/2;
  for(let i=0;i<1000;i++){
    const a=i*2.399,rx=rnd(.15,.5),x0=cx+Math.cos(a)*W*.6,y0=cy+Math.sin(a)*H*.6;
    const x=x0*(1-p)+cx*p,y=y0*(1-p)+cy*p;
    X.fillStyle=`hsla(${300+i%60},90%,70%,${.18+.5*p})`;X.fillRect(x,y,1.8,1.8);
  }
  for(let k=0;k<7;k++){
    const r=Math.min(W,H)*(.05+k*.065)*(1-p);
    X.strokeStyle=`rgba(255,90,190,${.15*(1-p)})`;X.beginPath();X.arc(cx,cy,r,0,7);X.stroke();
  }
}
function drawCollapse(now,dt){
  const p=(now-t0)/1000;
  for(let i=0;i<500;i++){
    const a=i*1.9+p*2,r=10+(i%70)*4;
    X.fillStyle=`rgba(255,90,190,${Math.max(0,.5-p*.12)})`;
    X.fillRect(W/2+Math.cos(a)*r,H/2+Math.sin(a)*r,1.5,1.5);
  }
}
let assembly=[],heartFinal=[],portraitFinal=[],portraitReady=false;
function initAssembly(){
  const n=1500,s=Math.min(W,H)*.022;
  const targets=heartTargets(n,s);
  assembly=targets.map(t=>({x:rnd(0,W),y:rnd(0,H),tx:t.x,ty:t.y,r:rnd(.7,2),c:pick(["#ff5fbd","#ff86ce","#c46bff","#fff","#9a78ff"]),seed:rnd(0,9)}));
}
function drawAssembly(now,dt){
  if(!assembly.length)initAssembly();
  const p=clamp((now-t0)/17000,0,1),e=p*p*(3-2*p);
  for(const q of assembly){
    q.x+=(q.tx-q.x)*.018*dt*clamp(p*1.8,0,1);
    q.y+=(q.ty-q.y)*.018*dt*clamp(p*1.8,0,1);
    X.fillStyle=rgba(q.c,.25+.7*e);X.beginPath();X.arc(q.x,q.y,q.r*(.7+e),0,7);X.fill();
  }
  for(let i=0;i<assembly.length;i+=7){
    const a=assembly[i],b=assembly[(i+7)%assembly.length];
    if(Math.hypot(a.x-b.x,a.y-b.y)<55){
      X.strokeStyle=`rgba(255,105,195,${.10+.18*e})`;X.lineWidth=.5;X.beginPath();X.moveTo(a.x,a.y);X.lineTo(b.x,b.y);X.stroke();
    }
  }
}
function drawHeart(now,dt){
  if(!heartFinal.length)heartFinal=heartTargets(2200,Math.min(W,H)*.023);
  const p=now*.001,cx=W/2,cy=H/2;
  for(let k=0;k<16;k++){
    const r=Math.min(W,H)*(.16+k*.035)+Math.sin(p*.8+k)*7;
    X.strokeStyle=`rgba(255,70,185,${.025+(15-k)*.003})`;X.lineWidth=1;
    X.beginPath();X.arc(cx,cy,r,p+k*.4,p+k*.4+Math.PI*(.65+.08*Math.sin(k)));X.stroke();
  }
  for(let i=0;i<heartFinal.length;i++){
    const q=heartFinal[i],j=(i+Math.floor(Math.sin(i)*4)+heartFinal.length)%heartFinal.length;
    const tw=.45+.35*Math.sin(p*3+i*.11);
    X.fillStyle=`rgba(255,${80+((i*17)%90)},${175+((i*7)%70)},${tw})`;
    X.shadowBlur=i%17===0?18:5;X.shadowColor="#ff54b8";
    X.beginPath();X.arc(q.x,q.y,(i%13===0?2.4:1.1)*(1+.18*Math.sin(p*4+i)),0,7);X.fill();
    if(i%5===0){
      const b=heartFinal[j];X.shadowBlur=0;X.strokeStyle="rgba(255,110,200,.12)";
      X.beginPath();X.moveTo(q.x,q.y);X.lineTo(b.x,b.y);X.stroke();
    }
  }
  X.shadowBlur=0;
  for(let i=0;i<45;i++){
    const a=i*.77+p*.7,r=Math.min(W,H)*(.26+rnd(0,.16));
    const x=cx+Math.cos(a)*r,y=cy+Math.sin(a)*r;
    X.fillStyle="rgba(255,120,210,.7)";X.beginPath();X.arc(x,y,1.4,0,7);X.fill();
  }
}
async function scene1(){
  scene=1;t0=performance.now();clearAll();
  await sleep(1600);
  await say("система запускается.",2200,{small:true});
  await say("инициализация.",2200,{small:true});
  await say("неизвестный пользователь обнаружен.",2500,{small:true});
  await waitClick("войти");
  await scene2();
}
async function scene2(){
  scene=2;t0=performance.now();clearAll();
  await say("зачем ты здесь?",2600);
  await waitClick("ответить");
  burst(W/2,H/2,"#fff",180,6);
  await say("интересно.",2200,{small:true});
  await waitClick("дальше");
  await scene3();
}
async function scene3(){
  scene=3;t0=performance.now();clearAll();
  await say("проверка цвета.",2100,{small:true});
  await say("если смешать всё сразу,",2200,{small:true});
  await say("что останется?",2300);
  await waitClick("наблюдать");
  await sleep(1800);burst(W/2,H/2,"#72b8ff",280,7);
  await sleep(1800);await scene4();
}
async function scene4(){
  scene=4;t0=performance.now();clearAll();arrowField(34);
  await say("направление найдено.",2300,{small:true});
  await say("или мне так кажется.",2500,{small:true});
  await waitClick("заметить");
  for(let i=0;i<3;i++){burst(rnd(W*.2,W*.8),rnd(H*.2,H*.8),pick(["#55aaff","#a66cff","#ffd45a"]),90,4);await sleep(900)}
  await scene5();
}
async function scene5(){
  scene=5;t0=performance.now();clearAll();
  makeField(420,["#5aaeff","#7b75ff","#61e0b7","#ffd05e","#ffffff"]);
  await say("теперь просто смотри.",2600);
  await say("ты всегда нажимаешь на всё подряд?",2600);
  await waitClick("прикоснуться");
  await sleep(1600);
  await say("они реагируют.",2100,{small:true});
  await waitClick("ещё");
  await scene6();
}
async function scene6(){
  scene=6;t0=performance.now();clearAll();
  await say("слишком много точек.",2100,{small:true});
  await say("соберу их.",2200,{small:true});
  await waitClick("собрать");
  await sleep(6500);
  burst(W/2,H/2,"#9fe8ff",500,8);
  await sleep(2200);await scene7();
}
async function scene7(){
  scene=7;t0=performance.now();clearAll();
  await say("точки становятся линиями.",2400);
  await sleep(2500);
  await say("линии становятся формой.",2400);
  await waitClick("повернуть");
  await sleep(6500);
  await scene8();
}
async function scene8(){
  scene=8;t0=performance.now();clearAll();const qs=[
    "ты доверяешь незнакомым системам?",
    "а если система знает о тебе больше, чем должна?",
    "что ты ожидаешь увидеть?",
    "ты бы продолжила, если бы я попросила не продолжать?"
  ];
  for(const q of qs){
    await say(q,2200);
    await waitClick("ответить");
    burst(rnd(W*.2,W*.8),rnd(H*.2,H*.8),pick(["#72bfff","#b879ff","#6ff0bb","#ffd45f"]),70,3.5);
    await sleep(1500);
  }
  await scene9();
}
async function scene9(){
  scene=9;t0=performance.now();clearAll();
  await say("попробуем нарисовать что-нибудь.",2600,{small:true});
  await sleep(7500);
  await say("не похоже ни на что.",2300,{small:true});
  await waitClick("продолжить");
  await scene10();
}
async function scene10(){
  scene=10;t0=performance.now();clearAll();
  await say("подожди.",1900,{glitch:true});
  await say("что-то не так.",2200,{glitch:true});
  await sleep(3500);
  await say("ты это тоже видишь?",2300);
  await waitClick("да");
  burst(W/2,H/2,"#ff5677",320,8);
  await sleep(2300);await scene11();
}
async function scene11(){
  scene=11;t0=performance.now();clearAll();
  await say("восстановление.",2300,{small:true});
  await sleep(7000);
  await say("неважно.",2100);
  await waitClick("идти дальше");
  await scene12();
}
async function scene12(){
  scene=12;t0=performance.now();clearAll();
  await say("пустое пространство.",2500,{small:true});
  await sleep(4200);
  await say("иногда в нём проще заметить лишнее.",3000,{small:true});
  await waitClick("смотреть");
  await scene13();
}
async function scene13(){
  scene=13;t0=performance.now();clearAll();
  await say("что ты видишь, когда вокруг почти ничего нет?",3300);
  await sleep(2500);
  await say("не отвечай.",2300,{small:true});
  await waitClick("дальше");
  await scene14();
}
async function scene14(){
  scene=14;t0=performance.now();clearAll();
  await say("неизвестный сигнал.",2700,{small:true});
  await sleep(4200);
  await say("я такого не добавляла.",2700);
  await waitClick("проверить");
  await sleep(3000);await scene15();
}
async function scene15(){
  scene=15;t0=performance.now();clearAll();
  await say("он становится сильнее.",3000,{small:true});
  await sleep(5500);
  await say("почему всё становится розовым?",3300);
  await waitClick("продолжить");
  await sleep(1800);
  await scene16();
}
async function scene16(){
  scene=16;t0=performance.now();clearAll();
  await say("почему всё собирается?",3000);
  await sleep(3800);
  await say("я этого не просила.",2800);
  await waitClick("не вмешиваться");
  await sleep(2500);await scene17();
}
async function scene17(){
  scene=17;t0=performance.now();clearAll();
  await say("СТОП.",1600,{glitch:true});
  burst(W/2,H/2,"#ff4fae",650,11);
  await sleep(2600);
  await say("что ты делаешь?",2300);
  await sleep(1800);
  clearAll();await say("...",2200,{small:true});
  await waitClick("ещё раз");
  await scene18();
}
async function scene18(){
  scene=18;t0=performance.now();clearAll();assembly=[];
  await say("теперь медленно.",2400,{small:true});
  await sleep(10500);
  await say("почти.",2300,{small:true});
  await sleep(3500);
  await say("...",1900,{small:true});
  await waitClick("посмотреть");
  await scene19();
}
function makePortraitTargets(){
  const data=window.PORTRAIT_DATA;

  if(!data || !data.points || !data.points.length){
    console.warn("PORTRAIT_DATA не найден");
    return [];
  }

  const maxW=W*.94;
  const maxH=H*.58;
  const ratio=data.width/data.height;

  let pw=maxW;
  let ph=pw/ratio;

  if(ph>maxH){
    ph=maxH;
    pw=ph*ratio;
  }

  const left=(W-pw)/2;
  const top=H*.49-ph/2;

  return data.points.map(p=>({
    x:left+p.x*pw,
    y:top+p.y*ph,

    // настоящий цвет исходной фотографии
    r:p.r,
    g:p.g,
    b:p.b,

    brightness:p.brightness ?? .5,

    // откуда прилетит частица
    sx:rnd(0,W),
    sy:rnd(0,H),

    size:.6+(1-(p.brightness ?? .5))*1.5
  }));
}
function drawPortrait(now,dt){
  if(!portraitFinal.length){
    portraitFinal=makePortraitTargets();
  }

  if(!portraitFinal.length)return;

  // 15.5 секунд на полное формирование фотографии
  const p=clamp((now-t0)/15500,0,1);

  // плавное движение частиц
  const e=p*p*(3-2*p);

  const pulse=1+Math.sin(now*.0025)*.025;

  for(let i=0;i<portraitFinal.length;i++){
    const q=portraitFinal[i];

    const px=q.sx+(q.x-q.sx)*e;
    const py=q.sy+(q.y-q.sy)*e;

    const alpha=.04+.96*e;
    const radius=q.size*pulse;

    // ИМЕННО ЦВЕТ ФОТОГРАФИИ
    X.fillStyle=`rgba(${q.r},${q.g},${q.b},${alpha})`;

    X.shadowBlur=i%41===0?4:0;
    X.shadowColor=`rgba(${q.r},${q.g},${q.b},.28)`;

    X.beginPath();
    X.arc(px,py,radius,0,Math.PI*2);
    X.fill();

    // редкие тонкие связи между частицами
    if(i%28===0 && e>.32){
      const b=portraitFinal[(i+1)%portraitFinal.length];

      const bx=b.sx+(b.x-b.sx)*e;
      const by=b.sy+(b.y-b.sy)*e;

      X.shadowBlur=0;
      X.strokeStyle=`rgba(${q.r},${q.g},${q.b},${.028*e})`;
      X.lineWidth=.3;

      X.beginPath();
      X.moveTo(px,py);
      X.lineTo(bx,by);
      X.stroke();
    }
  }

  X.shadowBlur=0;

  // лёгкое свечение вокруг уже собранного портрета
  if(e>.82){
    const glow=(e-.82)/.18;

    X.strokeStyle=`rgba(255,105,200,${.025*glow})`;
    X.lineWidth=1;

    X.beginPath();
    X.ellipse(
      W/2,
      H*.49,
      Math.min(W,H)*.43,
      Math.min(W,H)*.25,
      0,
      0,
      Math.PI*2
    );
    X.stroke();
  }
}
function drawFinalQuiet(now,dt){
  const p=(now-t0)/1000;
  const alpha=Math.max(0,.12-p*.025);

  if(alpha<=0)return;

  X.fillStyle=`rgba(255,105,200,${alpha})`;
  X.shadowBlur=12;
  X.shadowColor="rgba(255,105,200,.3)";

  X.beginPath();
  X.arc(
    W/2,
    H*.52,
    1.5+Math.sin(now*.003),
    0,
    Math.PI*2
  );
  X.fill();

  X.shadowBlur=0;
}
async function scene20(){
  scene=20;t0=performance.now();clearAll();portraitFinal=[];
  fadeText("",false);
  await sleep(3200);
  await say("...",1800,{small:true});
  await sleep(11000);
  await say("я хотела оставить тебе ещё кое-что.",3600,{small:true});
  await sleep(1800);
  fadeText("моя жизнь не праздник,\nно ты стала моим подарком",false);
  T.classList.add("final-message");
  await sleep(6500);
  await waitClick("ЗАВЕРШИТЬ");
  await scene21();
}
async function scene21(){
  scene=21;
  t0=performance.now();

  T.classList.remove("final-message");
  fadeText("...",true);
  hideAction();

  // Берём уже собранный портрет
  const source=portraitFinal.length
    ? portraitFinal
    : makePortraitTargets();

  // Разбираем фотографию обратно на частицы
  const pieces=source.map(q=>({
    x:q.x,
    y:q.y,
    vx:rnd(-2.2,2.2),
    vy:rnd(-2.8,2.8),
    r:rnd(.6,1.9),
    life:1,
    color:`rgb(${q.r},${q.g},${q.b})`
  }));

  // красивый распад портрета
  for(let frame=0;frame<175;frame++){

    for(const q of pieces){
      q.x+=q.vx;
      q.y+=q.vy;

      q.vx*=1.012;
      q.vy*=1.012;

      q.life-=.006;

      if(q.life>0){
        X.fillStyle=q.color;
        X.globalAlpha=q.life*.9;

        X.shadowBlur=2;
        X.shadowColor=q.color;

        X.beginPath();
        X.arc(q.x,q.y,q.r,0,Math.PI*2);
        X.fill();
      }
    }

    X.globalAlpha=1;
    X.shadowBlur=0;

    await sleep(16);
  }

  X.globalAlpha=1;
  X.shadowBlur=0;

  await sleep(900);

  fadeText("вернись в чат.",true);

  await sleep(3500);
}
async function scene19(){
  scene=19;t0=performance.now();clearAll();heartFinal=[];
  fadeText("",false);
  await sleep(2800);
  for(let i=0;i<6;i++){
    burst(W/2,H/2,pick(["#ff55b7","#ff91d4","#c36cff","#ffffff"]),160,5+i*.7);
    await sleep(650);
  }
  await sleep(5200);
  await say("теперь я поняла.",3000);
  await say("зачем ты здесь.",3000);
  await say("это всё было для тебя.",4800);
  await waitClick("смотреть дальше");
  await scene20();
}
draw();

function pointerMove(e){
  const q=e.touches?e.touches[0]:e;
  if(q){pointer.x=q.clientX;pointer.y=q.clientY}
}
addEventListener("pointermove",pointerMove,{passive:true});
addEventListener("pointerdown",e=>{
  pointerMove(e);pointer.down=true;
  if(scene===5)burst(pointer.x,pointer.y,"#8ecaff",35,2.5);
});
addEventListener("pointerup",()=>pointer.down=false);
addEventListener("touchmove",pointerMove,{passive:true});

function hideAction(){
  A.classList.remove("show");
  A.style.pointerEvents="none";
}
function showAction(label){
  A.textContent=label;
  A.setAttribute("aria-label",label);
  A.style.pointerEvents="auto";
  A.classList.add("show");
}

function start(){
  if(started)return;
  started=true;
  hideAction();
  fadeText("",false);
  V.style.opacity=0;
  scene1().catch(err=>{
    console.error("SURPRISE ERROR:",err);
    hideAction();
    T.classList.remove("glitch");
    T.textContent="система остановилась.";
    T.style.opacity=1;
  });
}

function handleActionClick(e){
  e.preventDefault();
  e.stopPropagation();

  if(!started){
    start();
    return;
  }

  if(clickResolve){
    const resolve=clickResolve;
    clickResolve=null;
    hideAction();
    resolve();
  }
}

A.addEventListener("click",handleActionClick);

function showStart(){
  started=false;
  clickResolve=null;
  scene=0;
  clearAll();
  V.style.opacity=1;
  fadeText("система ожидает.",false);
  A.textContent="НАЧАТЬ";
  A.setAttribute("aria-label","НАЧАТЬ");
  A.style.pointerEvents="auto";
  A.classList.remove("show");
  setTimeout(()=>A.classList.add("show"),700);
}

showStart();
