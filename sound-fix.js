(() => {
  if (!('speechSynthesis' in window)) return;
  const speech = window.speechSynthesis;
  let voices = [];
  const refresh = () => { voices = speech.getVoices(); };
  refresh(); speech.addEventListener?.('voiceschanged', refresh);
  window.addEventListener('pageshow', () => { refresh(); speech.resume(); });
  function unlock(){ try{ speech.resume(); }catch(_){} }
  document.addEventListener('pointerdown', unlock, {passive:true,capture:true});
  document.addEventListener('touchstart', unlock, {passive:true,capture:true});
  function say(text,lang){
    if(!text || (typeof soundOn!=='undefined' && !soundOn)) return;
    if(/^en/i.test(lang||'en-US') && typeof window.ZEUVASTEC_AVATAR_SPEAK==='function' && window.ZEUVASTEC_AVATAR_READY){
      window.ZEUVASTEC_AVATAR_SPEAK(text,{rate:.9}); return;
    }
    unlock(); const u=new SpeechSynthesisUtterance(text); u.lang=lang||'en-US'; u.rate=.9; u.volume=1;
    const prefix=u.lang.slice(0,2).toLowerCase(); const v=voices.find(x=>x.lang.toLowerCase().startsWith(prefix)); if(v)u.voice=v;
    speech.cancel(); speech.speak(u);
  }
  document.addEventListener('click',event=>{
    const button=event.target.closest('[data-say],[data-say-en],[data-say-pt],.mini-listen'); if(!button)return;
    const text=button.dataset.sayEn||button.dataset.sayPt||button.dataset.say; if(!text)return;
    event.preventDefault(); event.stopImmediatePropagation(); say(text,button.dataset.sayPt?'pt-BR':'en-US');
  },true);
  setInterval(()=>{if(speech.paused)speech.resume();},5000);
})();
