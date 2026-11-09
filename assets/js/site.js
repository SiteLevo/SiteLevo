/* sitelevo.com v3 */
(function(){
  var nav=document.querySelector('.nav'), b=nav&&nav.querySelector('.burger');
  if(b){b.addEventListener('click',function(){var o=nav.classList.toggle('open');b.setAttribute('aria-expanded',o?'true':'false');});
    nav.querySelectorAll('.menu a').forEach(function(a){a.addEventListener('click',function(){nav.classList.remove('open');b.setAttribute('aria-expanded','false');});});}
  document.querySelectorAll('.track').forEach(function(t){
    var sec=t.closest('section'), prev=sec.querySelector('.carr--prev'), next=sec.querySelector('.carr--next');
    var cards=[].slice.call(t.children);
    function step(){var c=cards[1]||cards[0];return c?c.offsetLeft-cards[0].offsetLeft:t.clientWidth;}
    function upd(){var i=Math.round(t.scrollLeft/(step()||1));cards.forEach(function(c,k){c.classList.toggle('is-active',k===i);});
      if(prev)prev.disabled=t.scrollLeft<=2; if(next)next.disabled=t.scrollLeft>=t.scrollWidth-t.clientWidth-2;}
    if(prev)prev.addEventListener('click',function(){t.scrollBy({left:-step(),behavior:'smooth'});});
    if(next)next.addEventListener('click',function(){t.scrollBy({left:step(),behavior:'smooth'});});
    t.addEventListener('scroll',function(){window.requestAnimationFrame(upd);},{passive:true}); upd();
  });

  /* TESTUDGAVE (body.fx): kundesider skifter i hero'en, og indhold glider stille frem ved scroll */
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(document.body.classList.contains('fx')){
    var st=document.querySelector('.hero__stage');
    if(st&&!reduce){
      var sl=[].slice.call(st.querySelectorAll('.slide')),cap=document.querySelector('.hero__capt'),i=0,ms=+st.getAttribute('data-rotate')||4500;
      setInterval(function(){ if(document.hidden) return;
        sl[i].classList.remove('is-on'); i=(i+1)%sl.length; sl[i].classList.add('is-on');
        if(cap){cap.style.opacity=0; setTimeout(function(){cap.textContent=sl[i].getAttribute('data-name'); cap.style.opacity=1;},350);}
      },ms);
    }

    if(!reduce&&'IntersectionObserver' in window){
      var groups=[['.hero h1','.hero .lead','.hero .btn--hero','.hero .trust li','.hero__stage','.hero__cap','.hero__img'],
        ['.feat .eyebrow','.feat h2','.feat .sub','.feat .btn'],['.fcard'],['.steps .eyebrow','.steps h2','.steps .badge'],['.step','.arr--step'],['.why h2','.why .sub'],['.stat'],['.incl h2','.incl__list li'],['.compare h2','.cmp'],['.faq--plain .eyebrow','.faq--plain h2'],['.faq__card'],['.tl .eyebrow','.tl h2'],['.tl__item'],['.perk'],['.fcase'],['.clist h2','.clist .sub'],['.ccard'],['.story__img','.story .eyebrow','.story h2','.story__p'],['.team .eyebrow','.team h2'],['.person'],['.kpanel'],['.reach .eyebrow','.reach h2','.reach__list li','.reach__box','.reach__img'],
        ['.value h2','.value .sub'],['.vcard'],['.value .btn--wide'],['.cases h2','.cases .more'],['.case'],
        ['.pricing__intro h2','.pricing__intro .sub','.pricing__intro .btn'],['.plan'],['.plans__note'],['.quotes h2'],['.quote'],['.band']];
      var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{rootMargin:'0px 0px -8% 0px',threshold:.12});
      groups.forEach(function(g){var k=0; g.forEach(function(sel){document.querySelectorAll(sel).forEach(function(el){el.classList.add('rv'); el.style.setProperty('--rd',(k++*90)+'ms'); io.observe(el);});});});
    }
  }
  /* kontakt: formular, valgt pakke og kalender */
  var kf=document.querySelector('.kform');
  if(kf){
    var pk=(new URLSearchParams(location.search).get('pakke')||'').toLowerCase(),
        names={starter:'Starter',pro:'Pro',business:'Business'};
    if(names[pk]){kf.querySelector('[name=pakke]').value=names[pk];
      var ta=kf.querySelector('textarea'); if(ta&&!ta.value) ta.value='Jeg er interesseret i '+names[pk]+'-pakken.';}
    var done=document.querySelector('.kform__done'), err=document.querySelector('.kform__err');
    kf.addEventListener('submit',function(e){
      e.preventDefault(); if(err) err.hidden=true;
      var btn=kf.querySelector('button[type=submit]'); if(btn) btn.disabled=true;
      fetch('/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams(new FormData(kf)).toString()})
        .then(function(r){ if(!r.ok) throw new Error(r.status); kf.hidden=true; if(done){done.hidden=false; done.setAttribute('tabindex','-1'); done.focus();} })
        .catch(function(){ if(err) err.hidden=false; if(btn) btn.disabled=false; });
    });
  }
  var cal=document.querySelector('.kcal');
  if(cal){
    var DAGE=['søndag','mandag','tirsdag','onsdag','torsdag','fredag','lørdag'],
        MDR=['januar','februar','marts','april','maj','juni','juli','august','september','oktober','november','december'];
    var iso=function(d){return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2);};
    var fromIso=function(s){var p=s.split('-');return new Date(+p[0],+p[1]-1,+p[2]);};
    var label=function(ds,tm){var d=fromIso(ds),w=DAGE[d.getDay()];return w.charAt(0).toUpperCase()+w.slice(1)+' d. '+d.getDate()+'. '+MDR[d.getMonth()]+' kl. '+tm;};
    var dayEls=[].slice.call(cal.querySelectorAll('.kcal__day')), timeEls=[].slice.call(cal.querySelectorAll('.kcal__time'));
    var txt=function(el,v){var s=el.querySelector('.t')||el.firstElementChild||el; s.textContent=v;};
    var today=new Date(); today.setHours(0,0,0,0);
    var first=new Date(today); do{first.setDate(first.getDate()+1);}while(first.getDay()===0||first.getDay()===6);
    var mon0=new Date(first); mon0.setDate(mon0.getDate()-((mon0.getDay()+6)%7));
    function dateAt(page,i){var d=new Date(mon0); d.setDate(mon0.getDate()+page*21+Math.floor(i/5)*7+(i%5)); return d;}
    /* uden forbindelse: vis datoer og lad hele kalenderen linke til Google-bookingen */
    dayEls.forEach(function(c,i){var d=dateAt(0,i); txt(c,d.getDate()); c.classList.toggle('is-off',d<first); c.classList.toggle('is-sel',d.getTime()===first.getTime());});
    if(timeEls[0]) timeEls[0].classList.add('is-sel');
    var api=cal.getAttribute('data-api');
    if(api&&window.fetch){
      var S={map:{},page:0,maxPage:1,date:null,tpage:0,time:null,step:'pick'};
      var pick=cal.querySelector('.kcal__pick'), form=cal.querySelector('.kcal__form'), done=cal.querySelector('.kcal__done'),
          err=cal.querySelector('.kcal__err'), cover=cal.querySelector('.kcal__cover'), big=document.querySelector('.kbook'),
          bigTxt=big&&(big.querySelector('.t')||big.querySelector('span')), bigLbl=bigTxt&&bigTxt.textContent;
      var q=function(s){return cal.querySelector(s);};
      function showErr(m){err.textContent=m; err.hidden=!m;}
      function render(){
        dayEls.forEach(function(c,i){var d=dateAt(S.page,i),ds=iso(d),ok=(S.map[ds]||[]).length>0;
          txt(c,d.getDate()); c.disabled=!ok; c.classList.toggle('is-off',!ok); c.classList.toggle('is-sel',ds===S.date);
          c.setAttribute('aria-label',label(ds,'').replace(' kl. ','')+(ok?'':' (optaget)')); c.setAttribute('aria-pressed',ds===S.date?'true':'false'); c.dataset.date=ds;});
        var sl=S.map[S.date]||[], pages=Math.max(1,Math.ceil(sl.length/6));
        if(S.tpage>=pages) S.tpage=pages-1;
        timeEls.forEach(function(c,i){var tm=sl[S.tpage*6+i];
          c.classList.toggle('is-empty',!tm); c.disabled=!tm; if(tm){txt(c,tm); c.dataset.time=tm;}
          c.classList.toggle('is-sel',!!tm&&tm===S.time); c.setAttribute('aria-pressed',tm&&tm===S.time?'true':'false');});
        q('.kcal__prev').disabled=S.page<=0; q('.kcal__next').disabled=S.page>=S.maxPage;
        q('.kcal__tprev').disabled=S.tpage<=0; q('.kcal__tnext').disabled=S.tpage>=pages-1;
      }
      function selDate(ds){S.date=ds; S.tpage=0; S.time=(S.map[ds]||[])[0]||null; render();}
      function firstFree(page){for(var i=0;i<15;i++){var ds=iso(dateAt(page,i)); if((S.map[ds]||[]).length) return ds;} return null;}
      function step(st){S.step=st; pick.hidden=st!=='pick'; form.hidden=st!=='form'; done.hidden=st!=='done';
        if(big){big.hidden=st==='done'; if(bigTxt) bigTxt.textContent=st==='form'?'Bekræft booking':bigLbl;}}
      function load(keep){
        return fetch(api+'?action=slots').then(function(r){return r.json();}).then(function(d){
          if(!d||!d.ok) throw 0; S.map={};
          var last=mon0; d.days.forEach(function(x){S.map[x.date]=x.slots; var dd=fromIso(x.date); if(x.slots.length&&dd>last) last=dd;});
          S.maxPage=Math.max(0,Math.floor((last-mon0)/(21*86400000)));
          if(!keep||!(S.map[S.date]||[]).length){var f=null; for(var p=0;p<=S.maxPage&&!f;p++){f=firstFree(p); if(f) S.page=p;} if(f) selDate(f); else render();}
          else render();
          if(cover) cover.remove(); cover=null; cal.classList.add('is-live');
          [].slice.call(cal.querySelectorAll('button')).forEach(function(b){b.removeAttribute('tabindex');});
        });
      }
      load().then(function(){
        dayEls.forEach(function(c){c.addEventListener('click',function(){if(!c.disabled) selDate(c.dataset.date);});});
        timeEls.forEach(function(c){c.addEventListener('click',function(){if(!c.disabled){S.time=c.dataset.time; render();}});});
        q('.kcal__prev').addEventListener('click',function(){if(S.page>0){S.page--; var f=firstFree(S.page); if(f) selDate(f); else render();}});
        q('.kcal__next').addEventListener('click',function(){if(S.page<S.maxPage){S.page++; var f=firstFree(S.page); if(f) selDate(f); else render();}});
        q('.kcal__tprev').addEventListener('click',function(){S.tpage--; render();});
        q('.kcal__tnext').addEventListener('click',function(){S.tpage++; render();});
        q('.kcal__back').addEventListener('click',function(){showErr(''); step('pick');});
        if(big) big.addEventListener('click',function(e){e.preventDefault();
          if(S.step==='pick'){ if(!S.time){showErr('Vælg et tidspunkt først.'); return;} showErr('');
            q('.kcal__chosen').textContent=label(S.date,S.time); step('form'); var f=form.querySelector('[name=navn]'); if(f) f.focus(); }
          else if(S.step==='form'){ if(form.requestSubmit) form.requestSubmit(); else form.dispatchEvent(new Event('submit',{cancelable:true})); }
        });
        form.addEventListener('submit',function(e){e.preventDefault();
          if(!form.checkValidity()){form.reportValidity(); return;}
          var fd=new FormData(form), body={date:S.date,time:S.time,navn:fd.get('navn'),email:fd.get('email'),telefon:fd.get('telefon'),hp:fd.get('hp')};
          showErr(''); if(big) big.classList.add('is-busy');
          fetch(api,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(body)})
            .then(function(r){return r.json();}).then(function(d){
              if(big) big.classList.remove('is-busy');
              if(d&&d.ok){ q('.kcal__donetxt').textContent='Vi ringer dig op '+label(S.date,S.time).replace(/^./,function(c){return c.toLowerCase();})+' på '+body.telefon+'. Du får en bekræftelse på mail.'; step('done'); done.setAttribute('tabindex','-1'); done.focus(); }
              else if(d&&d.error==='taken'){ step('pick'); load(false).then(function(){showErr('Tiden er lige blevet taget. Vælg en anden.');}); }
              else if(d&&d.error==='invalid'){ showErr('Tjek navn, e-mail og telefonnummer.'); }
              else if(d&&d.error==='limit'){ showErr('Du har lige booket et møde. Skriv til info@sitelevo.com, hvis du vil ændre det.'); }
              else throw 0;
            }).catch(function(){ if(big) big.classList.remove('is-busy'); showErr('Bookingen gik ikke igennem. Prøv igen, eller ring på 33 32 07 19.'); });
        });
      }).catch(function(){ /* behold link til Google-bookingen */ });
    }
  }
})();
