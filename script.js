(function(){
  var FI_IDS = ['fi','apit','tietosuoja','tuki','uutiskirje','testaajat'];
  var EN_IDS = ['en','apps','privacy','support','newsletter','testers'];
  function show(lang, keepHash){
    document.getElementById('en').hidden = lang !== 'en';
    document.getElementById('fi').hidden = lang !== 'fi';
    document.documentElement.lang = lang;
    document.querySelectorAll('.lang button').forEach(function(b){
      b.setAttribute('aria-pressed', b.dataset.to === lang ? 'true' : 'false');
    });
    try{ localStorage.setItem('embody-lang', lang); }catch(e){}
    if(!keepHash){
      try{ history.replaceState(null,'', lang === 'fi' ? '#fi' : location.pathname); }catch(e){}
      window.scrollTo(0,0);
    }
  }
  function fromHash(){
    var h = location.hash.replace('#','');
    if(FI_IDS.indexOf(h) > -1) return 'fi';
    if(EN_IDS.indexOf(h) > -1) return 'en';
    return null;
  }
  var stored = null;
  try{ stored = localStorage.getItem('embody-lang'); }catch(e){}
  var initial = fromHash() || (stored === 'fi' ? 'fi' : 'en');
  show(initial, true);
  var h = location.hash.replace('#','');
  if(h && h !== 'fi' && h !== 'en'){
    var el = document.getElementById(h);
    if(el) setTimeout(function(){ el.scrollIntoView(); }, 0);
  }
  document.querySelectorAll('.lang button').forEach(function(b){
    b.addEventListener('click', function(){ show(b.dataset.to); });
  });
  window.addEventListener('hashchange', function(){
    var l = fromHash(); if(l) show(l, true);
  });
})();
