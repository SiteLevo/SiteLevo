/* SiteLevo - delt script: reveal-animationer, mobilmenu, nav-skygge */
(function () {
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

  var nav = document.querySelector('.nav');
  if (nav) {
    var onScroll = function () { nav.classList.toggle('scrolled', window.scrollY > 8); };
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true });
  }

  var toggle = document.querySelector('.nav__toggle');
  var links = document.querySelector('.nav__links');
  if (toggle && links) {
    toggle.addEventListener('click', function () { links.classList.toggle('open'); });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { links.classList.remove('open'); });
    });
  }
})();

/* ---------- Sticky bund-CTA: vises efter hero ---------- */
(function () {
  var sticky = document.querySelector('.sticky-cta');
  if (!sticky) return;
  var top = document.querySelector('.hero-x') || document.querySelector('.page-hero');
  var t = function () {
    var trigger = top ? (top.offsetHeight - 40) : 320;
    sticky.classList.toggle('visible', window.scrollY > trigger);
  };
  t(); window.addEventListener('scroll', t, { passive: true });
  window.addEventListener('resize', t);
})();

/* ---------- Ny hero: selvbyggende browser ---------- */
(function () {
  var hero = document.querySelector('.hero-x');
  if (!hero) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var DOMAINS = ['studiono8.netlify.app','sitelevo-crema.netlify.app','hansenvvs.dk','smiltandklinik.dk','morgenbroed.dk'];
  var scrs = Array.prototype.slice.call(hero.querySelectorAll('.scr'));
  var fills = Array.prototype.slice.call(hero.querySelectorAll('.pfill'));
  var addr = hero.querySelector('#addr');
  var win = hero.querySelector('.bw');
  var DUR = 5200, idx = 0, typeT, advT, curUrl = null;
  if (win) { win.addEventListener('click', function(){ if (curUrl) window.open(curUrl, '_blank', 'noopener'); }); }
  function fillReset(i){ fills.forEach(function(f,k){ f.style.transition='none'; f.style.transform = k<i?'scaleX(1)':'scaleX(0)'; }); }
  function runFill(i,ms){ fills[i].getBoundingClientRect(); fills[i].style.transition='transform '+ms+'ms linear'; fills[i].style.transform='scaleX(1)'; }
  function sheen(i){ var s=scrs[i].querySelector('.sheen'); if(!s) return; s.classList.remove('go'); s.getBoundingClientRect(); s.classList.add('go'); }
  function show(i){
    scrs.forEach(function(s,k){ if(k===i){ s.classList.add('active'); } else { s.classList.remove('active'); s.classList.remove('built'); } });
    curUrl = scrs[i].getAttribute('data-url');
    if (win) win.style.cursor = curUrl ? 'pointer' : 'default';
    fillReset(i); clearInterval(typeT);
    var dom = DOMAINS[i];
    if(reduce){ addr.textContent = dom; scrs[i].classList.add('built'); return; }
    addr.textContent = ''; var j = 0;
    typeT = setInterval(function(){ addr.textContent = dom.slice(0,++j); if(j>=dom.length){ clearInterval(typeT); scrs[i].classList.add('built'); sheen(i); runFill(i, DUR-800); } }, 55);
  }
  function next(){ idx=(idx+1)%scrs.length; show(idx); }
  show(0);
  if(!reduce) advT = setInterval(next, DUR);
  hero.querySelectorAll('.pbar').forEach(function(bar,k){ bar.addEventListener('click', function(){ idx=k; show(idx); clearInterval(advT); if(!reduce) advT=setInterval(next,DUR); }); });
  if(!reduce && win){
    hero.addEventListener('mousemove', function(e){ var r=hero.getBoundingClientRect(); var px=(e.clientX-r.left)/r.width-0.5; var py=(e.clientY-r.top)/r.height-0.5; win.style.transform='perspective(1200px) rotateY('+(px*6)+'deg) rotateX('+(-py*6)+'deg)'; });
    hero.addEventListener('mouseleave', function(){ win.style.transform='perspective(1200px) rotateY(0deg) rotateX(0deg)'; });
  }
})();

/* ---------- Ny "Sådan virker det": skinne + scener ---------- */
(function () {
  var how = document.querySelector('.how-x');
  if (!how) return;
  var steps = Array.prototype.slice.call(how.querySelectorAll('.hstep'));
  var scenes = Array.prototype.slice.call(how.querySelectorAll('.scene'));
  var rail = how.querySelector('.rail');
  var railFill = how.querySelector('.rail__fill');
  var si = 0, stepT;
  function setStep(i){
    si = i;
    steps.forEach(function(s,k){ s.classList.toggle('active', k===i); });
    scenes.forEach(function(s,k){ if(k===i){ s.classList.remove('active'); s.getBoundingClientRect(); s.classList.add('active'); } else { s.classList.remove('active'); } });
    var node = steps[i].querySelector('.hstep__n');
    var rTop = rail.getBoundingClientRect().top;
    var nb = node.getBoundingClientRect();
    railFill.style.height = Math.max(0,(nb.top-rTop)+nb.height/2-18) + 'px';
  }
  function nextStep(){ setStep((si+1)%steps.length); }
  setStep(0);
  stepT = setInterval(nextStep, 4200);
  steps.forEach(function(s,k){ s.addEventListener('click', function(){ setStep(k); clearInterval(stepT); stepT=setInterval(nextStep,4200); }); });
  window.addEventListener('resize', function(){ setStep(si); });
})();

/* ---------- Eksempel-preview: vis PC-version skaleret ned ---------- */
(function () {
  var boxes = Array.prototype.slice.call(document.querySelectorAll('.case-shot'));
  if (!boxes.length) return;
  var DW = 1280;
  function scale(){
    boxes.forEach(function(box){
      var f = box.querySelector('iframe');
      if (!f) return;
      var w = box.clientWidth;
      f.style.width = DW + 'px';
      f.style.height = Math.round(DW * 0.85) + 'px';
      f.style.transform = 'scale(' + (w / DW) + ')';
    });
  }
  scale();
  window.addEventListener('resize', scale);
  boxes.forEach(function(box){
    var f = box.querySelector('iframe');
    if (f) f.addEventListener('load', scale);
  });
})();
