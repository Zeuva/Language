
/* Zeuvastec AI Voice PRO MAX - IPA + Free Conversation */
(function(){
  const dialogue = document.getElementById('dialogue');
  const mic = document.getElementById('mic-button');
  const status = document.getElementById('voice-status');
  const help = document.getElementById('mic-help');
  if(!dialogue) return;

  // --- IPA Dictionary (simplified but effective) ---
  const IPA_DICT = {
    "hello":"/həˈloʊ/", "good":"/ɡʊd/", "morning":"/ˈmɔːrnɪŋ/", "coffee":"/ˈkɒfi/", "please":"/pliːz/",
    "water":"/ˈwɔːtər/", "tea":"/tiː/", "name":"/neɪm/", "my":"/maɪ/", "is":"/ɪz/", "i":"/aɪ/", "am":"/æm/", "from":"/frɒm/",
    "brazil":"/brəˈzɪl/", "years":"/jɪərz/", "old":"/oʊld/", "twenty":"/ˈtwenti/", "five":"/faɪv/",
    "wake":"/weɪk/", "up":"/ʌp/", "work":"/wɜːrk/", "go":"/ɡoʊ/", "like":"/laɪk/", "would":"/wʊd/",
    "reservation":"/ˌrezərˈveɪʃən/", "restaurant":"/ˈrestərɑːnt/", "bathroom":"/ˈbæθruːm/",
    "beautiful":"/ˈbjuːtɪfəl/", "family":"/ˈfæməli/", "weekend":"/ˌwiːkˈend/", "travel":"/ˈtrævəl/",
    "think":"/θɪŋk/", "outside":"/ˌaʊtˈsaɪd/", "box":"/bɒks/", "success":"/səkˈses/",
    "leadership":"/ˈliːdərʃɪp/", "project":"/ˈprɒdʒekt/", "meeting":"/ˈmiːtɪŋ/"
  };

  const MOUTH_TIPS = {
    "th":"/θ/ e /ð/: Coloque a ponta da língua ENTRE os dentes. Sopro suave. Ex: think /θɪŋk/",
    "r":"/r/: Não vibre como no português. Língua curvada, sem tocar a parte superior da boca. Ex: really /ˈrɪəli/",
    "iː":"/iː/ longo: Sorria bem aberto, som longo. Ex: please /pliːz/ vs. this /ðɪs/",
    "æ":"/æ/: Boca bem aberta, como 'é' de 'café' mas mais aberto. Ex: cat /kæt/",
    "ʊ":"/ʊ/ curto: Lábios arredondados curto. Ex: good /ɡʊd/ vs food /fuːd/"
  };

  function getIPA(word){
    const w = word.toLowerCase().replace(/[^a-z]/g,'');
    return IPA_DICT[w] || `/${w}/`;
  }
  function phraseToIPA(phrase){
    return phrase.split(/\s+/).map(w=>`${w} ${getIPA(w)}`).join('  •  ');
  }
  function getMouthTip(phrase){
    const low = phrase.toLowerCase();
    for(let k in MOUTH_TIPS){ if(low.includes(k) || Object.keys(IPA_DICT).some(word=> low.includes(word) && IPA_DICT[word].includes(k))) return MOUTH_TIPS[k]; }
    if(low.includes('th')) return MOUTH_TIPS['th'];
    if(low.includes(' r ') || low.startsWith('r')) return MOUTH_TIPS['r'];
    return "Dica: Fale devagar, exagere os movimentos da boca. Grave e ouça de novo!";
  }

  // --- Voices ---
  function getVoices(){ return speechSynthesis.getVoices(); }
  speechSynthesis.onvoiceschanged=()=>getVoices(); getVoices();
  function speak(text, lang='en-US', rate=0.85, onEnd){
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang=lang; u.rate=rate;
    const vs=getVoices();
    const v = vs.find(x=>x.lang.toLowerCase().includes(lang.toLowerCase().split('-')[0]) && /natural|neural|google/i.test(x.name)) || vs.find(x=>x.lang.toLowerCase().startsWith(lang.split('-')[0].toLowerCase()));
    if(v) u.voice=v;
    if(onEnd) u.onend=onEnd;
    speechSynthesis.speak(u);
  }
  function speakBilingual(en, pt){ speak(en,'en-US',0.85,()=>setTimeout(()=>speak(pt,'pt-BR',1.0),250)); }

  // --- Free Conversation AI (rule-based + contextual) ---
  const freeResponses = [
    {keywords:['hello','hi','hey'], en:"Hello! Great to see you. How are you today?", pt:"Olá! Ótimo te ver. Como você está hoje?"},
    {keywords:['how are you'], en:"I'm doing great, thank you for asking! And you?", pt:"Estou ótimo, obrigado por perguntar! E você?"},
    {keywords:['name'], en:"My name is Zeuvastec AI Tutor. I'm here to help you become fluent!", pt:"Meu nome é Tutor IA Zeuvastec. Estou aqui para te ajudar a ficar fluente!"},
    {keywords:['coffee','drink','tea','water'], en:"Nice choice! I love coffee too. Do you prefer it with milk or black?", pt:"Boa escolha! Eu também amo café. Você prefere com leite ou preto?"},
    {keywords:['work','job'], en:"Interesting! What do you do for work? Tell me more.", pt:"Interessante! O que você faz no trabalho? Me conte mais."},
    {keywords:['travel','trip','vacation'], en:"Traveling is amazing! Where would you like to go?", pt:"Viajar é incrível! Para onde você gostaria de ir?"},
    {keywords:['family','mother','father','sister','brother'], en:"Family is so important. Tell me about your family!", pt:"Família é muito importante. Me conte sobre sua família!"},
    {keywords:['thank'], en:"You're very welcome! Keep practicing, you're doing great!", pt:"De nada! Continue praticando, você está indo muito bem!"},
    {keywords:['bye','goodbye','see you'], en:"Goodbye! See you next time. Keep practicing every day!", pt:"Tchau! Até a próxima. Continue praticando todo dia!"},
  ];
  function freeAIResponse(input){
    const low=input.toLowerCase();
    for(let r of freeResponses){
      if(r.keywords.some(k=>low.includes(k))) return r;
    }
    // fallback generic
    const generics=[
      {en:"That's interesting! Can you tell me more about that?", pt:"Isso é interessante! Pode me contar mais sobre isso?"},
      {en:"I see! How does that make you feel?", pt:"Entendi! Como isso faz você se sentir?"},
      {en:"Great sentence! Let's try to make it even better. Can you say it again more slowly?", pt:"Ótima frase! Vamos tentar melhorar ainda mais. Pode dizer de novo mais devagar?"},
    ];
    return generics[Math.floor(Math.random()*generics.length)];
  }

  // --- UI Injection for PRO MAX controls ---
  const talkView = document.getElementById('talk-view');
  if(talkView && !document.getElementById('pro-max-controls')){
    const controls = document.createElement('div');
    controls.id='pro-max-controls';
    controls.innerHTML=`
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin:12px 0;padding:12px;background:#f5fae5;border:1px solid #daebaf;border-radius:14px">
        <div style="flex:1;min-width:200px">
          <label style="font-size:11px;font-weight:700;letter-spacing:.08em">MODO DE CONVERSA</label>
          <div style="display:flex;gap:6px;margin-top:6px">
            <button id="mode-guided" class="tab active" style="flex:1">📚 Guiado (com correção)</button>
            <button id="mode-free" class="tab" style="flex:1">💬 Livre (conversa aberta)</button>
          </div>
        </div>
        <div style="display:flex;gap:6px;align-items:end">
          <button id="toggle-ipa" class="tab active" style="font-size:11px">🔤 Mostrar IPA</button>
          <button id="btn-slow" class="tab" style="font-size:11px">🐢 Falar devagar</button>
        </div>
      </div>
      <div id="ipa-panel" style="background:#fffdf8;border:1px solid #e9e5da;border-radius:14px;padding:14px;margin-bottom:12px">
        <div style="display:flex;justify-content:space-between"><strong style="font-family:Fraunces">Fonética (IPA) & Boca</strong><span style="font-size:11px;color:#718078">Toque em 🔊 para ouvir cada som</span></div>
        <div id="ipa-content" style="margin-top:8px;font-size:13px;color:#24322c;line-height:1.6">Selecione uma lição para ver a transcrição fonética.</div>
        <div id="mouth-tip" style="margin-top:10px;padding:10px;background:#fff7ed;border-radius:10px;font-size:12px;border:1px solid #ffba8366"></div>
      </div>
    `;
    const levelSelector = talkView.querySelector('.level-selector') || talkView.querySelector('div');
    levelSelector.parentNode.insertBefore(controls, levelSelector.nextSibling);
  }

  let mode='guided';
  let showIPA=true;
  let slowMode=false;
  let level='basic';
  let step=0;
  let lastExpected='';

  // Level handling (reuse existing courses if available, else define)
  const courses = {
    basic:[
      {en:'I would like a coffee, please.', pt:'Eu gostaria de um café, por favor.'},
      {en:'My name is Alex. I am from Brazil.', pt:'Meu nome é Alex. Sou do Brasil.'},
      {en:'I wake up at six every morning.', pt:'Acordo às seis toda manhã.'},
    ],
    intermediate:[
      {en:'I visited my family last weekend.', pt:'Visitei minha família no fim de semana passado.'},
      {en:'Learning English is easier than you think.', pt:'Aprender inglês é mais fácil do que você pensa.'},
    ],
    advanced:[
      {en:'We should consider the long-term impact of this decision.', pt:'Devemos considerar o impacto de longo prazo desta decisão.'},
    ]
  };

  function updateIPAPanel(phrase){
    if(!showIPA) return;
    const ipaDiv=document.getElementById('ipa-content');
    const mouthDiv=document.getElementById('mouth-tip');
    if(!ipaDiv) return;
    ipaDiv.innerHTML = `
      <div style="font-size:11px;letter-spacing:.1em;color:#718078;font-weight:700">FRASE ORIGINAL</div>
      <div style="font-size:16px;font-weight:600;margin:4px 0">${phrase}</div>
      <div style="font-size:11px;letter-spacing:.1em;color:#718078;font-weight:700;margin-top:10px">TRANSCRIÇÃO FONÉTICA (IPA)</div>
      <div style="font-family:monospace;background:#f8f5ed;padding:8px;border-radius:8px;margin-top:4px;word-break:break-word">${phraseToIPA(phrase)}</div>
      <div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap">${phrase.split(/\s+/).slice(0,8).map(w=>`<button class="mini-listen" data-say-en="${w}" style="background:#e8f4d1">🔊 ${w} ${getIPA(w)}</button>`).join('')}</div>
    `;
    mouthDiv.innerHTML = `<strong>👄 Como posicionar a boca:</strong> ${getMouthTip(phrase)}`;
  }

  function addMsg(text, who, extra=''){
    const el=document.createElement('article');
    el.className=`message ${who}`;
    const badge=who==='tutor'?'Z':'EU';
    el.innerHTML=`<span class="speaker">${badge}</span><div><small>${who==='tutor'?'TUTOR IA PRO MAX':'VOCÊ'}</small><p>${text}</p>${extra}</div>`;
    dialogue.appendChild(el);
    dialogue.scrollTop=dialogue.scrollHeight;
  }

  // Event listeners for new controls
  document.addEventListener('click', e=>{
    if(e.target.id==='mode-guided'){ mode='guided'; e.target.classList.add('active'); document.getElementById('mode-free').classList.remove('active'); status.textContent='Modo Guiado - correção de pronúncia'; dialogue.innerHTML=''; step=0; askGuided(); }
    if(e.target.id==='mode-free'){ mode='free'; e.target.classList.add('active'); document.getElementById('mode-guided').classList.remove('active'); status.textContent='Modo Livre - converse sobre qualquer coisa'; dialogue.innerHTML=''; addMsg('Hi! I am your AI conversation partner. Talk to me about anything in English! <br><small style="color:#718078">Oi! Sou seu parceiro de conversação IA. Fale comigo sobre qualquer coisa em inglês!</small>','tutor'); speakBilingual("Hi! Let's have a free conversation in English!","Oi! Vamos ter uma conversa livre em inglês!"); }
    if(e.target.id==='toggle-ipa'){ showIPA=!showIPA; e.target.classList.toggle('active',showIPA); document.getElementById('ipa-panel').style.display=showIPA?'block':'none'; }
    if(e.target.id==='btn-slow'){ slowMode=!slowMode; e.target.classList.toggle('active',slowMode); e.target.textContent=slowMode?'🐢 Devagar ATIVADO':'🐢 Falar devagar'; }
    if(e.target.dataset.sayEn){ speak(e.target.dataset.sayEn,'en-US', slowMode?0.6:0.9); }
  });

  function askGuided(){
    const list=courses[level]||courses.basic;
    if(step>=list.length){ addMsg('🎉 Você concluiu todas as frases deste nível! Ative o Modo Livre para praticar conversação aberta.','tutor'); return; }
    const item=list[step];
    lastExpected=item.en;
    updateIPAPanel(item.en);
    addMsg(`${item.en}<br><small style="color:#718078">(${item.pt})</small><br><button class="mini-listen" data-say-en="${item.en}">🔊 Ouvir normal</button> <button class="mini-listen" data-say-en="${item.en}" onclick="window.speechSynthesis.cancel();var u=new SpeechSynthesisUtterance('${item.en}');u.lang='en-US';u.rate=0.55;speechSynthesis.speak(u)">🐢 Devagar</button>`, 'tutor');
    speak(item.en,'en-US', slowMode?0.6:0.85);
  }

  // Hook into existing level buttons
  document.querySelectorAll('.level-choice').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      level=btn.dataset.level;
      if(mode==='guided'){ dialogue.innerHTML=''; step=0; askGuided(); }
    });
  });

  // Assessment for guided mode
  function assessGuided(transcript){
    addMsg(transcript,'user');
    // simple score
    const expected=lastExpected;
    const score = (()=>{ // quick similarity
      const a=expected.toLowerCase().replace(/[^a-z ]/g,''); const b=transcript.toLowerCase().replace(/[^a-z ]/g,'');
      let matches=0; a.split(' ').forEach(w=>{ if(b.includes(w)) matches++; });
      return Math.round(matches / a.split(' ').length * 100);
    })();
    const color = score>=80?'#276246':score>=50?'#d97706':'#dc2626';
    const extra=`<div style="margin-top:8px;padding:8px;background:#f8f5ed;border-radius:8px"><div style="display:flex;justify-content:space-between"><strong style="color:${color}">${score}% - ${score>=80?'Perfeito!':score>=50?'Bom trabalho!':'Tente de novo'}</strong><span style="font-size:11px">Você disse: "${transcript}"</span></div><div style="height:5px;background:#e9e5da;border-radius:999px;margin-top:6px"><i style="display:block;height:100%;width:${score}%;background:${color}"></i></div><div style="margin-top:6px;font-size:12px">IPA: <code>${phraseToIPA(expected)}</code><br>👄 ${getMouthTip(expected)}</div></div>`;
    if(score>=50){
      addMsg(`Excellent! Your pronunciation is ${score>=80?'perfect':'getting better'}! <br><small style="color:#718078">Excelente! Sua pronúncia está ${score>=80?'perfeita':'melhorando'}!</small>`, 'tutor', extra);
      speakBilingual("Great job! Let's go to the next one.", "Ótimo trabalho! Vamos para a próxima.");
      step++; setTimeout(askGuided, 1800);
    } else {
      addMsg(`Almost! Let's practice this sentence again. <br><small>Quase! Vamos praticar de novo: <b>${expected}</b></small>`, 'tutor', extra);
      speak(expected,'en-US',0.65);
    }
  }

  function assessFree(transcript){
    addMsg(transcript,'user');
    const response=(()=>{ const low=transcript.toLowerCase(); for(let r of [{k:['hello','hi'],en:"Hello! How are you today?",pt:"Olá! Como você está hoje?"},{k:['work'],en:"What do you do for work? Tell me more!",pt:"O que você faz no trabalho? Me conte mais!"},{k:['travel'],en:"Traveling is wonderful! Where do you want to go?",pt:"Viajar é maravilhoso! Para onde você quer ir?"}]){ if(r.k.some(k=>low.includes(k))) return r; } return {en:"That's really interesting! Tell me more about that in English.",pt:"Isso é muito interessante! Me conte mais sobre isso em inglês."}; })();
    addMsg(`${response.en}<br><small style="color:#718078">${response.pt}</small><br><div style="margin-top:6px;font-size:11px;color:#718078">💡 IPA da resposta: <code>${phraseToIPA(response.en)}</code></div><button class="mini-listen" data-say-en="${response.en}">🔊 Ouvir EN</button>`, 'tutor');
    speak(response.en,'en-US', slowMode?0.6:0.9);
  }

  // Speech Recognition
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  let rec; let listening=false;
  if(SR){
    rec=new SR(); rec.lang='en-US'; rec.interimResults=false; rec.maxAlternatives=1;
    rec.onstart=()=>{ listening=true; mic.classList.add('listening'); status.textContent='Ouvindo... fale em inglês!'; };
    rec.onresult=e=>{ const txt=e.results[0][0].transcript; if(mode==='guided') assessGuided(txt); else assessFree(txt); };
    rec.onend=()=>{ listening=false; mic.classList.remove('listening'); status.textContent= mode==='free' ? 'Modo Livre ativo - toque para falar' : 'Tutor pronto'; };
    mic.onclick=()=>{ if(listening) rec.stop(); else { rec.lang='en-US'; try{rec.start();}catch{}} };
  }

  // Init
  setTimeout(askGuided, 800);
})();
</script>
