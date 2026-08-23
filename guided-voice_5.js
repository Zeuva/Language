
// VOICE FIX - EN vs PT separado, mantendo microfone funcionando
let voiceCacheFix={en:[],pt:[]}; let vReady=false;
function refreshVFix(){ try{ const all=speechSynthesis.getVoices(); if(!all.length) return; vReady=true; voiceCacheFix.en=all.filter(v=>v.lang.toLowerCase().startsWith('en')); voiceCacheFix.pt=all.filter(v=>v.lang.toLowerCase().startsWith('pt')); voiceCacheFix.en.sort((a,b)=>{ const aS=(a.lang==='en-US'?10:0)+(a.name.includes('Google')?5:0); const bS=(b.lang==='en-US'?10:0)+(b.name.includes('Google')?5:0); return bS-aS; }); voiceCacheFix.pt.sort((a,b)=>{ const aS=(a.lang==='pt-BR'?10:0)+(a.name.includes('Google')?5:0); const bS=(b.lang==='pt-BR'?10:0)+(b.name.includes('Google')?5:0); return bS-aS; }); }catch(e){} }
refreshVFix(); if(speechSynthesis.onvoiceschanged!==undefined){ speechSynthesis.onvoiceschanged=refreshVFix; setTimeout(refreshVFix,500); setTimeout(refreshVFix,1500); }
function getENFix(){ if(!vReady) refreshVFix(); return voiceCacheFix.en.find(v=>v.lang==='en-US')||voiceCacheFix.en[0]||null; }
function getPTFix(){ if(!vReady) refreshVFix(); return voiceCacheFix.pt.find(v=>v.lang==='pt-BR')||voiceCacheFix.pt[0]||null; }
function speakENFix(t,r=0.9,o){ if(!t) return; speechSynthesis.cancel(); setTimeout(()=>{ const u=new SpeechSynthesisUtterance(t); u.lang='en-US'; u.rate=r; const v=getENFix(); if(v) u.voice=v; if(o) u.onend=o; speechSynthesis.speak(u); },80); }
function speakPTFix(t,r=1,o){ if(!t) return; const isPureEN=/^[A-Za-z0-9 .,!?'"-]+$/.test(t) && !/[áàâãéêíóôõúç]/.test(t) && /\b(hello|my name|I am|would like|coffee|please|thank you|good morning|how are you|welcome to the café|what would you like)\b/i.test(t); if(isPureEN){ speakENFix(t,r,o); return; } speechSynthesis.cancel(); setTimeout(()=>{ const u=new SpeechSynthesisUtterance(t); u.lang='pt-BR'; u.rate=r; const v=getPTFix(); if(v) u.voice=v; if(o) u.onend=o; speechSynthesis.speak(u); },80); }
window.speakEnglish=speakENFix; window.speakPortuguese=speakPTFix; window.speakBilingual=(en,pt)=>{ speakENFix(en,0.9,()=>{ setTimeout(()=> speakPTFix(pt,1.0),600); }); }; function speakSlowFix(t){ speakENFix(t,0.55); } window.speakSlow=speakSlowFix;

/* Guided speaking exercise: checks a spoken answer, corrects it, and moves ahead. */
(function () {
  const dialogue = document.getElementById('dialogue');
  const mic = document.getElementById('mic-button');
  const status = document.getElementById('voice-status');
  const help = document.getElementById('mic-help');
  if (!dialogue || !mic) return;

  const courses = {
    basic: [
      { question: 'What would you like to drink?', example: 'I would like a coffee, please.', check: (text) => /\b(coffee|tea|water|juice)\b/.test(text) },
      { question: 'Great! What is your name?', example: 'My name is Elise.', check: (text) => /\b(my name is|i am|i\'m)\b/.test(text) },
      { question: 'Nice to meet you! Where are you from?', example: 'I am from Brazil.', check: (text) => /\b(i am from|i\'m from|from brazil)\b/.test(text) }
    ],
    intermediate: [
      { question: 'What did you do last weekend?', example: 'I went to the beach with my friends.', check: (text) => /\b(i went|i visited|i watched|i stayed|i had)\b/.test(text) },
      { question: 'Why did you enjoy it?', example: 'Because the weather was beautiful.', check: (text) => /\b(because|it was|i really)\b/.test(text) },
      { question: 'What are you going to do next weekend?', example: 'I am going to visit my family.', check: (text) => /\b(going to|i will|i\'m planning)\b/.test(text) }
    ],
    advanced: [
      { question: 'What is one change that would improve your city?', example: 'I believe better public transportation would reduce traffic.', check: (text) => /\b(i believe|in my opinion|would|should)\b/.test(text) },
      { question: 'Can you explain why this change matters?', example: 'It would make commuting safer and more efficient.', check: (text) => /\b(because|would|therefore|this means)\b/.test(text) },
      { question: 'How could the city make this idea happen?', example: 'The city could invest in reliable buses and train lines.', check: (text) => /\b(could|should|by |invest|create)\b/.test(text) }
    ]
  };
  let steps = courses.basic;
  const levelNames = { basic: 'Básico', intermediate: 'Intermediário', advanced: 'Avançado' };
  courses.basic.push(
    { question: 'How old are you?', example: 'I am twenty years old.', check: (text) => /\b(i am|i\'m)\b.*\b(years old|year old)\b/.test(text) },
    { question: 'What do you do every morning?', example: 'I have breakfast and go to work.', check: (text) => /\b(i |i\'m).*(breakfast|work|school|study|wake up)\b/.test(text) },
    { question: 'Do you like learning English?', example: 'Yes, I do. I like learning English.', check: (text) => /\b(yes|i like|i love)\b/.test(text) },
    { question: 'What is your favorite food?', example: 'My favorite food is pizza.', check: (text) => /\b(my favorite|pizza|rice|pasta|food is)\b/.test(text) },
    { question: 'Can you say goodbye?', example: 'Goodbye! See you soon.', check: (text) => /\b(goodbye|bye|see you)\b/.test(text) }
  );
  courses.intermediate.push(
    { question: 'Tell me about a movie you enjoyed.', example: 'I watched a movie that was very funny.', check: (text) => /\b(i watched|movie|film|i enjoyed)\b/.test(text) },
    { question: 'What would you do if you had a free day?', example: 'I would travel and spend time with my family.', check: (text) => /\b(i would|i\'d)\b/.test(text) },
    { question: 'Describe your hometown in one sentence.', example: 'My hometown is small but very welcoming.', check: (text) => /\b(my hometown|my city|it is)\b/.test(text) },
    { question: 'What skill would you like to improve?', example: 'I would like to improve my English pronunciation.', check: (text) => /\b(i would like|i want|improve)\b/.test(text) },
    { question: 'What is important for a good friendship?', example: 'A good friendship needs trust and honesty.', check: (text) => /\b(trust|honesty|friendship|important)\b/.test(text) }
  );
  courses.advanced.push(
    { question: 'What are the benefits and risks of technology?', example: 'Technology improves access to information, but it can affect privacy.', check: (text) => /\b(technology|benefit|risk|but|however)\b/.test(text) },
    { question: 'How do you handle a disagreement at work?', example: 'I listen carefully and try to find common ground.', check: (text) => /\b(i listen|i try|common ground|disagreement)\b/.test(text) },
    { question: 'What makes a leader effective?', example: 'An effective leader communicates clearly and empowers the team.', check: (text) => /\b(leader|communicat|team|effective)\b/.test(text) },
    { question: 'How would you defend an important decision?', example: 'I would present evidence and explain the expected results.', check: (text) => /\b(i would|evidence|because|explain)\b/.test(text) },
    { question: 'What is a goal you have for the future?', example: 'My long-term goal is to become fluent in English.', check: (text) => /\b(my goal|i want|i plan|future|long-term)\b/.test(text) }
  );
  const translations = {
    basic: [
      ['O que você gostaria de beber?', 'Eu gostaria de um café, por favor.'],
      ['Qual é o seu nome?', 'Meu nome é Elise.'],
      ['Prazer em conhecer você! De onde você é?', 'Eu sou do Brasil.']
    ],
    intermediate: [
      ['O que você fez no último fim de semana?', 'Eu fui à praia com meus amigos.'],
      ['Por que você gostou?', 'Porque o tempo estava bonito.'],
      ['O que você vai fazer no próximo fim de semana?', 'Eu vou visitar a minha família.']
    ],
    advanced: [
      ['Qual mudança melhoraria a sua cidade?', 'Eu acredito que um transporte público melhor reduziria o trânsito.'],
      ['Você pode explicar por que essa mudança importa?', 'Ela tornaria o deslocamento mais seguro e eficiente.'],
      ['Como a cidade poderia tornar essa ideia realidade?', 'A cidade poderia investir em ônibus e linhas de trem confiáveis.']
    ]
  };
  let activeLevel = 'basic';
  translations.basic.push(
    ['Quantos anos você tem?', 'Eu tenho vinte anos.'],
    ['O que você faz todas as manhãs?', 'Eu tomo café da manhã e vou trabalhar.'],
    ['Você gosta de aprender inglês?', 'Sim, gosto. Eu gosto de aprender inglês.'],
    ['Qual é a sua comida favorita?', 'Minha comida favorita é pizza.'],
    ['Você pode se despedir?', 'Tchau! Até logo.']
  );
  translations.intermediate.push(
    ['Conte sobre um filme de que gostou.', 'Assisti a um filme que era muito engraçado.'],
    ['O que você faria se tivesse um dia livre?', 'Eu viajaria e passaria tempo com minha família.'],
    ['Descreva sua cidade natal em uma frase.', 'Minha cidade natal é pequena, mas muito acolhedora.'],
    ['Que habilidade você gostaria de melhorar?', 'Eu gostaria de melhorar minha pronúncia em inglês.'],
    ['O que é importante para uma boa amizade?', 'Uma boa amizade precisa de confiança e honestidade.']
  );
  translations.advanced.push(
    ['Quais são os benefícios e riscos da tecnologia?', 'A tecnologia melhora o acesso à informação, mas pode afetar a privacidade.'],
    ['Como você lida com uma discordância no trabalho?', 'Eu escuto com atenção e tento encontrar um ponto em comum.'],
    ['O que torna um líder eficaz?', 'Um líder eficaz se comunica com clareza e fortalece a equipe.'],
    ['Como você defenderia uma decisão importante?', 'Eu apresentaria evidências e explicaria os resultados esperados.'],
    ['Qual é uma meta que você tem para o futuro?', 'Minha meta de longo prazo é ser fluente em inglês.']
  );
  const baseSteps = [
    { question: 'What would you like to drink?', example: 'I would like a coffee, please.', check: (text) => /\b(coffee|tea|water|juice)\b/.test(text) },
    { question: 'Great! What is your name?', example: 'My name is Elise.', check: (text) => /\b(my name is|i am|i\'m)\b/.test(text) },
    { question: 'Nice to meet you! Where are you from?', example: 'I am from Brazil.', check: (text) => /\b(i am from|i\'m from|from brazil)\b/.test(text) }
  ];
  let currentStep = 0;

  document.querySelectorAll('.level-choice').forEach((button) => {
    button.addEventListener('click', () => {
      const level = button.dataset.level;
      steps = courses[level] || courses.basic;
      activeLevel = level;
      currentStep = 0;
      dialogue.innerHTML = '';
      document.querySelectorAll('.level-choice').forEach((item) => item.classList.toggle('active', item === button));
      status.textContent = `${levelNames[level]} · pergunta 1 de ${steps.length}`;
      const welcome = `${levelNames[level]} selected. Let's begin.`;
      message(welcome, 'tutor');
      say(welcome, askNext);
    });
  });

  function say(text, afterSpeaking) { speakENFix(text, 0.9, afterSpeaking); }

  function message(text, who) {
    const item = document.createElement('article');
    item.className = `message ${who}`;
    const name = who === 'tutor' ? 'TUTOR' : 'VOCÊ';
    const badge = who === 'tutor' ? 'Z' : 'EU';
    item.innerHTML = `<span class="speaker">${badge}</span><div><small>${name}</small><p></p></div>`;
    item.querySelector('p').textContent = text;
    dialogue.appendChild(item);
    dialogue.scrollTop = dialogue.scrollHeight;
  }

  function askNext() {
    if (currentStep >= steps.length) {
      const finish = 'Wonderful work! You completed this conversation.';
      message(finish, 'tutor');
      say(finish);
      status.textContent = 'Conversa concluída ✦';
      help.textContent = 'Muito bem! Você concluiu a prática de hoje.';
      return;
    }
    const step = steps[currentStep];
    const translation = translations[activeLevel][currentStep];
    const tipExample = document.getElementById('voice-tip-example');
    const tipTranslation = document.getElementById('voice-tip-translation');
    tipExample.textContent = `“${step.example}”`;
    tipExample.dataset.say = step.example;
    tipTranslation.textContent = `Tradução: “${translation[1]}”`;
    message(step.question, 'tutor');
    say(step.question, () => {
      if (microphoneStream) window.setTimeout(startListening, 350);
    });
    status.textContent = `Pergunta ${currentStep + 1} de ${steps.length}`;
    help.textContent = `Pergunta: “${translation[0]}”  |  Resposta sugerida: “${step.example}” (${translation[1]})`;
  }

  function assess(transcript) {
    const answer = transcript.toLowerCase().replace(/[.,!?]/g, ' ').replace(/\s+/g, ' ');
    const step = steps[currentStep];
    message(transcript, 'user');
    if (step.check(answer)) {
      const praise = currentStep === 0 ? 'Excellent! That is a clear order.' : currentStep === 1 ? 'Perfect! You introduced yourself correctly.' : 'Excellent! Your sentence is correct.';
      message(praise, 'tutor');
      say(praise, () => window.setTimeout(askNext, 350));
      currentStep += 1;
      help.textContent = 'Resposta correta! A próxima pergunta será iniciada automaticamente…';
    } else {
      const correction = `Almost. Try saying: ${step.example}`;
      message(correction, 'tutor');
      say(correction, () => {
        if (microphoneStream) window.setTimeout(startListening, 450);
      });
      status.textContent = 'Vamos tentar novamente';
      const translation = translations[activeLevel][currentStep];
      help.textContent = `Forma correta: “${step.example}” — ${translation[1]}`;
    }
  }

  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!Recognition) {
    mic.onclick = () => {
      const typed = window.prompt(`Escreva sua resposta em inglês:\n${steps[currentStep]?.question || ''}`);
      if (typed) assess(typed);
    };
    help.textContent = 'Este navegador não reconhece voz. Toque no microfone para escrever sua resposta.';
    return;
  }

  const guidedRecognition = new Recognition();
  let microphoneStream = null;
  let microphonePermissionChecked = false;
  let isListening = false;
  guidedRecognition.lang = 'en-US';
  guidedRecognition.interimResults = false;
  guidedRecognition.maxAlternatives = 1;
  guidedRecognition.onstart = () => {
    isListening = true;
    mic.classList.add('listening');
    status.textContent = 'Ouvindo sua resposta…';
    help.textContent = 'Fale a frase em inglês.';
  };
  guidedRecognition.onresult = (event) => assess(event.results[0][0].transcript);
  guidedRecognition.onerror = () => {
    isListening = false;
    status.textContent = 'Não consegui ouvir';
    help.textContent = 'Verifique a permissão do microfone e tente outra vez.';
  };
  guidedRecognition.onend = () => { isListening = false; mic.classList.remove('listening'); };
  async function startListening() {
    if (currentStep >= steps.length || isListening) return;
    if (!microphonePermissionChecked && navigator.mediaDevices?.getUserMedia) {
      microphonePermissionChecked = true;
      try {
        microphoneStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        microphoneStream.getTracks().forEach((track) => track.stop());
        microphoneStream = { authorized: true };
        status.textContent = 'Microfone ativado para esta prática';
      } catch (error) {
        status.textContent = 'Permissão de microfone necessária';
        help.textContent = 'Permita o microfone uma vez nas configurações do navegador para continuar.';
        return;
      }
    }
    try {
      guidedRecognition.start();
    } catch (error) {
      isListening = false;
    }
  }
  mic.onclick = () => {
    startListening();
  };
}());
