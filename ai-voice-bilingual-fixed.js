
// === IA BILÍNGUE CORRIGIDA - PT SÓ FALA PT, EN SÓ FALA EN ===
let aiVoiceCache={en:[],pt:[]}; let aiVoicesReady=false;
function aiRefreshVoices(){
  const all=speechSynthesis.getVoices();
  if(all.length===0) return;
  aiVoicesReady=true;
  aiVoiceCache.en=all.filter(v=>v.lang.toLowerCase().startsWith('en'));
  aiVoiceCache.pt=all.filter(v=>v.lang.toLowerCase().startsWith('pt'));
}
aiRefreshVoices();
if(speechSynthesis.onvoiceschanged!==undefined){
  speechSynthesis.onvoiceschanged=aiRefreshVoices;
}
function aiGetEN(){ if(!aiVoicesReady) aiRefreshVoices(); return aiVoiceCache.en.find(v=>v.lang==='en-US') || aiVoiceCache.en[0] || null; }
function aiGetPT(){ if(!aiVoicesReady) aiRefreshVoices(); return aiVoiceCache.pt.find(v=>v.lang==='pt-BR') || aiVoiceCache.pt[0] || null; }

function aiSpeakEN(text, rate=0.9, onEnd){
  if(!text) return;
  speechSynthesis.cancel();
  setTimeout(()=>{
    const u=new SpeechSynthesisUtterance(text);
    u.lang='en-US'; u.rate=rate;
    const v=aiGetEN();
    if(v && v.lang.toLowerCase().startsWith('en')){ u.voice=v; }
    if(onEnd) u.onend=onEnd;
    speechSynthesis.speak(u);
  },70);
}
function aiSpeakPT(text, rate=1.0, onEnd){
  if(!text) return;
  // REGRA DE OURO: PT nunca lê inglês puro
  const isPureEnglish = /^[A-Za-z0-9 .,!?'"-]+$/.test(text) && !/[áàâãéêíóôõúç]/.test(text) && text.split(' ').length>2;
  // Se for inglês puro e não tem acento, bloqueia e usa EN
  const englishWords = ['hello','my name is','I am','would like','coffee','please','thank you','good morning','how are you','where','what','I would','I have','I want','I need'];
  const lower = text.toLowerCase();
  const looksEnglish = englishWords.some(w=> lower.includes(w)) && !/[áàâãéêíóôõúç]/.test(text);
  if(looksEnglish && text.length<100){
    console.log('[IA] PT tentou ler EN, redirecionando para EN:', text);
    aiSpeakEN(text, rate, onEnd);
    return;
  }
  speechSynthesis.cancel();
  setTimeout(()=>{
    const u=new SpeechSynthesisUtterance(text);
    u.lang='pt-BR'; u.rate=rate;
    const v=aiGetPT();
    if(v && v.lang.toLowerCase().startsWith('pt')){ u.voice=v; }
    if(onEnd) u.onend=onEnd;
    speechSynthesis.speak(u);
  },70);
}
function aiSpeakBilingual(en, pt){
  aiSpeakEN(en, 0.88, ()=>{ setTimeout(()=> aiSpeakPT(pt, 1.0), 600); });
}

(function(){
  const dialogue = document.getElementById('dialogue');
  const mic = document.getElementById('mic-button');
  const status = document.getElementById('voice-status');
  const help = document.getElementById('mic-help');
  if(!dialogue || !mic) return;

  const courses = {
    basic: [
      {en:'What would you like to drink?', pt:'O que você gostaria de beber?', example:'I would like a coffee, please.', ptExample:'Eu gostaria de um café, por favor.', check:t=>/coffee|tea|water|juice/.test(t)},
      {en:'What is your name?', pt:'Qual é o seu nome?', example:'My name is Alex.', ptExample:'Meu nome é Alex.', check:t=>/my name is|i am/.test(t)},
      {en:'Where are you from?', pt:'De onde você é?', example:'I am from Brazil.', ptExample:'Sou do Brasil.', check:t=>/from/.test(t)},
      {en:'How old are you?', pt:'Quantos anos você tem?', example:'I am twenty-five years old.', ptExample:'Tenho 25 anos.', check:t=>/years old/.test(t)},
    ],
    intermediate: [
      {en:'What did you do last weekend?', pt:'O que fez no fim de semana passado?', example:'I went to the beach with friends.', ptExample:'Fui à praia com amigos.', check:t=>/went|visited/.test(t)},
      {en:'Tell me about your favorite movie.', pt:'Conte sobre seu filme favorito.', example:'I watched a movie that was very inspiring.', ptExample:'Assisti um filme muito inspirador.', check:t=>/movie|film|watched/.test(t)},
    ],
    advanced: [
      {en:'What change would improve your city?', pt:'Que mudança melhoraria sua cidade?', example:'Better public transport would reduce traffic.', ptExample:'Transporte público melhor reduziria trânsito.', check:t=>/would|should|better/.test(t)},
    ]
  };

  let level='basic';
  let step=0;
  let isListening=false;

  function addMessage(text, who){
    const el=document.createElement('article');
    el.className=`message ${who}`;
    const badge=who==='tutor'?'Z':'EU';
    const label=who==='tutor'?'TUTOR IA BILÍNGUE':'VOCÊ';
    el.innerHTML=`<span class="speaker">${badge}</span><div><small>${label}</small><p>${text}</p><div style="margin-top:6px;display:flex;gap:6px;flex-wrap:wrap">${who==='tutor'?`<button class="tab" style="font-size:10px" onclick="aiSpeakEN('${text.replace(/'/g,"\\'").slice(0,80)}')">🔊 EN</button> <button class="tab" style="font-size:10px" onclick="aiSpeakPT('${text.replace(/'/g,"\\'").slice(0,80)}')">🔊 PT</button>`:''}</div></div>`;
    dialogue.appendChild(el);
    dialogue.scrollTop=dialogue.scrollHeight;
  }

  function askNext(){
    const list=courses[level];
    if(step>=list.length){
      const finishEN="Amazing! You completed this conversation. Your English is improving!";
      const finishPT="Incrível! Você completou esta conversa. Seu inglês está melhorando!";
      addMessage(`${finishEN}<br><small style="color:#718078">${finishPT}</small>`,'tutor');
      aiSpeakBilingual(finishEN, finishPT);
      if(status) status.textContent='Conversa concluída ✦';
      return;
    }
    const item=list[step];
    addMessage(`${item.en}<br><small style="color:#718078">${item.pt}</small><br><small style="color:#276246">💡 Dica PT: ${item.ptExample} → EN: ${item.example}</small>`,'tutor');
    aiSpeakEN(item.en, 0.9);
    if(status) status.textContent=`Pergunta ${step+1} de ${list.length} · ${level}`;
    if(help) help.innerHTML=`<span style="background:#dbeafe;padding:2px 6px;border-radius:999px;font-size:10px">EN</span> "${item.example}"<br><span style="background:#dcfce7;padding:2px 6px;border-radius:999px;font-size:10px">PT</span> "${item.ptExample}"`;
  }

  function assess(transcript){
    const item=courses[level][step];
    addMessage(transcript,'user');
    const clean=transcript.toLowerCase();
    if(item.check(clean)){
      const praiseEN="Excellent! Your pronunciation is great!";
      const praisePT="Excelente! Sua pronúncia está ótima!";
      addMessage(`${praiseEN}<br><small style="color:#718078">${praisePT}</small>`,'tutor');
      aiSpeakBilingual(praiseEN, praisePT);
      step++;
      setTimeout(askNext, 1800);
    } else {
      const corrEN=`Almost. The correct way is: ${item.example}`;
      const corrPT=`Quase! O jeito correto é: ${item.ptExample}. Em inglês: ${item.example}`;
      addMessage(`<b style="color:#dc2626">${corrEN}</b><br><small style="color:#276246">${corrPT}</small>`,'tutor');
      aiSpeakEN(item.example, 0.75, ()=>{ setTimeout(()=> aiSpeakPT(item.ptExample, 1.0), 700); });
    }
  }

  document.querySelectorAll('.level-choice').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      level=btn.dataset.level;
      step=0;
      dialogue.innerHTML='';
      document.querySelectorAll('.level-choice').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      askNext();
    });
  });

  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  let rec;
  if(SR){
    rec=new SR();
    rec.lang='en-US';
    rec.interimResults=false;
    rec.maxAlternatives=1;
    rec.onstart=()=>{ isListening=true; mic.classList.add('listening'); if(status) status.textContent='Ouvindo... fale em inglês!'; };
    rec.onresult=e=>{ assess(e.results[0][0].transcript); };
    rec.onend=()=>{ isListening=false; mic.classList.remove('listening'); if(status) status.textContent='Tutor IA bilíngue pronto'; };
    mic.onclick=()=>{ if(isListening){ rec.stop(); } else { rec.lang='en-US'; try{ rec.start(); }catch{} } };
  } else {
    mic.onclick=()=>{
      const t=prompt(`Digite em inglês - pergunta atual: ${courses[level][step]?.en || ''}`);
      if(t) assess(t);
    };
  }

  setTimeout(askNext, 800);
  window.aiSpeakEN=aiSpeakEN;
  window.aiSpeakPT=aiSpeakPT;
  window.aiSpeakBilingual=aiSpeakBilingual;
})();
