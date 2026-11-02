// NJ Graphix V2 — interactions
const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];

window.addEventListener("load", () => {
  setTimeout(() => { $("#loader")?.classList.add("done"); document.body.classList.remove("loading"); }, 900);
});
document.body.classList.add("loading");
$("#year").textContent = new Date().getFullYear();

// Mobile navigation
const menu = $(".menu-toggle"), nav = $(".nav");
menu.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menu.setAttribute("aria-expanded", open);
});
$$(".nav a").forEach(a => a.addEventListener("click", () => {
  nav.classList.remove("open"); menu.setAttribute("aria-expanded","false");
}));

// Header glass effect
const header = $(".header");
window.addEventListener("scroll", () => header.classList.toggle("scrolled", window.scrollY > 25));

// Scroll reveal
const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if(entry.isIntersecting){ entry.target.classList.add("visible"); observer.unobserve(entry.target); }
}), {threshold:.12});
$$(".reveal").forEach(el => observer.observe(el));

// Portfolio filters
$$(".filter").forEach(btn => btn.addEventListener("click", () => {
  $$(".filter").forEach(b => b.classList.remove("active")); btn.classList.add("active");
  const filter = btn.dataset.filter;
  $$(".project").forEach(card => {
    const show = filter === "all" || card.dataset.category === filter;
    card.style.display = show ? "" : "none";
  });
}));

// Portfolio lightbox
const box = $(".lightbox"), boxImg = $("img", box), boxCaption = $("p", box);
$$(".project").forEach(card => card.addEventListener("click", () => {
  boxImg.src = card.dataset.image; boxImg.alt = card.dataset.title;
  boxCaption.textContent = card.dataset.title; box.classList.add("open"); box.setAttribute("aria-hidden","false");
}));
function closeBox(){box.classList.remove("open");box.setAttribute("aria-hidden","true");boxImg.src="";}
$(".lightbox-close").addEventListener("click",closeBox);
box.addEventListener("click",e=>{if(e.target===box)closeBox();});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeBox();});

// Subtle cursor glow on pointer devices
const glow = $(".cursor-glow");
window.addEventListener("pointermove", e => {
  glow.style.left = e.clientX+"px"; glow.style.top = e.clientY+"px";
});

// Canvas particle field
const canvas = $("#particles"), ctx = canvas.getContext("2d");
let particles = [], width, height, dpr;
function resize(){
  dpr = Math.min(window.devicePixelRatio || 1, 2); width=innerWidth;height=innerHeight;
  canvas.width=width*dpr;canvas.height=height*dpr;canvas.style.width=width+"px";canvas.style.height=height+"px";ctx.setTransform(dpr,0,0,dpr,0,0);
  particles=Array.from({length:Math.min(65,Math.floor(width/18))},()=>({x:Math.random()*width,y:Math.random()*height,vx:(Math.random()-.5)*.22,vy:(Math.random()-.5)*.22,r:Math.random()*1.5+.4}));
}
function draw(){
  ctx.clearRect(0,0,width,height);
  particles.forEach((p,i)=>{p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>width)p.vx*=-1;if(p.y<0||p.y>height)p.vy*=-1;
    ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle="#00f5d4";ctx.globalAlpha=.5;ctx.fill();
    for(let j=i+1;j<particles.length;j++){let q=particles[j],dx=p.x-q.x,dy=p.y-q.y,d=Math.hypot(dx,dy);if(d<105){ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.strokeStyle="#00f5d4";ctx.globalAlpha=(1-d/105)*.09;ctx.stroke();}}
  });ctx.globalAlpha=1;requestAnimationFrame(draw);
}
resize();draw();window.addEventListener("resize",resize);
