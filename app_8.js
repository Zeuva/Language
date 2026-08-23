
let voiceCache={en:[],pt:[]}; let voicesReady=false;
function refreshVoices(){const all=speechSynthesis.getVoices(); if(all.length===0) return; voicesReady=true; voiceCache.en=all.filter(v=>v.lang.toLowerCase().startsWith('en')); voiceCache.pt=all.filter(v=>v.lang.toLowerCase().startsWith('pt')); }
refreshVoices(); if(speechSynthesis.onvoiceschanged!==undefined) speechSynthesis.onvoiceschanged=refreshVoices;
function getVoiceEN(){if(!voicesReady) refreshVoices(); return voiceCache.en.find(v=>v.lang==='en-US') || voiceCache.en[0] || null;}
function getVoicePT(){if(!voicesReady) refreshVoices(); return voiceCache.pt.find(v=>v.lang==='pt-BR') || voiceCache.pt[0] || null;}
function speakEnglish(text,rate=0.9,onEnd){if(!text) return; speechSynthesis.cancel(); setTimeout(()=>{const u=new SpeechSynthesisUtterance(text); u.lang='en-US'; u.rate=rate; const v=getVoiceEN(); if(v) u.voice=v; if(onEnd) u.onend=onEnd; speechSynthesis.speak(u);},80);}
function speakPortuguese(text,rate=1.0,onEnd){if(!text) return; const isEnglishOnly=/^[A-Za-z0-9 .,!?'"-]+$/.test(text) && !/[áàâãéêíóôõúç]/.test(text) && /\b(hello|my name|I am|would like|coffee|please)\b/i.test(text); if(isEnglishOnly){speakEnglish(text,rate,onEnd); return;} speechSynthesis.cancel(); setTimeout(()=>{const u=new SpeechSynthesisUtterance(text); u.lang='pt-BR'; u.rate=rate; const v=getVoicePT(); if(v) u.voice=v; if(onEnd) u.onend=onEnd; speechSynthesis.speak(u);},80);}
function speakBilingual(en,pt){speakEnglish(en,0.88,()=>{setTimeout(()=>speakPortuguese(pt,1.0),600);});}
function speakSlow(en){speakEnglish(en,0.55);}
function speak(text){speakEnglish(text);}
let completed=JSON.parse(localStorage.getItem('zeuvastec-completed')||'[]');
let points=parseInt(localStorage.getItem('zeuvastec-points')||'0');
let currentCard=0; let soundOn=true; let activeTab='dialog'; let currentQuizIndex=0;
const $=s=>document.querySelector(s); const $$=s=>document.querySelectorAll(s);
function save(){localStorage.setItem('zeuvastec-completed',JSON.stringify(completed)); localStorage.setItem('zeuvastec-points',points.toString());}

const lessons = [
  {
    "id": 1,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Olá e apresentações",
    "desc": "Aprenda olá e apresentações - tradução correta Sarah=Sarah",
    "time": "6 MIN",
    "phrase": "Hello, my name is Sarah",
    "translation": "Olá, meu nome é Sarah",
    "vocab": [
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Olá e apresentações</h4><p><b>Frase:</b> Hello, my name is Sarah = Olá, meu nome é Sarah</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Sarah'",
        "opts": [
          "Até logo",
          "Boa noite",
          "Olá, meu nome é Sarah",
          "Bom dia"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Como vai",
          "Quantos anos",
          "Meu nome é",
          "Onde mora"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Sarah'",
        "opts": [
          "big",
          "bad",
          "name",
          "good"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Sarah'?",
        "opts": [
          "Ao se apresentar",
          "Ao comer",
          "Ao dormir",
          "Ao dirigir"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Thanks",
          "Hello",
          "Goodbye",
          "Please"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "My name is Sarah",
          "Goodbye",
          "Thank you",
          "I am fine"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Quantos anos?",
          "Como vai?",
          "Onde mora?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Sarah'?",
        "opts": [
          "Casa",
          "Sarah",
          "Trabalho",
          "Carro"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Sarah'",
        "opts": [
          "is",
          "am",
          "are",
          "be"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Sarah'",
        "opts": [
          "Is my name Sarah",
          "Sarah is my name",
          "My Sarah is name",
          "My name is Sarah"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Sarah'",
        "opts": [
          "Até logo",
          "Bom dia",
          "Boa noite",
          "Prazer em conhecer você, Sarah"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Sarah' significa:",
        "opts": [
          "Onde mora?",
          "Olá, meu nome é Sarah",
          "Meu nome não é",
          "Qual seu nome?"
        ],
        "ans": 1,
        "type": "translation"
      }
    ]
  },
  {
    "id": 2,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Dizendo seu nome",
    "desc": "Aprenda dizendo seu nome - tradução correta Lucas=Lucas",
    "time": "7 MIN",
    "phrase": "Hello, my name is Lucas",
    "translation": "Olá, meu nome é Lucas",
    "vocab": [
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Dizendo seu nome</h4><p><b>Frase:</b> Hello, my name is Lucas = Olá, meu nome é Lucas</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Lucas'",
        "opts": [
          "Olá, meu nome é Lucas",
          "Boa noite",
          "Bom dia",
          "Até logo"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Quantos anos",
          "Como vai",
          "Meu nome é",
          "Onde mora"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Lucas'",
        "opts": [
          "good",
          "big",
          "bad",
          "name"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Lucas'?",
        "opts": [
          "Ao se apresentar",
          "Ao comer",
          "Ao dormir",
          "Ao dirigir"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Goodbye",
          "Please",
          "Hello",
          "Thanks"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "My name is Lucas",
          "Thank you",
          "I am fine",
          "Goodbye"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Como vai?",
          "Quantos anos?",
          "Onde mora?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Lucas'?",
        "opts": [
          "Casa",
          "Trabalho",
          "Carro",
          "Lucas"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Lucas'",
        "opts": [
          "am",
          "is",
          "be",
          "are"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Lucas'",
        "opts": [
          "Lucas is my name",
          "My Lucas is name",
          "Is my name Lucas",
          "My name is Lucas"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Lucas'",
        "opts": [
          "Até logo",
          "Boa noite",
          "Prazer em conhecer você, Lucas",
          "Bom dia"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Lucas' significa:",
        "opts": [
          "Onde mora?",
          "Olá, meu nome é Lucas",
          "Meu nome não é",
          "Qual seu nome?"
        ],
        "ans": 1,
        "type": "translation"
      }
    ]
  },
  {
    "id": 3,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "De onde você é",
    "desc": "Aprenda de onde você é - tradução correta Julia=Julia",
    "time": "8 MIN",
    "phrase": "Hello, my name is Julia",
    "translation": "Olá, meu nome é Julia",
    "vocab": [
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 De onde você é</h4><p><b>Frase:</b> Hello, my name is Julia = Olá, meu nome é Julia</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Julia'",
        "opts": [
          "Olá, meu nome é Julia",
          "Boa noite",
          "Até logo",
          "Bom dia"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Quantos anos",
          "Meu nome é",
          "Onde mora",
          "Como vai"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Julia'",
        "opts": [
          "name",
          "bad",
          "big",
          "good"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Julia'?",
        "opts": [
          "Ao dormir",
          "Ao dirigir",
          "Ao comer",
          "Ao se apresentar"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Thanks",
          "Hello",
          "Please",
          "Goodbye"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "My name is Julia",
          "Goodbye",
          "Thank you",
          "I am fine"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Quantos anos?",
          "Onde mora?",
          "Como vai?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Julia'?",
        "opts": [
          "Trabalho",
          "Casa",
          "Carro",
          "Julia"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Julia'",
        "opts": [
          "is",
          "am",
          "are",
          "be"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Julia'",
        "opts": [
          "My Julia is name",
          "Is my name Julia",
          "My name is Julia",
          "Julia is my name"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Julia'",
        "opts": [
          "Boa noite",
          "Bom dia",
          "Até logo",
          "Prazer em conhecer você, Julia"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Julia' significa:",
        "opts": [
          "Qual seu nome?",
          "Olá, meu nome é Julia",
          "Onde mora?",
          "Meu nome não é"
        ],
        "ans": 1,
        "type": "translation"
      }
    ]
  },
  {
    "id": 4,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Perguntando o nome",
    "desc": "Aprenda perguntando o nome - tradução correta Miguel=Miguel",
    "time": "9 MIN",
    "phrase": "Hello, my name is Miguel",
    "translation": "Olá, meu nome é Miguel",
    "vocab": [
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Perguntando o nome</h4><p><b>Frase:</b> Hello, my name is Miguel = Olá, meu nome é Miguel</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Miguel'",
        "opts": [
          "Olá, meu nome é Miguel",
          "Boa noite",
          "Até logo",
          "Bom dia"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Onde mora",
          "Como vai",
          "Quantos anos",
          "Meu nome é"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Miguel'",
        "opts": [
          "name",
          "big",
          "good",
          "bad"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Miguel'?",
        "opts": [
          "Ao dirigir",
          "Ao se apresentar",
          "Ao dormir",
          "Ao comer"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Please",
          "Thanks",
          "Hello",
          "Goodbye"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "Thank you",
          "I am fine",
          "My name is Miguel",
          "Goodbye"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Onde mora?",
          "Como vai?",
          "Qual é seu nome?",
          "Quantos anos?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Miguel'?",
        "opts": [
          "Trabalho",
          "Casa",
          "Carro",
          "Miguel"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Miguel'",
        "opts": [
          "am",
          "are",
          "be",
          "is"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Miguel'",
        "opts": [
          "Is my name Miguel",
          "Miguel is my name",
          "My name is Miguel",
          "My Miguel is name"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Miguel'",
        "opts": [
          "Até logo",
          "Bom dia",
          "Prazer em conhecer você, Miguel",
          "Boa noite"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Miguel' significa:",
        "opts": [
          "Olá, meu nome é Miguel",
          "Qual seu nome?",
          "Onde mora?",
          "Meu nome não é"
        ],
        "ans": 0,
        "type": "translation"
      }
    ]
  },
  {
    "id": 5,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Idade e aniversário",
    "desc": "Aprenda idade e aniversário - tradução correta Miguel=Miguel",
    "time": "10 MIN",
    "phrase": "Hello, my name is Miguel",
    "translation": "Olá, meu nome é Miguel",
    "vocab": [
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Idade e aniversário</h4><p><b>Frase:</b> Hello, my name is Miguel = Olá, meu nome é Miguel</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Miguel'",
        "opts": [
          "Até logo",
          "Boa noite",
          "Olá, meu nome é Miguel",
          "Bom dia"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Meu nome é",
          "Como vai",
          "Onde mora",
          "Quantos anos"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Miguel'",
        "opts": [
          "good",
          "name",
          "bad",
          "big"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Miguel'?",
        "opts": [
          "Ao comer",
          "Ao dormir",
          "Ao dirigir",
          "Ao se apresentar"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Goodbye",
          "Thanks",
          "Please",
          "Hello"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "Goodbye",
          "Thank you",
          "My name is Miguel",
          "I am fine"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Onde mora?",
          "Qual é seu nome?",
          "Quantos anos?",
          "Como vai?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Miguel'?",
        "opts": [
          "Miguel",
          "Trabalho",
          "Casa",
          "Carro"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Miguel'",
        "opts": [
          "is",
          "be",
          "are",
          "am"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Miguel'",
        "opts": [
          "My Miguel is name",
          "Miguel is my name",
          "Is my name Miguel",
          "My name is Miguel"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Miguel'",
        "opts": [
          "Bom dia",
          "Prazer em conhecer você, Miguel",
          "Até logo",
          "Boa noite"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Miguel' significa:",
        "opts": [
          "Olá, meu nome é Miguel",
          "Onde mora?",
          "Qual seu nome?",
          "Meu nome não é"
        ],
        "ans": 0,
        "type": "translation"
      }
    ]
  },
  {
    "id": 6,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Família básica",
    "desc": "Aprenda família básica - tradução correta Lucas=Lucas",
    "time": "11 MIN",
    "phrase": "Hello, my name is Lucas",
    "translation": "Olá, meu nome é Lucas",
    "vocab": [
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Família básica</h4><p><b>Frase:</b> Hello, my name is Lucas = Olá, meu nome é Lucas</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Lucas'",
        "opts": [
          "Olá, meu nome é Lucas",
          "Até logo",
          "Bom dia",
          "Boa noite"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Quantos anos",
          "Onde mora",
          "Meu nome é",
          "Como vai"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Lucas'",
        "opts": [
          "name",
          "good",
          "big",
          "bad"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Lucas'?",
        "opts": [
          "Ao se apresentar",
          "Ao dormir",
          "Ao comer",
          "Ao dirigir"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Please",
          "Thanks",
          "Goodbye",
          "Hello"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "Thank you",
          "My name is Lucas",
          "Goodbye",
          "I am fine"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Como vai?",
          "Qual é seu nome?",
          "Onde mora?",
          "Quantos anos?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Lucas'?",
        "opts": [
          "Carro",
          "Trabalho",
          "Casa",
          "Lucas"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Lucas'",
        "opts": [
          "am",
          "are",
          "be",
          "is"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Lucas'",
        "opts": [
          "My Lucas is name",
          "My name is Lucas",
          "Is my name Lucas",
          "Lucas is my name"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Lucas'",
        "opts": [
          "Até logo",
          "Bom dia",
          "Prazer em conhecer você, Lucas",
          "Boa noite"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Lucas' significa:",
        "opts": [
          "Meu nome não é",
          "Qual seu nome?",
          "Onde mora?",
          "Olá, meu nome é Lucas"
        ],
        "ans": 3,
        "type": "translation"
      }
    ]
  },
  {
    "id": 7,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Cumprimentos formais",
    "desc": "Aprenda cumprimentos formais - tradução correta Maria=Maria",
    "time": "12 MIN",
    "phrase": "Hello, my name is Maria",
    "translation": "Olá, meu nome é Maria",
    "vocab": [
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Cumprimentos formais</h4><p><b>Frase:</b> Hello, my name is Maria = Olá, meu nome é Maria</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Maria'",
        "opts": [
          "Boa noite",
          "Bom dia",
          "Até logo",
          "Olá, meu nome é Maria"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Como vai",
          "Meu nome é",
          "Quantos anos",
          "Onde mora"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Maria'",
        "opts": [
          "good",
          "name",
          "bad",
          "big"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Maria'?",
        "opts": [
          "Ao dirigir",
          "Ao dormir",
          "Ao comer",
          "Ao se apresentar"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Hello",
          "Goodbye",
          "Please",
          "Thanks"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "Goodbye",
          "Thank you",
          "I am fine",
          "My name is Maria"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Quantos anos?",
          "Como vai?",
          "Qual é seu nome?",
          "Onde mora?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Maria'?",
        "opts": [
          "Carro",
          "Trabalho",
          "Maria",
          "Casa"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Maria'",
        "opts": [
          "is",
          "am",
          "be",
          "are"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Maria'",
        "opts": [
          "Maria is my name",
          "Is my name Maria",
          "My Maria is name",
          "My name is Maria"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Maria'",
        "opts": [
          "Boa noite",
          "Prazer em conhecer você, Maria",
          "Até logo",
          "Bom dia"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Maria' significa:",
        "opts": [
          "Meu nome não é",
          "Qual seu nome?",
          "Onde mora?",
          "Olá, meu nome é Maria"
        ],
        "ans": 3,
        "type": "translation"
      }
    ]
  },
  {
    "id": 8,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Despedidas",
    "desc": "Aprenda despedidas - tradução correta Ana=Ana",
    "time": "13 MIN",
    "phrase": "Hello, my name is Ana",
    "translation": "Olá, meu nome é Ana",
    "vocab": [
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Despedidas</h4><p><b>Frase:</b> Hello, my name is Ana = Olá, meu nome é Ana</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Ana'",
        "opts": [
          "Olá, meu nome é Ana",
          "Bom dia",
          "Até logo",
          "Boa noite"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Como vai",
          "Meu nome é",
          "Quantos anos",
          "Onde mora"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Ana'",
        "opts": [
          "big",
          "name",
          "good",
          "bad"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Ana'?",
        "opts": [
          "Ao comer",
          "Ao dirigir",
          "Ao dormir",
          "Ao se apresentar"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Please",
          "Thanks",
          "Hello",
          "Goodbye"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "I am fine",
          "Thank you",
          "My name is Ana",
          "Goodbye"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Qual é seu nome?",
          "Como vai?",
          "Onde mora?",
          "Quantos anos?"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Ana'?",
        "opts": [
          "Trabalho",
          "Carro",
          "Ana",
          "Casa"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Ana'",
        "opts": [
          "are",
          "is",
          "am",
          "be"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Ana'",
        "opts": [
          "My Ana is name",
          "Ana is my name",
          "Is my name Ana",
          "My name is Ana"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Ana'",
        "opts": [
          "Boa noite",
          "Bom dia",
          "Até logo",
          "Prazer em conhecer você, Ana"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Ana' significa:",
        "opts": [
          "Meu nome não é",
          "Qual seu nome?",
          "Olá, meu nome é Ana",
          "Onde mora?"
        ],
        "ans": 2,
        "type": "translation"
      }
    ]
  },
  {
    "id": 9,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Como você está",
    "desc": "Aprenda como você está - tradução correta Emma=Emma",
    "time": "6 MIN",
    "phrase": "Hello, my name is Emma",
    "translation": "Olá, meu nome é Emma",
    "vocab": [
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Como você está</h4><p><b>Frase:</b> Hello, my name is Emma = Olá, meu nome é Emma</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Emma'",
        "opts": [
          "Bom dia",
          "Olá, meu nome é Emma",
          "Boa noite",
          "Até logo"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Onde mora",
          "Como vai",
          "Quantos anos",
          "Meu nome é"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Emma'",
        "opts": [
          "big",
          "name",
          "good",
          "bad"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Emma'?",
        "opts": [
          "Ao comer",
          "Ao dormir",
          "Ao dirigir",
          "Ao se apresentar"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Thanks",
          "Hello",
          "Please",
          "Goodbye"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "I am fine",
          "My name is Emma",
          "Thank you",
          "Goodbye"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Como vai?",
          "Quantos anos?",
          "Qual é seu nome?",
          "Onde mora?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Emma'?",
        "opts": [
          "Carro",
          "Trabalho",
          "Casa",
          "Emma"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Emma'",
        "opts": [
          "be",
          "is",
          "am",
          "are"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Emma'",
        "opts": [
          "Is my name Emma",
          "My Emma is name",
          "Emma is my name",
          "My name is Emma"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Emma'",
        "opts": [
          "Boa noite",
          "Bom dia",
          "Até logo",
          "Prazer em conhecer você, Emma"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Emma' significa:",
        "opts": [
          "Meu nome não é",
          "Onde mora?",
          "Qual seu nome?",
          "Olá, meu nome é Emma"
        ],
        "ans": 3,
        "type": "translation"
      }
    ]
  },
  {
    "id": 10,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Números e telefone",
    "desc": "Aprenda números e telefone - tradução correta Ana=Ana",
    "time": "7 MIN",
    "phrase": "Hello, my name is Ana",
    "translation": "Olá, meu nome é Ana",
    "vocab": [
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Números e telefone</h4><p><b>Frase:</b> Hello, my name is Ana = Olá, meu nome é Ana</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Ana'",
        "opts": [
          "Até logo",
          "Bom dia",
          "Boa noite",
          "Olá, meu nome é Ana"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Meu nome é",
          "Quantos anos",
          "Onde mora",
          "Como vai"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Ana'",
        "opts": [
          "name",
          "good",
          "bad",
          "big"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Ana'?",
        "opts": [
          "Ao comer",
          "Ao dirigir",
          "Ao se apresentar",
          "Ao dormir"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Hello",
          "Thanks",
          "Goodbye",
          "Please"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "Goodbye",
          "I am fine",
          "Thank you",
          "My name is Ana"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Qual é seu nome?",
          "Quantos anos?",
          "Como vai?",
          "Onde mora?"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Ana'?",
        "opts": [
          "Trabalho",
          "Ana",
          "Carro",
          "Casa"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Ana'",
        "opts": [
          "am",
          "is",
          "be",
          "are"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Ana'",
        "opts": [
          "My Ana is name",
          "My name is Ana",
          "Ana is my name",
          "Is my name Ana"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Ana'",
        "opts": [
          "Prazer em conhecer você, Ana",
          "Bom dia",
          "Até logo",
          "Boa noite"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Ana' significa:",
        "opts": [
          "Onde mora?",
          "Olá, meu nome é Ana",
          "Qual seu nome?",
          "Meu nome não é"
        ],
        "ans": 1,
        "type": "translation"
      }
    ]
  },
  {
    "id": 11,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Endereço e cidade",
    "desc": "Aprenda endereço e cidade - tradução correta David=David",
    "time": "8 MIN",
    "phrase": "Hello, my name is David",
    "translation": "Olá, meu nome é David",
    "vocab": [
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Endereço e cidade</h4><p><b>Frase:</b> Hello, my name is David = Olá, meu nome é David</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is David'",
        "opts": [
          "Bom dia",
          "Até logo",
          "Boa noite",
          "Olá, meu nome é David"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Como vai",
          "Quantos anos",
          "Meu nome é",
          "Onde mora"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is David'",
        "opts": [
          "name",
          "good",
          "big",
          "bad"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is David'?",
        "opts": [
          "Ao dirigir",
          "Ao comer",
          "Ao dormir",
          "Ao se apresentar"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Thanks",
          "Please",
          "Goodbye",
          "Hello"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "Goodbye",
          "My name is David",
          "I am fine",
          "Thank you"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Onde mora?",
          "Qual é seu nome?",
          "Quantos anos?",
          "Como vai?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is David'?",
        "opts": [
          "Trabalho",
          "David",
          "Carro",
          "Casa"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ David'",
        "opts": [
          "is",
          "are",
          "am",
          "be"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / David'",
        "opts": [
          "David is my name",
          "My David is name",
          "Is my name David",
          "My name is David"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, David'",
        "opts": [
          "Boa noite",
          "Bom dia",
          "Até logo",
          "Prazer em conhecer você, David"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is David' significa:",
        "opts": [
          "Qual seu nome?",
          "Olá, meu nome é David",
          "Onde mora?",
          "Meu nome não é"
        ],
        "ans": 1,
        "type": "translation"
      }
    ]
  },
  {
    "id": 12,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Profissão simples",
    "desc": "Aprenda profissão simples - tradução correta Julia=Julia",
    "time": "9 MIN",
    "phrase": "Hello, my name is Julia",
    "translation": "Olá, meu nome é Julia",
    "vocab": [
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Profissão simples</h4><p><b>Frase:</b> Hello, my name is Julia = Olá, meu nome é Julia</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Julia'",
        "opts": [
          "Até logo",
          "Olá, meu nome é Julia",
          "Boa noite",
          "Bom dia"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Meu nome é",
          "Onde mora",
          "Quantos anos",
          "Como vai"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Julia'",
        "opts": [
          "name",
          "big",
          "good",
          "bad"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Julia'?",
        "opts": [
          "Ao dirigir",
          "Ao dormir",
          "Ao comer",
          "Ao se apresentar"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Please",
          "Thanks",
          "Goodbye",
          "Hello"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "I am fine",
          "Thank you",
          "My name is Julia",
          "Goodbye"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Quantos anos?",
          "Qual é seu nome?",
          "Onde mora?",
          "Como vai?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Julia'?",
        "opts": [
          "Julia",
          "Casa",
          "Trabalho",
          "Carro"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Julia'",
        "opts": [
          "are",
          "be",
          "am",
          "is"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Julia'",
        "opts": [
          "Is my name Julia",
          "My name is Julia",
          "Julia is my name",
          "My Julia is name"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Julia'",
        "opts": [
          "Até logo",
          "Prazer em conhecer você, Julia",
          "Bom dia",
          "Boa noite"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Julia' significa:",
        "opts": [
          "Qual seu nome?",
          "Olá, meu nome é Julia",
          "Meu nome não é",
          "Onde mora?"
        ],
        "ans": 1,
        "type": "translation"
      }
    ]
  },
  {
    "id": 13,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Hobbies favoritos",
    "desc": "Aprenda hobbies favoritos - tradução correta Miguel=Miguel",
    "time": "10 MIN",
    "phrase": "Hello, my name is Miguel",
    "translation": "Olá, meu nome é Miguel",
    "vocab": [
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Hobbies favoritos</h4><p><b>Frase:</b> Hello, my name is Miguel = Olá, meu nome é Miguel</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Miguel'",
        "opts": [
          "Bom dia",
          "Até logo",
          "Olá, meu nome é Miguel",
          "Boa noite"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Quantos anos",
          "Como vai",
          "Onde mora",
          "Meu nome é"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Miguel'",
        "opts": [
          "bad",
          "big",
          "name",
          "good"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Miguel'?",
        "opts": [
          "Ao dirigir",
          "Ao se apresentar",
          "Ao dormir",
          "Ao comer"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Goodbye",
          "Please",
          "Thanks",
          "Hello"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "My name is Miguel",
          "I am fine",
          "Goodbye",
          "Thank you"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Como vai?",
          "Qual é seu nome?",
          "Quantos anos?",
          "Onde mora?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Miguel'?",
        "opts": [
          "Miguel",
          "Carro",
          "Casa",
          "Trabalho"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Miguel'",
        "opts": [
          "am",
          "are",
          "be",
          "is"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Miguel'",
        "opts": [
          "My Miguel is name",
          "My name is Miguel",
          "Miguel is my name",
          "Is my name Miguel"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Miguel'",
        "opts": [
          "Até logo",
          "Bom dia",
          "Prazer em conhecer você, Miguel",
          "Boa noite"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Miguel' significa:",
        "opts": [
          "Onde mora?",
          "Meu nome não é",
          "Olá, meu nome é Miguel",
          "Qual seu nome?"
        ],
        "ans": 2,
        "type": "translation"
      }
    ]
  },
  {
    "id": 14,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Comida favorita",
    "desc": "Aprenda comida favorita - tradução correta David=David",
    "time": "11 MIN",
    "phrase": "Hello, my name is David",
    "translation": "Olá, meu nome é David",
    "vocab": [
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Comida favorita</h4><p><b>Frase:</b> Hello, my name is David = Olá, meu nome é David</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is David'",
        "opts": [
          "Bom dia",
          "Até logo",
          "Boa noite",
          "Olá, meu nome é David"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Meu nome é",
          "Onde mora",
          "Quantos anos",
          "Como vai"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is David'",
        "opts": [
          "name",
          "big",
          "good",
          "bad"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is David'?",
        "opts": [
          "Ao comer",
          "Ao dirigir",
          "Ao se apresentar",
          "Ao dormir"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Thanks",
          "Please",
          "Goodbye",
          "Hello"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "Thank you",
          "My name is David",
          "Goodbye",
          "I am fine"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Quantos anos?",
          "Como vai?",
          "Onde mora?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is David'?",
        "opts": [
          "David",
          "Carro",
          "Casa",
          "Trabalho"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ David'",
        "opts": [
          "am",
          "is",
          "are",
          "be"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / David'",
        "opts": [
          "My David is name",
          "Is my name David",
          "My name is David",
          "David is my name"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, David'",
        "opts": [
          "Bom dia",
          "Até logo",
          "Prazer em conhecer você, David",
          "Boa noite"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is David' significa:",
        "opts": [
          "Meu nome não é",
          "Olá, meu nome é David",
          "Onde mora?",
          "Qual seu nome?"
        ],
        "ans": 1,
        "type": "translation"
      }
    ]
  },
  {
    "id": 15,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Cores favoritas",
    "desc": "Aprenda cores favoritas - tradução correta Emma=Emma",
    "time": "12 MIN",
    "phrase": "Hello, my name is Emma",
    "translation": "Olá, meu nome é Emma",
    "vocab": [
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Cores favoritas</h4><p><b>Frase:</b> Hello, my name is Emma = Olá, meu nome é Emma</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Emma'",
        "opts": [
          "Até logo",
          "Olá, meu nome é Emma",
          "Boa noite",
          "Bom dia"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Onde mora",
          "Meu nome é",
          "Quantos anos",
          "Como vai"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Emma'",
        "opts": [
          "good",
          "name",
          "big",
          "bad"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Emma'?",
        "opts": [
          "Ao dirigir",
          "Ao dormir",
          "Ao se apresentar",
          "Ao comer"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Please",
          "Thanks",
          "Hello",
          "Goodbye"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "I am fine",
          "Thank you",
          "My name is Emma",
          "Goodbye"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Qual é seu nome?",
          "Como vai?",
          "Onde mora?",
          "Quantos anos?"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Emma'?",
        "opts": [
          "Carro",
          "Casa",
          "Trabalho",
          "Emma"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Emma'",
        "opts": [
          "are",
          "am",
          "be",
          "is"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Emma'",
        "opts": [
          "Emma is my name",
          "My name is Emma",
          "My Emma is name",
          "Is my name Emma"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Emma'",
        "opts": [
          "Prazer em conhecer você, Emma",
          "Até logo",
          "Bom dia",
          "Boa noite"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Emma' significa:",
        "opts": [
          "Olá, meu nome é Emma",
          "Onde mora?",
          "Qual seu nome?",
          "Meu nome não é"
        ],
        "ans": 0,
        "type": "translation"
      }
    ]
  },
  {
    "id": 16,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Tempo e clima",
    "desc": "Aprenda tempo e clima - tradução correta Lucas=Lucas",
    "time": "13 MIN",
    "phrase": "Hello, my name is Lucas",
    "translation": "Olá, meu nome é Lucas",
    "vocab": [
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Tempo e clima</h4><p><b>Frase:</b> Hello, my name is Lucas = Olá, meu nome é Lucas</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Lucas'",
        "opts": [
          "Bom dia",
          "Boa noite",
          "Até logo",
          "Olá, meu nome é Lucas"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Quantos anos",
          "Onde mora",
          "Meu nome é",
          "Como vai"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Lucas'",
        "opts": [
          "big",
          "bad",
          "good",
          "name"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Lucas'?",
        "opts": [
          "Ao dormir",
          "Ao comer",
          "Ao dirigir",
          "Ao se apresentar"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Goodbye",
          "Thanks",
          "Hello",
          "Please"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "I am fine",
          "Goodbye",
          "My name is Lucas",
          "Thank you"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Onde mora?",
          "Como vai?",
          "Quantos anos?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Lucas'?",
        "opts": [
          "Carro",
          "Trabalho",
          "Lucas",
          "Casa"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Lucas'",
        "opts": [
          "am",
          "are",
          "is",
          "be"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Lucas'",
        "opts": [
          "Is my name Lucas",
          "My name is Lucas",
          "Lucas is my name",
          "My Lucas is name"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Lucas'",
        "opts": [
          "Boa noite",
          "Bom dia",
          "Prazer em conhecer você, Lucas",
          "Até logo"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Lucas' significa:",
        "opts": [
          "Meu nome não é",
          "Qual seu nome?",
          "Onde mora?",
          "Olá, meu nome é Lucas"
        ],
        "ans": 3,
        "type": "translation"
      }
    ]
  },
  {
    "id": 17,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Dias da semana",
    "desc": "Aprenda dias da semana - tradução correta Julia=Julia",
    "time": "6 MIN",
    "phrase": "Hello, my name is Julia",
    "translation": "Olá, meu nome é Julia",
    "vocab": [
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Dias da semana</h4><p><b>Frase:</b> Hello, my name is Julia = Olá, meu nome é Julia</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Julia'",
        "opts": [
          "Até logo",
          "Boa noite",
          "Olá, meu nome é Julia",
          "Bom dia"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Quantos anos",
          "Como vai",
          "Onde mora",
          "Meu nome é"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Julia'",
        "opts": [
          "bad",
          "big",
          "good",
          "name"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Julia'?",
        "opts": [
          "Ao se apresentar",
          "Ao dormir",
          "Ao dirigir",
          "Ao comer"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Goodbye",
          "Please",
          "Thanks",
          "Hello"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "Thank you",
          "I am fine",
          "Goodbye",
          "My name is Julia"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Quantos anos?",
          "Onde mora?",
          "Qual é seu nome?",
          "Como vai?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Julia'?",
        "opts": [
          "Trabalho",
          "Casa",
          "Julia",
          "Carro"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Julia'",
        "opts": [
          "am",
          "is",
          "are",
          "be"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Julia'",
        "opts": [
          "Is my name Julia",
          "My Julia is name",
          "Julia is my name",
          "My name is Julia"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Julia'",
        "opts": [
          "Boa noite",
          "Até logo",
          "Prazer em conhecer você, Julia",
          "Bom dia"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Julia' significa:",
        "opts": [
          "Onde mora?",
          "Olá, meu nome é Julia",
          "Qual seu nome?",
          "Meu nome não é"
        ],
        "ans": 1,
        "type": "translation"
      }
    ]
  },
  {
    "id": 18,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Horas e compromissos",
    "desc": "Aprenda horas e compromissos - tradução correta Miguel=Miguel",
    "time": "7 MIN",
    "phrase": "Hello, my name is Miguel",
    "translation": "Olá, meu nome é Miguel",
    "vocab": [
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Horas e compromissos</h4><p><b>Frase:</b> Hello, my name is Miguel = Olá, meu nome é Miguel</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Miguel'",
        "opts": [
          "Até logo",
          "Boa noite",
          "Bom dia",
          "Olá, meu nome é Miguel"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Onde mora",
          "Meu nome é",
          "Como vai",
          "Quantos anos"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Miguel'",
        "opts": [
          "good",
          "name",
          "big",
          "bad"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Miguel'?",
        "opts": [
          "Ao dirigir",
          "Ao dormir",
          "Ao se apresentar",
          "Ao comer"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Please",
          "Thanks",
          "Hello",
          "Goodbye"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "I am fine",
          "Goodbye",
          "My name is Miguel",
          "Thank you"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Qual é seu nome?",
          "Quantos anos?",
          "Onde mora?",
          "Como vai?"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Miguel'?",
        "opts": [
          "Carro",
          "Trabalho",
          "Casa",
          "Miguel"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Miguel'",
        "opts": [
          "are",
          "am",
          "be",
          "is"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Miguel'",
        "opts": [
          "Miguel is my name",
          "My name is Miguel",
          "Is my name Miguel",
          "My Miguel is name"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Miguel'",
        "opts": [
          "Prazer em conhecer você, Miguel",
          "Boa noite",
          "Até logo",
          "Bom dia"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Miguel' significa:",
        "opts": [
          "Onde mora?",
          "Olá, meu nome é Miguel",
          "Qual seu nome?",
          "Meu nome não é"
        ],
        "ans": 1,
        "type": "translation"
      }
    ]
  },
  {
    "id": 19,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Família estendida",
    "desc": "Aprenda família estendida - tradução correta Ana=Ana",
    "time": "8 MIN",
    "phrase": "Hello, my name is Ana",
    "translation": "Olá, meu nome é Ana",
    "vocab": [
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Família estendida</h4><p><b>Frase:</b> Hello, my name is Ana = Olá, meu nome é Ana</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Ana'",
        "opts": [
          "Bom dia",
          "Olá, meu nome é Ana",
          "Boa noite",
          "Até logo"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Como vai",
          "Onde mora",
          "Quantos anos",
          "Meu nome é"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Ana'",
        "opts": [
          "bad",
          "big",
          "name",
          "good"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Ana'?",
        "opts": [
          "Ao se apresentar",
          "Ao dirigir",
          "Ao dormir",
          "Ao comer"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Goodbye",
          "Please",
          "Hello",
          "Thanks"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "Thank you",
          "My name is Ana",
          "I am fine",
          "Goodbye"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Qual é seu nome?",
          "Quantos anos?",
          "Onde mora?",
          "Como vai?"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Ana'?",
        "opts": [
          "Carro",
          "Trabalho",
          "Ana",
          "Casa"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Ana'",
        "opts": [
          "is",
          "am",
          "be",
          "are"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Ana'",
        "opts": [
          "My name is Ana",
          "My Ana is name",
          "Ana is my name",
          "Is my name Ana"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Ana'",
        "opts": [
          "Até logo",
          "Bom dia",
          "Prazer em conhecer você, Ana",
          "Boa noite"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Ana' significa:",
        "opts": [
          "Qual seu nome?",
          "Olá, meu nome é Ana",
          "Onde mora?",
          "Meu nome não é"
        ],
        "ans": 1,
        "type": "translation"
      }
    ]
  },
  {
    "id": 20,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Casa e moradia",
    "desc": "Aprenda casa e moradia - tradução correta Julia=Julia",
    "time": "9 MIN",
    "phrase": "Hello, my name is Julia",
    "translation": "Olá, meu nome é Julia",
    "vocab": [
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Casa e moradia</h4><p><b>Frase:</b> Hello, my name is Julia = Olá, meu nome é Julia</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Julia'",
        "opts": [
          "Olá, meu nome é Julia",
          "Bom dia",
          "Até logo",
          "Boa noite"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Onde mora",
          "Quantos anos",
          "Como vai",
          "Meu nome é"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Julia'",
        "opts": [
          "good",
          "big",
          "name",
          "bad"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Julia'?",
        "opts": [
          "Ao se apresentar",
          "Ao comer",
          "Ao dormir",
          "Ao dirigir"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Thanks",
          "Goodbye",
          "Please",
          "Hello"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "I am fine",
          "Thank you",
          "My name is Julia",
          "Goodbye"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Qual é seu nome?",
          "Onde mora?",
          "Como vai?",
          "Quantos anos?"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Julia'?",
        "opts": [
          "Carro",
          "Casa",
          "Julia",
          "Trabalho"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Julia'",
        "opts": [
          "be",
          "is",
          "am",
          "are"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Julia'",
        "opts": [
          "My Julia is name",
          "Julia is my name",
          "Is my name Julia",
          "My name is Julia"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Julia'",
        "opts": [
          "Prazer em conhecer você, Julia",
          "Boa noite",
          "Até logo",
          "Bom dia"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Julia' significa:",
        "opts": [
          "Onde mora?",
          "Meu nome não é",
          "Qual seu nome?",
          "Olá, meu nome é Julia"
        ],
        "ans": 3,
        "type": "translation"
      }
    ]
  },
  {
    "id": 21,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Rotina matinal",
    "desc": "Aprenda rotina matinal - tradução correta Ana=Ana",
    "time": "10 MIN",
    "phrase": "Hello, my name is Ana",
    "translation": "Olá, meu nome é Ana",
    "vocab": [
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Rotina matinal</h4><p><b>Frase:</b> Hello, my name is Ana = Olá, meu nome é Ana</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Ana'",
        "opts": [
          "Olá, meu nome é Ana",
          "Bom dia",
          "Boa noite",
          "Até logo"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Onde mora",
          "Meu nome é",
          "Quantos anos",
          "Como vai"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Ana'",
        "opts": [
          "name",
          "good",
          "bad",
          "big"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Ana'?",
        "opts": [
          "Ao se apresentar",
          "Ao comer",
          "Ao dormir",
          "Ao dirigir"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Goodbye",
          "Please",
          "Hello",
          "Thanks"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "My name is Ana",
          "Thank you",
          "I am fine",
          "Goodbye"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Quantos anos?",
          "Qual é seu nome?",
          "Onde mora?",
          "Como vai?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Ana'?",
        "opts": [
          "Ana",
          "Trabalho",
          "Carro",
          "Casa"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Ana'",
        "opts": [
          "be",
          "are",
          "am",
          "is"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Ana'",
        "opts": [
          "Ana is my name",
          "My name is Ana",
          "Is my name Ana",
          "My Ana is name"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Ana'",
        "opts": [
          "Até logo",
          "Boa noite",
          "Prazer em conhecer você, Ana",
          "Bom dia"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Ana' significa:",
        "opts": [
          "Meu nome não é",
          "Qual seu nome?",
          "Onde mora?",
          "Olá, meu nome é Ana"
        ],
        "ans": 3,
        "type": "translation"
      }
    ]
  },
  {
    "id": 22,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Rotina noturna",
    "desc": "Aprenda rotina noturna - tradução correta Lucas=Lucas",
    "time": "11 MIN",
    "phrase": "Hello, my name is Lucas",
    "translation": "Olá, meu nome é Lucas",
    "vocab": [
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Rotina noturna</h4><p><b>Frase:</b> Hello, my name is Lucas = Olá, meu nome é Lucas</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Lucas'",
        "opts": [
          "Até logo",
          "Olá, meu nome é Lucas",
          "Boa noite",
          "Bom dia"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Meu nome é",
          "Quantos anos",
          "Onde mora",
          "Como vai"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Lucas'",
        "opts": [
          "name",
          "big",
          "bad",
          "good"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Lucas'?",
        "opts": [
          "Ao dirigir",
          "Ao comer",
          "Ao se apresentar",
          "Ao dormir"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Goodbye",
          "Thanks",
          "Hello",
          "Please"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "I am fine",
          "Goodbye",
          "Thank you",
          "My name is Lucas"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Quantos anos?",
          "Qual é seu nome?",
          "Onde mora?",
          "Como vai?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Lucas'?",
        "opts": [
          "Casa",
          "Lucas",
          "Carro",
          "Trabalho"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Lucas'",
        "opts": [
          "be",
          "are",
          "am",
          "is"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Lucas'",
        "opts": [
          "My name is Lucas",
          "Lucas is my name",
          "Is my name Lucas",
          "My Lucas is name"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Lucas'",
        "opts": [
          "Bom dia",
          "Boa noite",
          "Prazer em conhecer você, Lucas",
          "Até logo"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Lucas' significa:",
        "opts": [
          "Olá, meu nome é Lucas",
          "Qual seu nome?",
          "Meu nome não é",
          "Onde mora?"
        ],
        "ans": 0,
        "type": "translation"
      }
    ]
  },
  {
    "id": 23,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Fim de semana",
    "desc": "Aprenda fim de semana - tradução correta John=John",
    "time": "12 MIN",
    "phrase": "Hello, my name is John",
    "translation": "Olá, meu nome é John",
    "vocab": [
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Fim de semana</h4><p><b>Frase:</b> Hello, my name is John = Olá, meu nome é John</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is John'",
        "opts": [
          "Bom dia",
          "Olá, meu nome é John",
          "Até logo",
          "Boa noite"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Meu nome é",
          "Quantos anos",
          "Como vai",
          "Onde mora"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is John'",
        "opts": [
          "name",
          "big",
          "bad",
          "good"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is John'?",
        "opts": [
          "Ao dirigir",
          "Ao comer",
          "Ao dormir",
          "Ao se apresentar"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Please",
          "Hello",
          "Thanks",
          "Goodbye"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "Thank you",
          "Goodbye",
          "My name is John",
          "I am fine"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Como vai?",
          "Quantos anos?",
          "Onde mora?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is John'?",
        "opts": [
          "Trabalho",
          "Casa",
          "John",
          "Carro"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ John'",
        "opts": [
          "are",
          "is",
          "am",
          "be"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / John'",
        "opts": [
          "John is my name",
          "Is my name John",
          "My John is name",
          "My name is John"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, John'",
        "opts": [
          "Bom dia",
          "Prazer em conhecer você, John",
          "Boa noite",
          "Até logo"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is John' significa:",
        "opts": [
          "Meu nome não é",
          "Olá, meu nome é John",
          "Qual seu nome?",
          "Onde mora?"
        ],
        "ans": 1,
        "type": "translation"
      }
    ]
  },
  {
    "id": 24,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Compras básicas",
    "desc": "Aprenda compras básicas - tradução correta Miguel=Miguel",
    "time": "13 MIN",
    "phrase": "Hello, my name is Miguel",
    "translation": "Olá, meu nome é Miguel",
    "vocab": [
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Compras básicas</h4><p><b>Frase:</b> Hello, my name is Miguel = Olá, meu nome é Miguel</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Miguel'",
        "opts": [
          "Bom dia",
          "Boa noite",
          "Até logo",
          "Olá, meu nome é Miguel"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Como vai",
          "Meu nome é",
          "Quantos anos",
          "Onde mora"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Miguel'",
        "opts": [
          "good",
          "bad",
          "name",
          "big"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Miguel'?",
        "opts": [
          "Ao se apresentar",
          "Ao dirigir",
          "Ao comer",
          "Ao dormir"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Hello",
          "Thanks",
          "Please",
          "Goodbye"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "I am fine",
          "Goodbye",
          "Thank you",
          "My name is Miguel"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Onde mora?",
          "Qual é seu nome?",
          "Como vai?",
          "Quantos anos?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Miguel'?",
        "opts": [
          "Carro",
          "Casa",
          "Trabalho",
          "Miguel"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Miguel'",
        "opts": [
          "be",
          "am",
          "is",
          "are"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Miguel'",
        "opts": [
          "Is my name Miguel",
          "Miguel is my name",
          "My Miguel is name",
          "My name is Miguel"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Miguel'",
        "opts": [
          "Bom dia",
          "Prazer em conhecer você, Miguel",
          "Boa noite",
          "Até logo"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Miguel' significa:",
        "opts": [
          "Meu nome não é",
          "Onde mora?",
          "Olá, meu nome é Miguel",
          "Qual seu nome?"
        ],
        "ans": 2,
        "type": "translation"
      }
    ]
  },
  {
    "id": 25,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Transporte",
    "desc": "Aprenda transporte - tradução correta Ana=Ana",
    "time": "6 MIN",
    "phrase": "Hello, my name is Ana",
    "translation": "Olá, meu nome é Ana",
    "vocab": [
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Transporte</h4><p><b>Frase:</b> Hello, my name is Ana = Olá, meu nome é Ana</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Ana'",
        "opts": [
          "Bom dia",
          "Até logo",
          "Boa noite",
          "Olá, meu nome é Ana"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Onde mora",
          "Meu nome é",
          "Quantos anos",
          "Como vai"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Ana'",
        "opts": [
          "good",
          "bad",
          "big",
          "name"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Ana'?",
        "opts": [
          "Ao dirigir",
          "Ao dormir",
          "Ao comer",
          "Ao se apresentar"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Hello",
          "Please",
          "Goodbye",
          "Thanks"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "My name is Ana",
          "Thank you",
          "I am fine",
          "Goodbye"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Quantos anos?",
          "Onde mora?",
          "Qual é seu nome?",
          "Como vai?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Ana'?",
        "opts": [
          "Ana",
          "Carro",
          "Casa",
          "Trabalho"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Ana'",
        "opts": [
          "am",
          "are",
          "be",
          "is"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Ana'",
        "opts": [
          "My Ana is name",
          "Ana is my name",
          "My name is Ana",
          "Is my name Ana"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Ana'",
        "opts": [
          "Até logo",
          "Bom dia",
          "Prazer em conhecer você, Ana",
          "Boa noite"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Ana' significa:",
        "opts": [
          "Olá, meu nome é Ana",
          "Qual seu nome?",
          "Onde mora?",
          "Meu nome não é"
        ],
        "ans": 0,
        "type": "translation"
      }
    ]
  },
  {
    "id": 26,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Comida e restaurante",
    "desc": "Aprenda comida e restaurante - tradução correta Sarah=Sarah",
    "time": "7 MIN",
    "phrase": "Hello, my name is Sarah",
    "translation": "Olá, meu nome é Sarah",
    "vocab": [
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Comida e restaurante</h4><p><b>Frase:</b> Hello, my name is Sarah = Olá, meu nome é Sarah</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Sarah'",
        "opts": [
          "Bom dia",
          "Olá, meu nome é Sarah",
          "Até logo",
          "Boa noite"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Quantos anos",
          "Como vai",
          "Onde mora",
          "Meu nome é"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Sarah'",
        "opts": [
          "name",
          "big",
          "good",
          "bad"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Sarah'?",
        "opts": [
          "Ao dormir",
          "Ao se apresentar",
          "Ao comer",
          "Ao dirigir"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Please",
          "Thanks",
          "Goodbye",
          "Hello"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "My name is Sarah",
          "Thank you",
          "I am fine",
          "Goodbye"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Quantos anos?",
          "Onde mora?",
          "Como vai?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Sarah'?",
        "opts": [
          "Sarah",
          "Casa",
          "Carro",
          "Trabalho"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Sarah'",
        "opts": [
          "are",
          "be",
          "is",
          "am"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Sarah'",
        "opts": [
          "Is my name Sarah",
          "My name is Sarah",
          "My Sarah is name",
          "Sarah is my name"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Sarah'",
        "opts": [
          "Bom dia",
          "Boa noite",
          "Até logo",
          "Prazer em conhecer você, Sarah"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Sarah' significa:",
        "opts": [
          "Olá, meu nome é Sarah",
          "Meu nome não é",
          "Qual seu nome?",
          "Onde mora?"
        ],
        "ans": 0,
        "type": "translation"
      }
    ]
  },
  {
    "id": 27,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Bebidas",
    "desc": "Aprenda bebidas - tradução correta Emma=Emma",
    "time": "8 MIN",
    "phrase": "Hello, my name is Emma",
    "translation": "Olá, meu nome é Emma",
    "vocab": [
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Bebidas</h4><p><b>Frase:</b> Hello, my name is Emma = Olá, meu nome é Emma</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Emma'",
        "opts": [
          "Até logo",
          "Boa noite",
          "Olá, meu nome é Emma",
          "Bom dia"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Meu nome é",
          "Onde mora",
          "Quantos anos",
          "Como vai"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Emma'",
        "opts": [
          "bad",
          "good",
          "name",
          "big"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Emma'?",
        "opts": [
          "Ao dormir",
          "Ao dirigir",
          "Ao comer",
          "Ao se apresentar"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Hello",
          "Goodbye",
          "Thanks",
          "Please"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "I am fine",
          "My name is Emma",
          "Thank you",
          "Goodbye"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Qual é seu nome?",
          "Quantos anos?",
          "Onde mora?",
          "Como vai?"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Emma'?",
        "opts": [
          "Trabalho",
          "Carro",
          "Casa",
          "Emma"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Emma'",
        "opts": [
          "are",
          "is",
          "be",
          "am"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Emma'",
        "opts": [
          "Is my name Emma",
          "My name is Emma",
          "Emma is my name",
          "My Emma is name"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Emma'",
        "opts": [
          "Até logo",
          "Prazer em conhecer você, Emma",
          "Bom dia",
          "Boa noite"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Emma' significa:",
        "opts": [
          "Meu nome não é",
          "Onde mora?",
          "Olá, meu nome é Emma",
          "Qual seu nome?"
        ],
        "ans": 2,
        "type": "translation"
      }
    ]
  },
  {
    "id": 28,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Pedindo ajuda",
    "desc": "Aprenda pedindo ajuda - tradução correta Pedro=Pedro",
    "time": "9 MIN",
    "phrase": "Hello, my name is Pedro",
    "translation": "Olá, meu nome é Pedro",
    "vocab": [
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Pedindo ajuda</h4><p><b>Frase:</b> Hello, my name is Pedro = Olá, meu nome é Pedro</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Pedro'",
        "opts": [
          "Bom dia",
          "Até logo",
          "Olá, meu nome é Pedro",
          "Boa noite"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Onde mora",
          "Meu nome é",
          "Como vai",
          "Quantos anos"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Pedro'",
        "opts": [
          "big",
          "bad",
          "good",
          "name"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Pedro'?",
        "opts": [
          "Ao comer",
          "Ao dirigir",
          "Ao dormir",
          "Ao se apresentar"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Thanks",
          "Hello",
          "Goodbye",
          "Please"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "My name is Pedro",
          "Goodbye",
          "Thank you",
          "I am fine"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Onde mora?",
          "Qual é seu nome?",
          "Quantos anos?",
          "Como vai?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Pedro'?",
        "opts": [
          "Trabalho",
          "Casa",
          "Carro",
          "Pedro"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Pedro'",
        "opts": [
          "be",
          "is",
          "are",
          "am"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Pedro'",
        "opts": [
          "Pedro is my name",
          "My Pedro is name",
          "My name is Pedro",
          "Is my name Pedro"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Pedro'",
        "opts": [
          "Até logo",
          "Bom dia",
          "Boa noite",
          "Prazer em conhecer você, Pedro"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Pedro' significa:",
        "opts": [
          "Meu nome não é",
          "Qual seu nome?",
          "Onde mora?",
          "Olá, meu nome é Pedro"
        ],
        "ans": 3,
        "type": "translation"
      }
    ]
  },
  {
    "id": 29,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Direções simples",
    "desc": "Aprenda direções simples - tradução correta Miguel=Miguel",
    "time": "10 MIN",
    "phrase": "Hello, my name is Miguel",
    "translation": "Olá, meu nome é Miguel",
    "vocab": [
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Direções simples</h4><p><b>Frase:</b> Hello, my name is Miguel = Olá, meu nome é Miguel</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Miguel'",
        "opts": [
          "Até logo",
          "Boa noite",
          "Bom dia",
          "Olá, meu nome é Miguel"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Como vai",
          "Onde mora",
          "Meu nome é",
          "Quantos anos"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Miguel'",
        "opts": [
          "good",
          "name",
          "big",
          "bad"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Miguel'?",
        "opts": [
          "Ao dormir",
          "Ao comer",
          "Ao dirigir",
          "Ao se apresentar"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Please",
          "Thanks",
          "Hello",
          "Goodbye"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "My name is Miguel",
          "I am fine",
          "Goodbye",
          "Thank you"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Onde mora?",
          "Qual é seu nome?",
          "Quantos anos?",
          "Como vai?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Miguel'?",
        "opts": [
          "Carro",
          "Miguel",
          "Casa",
          "Trabalho"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Miguel'",
        "opts": [
          "is",
          "be",
          "am",
          "are"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Miguel'",
        "opts": [
          "My Miguel is name",
          "My name is Miguel",
          "Miguel is my name",
          "Is my name Miguel"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Miguel'",
        "opts": [
          "Até logo",
          "Boa noite",
          "Prazer em conhecer você, Miguel",
          "Bom dia"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Miguel' significa:",
        "opts": [
          "Qual seu nome?",
          "Onde mora?",
          "Olá, meu nome é Miguel",
          "Meu nome não é"
        ],
        "ans": 2,
        "type": "translation"
      }
    ]
  },
  {
    "id": 30,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Preços e dinheiro",
    "desc": "Aprenda preços e dinheiro - tradução correta Sarah=Sarah",
    "time": "11 MIN",
    "phrase": "Hello, my name is Sarah",
    "translation": "Olá, meu nome é Sarah",
    "vocab": [
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Preços e dinheiro</h4><p><b>Frase:</b> Hello, my name is Sarah = Olá, meu nome é Sarah</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Sarah'",
        "opts": [
          "Bom dia",
          "Até logo",
          "Boa noite",
          "Olá, meu nome é Sarah"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Como vai",
          "Onde mora",
          "Quantos anos",
          "Meu nome é"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Sarah'",
        "opts": [
          "big",
          "name",
          "good",
          "bad"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Sarah'?",
        "opts": [
          "Ao dormir",
          "Ao comer",
          "Ao se apresentar",
          "Ao dirigir"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Thanks",
          "Hello",
          "Please",
          "Goodbye"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "My name is Sarah",
          "Thank you",
          "I am fine",
          "Goodbye"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Qual é seu nome?",
          "Quantos anos?",
          "Como vai?",
          "Onde mora?"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Sarah'?",
        "opts": [
          "Sarah",
          "Carro",
          "Casa",
          "Trabalho"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Sarah'",
        "opts": [
          "am",
          "be",
          "is",
          "are"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Sarah'",
        "opts": [
          "Sarah is my name",
          "My Sarah is name",
          "Is my name Sarah",
          "My name is Sarah"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Sarah'",
        "opts": [
          "Até logo",
          "Boa noite",
          "Prazer em conhecer você, Sarah",
          "Bom dia"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Sarah' significa:",
        "opts": [
          "Onde mora?",
          "Qual seu nome?",
          "Olá, meu nome é Sarah",
          "Meu nome não é"
        ],
        "ans": 2,
        "type": "translation"
      }
    ]
  },
  {
    "id": 31,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Roupas",
    "desc": "Aprenda roupas - tradução correta Carlos=Carlos",
    "time": "12 MIN",
    "phrase": "Hello, my name is Carlos",
    "translation": "Olá, meu nome é Carlos",
    "vocab": [
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Roupas</h4><p><b>Frase:</b> Hello, my name is Carlos = Olá, meu nome é Carlos</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Carlos'",
        "opts": [
          "Até logo",
          "Boa noite",
          "Bom dia",
          "Olá, meu nome é Carlos"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Onde mora",
          "Como vai",
          "Quantos anos",
          "Meu nome é"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Carlos'",
        "opts": [
          "big",
          "name",
          "good",
          "bad"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Carlos'?",
        "opts": [
          "Ao dirigir",
          "Ao dormir",
          "Ao comer",
          "Ao se apresentar"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Goodbye",
          "Please",
          "Hello",
          "Thanks"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "Goodbye",
          "My name is Carlos",
          "I am fine",
          "Thank you"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Onde mora?",
          "Quantos anos?",
          "Qual é seu nome?",
          "Como vai?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Carlos'?",
        "opts": [
          "Trabalho",
          "Carlos",
          "Casa",
          "Carro"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Carlos'",
        "opts": [
          "be",
          "is",
          "are",
          "am"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Carlos'",
        "opts": [
          "Carlos is my name",
          "My Carlos is name",
          "Is my name Carlos",
          "My name is Carlos"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Carlos'",
        "opts": [
          "Boa noite",
          "Até logo",
          "Bom dia",
          "Prazer em conhecer você, Carlos"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Carlos' significa:",
        "opts": [
          "Qual seu nome?",
          "Meu nome não é",
          "Olá, meu nome é Carlos",
          "Onde mora?"
        ],
        "ans": 2,
        "type": "translation"
      }
    ]
  },
  {
    "id": 32,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Saúde básica",
    "desc": "Aprenda saúde básica - tradução correta David=David",
    "time": "13 MIN",
    "phrase": "Hello, my name is David",
    "translation": "Olá, meu nome é David",
    "vocab": [
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Saúde básica</h4><p><b>Frase:</b> Hello, my name is David = Olá, meu nome é David</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is David'",
        "opts": [
          "Até logo",
          "Boa noite",
          "Olá, meu nome é David",
          "Bom dia"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Quantos anos",
          "Meu nome é",
          "Como vai",
          "Onde mora"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is David'",
        "opts": [
          "good",
          "name",
          "big",
          "bad"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is David'?",
        "opts": [
          "Ao se apresentar",
          "Ao dormir",
          "Ao comer",
          "Ao dirigir"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Thanks",
          "Goodbye",
          "Please",
          "Hello"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "Thank you",
          "I am fine",
          "Goodbye",
          "My name is David"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Como vai?",
          "Onde mora?",
          "Qual é seu nome?",
          "Quantos anos?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is David'?",
        "opts": [
          "Trabalho",
          "Casa",
          "Carro",
          "David"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ David'",
        "opts": [
          "be",
          "is",
          "am",
          "are"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / David'",
        "opts": [
          "David is my name",
          "Is my name David",
          "My David is name",
          "My name is David"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, David'",
        "opts": [
          "Prazer em conhecer você, David",
          "Até logo",
          "Boa noite",
          "Bom dia"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is David' significa:",
        "opts": [
          "Olá, meu nome é David",
          "Onde mora?",
          "Qual seu nome?",
          "Meu nome não é"
        ],
        "ans": 0,
        "type": "translation"
      }
    ]
  },
  {
    "id": 33,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Emoções",
    "desc": "Aprenda emoções - tradução correta Lucas=Lucas",
    "time": "6 MIN",
    "phrase": "Hello, my name is Lucas",
    "translation": "Olá, meu nome é Lucas",
    "vocab": [
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Emoções</h4><p><b>Frase:</b> Hello, my name is Lucas = Olá, meu nome é Lucas</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Lucas'",
        "opts": [
          "Boa noite",
          "Olá, meu nome é Lucas",
          "Até logo",
          "Bom dia"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Meu nome é",
          "Quantos anos",
          "Onde mora",
          "Como vai"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Lucas'",
        "opts": [
          "big",
          "good",
          "bad",
          "name"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Lucas'?",
        "opts": [
          "Ao dirigir",
          "Ao comer",
          "Ao se apresentar",
          "Ao dormir"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Goodbye",
          "Hello",
          "Please",
          "Thanks"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "I am fine",
          "Goodbye",
          "My name is Lucas",
          "Thank you"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Quantos anos?",
          "Qual é seu nome?",
          "Onde mora?",
          "Como vai?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Lucas'?",
        "opts": [
          "Casa",
          "Carro",
          "Lucas",
          "Trabalho"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Lucas'",
        "opts": [
          "is",
          "are",
          "be",
          "am"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Lucas'",
        "opts": [
          "My name is Lucas",
          "My Lucas is name",
          "Is my name Lucas",
          "Lucas is my name"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Lucas'",
        "opts": [
          "Boa noite",
          "Bom dia",
          "Até logo",
          "Prazer em conhecer você, Lucas"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Lucas' significa:",
        "opts": [
          "Onde mora?",
          "Olá, meu nome é Lucas",
          "Meu nome não é",
          "Qual seu nome?"
        ],
        "ans": 1,
        "type": "translation"
      }
    ]
  },
  {
    "id": 34,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Convites",
    "desc": "Aprenda convites - tradução correta John=John",
    "time": "7 MIN",
    "phrase": "Hello, my name is John",
    "translation": "Olá, meu nome é John",
    "vocab": [
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Convites</h4><p><b>Frase:</b> Hello, my name is John = Olá, meu nome é John</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is John'",
        "opts": [
          "Boa noite",
          "Bom dia",
          "Até logo",
          "Olá, meu nome é John"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Meu nome é",
          "Quantos anos",
          "Onde mora",
          "Como vai"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is John'",
        "opts": [
          "name",
          "big",
          "bad",
          "good"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is John'?",
        "opts": [
          "Ao dirigir",
          "Ao se apresentar",
          "Ao comer",
          "Ao dormir"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Goodbye",
          "Thanks",
          "Hello",
          "Please"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "Goodbye",
          "I am fine",
          "My name is John",
          "Thank you"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Qual é seu nome?",
          "Quantos anos?",
          "Como vai?",
          "Onde mora?"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is John'?",
        "opts": [
          "Trabalho",
          "Carro",
          "Casa",
          "John"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ John'",
        "opts": [
          "am",
          "is",
          "be",
          "are"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / John'",
        "opts": [
          "My name is John",
          "John is my name",
          "My John is name",
          "Is my name John"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, John'",
        "opts": [
          "Prazer em conhecer você, John",
          "Até logo",
          "Bom dia",
          "Boa noite"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is John' significa:",
        "opts": [
          "Onde mora?",
          "Olá, meu nome é John",
          "Meu nome não é",
          "Qual seu nome?"
        ],
        "ans": 1,
        "type": "translation"
      }
    ]
  },
  {
    "id": 35,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Telefone",
    "desc": "Aprenda telefone - tradução correta Maria=Maria",
    "time": "8 MIN",
    "phrase": "Hello, my name is Maria",
    "translation": "Olá, meu nome é Maria",
    "vocab": [
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Telefone</h4><p><b>Frase:</b> Hello, my name is Maria = Olá, meu nome é Maria</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Maria'",
        "opts": [
          "Até logo",
          "Boa noite",
          "Olá, meu nome é Maria",
          "Bom dia"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Meu nome é",
          "Como vai",
          "Onde mora",
          "Quantos anos"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Maria'",
        "opts": [
          "big",
          "bad",
          "name",
          "good"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Maria'?",
        "opts": [
          "Ao se apresentar",
          "Ao dormir",
          "Ao comer",
          "Ao dirigir"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Please",
          "Thanks",
          "Hello",
          "Goodbye"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "My name is Maria",
          "I am fine",
          "Thank you",
          "Goodbye"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Como vai?",
          "Qual é seu nome?",
          "Onde mora?",
          "Quantos anos?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Maria'?",
        "opts": [
          "Trabalho",
          "Carro",
          "Maria",
          "Casa"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Maria'",
        "opts": [
          "are",
          "is",
          "be",
          "am"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Maria'",
        "opts": [
          "Maria is my name",
          "Is my name Maria",
          "My Maria is name",
          "My name is Maria"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Maria'",
        "opts": [
          "Boa noite",
          "Até logo",
          "Prazer em conhecer você, Maria",
          "Bom dia"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Maria' significa:",
        "opts": [
          "Onde mora?",
          "Qual seu nome?",
          "Meu nome não é",
          "Olá, meu nome é Maria"
        ],
        "ans": 3,
        "type": "translation"
      }
    ]
  },
  {
    "id": 36,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Email e contato",
    "desc": "Aprenda email e contato - tradução correta Maria=Maria",
    "time": "9 MIN",
    "phrase": "Hello, my name is Maria",
    "translation": "Olá, meu nome é Maria",
    "vocab": [
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Email e contato</h4><p><b>Frase:</b> Hello, my name is Maria = Olá, meu nome é Maria</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Maria'",
        "opts": [
          "Olá, meu nome é Maria",
          "Bom dia",
          "Até logo",
          "Boa noite"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Onde mora",
          "Quantos anos",
          "Como vai",
          "Meu nome é"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Maria'",
        "opts": [
          "good",
          "name",
          "bad",
          "big"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Maria'?",
        "opts": [
          "Ao comer",
          "Ao dirigir",
          "Ao se apresentar",
          "Ao dormir"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Hello",
          "Thanks",
          "Goodbye",
          "Please"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "Thank you",
          "I am fine",
          "Goodbye",
          "My name is Maria"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Como vai?",
          "Onde mora?",
          "Qual é seu nome?",
          "Quantos anos?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Maria'?",
        "opts": [
          "Trabalho",
          "Casa",
          "Carro",
          "Maria"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Maria'",
        "opts": [
          "is",
          "am",
          "be",
          "are"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Maria'",
        "opts": [
          "Is my name Maria",
          "Maria is my name",
          "My name is Maria",
          "My Maria is name"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Maria'",
        "opts": [
          "Prazer em conhecer você, Maria",
          "Até logo",
          "Bom dia",
          "Boa noite"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Maria' significa:",
        "opts": [
          "Onde mora?",
          "Qual seu nome?",
          "Meu nome não é",
          "Olá, meu nome é Maria"
        ],
        "ans": 3,
        "type": "translation"
      }
    ]
  },
  {
    "id": 37,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Planos futuros",
    "desc": "Aprenda planos futuros - tradução correta Maria=Maria",
    "time": "10 MIN",
    "phrase": "Hello, my name is Maria",
    "translation": "Olá, meu nome é Maria",
    "vocab": [
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Planos futuros</h4><p><b>Frase:</b> Hello, my name is Maria = Olá, meu nome é Maria</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Maria'",
        "opts": [
          "Olá, meu nome é Maria",
          "Boa noite",
          "Bom dia",
          "Até logo"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Quantos anos",
          "Onde mora",
          "Como vai",
          "Meu nome é"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Maria'",
        "opts": [
          "bad",
          "name",
          "good",
          "big"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Maria'?",
        "opts": [
          "Ao dormir",
          "Ao dirigir",
          "Ao se apresentar",
          "Ao comer"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Goodbye",
          "Please",
          "Hello",
          "Thanks"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "Goodbye",
          "My name is Maria",
          "I am fine",
          "Thank you"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Como vai?",
          "Quantos anos?",
          "Qual é seu nome?",
          "Onde mora?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Maria'?",
        "opts": [
          "Casa",
          "Carro",
          "Maria",
          "Trabalho"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Maria'",
        "opts": [
          "are",
          "am",
          "is",
          "be"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Maria'",
        "opts": [
          "My name is Maria",
          "My Maria is name",
          "Maria is my name",
          "Is my name Maria"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Maria'",
        "opts": [
          "Bom dia",
          "Até logo",
          "Prazer em conhecer você, Maria",
          "Boa noite"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Maria' significa:",
        "opts": [
          "Onde mora?",
          "Olá, meu nome é Maria",
          "Qual seu nome?",
          "Meu nome não é"
        ],
        "ans": 1,
        "type": "translation"
      }
    ]
  },
  {
    "id": 38,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Passado simples",
    "desc": "Aprenda passado simples - tradução correta Ana=Ana",
    "time": "11 MIN",
    "phrase": "Hello, my name is Ana",
    "translation": "Olá, meu nome é Ana",
    "vocab": [
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Passado simples</h4><p><b>Frase:</b> Hello, my name is Ana = Olá, meu nome é Ana</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Ana'",
        "opts": [
          "Bom dia",
          "Olá, meu nome é Ana",
          "Até logo",
          "Boa noite"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Como vai",
          "Meu nome é",
          "Quantos anos",
          "Onde mora"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Ana'",
        "opts": [
          "bad",
          "name",
          "big",
          "good"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Ana'?",
        "opts": [
          "Ao dormir",
          "Ao comer",
          "Ao se apresentar",
          "Ao dirigir"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Hello",
          "Thanks",
          "Goodbye",
          "Please"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "Thank you",
          "My name is Ana",
          "Goodbye",
          "I am fine"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Como vai?",
          "Qual é seu nome?",
          "Quantos anos?",
          "Onde mora?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Ana'?",
        "opts": [
          "Casa",
          "Ana",
          "Trabalho",
          "Carro"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Ana'",
        "opts": [
          "is",
          "am",
          "are",
          "be"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Ana'",
        "opts": [
          "My name is Ana",
          "Ana is my name",
          "Is my name Ana",
          "My Ana is name"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Ana'",
        "opts": [
          "Prazer em conhecer você, Ana",
          "Até logo",
          "Boa noite",
          "Bom dia"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Ana' significa:",
        "opts": [
          "Olá, meu nome é Ana",
          "Onde mora?",
          "Meu nome não é",
          "Qual seu nome?"
        ],
        "ans": 0,
        "type": "translation"
      }
    ]
  },
  {
    "id": 39,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Experiências",
    "desc": "Aprenda experiências - tradução correta Miguel=Miguel",
    "time": "12 MIN",
    "phrase": "Hello, my name is Miguel",
    "translation": "Olá, meu nome é Miguel",
    "vocab": [
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Experiências</h4><p><b>Frase:</b> Hello, my name is Miguel = Olá, meu nome é Miguel</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Miguel'",
        "opts": [
          "Até logo",
          "Bom dia",
          "Boa noite",
          "Olá, meu nome é Miguel"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Meu nome é",
          "Como vai",
          "Quantos anos",
          "Onde mora"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Miguel'",
        "opts": [
          "name",
          "big",
          "bad",
          "good"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Miguel'?",
        "opts": [
          "Ao se apresentar",
          "Ao dormir",
          "Ao dirigir",
          "Ao comer"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Please",
          "Thanks",
          "Goodbye",
          "Hello"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "Goodbye",
          "My name is Miguel",
          "Thank you",
          "I am fine"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Como vai?",
          "Onde mora?",
          "Quantos anos?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Miguel'?",
        "opts": [
          "Miguel",
          "Carro",
          "Casa",
          "Trabalho"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Miguel'",
        "opts": [
          "be",
          "am",
          "are",
          "is"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Miguel'",
        "opts": [
          "My Miguel is name",
          "Is my name Miguel",
          "Miguel is my name",
          "My name is Miguel"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Miguel'",
        "opts": [
          "Boa noite",
          "Bom dia",
          "Até logo",
          "Prazer em conhecer você, Miguel"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Miguel' significa:",
        "opts": [
          "Onde mora?",
          "Meu nome não é",
          "Olá, meu nome é Miguel",
          "Qual seu nome?"
        ],
        "ans": 2,
        "type": "translation"
      }
    ]
  },
  {
    "id": 40,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Preferências",
    "desc": "Aprenda preferências - tradução correta David=David",
    "time": "13 MIN",
    "phrase": "Hello, my name is David",
    "translation": "Olá, meu nome é David",
    "vocab": [
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Preferências</h4><p><b>Frase:</b> Hello, my name is David = Olá, meu nome é David</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is David'",
        "opts": [
          "Bom dia",
          "Até logo",
          "Boa noite",
          "Olá, meu nome é David"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Onde mora",
          "Quantos anos",
          "Meu nome é",
          "Como vai"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is David'",
        "opts": [
          "big",
          "good",
          "bad",
          "name"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is David'?",
        "opts": [
          "Ao se apresentar",
          "Ao dirigir",
          "Ao dormir",
          "Ao comer"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Please",
          "Hello",
          "Thanks",
          "Goodbye"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "I am fine",
          "Thank you",
          "My name is David",
          "Goodbye"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Como vai?",
          "Quantos anos?",
          "Onde mora?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is David'?",
        "opts": [
          "Trabalho",
          "Casa",
          "Carro",
          "David"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ David'",
        "opts": [
          "be",
          "is",
          "am",
          "are"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / David'",
        "opts": [
          "David is my name",
          "My David is name",
          "My name is David",
          "Is my name David"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, David'",
        "opts": [
          "Boa noite",
          "Prazer em conhecer você, David",
          "Bom dia",
          "Até logo"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is David' significa:",
        "opts": [
          "Onde mora?",
          "Qual seu nome?",
          "Olá, meu nome é David",
          "Meu nome não é"
        ],
        "ans": 2,
        "type": "translation"
      }
    ]
  },
  {
    "id": 41,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Opiniões simples",
    "desc": "Aprenda opiniões simples - tradução correta Julia=Julia",
    "time": "6 MIN",
    "phrase": "Hello, my name is Julia",
    "translation": "Olá, meu nome é Julia",
    "vocab": [
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Opiniões simples</h4><p><b>Frase:</b> Hello, my name is Julia = Olá, meu nome é Julia</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Julia'",
        "opts": [
          "Olá, meu nome é Julia",
          "Bom dia",
          "Boa noite",
          "Até logo"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Meu nome é",
          "Onde mora",
          "Quantos anos",
          "Como vai"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Julia'",
        "opts": [
          "name",
          "good",
          "bad",
          "big"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Julia'?",
        "opts": [
          "Ao se apresentar",
          "Ao dirigir",
          "Ao comer",
          "Ao dormir"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Thanks",
          "Goodbye",
          "Hello",
          "Please"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "Goodbye",
          "Thank you",
          "I am fine",
          "My name is Julia"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Onde mora?",
          "Como vai?",
          "Qual é seu nome?",
          "Quantos anos?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Julia'?",
        "opts": [
          "Casa",
          "Julia",
          "Trabalho",
          "Carro"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Julia'",
        "opts": [
          "be",
          "is",
          "are",
          "am"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Julia'",
        "opts": [
          "My Julia is name",
          "My name is Julia",
          "Julia is my name",
          "Is my name Julia"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Julia'",
        "opts": [
          "Bom dia",
          "Prazer em conhecer você, Julia",
          "Boa noite",
          "Até logo"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Julia' significa:",
        "opts": [
          "Olá, meu nome é Julia",
          "Qual seu nome?",
          "Meu nome não é",
          "Onde mora?"
        ],
        "ans": 0,
        "type": "translation"
      }
    ]
  },
  {
    "id": 42,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Comparações",
    "desc": "Aprenda comparações - tradução correta Miguel=Miguel",
    "time": "7 MIN",
    "phrase": "Hello, my name is Miguel",
    "translation": "Olá, meu nome é Miguel",
    "vocab": [
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Comparações</h4><p><b>Frase:</b> Hello, my name is Miguel = Olá, meu nome é Miguel</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Miguel'",
        "opts": [
          "Olá, meu nome é Miguel",
          "Bom dia",
          "Boa noite",
          "Até logo"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Como vai",
          "Quantos anos",
          "Meu nome é",
          "Onde mora"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Miguel'",
        "opts": [
          "good",
          "bad",
          "name",
          "big"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Miguel'?",
        "opts": [
          "Ao comer",
          "Ao se apresentar",
          "Ao dormir",
          "Ao dirigir"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Goodbye",
          "Thanks",
          "Hello",
          "Please"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "My name is Miguel",
          "I am fine",
          "Thank you",
          "Goodbye"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Qual é seu nome?",
          "Onde mora?",
          "Quantos anos?",
          "Como vai?"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Miguel'?",
        "opts": [
          "Casa",
          "Trabalho",
          "Miguel",
          "Carro"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Miguel'",
        "opts": [
          "am",
          "be",
          "are",
          "is"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Miguel'",
        "opts": [
          "My Miguel is name",
          "Is my name Miguel",
          "My name is Miguel",
          "Miguel is my name"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Miguel'",
        "opts": [
          "Boa noite",
          "Até logo",
          "Bom dia",
          "Prazer em conhecer você, Miguel"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Miguel' significa:",
        "opts": [
          "Qual seu nome?",
          "Meu nome não é",
          "Onde mora?",
          "Olá, meu nome é Miguel"
        ],
        "ans": 3,
        "type": "translation"
      }
    ]
  },
  {
    "id": 43,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Conselhos",
    "desc": "Aprenda conselhos - tradução correta Pedro=Pedro",
    "time": "8 MIN",
    "phrase": "Hello, my name is Pedro",
    "translation": "Olá, meu nome é Pedro",
    "vocab": [
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Conselhos</h4><p><b>Frase:</b> Hello, my name is Pedro = Olá, meu nome é Pedro</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Pedro'",
        "opts": [
          "Olá, meu nome é Pedro",
          "Até logo",
          "Bom dia",
          "Boa noite"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Meu nome é",
          "Onde mora",
          "Quantos anos",
          "Como vai"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Pedro'",
        "opts": [
          "big",
          "name",
          "bad",
          "good"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Pedro'?",
        "opts": [
          "Ao se apresentar",
          "Ao comer",
          "Ao dirigir",
          "Ao dormir"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Hello",
          "Thanks",
          "Please",
          "Goodbye"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "Thank you",
          "My name is Pedro",
          "Goodbye",
          "I am fine"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Onde mora?",
          "Como vai?",
          "Quantos anos?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Pedro'?",
        "opts": [
          "Casa",
          "Trabalho",
          "Pedro",
          "Carro"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Pedro'",
        "opts": [
          "is",
          "am",
          "be",
          "are"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Pedro'",
        "opts": [
          "Is my name Pedro",
          "My name is Pedro",
          "My Pedro is name",
          "Pedro is my name"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Pedro'",
        "opts": [
          "Até logo",
          "Bom dia",
          "Boa noite",
          "Prazer em conhecer você, Pedro"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Pedro' significa:",
        "opts": [
          "Meu nome não é",
          "Olá, meu nome é Pedro",
          "Qual seu nome?",
          "Onde mora?"
        ],
        "ans": 1,
        "type": "translation"
      }
    ]
  },
  {
    "id": 44,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Convite para café",
    "desc": "Aprenda convite para café - tradução correta John=John",
    "time": "9 MIN",
    "phrase": "Hello, my name is John",
    "translation": "Olá, meu nome é John",
    "vocab": [
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Convite para café</h4><p><b>Frase:</b> Hello, my name is John = Olá, meu nome é John</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is John'",
        "opts": [
          "Olá, meu nome é John",
          "Até logo",
          "Bom dia",
          "Boa noite"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Onde mora",
          "Como vai",
          "Meu nome é",
          "Quantos anos"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is John'",
        "opts": [
          "big",
          "good",
          "bad",
          "name"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is John'?",
        "opts": [
          "Ao dirigir",
          "Ao dormir",
          "Ao se apresentar",
          "Ao comer"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Hello",
          "Goodbye",
          "Please",
          "Thanks"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "Thank you",
          "I am fine",
          "My name is John",
          "Goodbye"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Como vai?",
          "Onde mora?",
          "Quantos anos?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is John'?",
        "opts": [
          "Trabalho",
          "John",
          "Casa",
          "Carro"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ John'",
        "opts": [
          "am",
          "be",
          "are",
          "is"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / John'",
        "opts": [
          "John is my name",
          "My name is John",
          "My John is name",
          "Is my name John"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, John'",
        "opts": [
          "Boa noite",
          "Bom dia",
          "Prazer em conhecer você, John",
          "Até logo"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is John' significa:",
        "opts": [
          "Qual seu nome?",
          "Meu nome não é",
          "Olá, meu nome é John",
          "Onde mora?"
        ],
        "ans": 2,
        "type": "translation"
      }
    ]
  },
  {
    "id": 45,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Conhecendo vizinhos",
    "desc": "Aprenda conhecendo vizinhos - tradução correta Sarah=Sarah",
    "time": "10 MIN",
    "phrase": "Hello, my name is Sarah",
    "translation": "Olá, meu nome é Sarah",
    "vocab": [
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Conhecendo vizinhos</h4><p><b>Frase:</b> Hello, my name is Sarah = Olá, meu nome é Sarah</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Sarah'",
        "opts": [
          "Olá, meu nome é Sarah",
          "Até logo",
          "Bom dia",
          "Boa noite"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Onde mora",
          "Quantos anos",
          "Como vai",
          "Meu nome é"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Sarah'",
        "opts": [
          "name",
          "bad",
          "big",
          "good"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Sarah'?",
        "opts": [
          "Ao comer",
          "Ao dormir",
          "Ao se apresentar",
          "Ao dirigir"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Thanks",
          "Hello",
          "Goodbye",
          "Please"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "Thank you",
          "Goodbye",
          "My name is Sarah",
          "I am fine"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Quantos anos?",
          "Como vai?",
          "Onde mora?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Sarah'?",
        "opts": [
          "Sarah",
          "Trabalho",
          "Carro",
          "Casa"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Sarah'",
        "opts": [
          "are",
          "be",
          "am",
          "is"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Sarah'",
        "opts": [
          "Sarah is my name",
          "My Sarah is name",
          "My name is Sarah",
          "Is my name Sarah"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Sarah'",
        "opts": [
          "Prazer em conhecer você, Sarah",
          "Boa noite",
          "Até logo",
          "Bom dia"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Sarah' significa:",
        "opts": [
          "Meu nome não é",
          "Olá, meu nome é Sarah",
          "Qual seu nome?",
          "Onde mora?"
        ],
        "ans": 1,
        "type": "translation"
      }
    ]
  },
  {
    "id": 46,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Festa e celebração",
    "desc": "Aprenda festa e celebração - tradução correta Emma=Emma",
    "time": "11 MIN",
    "phrase": "Hello, my name is Emma",
    "translation": "Olá, meu nome é Emma",
    "vocab": [
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Festa e celebração</h4><p><b>Frase:</b> Hello, my name is Emma = Olá, meu nome é Emma</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Emma'",
        "opts": [
          "Até logo",
          "Bom dia",
          "Boa noite",
          "Olá, meu nome é Emma"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Onde mora",
          "Meu nome é",
          "Quantos anos",
          "Como vai"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Emma'",
        "opts": [
          "good",
          "big",
          "bad",
          "name"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Emma'?",
        "opts": [
          "Ao dirigir",
          "Ao dormir",
          "Ao se apresentar",
          "Ao comer"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Thanks",
          "Please",
          "Hello",
          "Goodbye"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "Thank you",
          "Goodbye",
          "My name is Emma",
          "I am fine"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Quantos anos?",
          "Onde mora?",
          "Qual é seu nome?",
          "Como vai?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Emma'?",
        "opts": [
          "Trabalho",
          "Emma",
          "Carro",
          "Casa"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Emma'",
        "opts": [
          "are",
          "am",
          "is",
          "be"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Emma'",
        "opts": [
          "My Emma is name",
          "Emma is my name",
          "My name is Emma",
          "Is my name Emma"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Emma'",
        "opts": [
          "Boa noite",
          "Prazer em conhecer você, Emma",
          "Bom dia",
          "Até logo"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Emma' significa:",
        "opts": [
          "Olá, meu nome é Emma",
          "Meu nome não é",
          "Qual seu nome?",
          "Onde mora?"
        ],
        "ans": 0,
        "type": "translation"
      }
    ]
  },
  {
    "id": 47,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Filmes e música",
    "desc": "Aprenda filmes e música - tradução correta Ana=Ana",
    "time": "12 MIN",
    "phrase": "Hello, my name is Ana",
    "translation": "Olá, meu nome é Ana",
    "vocab": [
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Filmes e música</h4><p><b>Frase:</b> Hello, my name is Ana = Olá, meu nome é Ana</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Ana'",
        "opts": [
          "Olá, meu nome é Ana",
          "Até logo",
          "Bom dia",
          "Boa noite"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Onde mora",
          "Meu nome é",
          "Quantos anos",
          "Como vai"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Ana'",
        "opts": [
          "big",
          "name",
          "bad",
          "good"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Ana'?",
        "opts": [
          "Ao comer",
          "Ao dirigir",
          "Ao dormir",
          "Ao se apresentar"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Goodbye",
          "Hello",
          "Please",
          "Thanks"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "I am fine",
          "Thank you",
          "My name is Ana",
          "Goodbye"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Onde mora?",
          "Como vai?",
          "Qual é seu nome?",
          "Quantos anos?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Ana'?",
        "opts": [
          "Ana",
          "Carro",
          "Casa",
          "Trabalho"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Ana'",
        "opts": [
          "am",
          "are",
          "is",
          "be"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Ana'",
        "opts": [
          "Ana is my name",
          "Is my name Ana",
          "My name is Ana",
          "My Ana is name"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Ana'",
        "opts": [
          "Prazer em conhecer você, Ana",
          "Até logo",
          "Boa noite",
          "Bom dia"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Ana' significa:",
        "opts": [
          "Olá, meu nome é Ana",
          "Qual seu nome?",
          "Onde mora?",
          "Meu nome não é"
        ],
        "ans": 0,
        "type": "translation"
      }
    ]
  },
  {
    "id": 48,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Esportes",
    "desc": "Aprenda esportes - tradução correta John=John",
    "time": "13 MIN",
    "phrase": "Hello, my name is John",
    "translation": "Olá, meu nome é John",
    "vocab": [
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Esportes</h4><p><b>Frase:</b> Hello, my name is John = Olá, meu nome é John</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is John'",
        "opts": [
          "Bom dia",
          "Até logo",
          "Olá, meu nome é John",
          "Boa noite"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Meu nome é",
          "Onde mora",
          "Como vai",
          "Quantos anos"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is John'",
        "opts": [
          "name",
          "good",
          "big",
          "bad"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is John'?",
        "opts": [
          "Ao dormir",
          "Ao se apresentar",
          "Ao dirigir",
          "Ao comer"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Thanks",
          "Please",
          "Hello",
          "Goodbye"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "I am fine",
          "Goodbye",
          "My name is John",
          "Thank you"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Quantos anos?",
          "Onde mora?",
          "Como vai?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is John'?",
        "opts": [
          "Trabalho",
          "John",
          "Carro",
          "Casa"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ John'",
        "opts": [
          "are",
          "is",
          "be",
          "am"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / John'",
        "opts": [
          "John is my name",
          "My John is name",
          "Is my name John",
          "My name is John"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, John'",
        "opts": [
          "Boa noite",
          "Até logo",
          "Bom dia",
          "Prazer em conhecer você, John"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is John' significa:",
        "opts": [
          "Qual seu nome?",
          "Olá, meu nome é John",
          "Onde mora?",
          "Meu nome não é"
        ],
        "ans": 1,
        "type": "translation"
      }
    ]
  },
  {
    "id": 49,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Viagem curta",
    "desc": "Aprenda viagem curta - tradução correta Carlos=Carlos",
    "time": "6 MIN",
    "phrase": "Hello, my name is Carlos",
    "translation": "Olá, meu nome é Carlos",
    "vocab": [
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Viagem curta</h4><p><b>Frase:</b> Hello, my name is Carlos = Olá, meu nome é Carlos</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Carlos'",
        "opts": [
          "Olá, meu nome é Carlos",
          "Até logo",
          "Bom dia",
          "Boa noite"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Meu nome é",
          "Quantos anos",
          "Como vai",
          "Onde mora"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Carlos'",
        "opts": [
          "good",
          "bad",
          "big",
          "name"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Carlos'?",
        "opts": [
          "Ao se apresentar",
          "Ao dormir",
          "Ao comer",
          "Ao dirigir"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Thanks",
          "Goodbye",
          "Please",
          "Hello"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "Thank you",
          "My name is Carlos",
          "I am fine",
          "Goodbye"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Quantos anos?",
          "Qual é seu nome?",
          "Como vai?",
          "Onde mora?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Carlos'?",
        "opts": [
          "Trabalho",
          "Carro",
          "Carlos",
          "Casa"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Carlos'",
        "opts": [
          "be",
          "is",
          "am",
          "are"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Carlos'",
        "opts": [
          "Carlos is my name",
          "Is my name Carlos",
          "My Carlos is name",
          "My name is Carlos"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Carlos'",
        "opts": [
          "Prazer em conhecer você, Carlos",
          "Boa noite",
          "Bom dia",
          "Até logo"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Carlos' significa:",
        "opts": [
          "Onde mora?",
          "Meu nome não é",
          "Qual seu nome?",
          "Olá, meu nome é Carlos"
        ],
        "ans": 3,
        "type": "translation"
      }
    ]
  },
  {
    "id": 50,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Cultura local",
    "desc": "Aprenda cultura local - tradução correta John=John",
    "time": "7 MIN",
    "phrase": "Hello, my name is John",
    "translation": "Olá, meu nome é John",
    "vocab": [
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Cultura local</h4><p><b>Frase:</b> Hello, my name is John = Olá, meu nome é John</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is John'",
        "opts": [
          "Até logo",
          "Olá, meu nome é John",
          "Boa noite",
          "Bom dia"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Como vai",
          "Meu nome é",
          "Onde mora",
          "Quantos anos"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is John'",
        "opts": [
          "bad",
          "big",
          "name",
          "good"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is John'?",
        "opts": [
          "Ao se apresentar",
          "Ao comer",
          "Ao dirigir",
          "Ao dormir"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Goodbye",
          "Hello",
          "Please",
          "Thanks"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "Thank you",
          "I am fine",
          "Goodbye",
          "My name is John"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Qual é seu nome?",
          "Quantos anos?",
          "Como vai?",
          "Onde mora?"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is John'?",
        "opts": [
          "Casa",
          "Trabalho",
          "Carro",
          "John"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ John'",
        "opts": [
          "be",
          "is",
          "are",
          "am"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / John'",
        "opts": [
          "My name is John",
          "John is my name",
          "My John is name",
          "Is my name John"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, John'",
        "opts": [
          "Boa noite",
          "Prazer em conhecer você, John",
          "Bom dia",
          "Até logo"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is John' significa:",
        "opts": [
          "Qual seu nome?",
          "Meu nome não é",
          "Olá, meu nome é John",
          "Onde mora?"
        ],
        "ans": 2,
        "type": "translation"
      }
    ]
  },
  {
    "id": 51,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Olá e apresentações",
    "desc": "Aprenda olá e apresentações - tradução correta Sarah=Sarah",
    "time": "8 MIN",
    "phrase": "Hello, my name is Sarah",
    "translation": "Olá, meu nome é Sarah",
    "vocab": [
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Olá e apresentações</h4><p><b>Frase:</b> Hello, my name is Sarah = Olá, meu nome é Sarah</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Sarah'",
        "opts": [
          "Boa noite",
          "Olá, meu nome é Sarah",
          "Até logo",
          "Bom dia"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Onde mora",
          "Meu nome é",
          "Quantos anos",
          "Como vai"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Sarah'",
        "opts": [
          "big",
          "name",
          "good",
          "bad"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Sarah'?",
        "opts": [
          "Ao dormir",
          "Ao dirigir",
          "Ao se apresentar",
          "Ao comer"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Please",
          "Hello",
          "Goodbye",
          "Thanks"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "Thank you",
          "My name is Sarah",
          "I am fine",
          "Goodbye"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Quantos anos?",
          "Como vai?",
          "Onde mora?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Sarah'?",
        "opts": [
          "Trabalho",
          "Sarah",
          "Carro",
          "Casa"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Sarah'",
        "opts": [
          "are",
          "am",
          "is",
          "be"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Sarah'",
        "opts": [
          "My Sarah is name",
          "Is my name Sarah",
          "Sarah is my name",
          "My name is Sarah"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Sarah'",
        "opts": [
          "Boa noite",
          "Até logo",
          "Bom dia",
          "Prazer em conhecer você, Sarah"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Sarah' significa:",
        "opts": [
          "Qual seu nome?",
          "Meu nome não é",
          "Olá, meu nome é Sarah",
          "Onde mora?"
        ],
        "ans": 2,
        "type": "translation"
      }
    ]
  },
  {
    "id": 52,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Dizendo seu nome",
    "desc": "Aprenda dizendo seu nome - tradução correta Emma=Emma",
    "time": "9 MIN",
    "phrase": "Hello, my name is Emma",
    "translation": "Olá, meu nome é Emma",
    "vocab": [
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Dizendo seu nome</h4><p><b>Frase:</b> Hello, my name is Emma = Olá, meu nome é Emma</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Emma'",
        "opts": [
          "Boa noite",
          "Olá, meu nome é Emma",
          "Bom dia",
          "Até logo"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Como vai",
          "Quantos anos",
          "Meu nome é",
          "Onde mora"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Emma'",
        "opts": [
          "big",
          "bad",
          "name",
          "good"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Emma'?",
        "opts": [
          "Ao dormir",
          "Ao dirigir",
          "Ao comer",
          "Ao se apresentar"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Hello",
          "Goodbye",
          "Thanks",
          "Please"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "Goodbye",
          "My name is Emma",
          "I am fine",
          "Thank you"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Como vai?",
          "Qual é seu nome?",
          "Onde mora?",
          "Quantos anos?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Emma'?",
        "opts": [
          "Casa",
          "Carro",
          "Emma",
          "Trabalho"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Emma'",
        "opts": [
          "are",
          "be",
          "is",
          "am"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Emma'",
        "opts": [
          "Emma is my name",
          "Is my name Emma",
          "My Emma is name",
          "My name is Emma"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Emma'",
        "opts": [
          "Boa noite",
          "Bom dia",
          "Prazer em conhecer você, Emma",
          "Até logo"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Emma' significa:",
        "opts": [
          "Meu nome não é",
          "Onde mora?",
          "Olá, meu nome é Emma",
          "Qual seu nome?"
        ],
        "ans": 2,
        "type": "translation"
      }
    ]
  },
  {
    "id": 53,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "De onde você é",
    "desc": "Aprenda de onde você é - tradução correta Emma=Emma",
    "time": "10 MIN",
    "phrase": "Hello, my name is Emma",
    "translation": "Olá, meu nome é Emma",
    "vocab": [
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 De onde você é</h4><p><b>Frase:</b> Hello, my name is Emma = Olá, meu nome é Emma</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Emma'",
        "opts": [
          "Olá, meu nome é Emma",
          "Até logo",
          "Boa noite",
          "Bom dia"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Onde mora",
          "Como vai",
          "Quantos anos",
          "Meu nome é"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Emma'",
        "opts": [
          "name",
          "good",
          "bad",
          "big"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Emma'?",
        "opts": [
          "Ao dormir",
          "Ao se apresentar",
          "Ao dirigir",
          "Ao comer"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Please",
          "Hello",
          "Thanks",
          "Goodbye"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "My name is Emma",
          "Goodbye",
          "Thank you",
          "I am fine"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Quantos anos?",
          "Como vai?",
          "Onde mora?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Emma'?",
        "opts": [
          "Emma",
          "Casa",
          "Carro",
          "Trabalho"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Emma'",
        "opts": [
          "am",
          "are",
          "be",
          "is"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Emma'",
        "opts": [
          "Is my name Emma",
          "My name is Emma",
          "Emma is my name",
          "My Emma is name"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Emma'",
        "opts": [
          "Boa noite",
          "Prazer em conhecer você, Emma",
          "Bom dia",
          "Até logo"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Emma' significa:",
        "opts": [
          "Meu nome não é",
          "Olá, meu nome é Emma",
          "Qual seu nome?",
          "Onde mora?"
        ],
        "ans": 1,
        "type": "translation"
      }
    ]
  },
  {
    "id": 54,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Perguntando o nome",
    "desc": "Aprenda perguntando o nome - tradução correta Maria=Maria",
    "time": "11 MIN",
    "phrase": "Hello, my name is Maria",
    "translation": "Olá, meu nome é Maria",
    "vocab": [
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Perguntando o nome</h4><p><b>Frase:</b> Hello, my name is Maria = Olá, meu nome é Maria</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Maria'",
        "opts": [
          "Até logo",
          "Boa noite",
          "Bom dia",
          "Olá, meu nome é Maria"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Onde mora",
          "Como vai",
          "Meu nome é",
          "Quantos anos"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Maria'",
        "opts": [
          "big",
          "name",
          "good",
          "bad"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Maria'?",
        "opts": [
          "Ao dirigir",
          "Ao se apresentar",
          "Ao dormir",
          "Ao comer"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Goodbye",
          "Please",
          "Hello",
          "Thanks"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "Thank you",
          "I am fine",
          "My name is Maria",
          "Goodbye"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Onde mora?",
          "Qual é seu nome?",
          "Quantos anos?",
          "Como vai?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Maria'?",
        "opts": [
          "Carro",
          "Trabalho",
          "Maria",
          "Casa"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Maria'",
        "opts": [
          "am",
          "be",
          "are",
          "is"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Maria'",
        "opts": [
          "My name is Maria",
          "My Maria is name",
          "Is my name Maria",
          "Maria is my name"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Maria'",
        "opts": [
          "Até logo",
          "Boa noite",
          "Prazer em conhecer você, Maria",
          "Bom dia"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Maria' significa:",
        "opts": [
          "Onde mora?",
          "Olá, meu nome é Maria",
          "Qual seu nome?",
          "Meu nome não é"
        ],
        "ans": 1,
        "type": "translation"
      }
    ]
  },
  {
    "id": 55,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Idade e aniversário",
    "desc": "Aprenda idade e aniversário - tradução correta Miguel=Miguel",
    "time": "12 MIN",
    "phrase": "Hello, my name is Miguel",
    "translation": "Olá, meu nome é Miguel",
    "vocab": [
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Idade e aniversário</h4><p><b>Frase:</b> Hello, my name is Miguel = Olá, meu nome é Miguel</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Miguel'",
        "opts": [
          "Boa noite",
          "Até logo",
          "Bom dia",
          "Olá, meu nome é Miguel"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Onde mora",
          "Quantos anos",
          "Como vai",
          "Meu nome é"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Miguel'",
        "opts": [
          "good",
          "name",
          "big",
          "bad"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Miguel'?",
        "opts": [
          "Ao dormir",
          "Ao se apresentar",
          "Ao comer",
          "Ao dirigir"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Hello",
          "Please",
          "Thanks",
          "Goodbye"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "My name is Miguel",
          "Goodbye",
          "I am fine",
          "Thank you"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Onde mora?",
          "Quantos anos?",
          "Como vai?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Miguel'?",
        "opts": [
          "Miguel",
          "Casa",
          "Carro",
          "Trabalho"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Miguel'",
        "opts": [
          "are",
          "is",
          "am",
          "be"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Miguel'",
        "opts": [
          "My Miguel is name",
          "Miguel is my name",
          "My name is Miguel",
          "Is my name Miguel"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Miguel'",
        "opts": [
          "Bom dia",
          "Boa noite",
          "Prazer em conhecer você, Miguel",
          "Até logo"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Miguel' significa:",
        "opts": [
          "Onde mora?",
          "Qual seu nome?",
          "Meu nome não é",
          "Olá, meu nome é Miguel"
        ],
        "ans": 3,
        "type": "translation"
      }
    ]
  },
  {
    "id": 56,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Família básica",
    "desc": "Aprenda família básica - tradução correta Miguel=Miguel",
    "time": "13 MIN",
    "phrase": "Hello, my name is Miguel",
    "translation": "Olá, meu nome é Miguel",
    "vocab": [
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Família básica</h4><p><b>Frase:</b> Hello, my name is Miguel = Olá, meu nome é Miguel</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Miguel'",
        "opts": [
          "Olá, meu nome é Miguel",
          "Boa noite",
          "Até logo",
          "Bom dia"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Meu nome é",
          "Onde mora",
          "Quantos anos",
          "Como vai"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Miguel'",
        "opts": [
          "good",
          "name",
          "big",
          "bad"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Miguel'?",
        "opts": [
          "Ao dirigir",
          "Ao dormir",
          "Ao comer",
          "Ao se apresentar"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Hello",
          "Please",
          "Thanks",
          "Goodbye"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "Thank you",
          "I am fine",
          "My name is Miguel",
          "Goodbye"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Quantos anos?",
          "Onde mora?",
          "Qual é seu nome?",
          "Como vai?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Miguel'?",
        "opts": [
          "Casa",
          "Carro",
          "Miguel",
          "Trabalho"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Miguel'",
        "opts": [
          "be",
          "are",
          "is",
          "am"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Miguel'",
        "opts": [
          "Miguel is my name",
          "My Miguel is name",
          "Is my name Miguel",
          "My name is Miguel"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Miguel'",
        "opts": [
          "Bom dia",
          "Prazer em conhecer você, Miguel",
          "Boa noite",
          "Até logo"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Miguel' significa:",
        "opts": [
          "Meu nome não é",
          "Onde mora?",
          "Qual seu nome?",
          "Olá, meu nome é Miguel"
        ],
        "ans": 3,
        "type": "translation"
      }
    ]
  },
  {
    "id": 57,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Cumprimentos formais",
    "desc": "Aprenda cumprimentos formais - tradução correta Lucas=Lucas",
    "time": "6 MIN",
    "phrase": "Hello, my name is Lucas",
    "translation": "Olá, meu nome é Lucas",
    "vocab": [
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Cumprimentos formais</h4><p><b>Frase:</b> Hello, my name is Lucas = Olá, meu nome é Lucas</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Lucas'",
        "opts": [
          "Bom dia",
          "Até logo",
          "Olá, meu nome é Lucas",
          "Boa noite"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Onde mora",
          "Meu nome é",
          "Como vai",
          "Quantos anos"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Lucas'",
        "opts": [
          "name",
          "big",
          "bad",
          "good"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Lucas'?",
        "opts": [
          "Ao dirigir",
          "Ao se apresentar",
          "Ao dormir",
          "Ao comer"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Hello",
          "Goodbye",
          "Please",
          "Thanks"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "My name is Lucas",
          "I am fine",
          "Goodbye",
          "Thank you"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Qual é seu nome?",
          "Quantos anos?",
          "Como vai?",
          "Onde mora?"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Lucas'?",
        "opts": [
          "Casa",
          "Carro",
          "Trabalho",
          "Lucas"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Lucas'",
        "opts": [
          "are",
          "am",
          "be",
          "is"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Lucas'",
        "opts": [
          "Is my name Lucas",
          "Lucas is my name",
          "My Lucas is name",
          "My name is Lucas"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Lucas'",
        "opts": [
          "Até logo",
          "Prazer em conhecer você, Lucas",
          "Bom dia",
          "Boa noite"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Lucas' significa:",
        "opts": [
          "Olá, meu nome é Lucas",
          "Meu nome não é",
          "Qual seu nome?",
          "Onde mora?"
        ],
        "ans": 0,
        "type": "translation"
      }
    ]
  },
  {
    "id": 58,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Despedidas",
    "desc": "Aprenda despedidas - tradução correta Ana=Ana",
    "time": "7 MIN",
    "phrase": "Hello, my name is Ana",
    "translation": "Olá, meu nome é Ana",
    "vocab": [
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Despedidas</h4><p><b>Frase:</b> Hello, my name is Ana = Olá, meu nome é Ana</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Ana'",
        "opts": [
          "Boa noite",
          "Até logo",
          "Bom dia",
          "Olá, meu nome é Ana"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Meu nome é",
          "Quantos anos",
          "Como vai",
          "Onde mora"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Ana'",
        "opts": [
          "good",
          "name",
          "big",
          "bad"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Ana'?",
        "opts": [
          "Ao dormir",
          "Ao se apresentar",
          "Ao comer",
          "Ao dirigir"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Thanks",
          "Goodbye",
          "Hello",
          "Please"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "I am fine",
          "Thank you",
          "My name is Ana",
          "Goodbye"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Como vai?",
          "Quantos anos?",
          "Qual é seu nome?",
          "Onde mora?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Ana'?",
        "opts": [
          "Ana",
          "Trabalho",
          "Carro",
          "Casa"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Ana'",
        "opts": [
          "am",
          "be",
          "is",
          "are"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Ana'",
        "opts": [
          "Ana is my name",
          "My Ana is name",
          "Is my name Ana",
          "My name is Ana"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Ana'",
        "opts": [
          "Bom dia",
          "Prazer em conhecer você, Ana",
          "Até logo",
          "Boa noite"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Ana' significa:",
        "opts": [
          "Olá, meu nome é Ana",
          "Onde mora?",
          "Meu nome não é",
          "Qual seu nome?"
        ],
        "ans": 0,
        "type": "translation"
      }
    ]
  },
  {
    "id": 59,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Como você está",
    "desc": "Aprenda como você está - tradução correta John=John",
    "time": "8 MIN",
    "phrase": "Hello, my name is John",
    "translation": "Olá, meu nome é John",
    "vocab": [
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Como você está</h4><p><b>Frase:</b> Hello, my name is John = Olá, meu nome é John</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is John'",
        "opts": [
          "Até logo",
          "Bom dia",
          "Boa noite",
          "Olá, meu nome é John"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Meu nome é",
          "Como vai",
          "Quantos anos",
          "Onde mora"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is John'",
        "opts": [
          "name",
          "good",
          "bad",
          "big"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is John'?",
        "opts": [
          "Ao comer",
          "Ao dormir",
          "Ao dirigir",
          "Ao se apresentar"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Thanks",
          "Goodbye",
          "Hello",
          "Please"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "My name is John",
          "Thank you",
          "Goodbye",
          "I am fine"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Como vai?",
          "Quantos anos?",
          "Qual é seu nome?",
          "Onde mora?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is John'?",
        "opts": [
          "John",
          "Trabalho",
          "Casa",
          "Carro"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ John'",
        "opts": [
          "are",
          "be",
          "am",
          "is"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / John'",
        "opts": [
          "My John is name",
          "Is my name John",
          "John is my name",
          "My name is John"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, John'",
        "opts": [
          "Bom dia",
          "Até logo",
          "Boa noite",
          "Prazer em conhecer você, John"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is John' significa:",
        "opts": [
          "Onde mora?",
          "Qual seu nome?",
          "Olá, meu nome é John",
          "Meu nome não é"
        ],
        "ans": 2,
        "type": "translation"
      }
    ]
  },
  {
    "id": 60,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Números e telefone",
    "desc": "Aprenda números e telefone - tradução correta Julia=Julia",
    "time": "9 MIN",
    "phrase": "Hello, my name is Julia",
    "translation": "Olá, meu nome é Julia",
    "vocab": [
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Números e telefone</h4><p><b>Frase:</b> Hello, my name is Julia = Olá, meu nome é Julia</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Julia'",
        "opts": [
          "Olá, meu nome é Julia",
          "Até logo",
          "Boa noite",
          "Bom dia"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Onde mora",
          "Quantos anos",
          "Meu nome é",
          "Como vai"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Julia'",
        "opts": [
          "name",
          "bad",
          "good",
          "big"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Julia'?",
        "opts": [
          "Ao comer",
          "Ao dormir",
          "Ao se apresentar",
          "Ao dirigir"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Please",
          "Thanks",
          "Hello",
          "Goodbye"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "I am fine",
          "My name is Julia",
          "Thank you",
          "Goodbye"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Quantos anos?",
          "Como vai?",
          "Qual é seu nome?",
          "Onde mora?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Julia'?",
        "opts": [
          "Carro",
          "Casa",
          "Trabalho",
          "Julia"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Julia'",
        "opts": [
          "am",
          "is",
          "be",
          "are"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Julia'",
        "opts": [
          "My name is Julia",
          "Julia is my name",
          "My Julia is name",
          "Is my name Julia"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Julia'",
        "opts": [
          "Bom dia",
          "Até logo",
          "Prazer em conhecer você, Julia",
          "Boa noite"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Julia' significa:",
        "opts": [
          "Meu nome não é",
          "Onde mora?",
          "Qual seu nome?",
          "Olá, meu nome é Julia"
        ],
        "ans": 3,
        "type": "translation"
      }
    ]
  },
  {
    "id": 61,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Endereço e cidade",
    "desc": "Aprenda endereço e cidade - tradução correta Ana=Ana",
    "time": "10 MIN",
    "phrase": "Hello, my name is Ana",
    "translation": "Olá, meu nome é Ana",
    "vocab": [
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Endereço e cidade</h4><p><b>Frase:</b> Hello, my name is Ana = Olá, meu nome é Ana</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Ana'",
        "opts": [
          "Até logo",
          "Bom dia",
          "Olá, meu nome é Ana",
          "Boa noite"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Como vai",
          "Meu nome é",
          "Quantos anos",
          "Onde mora"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Ana'",
        "opts": [
          "good",
          "bad",
          "name",
          "big"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Ana'?",
        "opts": [
          "Ao comer",
          "Ao se apresentar",
          "Ao dormir",
          "Ao dirigir"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Hello",
          "Please",
          "Thanks",
          "Goodbye"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "My name is Ana",
          "Goodbye",
          "I am fine",
          "Thank you"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Quantos anos?",
          "Qual é seu nome?",
          "Onde mora?",
          "Como vai?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Ana'?",
        "opts": [
          "Casa",
          "Trabalho",
          "Carro",
          "Ana"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Ana'",
        "opts": [
          "is",
          "am",
          "are",
          "be"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Ana'",
        "opts": [
          "My name is Ana",
          "My Ana is name",
          "Is my name Ana",
          "Ana is my name"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Ana'",
        "opts": [
          "Prazer em conhecer você, Ana",
          "Até logo",
          "Boa noite",
          "Bom dia"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Ana' significa:",
        "opts": [
          "Qual seu nome?",
          "Meu nome não é",
          "Onde mora?",
          "Olá, meu nome é Ana"
        ],
        "ans": 3,
        "type": "translation"
      }
    ]
  },
  {
    "id": 62,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Profissão simples",
    "desc": "Aprenda profissão simples - tradução correta Miguel=Miguel",
    "time": "11 MIN",
    "phrase": "Hello, my name is Miguel",
    "translation": "Olá, meu nome é Miguel",
    "vocab": [
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Profissão simples</h4><p><b>Frase:</b> Hello, my name is Miguel = Olá, meu nome é Miguel</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Miguel'",
        "opts": [
          "Olá, meu nome é Miguel",
          "Até logo",
          "Boa noite",
          "Bom dia"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Como vai",
          "Quantos anos",
          "Onde mora",
          "Meu nome é"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Miguel'",
        "opts": [
          "big",
          "bad",
          "name",
          "good"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Miguel'?",
        "opts": [
          "Ao dormir",
          "Ao dirigir",
          "Ao se apresentar",
          "Ao comer"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Hello",
          "Goodbye",
          "Please",
          "Thanks"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "My name is Miguel",
          "I am fine",
          "Thank you",
          "Goodbye"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Quantos anos?",
          "Qual é seu nome?",
          "Onde mora?",
          "Como vai?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Miguel'?",
        "opts": [
          "Trabalho",
          "Casa",
          "Carro",
          "Miguel"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Miguel'",
        "opts": [
          "are",
          "am",
          "is",
          "be"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Miguel'",
        "opts": [
          "My Miguel is name",
          "Miguel is my name",
          "My name is Miguel",
          "Is my name Miguel"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Miguel'",
        "opts": [
          "Bom dia",
          "Prazer em conhecer você, Miguel",
          "Até logo",
          "Boa noite"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Miguel' significa:",
        "opts": [
          "Olá, meu nome é Miguel",
          "Onde mora?",
          "Qual seu nome?",
          "Meu nome não é"
        ],
        "ans": 0,
        "type": "translation"
      }
    ]
  },
  {
    "id": 63,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Hobbies favoritos",
    "desc": "Aprenda hobbies favoritos - tradução correta Sarah=Sarah",
    "time": "12 MIN",
    "phrase": "Hello, my name is Sarah",
    "translation": "Olá, meu nome é Sarah",
    "vocab": [
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Hobbies favoritos</h4><p><b>Frase:</b> Hello, my name is Sarah = Olá, meu nome é Sarah</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Sarah'",
        "opts": [
          "Bom dia",
          "Olá, meu nome é Sarah",
          "Boa noite",
          "Até logo"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Como vai",
          "Meu nome é",
          "Onde mora",
          "Quantos anos"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Sarah'",
        "opts": [
          "name",
          "good",
          "big",
          "bad"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Sarah'?",
        "opts": [
          "Ao dirigir",
          "Ao comer",
          "Ao se apresentar",
          "Ao dormir"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Goodbye",
          "Please",
          "Thanks",
          "Hello"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "I am fine",
          "My name is Sarah",
          "Thank you",
          "Goodbye"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Quantos anos?",
          "Onde mora?",
          "Qual é seu nome?",
          "Como vai?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Sarah'?",
        "opts": [
          "Carro",
          "Casa",
          "Sarah",
          "Trabalho"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Sarah'",
        "opts": [
          "am",
          "is",
          "are",
          "be"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Sarah'",
        "opts": [
          "My name is Sarah",
          "My Sarah is name",
          "Is my name Sarah",
          "Sarah is my name"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Sarah'",
        "opts": [
          "Até logo",
          "Boa noite",
          "Prazer em conhecer você, Sarah",
          "Bom dia"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Sarah' significa:",
        "opts": [
          "Onde mora?",
          "Meu nome não é",
          "Qual seu nome?",
          "Olá, meu nome é Sarah"
        ],
        "ans": 3,
        "type": "translation"
      }
    ]
  },
  {
    "id": 64,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Comida favorita",
    "desc": "Aprenda comida favorita - tradução correta Lucas=Lucas",
    "time": "13 MIN",
    "phrase": "Hello, my name is Lucas",
    "translation": "Olá, meu nome é Lucas",
    "vocab": [
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Comida favorita</h4><p><b>Frase:</b> Hello, my name is Lucas = Olá, meu nome é Lucas</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Lucas'",
        "opts": [
          "Boa noite",
          "Bom dia",
          "Até logo",
          "Olá, meu nome é Lucas"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Quantos anos",
          "Meu nome é",
          "Como vai",
          "Onde mora"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Lucas'",
        "opts": [
          "good",
          "bad",
          "big",
          "name"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Lucas'?",
        "opts": [
          "Ao se apresentar",
          "Ao dormir",
          "Ao dirigir",
          "Ao comer"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Hello",
          "Please",
          "Goodbye",
          "Thanks"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "Thank you",
          "Goodbye",
          "My name is Lucas",
          "I am fine"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Quantos anos?",
          "Como vai?",
          "Qual é seu nome?",
          "Onde mora?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Lucas'?",
        "opts": [
          "Trabalho",
          "Carro",
          "Casa",
          "Lucas"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Lucas'",
        "opts": [
          "are",
          "is",
          "am",
          "be"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Lucas'",
        "opts": [
          "My Lucas is name",
          "My name is Lucas",
          "Lucas is my name",
          "Is my name Lucas"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Lucas'",
        "opts": [
          "Até logo",
          "Prazer em conhecer você, Lucas",
          "Bom dia",
          "Boa noite"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Lucas' significa:",
        "opts": [
          "Meu nome não é",
          "Olá, meu nome é Lucas",
          "Onde mora?",
          "Qual seu nome?"
        ],
        "ans": 1,
        "type": "translation"
      }
    ]
  },
  {
    "id": 65,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Cores favoritas",
    "desc": "Aprenda cores favoritas - tradução correta Sofia=Sofia",
    "time": "6 MIN",
    "phrase": "Hello, my name is Sofia",
    "translation": "Olá, meu nome é Sofia",
    "vocab": [
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Cores favoritas</h4><p><b>Frase:</b> Hello, my name is Sofia = Olá, meu nome é Sofia</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Sofia'",
        "opts": [
          "Bom dia",
          "Boa noite",
          "Até logo",
          "Olá, meu nome é Sofia"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Como vai",
          "Quantos anos",
          "Meu nome é",
          "Onde mora"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Sofia'",
        "opts": [
          "big",
          "bad",
          "name",
          "good"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Sofia'?",
        "opts": [
          "Ao dirigir",
          "Ao dormir",
          "Ao comer",
          "Ao se apresentar"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Goodbye",
          "Hello",
          "Please",
          "Thanks"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "I am fine",
          "My name is Sofia",
          "Goodbye",
          "Thank you"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Como vai?",
          "Quantos anos?",
          "Onde mora?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Sofia'?",
        "opts": [
          "Trabalho",
          "Carro",
          "Sofia",
          "Casa"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Sofia'",
        "opts": [
          "am",
          "are",
          "be",
          "is"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Sofia'",
        "opts": [
          "Is my name Sofia",
          "Sofia is my name",
          "My name is Sofia",
          "My Sofia is name"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Sofia'",
        "opts": [
          "Boa noite",
          "Até logo",
          "Prazer em conhecer você, Sofia",
          "Bom dia"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Sofia' significa:",
        "opts": [
          "Qual seu nome?",
          "Olá, meu nome é Sofia",
          "Meu nome não é",
          "Onde mora?"
        ],
        "ans": 1,
        "type": "translation"
      }
    ]
  },
  {
    "id": 66,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Tempo e clima",
    "desc": "Aprenda tempo e clima - tradução correta Ana=Ana",
    "time": "7 MIN",
    "phrase": "Hello, my name is Ana",
    "translation": "Olá, meu nome é Ana",
    "vocab": [
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Tempo e clima</h4><p><b>Frase:</b> Hello, my name is Ana = Olá, meu nome é Ana</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Ana'",
        "opts": [
          "Até logo",
          "Olá, meu nome é Ana",
          "Boa noite",
          "Bom dia"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Quantos anos",
          "Onde mora",
          "Como vai",
          "Meu nome é"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Ana'",
        "opts": [
          "good",
          "bad",
          "big",
          "name"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Ana'?",
        "opts": [
          "Ao se apresentar",
          "Ao comer",
          "Ao dormir",
          "Ao dirigir"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Hello",
          "Thanks",
          "Goodbye",
          "Please"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "My name is Ana",
          "Goodbye",
          "I am fine",
          "Thank you"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Quantos anos?",
          "Qual é seu nome?",
          "Onde mora?",
          "Como vai?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Ana'?",
        "opts": [
          "Ana",
          "Carro",
          "Trabalho",
          "Casa"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Ana'",
        "opts": [
          "are",
          "am",
          "be",
          "is"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Ana'",
        "opts": [
          "My Ana is name",
          "Ana is my name",
          "My name is Ana",
          "Is my name Ana"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Ana'",
        "opts": [
          "Prazer em conhecer você, Ana",
          "Até logo",
          "Boa noite",
          "Bom dia"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Ana' significa:",
        "opts": [
          "Olá, meu nome é Ana",
          "Onde mora?",
          "Qual seu nome?",
          "Meu nome não é"
        ],
        "ans": 0,
        "type": "translation"
      }
    ]
  },
  {
    "id": 67,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Dias da semana",
    "desc": "Aprenda dias da semana - tradução correta Maria=Maria",
    "time": "8 MIN",
    "phrase": "Hello, my name is Maria",
    "translation": "Olá, meu nome é Maria",
    "vocab": [
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Dias da semana</h4><p><b>Frase:</b> Hello, my name is Maria = Olá, meu nome é Maria</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Maria'",
        "opts": [
          "Até logo",
          "Boa noite",
          "Olá, meu nome é Maria",
          "Bom dia"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Onde mora",
          "Como vai",
          "Quantos anos",
          "Meu nome é"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Maria'",
        "opts": [
          "bad",
          "good",
          "name",
          "big"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Maria'?",
        "opts": [
          "Ao dirigir",
          "Ao dormir",
          "Ao se apresentar",
          "Ao comer"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Goodbye",
          "Please",
          "Hello",
          "Thanks"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "Thank you",
          "My name is Maria",
          "I am fine",
          "Goodbye"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Como vai?",
          "Onde mora?",
          "Qual é seu nome?",
          "Quantos anos?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Maria'?",
        "opts": [
          "Casa",
          "Trabalho",
          "Maria",
          "Carro"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Maria'",
        "opts": [
          "am",
          "is",
          "are",
          "be"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Maria'",
        "opts": [
          "Is my name Maria",
          "My Maria is name",
          "My name is Maria",
          "Maria is my name"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Maria'",
        "opts": [
          "Prazer em conhecer você, Maria",
          "Até logo",
          "Boa noite",
          "Bom dia"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Maria' significa:",
        "opts": [
          "Olá, meu nome é Maria",
          "Qual seu nome?",
          "Meu nome não é",
          "Onde mora?"
        ],
        "ans": 0,
        "type": "translation"
      }
    ]
  },
  {
    "id": 68,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Horas e compromissos",
    "desc": "Aprenda horas e compromissos - tradução correta Ana=Ana",
    "time": "9 MIN",
    "phrase": "Hello, my name is Ana",
    "translation": "Olá, meu nome é Ana",
    "vocab": [
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Horas e compromissos</h4><p><b>Frase:</b> Hello, my name is Ana = Olá, meu nome é Ana</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Ana'",
        "opts": [
          "Olá, meu nome é Ana",
          "Bom dia",
          "Até logo",
          "Boa noite"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Meu nome é",
          "Como vai",
          "Onde mora",
          "Quantos anos"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Ana'",
        "opts": [
          "name",
          "big",
          "good",
          "bad"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Ana'?",
        "opts": [
          "Ao dirigir",
          "Ao se apresentar",
          "Ao dormir",
          "Ao comer"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Goodbye",
          "Please",
          "Hello",
          "Thanks"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "Goodbye",
          "My name is Ana",
          "Thank you",
          "I am fine"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Como vai?",
          "Quantos anos?",
          "Qual é seu nome?",
          "Onde mora?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Ana'?",
        "opts": [
          "Carro",
          "Trabalho",
          "Casa",
          "Ana"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Ana'",
        "opts": [
          "is",
          "am",
          "be",
          "are"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Ana'",
        "opts": [
          "Is my name Ana",
          "My name is Ana",
          "My Ana is name",
          "Ana is my name"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Ana'",
        "opts": [
          "Prazer em conhecer você, Ana",
          "Bom dia",
          "Boa noite",
          "Até logo"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Ana' significa:",
        "opts": [
          "Onde mora?",
          "Meu nome não é",
          "Qual seu nome?",
          "Olá, meu nome é Ana"
        ],
        "ans": 3,
        "type": "translation"
      }
    ]
  },
  {
    "id": 69,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Família estendida",
    "desc": "Aprenda família estendida - tradução correta Sarah=Sarah",
    "time": "10 MIN",
    "phrase": "Hello, my name is Sarah",
    "translation": "Olá, meu nome é Sarah",
    "vocab": [
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Família estendida</h4><p><b>Frase:</b> Hello, my name is Sarah = Olá, meu nome é Sarah</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Sarah'",
        "opts": [
          "Bom dia",
          "Boa noite",
          "Até logo",
          "Olá, meu nome é Sarah"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Como vai",
          "Onde mora",
          "Quantos anos",
          "Meu nome é"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Sarah'",
        "opts": [
          "bad",
          "big",
          "good",
          "name"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Sarah'?",
        "opts": [
          "Ao dirigir",
          "Ao dormir",
          "Ao comer",
          "Ao se apresentar"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Hello",
          "Thanks",
          "Please",
          "Goodbye"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "My name is Sarah",
          "I am fine",
          "Thank you",
          "Goodbye"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Qual é seu nome?",
          "Onde mora?",
          "Como vai?",
          "Quantos anos?"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Sarah'?",
        "opts": [
          "Carro",
          "Trabalho",
          "Sarah",
          "Casa"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Sarah'",
        "opts": [
          "am",
          "are",
          "is",
          "be"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Sarah'",
        "opts": [
          "Sarah is my name",
          "My Sarah is name",
          "My name is Sarah",
          "Is my name Sarah"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Sarah'",
        "opts": [
          "Até logo",
          "Boa noite",
          "Bom dia",
          "Prazer em conhecer você, Sarah"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Sarah' significa:",
        "opts": [
          "Meu nome não é",
          "Qual seu nome?",
          "Olá, meu nome é Sarah",
          "Onde mora?"
        ],
        "ans": 2,
        "type": "translation"
      }
    ]
  },
  {
    "id": 70,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Casa e moradia",
    "desc": "Aprenda casa e moradia - tradução correta John=John",
    "time": "11 MIN",
    "phrase": "Hello, my name is John",
    "translation": "Olá, meu nome é John",
    "vocab": [
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Casa e moradia</h4><p><b>Frase:</b> Hello, my name is John = Olá, meu nome é John</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is John'",
        "opts": [
          "Até logo",
          "Boa noite",
          "Olá, meu nome é John",
          "Bom dia"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Como vai",
          "Meu nome é",
          "Onde mora",
          "Quantos anos"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is John'",
        "opts": [
          "big",
          "name",
          "good",
          "bad"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is John'?",
        "opts": [
          "Ao comer",
          "Ao dirigir",
          "Ao se apresentar",
          "Ao dormir"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Thanks",
          "Please",
          "Goodbye",
          "Hello"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "My name is John",
          "Goodbye",
          "I am fine",
          "Thank you"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Como vai?",
          "Quantos anos?",
          "Qual é seu nome?",
          "Onde mora?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is John'?",
        "opts": [
          "John",
          "Trabalho",
          "Casa",
          "Carro"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ John'",
        "opts": [
          "is",
          "be",
          "are",
          "am"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / John'",
        "opts": [
          "John is my name",
          "My John is name",
          "My name is John",
          "Is my name John"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, John'",
        "opts": [
          "Bom dia",
          "Até logo",
          "Prazer em conhecer você, John",
          "Boa noite"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is John' significa:",
        "opts": [
          "Qual seu nome?",
          "Meu nome não é",
          "Olá, meu nome é John",
          "Onde mora?"
        ],
        "ans": 2,
        "type": "translation"
      }
    ]
  },
  {
    "id": 71,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Rotina matinal",
    "desc": "Aprenda rotina matinal - tradução correta Pedro=Pedro",
    "time": "12 MIN",
    "phrase": "Hello, my name is Pedro",
    "translation": "Olá, meu nome é Pedro",
    "vocab": [
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Rotina matinal</h4><p><b>Frase:</b> Hello, my name is Pedro = Olá, meu nome é Pedro</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Pedro'",
        "opts": [
          "Bom dia",
          "Boa noite",
          "Até logo",
          "Olá, meu nome é Pedro"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Onde mora",
          "Meu nome é",
          "Quantos anos",
          "Como vai"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Pedro'",
        "opts": [
          "name",
          "big",
          "bad",
          "good"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Pedro'?",
        "opts": [
          "Ao dormir",
          "Ao dirigir",
          "Ao se apresentar",
          "Ao comer"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Goodbye",
          "Hello",
          "Thanks",
          "Please"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "My name is Pedro",
          "I am fine",
          "Goodbye",
          "Thank you"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Onde mora?",
          "Quantos anos?",
          "Qual é seu nome?",
          "Como vai?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Pedro'?",
        "opts": [
          "Pedro",
          "Trabalho",
          "Carro",
          "Casa"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Pedro'",
        "opts": [
          "am",
          "be",
          "are",
          "is"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Pedro'",
        "opts": [
          "Pedro is my name",
          "My name is Pedro",
          "Is my name Pedro",
          "My Pedro is name"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Pedro'",
        "opts": [
          "Até logo",
          "Bom dia",
          "Boa noite",
          "Prazer em conhecer você, Pedro"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Pedro' significa:",
        "opts": [
          "Meu nome não é",
          "Qual seu nome?",
          "Olá, meu nome é Pedro",
          "Onde mora?"
        ],
        "ans": 2,
        "type": "translation"
      }
    ]
  },
  {
    "id": 72,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Rotina noturna",
    "desc": "Aprenda rotina noturna - tradução correta Emma=Emma",
    "time": "13 MIN",
    "phrase": "Hello, my name is Emma",
    "translation": "Olá, meu nome é Emma",
    "vocab": [
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Rotina noturna</h4><p><b>Frase:</b> Hello, my name is Emma = Olá, meu nome é Emma</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Emma'",
        "opts": [
          "Até logo",
          "Olá, meu nome é Emma",
          "Boa noite",
          "Bom dia"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Meu nome é",
          "Como vai",
          "Onde mora",
          "Quantos anos"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Emma'",
        "opts": [
          "good",
          "bad",
          "big",
          "name"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Emma'?",
        "opts": [
          "Ao dirigir",
          "Ao se apresentar",
          "Ao comer",
          "Ao dormir"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Hello",
          "Thanks",
          "Goodbye",
          "Please"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "I am fine",
          "Goodbye",
          "My name is Emma",
          "Thank you"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Qual é seu nome?",
          "Onde mora?",
          "Quantos anos?",
          "Como vai?"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Emma'?",
        "opts": [
          "Carro",
          "Trabalho",
          "Casa",
          "Emma"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Emma'",
        "opts": [
          "am",
          "are",
          "is",
          "be"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Emma'",
        "opts": [
          "Emma is my name",
          "Is my name Emma",
          "My name is Emma",
          "My Emma is name"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Emma'",
        "opts": [
          "Até logo",
          "Boa noite",
          "Bom dia",
          "Prazer em conhecer você, Emma"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Emma' significa:",
        "opts": [
          "Qual seu nome?",
          "Olá, meu nome é Emma",
          "Meu nome não é",
          "Onde mora?"
        ],
        "ans": 1,
        "type": "translation"
      }
    ]
  },
  {
    "id": 73,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Fim de semana",
    "desc": "Aprenda fim de semana - tradução correta Sarah=Sarah",
    "time": "6 MIN",
    "phrase": "Hello, my name is Sarah",
    "translation": "Olá, meu nome é Sarah",
    "vocab": [
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Fim de semana</h4><p><b>Frase:</b> Hello, my name is Sarah = Olá, meu nome é Sarah</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Sarah'",
        "opts": [
          "Boa noite",
          "Até logo",
          "Bom dia",
          "Olá, meu nome é Sarah"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Meu nome é",
          "Onde mora",
          "Quantos anos",
          "Como vai"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Sarah'",
        "opts": [
          "big",
          "name",
          "bad",
          "good"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Sarah'?",
        "opts": [
          "Ao dormir",
          "Ao se apresentar",
          "Ao comer",
          "Ao dirigir"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Please",
          "Thanks",
          "Goodbye",
          "Hello"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "I am fine",
          "Thank you",
          "My name is Sarah",
          "Goodbye"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Onde mora?",
          "Como vai?",
          "Qual é seu nome?",
          "Quantos anos?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Sarah'?",
        "opts": [
          "Trabalho",
          "Carro",
          "Sarah",
          "Casa"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Sarah'",
        "opts": [
          "is",
          "am",
          "be",
          "are"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Sarah'",
        "opts": [
          "Sarah is my name",
          "Is my name Sarah",
          "My name is Sarah",
          "My Sarah is name"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Sarah'",
        "opts": [
          "Até logo",
          "Prazer em conhecer você, Sarah",
          "Boa noite",
          "Bom dia"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Sarah' significa:",
        "opts": [
          "Meu nome não é",
          "Onde mora?",
          "Olá, meu nome é Sarah",
          "Qual seu nome?"
        ],
        "ans": 2,
        "type": "translation"
      }
    ]
  },
  {
    "id": 74,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Compras básicas",
    "desc": "Aprenda compras básicas - tradução correta Ana=Ana",
    "time": "7 MIN",
    "phrase": "Hello, my name is Ana",
    "translation": "Olá, meu nome é Ana",
    "vocab": [
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Compras básicas</h4><p><b>Frase:</b> Hello, my name is Ana = Olá, meu nome é Ana</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Ana'",
        "opts": [
          "Bom dia",
          "Boa noite",
          "Olá, meu nome é Ana",
          "Até logo"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Onde mora",
          "Quantos anos",
          "Meu nome é",
          "Como vai"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Ana'",
        "opts": [
          "bad",
          "big",
          "name",
          "good"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Ana'?",
        "opts": [
          "Ao se apresentar",
          "Ao comer",
          "Ao dirigir",
          "Ao dormir"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Thanks",
          "Goodbye",
          "Hello",
          "Please"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "I am fine",
          "Thank you",
          "My name is Ana",
          "Goodbye"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Qual é seu nome?",
          "Quantos anos?",
          "Como vai?",
          "Onde mora?"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Ana'?",
        "opts": [
          "Casa",
          "Trabalho",
          "Carro",
          "Ana"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Ana'",
        "opts": [
          "be",
          "is",
          "are",
          "am"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Ana'",
        "opts": [
          "My Ana is name",
          "Is my name Ana",
          "Ana is my name",
          "My name is Ana"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Ana'",
        "opts": [
          "Bom dia",
          "Até logo",
          "Boa noite",
          "Prazer em conhecer você, Ana"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Ana' significa:",
        "opts": [
          "Qual seu nome?",
          "Meu nome não é",
          "Onde mora?",
          "Olá, meu nome é Ana"
        ],
        "ans": 3,
        "type": "translation"
      }
    ]
  },
  {
    "id": 75,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Transporte",
    "desc": "Aprenda transporte - tradução correta Sarah=Sarah",
    "time": "8 MIN",
    "phrase": "Hello, my name is Sarah",
    "translation": "Olá, meu nome é Sarah",
    "vocab": [
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Transporte</h4><p><b>Frase:</b> Hello, my name is Sarah = Olá, meu nome é Sarah</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Sarah'",
        "opts": [
          "Até logo",
          "Boa noite",
          "Olá, meu nome é Sarah",
          "Bom dia"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Meu nome é",
          "Quantos anos",
          "Como vai",
          "Onde mora"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Sarah'",
        "opts": [
          "name",
          "good",
          "big",
          "bad"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Sarah'?",
        "opts": [
          "Ao dirigir",
          "Ao dormir",
          "Ao comer",
          "Ao se apresentar"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Goodbye",
          "Hello",
          "Please",
          "Thanks"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "My name is Sarah",
          "I am fine",
          "Goodbye",
          "Thank you"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Onde mora?",
          "Qual é seu nome?",
          "Quantos anos?",
          "Como vai?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Sarah'?",
        "opts": [
          "Sarah",
          "Carro",
          "Trabalho",
          "Casa"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Sarah'",
        "opts": [
          "is",
          "be",
          "are",
          "am"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Sarah'",
        "opts": [
          "My name is Sarah",
          "Sarah is my name",
          "My Sarah is name",
          "Is my name Sarah"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Sarah'",
        "opts": [
          "Bom dia",
          "Até logo",
          "Boa noite",
          "Prazer em conhecer você, Sarah"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Sarah' significa:",
        "opts": [
          "Meu nome não é",
          "Qual seu nome?",
          "Onde mora?",
          "Olá, meu nome é Sarah"
        ],
        "ans": 3,
        "type": "translation"
      }
    ]
  },
  {
    "id": 76,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Comida e restaurante",
    "desc": "Aprenda comida e restaurante - tradução correta John=John",
    "time": "9 MIN",
    "phrase": "Hello, my name is John",
    "translation": "Olá, meu nome é John",
    "vocab": [
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Comida e restaurante</h4><p><b>Frase:</b> Hello, my name is John = Olá, meu nome é John</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is John'",
        "opts": [
          "Até logo",
          "Bom dia",
          "Boa noite",
          "Olá, meu nome é John"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Onde mora",
          "Como vai",
          "Quantos anos",
          "Meu nome é"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is John'",
        "opts": [
          "good",
          "bad",
          "big",
          "name"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is John'?",
        "opts": [
          "Ao dormir",
          "Ao dirigir",
          "Ao se apresentar",
          "Ao comer"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Goodbye",
          "Hello",
          "Please",
          "Thanks"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "Thank you",
          "Goodbye",
          "My name is John",
          "I am fine"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Onde mora?",
          "Qual é seu nome?",
          "Como vai?",
          "Quantos anos?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is John'?",
        "opts": [
          "Casa",
          "Carro",
          "John",
          "Trabalho"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ John'",
        "opts": [
          "are",
          "be",
          "is",
          "am"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / John'",
        "opts": [
          "My name is John",
          "Is my name John",
          "John is my name",
          "My John is name"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, John'",
        "opts": [
          "Bom dia",
          "Boa noite",
          "Prazer em conhecer você, John",
          "Até logo"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is John' significa:",
        "opts": [
          "Qual seu nome?",
          "Onde mora?",
          "Meu nome não é",
          "Olá, meu nome é John"
        ],
        "ans": 3,
        "type": "translation"
      }
    ]
  },
  {
    "id": 77,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Bebidas",
    "desc": "Aprenda bebidas - tradução correta Lucas=Lucas",
    "time": "10 MIN",
    "phrase": "Hello, my name is Lucas",
    "translation": "Olá, meu nome é Lucas",
    "vocab": [
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Bebidas</h4><p><b>Frase:</b> Hello, my name is Lucas = Olá, meu nome é Lucas</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Lucas'",
        "opts": [
          "Bom dia",
          "Até logo",
          "Olá, meu nome é Lucas",
          "Boa noite"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Quantos anos",
          "Meu nome é",
          "Como vai",
          "Onde mora"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Lucas'",
        "opts": [
          "good",
          "bad",
          "big",
          "name"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Lucas'?",
        "opts": [
          "Ao dirigir",
          "Ao se apresentar",
          "Ao comer",
          "Ao dormir"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Thanks",
          "Goodbye",
          "Please",
          "Hello"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "My name is Lucas",
          "Thank you",
          "Goodbye",
          "I am fine"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Onde mora?",
          "Como vai?",
          "Quantos anos?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Lucas'?",
        "opts": [
          "Casa",
          "Carro",
          "Trabalho",
          "Lucas"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Lucas'",
        "opts": [
          "be",
          "are",
          "am",
          "is"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Lucas'",
        "opts": [
          "Lucas is my name",
          "My name is Lucas",
          "Is my name Lucas",
          "My Lucas is name"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Lucas'",
        "opts": [
          "Boa noite",
          "Prazer em conhecer você, Lucas",
          "Bom dia",
          "Até logo"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Lucas' significa:",
        "opts": [
          "Qual seu nome?",
          "Olá, meu nome é Lucas",
          "Meu nome não é",
          "Onde mora?"
        ],
        "ans": 1,
        "type": "translation"
      }
    ]
  },
  {
    "id": 78,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Pedindo ajuda",
    "desc": "Aprenda pedindo ajuda - tradução correta Carlos=Carlos",
    "time": "11 MIN",
    "phrase": "Hello, my name is Carlos",
    "translation": "Olá, meu nome é Carlos",
    "vocab": [
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Pedindo ajuda</h4><p><b>Frase:</b> Hello, my name is Carlos = Olá, meu nome é Carlos</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Carlos'",
        "opts": [
          "Até logo",
          "Boa noite",
          "Bom dia",
          "Olá, meu nome é Carlos"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Meu nome é",
          "Onde mora",
          "Quantos anos",
          "Como vai"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Carlos'",
        "opts": [
          "big",
          "name",
          "good",
          "bad"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Carlos'?",
        "opts": [
          "Ao dirigir",
          "Ao se apresentar",
          "Ao dormir",
          "Ao comer"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Hello",
          "Please",
          "Thanks",
          "Goodbye"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "Goodbye",
          "My name is Carlos",
          "Thank you",
          "I am fine"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Qual é seu nome?",
          "Como vai?",
          "Quantos anos?",
          "Onde mora?"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Carlos'?",
        "opts": [
          "Carlos",
          "Casa",
          "Carro",
          "Trabalho"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Carlos'",
        "opts": [
          "is",
          "am",
          "be",
          "are"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Carlos'",
        "opts": [
          "My name is Carlos",
          "Is my name Carlos",
          "My Carlos is name",
          "Carlos is my name"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Carlos'",
        "opts": [
          "Bom dia",
          "Até logo",
          "Boa noite",
          "Prazer em conhecer você, Carlos"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Carlos' significa:",
        "opts": [
          "Olá, meu nome é Carlos",
          "Meu nome não é",
          "Onde mora?",
          "Qual seu nome?"
        ],
        "ans": 0,
        "type": "translation"
      }
    ]
  },
  {
    "id": 79,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Direções simples",
    "desc": "Aprenda direções simples - tradução correta John=John",
    "time": "12 MIN",
    "phrase": "Hello, my name is John",
    "translation": "Olá, meu nome é John",
    "vocab": [
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Direções simples</h4><p><b>Frase:</b> Hello, my name is John = Olá, meu nome é John</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is John'",
        "opts": [
          "Olá, meu nome é John",
          "Até logo",
          "Boa noite",
          "Bom dia"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Meu nome é",
          "Quantos anos",
          "Como vai",
          "Onde mora"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is John'",
        "opts": [
          "bad",
          "big",
          "good",
          "name"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is John'?",
        "opts": [
          "Ao dirigir",
          "Ao comer",
          "Ao se apresentar",
          "Ao dormir"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Hello",
          "Please",
          "Thanks",
          "Goodbye"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "I am fine",
          "Goodbye",
          "Thank you",
          "My name is John"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Como vai?",
          "Qual é seu nome?",
          "Quantos anos?",
          "Onde mora?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is John'?",
        "opts": [
          "Casa",
          "Carro",
          "Trabalho",
          "John"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ John'",
        "opts": [
          "am",
          "is",
          "are",
          "be"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / John'",
        "opts": [
          "My John is name",
          "John is my name",
          "Is my name John",
          "My name is John"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, John'",
        "opts": [
          "Prazer em conhecer você, John",
          "Até logo",
          "Bom dia",
          "Boa noite"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is John' significa:",
        "opts": [
          "Qual seu nome?",
          "Olá, meu nome é John",
          "Meu nome não é",
          "Onde mora?"
        ],
        "ans": 1,
        "type": "translation"
      }
    ]
  },
  {
    "id": 80,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Preços e dinheiro",
    "desc": "Aprenda preços e dinheiro - tradução correta Sarah=Sarah",
    "time": "13 MIN",
    "phrase": "Hello, my name is Sarah",
    "translation": "Olá, meu nome é Sarah",
    "vocab": [
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Preços e dinheiro</h4><p><b>Frase:</b> Hello, my name is Sarah = Olá, meu nome é Sarah</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Sarah'",
        "opts": [
          "Bom dia",
          "Até logo",
          "Olá, meu nome é Sarah",
          "Boa noite"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Como vai",
          "Onde mora",
          "Meu nome é",
          "Quantos anos"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Sarah'",
        "opts": [
          "name",
          "bad",
          "good",
          "big"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Sarah'?",
        "opts": [
          "Ao dirigir",
          "Ao se apresentar",
          "Ao dormir",
          "Ao comer"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Thanks",
          "Please",
          "Goodbye",
          "Hello"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "I am fine",
          "Thank you",
          "My name is Sarah",
          "Goodbye"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Onde mora?",
          "Quantos anos?",
          "Como vai?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Sarah'?",
        "opts": [
          "Carro",
          "Casa",
          "Trabalho",
          "Sarah"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Sarah'",
        "opts": [
          "is",
          "am",
          "are",
          "be"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Sarah'",
        "opts": [
          "My Sarah is name",
          "My name is Sarah",
          "Sarah is my name",
          "Is my name Sarah"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Sarah'",
        "opts": [
          "Até logo",
          "Prazer em conhecer você, Sarah",
          "Boa noite",
          "Bom dia"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Sarah' significa:",
        "opts": [
          "Olá, meu nome é Sarah",
          "Meu nome não é",
          "Qual seu nome?",
          "Onde mora?"
        ],
        "ans": 0,
        "type": "translation"
      }
    ]
  },
  {
    "id": 81,
    "module": 2,
    "moduleName": "Vida Diária",
    "level": "A2",
    "title": "Roupas",
    "desc": "Aprenda roupas - tradução correta Lucas=Lucas",
    "time": "6 MIN",
    "phrase": "Hello, my name is Lucas",
    "translation": "Olá, meu nome é Lucas",
    "vocab": [
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Roupas</h4><p><b>Frase:</b> Hello, my name is Lucas = Olá, meu nome é Lucas</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Lucas'",
        "opts": [
          "Bom dia",
          "Boa noite",
          "Olá, meu nome é Lucas",
          "Até logo"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Como vai",
          "Meu nome é",
          "Quantos anos",
          "Onde mora"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Lucas'",
        "opts": [
          "name",
          "bad",
          "good",
          "big"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Lucas'?",
        "opts": [
          "Ao se apresentar",
          "Ao dormir",
          "Ao comer",
          "Ao dirigir"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Please",
          "Hello",
          "Thanks",
          "Goodbye"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "My name is Lucas",
          "Thank you",
          "Goodbye",
          "I am fine"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Qual é seu nome?",
          "Como vai?",
          "Onde mora?",
          "Quantos anos?"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Lucas'?",
        "opts": [
          "Casa",
          "Lucas",
          "Trabalho",
          "Carro"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Lucas'",
        "opts": [
          "am",
          "are",
          "is",
          "be"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Lucas'",
        "opts": [
          "Lucas is my name",
          "My Lucas is name",
          "My name is Lucas",
          "Is my name Lucas"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Lucas'",
        "opts": [
          "Boa noite",
          "Até logo",
          "Prazer em conhecer você, Lucas",
          "Bom dia"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Lucas' significa:",
        "opts": [
          "Qual seu nome?",
          "Olá, meu nome é Lucas",
          "Meu nome não é",
          "Onde mora?"
        ],
        "ans": 1,
        "type": "translation"
      }
    ]
  },
  {
    "id": 82,
    "module": 2,
    "moduleName": "Vida Diária",
    "level": "A2",
    "title": "Saúde básica",
    "desc": "Aprenda saúde básica - tradução correta Maria=Maria",
    "time": "7 MIN",
    "phrase": "Hello, my name is Maria",
    "translation": "Olá, meu nome é Maria",
    "vocab": [
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Saúde básica</h4><p><b>Frase:</b> Hello, my name is Maria = Olá, meu nome é Maria</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Maria'",
        "opts": [
          "Boa noite",
          "Bom dia",
          "Até logo",
          "Olá, meu nome é Maria"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Como vai",
          "Quantos anos",
          "Meu nome é",
          "Onde mora"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Maria'",
        "opts": [
          "big",
          "name",
          "bad",
          "good"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Maria'?",
        "opts": [
          "Ao dormir",
          "Ao se apresentar",
          "Ao dirigir",
          "Ao comer"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Please",
          "Goodbye",
          "Thanks",
          "Hello"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "I am fine",
          "Thank you",
          "Goodbye",
          "My name is Maria"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Quantos anos?",
          "Qual é seu nome?",
          "Onde mora?",
          "Como vai?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Maria'?",
        "opts": [
          "Maria",
          "Carro",
          "Casa",
          "Trabalho"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Maria'",
        "opts": [
          "is",
          "be",
          "are",
          "am"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Maria'",
        "opts": [
          "Is my name Maria",
          "My Maria is name",
          "My name is Maria",
          "Maria is my name"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Maria'",
        "opts": [
          "Boa noite",
          "Bom dia",
          "Até logo",
          "Prazer em conhecer você, Maria"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Maria' significa:",
        "opts": [
          "Meu nome não é",
          "Onde mora?",
          "Olá, meu nome é Maria",
          "Qual seu nome?"
        ],
        "ans": 2,
        "type": "translation"
      }
    ]
  },
  {
    "id": 83,
    "module": 2,
    "moduleName": "Vida Diária",
    "level": "A2",
    "title": "Emoções",
    "desc": "Aprenda emoções - tradução correta Lucas=Lucas",
    "time": "8 MIN",
    "phrase": "Hello, my name is Lucas",
    "translation": "Olá, meu nome é Lucas",
    "vocab": [
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Emoções</h4><p><b>Frase:</b> Hello, my name is Lucas = Olá, meu nome é Lucas</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Lucas'",
        "opts": [
          "Até logo",
          "Olá, meu nome é Lucas",
          "Bom dia",
          "Boa noite"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Onde mora",
          "Como vai",
          "Quantos anos",
          "Meu nome é"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Lucas'",
        "opts": [
          "big",
          "bad",
          "good",
          "name"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Lucas'?",
        "opts": [
          "Ao comer",
          "Ao se apresentar",
          "Ao dormir",
          "Ao dirigir"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Please",
          "Goodbye",
          "Thanks",
          "Hello"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "My name is Lucas",
          "Goodbye",
          "Thank you",
          "I am fine"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Onde mora?",
          "Quantos anos?",
          "Como vai?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Lucas'?",
        "opts": [
          "Carro",
          "Casa",
          "Lucas",
          "Trabalho"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Lucas'",
        "opts": [
          "is",
          "are",
          "am",
          "be"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Lucas'",
        "opts": [
          "My Lucas is name",
          "Is my name Lucas",
          "My name is Lucas",
          "Lucas is my name"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Lucas'",
        "opts": [
          "Prazer em conhecer você, Lucas",
          "Até logo",
          "Boa noite",
          "Bom dia"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Lucas' significa:",
        "opts": [
          "Meu nome não é",
          "Onde mora?",
          "Olá, meu nome é Lucas",
          "Qual seu nome?"
        ],
        "ans": 2,
        "type": "translation"
      }
    ]
  },
  {
    "id": 84,
    "module": 2,
    "moduleName": "Vida Diária",
    "level": "A2",
    "title": "Convites",
    "desc": "Aprenda convites - tradução correta David=David",
    "time": "9 MIN",
    "phrase": "Hello, my name is David",
    "translation": "Olá, meu nome é David",
    "vocab": [
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Convites</h4><p><b>Frase:</b> Hello, my name is David = Olá, meu nome é David</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is David'",
        "opts": [
          "Até logo",
          "Boa noite",
          "Olá, meu nome é David",
          "Bom dia"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Quantos anos",
          "Como vai",
          "Onde mora",
          "Meu nome é"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is David'",
        "opts": [
          "big",
          "good",
          "bad",
          "name"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is David'?",
        "opts": [
          "Ao comer",
          "Ao se apresentar",
          "Ao dirigir",
          "Ao dormir"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Goodbye",
          "Hello",
          "Please",
          "Thanks"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "Thank you",
          "My name is David",
          "Goodbye",
          "I am fine"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Como vai?",
          "Qual é seu nome?",
          "Onde mora?",
          "Quantos anos?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is David'?",
        "opts": [
          "David",
          "Trabalho",
          "Carro",
          "Casa"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ David'",
        "opts": [
          "are",
          "am",
          "be",
          "is"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / David'",
        "opts": [
          "My David is name",
          "David is my name",
          "My name is David",
          "Is my name David"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, David'",
        "opts": [
          "Prazer em conhecer você, David",
          "Bom dia",
          "Boa noite",
          "Até logo"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is David' significa:",
        "opts": [
          "Meu nome não é",
          "Qual seu nome?",
          "Olá, meu nome é David",
          "Onde mora?"
        ],
        "ans": 2,
        "type": "translation"
      }
    ]
  },
  {
    "id": 85,
    "module": 2,
    "moduleName": "Vida Diária",
    "level": "A2",
    "title": "Telefone",
    "desc": "Aprenda telefone - tradução correta Pedro=Pedro",
    "time": "10 MIN",
    "phrase": "Hello, my name is Pedro",
    "translation": "Olá, meu nome é Pedro",
    "vocab": [
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Telefone</h4><p><b>Frase:</b> Hello, my name is Pedro = Olá, meu nome é Pedro</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Pedro'",
        "opts": [
          "Boa noite",
          "Olá, meu nome é Pedro",
          "Bom dia",
          "Até logo"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Meu nome é",
          "Onde mora",
          "Quantos anos",
          "Como vai"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Pedro'",
        "opts": [
          "big",
          "bad",
          "name",
          "good"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Pedro'?",
        "opts": [
          "Ao dormir",
          "Ao dirigir",
          "Ao comer",
          "Ao se apresentar"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Please",
          "Thanks",
          "Hello",
          "Goodbye"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "Goodbye",
          "My name is Pedro",
          "I am fine",
          "Thank you"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Como vai?",
          "Quantos anos?",
          "Onde mora?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Pedro'?",
        "opts": [
          "Trabalho",
          "Pedro",
          "Carro",
          "Casa"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Pedro'",
        "opts": [
          "am",
          "be",
          "is",
          "are"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Pedro'",
        "opts": [
          "Is my name Pedro",
          "My name is Pedro",
          "Pedro is my name",
          "My Pedro is name"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Pedro'",
        "opts": [
          "Prazer em conhecer você, Pedro",
          "Bom dia",
          "Boa noite",
          "Até logo"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Pedro' significa:",
        "opts": [
          "Olá, meu nome é Pedro",
          "Meu nome não é",
          "Qual seu nome?",
          "Onde mora?"
        ],
        "ans": 0,
        "type": "translation"
      }
    ]
  },
  {
    "id": 86,
    "module": 2,
    "moduleName": "Vida Diária",
    "level": "A2",
    "title": "Email e contato",
    "desc": "Aprenda email e contato - tradução correta Lucas=Lucas",
    "time": "11 MIN",
    "phrase": "Hello, my name is Lucas",
    "translation": "Olá, meu nome é Lucas",
    "vocab": [
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Email e contato</h4><p><b>Frase:</b> Hello, my name is Lucas = Olá, meu nome é Lucas</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Lucas'",
        "opts": [
          "Olá, meu nome é Lucas",
          "Boa noite",
          "Até logo",
          "Bom dia"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Onde mora",
          "Quantos anos",
          "Como vai",
          "Meu nome é"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Lucas'",
        "opts": [
          "name",
          "bad",
          "good",
          "big"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Lucas'?",
        "opts": [
          "Ao dormir",
          "Ao comer",
          "Ao dirigir",
          "Ao se apresentar"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Thanks",
          "Please",
          "Goodbye",
          "Hello"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "Goodbye",
          "My name is Lucas",
          "Thank you",
          "I am fine"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Quantos anos?",
          "Como vai?",
          "Onde mora?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Lucas'?",
        "opts": [
          "Trabalho",
          "Casa",
          "Lucas",
          "Carro"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Lucas'",
        "opts": [
          "are",
          "am",
          "be",
          "is"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Lucas'",
        "opts": [
          "Lucas is my name",
          "Is my name Lucas",
          "My Lucas is name",
          "My name is Lucas"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Lucas'",
        "opts": [
          "Bom dia",
          "Até logo",
          "Prazer em conhecer você, Lucas",
          "Boa noite"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Lucas' significa:",
        "opts": [
          "Onde mora?",
          "Olá, meu nome é Lucas",
          "Qual seu nome?",
          "Meu nome não é"
        ],
        "ans": 1,
        "type": "translation"
      }
    ]
  },
  {
    "id": 87,
    "module": 2,
    "moduleName": "Vida Diária",
    "level": "A2",
    "title": "Planos futuros",
    "desc": "Aprenda planos futuros - tradução correta Maria=Maria",
    "time": "12 MIN",
    "phrase": "Hello, my name is Maria",
    "translation": "Olá, meu nome é Maria",
    "vocab": [
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Planos futuros</h4><p><b>Frase:</b> Hello, my name is Maria = Olá, meu nome é Maria</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Maria'",
        "opts": [
          "Até logo",
          "Bom dia",
          "Boa noite",
          "Olá, meu nome é Maria"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Quantos anos",
          "Onde mora",
          "Meu nome é",
          "Como vai"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Maria'",
        "opts": [
          "name",
          "big",
          "good",
          "bad"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Maria'?",
        "opts": [
          "Ao comer",
          "Ao dirigir",
          "Ao dormir",
          "Ao se apresentar"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Goodbye",
          "Hello",
          "Thanks",
          "Please"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "Goodbye",
          "My name is Maria",
          "Thank you",
          "I am fine"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Como vai?",
          "Onde mora?",
          "Qual é seu nome?",
          "Quantos anos?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Maria'?",
        "opts": [
          "Casa",
          "Trabalho",
          "Maria",
          "Carro"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Maria'",
        "opts": [
          "are",
          "be",
          "am",
          "is"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Maria'",
        "opts": [
          "Maria is my name",
          "My Maria is name",
          "My name is Maria",
          "Is my name Maria"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Maria'",
        "opts": [
          "Até logo",
          "Prazer em conhecer você, Maria",
          "Bom dia",
          "Boa noite"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Maria' significa:",
        "opts": [
          "Meu nome não é",
          "Qual seu nome?",
          "Onde mora?",
          "Olá, meu nome é Maria"
        ],
        "ans": 3,
        "type": "translation"
      }
    ]
  },
  {
    "id": 88,
    "module": 2,
    "moduleName": "Vida Diária",
    "level": "A2",
    "title": "Passado simples",
    "desc": "Aprenda passado simples - tradução correta Sarah=Sarah",
    "time": "13 MIN",
    "phrase": "Hello, my name is Sarah",
    "translation": "Olá, meu nome é Sarah",
    "vocab": [
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Passado simples</h4><p><b>Frase:</b> Hello, my name is Sarah = Olá, meu nome é Sarah</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Sarah'",
        "opts": [
          "Boa noite",
          "Olá, meu nome é Sarah",
          "Bom dia",
          "Até logo"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Quantos anos",
          "Como vai",
          "Onde mora",
          "Meu nome é"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Sarah'",
        "opts": [
          "bad",
          "big",
          "good",
          "name"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Sarah'?",
        "opts": [
          "Ao comer",
          "Ao dormir",
          "Ao se apresentar",
          "Ao dirigir"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Please",
          "Thanks",
          "Hello",
          "Goodbye"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "Goodbye",
          "I am fine",
          "My name is Sarah",
          "Thank you"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Como vai?",
          "Qual é seu nome?",
          "Quantos anos?",
          "Onde mora?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Sarah'?",
        "opts": [
          "Sarah",
          "Casa",
          "Carro",
          "Trabalho"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Sarah'",
        "opts": [
          "is",
          "be",
          "am",
          "are"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Sarah'",
        "opts": [
          "Sarah is my name",
          "Is my name Sarah",
          "My Sarah is name",
          "My name is Sarah"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Sarah'",
        "opts": [
          "Até logo",
          "Prazer em conhecer você, Sarah",
          "Boa noite",
          "Bom dia"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Sarah' significa:",
        "opts": [
          "Qual seu nome?",
          "Olá, meu nome é Sarah",
          "Onde mora?",
          "Meu nome não é"
        ],
        "ans": 1,
        "type": "translation"
      }
    ]
  },
  {
    "id": 89,
    "module": 2,
    "moduleName": "Vida Diária",
    "level": "A2",
    "title": "Experiências",
    "desc": "Aprenda experiências - tradução correta Miguel=Miguel",
    "time": "6 MIN",
    "phrase": "Hello, my name is Miguel",
    "translation": "Olá, meu nome é Miguel",
    "vocab": [
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Experiências</h4><p><b>Frase:</b> Hello, my name is Miguel = Olá, meu nome é Miguel</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Miguel'",
        "opts": [
          "Olá, meu nome é Miguel",
          "Até logo",
          "Bom dia",
          "Boa noite"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Como vai",
          "Onde mora",
          "Meu nome é",
          "Quantos anos"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Miguel'",
        "opts": [
          "name",
          "bad",
          "big",
          "good"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Miguel'?",
        "opts": [
          "Ao dormir",
          "Ao se apresentar",
          "Ao comer",
          "Ao dirigir"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Goodbye",
          "Thanks",
          "Please",
          "Hello"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "Goodbye",
          "Thank you",
          "My name is Miguel",
          "I am fine"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Quantos anos?",
          "Onde mora?",
          "Como vai?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Miguel'?",
        "opts": [
          "Trabalho",
          "Miguel",
          "Carro",
          "Casa"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Miguel'",
        "opts": [
          "am",
          "are",
          "is",
          "be"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Miguel'",
        "opts": [
          "My name is Miguel",
          "Is my name Miguel",
          "My Miguel is name",
          "Miguel is my name"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Miguel'",
        "opts": [
          "Boa noite",
          "Prazer em conhecer você, Miguel",
          "Até logo",
          "Bom dia"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Miguel' significa:",
        "opts": [
          "Qual seu nome?",
          "Olá, meu nome é Miguel",
          "Meu nome não é",
          "Onde mora?"
        ],
        "ans": 1,
        "type": "translation"
      }
    ]
  },
  {
    "id": 90,
    "module": 2,
    "moduleName": "Vida Diária",
    "level": "A2",
    "title": "Preferências",
    "desc": "Aprenda preferências - tradução correta Ana=Ana",
    "time": "7 MIN",
    "phrase": "Hello, my name is Ana",
    "translation": "Olá, meu nome é Ana",
    "vocab": [
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Preferências</h4><p><b>Frase:</b> Hello, my name is Ana = Olá, meu nome é Ana</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Ana'",
        "opts": [
          "Olá, meu nome é Ana",
          "Até logo",
          "Bom dia",
          "Boa noite"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Quantos anos",
          "Meu nome é",
          "Como vai",
          "Onde mora"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Ana'",
        "opts": [
          "good",
          "name",
          "bad",
          "big"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Ana'?",
        "opts": [
          "Ao se apresentar",
          "Ao dirigir",
          "Ao comer",
          "Ao dormir"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Goodbye",
          "Please",
          "Hello",
          "Thanks"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "I am fine",
          "My name is Ana",
          "Goodbye",
          "Thank you"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Qual é seu nome?",
          "Quantos anos?",
          "Como vai?",
          "Onde mora?"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Ana'?",
        "opts": [
          "Carro",
          "Ana",
          "Trabalho",
          "Casa"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Ana'",
        "opts": [
          "am",
          "are",
          "be",
          "is"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Ana'",
        "opts": [
          "Ana is my name",
          "Is my name Ana",
          "My name is Ana",
          "My Ana is name"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Ana'",
        "opts": [
          "Boa noite",
          "Até logo",
          "Bom dia",
          "Prazer em conhecer você, Ana"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Ana' significa:",
        "opts": [
          "Onde mora?",
          "Olá, meu nome é Ana",
          "Meu nome não é",
          "Qual seu nome?"
        ],
        "ans": 1,
        "type": "translation"
      }
    ]
  },
  {
    "id": 91,
    "module": 2,
    "moduleName": "Vida Diária",
    "level": "A2",
    "title": "Opiniões simples",
    "desc": "Aprenda opiniões simples - tradução correta Miguel=Miguel",
    "time": "8 MIN",
    "phrase": "Hello, my name is Miguel",
    "translation": "Olá, meu nome é Miguel",
    "vocab": [
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Opiniões simples</h4><p><b>Frase:</b> Hello, my name is Miguel = Olá, meu nome é Miguel</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Miguel'",
        "opts": [
          "Até logo",
          "Boa noite",
          "Bom dia",
          "Olá, meu nome é Miguel"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Como vai",
          "Onde mora",
          "Quantos anos",
          "Meu nome é"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Miguel'",
        "opts": [
          "big",
          "name",
          "bad",
          "good"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Miguel'?",
        "opts": [
          "Ao comer",
          "Ao dormir",
          "Ao se apresentar",
          "Ao dirigir"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Goodbye",
          "Hello",
          "Thanks",
          "Please"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "Goodbye",
          "I am fine",
          "My name is Miguel",
          "Thank you"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Quantos anos?",
          "Onde mora?",
          "Como vai?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Miguel'?",
        "opts": [
          "Miguel",
          "Carro",
          "Casa",
          "Trabalho"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Miguel'",
        "opts": [
          "am",
          "be",
          "are",
          "is"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Miguel'",
        "opts": [
          "My name is Miguel",
          "Is my name Miguel",
          "My Miguel is name",
          "Miguel is my name"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Miguel'",
        "opts": [
          "Prazer em conhecer você, Miguel",
          "Bom dia",
          "Até logo",
          "Boa noite"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Miguel' significa:",
        "opts": [
          "Olá, meu nome é Miguel",
          "Qual seu nome?",
          "Meu nome não é",
          "Onde mora?"
        ],
        "ans": 0,
        "type": "translation"
      }
    ]
  },
  {
    "id": 92,
    "module": 2,
    "moduleName": "Vida Diária",
    "level": "A2",
    "title": "Comparações",
    "desc": "Aprenda comparações - tradução correta Emma=Emma",
    "time": "9 MIN",
    "phrase": "Hello, my name is Emma",
    "translation": "Olá, meu nome é Emma",
    "vocab": [
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Comparações</h4><p><b>Frase:</b> Hello, my name is Emma = Olá, meu nome é Emma</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Emma'",
        "opts": [
          "Boa noite",
          "Olá, meu nome é Emma",
          "Até logo",
          "Bom dia"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Onde mora",
          "Como vai",
          "Meu nome é",
          "Quantos anos"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Emma'",
        "opts": [
          "bad",
          "good",
          "name",
          "big"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Emma'?",
        "opts": [
          "Ao dirigir",
          "Ao dormir",
          "Ao se apresentar",
          "Ao comer"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Hello",
          "Please",
          "Goodbye",
          "Thanks"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "Thank you",
          "Goodbye",
          "My name is Emma",
          "I am fine"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Onde mora?",
          "Qual é seu nome?",
          "Quantos anos?",
          "Como vai?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Emma'?",
        "opts": [
          "Trabalho",
          "Casa",
          "Emma",
          "Carro"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Emma'",
        "opts": [
          "is",
          "are",
          "am",
          "be"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Emma'",
        "opts": [
          "My Emma is name",
          "Is my name Emma",
          "Emma is my name",
          "My name is Emma"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Emma'",
        "opts": [
          "Prazer em conhecer você, Emma",
          "Boa noite",
          "Até logo",
          "Bom dia"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Emma' significa:",
        "opts": [
          "Meu nome não é",
          "Olá, meu nome é Emma",
          "Qual seu nome?",
          "Onde mora?"
        ],
        "ans": 1,
        "type": "translation"
      }
    ]
  },
  {
    "id": 93,
    "module": 2,
    "moduleName": "Vida Diária",
    "level": "A2",
    "title": "Conselhos",
    "desc": "Aprenda conselhos - tradução correta Ana=Ana",
    "time": "10 MIN",
    "phrase": "Hello, my name is Ana",
    "translation": "Olá, meu nome é Ana",
    "vocab": [
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Conselhos</h4><p><b>Frase:</b> Hello, my name is Ana = Olá, meu nome é Ana</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Ana'",
        "opts": [
          "Olá, meu nome é Ana",
          "Bom dia",
          "Boa noite",
          "Até logo"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Como vai",
          "Onde mora",
          "Quantos anos",
          "Meu nome é"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Ana'",
        "opts": [
          "big",
          "good",
          "name",
          "bad"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Ana'?",
        "opts": [
          "Ao comer",
          "Ao dirigir",
          "Ao dormir",
          "Ao se apresentar"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Thanks",
          "Goodbye",
          "Hello",
          "Please"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "Thank you",
          "I am fine",
          "My name is Ana",
          "Goodbye"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Quantos anos?",
          "Onde mora?",
          "Qual é seu nome?",
          "Como vai?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Ana'?",
        "opts": [
          "Ana",
          "Carro",
          "Casa",
          "Trabalho"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Ana'",
        "opts": [
          "is",
          "are",
          "be",
          "am"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Ana'",
        "opts": [
          "My name is Ana",
          "Ana is my name",
          "Is my name Ana",
          "My Ana is name"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Ana'",
        "opts": [
          "Prazer em conhecer você, Ana",
          "Boa noite",
          "Até logo",
          "Bom dia"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Ana' significa:",
        "opts": [
          "Onde mora?",
          "Meu nome não é",
          "Qual seu nome?",
          "Olá, meu nome é Ana"
        ],
        "ans": 3,
        "type": "translation"
      }
    ]
  },
  {
    "id": 94,
    "module": 2,
    "moduleName": "Vida Diária",
    "level": "A2",
    "title": "Convite para café",
    "desc": "Aprenda convite para café - tradução correta Julia=Julia",
    "time": "11 MIN",
    "phrase": "Hello, my name is Julia",
    "translation": "Olá, meu nome é Julia",
    "vocab": [
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Convite para café</h4><p><b>Frase:</b> Hello, my name is Julia = Olá, meu nome é Julia</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Julia'",
        "opts": [
          "Bom dia",
          "Boa noite",
          "Olá, meu nome é Julia",
          "Até logo"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Como vai",
          "Onde mora",
          "Quantos anos",
          "Meu nome é"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Julia'",
        "opts": [
          "big",
          "name",
          "good",
          "bad"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Julia'?",
        "opts": [
          "Ao dirigir",
          "Ao comer",
          "Ao dormir",
          "Ao se apresentar"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Goodbye",
          "Please",
          "Hello",
          "Thanks"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "Goodbye",
          "My name is Julia",
          "I am fine",
          "Thank you"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Onde mora?",
          "Como vai?",
          "Qual é seu nome?",
          "Quantos anos?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Julia'?",
        "opts": [
          "Julia",
          "Trabalho",
          "Casa",
          "Carro"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Julia'",
        "opts": [
          "is",
          "are",
          "am",
          "be"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Julia'",
        "opts": [
          "My Julia is name",
          "My name is Julia",
          "Is my name Julia",
          "Julia is my name"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Julia'",
        "opts": [
          "Prazer em conhecer você, Julia",
          "Bom dia",
          "Boa noite",
          "Até logo"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Julia' significa:",
        "opts": [
          "Meu nome não é",
          "Qual seu nome?",
          "Olá, meu nome é Julia",
          "Onde mora?"
        ],
        "ans": 2,
        "type": "translation"
      }
    ]
  },
  {
    "id": 95,
    "module": 2,
    "moduleName": "Vida Diária",
    "level": "A2",
    "title": "Conhecendo vizinhos",
    "desc": "Aprenda conhecendo vizinhos - tradução correta Miguel=Miguel",
    "time": "12 MIN",
    "phrase": "Hello, my name is Miguel",
    "translation": "Olá, meu nome é Miguel",
    "vocab": [
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Conhecendo vizinhos</h4><p><b>Frase:</b> Hello, my name is Miguel = Olá, meu nome é Miguel</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Miguel'",
        "opts": [
          "Boa noite",
          "Olá, meu nome é Miguel",
          "Bom dia",
          "Até logo"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Quantos anos",
          "Meu nome é",
          "Como vai",
          "Onde mora"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Miguel'",
        "opts": [
          "big",
          "bad",
          "good",
          "name"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Miguel'?",
        "opts": [
          "Ao dormir",
          "Ao comer",
          "Ao dirigir",
          "Ao se apresentar"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Thanks",
          "Please",
          "Hello",
          "Goodbye"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "I am fine",
          "My name is Miguel",
          "Goodbye",
          "Thank you"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Onde mora?",
          "Como vai?",
          "Qual é seu nome?",
          "Quantos anos?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Miguel'?",
        "opts": [
          "Trabalho",
          "Carro",
          "Casa",
          "Miguel"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Miguel'",
        "opts": [
          "are",
          "is",
          "be",
          "am"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Miguel'",
        "opts": [
          "Is my name Miguel",
          "My Miguel is name",
          "Miguel is my name",
          "My name is Miguel"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Miguel'",
        "opts": [
          "Até logo",
          "Boa noite",
          "Prazer em conhecer você, Miguel",
          "Bom dia"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Miguel' significa:",
        "opts": [
          "Qual seu nome?",
          "Onde mora?",
          "Meu nome não é",
          "Olá, meu nome é Miguel"
        ],
        "ans": 3,
        "type": "translation"
      }
    ]
  },
  {
    "id": 96,
    "module": 2,
    "moduleName": "Vida Diária",
    "level": "A2",
    "title": "Festa e celebração",
    "desc": "Aprenda festa e celebração - tradução correta Julia=Julia",
    "time": "13 MIN",
    "phrase": "Hello, my name is Julia",
    "translation": "Olá, meu nome é Julia",
    "vocab": [
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Festa e celebração</h4><p><b>Frase:</b> Hello, my name is Julia = Olá, meu nome é Julia</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Julia'",
        "opts": [
          "Boa noite",
          "Até logo",
          "Bom dia",
          "Olá, meu nome é Julia"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Como vai",
          "Meu nome é",
          "Quantos anos",
          "Onde mora"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Julia'",
        "opts": [
          "big",
          "good",
          "bad",
          "name"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Julia'?",
        "opts": [
          "Ao dormir",
          "Ao dirigir",
          "Ao comer",
          "Ao se apresentar"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Hello",
          "Please",
          "Goodbye",
          "Thanks"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "Goodbye",
          "I am fine",
          "My name is Julia",
          "Thank you"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Qual é seu nome?",
          "Onde mora?",
          "Quantos anos?",
          "Como vai?"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Julia'?",
        "opts": [
          "Casa",
          "Julia",
          "Trabalho",
          "Carro"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Julia'",
        "opts": [
          "are",
          "is",
          "be",
          "am"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Julia'",
        "opts": [
          "My name is Julia",
          "My Julia is name",
          "Julia is my name",
          "Is my name Julia"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Julia'",
        "opts": [
          "Prazer em conhecer você, Julia",
          "Boa noite",
          "Bom dia",
          "Até logo"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Julia' significa:",
        "opts": [
          "Olá, meu nome é Julia",
          "Qual seu nome?",
          "Meu nome não é",
          "Onde mora?"
        ],
        "ans": 0,
        "type": "translation"
      }
    ]
  },
  {
    "id": 97,
    "module": 2,
    "moduleName": "Vida Diária",
    "level": "A2",
    "title": "Filmes e música",
    "desc": "Aprenda filmes e música - tradução correta Maria=Maria",
    "time": "6 MIN",
    "phrase": "Hello, my name is Maria",
    "translation": "Olá, meu nome é Maria",
    "vocab": [
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Filmes e música</h4><p><b>Frase:</b> Hello, my name is Maria = Olá, meu nome é Maria</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Maria'",
        "opts": [
          "Boa noite",
          "Até logo",
          "Olá, meu nome é Maria",
          "Bom dia"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Como vai",
          "Meu nome é",
          "Onde mora",
          "Quantos anos"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Maria'",
        "opts": [
          "bad",
          "big",
          "good",
          "name"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Maria'?",
        "opts": [
          "Ao comer",
          "Ao se apresentar",
          "Ao dormir",
          "Ao dirigir"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Hello",
          "Thanks",
          "Goodbye",
          "Please"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "Goodbye",
          "Thank you",
          "My name is Maria",
          "I am fine"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Quantos anos?",
          "Qual é seu nome?",
          "Onde mora?",
          "Como vai?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Maria'?",
        "opts": [
          "Casa",
          "Carro",
          "Maria",
          "Trabalho"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Maria'",
        "opts": [
          "is",
          "are",
          "am",
          "be"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Maria'",
        "opts": [
          "My name is Maria",
          "My Maria is name",
          "Is my name Maria",
          "Maria is my name"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Maria'",
        "opts": [
          "Até logo",
          "Prazer em conhecer você, Maria",
          "Boa noite",
          "Bom dia"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Maria' significa:",
        "opts": [
          "Onde mora?",
          "Meu nome não é",
          "Olá, meu nome é Maria",
          "Qual seu nome?"
        ],
        "ans": 2,
        "type": "translation"
      }
    ]
  },
  {
    "id": 98,
    "module": 2,
    "moduleName": "Vida Diária",
    "level": "A2",
    "title": "Esportes",
    "desc": "Aprenda esportes - tradução correta Julia=Julia",
    "time": "7 MIN",
    "phrase": "Hello, my name is Julia",
    "translation": "Olá, meu nome é Julia",
    "vocab": [
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Esportes</h4><p><b>Frase:</b> Hello, my name is Julia = Olá, meu nome é Julia</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Julia'",
        "opts": [
          "Até logo",
          "Bom dia",
          "Boa noite",
          "Olá, meu nome é Julia"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Como vai",
          "Quantos anos",
          "Onde mora",
          "Meu nome é"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Julia'",
        "opts": [
          "bad",
          "good",
          "name",
          "big"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Julia'?",
        "opts": [
          "Ao se apresentar",
          "Ao dormir",
          "Ao dirigir",
          "Ao comer"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Please",
          "Goodbye",
          "Thanks",
          "Hello"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "I am fine",
          "Thank you",
          "Goodbye",
          "My name is Julia"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Quantos anos?",
          "Onde mora?",
          "Qual é seu nome?",
          "Como vai?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Julia'?",
        "opts": [
          "Julia",
          "Trabalho",
          "Carro",
          "Casa"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Julia'",
        "opts": [
          "am",
          "be",
          "are",
          "is"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Julia'",
        "opts": [
          "My name is Julia",
          "My Julia is name",
          "Julia is my name",
          "Is my name Julia"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Julia'",
        "opts": [
          "Até logo",
          "Prazer em conhecer você, Julia",
          "Boa noite",
          "Bom dia"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Julia' significa:",
        "opts": [
          "Qual seu nome?",
          "Onde mora?",
          "Olá, meu nome é Julia",
          "Meu nome não é"
        ],
        "ans": 2,
        "type": "translation"
      }
    ]
  },
  {
    "id": 99,
    "module": 2,
    "moduleName": "Vida Diária",
    "level": "A2",
    "title": "Viagem curta",
    "desc": "Aprenda viagem curta - tradução correta Julia=Julia",
    "time": "8 MIN",
    "phrase": "Hello, my name is Julia",
    "translation": "Olá, meu nome é Julia",
    "vocab": [
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Viagem curta</h4><p><b>Frase:</b> Hello, my name is Julia = Olá, meu nome é Julia</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Julia'",
        "opts": [
          "Olá, meu nome é Julia",
          "Boa noite",
          "Até logo",
          "Bom dia"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Quantos anos",
          "Como vai",
          "Onde mora",
          "Meu nome é"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Julia'",
        "opts": [
          "name",
          "good",
          "big",
          "bad"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Julia'?",
        "opts": [
          "Ao dirigir",
          "Ao comer",
          "Ao se apresentar",
          "Ao dormir"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Please",
          "Goodbye",
          "Thanks",
          "Hello"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "I am fine",
          "Goodbye",
          "Thank you",
          "My name is Julia"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Qual é seu nome?",
          "Onde mora?",
          "Quantos anos?",
          "Como vai?"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Julia'?",
        "opts": [
          "Carro",
          "Casa",
          "Trabalho",
          "Julia"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Julia'",
        "opts": [
          "be",
          "is",
          "am",
          "are"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Julia'",
        "opts": [
          "My Julia is name",
          "Julia is my name",
          "Is my name Julia",
          "My name is Julia"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Julia'",
        "opts": [
          "Bom dia",
          "Até logo",
          "Prazer em conhecer você, Julia",
          "Boa noite"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Julia' significa:",
        "opts": [
          "Olá, meu nome é Julia",
          "Meu nome não é",
          "Onde mora?",
          "Qual seu nome?"
        ],
        "ans": 0,
        "type": "translation"
      }
    ]
  },
  {
    "id": 100,
    "module": 2,
    "moduleName": "Vida Diária",
    "level": "A2",
    "title": "Cultura local",
    "desc": "Aprenda cultura local - tradução correta Miguel=Miguel",
    "time": "9 MIN",
    "phrase": "Hello, my name is Miguel",
    "translation": "Olá, meu nome é Miguel",
    "vocab": [
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Cultura local</h4><p><b>Frase:</b> Hello, my name is Miguel = Olá, meu nome é Miguel</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Miguel'",
        "opts": [
          "Olá, meu nome é Miguel",
          "Boa noite",
          "Até logo",
          "Bom dia"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Onde mora",
          "Meu nome é",
          "Como vai",
          "Quantos anos"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Miguel'",
        "opts": [
          "name",
          "big",
          "good",
          "bad"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Miguel'?",
        "opts": [
          "Ao comer",
          "Ao se apresentar",
          "Ao dirigir",
          "Ao dormir"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Hello",
          "Please",
          "Goodbye",
          "Thanks"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "Goodbye",
          "I am fine",
          "My name is Miguel",
          "Thank you"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Como vai?",
          "Onde mora?",
          "Quantos anos?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Miguel'?",
        "opts": [
          "Miguel",
          "Carro",
          "Trabalho",
          "Casa"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Miguel'",
        "opts": [
          "is",
          "am",
          "be",
          "are"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Miguel'",
        "opts": [
          "Miguel is my name",
          "Is my name Miguel",
          "My Miguel is name",
          "My name is Miguel"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Miguel'",
        "opts": [
          "Bom dia",
          "Prazer em conhecer você, Miguel",
          "Até logo",
          "Boa noite"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Miguel' significa:",
        "opts": [
          "Qual seu nome?",
          "Olá, meu nome é Miguel",
          "Meu nome não é",
          "Onde mora?"
        ],
        "ans": 1,
        "type": "translation"
      }
    ]
  },
  {
    "id": 101,
    "module": 2,
    "moduleName": "Vida Diária",
    "level": "A2",
    "title": "Olá e apresentações",
    "desc": "Aprenda olá e apresentações - tradução correta John=John",
    "time": "10 MIN",
    "phrase": "Hello, my name is John",
    "translation": "Olá, meu nome é John",
    "vocab": [
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Olá e apresentações</h4><p><b>Frase:</b> Hello, my name is John = Olá, meu nome é John</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is John'",
        "opts": [
          "Olá, meu nome é John",
          "Boa noite",
          "Bom dia",
          "Até logo"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Como vai",
          "Onde mora",
          "Meu nome é",
          "Quantos anos"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is John'",
        "opts": [
          "big",
          "good",
          "bad",
          "name"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is John'?",
        "opts": [
          "Ao dirigir",
          "Ao comer",
          "Ao dormir",
          "Ao se apresentar"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Hello",
          "Please",
          "Goodbye",
          "Thanks"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "I am fine",
          "Goodbye",
          "Thank you",
          "My name is John"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Como vai?",
          "Qual é seu nome?",
          "Quantos anos?",
          "Onde mora?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is John'?",
        "opts": [
          "Trabalho",
          "John",
          "Casa",
          "Carro"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ John'",
        "opts": [
          "is",
          "be",
          "are",
          "am"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / John'",
        "opts": [
          "My name is John",
          "John is my name",
          "My John is name",
          "Is my name John"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, John'",
        "opts": [
          "Até logo",
          "Prazer em conhecer você, John",
          "Boa noite",
          "Bom dia"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is John' significa:",
        "opts": [
          "Onde mora?",
          "Olá, meu nome é John",
          "Meu nome não é",
          "Qual seu nome?"
        ],
        "ans": 1,
        "type": "translation"
      }
    ]
  },
  {
    "id": 102,
    "module": 2,
    "moduleName": "Vida Diária",
    "level": "A2",
    "title": "Dizendo seu nome",
    "desc": "Aprenda dizendo seu nome - tradução correta Maria=Maria",
    "time": "11 MIN",
    "phrase": "Hello, my name is Maria",
    "translation": "Olá, meu nome é Maria",
    "vocab": [
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Dizendo seu nome</h4><p><b>Frase:</b> Hello, my name is Maria = Olá, meu nome é Maria</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Maria'",
        "opts": [
          "Olá, meu nome é Maria",
          "Até logo",
          "Boa noite",
          "Bom dia"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Quantos anos",
          "Meu nome é",
          "Como vai",
          "Onde mora"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Maria'",
        "opts": [
          "good",
          "big",
          "name",
          "bad"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Maria'?",
        "opts": [
          "Ao dirigir",
          "Ao dormir",
          "Ao se apresentar",
          "Ao comer"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Please",
          "Goodbye",
          "Thanks",
          "Hello"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "Thank you",
          "I am fine",
          "My name is Maria",
          "Goodbye"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Qual é seu nome?",
          "Como vai?",
          "Onde mora?",
          "Quantos anos?"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Maria'?",
        "opts": [
          "Casa",
          "Carro",
          "Maria",
          "Trabalho"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Maria'",
        "opts": [
          "be",
          "are",
          "am",
          "is"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Maria'",
        "opts": [
          "My name is Maria",
          "Maria is my name",
          "My Maria is name",
          "Is my name Maria"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Maria'",
        "opts": [
          "Bom dia",
          "Até logo",
          "Boa noite",
          "Prazer em conhecer você, Maria"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Maria' significa:",
        "opts": [
          "Meu nome não é",
          "Qual seu nome?",
          "Olá, meu nome é Maria",
          "Onde mora?"
        ],
        "ans": 2,
        "type": "translation"
      }
    ]
  },
  {
    "id": 103,
    "module": 2,
    "moduleName": "Vida Diária",
    "level": "A2",
    "title": "De onde você é",
    "desc": "Aprenda de onde você é - tradução correta Pedro=Pedro",
    "time": "12 MIN",
    "phrase": "Hello, my name is Pedro",
    "translation": "Olá, meu nome é Pedro",
    "vocab": [
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 De onde você é</h4><p><b>Frase:</b> Hello, my name is Pedro = Olá, meu nome é Pedro</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Pedro'",
        "opts": [
          "Olá, meu nome é Pedro",
          "Boa noite",
          "Até logo",
          "Bom dia"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Meu nome é",
          "Onde mora",
          "Como vai",
          "Quantos anos"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Pedro'",
        "opts": [
          "big",
          "good",
          "bad",
          "name"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Pedro'?",
        "opts": [
          "Ao dormir",
          "Ao comer",
          "Ao dirigir",
          "Ao se apresentar"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Hello",
          "Please",
          "Thanks",
          "Goodbye"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "Goodbye",
          "I am fine",
          "My name is Pedro",
          "Thank you"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Qual é seu nome?",
          "Onde mora?",
          "Como vai?",
          "Quantos anos?"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Pedro'?",
        "opts": [
          "Casa",
          "Pedro",
          "Carro",
          "Trabalho"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Pedro'",
        "opts": [
          "are",
          "is",
          "be",
          "am"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Pedro'",
        "opts": [
          "Is my name Pedro",
          "Pedro is my name",
          "My name is Pedro",
          "My Pedro is name"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Pedro'",
        "opts": [
          "Prazer em conhecer você, Pedro",
          "Bom dia",
          "Até logo",
          "Boa noite"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Pedro' significa:",
        "opts": [
          "Onde mora?",
          "Olá, meu nome é Pedro",
          "Qual seu nome?",
          "Meu nome não é"
        ],
        "ans": 1,
        "type": "translation"
      }
    ]
  },
  {
    "id": 104,
    "module": 2,
    "moduleName": "Vida Diária",
    "level": "A2",
    "title": "Perguntando o nome",
    "desc": "Aprenda perguntando o nome - tradução correta Sarah=Sarah",
    "time": "13 MIN",
    "phrase": "Hello, my name is Sarah",
    "translation": "Olá, meu nome é Sarah",
    "vocab": [
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Perguntando o nome</h4><p><b>Frase:</b> Hello, my name is Sarah = Olá, meu nome é Sarah</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Sarah'",
        "opts": [
          "Até logo",
          "Bom dia",
          "Olá, meu nome é Sarah",
          "Boa noite"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Onde mora",
          "Meu nome é",
          "Quantos anos",
          "Como vai"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Sarah'",
        "opts": [
          "name",
          "bad",
          "big",
          "good"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Sarah'?",
        "opts": [
          "Ao dormir",
          "Ao se apresentar",
          "Ao comer",
          "Ao dirigir"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Hello",
          "Please",
          "Goodbye",
          "Thanks"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "I am fine",
          "Goodbye",
          "My name is Sarah",
          "Thank you"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Onde mora?",
          "Qual é seu nome?",
          "Como vai?",
          "Quantos anos?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Sarah'?",
        "opts": [
          "Sarah",
          "Carro",
          "Casa",
          "Trabalho"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Sarah'",
        "opts": [
          "is",
          "am",
          "are",
          "be"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Sarah'",
        "opts": [
          "My Sarah is name",
          "Sarah is my name",
          "Is my name Sarah",
          "My name is Sarah"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Sarah'",
        "opts": [
          "Bom dia",
          "Boa noite",
          "Até logo",
          "Prazer em conhecer você, Sarah"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Sarah' significa:",
        "opts": [
          "Onde mora?",
          "Olá, meu nome é Sarah",
          "Meu nome não é",
          "Qual seu nome?"
        ],
        "ans": 1,
        "type": "translation"
      }
    ]
  },
  {
    "id": 105,
    "module": 2,
    "moduleName": "Vida Diária",
    "level": "A2",
    "title": "Idade e aniversário",
    "desc": "Aprenda idade e aniversário - tradução correta Sarah=Sarah",
    "time": "6 MIN",
    "phrase": "Hello, my name is Sarah",
    "translation": "Olá, meu nome é Sarah",
    "vocab": [
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Idade e aniversário</h4><p><b>Frase:</b> Hello, my name is Sarah = Olá, meu nome é Sarah</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Sarah'",
        "opts": [
          "Bom dia",
          "Até logo",
          "Boa noite",
          "Olá, meu nome é Sarah"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Como vai",
          "Onde mora",
          "Quantos anos",
          "Meu nome é"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Sarah'",
        "opts": [
          "big",
          "bad",
          "name",
          "good"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Sarah'?",
        "opts": [
          "Ao dormir",
          "Ao dirigir",
          "Ao se apresentar",
          "Ao comer"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Hello",
          "Please",
          "Thanks",
          "Goodbye"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "I am fine",
          "My name is Sarah",
          "Thank you",
          "Goodbye"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Quantos anos?",
          "Como vai?",
          "Qual é seu nome?",
          "Onde mora?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Sarah'?",
        "opts": [
          "Sarah",
          "Trabalho",
          "Carro",
          "Casa"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Sarah'",
        "opts": [
          "be",
          "is",
          "are",
          "am"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Sarah'",
        "opts": [
          "My Sarah is name",
          "Is my name Sarah",
          "My name is Sarah",
          "Sarah is my name"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Sarah'",
        "opts": [
          "Boa noite",
          "Bom dia",
          "Até logo",
          "Prazer em conhecer você, Sarah"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Sarah' significa:",
        "opts": [
          "Olá, meu nome é Sarah",
          "Onde mora?",
          "Qual seu nome?",
          "Meu nome não é"
        ],
        "ans": 0,
        "type": "translation"
      }
    ]
  },
  {
    "id": 106,
    "module": 2,
    "moduleName": "Vida Diária",
    "level": "A2",
    "title": "Família básica",
    "desc": "Aprenda família básica - tradução correta John=John",
    "time": "7 MIN",
    "phrase": "Hello, my name is John",
    "translation": "Olá, meu nome é John",
    "vocab": [
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Família básica</h4><p><b>Frase:</b> Hello, my name is John = Olá, meu nome é John</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is John'",
        "opts": [
          "Olá, meu nome é John",
          "Bom dia",
          "Até logo",
          "Boa noite"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Como vai",
          "Quantos anos",
          "Onde mora",
          "Meu nome é"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is John'",
        "opts": [
          "bad",
          "name",
          "big",
          "good"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is John'?",
        "opts": [
          "Ao dormir",
          "Ao se apresentar",
          "Ao comer",
          "Ao dirigir"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Goodbye",
          "Hello",
          "Please",
          "Thanks"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "I am fine",
          "Thank you",
          "Goodbye",
          "My name is John"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Como vai?",
          "Onde mora?",
          "Qual é seu nome?",
          "Quantos anos?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is John'?",
        "opts": [
          "Trabalho",
          "John",
          "Carro",
          "Casa"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ John'",
        "opts": [
          "am",
          "be",
          "are",
          "is"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / John'",
        "opts": [
          "My John is name",
          "Is my name John",
          "My name is John",
          "John is my name"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, John'",
        "opts": [
          "Prazer em conhecer você, John",
          "Boa noite",
          "Até logo",
          "Bom dia"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is John' significa:",
        "opts": [
          "Qual seu nome?",
          "Meu nome não é",
          "Olá, meu nome é John",
          "Onde mora?"
        ],
        "ans": 2,
        "type": "translation"
      }
    ]
  },
  {
    "id": 107,
    "module": 2,
    "moduleName": "Vida Diária",
    "level": "A2",
    "title": "Cumprimentos formais",
    "desc": "Aprenda cumprimentos formais - tradução correta Miguel=Miguel",
    "time": "8 MIN",
    "phrase": "Hello, my name is Miguel",
    "translation": "Olá, meu nome é Miguel",
    "vocab": [
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Cumprimentos formais</h4><p><b>Frase:</b> Hello, my name is Miguel = Olá, meu nome é Miguel</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Miguel'",
        "opts": [
          "Bom dia",
          "Até logo",
          "Olá, meu nome é Miguel",
          "Boa noite"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Onde mora",
          "Quantos anos",
          "Como vai",
          "Meu nome é"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Miguel'",
        "opts": [
          "big",
          "good",
          "name",
          "bad"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Miguel'?",
        "opts": [
          "Ao dormir",
          "Ao dirigir",
          "Ao se apresentar",
          "Ao comer"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Thanks",
          "Hello",
          "Please",
          "Goodbye"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "Thank you",
          "I am fine",
          "My name is Miguel",
          "Goodbye"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Qual é seu nome?",
          "Quantos anos?",
          "Como vai?",
          "Onde mora?"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Miguel'?",
        "opts": [
          "Trabalho",
          "Casa",
          "Miguel",
          "Carro"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Miguel'",
        "opts": [
          "are",
          "is",
          "be",
          "am"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Miguel'",
        "opts": [
          "My name is Miguel",
          "Miguel is my name",
          "Is my name Miguel",
          "My Miguel is name"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Miguel'",
        "opts": [
          "Bom dia",
          "Até logo",
          "Prazer em conhecer você, Miguel",
          "Boa noite"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Miguel' significa:",
        "opts": [
          "Meu nome não é",
          "Qual seu nome?",
          "Olá, meu nome é Miguel",
          "Onde mora?"
        ],
        "ans": 2,
        "type": "translation"
      }
    ]
  },
  {
    "id": 108,
    "module": 2,
    "moduleName": "Vida Diária",
    "level": "A2",
    "title": "Despedidas",
    "desc": "Aprenda despedidas - tradução correta Emma=Emma",
    "time": "9 MIN",
    "phrase": "Hello, my name is Emma",
    "translation": "Olá, meu nome é Emma",
    "vocab": [
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Despedidas</h4><p><b>Frase:</b> Hello, my name is Emma = Olá, meu nome é Emma</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Emma'",
        "opts": [
          "Olá, meu nome é Emma",
          "Até logo",
          "Boa noite",
          "Bom dia"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Onde mora",
          "Como vai",
          "Quantos anos",
          "Meu nome é"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Emma'",
        "opts": [
          "name",
          "good",
          "bad",
          "big"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Emma'?",
        "opts": [
          "Ao comer",
          "Ao se apresentar",
          "Ao dirigir",
          "Ao dormir"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Hello",
          "Goodbye",
          "Thanks",
          "Please"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "Goodbye",
          "My name is Emma",
          "I am fine",
          "Thank you"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Qual é seu nome?",
          "Quantos anos?",
          "Como vai?",
          "Onde mora?"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Emma'?",
        "opts": [
          "Casa",
          "Trabalho",
          "Emma",
          "Carro"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Emma'",
        "opts": [
          "are",
          "is",
          "am",
          "be"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Emma'",
        "opts": [
          "Is my name Emma",
          "My name is Emma",
          "My Emma is name",
          "Emma is my name"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Emma'",
        "opts": [
          "Até logo",
          "Bom dia",
          "Boa noite",
          "Prazer em conhecer você, Emma"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Emma' significa:",
        "opts": [
          "Olá, meu nome é Emma",
          "Meu nome não é",
          "Onde mora?",
          "Qual seu nome?"
        ],
        "ans": 0,
        "type": "translation"
      }
    ]
  },
  {
    "id": 109,
    "module": 2,
    "moduleName": "Vida Diária",
    "level": "A2",
    "title": "Como você está",
    "desc": "Aprenda como você está - tradução correta Julia=Julia",
    "time": "10 MIN",
    "phrase": "Hello, my name is Julia",
    "translation": "Olá, meu nome é Julia",
    "vocab": [
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Como você está</h4><p><b>Frase:</b> Hello, my name is Julia = Olá, meu nome é Julia</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Julia'",
        "opts": [
          "Olá, meu nome é Julia",
          "Até logo",
          "Bom dia",
          "Boa noite"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Onde mora",
          "Meu nome é",
          "Como vai",
          "Quantos anos"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Julia'",
        "opts": [
          "name",
          "good",
          "bad",
          "big"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Julia'?",
        "opts": [
          "Ao dirigir",
          "Ao se apresentar",
          "Ao dormir",
          "Ao comer"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Goodbye",
          "Hello",
          "Please",
          "Thanks"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "I am fine",
          "My name is Julia",
          "Thank you",
          "Goodbye"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Onde mora?",
          "Como vai?",
          "Quantos anos?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Julia'?",
        "opts": [
          "Trabalho",
          "Casa",
          "Julia",
          "Carro"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Julia'",
        "opts": [
          "is",
          "am",
          "are",
          "be"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Julia'",
        "opts": [
          "My name is Julia",
          "My Julia is name",
          "Julia is my name",
          "Is my name Julia"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Julia'",
        "opts": [
          "Bom dia",
          "Até logo",
          "Prazer em conhecer você, Julia",
          "Boa noite"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Julia' significa:",
        "opts": [
          "Qual seu nome?",
          "Meu nome não é",
          "Olá, meu nome é Julia",
          "Onde mora?"
        ],
        "ans": 2,
        "type": "translation"
      }
    ]
  },
  {
    "id": 110,
    "module": 2,
    "moduleName": "Vida Diária",
    "level": "A2",
    "title": "Números e telefone",
    "desc": "Aprenda números e telefone - tradução correta John=John",
    "time": "11 MIN",
    "phrase": "Hello, my name is John",
    "translation": "Olá, meu nome é John",
    "vocab": [
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Números e telefone</h4><p><b>Frase:</b> Hello, my name is John = Olá, meu nome é John</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is John'",
        "opts": [
          "Até logo",
          "Olá, meu nome é John",
          "Boa noite",
          "Bom dia"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Onde mora",
          "Meu nome é",
          "Como vai",
          "Quantos anos"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is John'",
        "opts": [
          "big",
          "name",
          "bad",
          "good"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is John'?",
        "opts": [
          "Ao se apresentar",
          "Ao dirigir",
          "Ao dormir",
          "Ao comer"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Goodbye",
          "Thanks",
          "Hello",
          "Please"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "Goodbye",
          "I am fine",
          "My name is John",
          "Thank you"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Quantos anos?",
          "Onde mora?",
          "Qual é seu nome?",
          "Como vai?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is John'?",
        "opts": [
          "Trabalho",
          "Casa",
          "John",
          "Carro"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ John'",
        "opts": [
          "be",
          "am",
          "are",
          "is"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / John'",
        "opts": [
          "My name is John",
          "My John is name",
          "Is my name John",
          "John is my name"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, John'",
        "opts": [
          "Boa noite",
          "Até logo",
          "Bom dia",
          "Prazer em conhecer você, John"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is John' significa:",
        "opts": [
          "Meu nome não é",
          "Olá, meu nome é John",
          "Onde mora?",
          "Qual seu nome?"
        ],
        "ans": 1,
        "type": "translation"
      }
    ]
  },
  {
    "id": 111,
    "module": 2,
    "moduleName": "Vida Diária",
    "level": "A2",
    "title": "Endereço e cidade",
    "desc": "Aprenda endereço e cidade - tradução correta John=John",
    "time": "12 MIN",
    "phrase": "Hello, my name is John",
    "translation": "Olá, meu nome é John",
    "vocab": [
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Endereço e cidade</h4><p><b>Frase:</b> Hello, my name is John = Olá, meu nome é John</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is John'",
        "opts": [
          "Bom dia",
          "Boa noite",
          "Até logo",
          "Olá, meu nome é John"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Meu nome é",
          "Como vai",
          "Onde mora",
          "Quantos anos"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is John'",
        "opts": [
          "bad",
          "good",
          "big",
          "name"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is John'?",
        "opts": [
          "Ao dormir",
          "Ao dirigir",
          "Ao comer",
          "Ao se apresentar"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Goodbye",
          "Please",
          "Hello",
          "Thanks"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "Thank you",
          "I am fine",
          "Goodbye",
          "My name is John"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Como vai?",
          "Onde mora?",
          "Quantos anos?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is John'?",
        "opts": [
          "Trabalho",
          "Carro",
          "John",
          "Casa"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ John'",
        "opts": [
          "are",
          "be",
          "am",
          "is"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / John'",
        "opts": [
          "John is my name",
          "My name is John",
          "My John is name",
          "Is my name John"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, John'",
        "opts": [
          "Prazer em conhecer você, John",
          "Bom dia",
          "Até logo",
          "Boa noite"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is John' significa:",
        "opts": [
          "Meu nome não é",
          "Onde mora?",
          "Olá, meu nome é John",
          "Qual seu nome?"
        ],
        "ans": 2,
        "type": "translation"
      }
    ]
  },
  {
    "id": 112,
    "module": 2,
    "moduleName": "Vida Diária",
    "level": "A2",
    "title": "Profissão simples",
    "desc": "Aprenda profissão simples - tradução correta Carlos=Carlos",
    "time": "13 MIN",
    "phrase": "Hello, my name is Carlos",
    "translation": "Olá, meu nome é Carlos",
    "vocab": [
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Profissão simples</h4><p><b>Frase:</b> Hello, my name is Carlos = Olá, meu nome é Carlos</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Carlos'",
        "opts": [
          "Até logo",
          "Boa noite",
          "Olá, meu nome é Carlos",
          "Bom dia"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Como vai",
          "Onde mora",
          "Quantos anos",
          "Meu nome é"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Carlos'",
        "opts": [
          "big",
          "good",
          "bad",
          "name"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Carlos'?",
        "opts": [
          "Ao dormir",
          "Ao comer",
          "Ao dirigir",
          "Ao se apresentar"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Goodbye",
          "Hello",
          "Please",
          "Thanks"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "Goodbye",
          "My name is Carlos",
          "I am fine",
          "Thank you"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Onde mora?",
          "Como vai?",
          "Quantos anos?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Carlos'?",
        "opts": [
          "Casa",
          "Carlos",
          "Trabalho",
          "Carro"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Carlos'",
        "opts": [
          "are",
          "be",
          "is",
          "am"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Carlos'",
        "opts": [
          "My Carlos is name",
          "Is my name Carlos",
          "Carlos is my name",
          "My name is Carlos"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Carlos'",
        "opts": [
          "Boa noite",
          "Até logo",
          "Prazer em conhecer você, Carlos",
          "Bom dia"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Carlos' significa:",
        "opts": [
          "Qual seu nome?",
          "Meu nome não é",
          "Onde mora?",
          "Olá, meu nome é Carlos"
        ],
        "ans": 3,
        "type": "translation"
      }
    ]
  },
  {
    "id": 113,
    "module": 2,
    "moduleName": "Vida Diária",
    "level": "A2",
    "title": "Hobbies favoritos",
    "desc": "Aprenda hobbies favoritos - tradução correta Miguel=Miguel",
    "time": "6 MIN",
    "phrase": "Hello, my name is Miguel",
    "translation": "Olá, meu nome é Miguel",
    "vocab": [
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Hobbies favoritos</h4><p><b>Frase:</b> Hello, my name is Miguel = Olá, meu nome é Miguel</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Miguel'",
        "opts": [
          "Boa noite",
          "Olá, meu nome é Miguel",
          "Bom dia",
          "Até logo"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Quantos anos",
          "Como vai",
          "Onde mora",
          "Meu nome é"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Miguel'",
        "opts": [
          "bad",
          "name",
          "good",
          "big"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Miguel'?",
        "opts": [
          "Ao se apresentar",
          "Ao dormir",
          "Ao comer",
          "Ao dirigir"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Hello",
          "Please",
          "Goodbye",
          "Thanks"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "Goodbye",
          "Thank you",
          "My name is Miguel",
          "I am fine"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Como vai?",
          "Onde mora?",
          "Quantos anos?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Miguel'?",
        "opts": [
          "Trabalho",
          "Casa",
          "Carro",
          "Miguel"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Miguel'",
        "opts": [
          "are",
          "am",
          "is",
          "be"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Miguel'",
        "opts": [
          "Miguel is my name",
          "My name is Miguel",
          "My Miguel is name",
          "Is my name Miguel"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Miguel'",
        "opts": [
          "Até logo",
          "Bom dia",
          "Boa noite",
          "Prazer em conhecer você, Miguel"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Miguel' significa:",
        "opts": [
          "Onde mora?",
          "Qual seu nome?",
          "Olá, meu nome é Miguel",
          "Meu nome não é"
        ],
        "ans": 2,
        "type": "translation"
      }
    ]
  },
  {
    "id": 114,
    "module": 2,
    "moduleName": "Vida Diária",
    "level": "A2",
    "title": "Comida favorita",
    "desc": "Aprenda comida favorita - tradução correta John=John",
    "time": "7 MIN",
    "phrase": "Hello, my name is John",
    "translation": "Olá, meu nome é John",
    "vocab": [
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Comida favorita</h4><p><b>Frase:</b> Hello, my name is John = Olá, meu nome é John</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is John'",
        "opts": [
          "Olá, meu nome é John",
          "Bom dia",
          "Até logo",
          "Boa noite"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Meu nome é",
          "Como vai",
          "Onde mora",
          "Quantos anos"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is John'",
        "opts": [
          "name",
          "bad",
          "big",
          "good"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is John'?",
        "opts": [
          "Ao dirigir",
          "Ao se apresentar",
          "Ao dormir",
          "Ao comer"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Hello",
          "Please",
          "Thanks",
          "Goodbye"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "I am fine",
          "Goodbye",
          "Thank you",
          "My name is John"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Quantos anos?",
          "Como vai?",
          "Qual é seu nome?",
          "Onde mora?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is John'?",
        "opts": [
          "Trabalho",
          "Casa",
          "John",
          "Carro"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ John'",
        "opts": [
          "be",
          "am",
          "are",
          "is"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / John'",
        "opts": [
          "John is my name",
          "My name is John",
          "My John is name",
          "Is my name John"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, John'",
        "opts": [
          "Prazer em conhecer você, John",
          "Até logo",
          "Boa noite",
          "Bom dia"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is John' significa:",
        "opts": [
          "Olá, meu nome é John",
          "Qual seu nome?",
          "Onde mora?",
          "Meu nome não é"
        ],
        "ans": 0,
        "type": "translation"
      }
    ]
  },
  {
    "id": 115,
    "module": 2,
    "moduleName": "Vida Diária",
    "level": "A2",
    "title": "Cores favoritas",
    "desc": "Aprenda cores favoritas - tradução correta Lucas=Lucas",
    "time": "8 MIN",
    "phrase": "Hello, my name is Lucas",
    "translation": "Olá, meu nome é Lucas",
    "vocab": [
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Cores favoritas</h4><p><b>Frase:</b> Hello, my name is Lucas = Olá, meu nome é Lucas</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Lucas'",
        "opts": [
          "Até logo",
          "Bom dia",
          "Boa noite",
          "Olá, meu nome é Lucas"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Como vai",
          "Quantos anos",
          "Onde mora",
          "Meu nome é"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Lucas'",
        "opts": [
          "bad",
          "good",
          "big",
          "name"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Lucas'?",
        "opts": [
          "Ao se apresentar",
          "Ao comer",
          "Ao dirigir",
          "Ao dormir"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Hello",
          "Please",
          "Thanks",
          "Goodbye"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "My name is Lucas",
          "Thank you",
          "I am fine",
          "Goodbye"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Quantos anos?",
          "Onde mora?",
          "Qual é seu nome?",
          "Como vai?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Lucas'?",
        "opts": [
          "Carro",
          "Trabalho",
          "Casa",
          "Lucas"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Lucas'",
        "opts": [
          "am",
          "is",
          "are",
          "be"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Lucas'",
        "opts": [
          "Is my name Lucas",
          "My Lucas is name",
          "Lucas is my name",
          "My name is Lucas"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Lucas'",
        "opts": [
          "Prazer em conhecer você, Lucas",
          "Bom dia",
          "Boa noite",
          "Até logo"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Lucas' significa:",
        "opts": [
          "Onde mora?",
          "Qual seu nome?",
          "Meu nome não é",
          "Olá, meu nome é Lucas"
        ],
        "ans": 3,
        "type": "translation"
      }
    ]
  },
  {
    "id": 116,
    "module": 2,
    "moduleName": "Vida Diária",
    "level": "A2",
    "title": "Tempo e clima",
    "desc": "Aprenda tempo e clima - tradução correta Ana=Ana",
    "time": "9 MIN",
    "phrase": "Hello, my name is Ana",
    "translation": "Olá, meu nome é Ana",
    "vocab": [
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Tempo e clima</h4><p><b>Frase:</b> Hello, my name is Ana = Olá, meu nome é Ana</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Ana'",
        "opts": [
          "Bom dia",
          "Boa noite",
          "Até logo",
          "Olá, meu nome é Ana"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Quantos anos",
          "Onde mora",
          "Meu nome é",
          "Como vai"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Ana'",
        "opts": [
          "bad",
          "big",
          "good",
          "name"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Ana'?",
        "opts": [
          "Ao comer",
          "Ao se apresentar",
          "Ao dormir",
          "Ao dirigir"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Goodbye",
          "Please",
          "Hello",
          "Thanks"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "Goodbye",
          "My name is Ana",
          "Thank you",
          "I am fine"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Onde mora?",
          "Qual é seu nome?",
          "Quantos anos?",
          "Como vai?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Ana'?",
        "opts": [
          "Ana",
          "Trabalho",
          "Casa",
          "Carro"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Ana'",
        "opts": [
          "are",
          "is",
          "am",
          "be"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Ana'",
        "opts": [
          "Ana is my name",
          "My Ana is name",
          "Is my name Ana",
          "My name is Ana"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Ana'",
        "opts": [
          "Até logo",
          "Boa noite",
          "Prazer em conhecer você, Ana",
          "Bom dia"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Ana' significa:",
        "opts": [
          "Olá, meu nome é Ana",
          "Onde mora?",
          "Qual seu nome?",
          "Meu nome não é"
        ],
        "ans": 0,
        "type": "translation"
      }
    ]
  },
  {
    "id": 117,
    "module": 2,
    "moduleName": "Vida Diária",
    "level": "A2",
    "title": "Dias da semana",
    "desc": "Aprenda dias da semana - tradução correta John=John",
    "time": "10 MIN",
    "phrase": "Hello, my name is John",
    "translation": "Olá, meu nome é John",
    "vocab": [
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Dias da semana</h4><p><b>Frase:</b> Hello, my name is John = Olá, meu nome é John</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is John'",
        "opts": [
          "Olá, meu nome é John",
          "Boa noite",
          "Até logo",
          "Bom dia"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Quantos anos",
          "Meu nome é",
          "Como vai",
          "Onde mora"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is John'",
        "opts": [
          "big",
          "bad",
          "good",
          "name"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is John'?",
        "opts": [
          "Ao se apresentar",
          "Ao comer",
          "Ao dormir",
          "Ao dirigir"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Hello",
          "Goodbye",
          "Please",
          "Thanks"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "Goodbye",
          "My name is John",
          "Thank you",
          "I am fine"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Onde mora?",
          "Qual é seu nome?",
          "Como vai?",
          "Quantos anos?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is John'?",
        "opts": [
          "Carro",
          "Trabalho",
          "Casa",
          "John"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ John'",
        "opts": [
          "are",
          "is",
          "be",
          "am"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / John'",
        "opts": [
          "John is my name",
          "My John is name",
          "Is my name John",
          "My name is John"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, John'",
        "opts": [
          "Prazer em conhecer você, John",
          "Boa noite",
          "Bom dia",
          "Até logo"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is John' significa:",
        "opts": [
          "Qual seu nome?",
          "Olá, meu nome é John",
          "Meu nome não é",
          "Onde mora?"
        ],
        "ans": 1,
        "type": "translation"
      }
    ]
  },
  {
    "id": 118,
    "module": 2,
    "moduleName": "Vida Diária",
    "level": "A2",
    "title": "Horas e compromissos",
    "desc": "Aprenda horas e compromissos - tradução correta Maria=Maria",
    "time": "11 MIN",
    "phrase": "Hello, my name is Maria",
    "translation": "Olá, meu nome é Maria",
    "vocab": [
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Horas e compromissos</h4><p><b>Frase:</b> Hello, my name is Maria = Olá, meu nome é Maria</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Maria'",
        "opts": [
          "Bom dia",
          "Até logo",
          "Olá, meu nome é Maria",
          "Boa noite"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Quantos anos",
          "Onde mora",
          "Como vai",
          "Meu nome é"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Maria'",
        "opts": [
          "name",
          "big",
          "good",
          "bad"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Maria'?",
        "opts": [
          "Ao dirigir",
          "Ao dormir",
          "Ao comer",
          "Ao se apresentar"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Thanks",
          "Please",
          "Goodbye",
          "Hello"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "My name is Maria",
          "Thank you",
          "Goodbye",
          "I am fine"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Quantos anos?",
          "Onde mora?",
          "Como vai?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Maria'?",
        "opts": [
          "Carro",
          "Trabalho",
          "Maria",
          "Casa"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Maria'",
        "opts": [
          "am",
          "are",
          "is",
          "be"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Maria'",
        "opts": [
          "My Maria is name",
          "Maria is my name",
          "Is my name Maria",
          "My name is Maria"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Maria'",
        "opts": [
          "Bom dia",
          "Até logo",
          "Boa noite",
          "Prazer em conhecer você, Maria"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Maria' significa:",
        "opts": [
          "Onde mora?",
          "Qual seu nome?",
          "Olá, meu nome é Maria",
          "Meu nome não é"
        ],
        "ans": 2,
        "type": "translation"
      }
    ]
  },
  {
    "id": 119,
    "module": 2,
    "moduleName": "Vida Diária",
    "level": "A2",
    "title": "Família estendida",
    "desc": "Aprenda família estendida - tradução correta Pedro=Pedro",
    "time": "12 MIN",
    "phrase": "Hello, my name is Pedro",
    "translation": "Olá, meu nome é Pedro",
    "vocab": [
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Família estendida</h4><p><b>Frase:</b> Hello, my name is Pedro = Olá, meu nome é Pedro</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Pedro'",
        "opts": [
          "Até logo",
          "Olá, meu nome é Pedro",
          "Bom dia",
          "Boa noite"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Meu nome é",
          "Quantos anos",
          "Como vai",
          "Onde mora"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Pedro'",
        "opts": [
          "bad",
          "big",
          "good",
          "name"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Pedro'?",
        "opts": [
          "Ao dormir",
          "Ao dirigir",
          "Ao comer",
          "Ao se apresentar"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Thanks",
          "Goodbye",
          "Please",
          "Hello"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "Thank you",
          "Goodbye",
          "My name is Pedro",
          "I am fine"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Quantos anos?",
          "Qual é seu nome?",
          "Como vai?",
          "Onde mora?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Pedro'?",
        "opts": [
          "Carro",
          "Casa",
          "Trabalho",
          "Pedro"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Pedro'",
        "opts": [
          "are",
          "be",
          "is",
          "am"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Pedro'",
        "opts": [
          "Pedro is my name",
          "My name is Pedro",
          "My Pedro is name",
          "Is my name Pedro"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Pedro'",
        "opts": [
          "Prazer em conhecer você, Pedro",
          "Até logo",
          "Bom dia",
          "Boa noite"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Pedro' significa:",
        "opts": [
          "Qual seu nome?",
          "Meu nome não é",
          "Onde mora?",
          "Olá, meu nome é Pedro"
        ],
        "ans": 3,
        "type": "translation"
      }
    ]
  },
  {
    "id": 120,
    "module": 2,
    "moduleName": "Vida Diária",
    "level": "A2",
    "title": "Casa e moradia",
    "desc": "Aprenda casa e moradia - tradução correta Miguel=Miguel",
    "time": "13 MIN",
    "phrase": "Hello, my name is Miguel",
    "translation": "Olá, meu nome é Miguel",
    "vocab": [
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Casa e moradia</h4><p><b>Frase:</b> Hello, my name is Miguel = Olá, meu nome é Miguel</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Miguel'",
        "opts": [
          "Boa noite",
          "Olá, meu nome é Miguel",
          "Bom dia",
          "Até logo"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Quantos anos",
          "Onde mora",
          "Como vai",
          "Meu nome é"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Miguel'",
        "opts": [
          "bad",
          "big",
          "good",
          "name"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Miguel'?",
        "opts": [
          "Ao se apresentar",
          "Ao comer",
          "Ao dirigir",
          "Ao dormir"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Goodbye",
          "Please",
          "Hello",
          "Thanks"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "I am fine",
          "My name is Miguel",
          "Goodbye",
          "Thank you"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Qual é seu nome?",
          "Onde mora?",
          "Como vai?",
          "Quantos anos?"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Miguel'?",
        "opts": [
          "Carro",
          "Casa",
          "Miguel",
          "Trabalho"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Miguel'",
        "opts": [
          "is",
          "are",
          "be",
          "am"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Miguel'",
        "opts": [
          "Is my name Miguel",
          "My name is Miguel",
          "Miguel is my name",
          "My Miguel is name"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Miguel'",
        "opts": [
          "Prazer em conhecer você, Miguel",
          "Bom dia",
          "Boa noite",
          "Até logo"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Miguel' significa:",
        "opts": [
          "Meu nome não é",
          "Olá, meu nome é Miguel",
          "Onde mora?",
          "Qual seu nome?"
        ],
        "ans": 1,
        "type": "translation"
      }
    ]
  },
  {
    "id": 121,
    "module": 2,
    "moduleName": "Vida Diária",
    "level": "A2",
    "title": "Rotina matinal",
    "desc": "Aprenda rotina matinal - tradução correta David=David",
    "time": "6 MIN",
    "phrase": "Hello, my name is David",
    "translation": "Olá, meu nome é David",
    "vocab": [
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Rotina matinal</h4><p><b>Frase:</b> Hello, my name is David = Olá, meu nome é David</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is David'",
        "opts": [
          "Até logo",
          "Bom dia",
          "Olá, meu nome é David",
          "Boa noite"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Onde mora",
          "Meu nome é",
          "Como vai",
          "Quantos anos"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is David'",
        "opts": [
          "good",
          "bad",
          "name",
          "big"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is David'?",
        "opts": [
          "Ao dormir",
          "Ao se apresentar",
          "Ao dirigir",
          "Ao comer"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Goodbye",
          "Thanks",
          "Hello",
          "Please"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "My name is David",
          "Goodbye",
          "Thank you",
          "I am fine"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Onde mora?",
          "Qual é seu nome?",
          "Quantos anos?",
          "Como vai?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is David'?",
        "opts": [
          "David",
          "Carro",
          "Trabalho",
          "Casa"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ David'",
        "opts": [
          "are",
          "is",
          "am",
          "be"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / David'",
        "opts": [
          "My David is name",
          "My name is David",
          "Is my name David",
          "David is my name"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, David'",
        "opts": [
          "Bom dia",
          "Boa noite",
          "Prazer em conhecer você, David",
          "Até logo"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is David' significa:",
        "opts": [
          "Meu nome não é",
          "Qual seu nome?",
          "Olá, meu nome é David",
          "Onde mora?"
        ],
        "ans": 2,
        "type": "translation"
      }
    ]
  },
  {
    "id": 122,
    "module": 2,
    "moduleName": "Vida Diária",
    "level": "A2",
    "title": "Rotina noturna",
    "desc": "Aprenda rotina noturna - tradução correta Sofia=Sofia",
    "time": "7 MIN",
    "phrase": "Hello, my name is Sofia",
    "translation": "Olá, meu nome é Sofia",
    "vocab": [
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Rotina noturna</h4><p><b>Frase:</b> Hello, my name is Sofia = Olá, meu nome é Sofia</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Sofia'",
        "opts": [
          "Olá, meu nome é Sofia",
          "Boa noite",
          "Bom dia",
          "Até logo"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Onde mora",
          "Quantos anos",
          "Meu nome é",
          "Como vai"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Sofia'",
        "opts": [
          "bad",
          "big",
          "name",
          "good"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Sofia'?",
        "opts": [
          "Ao dirigir",
          "Ao se apresentar",
          "Ao comer",
          "Ao dormir"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Please",
          "Hello",
          "Goodbye",
          "Thanks"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "I am fine",
          "My name is Sofia",
          "Thank you",
          "Goodbye"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Como vai?",
          "Qual é seu nome?",
          "Quantos anos?",
          "Onde mora?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Sofia'?",
        "opts": [
          "Sofia",
          "Carro",
          "Trabalho",
          "Casa"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Sofia'",
        "opts": [
          "am",
          "is",
          "are",
          "be"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Sofia'",
        "opts": [
          "Is my name Sofia",
          "My name is Sofia",
          "Sofia is my name",
          "My Sofia is name"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Sofia'",
        "opts": [
          "Boa noite",
          "Até logo",
          "Prazer em conhecer você, Sofia",
          "Bom dia"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Sofia' significa:",
        "opts": [
          "Olá, meu nome é Sofia",
          "Onde mora?",
          "Qual seu nome?",
          "Meu nome não é"
        ],
        "ans": 0,
        "type": "translation"
      }
    ]
  },
  {
    "id": 123,
    "module": 2,
    "moduleName": "Vida Diária",
    "level": "A2",
    "title": "Fim de semana",
    "desc": "Aprenda fim de semana - tradução correta Carlos=Carlos",
    "time": "8 MIN",
    "phrase": "Hello, my name is Carlos",
    "translation": "Olá, meu nome é Carlos",
    "vocab": [
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Fim de semana</h4><p><b>Frase:</b> Hello, my name is Carlos = Olá, meu nome é Carlos</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Carlos'",
        "opts": [
          "Até logo",
          "Boa noite",
          "Bom dia",
          "Olá, meu nome é Carlos"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Como vai",
          "Meu nome é",
          "Quantos anos",
          "Onde mora"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Carlos'",
        "opts": [
          "big",
          "bad",
          "good",
          "name"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Carlos'?",
        "opts": [
          "Ao se apresentar",
          "Ao dirigir",
          "Ao dormir",
          "Ao comer"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Hello",
          "Goodbye",
          "Please",
          "Thanks"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "Goodbye",
          "My name is Carlos",
          "I am fine",
          "Thank you"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Quantos anos?",
          "Onde mora?",
          "Qual é seu nome?",
          "Como vai?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Carlos'?",
        "opts": [
          "Casa",
          "Trabalho",
          "Carlos",
          "Carro"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Carlos'",
        "opts": [
          "be",
          "are",
          "am",
          "is"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Carlos'",
        "opts": [
          "My name is Carlos",
          "Carlos is my name",
          "My Carlos is name",
          "Is my name Carlos"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Carlos'",
        "opts": [
          "Até logo",
          "Boa noite",
          "Bom dia",
          "Prazer em conhecer você, Carlos"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Carlos' significa:",
        "opts": [
          "Meu nome não é",
          "Qual seu nome?",
          "Olá, meu nome é Carlos",
          "Onde mora?"
        ],
        "ans": 2,
        "type": "translation"
      }
    ]
  },
  {
    "id": 124,
    "module": 2,
    "moduleName": "Vida Diária",
    "level": "A2",
    "title": "Compras básicas",
    "desc": "Aprenda compras básicas - tradução correta Sarah=Sarah",
    "time": "9 MIN",
    "phrase": "Hello, my name is Sarah",
    "translation": "Olá, meu nome é Sarah",
    "vocab": [
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Compras básicas</h4><p><b>Frase:</b> Hello, my name is Sarah = Olá, meu nome é Sarah</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Sarah'",
        "opts": [
          "Boa noite",
          "Bom dia",
          "Até logo",
          "Olá, meu nome é Sarah"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Quantos anos",
          "Onde mora",
          "Meu nome é",
          "Como vai"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Sarah'",
        "opts": [
          "big",
          "bad",
          "name",
          "good"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Sarah'?",
        "opts": [
          "Ao dirigir",
          "Ao dormir",
          "Ao comer",
          "Ao se apresentar"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Goodbye",
          "Hello",
          "Thanks",
          "Please"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "Goodbye",
          "I am fine",
          "Thank you",
          "My name is Sarah"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Qual é seu nome?",
          "Quantos anos?",
          "Onde mora?",
          "Como vai?"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Sarah'?",
        "opts": [
          "Carro",
          "Sarah",
          "Trabalho",
          "Casa"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Sarah'",
        "opts": [
          "is",
          "are",
          "be",
          "am"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Sarah'",
        "opts": [
          "My Sarah is name",
          "Sarah is my name",
          "Is my name Sarah",
          "My name is Sarah"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Sarah'",
        "opts": [
          "Boa noite",
          "Bom dia",
          "Até logo",
          "Prazer em conhecer você, Sarah"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Sarah' significa:",
        "opts": [
          "Onde mora?",
          "Meu nome não é",
          "Qual seu nome?",
          "Olá, meu nome é Sarah"
        ],
        "ans": 3,
        "type": "translation"
      }
    ]
  },
  {
    "id": 125,
    "module": 2,
    "moduleName": "Vida Diária",
    "level": "A2",
    "title": "Transporte",
    "desc": "Aprenda transporte - tradução correta David=David",
    "time": "10 MIN",
    "phrase": "Hello, my name is David",
    "translation": "Olá, meu nome é David",
    "vocab": [
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Transporte</h4><p><b>Frase:</b> Hello, my name is David = Olá, meu nome é David</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is David'",
        "opts": [
          "Boa noite",
          "Olá, meu nome é David",
          "Até logo",
          "Bom dia"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Meu nome é",
          "Onde mora",
          "Como vai",
          "Quantos anos"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is David'",
        "opts": [
          "name",
          "big",
          "good",
          "bad"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is David'?",
        "opts": [
          "Ao dirigir",
          "Ao dormir",
          "Ao se apresentar",
          "Ao comer"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Hello",
          "Please",
          "Goodbye",
          "Thanks"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "My name is David",
          "Thank you",
          "I am fine",
          "Goodbye"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Como vai?",
          "Qual é seu nome?",
          "Quantos anos?",
          "Onde mora?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is David'?",
        "opts": [
          "Trabalho",
          "Carro",
          "Casa",
          "David"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ David'",
        "opts": [
          "is",
          "be",
          "am",
          "are"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / David'",
        "opts": [
          "My name is David",
          "Is my name David",
          "My David is name",
          "David is my name"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, David'",
        "opts": [
          "Boa noite",
          "Prazer em conhecer você, David",
          "Bom dia",
          "Até logo"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is David' significa:",
        "opts": [
          "Qual seu nome?",
          "Olá, meu nome é David",
          "Onde mora?",
          "Meu nome não é"
        ],
        "ans": 1,
        "type": "translation"
      }
    ]
  },
  {
    "id": 126,
    "module": 2,
    "moduleName": "Vida Diária",
    "level": "A2",
    "title": "Comida e restaurante",
    "desc": "Aprenda comida e restaurante - tradução correta John=John",
    "time": "11 MIN",
    "phrase": "Hello, my name is John",
    "translation": "Olá, meu nome é John",
    "vocab": [
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Comida e restaurante</h4><p><b>Frase:</b> Hello, my name is John = Olá, meu nome é John</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is John'",
        "opts": [
          "Até logo",
          "Bom dia",
          "Boa noite",
          "Olá, meu nome é John"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Quantos anos",
          "Como vai",
          "Onde mora",
          "Meu nome é"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is John'",
        "opts": [
          "bad",
          "good",
          "name",
          "big"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is John'?",
        "opts": [
          "Ao dormir",
          "Ao comer",
          "Ao dirigir",
          "Ao se apresentar"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Thanks",
          "Goodbye",
          "Please",
          "Hello"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "My name is John",
          "I am fine",
          "Goodbye",
          "Thank you"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Quantos anos?",
          "Qual é seu nome?",
          "Onde mora?",
          "Como vai?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is John'?",
        "opts": [
          "Casa",
          "Carro",
          "Trabalho",
          "John"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ John'",
        "opts": [
          "be",
          "are",
          "is",
          "am"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / John'",
        "opts": [
          "John is my name",
          "My John is name",
          "Is my name John",
          "My name is John"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, John'",
        "opts": [
          "Bom dia",
          "Até logo",
          "Prazer em conhecer você, John",
          "Boa noite"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is John' significa:",
        "opts": [
          "Olá, meu nome é John",
          "Onde mora?",
          "Meu nome não é",
          "Qual seu nome?"
        ],
        "ans": 0,
        "type": "translation"
      }
    ]
  },
  {
    "id": 127,
    "module": 2,
    "moduleName": "Vida Diária",
    "level": "A2",
    "title": "Bebidas",
    "desc": "Aprenda bebidas - tradução correta Pedro=Pedro",
    "time": "12 MIN",
    "phrase": "Hello, my name is Pedro",
    "translation": "Olá, meu nome é Pedro",
    "vocab": [
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Bebidas</h4><p><b>Frase:</b> Hello, my name is Pedro = Olá, meu nome é Pedro</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Pedro'",
        "opts": [
          "Até logo",
          "Boa noite",
          "Bom dia",
          "Olá, meu nome é Pedro"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Onde mora",
          "Meu nome é",
          "Como vai",
          "Quantos anos"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Pedro'",
        "opts": [
          "good",
          "bad",
          "big",
          "name"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Pedro'?",
        "opts": [
          "Ao comer",
          "Ao dormir",
          "Ao dirigir",
          "Ao se apresentar"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Hello",
          "Please",
          "Goodbye",
          "Thanks"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "I am fine",
          "Thank you",
          "My name is Pedro",
          "Goodbye"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Quantos anos?",
          "Como vai?",
          "Onde mora?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Pedro'?",
        "opts": [
          "Carro",
          "Pedro",
          "Trabalho",
          "Casa"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Pedro'",
        "opts": [
          "am",
          "are",
          "be",
          "is"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Pedro'",
        "opts": [
          "Pedro is my name",
          "Is my name Pedro",
          "My name is Pedro",
          "My Pedro is name"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Pedro'",
        "opts": [
          "Até logo",
          "Boa noite",
          "Prazer em conhecer você, Pedro",
          "Bom dia"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Pedro' significa:",
        "opts": [
          "Qual seu nome?",
          "Olá, meu nome é Pedro",
          "Meu nome não é",
          "Onde mora?"
        ],
        "ans": 1,
        "type": "translation"
      }
    ]
  },
  {
    "id": 128,
    "module": 2,
    "moduleName": "Vida Diária",
    "level": "A2",
    "title": "Pedindo ajuda",
    "desc": "Aprenda pedindo ajuda - tradução correta Miguel=Miguel",
    "time": "13 MIN",
    "phrase": "Hello, my name is Miguel",
    "translation": "Olá, meu nome é Miguel",
    "vocab": [
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Pedindo ajuda</h4><p><b>Frase:</b> Hello, my name is Miguel = Olá, meu nome é Miguel</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Miguel'",
        "opts": [
          "Olá, meu nome é Miguel",
          "Boa noite",
          "Bom dia",
          "Até logo"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Meu nome é",
          "Onde mora",
          "Quantos anos",
          "Como vai"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Miguel'",
        "opts": [
          "good",
          "big",
          "bad",
          "name"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Miguel'?",
        "opts": [
          "Ao se apresentar",
          "Ao dormir",
          "Ao comer",
          "Ao dirigir"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Goodbye",
          "Thanks",
          "Hello",
          "Please"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "Thank you",
          "My name is Miguel",
          "Goodbye",
          "I am fine"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Qual é seu nome?",
          "Quantos anos?",
          "Onde mora?",
          "Como vai?"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Miguel'?",
        "opts": [
          "Carro",
          "Miguel",
          "Casa",
          "Trabalho"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Miguel'",
        "opts": [
          "is",
          "be",
          "am",
          "are"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Miguel'",
        "opts": [
          "My Miguel is name",
          "My name is Miguel",
          "Is my name Miguel",
          "Miguel is my name"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Miguel'",
        "opts": [
          "Boa noite",
          "Prazer em conhecer você, Miguel",
          "Até logo",
          "Bom dia"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Miguel' significa:",
        "opts": [
          "Meu nome não é",
          "Qual seu nome?",
          "Olá, meu nome é Miguel",
          "Onde mora?"
        ],
        "ans": 2,
        "type": "translation"
      }
    ]
  },
  {
    "id": 129,
    "module": 2,
    "moduleName": "Vida Diária",
    "level": "A2",
    "title": "Direções simples",
    "desc": "Aprenda direções simples - tradução correta John=John",
    "time": "6 MIN",
    "phrase": "Hello, my name is John",
    "translation": "Olá, meu nome é John",
    "vocab": [
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Direções simples</h4><p><b>Frase:</b> Hello, my name is John = Olá, meu nome é John</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is John'",
        "opts": [
          "Até logo",
          "Bom dia",
          "Boa noite",
          "Olá, meu nome é John"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Como vai",
          "Onde mora",
          "Meu nome é",
          "Quantos anos"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is John'",
        "opts": [
          "big",
          "bad",
          "name",
          "good"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is John'?",
        "opts": [
          "Ao dirigir",
          "Ao comer",
          "Ao se apresentar",
          "Ao dormir"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Please",
          "Goodbye",
          "Hello",
          "Thanks"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "Goodbye",
          "I am fine",
          "Thank you",
          "My name is John"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Como vai?",
          "Qual é seu nome?",
          "Onde mora?",
          "Quantos anos?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is John'?",
        "opts": [
          "John",
          "Trabalho",
          "Casa",
          "Carro"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ John'",
        "opts": [
          "is",
          "am",
          "are",
          "be"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / John'",
        "opts": [
          "Is my name John",
          "John is my name",
          "My name is John",
          "My John is name"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, John'",
        "opts": [
          "Bom dia",
          "Boa noite",
          "Até logo",
          "Prazer em conhecer você, John"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is John' significa:",
        "opts": [
          "Onde mora?",
          "Olá, meu nome é John",
          "Qual seu nome?",
          "Meu nome não é"
        ],
        "ans": 1,
        "type": "translation"
      }
    ]
  },
  {
    "id": 130,
    "module": 2,
    "moduleName": "Vida Diária",
    "level": "A2",
    "title": "Preços e dinheiro",
    "desc": "Aprenda preços e dinheiro - tradução correta John=John",
    "time": "7 MIN",
    "phrase": "Hello, my name is John",
    "translation": "Olá, meu nome é John",
    "vocab": [
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Preços e dinheiro</h4><p><b>Frase:</b> Hello, my name is John = Olá, meu nome é John</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is John'",
        "opts": [
          "Até logo",
          "Olá, meu nome é John",
          "Boa noite",
          "Bom dia"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Como vai",
          "Quantos anos",
          "Onde mora",
          "Meu nome é"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is John'",
        "opts": [
          "name",
          "good",
          "big",
          "bad"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is John'?",
        "opts": [
          "Ao dirigir",
          "Ao dormir",
          "Ao comer",
          "Ao se apresentar"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Hello",
          "Goodbye",
          "Thanks",
          "Please"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "Thank you",
          "My name is John",
          "I am fine",
          "Goodbye"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Qual é seu nome?",
          "Como vai?",
          "Quantos anos?",
          "Onde mora?"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is John'?",
        "opts": [
          "John",
          "Carro",
          "Casa",
          "Trabalho"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ John'",
        "opts": [
          "am",
          "are",
          "is",
          "be"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / John'",
        "opts": [
          "John is my name",
          "Is my name John",
          "My John is name",
          "My name is John"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, John'",
        "opts": [
          "Bom dia",
          "Prazer em conhecer você, John",
          "Até logo",
          "Boa noite"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is John' significa:",
        "opts": [
          "Qual seu nome?",
          "Olá, meu nome é John",
          "Onde mora?",
          "Meu nome não é"
        ],
        "ans": 1,
        "type": "translation"
      }
    ]
  },
  {
    "id": 131,
    "module": 3,
    "moduleName": "Comunicação",
    "level": "B1",
    "title": "Roupas",
    "desc": "Aprenda roupas - tradução correta Emma=Emma",
    "time": "8 MIN",
    "phrase": "Hello, my name is Emma",
    "translation": "Olá, meu nome é Emma",
    "vocab": [
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Roupas</h4><p><b>Frase:</b> Hello, my name is Emma = Olá, meu nome é Emma</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Emma'",
        "opts": [
          "Boa noite",
          "Bom dia",
          "Olá, meu nome é Emma",
          "Até logo"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Onde mora",
          "Meu nome é",
          "Quantos anos",
          "Como vai"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Emma'",
        "opts": [
          "name",
          "good",
          "big",
          "bad"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Emma'?",
        "opts": [
          "Ao se apresentar",
          "Ao comer",
          "Ao dirigir",
          "Ao dormir"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Thanks",
          "Hello",
          "Please",
          "Goodbye"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "Thank you",
          "My name is Emma",
          "I am fine",
          "Goodbye"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Quantos anos?",
          "Qual é seu nome?",
          "Como vai?",
          "Onde mora?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Emma'?",
        "opts": [
          "Carro",
          "Trabalho",
          "Casa",
          "Emma"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Emma'",
        "opts": [
          "are",
          "be",
          "am",
          "is"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Emma'",
        "opts": [
          "My name is Emma",
          "Is my name Emma",
          "Emma is my name",
          "My Emma is name"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Emma'",
        "opts": [
          "Boa noite",
          "Bom dia",
          "Até logo",
          "Prazer em conhecer você, Emma"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Emma' significa:",
        "opts": [
          "Olá, meu nome é Emma",
          "Qual seu nome?",
          "Meu nome não é",
          "Onde mora?"
        ],
        "ans": 0,
        "type": "translation"
      }
    ]
  },
  {
    "id": 132,
    "module": 3,
    "moduleName": "Comunicação",
    "level": "B1",
    "title": "Saúde básica",
    "desc": "Aprenda saúde básica - tradução correta Julia=Julia",
    "time": "9 MIN",
    "phrase": "Hello, my name is Julia",
    "translation": "Olá, meu nome é Julia",
    "vocab": [
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Saúde básica</h4><p><b>Frase:</b> Hello, my name is Julia = Olá, meu nome é Julia</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Julia'",
        "opts": [
          "Bom dia",
          "Olá, meu nome é Julia",
          "Boa noite",
          "Até logo"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Como vai",
          "Meu nome é",
          "Onde mora",
          "Quantos anos"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Julia'",
        "opts": [
          "good",
          "bad",
          "name",
          "big"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Julia'?",
        "opts": [
          "Ao se apresentar",
          "Ao dirigir",
          "Ao comer",
          "Ao dormir"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Goodbye",
          "Thanks",
          "Hello",
          "Please"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "My name is Julia",
          "Thank you",
          "I am fine",
          "Goodbye"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Quantos anos?",
          "Qual é seu nome?",
          "Onde mora?",
          "Como vai?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Julia'?",
        "opts": [
          "Carro",
          "Trabalho",
          "Julia",
          "Casa"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Julia'",
        "opts": [
          "are",
          "am",
          "is",
          "be"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Julia'",
        "opts": [
          "My Julia is name",
          "Julia is my name",
          "Is my name Julia",
          "My name is Julia"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Julia'",
        "opts": [
          "Prazer em conhecer você, Julia",
          "Bom dia",
          "Boa noite",
          "Até logo"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Julia' significa:",
        "opts": [
          "Olá, meu nome é Julia",
          "Qual seu nome?",
          "Onde mora?",
          "Meu nome não é"
        ],
        "ans": 0,
        "type": "translation"
      }
    ]
  },
  {
    "id": 133,
    "module": 3,
    "moduleName": "Comunicação",
    "level": "B1",
    "title": "Emoções",
    "desc": "Aprenda emoções - tradução correta Miguel=Miguel",
    "time": "10 MIN",
    "phrase": "Hello, my name is Miguel",
    "translation": "Olá, meu nome é Miguel",
    "vocab": [
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Emoções</h4><p><b>Frase:</b> Hello, my name is Miguel = Olá, meu nome é Miguel</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Miguel'",
        "opts": [
          "Bom dia",
          "Até logo",
          "Olá, meu nome é Miguel",
          "Boa noite"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Quantos anos",
          "Como vai",
          "Meu nome é",
          "Onde mora"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Miguel'",
        "opts": [
          "bad",
          "big",
          "name",
          "good"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Miguel'?",
        "opts": [
          "Ao dormir",
          "Ao dirigir",
          "Ao comer",
          "Ao se apresentar"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Please",
          "Thanks",
          "Hello",
          "Goodbye"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "My name is Miguel",
          "I am fine",
          "Goodbye",
          "Thank you"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Onde mora?",
          "Quantos anos?",
          "Como vai?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Miguel'?",
        "opts": [
          "Trabalho",
          "Miguel",
          "Carro",
          "Casa"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Miguel'",
        "opts": [
          "is",
          "are",
          "am",
          "be"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Miguel'",
        "opts": [
          "My name is Miguel",
          "Is my name Miguel",
          "Miguel is my name",
          "My Miguel is name"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Miguel'",
        "opts": [
          "Boa noite",
          "Prazer em conhecer você, Miguel",
          "Até logo",
          "Bom dia"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Miguel' significa:",
        "opts": [
          "Olá, meu nome é Miguel",
          "Onde mora?",
          "Meu nome não é",
          "Qual seu nome?"
        ],
        "ans": 0,
        "type": "translation"
      }
    ]
  },
  {
    "id": 134,
    "module": 3,
    "moduleName": "Comunicação",
    "level": "B1",
    "title": "Convites",
    "desc": "Aprenda convites - tradução correta Julia=Julia",
    "time": "11 MIN",
    "phrase": "Hello, my name is Julia",
    "translation": "Olá, meu nome é Julia",
    "vocab": [
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Convites</h4><p><b>Frase:</b> Hello, my name is Julia = Olá, meu nome é Julia</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Julia'",
        "opts": [
          "Até logo",
          "Olá, meu nome é Julia",
          "Bom dia",
          "Boa noite"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Quantos anos",
          "Onde mora",
          "Como vai",
          "Meu nome é"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Julia'",
        "opts": [
          "big",
          "name",
          "bad",
          "good"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Julia'?",
        "opts": [
          "Ao se apresentar",
          "Ao comer",
          "Ao dirigir",
          "Ao dormir"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Please",
          "Hello",
          "Goodbye",
          "Thanks"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "I am fine",
          "Goodbye",
          "Thank you",
          "My name is Julia"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Quantos anos?",
          "Qual é seu nome?",
          "Onde mora?",
          "Como vai?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Julia'?",
        "opts": [
          "Julia",
          "Casa",
          "Trabalho",
          "Carro"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Julia'",
        "opts": [
          "be",
          "am",
          "is",
          "are"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Julia'",
        "opts": [
          "Is my name Julia",
          "My name is Julia",
          "Julia is my name",
          "My Julia is name"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Julia'",
        "opts": [
          "Bom dia",
          "Boa noite",
          "Prazer em conhecer você, Julia",
          "Até logo"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Julia' significa:",
        "opts": [
          "Onde mora?",
          "Olá, meu nome é Julia",
          "Qual seu nome?",
          "Meu nome não é"
        ],
        "ans": 1,
        "type": "translation"
      }
    ]
  },
  {
    "id": 135,
    "module": 3,
    "moduleName": "Comunicação",
    "level": "B1",
    "title": "Telefone",
    "desc": "Aprenda telefone - tradução correta Sofia=Sofia",
    "time": "12 MIN",
    "phrase": "Hello, my name is Sofia",
    "translation": "Olá, meu nome é Sofia",
    "vocab": [
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Telefone</h4><p><b>Frase:</b> Hello, my name is Sofia = Olá, meu nome é Sofia</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Sofia'",
        "opts": [
          "Boa noite",
          "Bom dia",
          "Até logo",
          "Olá, meu nome é Sofia"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Como vai",
          "Meu nome é",
          "Onde mora",
          "Quantos anos"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Sofia'",
        "opts": [
          "name",
          "good",
          "bad",
          "big"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Sofia'?",
        "opts": [
          "Ao dirigir",
          "Ao se apresentar",
          "Ao comer",
          "Ao dormir"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Thanks",
          "Please",
          "Goodbye",
          "Hello"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "Goodbye",
          "My name is Sofia",
          "Thank you",
          "I am fine"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Qual é seu nome?",
          "Onde mora?",
          "Quantos anos?",
          "Como vai?"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Sofia'?",
        "opts": [
          "Casa",
          "Carro",
          "Trabalho",
          "Sofia"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Sofia'",
        "opts": [
          "am",
          "are",
          "is",
          "be"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Sofia'",
        "opts": [
          "Is my name Sofia",
          "My Sofia is name",
          "My name is Sofia",
          "Sofia is my name"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Sofia'",
        "opts": [
          "Até logo",
          "Prazer em conhecer você, Sofia",
          "Bom dia",
          "Boa noite"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Sofia' significa:",
        "opts": [
          "Olá, meu nome é Sofia",
          "Qual seu nome?",
          "Onde mora?",
          "Meu nome não é"
        ],
        "ans": 0,
        "type": "translation"
      }
    ]
  },
  {
    "id": 136,
    "module": 3,
    "moduleName": "Comunicação",
    "level": "B1",
    "title": "Email e contato",
    "desc": "Aprenda email e contato - tradução correta Carlos=Carlos",
    "time": "13 MIN",
    "phrase": "Hello, my name is Carlos",
    "translation": "Olá, meu nome é Carlos",
    "vocab": [
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Email e contato</h4><p><b>Frase:</b> Hello, my name is Carlos = Olá, meu nome é Carlos</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Carlos'",
        "opts": [
          "Até logo",
          "Boa noite",
          "Olá, meu nome é Carlos",
          "Bom dia"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Onde mora",
          "Quantos anos",
          "Meu nome é",
          "Como vai"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Carlos'",
        "opts": [
          "big",
          "name",
          "good",
          "bad"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Carlos'?",
        "opts": [
          "Ao dirigir",
          "Ao se apresentar",
          "Ao comer",
          "Ao dormir"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Goodbye",
          "Please",
          "Hello",
          "Thanks"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "I am fine",
          "My name is Carlos",
          "Thank you",
          "Goodbye"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Onde mora?",
          "Como vai?",
          "Quantos anos?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Carlos'?",
        "opts": [
          "Trabalho",
          "Carlos",
          "Carro",
          "Casa"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Carlos'",
        "opts": [
          "are",
          "am",
          "be",
          "is"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Carlos'",
        "opts": [
          "My name is Carlos",
          "Carlos is my name",
          "Is my name Carlos",
          "My Carlos is name"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Carlos'",
        "opts": [
          "Até logo",
          "Prazer em conhecer você, Carlos",
          "Boa noite",
          "Bom dia"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Carlos' significa:",
        "opts": [
          "Qual seu nome?",
          "Onde mora?",
          "Meu nome não é",
          "Olá, meu nome é Carlos"
        ],
        "ans": 3,
        "type": "translation"
      }
    ]
  },
  {
    "id": 137,
    "module": 3,
    "moduleName": "Comunicação",
    "level": "B1",
    "title": "Planos futuros",
    "desc": "Aprenda planos futuros - tradução correta Julia=Julia",
    "time": "6 MIN",
    "phrase": "Hello, my name is Julia",
    "translation": "Olá, meu nome é Julia",
    "vocab": [
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Planos futuros</h4><p><b>Frase:</b> Hello, my name is Julia = Olá, meu nome é Julia</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Julia'",
        "opts": [
          "Boa noite",
          "Olá, meu nome é Julia",
          "Até logo",
          "Bom dia"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Quantos anos",
          "Como vai",
          "Meu nome é",
          "Onde mora"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Julia'",
        "opts": [
          "name",
          "bad",
          "good",
          "big"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Julia'?",
        "opts": [
          "Ao se apresentar",
          "Ao dirigir",
          "Ao comer",
          "Ao dormir"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Hello",
          "Thanks",
          "Goodbye",
          "Please"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "Goodbye",
          "My name is Julia",
          "I am fine",
          "Thank you"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Onde mora?",
          "Quantos anos?",
          "Como vai?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Julia'?",
        "opts": [
          "Casa",
          "Carro",
          "Julia",
          "Trabalho"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Julia'",
        "opts": [
          "am",
          "are",
          "be",
          "is"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Julia'",
        "opts": [
          "My Julia is name",
          "Is my name Julia",
          "Julia is my name",
          "My name is Julia"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Julia'",
        "opts": [
          "Bom dia",
          "Até logo",
          "Prazer em conhecer você, Julia",
          "Boa noite"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Julia' significa:",
        "opts": [
          "Meu nome não é",
          "Onde mora?",
          "Qual seu nome?",
          "Olá, meu nome é Julia"
        ],
        "ans": 3,
        "type": "translation"
      }
    ]
  },
  {
    "id": 138,
    "module": 3,
    "moduleName": "Comunicação",
    "level": "B1",
    "title": "Passado simples",
    "desc": "Aprenda passado simples - tradução correta John=John",
    "time": "7 MIN",
    "phrase": "Hello, my name is John",
    "translation": "Olá, meu nome é John",
    "vocab": [
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Passado simples</h4><p><b>Frase:</b> Hello, my name is John = Olá, meu nome é John</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is John'",
        "opts": [
          "Olá, meu nome é John",
          "Bom dia",
          "Até logo",
          "Boa noite"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Como vai",
          "Meu nome é",
          "Onde mora",
          "Quantos anos"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is John'",
        "opts": [
          "bad",
          "name",
          "big",
          "good"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is John'?",
        "opts": [
          "Ao dormir",
          "Ao comer",
          "Ao se apresentar",
          "Ao dirigir"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Goodbye",
          "Hello",
          "Thanks",
          "Please"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "My name is John",
          "Goodbye",
          "I am fine",
          "Thank you"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Como vai?",
          "Onde mora?",
          "Qual é seu nome?",
          "Quantos anos?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is John'?",
        "opts": [
          "John",
          "Casa",
          "Carro",
          "Trabalho"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ John'",
        "opts": [
          "is",
          "be",
          "are",
          "am"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / John'",
        "opts": [
          "Is my name John",
          "My John is name",
          "John is my name",
          "My name is John"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, John'",
        "opts": [
          "Prazer em conhecer você, John",
          "Boa noite",
          "Até logo",
          "Bom dia"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is John' significa:",
        "opts": [
          "Onde mora?",
          "Meu nome não é",
          "Olá, meu nome é John",
          "Qual seu nome?"
        ],
        "ans": 2,
        "type": "translation"
      }
    ]
  },
  {
    "id": 139,
    "module": 3,
    "moduleName": "Comunicação",
    "level": "B1",
    "title": "Experiências",
    "desc": "Aprenda experiências - tradução correta David=David",
    "time": "8 MIN",
    "phrase": "Hello, my name is David",
    "translation": "Olá, meu nome é David",
    "vocab": [
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Experiências</h4><p><b>Frase:</b> Hello, my name is David = Olá, meu nome é David</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is David'",
        "opts": [
          "Até logo",
          "Bom dia",
          "Boa noite",
          "Olá, meu nome é David"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Meu nome é",
          "Como vai",
          "Quantos anos",
          "Onde mora"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is David'",
        "opts": [
          "bad",
          "big",
          "good",
          "name"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is David'?",
        "opts": [
          "Ao comer",
          "Ao dormir",
          "Ao se apresentar",
          "Ao dirigir"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Goodbye",
          "Thanks",
          "Hello",
          "Please"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "My name is David",
          "Thank you",
          "Goodbye",
          "I am fine"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Qual é seu nome?",
          "Como vai?",
          "Quantos anos?",
          "Onde mora?"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is David'?",
        "opts": [
          "David",
          "Carro",
          "Casa",
          "Trabalho"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ David'",
        "opts": [
          "are",
          "is",
          "be",
          "am"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / David'",
        "opts": [
          "Is my name David",
          "My David is name",
          "My name is David",
          "David is my name"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, David'",
        "opts": [
          "Prazer em conhecer você, David",
          "Boa noite",
          "Bom dia",
          "Até logo"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is David' significa:",
        "opts": [
          "Olá, meu nome é David",
          "Meu nome não é",
          "Onde mora?",
          "Qual seu nome?"
        ],
        "ans": 0,
        "type": "translation"
      }
    ]
  },
  {
    "id": 140,
    "module": 3,
    "moduleName": "Comunicação",
    "level": "B1",
    "title": "Preferências",
    "desc": "Aprenda preferências - tradução correta David=David",
    "time": "9 MIN",
    "phrase": "Hello, my name is David",
    "translation": "Olá, meu nome é David",
    "vocab": [
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Preferências</h4><p><b>Frase:</b> Hello, my name is David = Olá, meu nome é David</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is David'",
        "opts": [
          "Olá, meu nome é David",
          "Boa noite",
          "Bom dia",
          "Até logo"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Quantos anos",
          "Meu nome é",
          "Como vai",
          "Onde mora"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is David'",
        "opts": [
          "bad",
          "name",
          "good",
          "big"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is David'?",
        "opts": [
          "Ao dormir",
          "Ao se apresentar",
          "Ao comer",
          "Ao dirigir"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Hello",
          "Goodbye",
          "Thanks",
          "Please"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "Thank you",
          "My name is David",
          "I am fine",
          "Goodbye"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Como vai?",
          "Onde mora?",
          "Quantos anos?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is David'?",
        "opts": [
          "Carro",
          "Trabalho",
          "David",
          "Casa"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ David'",
        "opts": [
          "be",
          "am",
          "are",
          "is"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / David'",
        "opts": [
          "Is my name David",
          "My David is name",
          "David is my name",
          "My name is David"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, David'",
        "opts": [
          "Prazer em conhecer você, David",
          "Boa noite",
          "Até logo",
          "Bom dia"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is David' significa:",
        "opts": [
          "Qual seu nome?",
          "Olá, meu nome é David",
          "Meu nome não é",
          "Onde mora?"
        ],
        "ans": 1,
        "type": "translation"
      }
    ]
  },
  {
    "id": 141,
    "module": 3,
    "moduleName": "Comunicação",
    "level": "B1",
    "title": "Opiniões simples",
    "desc": "Aprenda opiniões simples - tradução correta Miguel=Miguel",
    "time": "10 MIN",
    "phrase": "Hello, my name is Miguel",
    "translation": "Olá, meu nome é Miguel",
    "vocab": [
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Opiniões simples</h4><p><b>Frase:</b> Hello, my name is Miguel = Olá, meu nome é Miguel</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Miguel'",
        "opts": [
          "Olá, meu nome é Miguel",
          "Até logo",
          "Boa noite",
          "Bom dia"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Quantos anos",
          "Meu nome é",
          "Como vai",
          "Onde mora"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Miguel'",
        "opts": [
          "big",
          "bad",
          "name",
          "good"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Miguel'?",
        "opts": [
          "Ao comer",
          "Ao dormir",
          "Ao dirigir",
          "Ao se apresentar"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Hello",
          "Thanks",
          "Please",
          "Goodbye"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "I am fine",
          "Thank you",
          "My name is Miguel",
          "Goodbye"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Qual é seu nome?",
          "Quantos anos?",
          "Como vai?",
          "Onde mora?"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Miguel'?",
        "opts": [
          "Casa",
          "Miguel",
          "Carro",
          "Trabalho"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Miguel'",
        "opts": [
          "am",
          "be",
          "are",
          "is"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Miguel'",
        "opts": [
          "My Miguel is name",
          "Is my name Miguel",
          "Miguel is my name",
          "My name is Miguel"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Miguel'",
        "opts": [
          "Bom dia",
          "Até logo",
          "Boa noite",
          "Prazer em conhecer você, Miguel"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Miguel' significa:",
        "opts": [
          "Olá, meu nome é Miguel",
          "Qual seu nome?",
          "Meu nome não é",
          "Onde mora?"
        ],
        "ans": 0,
        "type": "translation"
      }
    ]
  },
  {
    "id": 142,
    "module": 3,
    "moduleName": "Comunicação",
    "level": "B1",
    "title": "Comparações",
    "desc": "Aprenda comparações - tradução correta Miguel=Miguel",
    "time": "11 MIN",
    "phrase": "Hello, my name is Miguel",
    "translation": "Olá, meu nome é Miguel",
    "vocab": [
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Comparações</h4><p><b>Frase:</b> Hello, my name is Miguel = Olá, meu nome é Miguel</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Miguel'",
        "opts": [
          "Até logo",
          "Bom dia",
          "Boa noite",
          "Olá, meu nome é Miguel"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Como vai",
          "Onde mora",
          "Meu nome é",
          "Quantos anos"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Miguel'",
        "opts": [
          "name",
          "big",
          "good",
          "bad"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Miguel'?",
        "opts": [
          "Ao comer",
          "Ao dormir",
          "Ao dirigir",
          "Ao se apresentar"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Hello",
          "Goodbye",
          "Please",
          "Thanks"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "Goodbye",
          "Thank you",
          "My name is Miguel",
          "I am fine"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Quantos anos?",
          "Onde mora?",
          "Como vai?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Miguel'?",
        "opts": [
          "Miguel",
          "Casa",
          "Carro",
          "Trabalho"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Miguel'",
        "opts": [
          "be",
          "are",
          "is",
          "am"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Miguel'",
        "opts": [
          "Miguel is my name",
          "My Miguel is name",
          "My name is Miguel",
          "Is my name Miguel"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Miguel'",
        "opts": [
          "Bom dia",
          "Prazer em conhecer você, Miguel",
          "Boa noite",
          "Até logo"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Miguel' significa:",
        "opts": [
          "Meu nome não é",
          "Olá, meu nome é Miguel",
          "Onde mora?",
          "Qual seu nome?"
        ],
        "ans": 1,
        "type": "translation"
      }
    ]
  },
  {
    "id": 143,
    "module": 3,
    "moduleName": "Comunicação",
    "level": "B1",
    "title": "Conselhos",
    "desc": "Aprenda conselhos - tradução correta Julia=Julia",
    "time": "12 MIN",
    "phrase": "Hello, my name is Julia",
    "translation": "Olá, meu nome é Julia",
    "vocab": [
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Conselhos</h4><p><b>Frase:</b> Hello, my name is Julia = Olá, meu nome é Julia</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Julia'",
        "opts": [
          "Até logo",
          "Olá, meu nome é Julia",
          "Bom dia",
          "Boa noite"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Quantos anos",
          "Como vai",
          "Onde mora",
          "Meu nome é"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Julia'",
        "opts": [
          "bad",
          "name",
          "good",
          "big"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Julia'?",
        "opts": [
          "Ao se apresentar",
          "Ao comer",
          "Ao dirigir",
          "Ao dormir"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Goodbye",
          "Thanks",
          "Hello",
          "Please"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "My name is Julia",
          "Thank you",
          "Goodbye",
          "I am fine"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Como vai?",
          "Qual é seu nome?",
          "Onde mora?",
          "Quantos anos?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Julia'?",
        "opts": [
          "Carro",
          "Casa",
          "Trabalho",
          "Julia"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Julia'",
        "opts": [
          "are",
          "am",
          "be",
          "is"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Julia'",
        "opts": [
          "My name is Julia",
          "Is my name Julia",
          "My Julia is name",
          "Julia is my name"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Julia'",
        "opts": [
          "Prazer em conhecer você, Julia",
          "Boa noite",
          "Até logo",
          "Bom dia"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Julia' significa:",
        "opts": [
          "Onde mora?",
          "Olá, meu nome é Julia",
          "Qual seu nome?",
          "Meu nome não é"
        ],
        "ans": 1,
        "type": "translation"
      }
    ]
  },
  {
    "id": 144,
    "module": 3,
    "moduleName": "Comunicação",
    "level": "B1",
    "title": "Convite para café",
    "desc": "Aprenda convite para café - tradução correta Sofia=Sofia",
    "time": "13 MIN",
    "phrase": "Hello, my name is Sofia",
    "translation": "Olá, meu nome é Sofia",
    "vocab": [
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Convite para café</h4><p><b>Frase:</b> Hello, my name is Sofia = Olá, meu nome é Sofia</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Sofia'",
        "opts": [
          "Boa noite",
          "Olá, meu nome é Sofia",
          "Até logo",
          "Bom dia"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Onde mora",
          "Quantos anos",
          "Como vai",
          "Meu nome é"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Sofia'",
        "opts": [
          "name",
          "good",
          "big",
          "bad"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Sofia'?",
        "opts": [
          "Ao comer",
          "Ao dirigir",
          "Ao se apresentar",
          "Ao dormir"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Goodbye",
          "Please",
          "Thanks",
          "Hello"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "Thank you",
          "My name is Sofia",
          "I am fine",
          "Goodbye"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Onde mora?",
          "Quantos anos?",
          "Como vai?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Sofia'?",
        "opts": [
          "Sofia",
          "Trabalho",
          "Carro",
          "Casa"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Sofia'",
        "opts": [
          "is",
          "am",
          "be",
          "are"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Sofia'",
        "opts": [
          "My name is Sofia",
          "Is my name Sofia",
          "My Sofia is name",
          "Sofia is my name"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Sofia'",
        "opts": [
          "Bom dia",
          "Até logo",
          "Boa noite",
          "Prazer em conhecer você, Sofia"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Sofia' significa:",
        "opts": [
          "Meu nome não é",
          "Onde mora?",
          "Qual seu nome?",
          "Olá, meu nome é Sofia"
        ],
        "ans": 3,
        "type": "translation"
      }
    ]
  },
  {
    "id": 145,
    "module": 3,
    "moduleName": "Comunicação",
    "level": "B1",
    "title": "Conhecendo vizinhos",
    "desc": "Aprenda conhecendo vizinhos - tradução correta Julia=Julia",
    "time": "6 MIN",
    "phrase": "Hello, my name is Julia",
    "translation": "Olá, meu nome é Julia",
    "vocab": [
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Conhecendo vizinhos</h4><p><b>Frase:</b> Hello, my name is Julia = Olá, meu nome é Julia</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Julia'",
        "opts": [
          "Boa noite",
          "Olá, meu nome é Julia",
          "Bom dia",
          "Até logo"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Quantos anos",
          "Onde mora",
          "Meu nome é",
          "Como vai"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Julia'",
        "opts": [
          "big",
          "bad",
          "good",
          "name"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Julia'?",
        "opts": [
          "Ao dirigir",
          "Ao comer",
          "Ao se apresentar",
          "Ao dormir"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Goodbye",
          "Please",
          "Hello",
          "Thanks"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "I am fine",
          "Thank you",
          "My name is Julia",
          "Goodbye"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Quantos anos?",
          "Como vai?",
          "Qual é seu nome?",
          "Onde mora?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Julia'?",
        "opts": [
          "Julia",
          "Carro",
          "Casa",
          "Trabalho"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Julia'",
        "opts": [
          "be",
          "is",
          "are",
          "am"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Julia'",
        "opts": [
          "My Julia is name",
          "My name is Julia",
          "Is my name Julia",
          "Julia is my name"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Julia'",
        "opts": [
          "Prazer em conhecer você, Julia",
          "Boa noite",
          "Bom dia",
          "Até logo"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Julia' significa:",
        "opts": [
          "Qual seu nome?",
          "Olá, meu nome é Julia",
          "Meu nome não é",
          "Onde mora?"
        ],
        "ans": 1,
        "type": "translation"
      }
    ]
  },
  {
    "id": 146,
    "module": 3,
    "moduleName": "Comunicação",
    "level": "B1",
    "title": "Festa e celebração",
    "desc": "Aprenda festa e celebração - tradução correta Emma=Emma",
    "time": "7 MIN",
    "phrase": "Hello, my name is Emma",
    "translation": "Olá, meu nome é Emma",
    "vocab": [
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Festa e celebração</h4><p><b>Frase:</b> Hello, my name is Emma = Olá, meu nome é Emma</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Emma'",
        "opts": [
          "Bom dia",
          "Olá, meu nome é Emma",
          "Até logo",
          "Boa noite"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Quantos anos",
          "Como vai",
          "Onde mora",
          "Meu nome é"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Emma'",
        "opts": [
          "bad",
          "big",
          "name",
          "good"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Emma'?",
        "opts": [
          "Ao dirigir",
          "Ao se apresentar",
          "Ao comer",
          "Ao dormir"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Thanks",
          "Goodbye",
          "Please",
          "Hello"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "Goodbye",
          "Thank you",
          "I am fine",
          "My name is Emma"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Como vai?",
          "Onde mora?",
          "Quantos anos?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Emma'?",
        "opts": [
          "Trabalho",
          "Emma",
          "Casa",
          "Carro"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Emma'",
        "opts": [
          "are",
          "am",
          "be",
          "is"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Emma'",
        "opts": [
          "My Emma is name",
          "My name is Emma",
          "Emma is my name",
          "Is my name Emma"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Emma'",
        "opts": [
          "Prazer em conhecer você, Emma",
          "Bom dia",
          "Boa noite",
          "Até logo"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Emma' significa:",
        "opts": [
          "Olá, meu nome é Emma",
          "Meu nome não é",
          "Qual seu nome?",
          "Onde mora?"
        ],
        "ans": 0,
        "type": "translation"
      }
    ]
  },
  {
    "id": 147,
    "module": 3,
    "moduleName": "Comunicação",
    "level": "B1",
    "title": "Filmes e música",
    "desc": "Aprenda filmes e música - tradução correta Ana=Ana",
    "time": "8 MIN",
    "phrase": "Hello, my name is Ana",
    "translation": "Olá, meu nome é Ana",
    "vocab": [
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Filmes e música</h4><p><b>Frase:</b> Hello, my name is Ana = Olá, meu nome é Ana</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Ana'",
        "opts": [
          "Olá, meu nome é Ana",
          "Bom dia",
          "Até logo",
          "Boa noite"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Quantos anos",
          "Como vai",
          "Meu nome é",
          "Onde mora"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Ana'",
        "opts": [
          "big",
          "good",
          "bad",
          "name"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Ana'?",
        "opts": [
          "Ao comer",
          "Ao dirigir",
          "Ao dormir",
          "Ao se apresentar"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Please",
          "Goodbye",
          "Thanks",
          "Hello"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "Goodbye",
          "I am fine",
          "My name is Ana",
          "Thank you"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Quantos anos?",
          "Qual é seu nome?",
          "Onde mora?",
          "Como vai?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Ana'?",
        "opts": [
          "Trabalho",
          "Carro",
          "Ana",
          "Casa"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Ana'",
        "opts": [
          "are",
          "is",
          "am",
          "be"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Ana'",
        "opts": [
          "Is my name Ana",
          "Ana is my name",
          "My name is Ana",
          "My Ana is name"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Ana'",
        "opts": [
          "Boa noite",
          "Bom dia",
          "Até logo",
          "Prazer em conhecer você, Ana"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Ana' significa:",
        "opts": [
          "Onde mora?",
          "Olá, meu nome é Ana",
          "Qual seu nome?",
          "Meu nome não é"
        ],
        "ans": 1,
        "type": "translation"
      }
    ]
  },
  {
    "id": 148,
    "module": 3,
    "moduleName": "Comunicação",
    "level": "B1",
    "title": "Esportes",
    "desc": "Aprenda esportes - tradução correta David=David",
    "time": "9 MIN",
    "phrase": "Hello, my name is David",
    "translation": "Olá, meu nome é David",
    "vocab": [
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Esportes</h4><p><b>Frase:</b> Hello, my name is David = Olá, meu nome é David</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is David'",
        "opts": [
          "Boa noite",
          "Até logo",
          "Olá, meu nome é David",
          "Bom dia"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Como vai",
          "Quantos anos",
          "Meu nome é",
          "Onde mora"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is David'",
        "opts": [
          "bad",
          "big",
          "name",
          "good"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is David'?",
        "opts": [
          "Ao comer",
          "Ao se apresentar",
          "Ao dormir",
          "Ao dirigir"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Hello",
          "Please",
          "Thanks",
          "Goodbye"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "Goodbye",
          "My name is David",
          "Thank you",
          "I am fine"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Qual é seu nome?",
          "Como vai?",
          "Onde mora?",
          "Quantos anos?"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is David'?",
        "opts": [
          "Trabalho",
          "David",
          "Casa",
          "Carro"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ David'",
        "opts": [
          "are",
          "is",
          "am",
          "be"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / David'",
        "opts": [
          "My David is name",
          "My name is David",
          "Is my name David",
          "David is my name"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, David'",
        "opts": [
          "Até logo",
          "Prazer em conhecer você, David",
          "Boa noite",
          "Bom dia"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is David' significa:",
        "opts": [
          "Qual seu nome?",
          "Onde mora?",
          "Meu nome não é",
          "Olá, meu nome é David"
        ],
        "ans": 3,
        "type": "translation"
      }
    ]
  },
  {
    "id": 149,
    "module": 3,
    "moduleName": "Comunicação",
    "level": "B1",
    "title": "Viagem curta",
    "desc": "Aprenda viagem curta - tradução correta John=John",
    "time": "10 MIN",
    "phrase": "Hello, my name is John",
    "translation": "Olá, meu nome é John",
    "vocab": [
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Viagem curta</h4><p><b>Frase:</b> Hello, my name is John = Olá, meu nome é John</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is John'",
        "opts": [
          "Até logo",
          "Boa noite",
          "Bom dia",
          "Olá, meu nome é John"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Quantos anos",
          "Como vai",
          "Onde mora",
          "Meu nome é"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is John'",
        "opts": [
          "name",
          "good",
          "big",
          "bad"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is John'?",
        "opts": [
          "Ao dirigir",
          "Ao se apresentar",
          "Ao comer",
          "Ao dormir"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Thanks",
          "Goodbye",
          "Hello",
          "Please"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "I am fine",
          "My name is John",
          "Goodbye",
          "Thank you"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Quantos anos?",
          "Como vai?",
          "Onde mora?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is John'?",
        "opts": [
          "Casa",
          "John",
          "Carro",
          "Trabalho"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ John'",
        "opts": [
          "is",
          "are",
          "be",
          "am"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / John'",
        "opts": [
          "My name is John",
          "My John is name",
          "Is my name John",
          "John is my name"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, John'",
        "opts": [
          "Boa noite",
          "Bom dia",
          "Prazer em conhecer você, John",
          "Até logo"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is John' significa:",
        "opts": [
          "Qual seu nome?",
          "Onde mora?",
          "Olá, meu nome é John",
          "Meu nome não é"
        ],
        "ans": 2,
        "type": "translation"
      }
    ]
  },
  {
    "id": 150,
    "module": 3,
    "moduleName": "Comunicação",
    "level": "B1",
    "title": "Cultura local",
    "desc": "Aprenda cultura local - tradução correta Miguel=Miguel",
    "time": "11 MIN",
    "phrase": "Hello, my name is Miguel",
    "translation": "Olá, meu nome é Miguel",
    "vocab": [
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Cultura local</h4><p><b>Frase:</b> Hello, my name is Miguel = Olá, meu nome é Miguel</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Miguel'",
        "opts": [
          "Até logo",
          "Olá, meu nome é Miguel",
          "Bom dia",
          "Boa noite"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Como vai",
          "Meu nome é",
          "Quantos anos",
          "Onde mora"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Miguel'",
        "opts": [
          "bad",
          "name",
          "good",
          "big"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Miguel'?",
        "opts": [
          "Ao se apresentar",
          "Ao comer",
          "Ao dirigir",
          "Ao dormir"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Goodbye",
          "Thanks",
          "Hello",
          "Please"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "My name is Miguel",
          "Goodbye",
          "Thank you",
          "I am fine"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Quantos anos?",
          "Onde mora?",
          "Qual é seu nome?",
          "Como vai?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Miguel'?",
        "opts": [
          "Trabalho",
          "Miguel",
          "Casa",
          "Carro"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Miguel'",
        "opts": [
          "am",
          "be",
          "is",
          "are"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Miguel'",
        "opts": [
          "Is my name Miguel",
          "My Miguel is name",
          "My name is Miguel",
          "Miguel is my name"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Miguel'",
        "opts": [
          "Prazer em conhecer você, Miguel",
          "Boa noite",
          "Bom dia",
          "Até logo"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Miguel' significa:",
        "opts": [
          "Onde mora?",
          "Qual seu nome?",
          "Olá, meu nome é Miguel",
          "Meu nome não é"
        ],
        "ans": 2,
        "type": "translation"
      }
    ]
  },
  {
    "id": 151,
    "module": 3,
    "moduleName": "Comunicação",
    "level": "B1",
    "title": "Olá e apresentações",
    "desc": "Aprenda olá e apresentações - tradução correta David=David",
    "time": "12 MIN",
    "phrase": "Hello, my name is David",
    "translation": "Olá, meu nome é David",
    "vocab": [
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Olá e apresentações</h4><p><b>Frase:</b> Hello, my name is David = Olá, meu nome é David</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is David'",
        "opts": [
          "Bom dia",
          "Boa noite",
          "Até logo",
          "Olá, meu nome é David"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Onde mora",
          "Quantos anos",
          "Como vai",
          "Meu nome é"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is David'",
        "opts": [
          "big",
          "name",
          "bad",
          "good"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is David'?",
        "opts": [
          "Ao dirigir",
          "Ao dormir",
          "Ao comer",
          "Ao se apresentar"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Hello",
          "Please",
          "Goodbye",
          "Thanks"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "My name is David",
          "Thank you",
          "I am fine",
          "Goodbye"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Como vai?",
          "Onde mora?",
          "Quantos anos?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is David'?",
        "opts": [
          "Trabalho",
          "Casa",
          "Carro",
          "David"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ David'",
        "opts": [
          "be",
          "am",
          "is",
          "are"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / David'",
        "opts": [
          "My David is name",
          "Is my name David",
          "My name is David",
          "David is my name"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, David'",
        "opts": [
          "Boa noite",
          "Até logo",
          "Prazer em conhecer você, David",
          "Bom dia"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is David' significa:",
        "opts": [
          "Onde mora?",
          "Olá, meu nome é David",
          "Qual seu nome?",
          "Meu nome não é"
        ],
        "ans": 1,
        "type": "translation"
      }
    ]
  },
  {
    "id": 152,
    "module": 3,
    "moduleName": "Comunicação",
    "level": "B1",
    "title": "Dizendo seu nome",
    "desc": "Aprenda dizendo seu nome - tradução correta Ana=Ana",
    "time": "13 MIN",
    "phrase": "Hello, my name is Ana",
    "translation": "Olá, meu nome é Ana",
    "vocab": [
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Dizendo seu nome</h4><p><b>Frase:</b> Hello, my name is Ana = Olá, meu nome é Ana</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Ana'",
        "opts": [
          "Até logo",
          "Boa noite",
          "Olá, meu nome é Ana",
          "Bom dia"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Meu nome é",
          "Quantos anos",
          "Onde mora",
          "Como vai"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Ana'",
        "opts": [
          "good",
          "bad",
          "big",
          "name"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Ana'?",
        "opts": [
          "Ao comer",
          "Ao dirigir",
          "Ao se apresentar",
          "Ao dormir"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Thanks",
          "Hello",
          "Goodbye",
          "Please"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "Thank you",
          "I am fine",
          "My name is Ana",
          "Goodbye"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Qual é seu nome?",
          "Como vai?",
          "Onde mora?",
          "Quantos anos?"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Ana'?",
        "opts": [
          "Carro",
          "Casa",
          "Ana",
          "Trabalho"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Ana'",
        "opts": [
          "am",
          "be",
          "are",
          "is"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Ana'",
        "opts": [
          "Is my name Ana",
          "My name is Ana",
          "Ana is my name",
          "My Ana is name"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Ana'",
        "opts": [
          "Boa noite",
          "Prazer em conhecer você, Ana",
          "Bom dia",
          "Até logo"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Ana' significa:",
        "opts": [
          "Onde mora?",
          "Olá, meu nome é Ana",
          "Meu nome não é",
          "Qual seu nome?"
        ],
        "ans": 1,
        "type": "translation"
      }
    ]
  },
  {
    "id": 153,
    "module": 3,
    "moduleName": "Comunicação",
    "level": "B1",
    "title": "De onde você é",
    "desc": "Aprenda de onde você é - tradução correta Carlos=Carlos",
    "time": "6 MIN",
    "phrase": "Hello, my name is Carlos",
    "translation": "Olá, meu nome é Carlos",
    "vocab": [
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 De onde você é</h4><p><b>Frase:</b> Hello, my name is Carlos = Olá, meu nome é Carlos</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Carlos'",
        "opts": [
          "Até logo",
          "Olá, meu nome é Carlos",
          "Boa noite",
          "Bom dia"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Onde mora",
          "Meu nome é",
          "Quantos anos",
          "Como vai"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Carlos'",
        "opts": [
          "big",
          "bad",
          "name",
          "good"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Carlos'?",
        "opts": [
          "Ao dirigir",
          "Ao se apresentar",
          "Ao comer",
          "Ao dormir"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Goodbye",
          "Thanks",
          "Hello",
          "Please"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "I am fine",
          "Thank you",
          "My name is Carlos",
          "Goodbye"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Onde mora?",
          "Como vai?",
          "Quantos anos?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Carlos'?",
        "opts": [
          "Carro",
          "Trabalho",
          "Carlos",
          "Casa"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Carlos'",
        "opts": [
          "am",
          "be",
          "are",
          "is"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Carlos'",
        "opts": [
          "My Carlos is name",
          "My name is Carlos",
          "Is my name Carlos",
          "Carlos is my name"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Carlos'",
        "opts": [
          "Bom dia",
          "Boa noite",
          "Prazer em conhecer você, Carlos",
          "Até logo"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Carlos' significa:",
        "opts": [
          "Onde mora?",
          "Meu nome não é",
          "Olá, meu nome é Carlos",
          "Qual seu nome?"
        ],
        "ans": 2,
        "type": "translation"
      }
    ]
  },
  {
    "id": 154,
    "module": 3,
    "moduleName": "Comunicação",
    "level": "B1",
    "title": "Perguntando o nome",
    "desc": "Aprenda perguntando o nome - tradução correta Ana=Ana",
    "time": "7 MIN",
    "phrase": "Hello, my name is Ana",
    "translation": "Olá, meu nome é Ana",
    "vocab": [
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Perguntando o nome</h4><p><b>Frase:</b> Hello, my name is Ana = Olá, meu nome é Ana</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Ana'",
        "opts": [
          "Bom dia",
          "Olá, meu nome é Ana",
          "Boa noite",
          "Até logo"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Meu nome é",
          "Onde mora",
          "Como vai",
          "Quantos anos"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Ana'",
        "opts": [
          "bad",
          "big",
          "good",
          "name"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Ana'?",
        "opts": [
          "Ao comer",
          "Ao dirigir",
          "Ao dormir",
          "Ao se apresentar"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Please",
          "Thanks",
          "Hello",
          "Goodbye"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "My name is Ana",
          "I am fine",
          "Thank you",
          "Goodbye"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Onde mora?",
          "Quantos anos?",
          "Como vai?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Ana'?",
        "opts": [
          "Trabalho",
          "Casa",
          "Carro",
          "Ana"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Ana'",
        "opts": [
          "be",
          "is",
          "am",
          "are"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Ana'",
        "opts": [
          "Ana is my name",
          "Is my name Ana",
          "My name is Ana",
          "My Ana is name"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Ana'",
        "opts": [
          "Bom dia",
          "Até logo",
          "Prazer em conhecer você, Ana",
          "Boa noite"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Ana' significa:",
        "opts": [
          "Onde mora?",
          "Qual seu nome?",
          "Olá, meu nome é Ana",
          "Meu nome não é"
        ],
        "ans": 2,
        "type": "translation"
      }
    ]
  },
  {
    "id": 155,
    "module": 3,
    "moduleName": "Comunicação",
    "level": "B1",
    "title": "Idade e aniversário",
    "desc": "Aprenda idade e aniversário - tradução correta Sarah=Sarah",
    "time": "8 MIN",
    "phrase": "Hello, my name is Sarah",
    "translation": "Olá, meu nome é Sarah",
    "vocab": [
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Idade e aniversário</h4><p><b>Frase:</b> Hello, my name is Sarah = Olá, meu nome é Sarah</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Sarah'",
        "opts": [
          "Olá, meu nome é Sarah",
          "Até logo",
          "Bom dia",
          "Boa noite"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Onde mora",
          "Como vai",
          "Meu nome é",
          "Quantos anos"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Sarah'",
        "opts": [
          "big",
          "bad",
          "good",
          "name"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Sarah'?",
        "opts": [
          "Ao comer",
          "Ao se apresentar",
          "Ao dirigir",
          "Ao dormir"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Goodbye",
          "Hello",
          "Please",
          "Thanks"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "My name is Sarah",
          "I am fine",
          "Thank you",
          "Goodbye"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Qual é seu nome?",
          "Onde mora?",
          "Quantos anos?",
          "Como vai?"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Sarah'?",
        "opts": [
          "Casa",
          "Sarah",
          "Trabalho",
          "Carro"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Sarah'",
        "opts": [
          "is",
          "are",
          "am",
          "be"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Sarah'",
        "opts": [
          "Is my name Sarah",
          "Sarah is my name",
          "My name is Sarah",
          "My Sarah is name"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Sarah'",
        "opts": [
          "Prazer em conhecer você, Sarah",
          "Bom dia",
          "Até logo",
          "Boa noite"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Sarah' significa:",
        "opts": [
          "Onde mora?",
          "Qual seu nome?",
          "Meu nome não é",
          "Olá, meu nome é Sarah"
        ],
        "ans": 3,
        "type": "translation"
      }
    ]
  },
  {
    "id": 156,
    "module": 3,
    "moduleName": "Comunicação",
    "level": "B1",
    "title": "Família básica",
    "desc": "Aprenda família básica - tradução correta Carlos=Carlos",
    "time": "9 MIN",
    "phrase": "Hello, my name is Carlos",
    "translation": "Olá, meu nome é Carlos",
    "vocab": [
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Família básica</h4><p><b>Frase:</b> Hello, my name is Carlos = Olá, meu nome é Carlos</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Carlos'",
        "opts": [
          "Olá, meu nome é Carlos",
          "Boa noite",
          "Bom dia",
          "Até logo"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Onde mora",
          "Como vai",
          "Meu nome é",
          "Quantos anos"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Carlos'",
        "opts": [
          "name",
          "good",
          "bad",
          "big"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Carlos'?",
        "opts": [
          "Ao dirigir",
          "Ao se apresentar",
          "Ao comer",
          "Ao dormir"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Goodbye",
          "Please",
          "Hello",
          "Thanks"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "Thank you",
          "I am fine",
          "My name is Carlos",
          "Goodbye"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Quantos anos?",
          "Qual é seu nome?",
          "Como vai?",
          "Onde mora?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Carlos'?",
        "opts": [
          "Carro",
          "Trabalho",
          "Carlos",
          "Casa"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Carlos'",
        "opts": [
          "are",
          "be",
          "is",
          "am"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Carlos'",
        "opts": [
          "My name is Carlos",
          "Is my name Carlos",
          "Carlos is my name",
          "My Carlos is name"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Carlos'",
        "opts": [
          "Boa noite",
          "Até logo",
          "Prazer em conhecer você, Carlos",
          "Bom dia"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Carlos' significa:",
        "opts": [
          "Qual seu nome?",
          "Onde mora?",
          "Olá, meu nome é Carlos",
          "Meu nome não é"
        ],
        "ans": 2,
        "type": "translation"
      }
    ]
  },
  {
    "id": 157,
    "module": 3,
    "moduleName": "Comunicação",
    "level": "B1",
    "title": "Cumprimentos formais",
    "desc": "Aprenda cumprimentos formais - tradução correta Sarah=Sarah",
    "time": "10 MIN",
    "phrase": "Hello, my name is Sarah",
    "translation": "Olá, meu nome é Sarah",
    "vocab": [
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Cumprimentos formais</h4><p><b>Frase:</b> Hello, my name is Sarah = Olá, meu nome é Sarah</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Sarah'",
        "opts": [
          "Até logo",
          "Olá, meu nome é Sarah",
          "Boa noite",
          "Bom dia"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Como vai",
          "Quantos anos",
          "Meu nome é",
          "Onde mora"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Sarah'",
        "opts": [
          "name",
          "bad",
          "good",
          "big"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Sarah'?",
        "opts": [
          "Ao comer",
          "Ao dormir",
          "Ao se apresentar",
          "Ao dirigir"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Thanks",
          "Goodbye",
          "Hello",
          "Please"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "My name is Sarah",
          "Thank you",
          "Goodbye",
          "I am fine"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Quantos anos?",
          "Onde mora?",
          "Como vai?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Sarah'?",
        "opts": [
          "Trabalho",
          "Carro",
          "Sarah",
          "Casa"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Sarah'",
        "opts": [
          "is",
          "are",
          "am",
          "be"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Sarah'",
        "opts": [
          "Sarah is my name",
          "Is my name Sarah",
          "My name is Sarah",
          "My Sarah is name"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Sarah'",
        "opts": [
          "Até logo",
          "Bom dia",
          "Prazer em conhecer você, Sarah",
          "Boa noite"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Sarah' significa:",
        "opts": [
          "Onde mora?",
          "Qual seu nome?",
          "Olá, meu nome é Sarah",
          "Meu nome não é"
        ],
        "ans": 2,
        "type": "translation"
      }
    ]
  },
  {
    "id": 158,
    "module": 3,
    "moduleName": "Comunicação",
    "level": "B1",
    "title": "Despedidas",
    "desc": "Aprenda despedidas - tradução correta Lucas=Lucas",
    "time": "11 MIN",
    "phrase": "Hello, my name is Lucas",
    "translation": "Olá, meu nome é Lucas",
    "vocab": [
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Despedidas</h4><p><b>Frase:</b> Hello, my name is Lucas = Olá, meu nome é Lucas</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Lucas'",
        "opts": [
          "Até logo",
          "Olá, meu nome é Lucas",
          "Bom dia",
          "Boa noite"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Onde mora",
          "Quantos anos",
          "Meu nome é",
          "Como vai"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Lucas'",
        "opts": [
          "big",
          "name",
          "good",
          "bad"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Lucas'?",
        "opts": [
          "Ao comer",
          "Ao dirigir",
          "Ao dormir",
          "Ao se apresentar"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Thanks",
          "Goodbye",
          "Hello",
          "Please"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "My name is Lucas",
          "Thank you",
          "Goodbye",
          "I am fine"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Como vai?",
          "Onde mora?",
          "Quantos anos?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Lucas'?",
        "opts": [
          "Trabalho",
          "Lucas",
          "Casa",
          "Carro"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Lucas'",
        "opts": [
          "are",
          "be",
          "am",
          "is"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Lucas'",
        "opts": [
          "My name is Lucas",
          "Is my name Lucas",
          "My Lucas is name",
          "Lucas is my name"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Lucas'",
        "opts": [
          "Boa noite",
          "Bom dia",
          "Até logo",
          "Prazer em conhecer você, Lucas"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Lucas' significa:",
        "opts": [
          "Olá, meu nome é Lucas",
          "Meu nome não é",
          "Onde mora?",
          "Qual seu nome?"
        ],
        "ans": 0,
        "type": "translation"
      }
    ]
  },
  {
    "id": 159,
    "module": 3,
    "moduleName": "Comunicação",
    "level": "B1",
    "title": "Como você está",
    "desc": "Aprenda como você está - tradução correta Carlos=Carlos",
    "time": "12 MIN",
    "phrase": "Hello, my name is Carlos",
    "translation": "Olá, meu nome é Carlos",
    "vocab": [
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Como você está</h4><p><b>Frase:</b> Hello, my name is Carlos = Olá, meu nome é Carlos</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Carlos'",
        "opts": [
          "Até logo",
          "Olá, meu nome é Carlos",
          "Bom dia",
          "Boa noite"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Como vai",
          "Quantos anos",
          "Meu nome é",
          "Onde mora"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Carlos'",
        "opts": [
          "name",
          "big",
          "bad",
          "good"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Carlos'?",
        "opts": [
          "Ao dormir",
          "Ao dirigir",
          "Ao se apresentar",
          "Ao comer"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Goodbye",
          "Please",
          "Thanks",
          "Hello"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "My name is Carlos",
          "Goodbye",
          "I am fine",
          "Thank you"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Quantos anos?",
          "Qual é seu nome?",
          "Como vai?",
          "Onde mora?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Carlos'?",
        "opts": [
          "Casa",
          "Carro",
          "Carlos",
          "Trabalho"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Carlos'",
        "opts": [
          "is",
          "am",
          "are",
          "be"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Carlos'",
        "opts": [
          "My Carlos is name",
          "Carlos is my name",
          "My name is Carlos",
          "Is my name Carlos"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Carlos'",
        "opts": [
          "Até logo",
          "Prazer em conhecer você, Carlos",
          "Boa noite",
          "Bom dia"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Carlos' significa:",
        "opts": [
          "Onde mora?",
          "Qual seu nome?",
          "Meu nome não é",
          "Olá, meu nome é Carlos"
        ],
        "ans": 3,
        "type": "translation"
      }
    ]
  },
  {
    "id": 160,
    "module": 3,
    "moduleName": "Comunicação",
    "level": "B1",
    "title": "Números e telefone",
    "desc": "Aprenda números e telefone - tradução correta John=John",
    "time": "13 MIN",
    "phrase": "Hello, my name is John",
    "translation": "Olá, meu nome é John",
    "vocab": [
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Números e telefone</h4><p><b>Frase:</b> Hello, my name is John = Olá, meu nome é John</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is John'",
        "opts": [
          "Bom dia",
          "Até logo",
          "Boa noite",
          "Olá, meu nome é John"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Como vai",
          "Meu nome é",
          "Onde mora",
          "Quantos anos"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is John'",
        "opts": [
          "name",
          "good",
          "big",
          "bad"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is John'?",
        "opts": [
          "Ao dormir",
          "Ao dirigir",
          "Ao se apresentar",
          "Ao comer"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Hello",
          "Goodbye",
          "Please",
          "Thanks"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "Thank you",
          "I am fine",
          "Goodbye",
          "My name is John"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Onde mora?",
          "Quantos anos?",
          "Como vai?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is John'?",
        "opts": [
          "Carro",
          "Casa",
          "John",
          "Trabalho"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ John'",
        "opts": [
          "be",
          "is",
          "are",
          "am"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / John'",
        "opts": [
          "My John is name",
          "My name is John",
          "John is my name",
          "Is my name John"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, John'",
        "opts": [
          "Bom dia",
          "Boa noite",
          "Até logo",
          "Prazer em conhecer você, John"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is John' significa:",
        "opts": [
          "Meu nome não é",
          "Qual seu nome?",
          "Onde mora?",
          "Olá, meu nome é John"
        ],
        "ans": 3,
        "type": "translation"
      }
    ]
  },
  {
    "id": 161,
    "module": 4,
    "moduleName": "Trabalho e Vida",
    "level": "B1",
    "title": "Endereço e cidade",
    "desc": "Aprenda endereço e cidade - tradução correta John=John",
    "time": "6 MIN",
    "phrase": "Hello, my name is John",
    "translation": "Olá, meu nome é John",
    "vocab": [
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Endereço e cidade</h4><p><b>Frase:</b> Hello, my name is John = Olá, meu nome é John</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is John'",
        "opts": [
          "Bom dia",
          "Boa noite",
          "Até logo",
          "Olá, meu nome é John"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Onde mora",
          "Meu nome é",
          "Como vai",
          "Quantos anos"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is John'",
        "opts": [
          "big",
          "bad",
          "good",
          "name"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is John'?",
        "opts": [
          "Ao dormir",
          "Ao comer",
          "Ao se apresentar",
          "Ao dirigir"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Hello",
          "Goodbye",
          "Please",
          "Thanks"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "I am fine",
          "My name is John",
          "Thank you",
          "Goodbye"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Qual é seu nome?",
          "Como vai?",
          "Quantos anos?",
          "Onde mora?"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is John'?",
        "opts": [
          "Casa",
          "John",
          "Trabalho",
          "Carro"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ John'",
        "opts": [
          "are",
          "is",
          "am",
          "be"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / John'",
        "opts": [
          "My John is name",
          "My name is John",
          "Is my name John",
          "John is my name"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, John'",
        "opts": [
          "Bom dia",
          "Boa noite",
          "Até logo",
          "Prazer em conhecer você, John"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is John' significa:",
        "opts": [
          "Olá, meu nome é John",
          "Qual seu nome?",
          "Onde mora?",
          "Meu nome não é"
        ],
        "ans": 0,
        "type": "translation"
      }
    ]
  },
  {
    "id": 162,
    "module": 4,
    "moduleName": "Trabalho e Vida",
    "level": "B1",
    "title": "Profissão simples",
    "desc": "Aprenda profissão simples - tradução correta David=David",
    "time": "7 MIN",
    "phrase": "Hello, my name is David",
    "translation": "Olá, meu nome é David",
    "vocab": [
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Profissão simples</h4><p><b>Frase:</b> Hello, my name is David = Olá, meu nome é David</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is David'",
        "opts": [
          "Bom dia",
          "Boa noite",
          "Até logo",
          "Olá, meu nome é David"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Meu nome é",
          "Quantos anos",
          "Como vai",
          "Onde mora"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is David'",
        "opts": [
          "name",
          "good",
          "big",
          "bad"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is David'?",
        "opts": [
          "Ao dormir",
          "Ao se apresentar",
          "Ao comer",
          "Ao dirigir"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Hello",
          "Please",
          "Goodbye",
          "Thanks"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "My name is David",
          "I am fine",
          "Goodbye",
          "Thank you"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Qual é seu nome?",
          "Onde mora?",
          "Como vai?",
          "Quantos anos?"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is David'?",
        "opts": [
          "Carro",
          "Casa",
          "David",
          "Trabalho"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ David'",
        "opts": [
          "am",
          "is",
          "are",
          "be"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / David'",
        "opts": [
          "Is my name David",
          "My name is David",
          "David is my name",
          "My David is name"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, David'",
        "opts": [
          "Até logo",
          "Bom dia",
          "Boa noite",
          "Prazer em conhecer você, David"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is David' significa:",
        "opts": [
          "Onde mora?",
          "Olá, meu nome é David",
          "Qual seu nome?",
          "Meu nome não é"
        ],
        "ans": 1,
        "type": "translation"
      }
    ]
  },
  {
    "id": 163,
    "module": 4,
    "moduleName": "Trabalho e Vida",
    "level": "B1",
    "title": "Hobbies favoritos",
    "desc": "Aprenda hobbies favoritos - tradução correta Emma=Emma",
    "time": "8 MIN",
    "phrase": "Hello, my name is Emma",
    "translation": "Olá, meu nome é Emma",
    "vocab": [
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Hobbies favoritos</h4><p><b>Frase:</b> Hello, my name is Emma = Olá, meu nome é Emma</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Emma'",
        "opts": [
          "Boa noite",
          "Olá, meu nome é Emma",
          "Bom dia",
          "Até logo"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Como vai",
          "Meu nome é",
          "Quantos anos",
          "Onde mora"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Emma'",
        "opts": [
          "bad",
          "big",
          "name",
          "good"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Emma'?",
        "opts": [
          "Ao comer",
          "Ao dirigir",
          "Ao dormir",
          "Ao se apresentar"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Goodbye",
          "Please",
          "Hello",
          "Thanks"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "My name is Emma",
          "Thank you",
          "Goodbye",
          "I am fine"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Qual é seu nome?",
          "Quantos anos?",
          "Onde mora?",
          "Como vai?"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Emma'?",
        "opts": [
          "Carro",
          "Emma",
          "Casa",
          "Trabalho"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Emma'",
        "opts": [
          "is",
          "are",
          "am",
          "be"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Emma'",
        "opts": [
          "Is my name Emma",
          "Emma is my name",
          "My Emma is name",
          "My name is Emma"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Emma'",
        "opts": [
          "Prazer em conhecer você, Emma",
          "Bom dia",
          "Boa noite",
          "Até logo"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Emma' significa:",
        "opts": [
          "Meu nome não é",
          "Olá, meu nome é Emma",
          "Qual seu nome?",
          "Onde mora?"
        ],
        "ans": 1,
        "type": "translation"
      }
    ]
  },
  {
    "id": 164,
    "module": 4,
    "moduleName": "Trabalho e Vida",
    "level": "B1",
    "title": "Comida favorita",
    "desc": "Aprenda comida favorita - tradução correta Emma=Emma",
    "time": "9 MIN",
    "phrase": "Hello, my name is Emma",
    "translation": "Olá, meu nome é Emma",
    "vocab": [
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Comida favorita</h4><p><b>Frase:</b> Hello, my name is Emma = Olá, meu nome é Emma</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Emma'",
        "opts": [
          "Olá, meu nome é Emma",
          "Até logo",
          "Boa noite",
          "Bom dia"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Quantos anos",
          "Como vai",
          "Onde mora",
          "Meu nome é"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Emma'",
        "opts": [
          "good",
          "name",
          "bad",
          "big"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Emma'?",
        "opts": [
          "Ao dormir",
          "Ao se apresentar",
          "Ao dirigir",
          "Ao comer"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Goodbye",
          "Hello",
          "Thanks",
          "Please"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "Thank you",
          "Goodbye",
          "My name is Emma",
          "I am fine"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Onde mora?",
          "Qual é seu nome?",
          "Quantos anos?",
          "Como vai?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Emma'?",
        "opts": [
          "Emma",
          "Carro",
          "Trabalho",
          "Casa"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Emma'",
        "opts": [
          "be",
          "am",
          "are",
          "is"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Emma'",
        "opts": [
          "Is my name Emma",
          "My Emma is name",
          "Emma is my name",
          "My name is Emma"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Emma'",
        "opts": [
          "Prazer em conhecer você, Emma",
          "Boa noite",
          "Bom dia",
          "Até logo"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Emma' significa:",
        "opts": [
          "Meu nome não é",
          "Olá, meu nome é Emma",
          "Qual seu nome?",
          "Onde mora?"
        ],
        "ans": 1,
        "type": "translation"
      }
    ]
  },
  {
    "id": 165,
    "module": 4,
    "moduleName": "Trabalho e Vida",
    "level": "B1",
    "title": "Cores favoritas",
    "desc": "Aprenda cores favoritas - tradução correta Emma=Emma",
    "time": "10 MIN",
    "phrase": "Hello, my name is Emma",
    "translation": "Olá, meu nome é Emma",
    "vocab": [
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Cores favoritas</h4><p><b>Frase:</b> Hello, my name is Emma = Olá, meu nome é Emma</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Emma'",
        "opts": [
          "Boa noite",
          "Olá, meu nome é Emma",
          "Bom dia",
          "Até logo"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Onde mora",
          "Quantos anos",
          "Meu nome é",
          "Como vai"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Emma'",
        "opts": [
          "good",
          "name",
          "bad",
          "big"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Emma'?",
        "opts": [
          "Ao se apresentar",
          "Ao dirigir",
          "Ao dormir",
          "Ao comer"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Goodbye",
          "Thanks",
          "Please",
          "Hello"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "My name is Emma",
          "Goodbye",
          "Thank you",
          "I am fine"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Como vai?",
          "Qual é seu nome?",
          "Onde mora?",
          "Quantos anos?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Emma'?",
        "opts": [
          "Trabalho",
          "Emma",
          "Carro",
          "Casa"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Emma'",
        "opts": [
          "is",
          "are",
          "am",
          "be"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Emma'",
        "opts": [
          "My Emma is name",
          "Emma is my name",
          "Is my name Emma",
          "My name is Emma"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Emma'",
        "opts": [
          "Prazer em conhecer você, Emma",
          "Até logo",
          "Boa noite",
          "Bom dia"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Emma' significa:",
        "opts": [
          "Qual seu nome?",
          "Olá, meu nome é Emma",
          "Meu nome não é",
          "Onde mora?"
        ],
        "ans": 1,
        "type": "translation"
      }
    ]
  },
  {
    "id": 166,
    "module": 4,
    "moduleName": "Trabalho e Vida",
    "level": "B1",
    "title": "Tempo e clima",
    "desc": "Aprenda tempo e clima - tradução correta John=John",
    "time": "11 MIN",
    "phrase": "Hello, my name is John",
    "translation": "Olá, meu nome é John",
    "vocab": [
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Tempo e clima</h4><p><b>Frase:</b> Hello, my name is John = Olá, meu nome é John</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is John'",
        "opts": [
          "Boa noite",
          "Olá, meu nome é John",
          "Até logo",
          "Bom dia"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Meu nome é",
          "Quantos anos",
          "Como vai",
          "Onde mora"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is John'",
        "opts": [
          "good",
          "name",
          "bad",
          "big"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is John'?",
        "opts": [
          "Ao dormir",
          "Ao comer",
          "Ao se apresentar",
          "Ao dirigir"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Thanks",
          "Hello",
          "Goodbye",
          "Please"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "My name is John",
          "I am fine",
          "Goodbye",
          "Thank you"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Quantos anos?",
          "Onde mora?",
          "Como vai?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is John'?",
        "opts": [
          "Casa",
          "John",
          "Trabalho",
          "Carro"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ John'",
        "opts": [
          "is",
          "are",
          "be",
          "am"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / John'",
        "opts": [
          "John is my name",
          "Is my name John",
          "My John is name",
          "My name is John"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, John'",
        "opts": [
          "Até logo",
          "Boa noite",
          "Prazer em conhecer você, John",
          "Bom dia"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is John' significa:",
        "opts": [
          "Qual seu nome?",
          "Onde mora?",
          "Meu nome não é",
          "Olá, meu nome é John"
        ],
        "ans": 3,
        "type": "translation"
      }
    ]
  },
  {
    "id": 167,
    "module": 4,
    "moduleName": "Trabalho e Vida",
    "level": "B1",
    "title": "Dias da semana",
    "desc": "Aprenda dias da semana - tradução correta Sarah=Sarah",
    "time": "12 MIN",
    "phrase": "Hello, my name is Sarah",
    "translation": "Olá, meu nome é Sarah",
    "vocab": [
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Dias da semana</h4><p><b>Frase:</b> Hello, my name is Sarah = Olá, meu nome é Sarah</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Sarah'",
        "opts": [
          "Bom dia",
          "Até logo",
          "Olá, meu nome é Sarah",
          "Boa noite"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Onde mora",
          "Como vai",
          "Quantos anos",
          "Meu nome é"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Sarah'",
        "opts": [
          "big",
          "good",
          "name",
          "bad"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Sarah'?",
        "opts": [
          "Ao se apresentar",
          "Ao dirigir",
          "Ao dormir",
          "Ao comer"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Please",
          "Hello",
          "Goodbye",
          "Thanks"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "Thank you",
          "Goodbye",
          "My name is Sarah",
          "I am fine"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Onde mora?",
          "Como vai?",
          "Qual é seu nome?",
          "Quantos anos?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Sarah'?",
        "opts": [
          "Carro",
          "Casa",
          "Trabalho",
          "Sarah"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Sarah'",
        "opts": [
          "be",
          "are",
          "is",
          "am"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Sarah'",
        "opts": [
          "My name is Sarah",
          "Sarah is my name",
          "Is my name Sarah",
          "My Sarah is name"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Sarah'",
        "opts": [
          "Até logo",
          "Bom dia",
          "Prazer em conhecer você, Sarah",
          "Boa noite"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Sarah' significa:",
        "opts": [
          "Qual seu nome?",
          "Meu nome não é",
          "Onde mora?",
          "Olá, meu nome é Sarah"
        ],
        "ans": 3,
        "type": "translation"
      }
    ]
  },
  {
    "id": 168,
    "module": 4,
    "moduleName": "Trabalho e Vida",
    "level": "B1",
    "title": "Horas e compromissos",
    "desc": "Aprenda horas e compromissos - tradução correta Julia=Julia",
    "time": "13 MIN",
    "phrase": "Hello, my name is Julia",
    "translation": "Olá, meu nome é Julia",
    "vocab": [
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Horas e compromissos</h4><p><b>Frase:</b> Hello, my name is Julia = Olá, meu nome é Julia</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Julia'",
        "opts": [
          "Olá, meu nome é Julia",
          "Até logo",
          "Boa noite",
          "Bom dia"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Quantos anos",
          "Meu nome é",
          "Como vai",
          "Onde mora"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Julia'",
        "opts": [
          "name",
          "big",
          "good",
          "bad"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Julia'?",
        "opts": [
          "Ao comer",
          "Ao dormir",
          "Ao se apresentar",
          "Ao dirigir"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Goodbye",
          "Please",
          "Thanks",
          "Hello"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "Thank you",
          "My name is Julia",
          "I am fine",
          "Goodbye"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Qual é seu nome?",
          "Quantos anos?",
          "Onde mora?",
          "Como vai?"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Julia'?",
        "opts": [
          "Trabalho",
          "Casa",
          "Carro",
          "Julia"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Julia'",
        "opts": [
          "am",
          "be",
          "is",
          "are"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Julia'",
        "opts": [
          "Julia is my name",
          "Is my name Julia",
          "My name is Julia",
          "My Julia is name"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Julia'",
        "opts": [
          "Boa noite",
          "Prazer em conhecer você, Julia",
          "Até logo",
          "Bom dia"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Julia' significa:",
        "opts": [
          "Onde mora?",
          "Meu nome não é",
          "Qual seu nome?",
          "Olá, meu nome é Julia"
        ],
        "ans": 3,
        "type": "translation"
      }
    ]
  },
  {
    "id": 169,
    "module": 4,
    "moduleName": "Trabalho e Vida",
    "level": "B1",
    "title": "Família estendida",
    "desc": "Aprenda família estendida - tradução correta Emma=Emma",
    "time": "6 MIN",
    "phrase": "Hello, my name is Emma",
    "translation": "Olá, meu nome é Emma",
    "vocab": [
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Família estendida</h4><p><b>Frase:</b> Hello, my name is Emma = Olá, meu nome é Emma</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Emma'",
        "opts": [
          "Boa noite",
          "Até logo",
          "Bom dia",
          "Olá, meu nome é Emma"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Onde mora",
          "Quantos anos",
          "Meu nome é",
          "Como vai"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Emma'",
        "opts": [
          "big",
          "bad",
          "good",
          "name"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Emma'?",
        "opts": [
          "Ao comer",
          "Ao dormir",
          "Ao dirigir",
          "Ao se apresentar"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Hello",
          "Thanks",
          "Goodbye",
          "Please"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "Thank you",
          "I am fine",
          "My name is Emma",
          "Goodbye"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Onde mora?",
          "Quantos anos?",
          "Qual é seu nome?",
          "Como vai?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Emma'?",
        "opts": [
          "Casa",
          "Carro",
          "Emma",
          "Trabalho"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Emma'",
        "opts": [
          "am",
          "are",
          "is",
          "be"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Emma'",
        "opts": [
          "My Emma is name",
          "My name is Emma",
          "Is my name Emma",
          "Emma is my name"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Emma'",
        "opts": [
          "Boa noite",
          "Bom dia",
          "Até logo",
          "Prazer em conhecer você, Emma"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Emma' significa:",
        "opts": [
          "Onde mora?",
          "Olá, meu nome é Emma",
          "Qual seu nome?",
          "Meu nome não é"
        ],
        "ans": 1,
        "type": "translation"
      }
    ]
  },
  {
    "id": 170,
    "module": 4,
    "moduleName": "Trabalho e Vida",
    "level": "B1",
    "title": "Casa e moradia",
    "desc": "Aprenda casa e moradia - tradução correta Sarah=Sarah",
    "time": "7 MIN",
    "phrase": "Hello, my name is Sarah",
    "translation": "Olá, meu nome é Sarah",
    "vocab": [
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Casa e moradia</h4><p><b>Frase:</b> Hello, my name is Sarah = Olá, meu nome é Sarah</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Sarah'",
        "opts": [
          "Olá, meu nome é Sarah",
          "Bom dia",
          "Até logo",
          "Boa noite"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Onde mora",
          "Como vai",
          "Quantos anos",
          "Meu nome é"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Sarah'",
        "opts": [
          "big",
          "name",
          "good",
          "bad"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Sarah'?",
        "opts": [
          "Ao dirigir",
          "Ao dormir",
          "Ao se apresentar",
          "Ao comer"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Goodbye",
          "Please",
          "Hello",
          "Thanks"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "My name is Sarah",
          "Goodbye",
          "Thank you",
          "I am fine"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Qual é seu nome?",
          "Como vai?",
          "Onde mora?",
          "Quantos anos?"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Sarah'?",
        "opts": [
          "Carro",
          "Casa",
          "Sarah",
          "Trabalho"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Sarah'",
        "opts": [
          "be",
          "are",
          "am",
          "is"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Sarah'",
        "opts": [
          "Sarah is my name",
          "My name is Sarah",
          "My Sarah is name",
          "Is my name Sarah"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Sarah'",
        "opts": [
          "Bom dia",
          "Prazer em conhecer você, Sarah",
          "Boa noite",
          "Até logo"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Sarah' significa:",
        "opts": [
          "Qual seu nome?",
          "Onde mora?",
          "Olá, meu nome é Sarah",
          "Meu nome não é"
        ],
        "ans": 2,
        "type": "translation"
      }
    ]
  },
  {
    "id": 171,
    "module": 4,
    "moduleName": "Trabalho e Vida",
    "level": "B1",
    "title": "Rotina matinal",
    "desc": "Aprenda rotina matinal - tradução correta Miguel=Miguel",
    "time": "8 MIN",
    "phrase": "Hello, my name is Miguel",
    "translation": "Olá, meu nome é Miguel",
    "vocab": [
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Rotina matinal</h4><p><b>Frase:</b> Hello, my name is Miguel = Olá, meu nome é Miguel</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Miguel'",
        "opts": [
          "Bom dia",
          "Olá, meu nome é Miguel",
          "Boa noite",
          "Até logo"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Como vai",
          "Onde mora",
          "Meu nome é",
          "Quantos anos"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Miguel'",
        "opts": [
          "name",
          "big",
          "good",
          "bad"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Miguel'?",
        "opts": [
          "Ao comer",
          "Ao se apresentar",
          "Ao dirigir",
          "Ao dormir"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Goodbye",
          "Please",
          "Thanks",
          "Hello"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "I am fine",
          "My name is Miguel",
          "Goodbye",
          "Thank you"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Quantos anos?",
          "Qual é seu nome?",
          "Onde mora?",
          "Como vai?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Miguel'?",
        "opts": [
          "Casa",
          "Carro",
          "Trabalho",
          "Miguel"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Miguel'",
        "opts": [
          "be",
          "am",
          "are",
          "is"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Miguel'",
        "opts": [
          "My name is Miguel",
          "Miguel is my name",
          "Is my name Miguel",
          "My Miguel is name"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Miguel'",
        "opts": [
          "Até logo",
          "Boa noite",
          "Prazer em conhecer você, Miguel",
          "Bom dia"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Miguel' significa:",
        "opts": [
          "Olá, meu nome é Miguel",
          "Qual seu nome?",
          "Onde mora?",
          "Meu nome não é"
        ],
        "ans": 0,
        "type": "translation"
      }
    ]
  },
  {
    "id": 172,
    "module": 4,
    "moduleName": "Trabalho e Vida",
    "level": "B1",
    "title": "Rotina noturna",
    "desc": "Aprenda rotina noturna - tradução correta Lucas=Lucas",
    "time": "9 MIN",
    "phrase": "Hello, my name is Lucas",
    "translation": "Olá, meu nome é Lucas",
    "vocab": [
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Rotina noturna</h4><p><b>Frase:</b> Hello, my name is Lucas = Olá, meu nome é Lucas</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Lucas'",
        "opts": [
          "Até logo",
          "Olá, meu nome é Lucas",
          "Boa noite",
          "Bom dia"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Quantos anos",
          "Onde mora",
          "Como vai",
          "Meu nome é"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Lucas'",
        "opts": [
          "name",
          "bad",
          "good",
          "big"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Lucas'?",
        "opts": [
          "Ao dormir",
          "Ao se apresentar",
          "Ao comer",
          "Ao dirigir"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Please",
          "Thanks",
          "Goodbye",
          "Hello"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "Goodbye",
          "Thank you",
          "I am fine",
          "My name is Lucas"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Qual é seu nome?",
          "Como vai?",
          "Quantos anos?",
          "Onde mora?"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Lucas'?",
        "opts": [
          "Carro",
          "Casa",
          "Trabalho",
          "Lucas"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Lucas'",
        "opts": [
          "am",
          "are",
          "be",
          "is"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Lucas'",
        "opts": [
          "Lucas is my name",
          "My Lucas is name",
          "Is my name Lucas",
          "My name is Lucas"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Lucas'",
        "opts": [
          "Até logo",
          "Bom dia",
          "Boa noite",
          "Prazer em conhecer você, Lucas"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Lucas' significa:",
        "opts": [
          "Onde mora?",
          "Olá, meu nome é Lucas",
          "Meu nome não é",
          "Qual seu nome?"
        ],
        "ans": 1,
        "type": "translation"
      }
    ]
  },
  {
    "id": 173,
    "module": 4,
    "moduleName": "Trabalho e Vida",
    "level": "B1",
    "title": "Fim de semana",
    "desc": "Aprenda fim de semana - tradução correta Julia=Julia",
    "time": "10 MIN",
    "phrase": "Hello, my name is Julia",
    "translation": "Olá, meu nome é Julia",
    "vocab": [
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Fim de semana</h4><p><b>Frase:</b> Hello, my name is Julia = Olá, meu nome é Julia</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Julia'",
        "opts": [
          "Olá, meu nome é Julia",
          "Até logo",
          "Boa noite",
          "Bom dia"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Como vai",
          "Quantos anos",
          "Meu nome é",
          "Onde mora"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Julia'",
        "opts": [
          "bad",
          "big",
          "good",
          "name"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Julia'?",
        "opts": [
          "Ao se apresentar",
          "Ao dirigir",
          "Ao dormir",
          "Ao comer"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Please",
          "Thanks",
          "Hello",
          "Goodbye"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "Goodbye",
          "I am fine",
          "Thank you",
          "My name is Julia"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Onde mora?",
          "Como vai?",
          "Quantos anos?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Julia'?",
        "opts": [
          "Trabalho",
          "Casa",
          "Julia",
          "Carro"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Julia'",
        "opts": [
          "be",
          "am",
          "are",
          "is"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Julia'",
        "opts": [
          "Is my name Julia",
          "My Julia is name",
          "Julia is my name",
          "My name is Julia"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Julia'",
        "opts": [
          "Boa noite",
          "Bom dia",
          "Até logo",
          "Prazer em conhecer você, Julia"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Julia' significa:",
        "opts": [
          "Onde mora?",
          "Meu nome não é",
          "Olá, meu nome é Julia",
          "Qual seu nome?"
        ],
        "ans": 2,
        "type": "translation"
      }
    ]
  },
  {
    "id": 174,
    "module": 4,
    "moduleName": "Trabalho e Vida",
    "level": "B1",
    "title": "Compras básicas",
    "desc": "Aprenda compras básicas - tradução correta Sofia=Sofia",
    "time": "11 MIN",
    "phrase": "Hello, my name is Sofia",
    "translation": "Olá, meu nome é Sofia",
    "vocab": [
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Compras básicas</h4><p><b>Frase:</b> Hello, my name is Sofia = Olá, meu nome é Sofia</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Sofia'",
        "opts": [
          "Até logo",
          "Boa noite",
          "Bom dia",
          "Olá, meu nome é Sofia"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Meu nome é",
          "Como vai",
          "Quantos anos",
          "Onde mora"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Sofia'",
        "opts": [
          "big",
          "good",
          "name",
          "bad"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Sofia'?",
        "opts": [
          "Ao dormir",
          "Ao se apresentar",
          "Ao comer",
          "Ao dirigir"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Please",
          "Goodbye",
          "Hello",
          "Thanks"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "Goodbye",
          "My name is Sofia",
          "I am fine",
          "Thank you"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Qual é seu nome?",
          "Onde mora?",
          "Como vai?",
          "Quantos anos?"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Sofia'?",
        "opts": [
          "Carro",
          "Sofia",
          "Casa",
          "Trabalho"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Sofia'",
        "opts": [
          "are",
          "is",
          "be",
          "am"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Sofia'",
        "opts": [
          "Sofia is my name",
          "My name is Sofia",
          "Is my name Sofia",
          "My Sofia is name"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Sofia'",
        "opts": [
          "Bom dia",
          "Boa noite",
          "Até logo",
          "Prazer em conhecer você, Sofia"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Sofia' significa:",
        "opts": [
          "Qual seu nome?",
          "Olá, meu nome é Sofia",
          "Onde mora?",
          "Meu nome não é"
        ],
        "ans": 1,
        "type": "translation"
      }
    ]
  },
  {
    "id": 175,
    "module": 4,
    "moduleName": "Trabalho e Vida",
    "level": "B1",
    "title": "Transporte",
    "desc": "Aprenda transporte - tradução correta Ana=Ana",
    "time": "12 MIN",
    "phrase": "Hello, my name is Ana",
    "translation": "Olá, meu nome é Ana",
    "vocab": [
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Transporte</h4><p><b>Frase:</b> Hello, my name is Ana = Olá, meu nome é Ana</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Ana'",
        "opts": [
          "Olá, meu nome é Ana",
          "Boa noite",
          "Até logo",
          "Bom dia"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Meu nome é",
          "Onde mora",
          "Quantos anos",
          "Como vai"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Ana'",
        "opts": [
          "good",
          "name",
          "bad",
          "big"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Ana'?",
        "opts": [
          "Ao se apresentar",
          "Ao dirigir",
          "Ao comer",
          "Ao dormir"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Thanks",
          "Goodbye",
          "Hello",
          "Please"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "Goodbye",
          "I am fine",
          "Thank you",
          "My name is Ana"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Como vai?",
          "Onde mora?",
          "Qual é seu nome?",
          "Quantos anos?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Ana'?",
        "opts": [
          "Casa",
          "Ana",
          "Trabalho",
          "Carro"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Ana'",
        "opts": [
          "be",
          "is",
          "are",
          "am"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Ana'",
        "opts": [
          "My Ana is name",
          "Is my name Ana",
          "My name is Ana",
          "Ana is my name"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Ana'",
        "opts": [
          "Bom dia",
          "Até logo",
          "Prazer em conhecer você, Ana",
          "Boa noite"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Ana' significa:",
        "opts": [
          "Meu nome não é",
          "Onde mora?",
          "Olá, meu nome é Ana",
          "Qual seu nome?"
        ],
        "ans": 2,
        "type": "translation"
      }
    ]
  },
  {
    "id": 176,
    "module": 4,
    "moduleName": "Trabalho e Vida",
    "level": "B1",
    "title": "Comida e restaurante",
    "desc": "Aprenda comida e restaurante - tradução correta Lucas=Lucas",
    "time": "13 MIN",
    "phrase": "Hello, my name is Lucas",
    "translation": "Olá, meu nome é Lucas",
    "vocab": [
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Comida e restaurante</h4><p><b>Frase:</b> Hello, my name is Lucas = Olá, meu nome é Lucas</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Lucas'",
        "opts": [
          "Bom dia",
          "Até logo",
          "Olá, meu nome é Lucas",
          "Boa noite"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Onde mora",
          "Quantos anos",
          "Como vai",
          "Meu nome é"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Lucas'",
        "opts": [
          "bad",
          "name",
          "good",
          "big"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Lucas'?",
        "opts": [
          "Ao comer",
          "Ao dirigir",
          "Ao dormir",
          "Ao se apresentar"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Please",
          "Goodbye",
          "Thanks",
          "Hello"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "Goodbye",
          "Thank you",
          "I am fine",
          "My name is Lucas"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Onde mora?",
          "Quantos anos?",
          "Como vai?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Lucas'?",
        "opts": [
          "Lucas",
          "Casa",
          "Carro",
          "Trabalho"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Lucas'",
        "opts": [
          "be",
          "are",
          "am",
          "is"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Lucas'",
        "opts": [
          "My Lucas is name",
          "Is my name Lucas",
          "Lucas is my name",
          "My name is Lucas"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Lucas'",
        "opts": [
          "Bom dia",
          "Prazer em conhecer você, Lucas",
          "Até logo",
          "Boa noite"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Lucas' significa:",
        "opts": [
          "Onde mora?",
          "Qual seu nome?",
          "Meu nome não é",
          "Olá, meu nome é Lucas"
        ],
        "ans": 3,
        "type": "translation"
      }
    ]
  },
  {
    "id": 177,
    "module": 4,
    "moduleName": "Trabalho e Vida",
    "level": "B1",
    "title": "Bebidas",
    "desc": "Aprenda bebidas - tradução correta Pedro=Pedro",
    "time": "6 MIN",
    "phrase": "Hello, my name is Pedro",
    "translation": "Olá, meu nome é Pedro",
    "vocab": [
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Bebidas</h4><p><b>Frase:</b> Hello, my name is Pedro = Olá, meu nome é Pedro</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Pedro'",
        "opts": [
          "Até logo",
          "Bom dia",
          "Olá, meu nome é Pedro",
          "Boa noite"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Quantos anos",
          "Como vai",
          "Onde mora",
          "Meu nome é"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Pedro'",
        "opts": [
          "good",
          "bad",
          "name",
          "big"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Pedro'?",
        "opts": [
          "Ao dirigir",
          "Ao comer",
          "Ao se apresentar",
          "Ao dormir"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Hello",
          "Please",
          "Goodbye",
          "Thanks"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "Thank you",
          "My name is Pedro",
          "Goodbye",
          "I am fine"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Qual é seu nome?",
          "Como vai?",
          "Quantos anos?",
          "Onde mora?"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Pedro'?",
        "opts": [
          "Carro",
          "Trabalho",
          "Pedro",
          "Casa"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Pedro'",
        "opts": [
          "be",
          "am",
          "are",
          "is"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Pedro'",
        "opts": [
          "Is my name Pedro",
          "Pedro is my name",
          "My name is Pedro",
          "My Pedro is name"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Pedro'",
        "opts": [
          "Boa noite",
          "Até logo",
          "Bom dia",
          "Prazer em conhecer você, Pedro"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Pedro' significa:",
        "opts": [
          "Qual seu nome?",
          "Onde mora?",
          "Olá, meu nome é Pedro",
          "Meu nome não é"
        ],
        "ans": 2,
        "type": "translation"
      }
    ]
  },
  {
    "id": 178,
    "module": 4,
    "moduleName": "Trabalho e Vida",
    "level": "B1",
    "title": "Pedindo ajuda",
    "desc": "Aprenda pedindo ajuda - tradução correta Carlos=Carlos",
    "time": "7 MIN",
    "phrase": "Hello, my name is Carlos",
    "translation": "Olá, meu nome é Carlos",
    "vocab": [
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Pedindo ajuda</h4><p><b>Frase:</b> Hello, my name is Carlos = Olá, meu nome é Carlos</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Carlos'",
        "opts": [
          "Até logo",
          "Boa noite",
          "Bom dia",
          "Olá, meu nome é Carlos"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Quantos anos",
          "Como vai",
          "Onde mora",
          "Meu nome é"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Carlos'",
        "opts": [
          "name",
          "big",
          "bad",
          "good"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Carlos'?",
        "opts": [
          "Ao se apresentar",
          "Ao dirigir",
          "Ao comer",
          "Ao dormir"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Thanks",
          "Goodbye",
          "Hello",
          "Please"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "Thank you",
          "Goodbye",
          "My name is Carlos",
          "I am fine"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Como vai?",
          "Onde mora?",
          "Quantos anos?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Carlos'?",
        "opts": [
          "Carlos",
          "Trabalho",
          "Casa",
          "Carro"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Carlos'",
        "opts": [
          "is",
          "am",
          "be",
          "are"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Carlos'",
        "opts": [
          "Is my name Carlos",
          "Carlos is my name",
          "My name is Carlos",
          "My Carlos is name"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Carlos'",
        "opts": [
          "Boa noite",
          "Prazer em conhecer você, Carlos",
          "Até logo",
          "Bom dia"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Carlos' significa:",
        "opts": [
          "Olá, meu nome é Carlos",
          "Meu nome não é",
          "Qual seu nome?",
          "Onde mora?"
        ],
        "ans": 0,
        "type": "translation"
      }
    ]
  },
  {
    "id": 179,
    "module": 4,
    "moduleName": "Trabalho e Vida",
    "level": "B1",
    "title": "Direções simples",
    "desc": "Aprenda direções simples - tradução correta Sofia=Sofia",
    "time": "8 MIN",
    "phrase": "Hello, my name is Sofia",
    "translation": "Olá, meu nome é Sofia",
    "vocab": [
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Direções simples</h4><p><b>Frase:</b> Hello, my name is Sofia = Olá, meu nome é Sofia</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Sofia'",
        "opts": [
          "Bom dia",
          "Até logo",
          "Olá, meu nome é Sofia",
          "Boa noite"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Meu nome é",
          "Como vai",
          "Quantos anos",
          "Onde mora"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Sofia'",
        "opts": [
          "good",
          "bad",
          "name",
          "big"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Sofia'?",
        "opts": [
          "Ao comer",
          "Ao dormir",
          "Ao dirigir",
          "Ao se apresentar"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Goodbye",
          "Thanks",
          "Hello",
          "Please"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "Thank you",
          "I am fine",
          "My name is Sofia",
          "Goodbye"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Onde mora?",
          "Como vai?",
          "Qual é seu nome?",
          "Quantos anos?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Sofia'?",
        "opts": [
          "Sofia",
          "Carro",
          "Casa",
          "Trabalho"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Sofia'",
        "opts": [
          "is",
          "are",
          "am",
          "be"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Sofia'",
        "opts": [
          "Is my name Sofia",
          "My name is Sofia",
          "Sofia is my name",
          "My Sofia is name"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Sofia'",
        "opts": [
          "Prazer em conhecer você, Sofia",
          "Boa noite",
          "Bom dia",
          "Até logo"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Sofia' significa:",
        "opts": [
          "Olá, meu nome é Sofia",
          "Onde mora?",
          "Meu nome não é",
          "Qual seu nome?"
        ],
        "ans": 0,
        "type": "translation"
      }
    ]
  },
  {
    "id": 180,
    "module": 4,
    "moduleName": "Trabalho e Vida",
    "level": "B1",
    "title": "Preços e dinheiro",
    "desc": "Aprenda preços e dinheiro - tradução correta Julia=Julia",
    "time": "9 MIN",
    "phrase": "Hello, my name is Julia",
    "translation": "Olá, meu nome é Julia",
    "vocab": [
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Preços e dinheiro</h4><p><b>Frase:</b> Hello, my name is Julia = Olá, meu nome é Julia</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Julia'",
        "opts": [
          "Olá, meu nome é Julia",
          "Até logo",
          "Boa noite",
          "Bom dia"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Quantos anos",
          "Meu nome é",
          "Onde mora",
          "Como vai"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Julia'",
        "opts": [
          "good",
          "bad",
          "name",
          "big"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Julia'?",
        "opts": [
          "Ao comer",
          "Ao dirigir",
          "Ao se apresentar",
          "Ao dormir"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Thanks",
          "Please",
          "Hello",
          "Goodbye"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "Thank you",
          "I am fine",
          "Goodbye",
          "My name is Julia"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Como vai?",
          "Quantos anos?",
          "Onde mora?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Julia'?",
        "opts": [
          "Carro",
          "Julia",
          "Trabalho",
          "Casa"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Julia'",
        "opts": [
          "am",
          "are",
          "be",
          "is"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Julia'",
        "opts": [
          "My name is Julia",
          "Is my name Julia",
          "Julia is my name",
          "My Julia is name"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Julia'",
        "opts": [
          "Prazer em conhecer você, Julia",
          "Bom dia",
          "Até logo",
          "Boa noite"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Julia' significa:",
        "opts": [
          "Olá, meu nome é Julia",
          "Onde mora?",
          "Meu nome não é",
          "Qual seu nome?"
        ],
        "ans": 0,
        "type": "translation"
      }
    ]
  },
  {
    "id": 181,
    "module": 5,
    "moduleName": "Inglês Profissional",
    "level": "B2",
    "title": "Roupas",
    "desc": "Aprenda roupas - tradução correta Sofia=Sofia",
    "time": "10 MIN",
    "phrase": "Hello, my name is Sofia",
    "translation": "Olá, meu nome é Sofia",
    "vocab": [
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Roupas</h4><p><b>Frase:</b> Hello, my name is Sofia = Olá, meu nome é Sofia</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Sofia'",
        "opts": [
          "Até logo",
          "Boa noite",
          "Olá, meu nome é Sofia",
          "Bom dia"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Meu nome é",
          "Quantos anos",
          "Onde mora",
          "Como vai"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Sofia'",
        "opts": [
          "bad",
          "good",
          "name",
          "big"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Sofia'?",
        "opts": [
          "Ao dirigir",
          "Ao dormir",
          "Ao se apresentar",
          "Ao comer"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Hello",
          "Goodbye",
          "Thanks",
          "Please"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "Goodbye",
          "I am fine",
          "Thank you",
          "My name is Sofia"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Onde mora?",
          "Como vai?",
          "Quantos anos?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Sofia'?",
        "opts": [
          "Sofia",
          "Casa",
          "Carro",
          "Trabalho"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Sofia'",
        "opts": [
          "are",
          "be",
          "am",
          "is"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Sofia'",
        "opts": [
          "My name is Sofia",
          "Sofia is my name",
          "My Sofia is name",
          "Is my name Sofia"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Sofia'",
        "opts": [
          "Boa noite",
          "Até logo",
          "Bom dia",
          "Prazer em conhecer você, Sofia"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Sofia' significa:",
        "opts": [
          "Qual seu nome?",
          "Olá, meu nome é Sofia",
          "Onde mora?",
          "Meu nome não é"
        ],
        "ans": 1,
        "type": "translation"
      }
    ]
  },
  {
    "id": 182,
    "module": 5,
    "moduleName": "Inglês Profissional",
    "level": "B2",
    "title": "Saúde básica",
    "desc": "Aprenda saúde básica - tradução correta Lucas=Lucas",
    "time": "11 MIN",
    "phrase": "Hello, my name is Lucas",
    "translation": "Olá, meu nome é Lucas",
    "vocab": [
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Saúde básica</h4><p><b>Frase:</b> Hello, my name is Lucas = Olá, meu nome é Lucas</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Lucas'",
        "opts": [
          "Até logo",
          "Olá, meu nome é Lucas",
          "Bom dia",
          "Boa noite"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Quantos anos",
          "Meu nome é",
          "Onde mora",
          "Como vai"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Lucas'",
        "opts": [
          "big",
          "good",
          "name",
          "bad"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Lucas'?",
        "opts": [
          "Ao se apresentar",
          "Ao dirigir",
          "Ao dormir",
          "Ao comer"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Thanks",
          "Please",
          "Goodbye",
          "Hello"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "I am fine",
          "Goodbye",
          "My name is Lucas",
          "Thank you"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Como vai?",
          "Onde mora?",
          "Qual é seu nome?",
          "Quantos anos?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Lucas'?",
        "opts": [
          "Trabalho",
          "Casa",
          "Carro",
          "Lucas"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Lucas'",
        "opts": [
          "am",
          "are",
          "is",
          "be"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Lucas'",
        "opts": [
          "My Lucas is name",
          "Lucas is my name",
          "My name is Lucas",
          "Is my name Lucas"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Lucas'",
        "opts": [
          "Até logo",
          "Boa noite",
          "Bom dia",
          "Prazer em conhecer você, Lucas"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Lucas' significa:",
        "opts": [
          "Meu nome não é",
          "Qual seu nome?",
          "Olá, meu nome é Lucas",
          "Onde mora?"
        ],
        "ans": 2,
        "type": "translation"
      }
    ]
  },
  {
    "id": 183,
    "module": 5,
    "moduleName": "Inglês Profissional",
    "level": "B2",
    "title": "Emoções",
    "desc": "Aprenda emoções - tradução correta Carlos=Carlos",
    "time": "12 MIN",
    "phrase": "Hello, my name is Carlos",
    "translation": "Olá, meu nome é Carlos",
    "vocab": [
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Emoções</h4><p><b>Frase:</b> Hello, my name is Carlos = Olá, meu nome é Carlos</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Carlos'",
        "opts": [
          "Boa noite",
          "Olá, meu nome é Carlos",
          "Bom dia",
          "Até logo"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Onde mora",
          "Quantos anos",
          "Meu nome é",
          "Como vai"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Carlos'",
        "opts": [
          "name",
          "bad",
          "good",
          "big"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Carlos'?",
        "opts": [
          "Ao dirigir",
          "Ao dormir",
          "Ao comer",
          "Ao se apresentar"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Thanks",
          "Hello",
          "Goodbye",
          "Please"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "Goodbye",
          "I am fine",
          "Thank you",
          "My name is Carlos"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Quantos anos?",
          "Como vai?",
          "Qual é seu nome?",
          "Onde mora?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Carlos'?",
        "opts": [
          "Casa",
          "Carlos",
          "Carro",
          "Trabalho"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Carlos'",
        "opts": [
          "are",
          "am",
          "is",
          "be"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Carlos'",
        "opts": [
          "My name is Carlos",
          "Carlos is my name",
          "My Carlos is name",
          "Is my name Carlos"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Carlos'",
        "opts": [
          "Prazer em conhecer você, Carlos",
          "Até logo",
          "Boa noite",
          "Bom dia"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Carlos' significa:",
        "opts": [
          "Onde mora?",
          "Qual seu nome?",
          "Olá, meu nome é Carlos",
          "Meu nome não é"
        ],
        "ans": 2,
        "type": "translation"
      }
    ]
  },
  {
    "id": 184,
    "module": 5,
    "moduleName": "Inglês Profissional",
    "level": "B2",
    "title": "Convites",
    "desc": "Aprenda convites - tradução correta Carlos=Carlos",
    "time": "13 MIN",
    "phrase": "Hello, my name is Carlos",
    "translation": "Olá, meu nome é Carlos",
    "vocab": [
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Convites</h4><p><b>Frase:</b> Hello, my name is Carlos = Olá, meu nome é Carlos</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Carlos'",
        "opts": [
          "Bom dia",
          "Olá, meu nome é Carlos",
          "Até logo",
          "Boa noite"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Meu nome é",
          "Onde mora",
          "Como vai",
          "Quantos anos"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Carlos'",
        "opts": [
          "big",
          "bad",
          "good",
          "name"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Carlos'?",
        "opts": [
          "Ao dormir",
          "Ao se apresentar",
          "Ao comer",
          "Ao dirigir"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Please",
          "Hello",
          "Thanks",
          "Goodbye"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "Thank you",
          "My name is Carlos",
          "Goodbye",
          "I am fine"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Onde mora?",
          "Qual é seu nome?",
          "Quantos anos?",
          "Como vai?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Carlos'?",
        "opts": [
          "Casa",
          "Trabalho",
          "Carro",
          "Carlos"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Carlos'",
        "opts": [
          "be",
          "are",
          "is",
          "am"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Carlos'",
        "opts": [
          "My Carlos is name",
          "Is my name Carlos",
          "My name is Carlos",
          "Carlos is my name"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Carlos'",
        "opts": [
          "Até logo",
          "Prazer em conhecer você, Carlos",
          "Boa noite",
          "Bom dia"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Carlos' significa:",
        "opts": [
          "Meu nome não é",
          "Onde mora?",
          "Qual seu nome?",
          "Olá, meu nome é Carlos"
        ],
        "ans": 3,
        "type": "translation"
      }
    ]
  },
  {
    "id": 185,
    "module": 5,
    "moduleName": "Inglês Profissional",
    "level": "B2",
    "title": "Telefone",
    "desc": "Aprenda telefone - tradução correta Sarah=Sarah",
    "time": "6 MIN",
    "phrase": "Hello, my name is Sarah",
    "translation": "Olá, meu nome é Sarah",
    "vocab": [
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Telefone</h4><p><b>Frase:</b> Hello, my name is Sarah = Olá, meu nome é Sarah</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Sarah'",
        "opts": [
          "Olá, meu nome é Sarah",
          "Até logo",
          "Bom dia",
          "Boa noite"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Como vai",
          "Meu nome é",
          "Quantos anos",
          "Onde mora"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Sarah'",
        "opts": [
          "name",
          "big",
          "good",
          "bad"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Sarah'?",
        "opts": [
          "Ao dirigir",
          "Ao se apresentar",
          "Ao dormir",
          "Ao comer"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Please",
          "Thanks",
          "Hello",
          "Goodbye"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "My name is Sarah",
          "I am fine",
          "Thank you",
          "Goodbye"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Como vai?",
          "Onde mora?",
          "Qual é seu nome?",
          "Quantos anos?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Sarah'?",
        "opts": [
          "Sarah",
          "Casa",
          "Carro",
          "Trabalho"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Sarah'",
        "opts": [
          "am",
          "be",
          "is",
          "are"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Sarah'",
        "opts": [
          "My name is Sarah",
          "Is my name Sarah",
          "Sarah is my name",
          "My Sarah is name"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Sarah'",
        "opts": [
          "Prazer em conhecer você, Sarah",
          "Até logo",
          "Boa noite",
          "Bom dia"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Sarah' significa:",
        "opts": [
          "Olá, meu nome é Sarah",
          "Onde mora?",
          "Qual seu nome?",
          "Meu nome não é"
        ],
        "ans": 0,
        "type": "translation"
      }
    ]
  },
  {
    "id": 186,
    "module": 5,
    "moduleName": "Inglês Profissional",
    "level": "B2",
    "title": "Email e contato",
    "desc": "Aprenda email e contato - tradução correta Lucas=Lucas",
    "time": "7 MIN",
    "phrase": "Hello, my name is Lucas",
    "translation": "Olá, meu nome é Lucas",
    "vocab": [
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Email e contato</h4><p><b>Frase:</b> Hello, my name is Lucas = Olá, meu nome é Lucas</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Lucas'",
        "opts": [
          "Olá, meu nome é Lucas",
          "Até logo",
          "Boa noite",
          "Bom dia"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Como vai",
          "Quantos anos",
          "Meu nome é",
          "Onde mora"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Lucas'",
        "opts": [
          "bad",
          "good",
          "big",
          "name"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Lucas'?",
        "opts": [
          "Ao comer",
          "Ao dirigir",
          "Ao dormir",
          "Ao se apresentar"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Hello",
          "Goodbye",
          "Please",
          "Thanks"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "Thank you",
          "Goodbye",
          "My name is Lucas",
          "I am fine"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Como vai?",
          "Quantos anos?",
          "Qual é seu nome?",
          "Onde mora?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Lucas'?",
        "opts": [
          "Lucas",
          "Trabalho",
          "Carro",
          "Casa"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Lucas'",
        "opts": [
          "be",
          "are",
          "is",
          "am"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Lucas'",
        "opts": [
          "My name is Lucas",
          "My Lucas is name",
          "Lucas is my name",
          "Is my name Lucas"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Lucas'",
        "opts": [
          "Até logo",
          "Bom dia",
          "Prazer em conhecer você, Lucas",
          "Boa noite"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Lucas' significa:",
        "opts": [
          "Qual seu nome?",
          "Olá, meu nome é Lucas",
          "Onde mora?",
          "Meu nome não é"
        ],
        "ans": 1,
        "type": "translation"
      }
    ]
  },
  {
    "id": 187,
    "module": 5,
    "moduleName": "Inglês Profissional",
    "level": "B2",
    "title": "Planos futuros",
    "desc": "Aprenda planos futuros - tradução correta Pedro=Pedro",
    "time": "8 MIN",
    "phrase": "Hello, my name is Pedro",
    "translation": "Olá, meu nome é Pedro",
    "vocab": [
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Planos futuros</h4><p><b>Frase:</b> Hello, my name is Pedro = Olá, meu nome é Pedro</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Pedro'",
        "opts": [
          "Olá, meu nome é Pedro",
          "Até logo",
          "Boa noite",
          "Bom dia"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Quantos anos",
          "Meu nome é",
          "Onde mora",
          "Como vai"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Pedro'",
        "opts": [
          "name",
          "good",
          "big",
          "bad"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Pedro'?",
        "opts": [
          "Ao dirigir",
          "Ao se apresentar",
          "Ao comer",
          "Ao dormir"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Hello",
          "Thanks",
          "Please",
          "Goodbye"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "I am fine",
          "My name is Pedro",
          "Goodbye",
          "Thank you"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Quantos anos?",
          "Qual é seu nome?",
          "Onde mora?",
          "Como vai?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Pedro'?",
        "opts": [
          "Casa",
          "Carro",
          "Trabalho",
          "Pedro"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Pedro'",
        "opts": [
          "am",
          "be",
          "are",
          "is"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Pedro'",
        "opts": [
          "Pedro is my name",
          "Is my name Pedro",
          "My Pedro is name",
          "My name is Pedro"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Pedro'",
        "opts": [
          "Prazer em conhecer você, Pedro",
          "Boa noite",
          "Bom dia",
          "Até logo"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Pedro' significa:",
        "opts": [
          "Onde mora?",
          "Olá, meu nome é Pedro",
          "Qual seu nome?",
          "Meu nome não é"
        ],
        "ans": 1,
        "type": "translation"
      }
    ]
  },
  {
    "id": 188,
    "module": 5,
    "moduleName": "Inglês Profissional",
    "level": "B2",
    "title": "Passado simples",
    "desc": "Aprenda passado simples - tradução correta John=John",
    "time": "9 MIN",
    "phrase": "Hello, my name is John",
    "translation": "Olá, meu nome é John",
    "vocab": [
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Passado simples</h4><p><b>Frase:</b> Hello, my name is John = Olá, meu nome é John</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is John'",
        "opts": [
          "Boa noite",
          "Bom dia",
          "Olá, meu nome é John",
          "Até logo"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Meu nome é",
          "Onde mora",
          "Como vai",
          "Quantos anos"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is John'",
        "opts": [
          "big",
          "good",
          "name",
          "bad"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is John'?",
        "opts": [
          "Ao dormir",
          "Ao se apresentar",
          "Ao dirigir",
          "Ao comer"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Please",
          "Hello",
          "Thanks",
          "Goodbye"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "Goodbye",
          "I am fine",
          "Thank you",
          "My name is John"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Quantos anos?",
          "Qual é seu nome?",
          "Como vai?",
          "Onde mora?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is John'?",
        "opts": [
          "Trabalho",
          "Casa",
          "Carro",
          "John"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ John'",
        "opts": [
          "are",
          "be",
          "is",
          "am"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / John'",
        "opts": [
          "My John is name",
          "John is my name",
          "My name is John",
          "Is my name John"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, John'",
        "opts": [
          "Bom dia",
          "Prazer em conhecer você, John",
          "Até logo",
          "Boa noite"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is John' significa:",
        "opts": [
          "Qual seu nome?",
          "Onde mora?",
          "Meu nome não é",
          "Olá, meu nome é John"
        ],
        "ans": 3,
        "type": "translation"
      }
    ]
  },
  {
    "id": 189,
    "module": 5,
    "moduleName": "Inglês Profissional",
    "level": "B2",
    "title": "Experiências",
    "desc": "Aprenda experiências - tradução correta Sofia=Sofia",
    "time": "10 MIN",
    "phrase": "Hello, my name is Sofia",
    "translation": "Olá, meu nome é Sofia",
    "vocab": [
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Experiências</h4><p><b>Frase:</b> Hello, my name is Sofia = Olá, meu nome é Sofia</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Sofia'",
        "opts": [
          "Até logo",
          "Boa noite",
          "Olá, meu nome é Sofia",
          "Bom dia"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Quantos anos",
          "Onde mora",
          "Meu nome é",
          "Como vai"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Sofia'",
        "opts": [
          "good",
          "name",
          "big",
          "bad"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Sofia'?",
        "opts": [
          "Ao dormir",
          "Ao comer",
          "Ao se apresentar",
          "Ao dirigir"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Goodbye",
          "Thanks",
          "Hello",
          "Please"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "Goodbye",
          "Thank you",
          "I am fine",
          "My name is Sofia"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Como vai?",
          "Qual é seu nome?",
          "Quantos anos?",
          "Onde mora?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Sofia'?",
        "opts": [
          "Casa",
          "Trabalho",
          "Sofia",
          "Carro"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Sofia'",
        "opts": [
          "is",
          "be",
          "are",
          "am"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Sofia'",
        "opts": [
          "Is my name Sofia",
          "My Sofia is name",
          "Sofia is my name",
          "My name is Sofia"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Sofia'",
        "opts": [
          "Boa noite",
          "Prazer em conhecer você, Sofia",
          "Bom dia",
          "Até logo"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Sofia' significa:",
        "opts": [
          "Olá, meu nome é Sofia",
          "Meu nome não é",
          "Onde mora?",
          "Qual seu nome?"
        ],
        "ans": 0,
        "type": "translation"
      }
    ]
  },
  {
    "id": 190,
    "module": 5,
    "moduleName": "Inglês Profissional",
    "level": "B2",
    "title": "Preferências",
    "desc": "Aprenda preferências - tradução correta Carlos=Carlos",
    "time": "11 MIN",
    "phrase": "Hello, my name is Carlos",
    "translation": "Olá, meu nome é Carlos",
    "vocab": [
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Preferências</h4><p><b>Frase:</b> Hello, my name is Carlos = Olá, meu nome é Carlos</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Carlos'",
        "opts": [
          "Olá, meu nome é Carlos",
          "Bom dia",
          "Boa noite",
          "Até logo"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Onde mora",
          "Quantos anos",
          "Meu nome é",
          "Como vai"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Carlos'",
        "opts": [
          "big",
          "good",
          "bad",
          "name"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Carlos'?",
        "opts": [
          "Ao dormir",
          "Ao dirigir",
          "Ao se apresentar",
          "Ao comer"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Thanks",
          "Goodbye",
          "Please",
          "Hello"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "My name is Carlos",
          "Thank you",
          "I am fine",
          "Goodbye"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Como vai?",
          "Onde mora?",
          "Qual é seu nome?",
          "Quantos anos?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Carlos'?",
        "opts": [
          "Casa",
          "Carlos",
          "Trabalho",
          "Carro"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Carlos'",
        "opts": [
          "are",
          "be",
          "is",
          "am"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Carlos'",
        "opts": [
          "Carlos is my name",
          "My Carlos is name",
          "Is my name Carlos",
          "My name is Carlos"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Carlos'",
        "opts": [
          "Prazer em conhecer você, Carlos",
          "Até logo",
          "Boa noite",
          "Bom dia"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Carlos' significa:",
        "opts": [
          "Olá, meu nome é Carlos",
          "Qual seu nome?",
          "Onde mora?",
          "Meu nome não é"
        ],
        "ans": 0,
        "type": "translation"
      }
    ]
  },
  {
    "id": 191,
    "module": 5,
    "moduleName": "Inglês Profissional",
    "level": "B2",
    "title": "Opiniões simples",
    "desc": "Aprenda opiniões simples - tradução correta Pedro=Pedro",
    "time": "12 MIN",
    "phrase": "Hello, my name is Pedro",
    "translation": "Olá, meu nome é Pedro",
    "vocab": [
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Opiniões simples</h4><p><b>Frase:</b> Hello, my name is Pedro = Olá, meu nome é Pedro</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Pedro'",
        "opts": [
          "Olá, meu nome é Pedro",
          "Até logo",
          "Boa noite",
          "Bom dia"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Onde mora",
          "Quantos anos",
          "Meu nome é",
          "Como vai"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Pedro'",
        "opts": [
          "name",
          "big",
          "good",
          "bad"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Pedro'?",
        "opts": [
          "Ao dirigir",
          "Ao se apresentar",
          "Ao comer",
          "Ao dormir"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Goodbye",
          "Hello",
          "Thanks",
          "Please"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "My name is Pedro",
          "Goodbye",
          "I am fine",
          "Thank you"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Qual é seu nome?",
          "Quantos anos?",
          "Onde mora?",
          "Como vai?"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Pedro'?",
        "opts": [
          "Casa",
          "Trabalho",
          "Carro",
          "Pedro"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Pedro'",
        "opts": [
          "is",
          "be",
          "are",
          "am"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Pedro'",
        "opts": [
          "My name is Pedro",
          "Is my name Pedro",
          "My Pedro is name",
          "Pedro is my name"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Pedro'",
        "opts": [
          "Bom dia",
          "Até logo",
          "Prazer em conhecer você, Pedro",
          "Boa noite"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Pedro' significa:",
        "opts": [
          "Meu nome não é",
          "Onde mora?",
          "Qual seu nome?",
          "Olá, meu nome é Pedro"
        ],
        "ans": 3,
        "type": "translation"
      }
    ]
  },
  {
    "id": 192,
    "module": 5,
    "moduleName": "Inglês Profissional",
    "level": "B2",
    "title": "Comparações",
    "desc": "Aprenda comparações - tradução correta Miguel=Miguel",
    "time": "13 MIN",
    "phrase": "Hello, my name is Miguel",
    "translation": "Olá, meu nome é Miguel",
    "vocab": [
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Comparações</h4><p><b>Frase:</b> Hello, my name is Miguel = Olá, meu nome é Miguel</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Miguel'",
        "opts": [
          "Olá, meu nome é Miguel",
          "Boa noite",
          "Bom dia",
          "Até logo"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Onde mora",
          "Quantos anos",
          "Como vai",
          "Meu nome é"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Miguel'",
        "opts": [
          "name",
          "big",
          "good",
          "bad"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Miguel'?",
        "opts": [
          "Ao dirigir",
          "Ao comer",
          "Ao se apresentar",
          "Ao dormir"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Goodbye",
          "Hello",
          "Please",
          "Thanks"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "I am fine",
          "Thank you",
          "Goodbye",
          "My name is Miguel"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Qual é seu nome?",
          "Quantos anos?",
          "Onde mora?",
          "Como vai?"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Miguel'?",
        "opts": [
          "Carro",
          "Trabalho",
          "Casa",
          "Miguel"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Miguel'",
        "opts": [
          "am",
          "be",
          "is",
          "are"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Miguel'",
        "opts": [
          "Is my name Miguel",
          "My name is Miguel",
          "Miguel is my name",
          "My Miguel is name"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Miguel'",
        "opts": [
          "Até logo",
          "Boa noite",
          "Bom dia",
          "Prazer em conhecer você, Miguel"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Miguel' significa:",
        "opts": [
          "Meu nome não é",
          "Qual seu nome?",
          "Olá, meu nome é Miguel",
          "Onde mora?"
        ],
        "ans": 2,
        "type": "translation"
      }
    ]
  },
  {
    "id": 193,
    "module": 5,
    "moduleName": "Inglês Profissional",
    "level": "B2",
    "title": "Conselhos",
    "desc": "Aprenda conselhos - tradução correta Lucas=Lucas",
    "time": "6 MIN",
    "phrase": "Hello, my name is Lucas",
    "translation": "Olá, meu nome é Lucas",
    "vocab": [
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Conselhos</h4><p><b>Frase:</b> Hello, my name is Lucas = Olá, meu nome é Lucas</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Lucas'",
        "opts": [
          "Bom dia",
          "Até logo",
          "Boa noite",
          "Olá, meu nome é Lucas"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Onde mora",
          "Meu nome é",
          "Como vai",
          "Quantos anos"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Lucas'",
        "opts": [
          "name",
          "big",
          "bad",
          "good"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Lucas'?",
        "opts": [
          "Ao comer",
          "Ao dormir",
          "Ao dirigir",
          "Ao se apresentar"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Goodbye",
          "Thanks",
          "Please",
          "Hello"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "I am fine",
          "Goodbye",
          "My name is Lucas",
          "Thank you"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Como vai?",
          "Qual é seu nome?",
          "Quantos anos?",
          "Onde mora?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Lucas'?",
        "opts": [
          "Lucas",
          "Trabalho",
          "Carro",
          "Casa"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Lucas'",
        "opts": [
          "be",
          "is",
          "are",
          "am"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Lucas'",
        "opts": [
          "My Lucas is name",
          "Is my name Lucas",
          "My name is Lucas",
          "Lucas is my name"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Lucas'",
        "opts": [
          "Prazer em conhecer você, Lucas",
          "Até logo",
          "Bom dia",
          "Boa noite"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Lucas' significa:",
        "opts": [
          "Olá, meu nome é Lucas",
          "Qual seu nome?",
          "Meu nome não é",
          "Onde mora?"
        ],
        "ans": 0,
        "type": "translation"
      }
    ]
  },
  {
    "id": 194,
    "module": 5,
    "moduleName": "Inglês Profissional",
    "level": "B2",
    "title": "Convite para café",
    "desc": "Aprenda convite para café - tradução correta Carlos=Carlos",
    "time": "7 MIN",
    "phrase": "Hello, my name is Carlos",
    "translation": "Olá, meu nome é Carlos",
    "vocab": [
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Convite para café</h4><p><b>Frase:</b> Hello, my name is Carlos = Olá, meu nome é Carlos</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Carlos'",
        "opts": [
          "Até logo",
          "Boa noite",
          "Bom dia",
          "Olá, meu nome é Carlos"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Meu nome é",
          "Quantos anos",
          "Como vai",
          "Onde mora"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Carlos'",
        "opts": [
          "good",
          "bad",
          "big",
          "name"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Carlos'?",
        "opts": [
          "Ao comer",
          "Ao dormir",
          "Ao se apresentar",
          "Ao dirigir"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Goodbye",
          "Hello",
          "Thanks",
          "Please"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "My name is Carlos",
          "I am fine",
          "Goodbye",
          "Thank you"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Qual é seu nome?",
          "Quantos anos?",
          "Como vai?",
          "Onde mora?"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Carlos'?",
        "opts": [
          "Trabalho",
          "Carro",
          "Casa",
          "Carlos"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Carlos'",
        "opts": [
          "are",
          "is",
          "be",
          "am"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Carlos'",
        "opts": [
          "My Carlos is name",
          "Carlos is my name",
          "Is my name Carlos",
          "My name is Carlos"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Carlos'",
        "opts": [
          "Até logo",
          "Bom dia",
          "Prazer em conhecer você, Carlos",
          "Boa noite"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Carlos' significa:",
        "opts": [
          "Onde mora?",
          "Olá, meu nome é Carlos",
          "Meu nome não é",
          "Qual seu nome?"
        ],
        "ans": 1,
        "type": "translation"
      }
    ]
  },
  {
    "id": 195,
    "module": 5,
    "moduleName": "Inglês Profissional",
    "level": "B2",
    "title": "Conhecendo vizinhos",
    "desc": "Aprenda conhecendo vizinhos - tradução correta John=John",
    "time": "8 MIN",
    "phrase": "Hello, my name is John",
    "translation": "Olá, meu nome é John",
    "vocab": [
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Conhecendo vizinhos</h4><p><b>Frase:</b> Hello, my name is John = Olá, meu nome é John</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is John'",
        "opts": [
          "Boa noite",
          "Bom dia",
          "Até logo",
          "Olá, meu nome é John"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Meu nome é",
          "Como vai",
          "Quantos anos",
          "Onde mora"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is John'",
        "opts": [
          "bad",
          "big",
          "name",
          "good"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is John'?",
        "opts": [
          "Ao dirigir",
          "Ao comer",
          "Ao se apresentar",
          "Ao dormir"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Please",
          "Goodbye",
          "Thanks",
          "Hello"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "I am fine",
          "Goodbye",
          "My name is John",
          "Thank you"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Qual é seu nome?",
          "Quantos anos?",
          "Onde mora?",
          "Como vai?"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is John'?",
        "opts": [
          "John",
          "Carro",
          "Casa",
          "Trabalho"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ John'",
        "opts": [
          "is",
          "are",
          "am",
          "be"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / John'",
        "opts": [
          "My John is name",
          "John is my name",
          "Is my name John",
          "My name is John"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, John'",
        "opts": [
          "Bom dia",
          "Até logo",
          "Boa noite",
          "Prazer em conhecer você, John"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is John' significa:",
        "opts": [
          "Onde mora?",
          "Meu nome não é",
          "Olá, meu nome é John",
          "Qual seu nome?"
        ],
        "ans": 2,
        "type": "translation"
      }
    ]
  },
  {
    "id": 196,
    "module": 6,
    "moduleName": "Domínio da Fluência",
    "level": "B2",
    "title": "Festa e celebração",
    "desc": "Aprenda festa e celebração - tradução correta John=John",
    "time": "9 MIN",
    "phrase": "Hello, my name is John",
    "translation": "Olá, meu nome é John",
    "vocab": [
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Festa e celebração</h4><p><b>Frase:</b> Hello, my name is John = Olá, meu nome é John</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is John'",
        "opts": [
          "Bom dia",
          "Até logo",
          "Boa noite",
          "Olá, meu nome é John"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Meu nome é",
          "Como vai",
          "Quantos anos",
          "Onde mora"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is John'",
        "opts": [
          "big",
          "bad",
          "name",
          "good"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is John'?",
        "opts": [
          "Ao se apresentar",
          "Ao comer",
          "Ao dormir",
          "Ao dirigir"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Hello",
          "Thanks",
          "Please",
          "Goodbye"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "I am fine",
          "Thank you",
          "Goodbye",
          "My name is John"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Quantos anos?",
          "Onde mora?",
          "Como vai?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is John'?",
        "opts": [
          "Carro",
          "John",
          "Trabalho",
          "Casa"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ John'",
        "opts": [
          "is",
          "are",
          "am",
          "be"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / John'",
        "opts": [
          "Is my name John",
          "John is my name",
          "My John is name",
          "My name is John"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, John'",
        "opts": [
          "Boa noite",
          "Até logo",
          "Bom dia",
          "Prazer em conhecer você, John"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is John' significa:",
        "opts": [
          "Onde mora?",
          "Olá, meu nome é John",
          "Qual seu nome?",
          "Meu nome não é"
        ],
        "ans": 1,
        "type": "translation"
      }
    ]
  },
  {
    "id": 197,
    "module": 6,
    "moduleName": "Domínio da Fluência",
    "level": "B2",
    "title": "Filmes e música",
    "desc": "Aprenda filmes e música - tradução correta Sofia=Sofia",
    "time": "10 MIN",
    "phrase": "Hello, my name is Sofia",
    "translation": "Olá, meu nome é Sofia",
    "vocab": [
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Filmes e música</h4><p><b>Frase:</b> Hello, my name is Sofia = Olá, meu nome é Sofia</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Sofia'",
        "opts": [
          "Olá, meu nome é Sofia",
          "Bom dia",
          "Até logo",
          "Boa noite"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Meu nome é",
          "Onde mora",
          "Como vai",
          "Quantos anos"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Sofia'",
        "opts": [
          "big",
          "bad",
          "good",
          "name"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Sofia'?",
        "opts": [
          "Ao dormir",
          "Ao dirigir",
          "Ao comer",
          "Ao se apresentar"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Hello",
          "Please",
          "Goodbye",
          "Thanks"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "Thank you",
          "I am fine",
          "Goodbye",
          "My name is Sofia"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Quantos anos?",
          "Onde mora?",
          "Como vai?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Sofia'?",
        "opts": [
          "Casa",
          "Sofia",
          "Carro",
          "Trabalho"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Sofia'",
        "opts": [
          "be",
          "am",
          "are",
          "is"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Sofia'",
        "opts": [
          "My name is Sofia",
          "Is my name Sofia",
          "Sofia is my name",
          "My Sofia is name"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Sofia'",
        "opts": [
          "Bom dia",
          "Até logo",
          "Boa noite",
          "Prazer em conhecer você, Sofia"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Sofia' significa:",
        "opts": [
          "Meu nome não é",
          "Qual seu nome?",
          "Onde mora?",
          "Olá, meu nome é Sofia"
        ],
        "ans": 3,
        "type": "translation"
      }
    ]
  },
  {
    "id": 198,
    "module": 6,
    "moduleName": "Domínio da Fluência",
    "level": "B2",
    "title": "Esportes",
    "desc": "Aprenda esportes - tradução correta Pedro=Pedro",
    "time": "11 MIN",
    "phrase": "Hello, my name is Pedro",
    "translation": "Olá, meu nome é Pedro",
    "vocab": [
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Esportes</h4><p><b>Frase:</b> Hello, my name is Pedro = Olá, meu nome é Pedro</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Pedro'",
        "opts": [
          "Bom dia",
          "Até logo",
          "Olá, meu nome é Pedro",
          "Boa noite"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Como vai",
          "Meu nome é",
          "Onde mora",
          "Quantos anos"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Pedro'",
        "opts": [
          "good",
          "name",
          "bad",
          "big"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Pedro'?",
        "opts": [
          "Ao se apresentar",
          "Ao dormir",
          "Ao dirigir",
          "Ao comer"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Thanks",
          "Hello",
          "Please",
          "Goodbye"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "My name is Pedro",
          "Thank you",
          "I am fine",
          "Goodbye"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Quantos anos?",
          "Qual é seu nome?",
          "Onde mora?",
          "Como vai?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Pedro'?",
        "opts": [
          "Pedro",
          "Trabalho",
          "Casa",
          "Carro"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Pedro'",
        "opts": [
          "are",
          "be",
          "is",
          "am"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Pedro'",
        "opts": [
          "Is my name Pedro",
          "My name is Pedro",
          "My Pedro is name",
          "Pedro is my name"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Pedro'",
        "opts": [
          "Bom dia",
          "Prazer em conhecer você, Pedro",
          "Boa noite",
          "Até logo"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Pedro' significa:",
        "opts": [
          "Onde mora?",
          "Qual seu nome?",
          "Olá, meu nome é Pedro",
          "Meu nome não é"
        ],
        "ans": 2,
        "type": "translation"
      }
    ]
  },
  {
    "id": 199,
    "module": 6,
    "moduleName": "Domínio da Fluência",
    "level": "B2",
    "title": "Viagem curta",
    "desc": "Aprenda viagem curta - tradução correta Lucas=Lucas",
    "time": "12 MIN",
    "phrase": "Hello, my name is Lucas",
    "translation": "Olá, meu nome é Lucas",
    "vocab": [
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Viagem curta</h4><p><b>Frase:</b> Hello, my name is Lucas = Olá, meu nome é Lucas</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Lucas'",
        "opts": [
          "Até logo",
          "Olá, meu nome é Lucas",
          "Bom dia",
          "Boa noite"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Como vai",
          "Meu nome é",
          "Quantos anos",
          "Onde mora"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Lucas'",
        "opts": [
          "bad",
          "big",
          "good",
          "name"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Lucas'?",
        "opts": [
          "Ao dormir",
          "Ao comer",
          "Ao se apresentar",
          "Ao dirigir"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Thanks",
          "Goodbye",
          "Please",
          "Hello"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "Goodbye",
          "I am fine",
          "Thank you",
          "My name is Lucas"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Qual é seu nome?",
          "Onde mora?",
          "Como vai?",
          "Quantos anos?"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is Lucas'?",
        "opts": [
          "Carro",
          "Casa",
          "Trabalho",
          "Lucas"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Lucas'",
        "opts": [
          "is",
          "be",
          "are",
          "am"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / Lucas'",
        "opts": [
          "Lucas is my name",
          "My name is Lucas",
          "Is my name Lucas",
          "My Lucas is name"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Lucas'",
        "opts": [
          "Boa noite",
          "Bom dia",
          "Prazer em conhecer você, Lucas",
          "Até logo"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Lucas' significa:",
        "opts": [
          "Meu nome não é",
          "Olá, meu nome é Lucas",
          "Onde mora?",
          "Qual seu nome?"
        ],
        "ans": 1,
        "type": "translation"
      }
    ]
  },
  {
    "id": 200,
    "module": 6,
    "moduleName": "Domínio da Fluência",
    "level": "B2",
    "title": "Cultura local",
    "desc": "Aprenda cultura local - tradução correta David=David",
    "time": "13 MIN",
    "phrase": "Hello, my name is David",
    "translation": "Olá, meu nome é David",
    "vocab": [
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Chamar atenção"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4>📚 Cultura local</h4><p><b>Frase:</b> Hello, my name is David = Olá, meu nome é David</p><p><b>Uso:</b> Apresentação - mesmo nome em EN e PT</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is David'",
        "opts": [
          "Boa noite",
          "Olá, meu nome é David",
          "Até logo",
          "Bom dia"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "O que significa 'My name is'?",
        "opts": [
          "Quantos anos",
          "Meu nome é",
          "Como vai",
          "Onde mora"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is David'",
        "opts": [
          "bad",
          "big",
          "name",
          "good"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is David'?",
        "opts": [
          "Ao se apresentar",
          "Ao dirigir",
          "Ao comer",
          "Ao dormir"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Qual significa 'Olá'?",
        "opts": [
          "Hello",
          "Please",
          "Goodbye",
          "Thanks"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Resposta para 'What is your name?'",
        "opts": [
          "I am fine",
          "My name is David",
          "Thank you",
          "Goodbye"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'What is your name?'",
        "opts": [
          "Onde mora?",
          "Como vai?",
          "Qual é seu nome?",
          "Quantos anos?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Nome em 'Hello, my name is David'?",
        "opts": [
          "Trabalho",
          "Casa",
          "Carro",
          "David"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ David'",
        "opts": [
          "be",
          "is",
          "are",
          "am"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Ordem: 'name / is / my / David'",
        "opts": [
          "Is my name David",
          "My David is name",
          "David is my name",
          "My name is David"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, David'",
        "opts": [
          "Boa noite",
          "Até logo",
          "Bom dia",
          "Prazer em conhecer você, David"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is David' significa:",
        "opts": [
          "Qual seu nome?",
          "Olá, meu nome é David",
          "Onde mora?",
          "Meu nome não é"
        ],
        "ans": 1,
        "type": "translation"
      }
    ]
  }
];


function renderLessons(){
 const nextIdx=lessons.findIndex(l=>!completed.includes(l.id));
 const start=nextIdx===-1?0:nextIdx;
 const upcoming=lessons.slice(start,start+3);
 const grid=document.getElementById('lesson-grid');
 if(grid) grid.innerHTML=upcoming.map(l=>`<article class="lesson-card ${completed.includes(l.id)?'done':''}"><span class="number">${String(l.id).padStart(2,'0')}</span>${completed.includes(l.id)?'<span class="check">✓</span>':''}<span class="level-badge">${l.level}</span><h3>${l.title}</h3><p>${l.desc} · ${l.time} · ${l.quiz.length} perguntas</p><button data-lesson="${l.id}">${completed.includes(l.id)?'Refazer':'Começar'} →</button></article>`).join('');
 const modules=[1,2,3,4,5,6];
 const moduleNames={1:'Foundations',2:'Everyday Life',3:'Communication',4:'Work & Life',5:'Professional English',6:'Fluency Mastery'};
 const mg=document.getElementById('modules-grid');
 if(mg){
   mg.innerHTML=modules.map(m=>{
     const ml=lessons.filter(x=>x.module===m);
     const done=ml.filter(x=>completed.includes(x.id)).length;
     const pct=Math.round(done/ml.length*100);
     return `<article class="module-card"><span class="module-badge">MÓDULO ${m} · ${moduleNames[m].toUpperCase()}</span><h3>${moduleNames[m]}</h3><p>${ml[0].title} → ${ml[ml.length-1].title}</p><div class="module-progress"><i style="width:${pct}%"></i></div><small style="color:#718078;font-size:11px">${done}/${ml.length} · ${pct}% · ${ml.length*12} perguntas</small></article>`
   }).join('');
 }
 const grouped={}; lessons.forEach(l=>{if(!grouped[l.module]) grouped[l.module]=[]; grouped[l.module].push(l);});
 let html='';
 Object.keys(grouped).sort((a,b)=>a-b).forEach(mod=>{
   const ml=[...grouped[mod]].sort((a,b)=>Number(completed.includes(a.id))-Number(completed.includes(b.id))||a.id-b.id);
   html+=`<div class="catalog-head"><h3>Módulo ${mod} — ${ml[0].moduleName}</h3><span class="level-badge">${ml.filter(x=>completed.includes(x.id)).length}/${ml.length} · ${ml.length*12} perguntas</span></div><div class="lesson-catalog">`+ml.map(l=>{const done=completed.includes(l.id);return `<article class="catalog-card ${done?'done':''}"><div><span class="level-badge">${done?'CONCLUÍDA · ':''}${l.level}</span><p class="eyebrow">LIÇÃO ${String(l.id).padStart(2,'0')} · ${l.time}</p><h2>${l.title}</h2><p>${l.desc}</p><small style="font-size:11px;color:#276246">📝 ${l.quiz.length} perguntas · ${l.vocab.length} palavras</small></div><button data-lesson="${l.id}">${done?'Revisar':'Começar'}</button></article>`}).join('')+`</div>`;
 });
 const cat=document.getElementById('lesson-catalog');
 if(cat) cat.innerHTML=html;
 const cc=document.getElementById('completed-count'); if(cc) cc.textContent=completed.length;
 const pts=document.getElementById('points'); if(pts) pts.textContent=points;
 const pctAll=Math.round(completed.length/lessons.length*100);
 const dp=document.getElementById('daily-progress'); if(dp) dp.textContent=pctAll+'%';
 const ring=document.querySelector('.ring'); if(ring){ring.style.background=`conic-gradient(var(--green) ${pctAll}%, #d7e793 0)`; ring.style.border='0';}
}
function openLesson(id){
 const l=lessons.find(x=>x.id===id);
 currentQuizIndex=0;
 const tabs=`<div class="tabs"><button class="tab active" data-tab="dialog">Diálogo</button><button class="tab" data-tab="vocab">Vocabulário (${l.vocab.length})</button><button class="tab" data-tab="grammar">Gramática</button><button class="tab" data-tab="quiz">Quiz (${l.quiz.length} perguntas)</button></div>`;
 const vocabHtml=`<div style="margin-bottom:12px;padding:10px;background:#f5fae5;border-radius:10px;font-size:12px;color:#276246"><strong>📖 ${l.vocab.length} palavras - Tradução correta</strong></div><div class="vocab-grid">${l.vocab.map(v=>`<div class="vocab-item" style="border:1px solid #e9e5da;padding:12px;border-radius:10px;background:#fff"><div style="display:flex;justify-content:space-between"><div><strong>${v[0]}</strong> — ${v[1]}<br><small style="color:#718078">${v[2]}</small><br><small style="color:#9ca3af;font-size:11px">💡 ${v[3]||""}</small></div><div style="display:flex;flex-direction:column;gap:4px"><button class="tab" style="font-size:10px" onclick="speakEnglish('${v[0].replace(/'/g,"\'")}')">🔊 EN</button><button class="tab" style="font-size:10px" onclick="speakPortuguese('${v[1].replace(/'/g,"\'")}')">🔊 PT</button></div></div></div>`).join('')}</div>`;
 function getQuizHtml(){
   const q = l.quiz[currentQuizIndex];
   if(!q._shuffled || q._shuffledQuestion !== currentQuizIndex){
     const correctOpt = q.opts[q.ans];
     let shuffled = [...q.opts];
     for(let i=shuffled.length-1; i>0; i--){
       const j=Math.floor(Math.random()*(i+1));
       [shuffled[i], shuffled[j]]=[shuffled[j], shuffled[i]];
     }
     q._shuffled = shuffled;
     q._shuffledAns = shuffled.indexOf(correctOpt);
     q._shuffledQuestion = currentQuizIndex;
   }
   const displayOpts = q._shuffled;
   const displayAns = q._shuffledAns;
   q._currentDisplayAns = displayAns;
   return `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px"><p><strong>Pergunta ${currentQuizIndex+1} de ${l.quiz.length}</strong> <span style="background:#dbeafe;padding:2px 6px;border-radius:999px;font-size:10px">🔀 Embaralhado</span></p></div><p style="font-size:15px;margin:12px 0;font-weight:500">${q.q}</p><div style="display:grid;gap:10px">${displayOpts.map((o,i)=>`<button class="option" style="text-align:left;padding:14px 16px;border:1.5px solid #e9e5da;border-radius:12px;background:#fff;cursor:pointer" data-answer="${i}">${String.fromCharCode(65+i)}. ${o}</button>`).join('')}</div><div id="feedback" style="margin-top:12px;font-weight:700"></div>`;
 }
 function renderModal(){
   return `<p style="font-size:10px;color:#718078;font-weight:700">MÓDULO ${l.module} · ${l.level} · ${l.time}</p><h2 style="font-family:Fraunces;margin:4px 0">${l.title}</h2><p style="color:#718078;font-size:13px">${l.desc}</p>${tabs}<div id="tab-dialog"><p style="font-family:Fraunces;font-size:22px;color:#276246;margin:16px 0 6px">${l.phrase}</p><p style="color:#718078">${l.translation}</p><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px"><button class="primary" onclick="speakEnglish('${l.phrase.replace(/'/g,"\'")}')">🔊 EN Nativo</button><button class="tab" onclick="speakPortuguese('${l.translation.replace(/'/g,"\'")}')">🔊 PT</button><button class="tab" onclick="speakSlow('${l.phrase.replace(/'/g,"\'")}')">🐢 Devagar</button><button class="tab" onclick="speakBilingual('${l.phrase.replace(/'/g,"\'")}','${l.translation.replace(/'/g,"\'")}')">🔊 Bilíngue</button></div><div style="margin-top:12px;padding:8px;background:#f5fae5;border-radius:8px;font-size:11px;color:#276246">✅ Tradução verificada: mesmo nome EN e PT</div></div><div id="tab-vocab" class="hidden">${vocabHtml}</div><div id="tab-grammar" class="hidden"><div style="background:#f5fae5;padding:12px;border-radius:10px">${l.grammar}</div></div><div id="tab-quiz" class="hidden"><div id="quiz-container">${getQuizHtml()}</div></div>`;
 }
 const lessonContent=document.getElementById('lesson-content');
 if(!lessonContent) return;
 lessonContent.innerHTML=renderModal();
 const modal=document.getElementById('lesson-modal');
 if(modal){ modal.classList.remove('hidden'); modal.style.display='grid'; }
 document.querySelectorAll('#lesson-content .tab[data-tab]').forEach(t=>{
   t.onclick=()=>{
     document.querySelectorAll('#lesson-content .tab[data-tab]').forEach(x=>x.classList.remove('active'));
     t.classList.add('active');
     ['dialog','vocab','grammar','quiz'].forEach(k=>{
       const el=document.getElementById('tab-'+k);
       if(el) el.classList.toggle('hidden', k!==t.dataset.tab);
     });
     if(t.dataset.tab==='dialog') speakEnglish(l.phrase);
   };
 });
 function attachQuiz(){
   document.querySelectorAll('#quiz-container [data-answer]').forEach(b=>{
     b.onclick=()=>{
       const q = l.quiz[currentQuizIndex];
       const correct = +b.dataset.answer===(q._currentDisplayAns !== undefined ? q._currentDisplayAns : q.ans);
       const fb=document.getElementById('feedback');
       if(correct){
         fb.innerHTML=`<span style="color:#276246">✅ Correto! +10 XP</span>`;
         b.style.background='#e8f4d1'; b.style.borderColor='#276246';
         points+=10; save();
         setTimeout(()=>{
           if(currentQuizIndex < l.quiz.length-1){
             currentQuizIndex++;
             document.getElementById('quiz-container').innerHTML=getQuizHtml();
             attachQuiz();
           } else {
             fb.innerHTML+=`<br><br><strong style="color:#276246">🎉 Lição concluída!</strong>`;
             if(!completed.includes(l.id)){ completed.push(l.id); save(); renderLessons(); }
             speakBilingual('Congratulations! Lesson completed!', 'Parabéns! Lição concluída!');
             setTimeout(()=>{ const nxt=lessons.find(x=>x.id>l.id && !completed.includes(x.id)); if(nxt) openLesson(nxt.id); else { const m=document.getElementById('lesson-modal'); if(m){ m.classList.add('hidden'); m.style.display='none'; } } }, 1800);
           }
         }, 800);
       } else {
         const correctText = q._shuffled ? q._shuffled[q._currentDisplayAns] : q.opts[q.ans];
         fb.innerHTML=`<span style="color:#dc2626">❌ Quase! Correta: "${correctText}"</span>`;
         b.style.background='#ffe4e6';
       }
     };
   });
   const prev=document.getElementById('prev-q'); const next=document.getElementById('next-q');
   if(prev) prev.onclick=()=>{ if(currentQuizIndex>0){ currentQuizIndex--; document.getElementById('quiz-container').innerHTML=getQuizHtml(); attachQuiz(); }};
   if(next) next.onclick=()=>{ if(currentQuizIndex<l.quiz.length-1){ currentQuizIndex++; document.getElementById('quiz-container').innerHTML=getQuizHtml(); attachQuiz(); }};
 }
 attachQuiz();
 speakEnglish(l.phrase);
}
function showView(v){ document.querySelectorAll('.content').forEach(x=>x.classList.add('hidden')); const el=document.getElementById(v+'-view'); if(el) el.classList.remove('hidden'); document.querySelectorAll('.nav-item').forEach(x=>x.classList.toggle('active',x.dataset.view===v)); }
document.addEventListener('click',e=>{ const lesson=e.target.dataset.lesson; if(lesson) openLesson(+lesson); const view=e.target.closest('[data-view]')?.dataset.view; if(view) showView(view); const say=e.target.dataset.say; if(say) speakEnglish(say); });
const startBtn=document.getElementById('start-lesson'); if(startBtn) startBtn.onclick=()=>{ const nxt=lessons.find(l=>!completed.includes(l.id))||lessons[0]; openLesson(nxt.id); };
const closeBtn=document.getElementById('close-modal'); if(closeBtn) closeBtn.onclick=()=>{ const m=document.getElementById('lesson-modal'); if(m){ m.classList.add('hidden'); m.style.display='none'; } };
const lessonModal=document.getElementById('lesson-modal'); if(lessonModal) lessonModal.onclick=e=>{ if(e.target.id==='lesson-modal'){ e.currentTarget.classList.add('hidden'); e.currentTarget.style.display='none'; } };
const words=[['Hello','Olá','Hello, nice to meet you.']]; let ci=0; function renderCard(){ const c=words[ci]; const w=document.getElementById('word'); const tr=document.getElementById('translation'); const ex=document.getElementById('example'); const idx=document.getElementById('card-index'); if(w){ w.textContent=c[0]; if(tr) tr.textContent=c[1]; if(ex) ex.textContent=c[2]; if(idx) idx.textContent=(ci+1)+'/'+words.length; }} const nextCardBtn=document.getElementById('next-card'); if(nextCardBtn) nextCardBtn.onclick=()=>{ ci=(ci+1)%words.length; renderCard(); }; const listenWord=document.getElementById('listen-word'); if(listenWord) listenWord.onclick=()=>speakEnglish(document.getElementById('word').textContent);
const dateEl=document.getElementById('date-now'); if(dateEl) dateEl.textContent=new Date().toLocaleDateString('pt-BR',{weekday:'long',day:'numeric',month:'long'}).toUpperCase();
const currentDateEl=document.getElementById('current-date'); if(currentDateEl){ const now=new Date(); currentDateEl.textContent=now.toLocaleDateString('pt-BR',{weekday:'long',day:'numeric',month:'long',year:'numeric'}).toUpperCase(); }
const sKey='zeuvastec-student-name'; function applyName(v){ const name=(v||'amigo').trim()||'amigo'; const el1=document.getElementById('student-name'); const el2=document.getElementById('profile-name'); const el3=document.getElementById('profile-initials'); if(el1) el1.textContent=name; if(el2) el2.textContent=name; if(el3) el3.textContent=name.split(/\s+/).slice(0,2).map(p=>p[0]).join('').toUpperCase(); } const saved=localStorage.getItem(sKey); if(saved) applyName(saved); const editBtn=document.getElementById('edit-profile'); if(editBtn) editBtn.addEventListener('click', (e)=>{ e.preventDefault(); const m=document.getElementById('name-modal'); if(m){ m.classList.remove('hidden'); m.style.display='grid'; const inp=document.getElementById('student-name-input'); if(inp){ inp.value=localStorage.getItem(sKey)||''; setTimeout(()=>inp.focus(),100); } } }); const nameForm=document.getElementById('name-form'); if(nameForm) nameForm.addEventListener('submit', (e)=>{ e.preventDefault(); const inp=document.getElementById('student-name-input'); const n=inp?inp.value.trim():''; if(!n) return; localStorage.setItem(sKey,n); applyName(n); const m=document.getElementById('name-modal'); if(m){ m.classList.add('hidden'); m.style.display='none'; } });
const soundToggle=document.getElementById('sound-toggle'); if(soundToggle) soundToggle.onclick=()=>{ soundOn=!soundOn; soundToggle.style.opacity=soundOn?'1':'.45'; };
renderLessons(); renderCard();
