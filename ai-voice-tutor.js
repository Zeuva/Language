
/* Zeuvastec AI Voice Tutor 2.0 - Bilingual Pronunciation Coach */
(function(){
  const dialogue = document.getElementById('dialogue');
  const mic = document.getElementById('mic-button');
  const status = document.getElementById('voice-status');
  const help = document.getElementById('mic-help');
  const tipExample = document.getElementById('voice-tip-example');
  const tipTrans = document.getElementById('voice-tip-translation');
  if(!dialogue || !mic) return;

  // --- Bilingual Speech ---
  function getVoices(){ return speechSynthesis.getVoices(); }
  // Preload voices
  speechSynthesis.onvoiceschanged = ()=>getVoices();
  getVoices();

  function speak(text, lang='en-US', rate=0.9, onEnd){
    if(!window.speechSynthesis) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.rate = rate;
    const voices = getVoices();
    // Prefer natural voices
    const pref = voices.find(v=>v.lang.toLowerCase().startsWith(lang.toLowerCase().split('-')[0]) && /natural|neural|google/i.test(v.name)) 
              || voices.find(v=>v.lang.toLowerCase().startsWith(lang.toLowerCase()));
    if(pref) u.voice = pref;
    if(onEnd) u.onend = onEnd;
    speechSynthesis.speak(u);
  }

  function speakBilingual(enText, ptText){
    // Fala em inglês, depois explicação em português
    speak(enText, 'en-US', 0.88, ()=>{
      setTimeout(()=> speak(ptText, 'pt-BR', 1.0), 250);
    });
  }

  // --- Pronunciation Scoring ---
  function normalize(s){
    return s.toLowerCase().replace(/[^a-záàâãéèêíïóôõöúçñ ]/g,'').replace(/\s+/g,' ').trim();
  }
  function levenshtein(a,b){
    const m=a.length, n=b.length;
    const dp=Array.from({length:m+1},()=>Array(n+1).fill(0));
    for(let i=0;i<=m;i++) dp[i][0]=i;
    for(let j=0;j<=n;j++) dp[0][j]=j;
    for(let i=1;i<=m;i++) for(let j=1;j<=n;j++){
      dp[i][j]= a[i-1]===b[j-1] ? dp[i-1][j-1] : Math.min(dp[i-1][j]+1, dp[i][j-1]+1, dp[i-1][j-1]+1);
    }
    return dp[m][n];
  }
  function pronunciationScore(expected, heard){
    const e = normalize(expected);
    const h = normalize(heard);
    if(!h) return {score:0, feedback:'Não ouvi nada. Tente novamente.'};
    const dist = levenshtein(e,h);
    const maxLen = Math.max(e.length, h.length);
    const similarity = Math.max(0, 1 - dist / maxLen);
    const score = Math.round(similarity*100);
    // Find missing words
    const eWords = e.split(' ');
    const hWords = h.split(' ');
    const missing = eWords.filter(w=>!hWords.some(hw=> levenshtein(w,hw) <=1 ));
    return {score, missing, e, h};
  }

  // --- Courses with Bilingual Context ---
  const courses = {
    basic: [
      {en:'What would you like to drink?', pt:'O que você gostaria de beber?', example:'I would like a coffee, please.', ptExample:'Eu gostaria de um café, por favor.', check:t=>/coffee|tea|water|juice/.test(t)},
      {en:'What is your name?', pt:'Qual é o seu nome?', example:'My name is Alex. I am from Brazil.', ptExample:'Meu nome é Alex. Sou do Brasil.', check:t=>/my name is|i am/.test(t)},
      {en:'Where are you from?', pt:'De onde você é?', example:'I am from São Paulo.', ptExample:'Eu sou de São Paulo.', check:t=>/from/.test(t)},
      {en:'How old are you?', pt:'Quantos anos você tem?', example:'I am twenty-five years old.', ptExample:'Tenho 25 anos.', check:t=>/years old|year old/.test(t)},
      {en:'What do you do every morning?', pt:'O que você faz toda manhã?', example:'I wake up at six and go to work.', ptExample:'Acordo às seis e vou trabalhar.', check:t=>/wake up|work|breakfast/.test(t)},
    ],
    intermediate: [
      {en:'What did you do last weekend?', pt:'O que você fez no fim de semana passado?', example:'I visited my family in the countryside.', ptExample:'Visitei minha família no interior.', check:t=>/went|visited|watched|stayed/.test(t)},
      {en:'Tell me about a movie you liked.', pt:'Conte sobre um filme que gostou.', example:'I watched a movie that was very inspiring.', ptExample:'Assisti um filme muito inspirador.', check:t=>/movie|film|watched/.test(t)},
      {en:'What would you do with a free day?', pt:'O que faria com um dia livre?', example:'I would travel to the beach.', ptExample:'Eu viajaria para a praia.', check:t=>/would/.test(t)},
    ],
    advanced: [
      {en:'What change would improve your city?', pt:'Que mudança melhoraria sua cidade?', example:'Better public transportation would reduce traffic.', ptExample:'Transporte público melhor reduziria o trânsito.', check:t=>/would|should|better/.test(t)},
      {en:'How do you handle disagreements at work?', pt:'Como lida com desentendimentos no trabalho?', example:'I listen carefully and try to find common ground.', ptExample:'Eu escuto com atenção e tento encontrar um ponto em comum.', check:t=>/listen|common ground|try/.test(t)},
    ]
  };

  let level='basic';
  let step=0;
  let isListening=false;
  let lastExpected="";

  function addMessage(text, who, scoreInfo=null){
    const el=document.createElement('article');
    el.className=`message ${who}`;
    const badge=who==='tutor'?'Z':'EU';
    const label=who==='tutor'?'TUTOR IA':'VOCÊ';
    let scoreHtml='';
    if(scoreInfo){
      const color = scoreInfo.score>=80 ? '#276246' : scoreInfo.score>=50 ? '#d97706' : '#dc2626';
      const labelScore = scoreInfo.score>=80 ? 'Excelente pronúncia!' : scoreInfo.score>=50 ? 'Boa! Quase lá.' : 'Vamos praticar de novo';
      scoreHtml = `<div style="margin-top:8px;background:#f8f5ed;border-radius:10px;padding:8px 10px;border:1px solid #e9e5da">
        <div style="display:flex;justify-content:space-between;align-items:center"><strong style="color:${color}">${scoreInfo.score}% - ${labelScore}</strong><span style="font-size:11px;color:#718078">Ouvi: "${scoreInfo.h}"</span></div>
        <div style="height:6px;background:#e9e5da;border-radius:999px;margin-top:6px;overflow:hidden"><i style="display:block;height:100%;width:${scoreInfo.score}%;background:${color}"></i></div>
        ${scoreInfo.missing && scoreInfo.missing.length ? `<small style="display:block;margin-top:6px;color:#9a4f28">Faltou/pronúncia: <b>${scoreInfo.missing.join(', ')}</b></small>`:''}
      </div>`;
    }
    el.innerHTML=`<span class="speaker">${badge}</span><div><small>${label}</small><p>${text}</p>${who==='tutor'?`<button class="mini-listen" data-say-en="${text}">🔊 Ouvir EN</button> <button class="mini-listen" data-say-pt="${text}" data-lang="pt">🔊 Ouvir PT</button>`:''}${scoreHtml}</div>`;
    dialogue.appendChild(el);
    dialogue.scrollTop=dialogue.scrollHeight;
  }

  function askNext(){
    const list=courses[level];
    if(step>=list.length){
      const finishEn="Amazing! You completed this conversation.";
      const finishPt="Incrível! Você concluiu esta conversa. Sua pronúncia melhorou muito!";
      addMessage(finishEn,'tutor');
      speakBilingual(finishEn, finishPt);
      status.textContent='Conversa concluída ✦';
      help.textContent='Muito bem! Escolha outro nível para continuar.';
      return;
    }
    const item=list[step];
    lastExpected=item.example;
    tipExample.textContent=`"${item.example}"`;
    tipExample.dataset.sayEn=item.example;
    tipTrans.textContent=`Tradução: "${item.ptExample}"`;
    addMessage(`${item.en} <br><small style="color:#718078">(${item.pt})</small>`,'tutor');
    speak(item.en,'en-US',0.9,()=>{
      setTimeout(()=>speak(item.pt,'pt-BR',1.0), 300);
    });
    status.textContent=`Pergunta ${step+1} de ${list.length} · ${level}`;
    help.innerHTML=`<b style="color:#276246">Diga em inglês:</b> "${item.example}" <br><small style="color:#718078">Dica PT: ${item.ptExample}</small>`;
  }

  function assess(transcript){
    const item=courses[level][step];
    const clean=transcript.trim();
    addMessage(clean,'user');
    const scoreInfo=pronunciationScore(item.example, clean);
    const passes = item.check(normalize(clean)) && scoreInfo.score >= 40;
    
    if(passes){
      const praiseEn = scoreInfo.score>=80 ? "Perfect pronunciation! Excellent work!" : "Good job! Your pronunciation is improving!";
      const praisePt = scoreInfo.score>=80 ? "Pronúncia perfeita! Excelente!" : "Bom trabalho! Sua pronúncia está melhorando!";
      addMessage(`${praiseEn}<br><small style="color:#718078">${praisePt}</small>`, 'tutor', scoreInfo);
      speakBilingual(praiseEn, praisePt);
      step++;
      help.textContent='✅ Correto! Próxima pergunta em 2 segundos...';
      setTimeout(askNext, 2000);
    } else {
      const correctionEn=`Almost. Let's practice: ${item.example}`;
      const correctionPt=`Quase lá. Vamos praticar: ${item.example}. Em português: ${item.ptExample}. Faltou: ${scoreInfo.missing.join(', ')||'clareza'}`;
      addMessage(`${correctionEn}<br><small style="color:#9a4f28">Dica: ${item.ptExample}</small>`, 'tutor', scoreInfo);
      speakBilingual(correctionEn, `Vamos tentar de novo. Diga: ${item.example}`);
      status.textContent='Vamos tentar novamente';
      help.textContent=`Forma correta: "${item.example}" - Diga mais devagar, focando em: ${scoreInfo.missing.join(', ')||'pronúncia'}`;
    }
  }

  // Level switch
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

  // Speech Recognition with bilingual support
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  let rec;
  if(SR){
    rec=new SR();
    rec.lang='en-US';
    rec.interimResults=false;
    rec.maxAlternatives=3;
    rec.onstart=()=>{
      isListening=true;
      mic.classList.add('listening');
      status.textContent='Ouvindo você... Fale em inglês';
      help.textContent='Fale naturalmente, como se estivesse conversando.';
    };
    rec.onresult=e=>{
      const results=Array.from(e.results[0]).map(r=>r.transcript);
      // Use best result
      const best=results[0];
      assess(best);
    };
    rec.onerror=()=>{
      isListening=false;
      mic.classList.remove('listening');
      status.textContent='Não consegui ouvir - tente de novo';
      help.textContent='Verifique a permissão do microfone. Fale mais perto.';
    };
    rec.onend=()=>{
      isListening=false;
      mic.classList.remove('listening');
      status.textContent='Tutor pronto para ouvir';
    };
    mic.onclick=()=>{
      if(isListening){ rec.stop(); return; }
      rec.lang='en-US'; // Always listen in EN for learning
      try{ rec.start(); }catch{}
    };
  } else {
    mic.onclick=()=>{
      const typed=prompt(`Digite em inglês - pergunta atual: ${courses[level][step]?.en || ''}`);
      if(typed) assess(typed);
    };
  }

  // Handle listen buttons for EN/PT
  document.addEventListener('click', e=>{
    const btn=e.target.closest('[data-say-en]');
    if(btn){
      speak(btn.dataset.sayEn, 'en-US', 0.9);
    }
    const btnPt=e.target.closest('[data-say-pt]');
    if(btnPt){
      speak(btnPt.dataset.sayPt, 'pt-BR', 1.0);
    }
  });

  // Start first question
  setTimeout(askNext, 800);

  // Expose for other scripts
  window.ZeuvastecAI = {speak, speakBilingual, pronunciationScore};
})();
</script>
