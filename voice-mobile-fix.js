
// === MOBILE MIC FIX - iPhone & Android ===
(function(){
  const micBtn = document.getElementById('mic-button');
  const statusEl = document.getElementById('voice-status');
  const helpEl = document.getElementById('mic-help');
  const dialogueEl = document.getElementById('dialogue');
  if(!micBtn) return;

  console.log('[MIC] Inicializando fix mobile');

  let rec = null;
  let isListening = false;
  let permissionGranted = false;
  let useFallback = false;

  // Criar UI de fallback (input texto) se não existir
  function createFallbackUI(){
    const controls = document.querySelector('.voice-controls');
    if(!controls) return;
    if(document.getElementById('mic-fallback')) return;
    
    const fallbackDiv = document.createElement('div');
    fallbackDiv.id = 'mic-fallback';
    fallbackDiv.className = 'mic-fallback';
    fallbackDiv.innerHTML = `
      <input id="mic-text-input" type="text" placeholder="Digite em inglês se o microfone não funcionar..." autocomplete="off" />
      <button id="mic-text-send">Enviar</button>
    `;
    controls.appendChild(fallbackDiv);
    
    const permDiv = document.createElement('div');
    permDiv.id = 'mic-permission';
    permDiv.className = 'mic-permission';
    permDiv.innerHTML = `
      <strong>🎤 Permissão do microfone necessária</strong><br>
      No iPhone: Ajustes > Safari > Microfone > Permitir<br>
      No Android: Toque no cadeado da barra de endereço > Permitir microfone<br>
      <button onclick="this.parentElement.classList.remove('show')" style="margin-top:8px;padding:6px 12px;border-radius:8px;border:0;background:#276246;color:#fff">Entendi</button>
    `;
    controls.insertBefore(permDiv, fallbackDiv);

    const hint = document.createElement('div');
    hint.className = 'mic-hold-hint';
    hint.innerHTML = '💡 <b>iPhone:</b> Toque uma vez para falar · <b>Android:</b> Segure ou toque · Se não funcionar, digite abaixo';
    controls.appendChild(hint);

    const textInput = document.getElementById('mic-text-input');
    const sendBtn = document.getElementById('mic-text-send');
    if(textInput && sendBtn){
      const sendText = ()=>{
        const t = textInput.value.trim();
        if(!t) return;
        if(typeof window.assessTranscript === 'function'){
          window.assessTranscript(t);
        } else if(typeof assess === 'function'){
          assess(t);
        } else {
          // Fallback genérico
          const el = document.createElement('article');
          el.className='message user';
          el.innerHTML=`<span class="speaker">EU</span><div><small>VOCÊ</small><p>${t}</p></div>`;
          if(dialogueEl) dialogueEl.appendChild(el);
        }
        textInput.value='';
      };
      sendBtn.onclick = sendText;
      textInput.onkeydown = (e)=>{ if(e.key==='Enter') sendText(); };
    }
  }
  createFallbackUI();

  function updateStatus(text, type='info'){
    if(!statusEl) return;
    statusEl.textContent = text;
    if(type==='listening'){
      statusEl.style.color='#dc2626';
      statusEl.style.fontWeight='700';
    } else if(type==='error'){
      statusEl.style.color='#991b1b';
    } else {
      statusEl.style.color='#276246';
      statusEl.style.fontWeight='600';
    }
  }

  function showPermissionHelp(){
    const permEl = document.getElementById('mic-permission');
    if(permEl) permEl.classList.add('show');
    updateStatus('🔴 Permissão necessária', 'error');
    if(helpEl) helpEl.innerHTML = 'Toque em <b>Permitir</b> quando o navegador pedir. Se não aparecer, veja as instruções acima. Ou digite sua resposta abaixo.';
  }

  // Detect iOS
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform==='MacIntel' && navigator.maxTouchPoints>1);
  const isAndroid = /Android/.test(navigator.userAgent);
  console.log('[MIC] Device:', isIOS?'iOS':isAndroid?'Android':'Desktop');

  // Função para iniciar reconhecimento com tratamento mobile
  async function initRecognition(){
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if(!SpeechRecognition){
      console.log('[MIC] SpeechRecognition não suportado, usando fallback texto');
      useFallback = true;
      updateStatus('⌨️ Modo digitação (navegador sem voz)', 'error');
      if(helpEl) helpEl.textContent = 'Seu navegador não suporta microfone. Digite sua resposta em inglês abaixo.';
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.onstart = ()=>{
      isListening = true;
      micBtn.classList.add('listening');
      micBtn.innerHTML = '<span>●</span>';
      updateStatus('🎙️ Ouvindo... fale em inglês!', 'listening');
      if(helpEl) helpEl.textContent = 'Fale agora... estou ouvindo!';
    };

    recognition.onresult = (event)=>{
      const transcript = event.results[0][0].transcript;
      console.log('[MIC] Resultado:', transcript);
      // Chama função global de avaliação
      if(typeof window.assessTranscript === 'function'){
        window.assessTranscript(transcript);
      } else if(typeof window.assess === 'function'){
        window.assess(transcript);
      } else if(typeof assess === 'function'){
        try{ assess(transcript); }catch(e){ console.error(e); }
      } else {
        // Fallback: adiciona na conversa
        const el = document.createElement('article');
        el.className='message user';
        el.innerHTML=`<span class="speaker">EU</span><div><small>VOCÊ</small><p>${transcript}</p></div>`;
        if(dialogueEl) dialogueEl.appendChild(el);
      }
    };

    recognition.onerror = (event)=>{
      console.error('[MIC] Erro:', event.error);
      isListening = false;
      micBtn.classList.remove('listening');
      micBtn.innerHTML = '<span>⌁</span>';
      
      if(event.error==='not-allowed' || event.error==='permission-denied'){
        showPermissionHelp();
      } else if(event.error==='no-speech'){
        updateStatus('😶 Não ouvi, tente novamente', 'error');
        if(helpEl) helpEl.textContent = 'Não consegui ouvir. Fale mais alto ou digite abaixo.';
      } else if(event.error==='audio-capture'){
        updateStatus('🎤 Microfone não encontrado', 'error');
        if(helpEl) helpEl.textContent = 'Microfone não encontrado. Use o campo de texto abaixo.';
      } else {
        updateStatus('⚠️ Erro no microfone', 'error');
        if(helpEl) helpEl.textContent = `Erro: ${event.error}. Tente novamente ou digite.`;
      }
    };

    recognition.onend = ()=>{
      console.log('[MIC] onend');
      isListening = false;
      micBtn.classList.remove('listening');
      micBtn.innerHTML = '<span>⌁</span>';
      if(!useFallback){
        updateStatus('✅ Tutor pronto - toque para falar', 'info');
        if(helpEl && !helpEl.textContent.includes('Permissão')) {
          helpEl.textContent = isIOS ? 'Toque no microfone e fale em inglês. Se não funcionar, digite abaixo.' : 'Toque e fale em inglês ou digite abaixo.';
        }
      }
    };

    return recognition;
  }

  // Audio unlock para iOS (precisa interação do usuário)
  let audioUnlocked = false;
  function unlockAudio(){
    if(audioUnlocked) return;
    console.log('[MIC] Desbloqueando áudio para iOS');
    // Cria áudio silencioso
    try{
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if(AudioContext){
        const ctx = new AudioContext();
        const buffer = ctx.createBuffer(1,1,22050);
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        source.start(0);
        if(ctx.state==='suspended') ctx.resume();
      }
    }catch(e){ console.log('[MIC] AudioContext unlock falhou', e); }
    
    // TTS unlock
    try{
      const u = new SpeechSynthesisUtterance('');
      u.volume = 0;
      speechSynthesis.speak(u);
    }catch(e){}
    
    audioUnlocked = true;
  }

  // Inicializa
  let recognitionInstance = null;
  initRecognition().then(rec=>{
    recognitionInstance = rec;
    if(rec) window.recognitionInstance = rec;
  });

  // Função para iniciar escuta com permissões
  async function startListening(){
    if(isListening) {
      try{ recognitionInstance.stop(); }catch{}
      return;
    }

    unlockAudio();

    // Solicita permissão explicitamente no iOS/Android
    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia){
      try{
        console.log('[MIC] Solicitando permissão getUserMedia');
        const stream = await navigator.mediaDevices.getUserMedia({audio:true});
        // Fecha stream imediatamente, só precisava da permissão
        stream.getTracks().forEach(t=>t.stop());
        permissionGranted = true;
        console.log('[MIC] Permissão concedida');
      }catch(err){
        console.error('[MIC] Permissão negada', err);
        if(err.name==='NotAllowedError' || err.name==='PermissionDeniedError'){
          showPermissionHelp();
          return;
        }
        // Continua mesmo sem getUserMedia, tenta SpeechRecognition
      }
    }

    if(!recognitionInstance){
      recognitionInstance = await initRecognition();
      if(!recognitionInstance) {
        // Fallback: foca no input de texto
        const textInput = document.getElementById('mic-text-input');
        if(textInput) {
          textInput.focus();
          updateStatus('⌨️ Digite sua resposta abaixo', 'info');
        }
        return;
      }
    }

    try{
      recognitionInstance.lang = 'en-US';
      recognitionInstance.start();
      console.log('[MIC] start() chamado');
    }catch(e){
      console.error('[MIC] Erro ao iniciar', e);
      if(e.message && e.message.includes('already started')){
        // Já está ouvindo
        return;
      }
      // Tenta recriar
      recognitionInstance = await initRecognition();
      if(recognitionInstance){
        try{ recognitionInstance.start(); }catch(e2){ console.error('[MIC] Erro segunda tentativa', e2); }
      }
    }
  }

  // Event listeners com suporte touch melhorado
  // Remove listeners antigos
  const newMicBtn = micBtn.cloneNode(true);
  micBtn.parentNode.replaceChild(newMicBtn, micBtn);
  const finalMicBtn = document.getElementById('mic-button');

  // Touch e click com área maior
  finalMicBtn.addEventListener('touchstart', (e)=>{
    e.preventDefault();
    console.log('[MIC] touchstart');
    // No Android, hold to talk pode ser melhor
    if(isAndroid){
      // Para Android, inicia ao tocar
      startListening();
    }
  }, {passive:false});

  finalMicBtn.addEventListener('touchend', (e)=>{
    e.preventDefault();
    console.log('[MIC] touchend');
    if(isIOS){
      // iOS: toggle no touchend para evitar duplo acionamento
      startListening();
    } else if(isAndroid){
      // Android: para ao soltar se estiver em hold mode (opcional)
      // Mantém toggle simples por enquanto
    }
  }, {passive:false});

  finalMicBtn.addEventListener('click', (e)=>{
    e.preventDefault();
    console.log('[MIC] click');
    // Evita duplo acionamento no iOS que já tratou touchend
    if(isIOS && e.sourceCapabilities && e.sourceCapabilities.firesTouchEvents){
      return;
    }
    startListening();
  });

  // Suporte teclado (acessibilidade)
  finalMicBtn.addEventListener('keydown', (e)=>{
    if(e.key==='Enter' || e.key===' '){
      e.preventDefault();
      startListening();
    }
  });

  // Expõe função global para outros scripts
  window.startListening = startListening;
  window.assessTranscript = function(transcript){
    // Tenta chamar assess do escopo global ou do tutor
    if(typeof assess === 'function'){
      try{ assess(transcript); return; }catch(e){}
    }
    // Fallback: procura função no tutor
    const event = new CustomEvent('micTranscript', {detail: transcript});
    document.dispatchEvent(event);
  };

  // Listener para evento customizado
  document.addEventListener('micTranscript', (e)=>{
    console.log('[MIC] micTranscript evento', e.detail);
  });

  // Mensagem inicial por device
  setTimeout(()=>{
    if(isIOS){
      updateStatus('🎤 Toque para falar (iPhone)', 'info');
      if(helpEl) helpEl.innerHTML = 'Toque no microfone <b>uma vez</b> e fale em inglês. Se o iPhone pedir permissão, toque em <b>Permitir</b>.';
    } else if(isAndroid){
      updateStatus('🎤 Toque para falar (Android)', 'info');
      if(helpEl) helpEl.innerHTML = 'Toque no microfone e fale. Se pedir permissão, permita. Ou digite sua resposta abaixo.';
    }
  }, 1000);

  console.log('[MIC] Fix mobile inicializado - iOS:', isIOS, 'Android:', isAndroid);
})();
