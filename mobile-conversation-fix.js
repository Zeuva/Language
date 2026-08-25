// Zeuvastec Language — V9 mobile conversation bridge.
// Does not create a second SpeechRecognition instance; it delegates to the
// existing guided-voice controller so desktop/mobile share one conversation state.
(function(){
  const mic = document.getElementById('mic-button');
  const stage = document.getElementById('tutor-stage');
  if(!mic || !stage) return;

  const isTouch = matchMedia('(pointer: coarse)').matches;
  if(!isTouch) return;

  let lastTouch = 0;
  const keepAvatarVisible = () => {
    if(!stage || !matchMedia('(max-width:700px)').matches) return;
    const room = stage.closest('.voice-room');
    if(room) room.scrollIntoView({block:'nearest', behavior:'smooth'});
  };

  mic.addEventListener('pointerup', (e)=>{
    if(e.pointerType === 'mouse') return;
    const now = Date.now();
    if(now-lastTouch < 450) return;
    lastTouch = now;
    // Give the browser a real user gesture for microphone/audio activation.
    try{ window.dispatchEvent(new Event('zeuvastec-user-gesture')); }catch{}
    window.setTimeout(keepAvatarVisible, 80);
  }, {passive:true});

  // On iOS, automatic SpeechRecognition start is restricted by Safari.
  // The first user tap arms the existing controller; subsequent questions
  // can auto-start where the browser permits it.
  window.addEventListener('zeuvastec-avatar-ready', ()=>{
    stage.classList.add('mobile-avatar-ready');
  }, {once:true});
})();
