/* ============================================================
   TESTAAJASIVUN ASETUKSET (testaajat/ ja testers/)
   ============================================================ */
const TESTER_URL = 'https://script.google.com/macros/s/AKfycbwDNhQvIeNaigZbrI6iroZY_uQ0hjrruPk45Z2LZq_xE37s-2uujYl5-wvtRnwVQfrqZg/exec';

/* TESTFLIGHT-LINKIT: liitä apin julkinen linkki lainausmerkkeihin, kun appi on testissä.
   Tyhjä = näytetään "Tulossa testiin". */
const TESTFLIGHT = {
  'Bodybreath': 'https://testflight.apple.com/join/sERBssgz',
  'Timepace': 'https://testflight.apple.com/join/TCusjgeE',
  'Blindslide': 'https://testflight.apple.com/join/Vb2TQ2KH',
  'Shapeslide': 'https://testflight.apple.com/join/Bf6YUgBZ'
};

/* Testaajalomake: käyttää samaa TESTER_URL-osoitetta, type=tester */
(function(){
  var MSG = {
    en:{ok:"Thank you! You're on the tester list.", dup:"You're already on the list. I updated your app choices.",
        step1:'1. Install the TestFlight app from the App Store', step2:'2. Tap an app below to start testing', step3:'3. Feedback: screenshot → Share Beta Feedback. Add your email and you get Pro free at launch.', tf:'TestFlight in the App Store →',
        install:'Install in TestFlight', soon:'Coming to testing soon', later:"I'll email you when the rest are ready.",
        bad:'Please check the email address.', none:'Pick at least one app.', err:'Something went wrong. Please try again or email hello@embodyapps.fi.', wait:'Sending…'},
    fi:{ok:'Kiitos! Olet nyt testaajalistalla.', dup:'Olet jo listalla. Päivitin appivalintasi.',
        step1:'1. Asenna TestFlight-appi App Storesta', step2:'2. Napauta alta appia, niin pääset testaamaan', step3:'3. Palaute: kuvakaappaus → Share Beta Feedback. Kirjoita mukaan sähköpostisi, niin saat Pron ilmaiseksi julkaisussa.', tf:'TestFlight App Storessa →',
        install:'Asenna TestFlightissa', soon:'Tulossa testiin pian', later:'Lähetän sähköpostia, kun loput ovat valmiita.',
        bad:'Tarkista sähköpostiosoite.', none:'Valitse vähintään yksi appi.', err:'Jokin meni vikaan. Yritä uudelleen tai lähetä viesti hello@embodyapps.fi.', wait:'Lähetetään…'}
  };
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  document.querySelectorAll('form.tester-form').forEach(function(form){
    form.addEventListener('submit', async function(ev){
      ev.preventDefault();
      var lang = form.closest('main').getAttribute('lang') === 'fi' ? 'fi' : 'en', m = MSG[lang];
      var old = form.querySelector('.notify-err'); if(old) old.remove();
      function err(t){ var e=document.createElement('p'); e.className='notify-err'; e.setAttribute('role','alert'); e.textContent=t; form.appendChild(e); }
      function done(t, chosen){
        var box=document.createElement('div'); box.className='tf-done'; box.setAttribute('role','status');
        var h=document.createElement('p'); h.className='notify-msg'; h.textContent=t; box.appendChild(h);
        var s1=document.createElement('p'); s1.className='tf-step'; s1.innerHTML='<strong></strong> <a target="_blank" rel="noopener" href="https://apps.apple.com/app/testflight/id899247664"></a>';
        s1.querySelector('strong').textContent=m.step1; s1.querySelector('a').textContent=m.tf; box.appendChild(s1);
        var s2=document.createElement('p'); s2.className='tf-step'; s2.innerHTML='<strong></strong>'; s2.querySelector('strong').textContent=m.step2; box.appendChild(s2);
        var names=Object.keys(TESTFLIGHT); chosen=chosen||[];
        names.sort(function(a,b){ return (chosen.indexOf(a)<0)-(chosen.indexOf(b)<0); });
        var ul=document.createElement('ul'); ul.className='tf-list'; var anySoon=false;
        names.forEach(function(n){
          var li=document.createElement('li'); if(chosen.indexOf(n)>-1) li.className='chosen';
          var nm=document.createElement('span'); nm.className='tf-name'; nm.textContent=n; li.appendChild(nm);
          if(TESTFLIGHT[n]){ var a=document.createElement('a'); a.className='tf-btn'; a.href=TESTFLIGHT[n]; a.target='_blank'; a.rel='noopener'; a.textContent=m.install; li.appendChild(a); }
          else { anySoon=true; var sp=document.createElement('span'); sp.className='tf-soon'; sp.textContent=m.soon; li.appendChild(sp); }
          ul.appendChild(li);
        });
        box.appendChild(ul);
        var s3=document.createElement('p'); s3.className='tf-step'; s3.style.marginTop='14px'; s3.innerHTML='<strong></strong>'; s3.querySelector('strong').textContent=m.step3; box.appendChild(s3);
        if(anySoon){ var l=document.createElement('p'); l.className='tf-later'; l.textContent=m.later; box.appendChild(l); }
        form.replaceWith(box);
      }
      if(form.website.value){ done(m.ok); return; }
      var apps = Array.prototype.map.call(form.querySelectorAll('input[name=apps]:checked'), function(c){ return c.value; });
      var email = form.email.value.trim();
      if(!apps.length){ err(m.none); return; }
      if(!EMAIL_RE.test(email)){ err(m.bad); form.email.focus(); return; }
      if(TESTER_URL.indexOf('https://') !== 0){ err(m.err); return; }
      var btn = form.querySelector('button'), label = btn.textContent; btn.disabled = true; btn.textContent = m.wait;
      try{
        var res = await fetch(TESTER_URL, {method:'POST', body:new URLSearchParams({
          type:'tester', name:form.name.value.trim().slice(0,100), email:email, apps:apps.join(', '), lang:lang, website:''})});
        var data = await res.json();
        if(data.result === 'ok') done(m.ok, apps);
        else if(data.result === 'duplicate') done(m.dup, apps);
        else if(data.reason === 'email'){ err(m.bad); btn.disabled=false; btn.textContent=label; }
        else throw new Error('x');
      }catch(e){ err(m.err); btn.disabled=false; btn.textContent=label; }
    });
  });
})();
