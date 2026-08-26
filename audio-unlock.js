
(function () {
  const soundBtn = document.getElementById('sound-toggle');
  const micBtn = document.getElementById('mic-button');
  
  function unlockAudio(){
    if(typeof soundOn !== 'undefined' && !soundOn) return;
    if(!window.speechSynthesis) return;
    console.log('[AUDIO] Desbloqueando áudio');
    window.speechSynthesis.resume();
    // iOS audio context unlock
    try{
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if(AudioContext){
        const ctx = new AudioContext();
        if(ctx.state==='suspended') ctx.resume();
        const buffer = ctx.createBuffer(1,1,22050);
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        source.start(0);
      }
    }catch(e){}
    
    // Do not enqueue/cancel a hidden test utterance on iOS; it can interrupt the real tutor speech.

  }

  if(soundBtn){
    soundBtn.addEventListener('click', unlockAudio);
  }
  
  // Desbloqueia também no primeiro toque no body (iPhone precisa)
  let unlocked = false;
  function unlockOnce(){
    if(unlocked) return;
    unlocked = true;
    unlockAudio();
    document.removeEventListener('touchstart', unlockOnce);
    document.removeEventListener('click', unlockOnce);
  }
  document.addEventListener('touchstart', unlockOnce, {once:true, passive:true});
  document.addEventListener('click', unlockOnce, {once:true});

  // Desbloqueia ao tocar no mic também
  if(micBtn){
    micBtn.addEventListener('touchstart', unlockAudio, {once:true, passive:true});
  }
})();
