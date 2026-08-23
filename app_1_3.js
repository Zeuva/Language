
let voiceCache={en:[],pt:[]}; let voicesReady=false;
function refreshVoices(){const all=speechSynthesis.getVoices(); if(all.length===0) return; voicesReady=true; voiceCache.en=all.filter(v=>v.lang.toLowerCase().startsWith('en')); voiceCache.pt=all.filter(v=>v.lang.toLowerCase().startsWith('pt')); }
refreshVoices(); if(speechSynthesis.onvoiceschanged!==undefined) speechSynthesis.onvoiceschanged=refreshVoices;
function getVoiceEN(){if(!voicesReady) refreshVoices(); return voiceCache.en.find(v=>v.lang==='en-US') || voiceCache.en[0] || null;}
function getVoicePT(){if(!voicesReady) refreshVoices(); return voiceCache.pt.find(v=>v.lang==='pt-BR') || voiceCache.pt[0] || null;}
function speakEnglish(text,rate=0.9,onEnd){if(!text) return; speechSynthesis.cancel(); setTimeout(()=>{const u=new SpeechSynthesisUtterance(text); u.lang='en-US'; u.rate=rate; const v=getVoiceEN(); if(v && v.lang.toLowerCase().startsWith('en')){u.voice=v;} if(onEnd) u.onend=onEnd; speechSynthesis.speak(u);},80);}
function speakPortuguese(text,rate=1.0,onEnd){if(!text) return; const isEnglishOnly=/^[A-Za-z0-9 .,!?'"-]+$/.test(text) && !/[áàâãéêíóôõúç]/.test(text) && /\b(hello|my name|I am|would like|coffee|please)\b/i.test(text); if(isEnglishOnly){speakEnglish(text,rate,onEnd); return;} speechSynthesis.cancel(); setTimeout(()=>{const u=new SpeechSynthesisUtterance(text); u.lang='pt-BR'; u.rate=rate; const v=getVoicePT(); if(v && v.lang.toLowerCase().startsWith('pt')){u.voice=v;} if(onEnd) u.onend=onEnd; speechSynthesis.speak(u);},80);}
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
    "desc": "Aprenda olá e apresentações - tradução correta",
    "time": "6 MIN",
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
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you!",
        "Conhecer alguém"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night!",
        "Despedida noite"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon!",
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
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning!",
        "Até meio-dia"
      ],
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Olá e apresentações</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Miguel = Meu nome é Miguel<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Olá e apresentações</h5><p><b>Frase chave:</b> Hello, my name is Miguel = Olá, meu nome é Miguel</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Hello, my name is Miguel'",
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
          "name",
          "bad",
          "good",
          "big"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Miguel'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Goodbye",
          "My name is Miguel",
          "I am fine"
        ],
        "ans": 2,
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
        "q": "Em 'Hello, my name is Miguel', qual é o nome?",
        "opts": [
          "Miguel",
          "Carro",
          "John",
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
        "q": "Ordem correta: 'name / is / my / Miguel'",
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
          "Até logo",
          "Prazer em conhecer você, Miguel",
          "Bom dia",
          "Boa noite"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Miguel' significa:",
        "opts": [
          "Onde você mora?",
          "Meu nome não é",
          "Qual seu nome?",
          "Olá, meu nome é Miguel"
        ],
        "ans": 3,
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
    "desc": "Aprenda dizendo seu nome - tradução correta",
    "time": "7 MIN",
    "phrase": "Hello, my name is Julia",
    "translation": "Olá, meu nome é Julia",
    "vocab": [
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me!",
        "Chamar atenção"
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
        "Good evening",
        "Boa noite",
        "Good evening!",
        "Chegada noite"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon!",
        "Tarde"
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
        "Thank you!",
        "Agradecimento"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you!",
        "Conhecer alguém"
      ],
      [
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Dizendo seu nome</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Julia = Meu nome é Julia<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Dizendo seu nome</h5><p><b>Frase chave:</b> Hello, my name is Julia = Olá, meu nome é Julia</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Hello, my name is Julia'",
        "opts": [
          "Bom dia",
          "Até logo",
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
          "Onde mora",
          "Meu nome é",
          "Quantos anos"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Julia'",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "My name is Julia",
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
        "q": "Em 'Hello, my name is Julia', qual é o nome?",
        "opts": [
          "John",
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
          "be",
          "is",
          "are"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Ordem correta: 'name / is / my / Julia'",
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
          "Onde você mora?",
          "Meu nome não é",
          "Qual seu nome?"
        ],
        "ans": 0,
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
    "desc": "Aprenda de onde você é - tradução correta",
    "time": "8 MIN",
    "phrase": "Hello, my name is Emma",
    "translation": "Olá, meu nome é Emma",
    "vocab": [
      [
        "Excuse me",
        "Com licença",
        "Excuse me!",
        "Chamar atenção"
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
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you!",
        "Conhecer alguém"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
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
        "Good afternoon!",
        "Tarde"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Hi",
        "Oi",
        "Hi, nice to see you!",
        "Informal"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: De onde você é</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Emma = Meu nome é Emma<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: De onde você é</h5><p><b>Frase chave:</b> Hello, my name is Emma = Olá, meu nome é Emma</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Hello, my name is Emma'",
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
          "Ao se apresentar",
          "Ao dormir",
          "Ao comer"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Qual palavra significa 'Olá'?",
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
          "Thank you",
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
          "Qual é seu nome?",
          "Quantos anos?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Em 'Hello, my name is Emma', qual é o nome?",
        "opts": [
          "John",
          "Casa",
          "Carro",
          "Emma"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Emma'",
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
        "q": "Ordem correta: 'name / is / my / Emma'",
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
          "Até logo",
          "Boa noite",
          "Prazer em conhecer você, Emma",
          "Bom dia"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Emma' significa:",
        "opts": [
          "Qual seu nome?",
          "Meu nome não é",
          "Onde você mora?",
          "Olá, meu nome é Emma"
        ],
        "ans": 3,
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
    "desc": "Aprenda perguntando o nome - tradução correta",
    "time": "9 MIN",
    "phrase": "Hello, my name is Pedro",
    "translation": "Olá, meu nome é Pedro",
    "vocab": [
      [
        "Good evening",
        "Boa noite",
        "Good evening!",
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
        "Good afternoon!",
        "Tarde"
      ],
      [
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Hi",
        "Oi",
        "Hi, nice to see you!",
        "Informal"
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
        "Thank you",
        "Obrigado",
        "Thank you!",
        "Agradecimento"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Perguntando o nome</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Pedro = Meu nome é Pedro<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Perguntando o nome</h5><p><b>Frase chave:</b> Hello, my name is Pedro = Olá, meu nome é Pedro</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Hello, my name is Pedro'",
        "opts": [
          "Olá, meu nome é Pedro",
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
          "Ao dirigir",
          "Ao dormir",
          "Ao se apresentar"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Qual palavra significa 'Olá'?",
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
          "Como vai?",
          "Qual é seu nome?",
          "Onde mora?",
          "Quantos anos?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Em 'Hello, my name is Pedro', qual é o nome?",
        "opts": [
          "Pedro",
          "John",
          "Casa",
          "Carro"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Pedro'",
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
        "q": "Ordem correta: 'name / is / my / Pedro'",
        "opts": [
          "My name is Pedro",
          "Pedro is my name",
          "My Pedro is name",
          "Is my name Pedro"
        ],
        "ans": 0,
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
          "Meu nome não é",
          "Onde você mora?",
          "Qual seu nome?",
          "Olá, meu nome é Pedro"
        ],
        "ans": 3,
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
    "desc": "Aprenda idade e aniversário - tradução correta",
    "time": "10 MIN",
    "phrase": "I am Emma",
    "translation": "Eu sou Emma",
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
        "Thank you!",
        "Agradecimento"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening!",
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
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning!",
        "Até meio-dia"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you!",
        "Conhecer alguém"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Idade e aniversário</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Emma = Meu nome é Emma<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Idade e aniversário</h5><p><b>Frase chave:</b> I am Emma = Eu sou Emma</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'I am Emma'",
        "opts": [
          "Bom dia",
          "Eu sou Emma",
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
          "Meu nome é",
          "Como vai",
          "Quantos anos"
        ],
        "ans": 1,
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
        "q": "Quando usar 'I am Emma'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Qual é seu nome?",
          "Onde mora?",
          "Como vai?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Em 'I am Emma', qual é o nome?",
        "opts": [
          "John",
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
          "am",
          "be",
          "is"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Ordem correta: 'name / is / my / Emma'",
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
          "Onde você mora?",
          "Meu nome não é",
          "Qual seu nome?",
          "Eu sou Emma"
        ],
        "ans": 3,
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
    "desc": "Aprenda família básica - tradução correta",
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
        "Thank you",
        "Obrigado",
        "Thank you!",
        "Agradecimento"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning!",
        "Até meio-dia"
      ],
      [
        "Hi",
        "Oi",
        "Hi, nice to see you!",
        "Informal"
      ],
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
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
        "Good night!",
        "Despedida noite"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
      ],
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Família básica</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Miguel = Meu nome é Miguel<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Família básica</h5><p><b>Frase chave:</b> Hello, my name is Miguel = Olá, meu nome é Miguel</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Hello, my name is Miguel'",
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
          "bad",
          "good",
          "big",
          "name"
        ],
        "ans": 3,
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
        "q": "Qual palavra significa 'Olá'?",
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
          "My name is Miguel",
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
        "q": "Em 'Hello, my name is Miguel', qual é o nome?",
        "opts": [
          "John",
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
          "is",
          "am",
          "are",
          "be"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Ordem correta: 'name / is / my / Miguel'",
        "opts": [
          "My name is Miguel",
          "My Miguel is name",
          "Miguel is my name",
          "Is my name Miguel"
        ],
        "ans": 0,
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
          "Meu nome não é",
          "Qual seu nome?",
          "Olá, meu nome é Miguel",
          "Onde você mora?"
        ],
        "ans": 2,
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
    "desc": "Aprenda cumprimentos formais - tradução correta",
    "time": "12 MIN",
    "phrase": "Nice to meet you, Carlos",
    "translation": "Prazer em conhecer você, Carlos",
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
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night!",
        "Despedida noite"
      ],
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
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
        "Thank you!",
        "Agradecimento"
      ],
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening!",
        "Chegada noite"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Cumprimentos formais</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Carlos = Meu nome é Carlos<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Cumprimentos formais</h5><p><b>Frase chave:</b> Nice to meet you, Carlos = Prazer em conhecer você, Carlos</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Nice to meet you, Carlos'",
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
        "q": "Complete: 'Hello, my ___ is Carlos'",
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
        "q": "Quando usar 'Nice to meet you, Carlos'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Como vai?",
          "Qual é seu nome?",
          "Quantos anos?",
          "Onde mora?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Em 'Nice to meet you, Carlos', qual é o nome?",
        "opts": [
          "Carlos",
          "Carro",
          "John",
          "Casa"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Carlos'",
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
        "q": "Ordem correta: 'name / is / my / Carlos'",
        "opts": [
          "Is my name Carlos",
          "My Carlos is name",
          "Carlos is my name",
          "My name is Carlos"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Carlos'",
        "opts": [
          "Até logo",
          "Boa noite",
          "Prazer em conhecer você, Carlos",
          "Bom dia"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Carlos' significa:",
        "opts": [
          "Onde você mora?",
          "Meu nome não é",
          "Prazer em conhecer você, Carlos",
          "Qual seu nome?"
        ],
        "ans": 2,
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
    "desc": "Aprenda despedidas - tradução correta",
    "time": "13 MIN",
    "phrase": "Good morning, I am Carlos",
    "translation": "Bom dia, eu sou Carlos",
    "vocab": [
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ],
      [
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me!",
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
        "Thank you!",
        "Agradecimento"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night!",
        "Despedida noite"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Despedidas</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Carlos = Meu nome é Carlos<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Despedidas</h5><p><b>Frase chave:</b> Good morning, I am Carlos = Bom dia, eu sou Carlos</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Good morning, I am Carlos'",
        "opts": [
          "Bom dia, eu sou Carlos",
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
        "q": "Complete: 'Hello, my ___ is Carlos'",
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
        "q": "Quando usar 'Good morning, I am Carlos'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Qual é seu nome?",
          "Como vai?",
          "Quantos anos?",
          "Onde mora?"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Em 'Good morning, I am Carlos', qual é o nome?",
        "opts": [
          "Casa",
          "John",
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
        "q": "Ordem correta: 'name / is / my / Carlos'",
        "opts": [
          "My name is Carlos",
          "My Carlos is name",
          "Carlos is my name",
          "Is my name Carlos"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Carlos'",
        "opts": [
          "Bom dia",
          "Até logo",
          "Prazer em conhecer você, Carlos",
          "Boa noite"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Carlos' significa:",
        "opts": [
          "Onde você mora?",
          "Bom dia, eu sou Carlos",
          "Meu nome não é",
          "Qual seu nome?"
        ],
        "ans": 1,
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
    "desc": "Aprenda como você está - tradução correta",
    "time": "6 MIN",
    "phrase": "Hello, my name is Pedro",
    "translation": "Olá, meu nome é Pedro",
    "vocab": [
      [
        "Good night",
        "Boa noite",
        "Good night!",
        "Despedida noite"
      ],
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
      ],
      [
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
      ],
      [
        "Hi",
        "Oi",
        "Hi, nice to see you!",
        "Informal"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me!",
        "Chamar atenção"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening!",
        "Chegada noite"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you!",
        "Agradecimento"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon!",
        "Tarde"
      ],
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Como você está</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Pedro = Meu nome é Pedro<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Como você está</h5><p><b>Frase chave:</b> Hello, my name is Pedro = Olá, meu nome é Pedro</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Hello, my name is Pedro'",
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
          "bad",
          "good",
          "big"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Pedro'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "My name is Pedro",
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
        "q": "Em 'Hello, my name is Pedro', qual é o nome?",
        "opts": [
          "Casa",
          "John",
          "Pedro",
          "Carro"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Pedro'",
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
        "q": "Ordem correta: 'name / is / my / Pedro'",
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
          "Boa noite",
          "Prazer em conhecer você, Pedro",
          "Até logo",
          "Bom dia"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Pedro' significa:",
        "opts": [
          "Onde você mora?",
          "Olá, meu nome é Pedro",
          "Meu nome não é",
          "Qual seu nome?"
        ],
        "ans": 1,
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
    "desc": "Aprenda números e telefone - tradução correta",
    "time": "7 MIN",
    "phrase": "Nice to meet you, Lucas",
    "translation": "Prazer em conhecer você, Lucas",
    "vocab": [
      [
        "Good night",
        "Boa noite",
        "Good night!",
        "Despedida noite"
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
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Hi",
        "Oi",
        "Hi, nice to see you!",
        "Informal"
      ],
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
      ],
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you!",
        "Agradecimento"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon!",
        "Tarde"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Números e telefone</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Lucas = Meu nome é Lucas<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Números e telefone</h5><p><b>Frase chave:</b> Nice to meet you, Lucas = Prazer em conhecer você, Lucas</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Nice to meet you, Lucas'",
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
          "big",
          "good",
          "bad",
          "name"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Nice to meet you, Lucas'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "My name is Lucas"
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
        "q": "Em 'Nice to meet you, Lucas', qual é o nome?",
        "opts": [
          "Carro",
          "John",
          "Casa",
          "Lucas"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Lucas'",
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
        "q": "Ordem correta: 'name / is / my / Lucas'",
        "opts": [
          "Lucas is my name",
          "Is my name Lucas",
          "My name is Lucas",
          "My Lucas is name"
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
          "Meu nome não é",
          "Qual seu nome?",
          "Prazer em conhecer você, Lucas",
          "Onde você mora?"
        ],
        "ans": 2,
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
    "desc": "Aprenda endereço e cidade - tradução correta",
    "time": "8 MIN",
    "phrase": "I am Miguel",
    "translation": "Eu sou Miguel",
    "vocab": [
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
      ],
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon!",
        "Tarde"
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
        "Thank you!",
        "Agradecimento"
      ],
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me!",
        "Chamar atenção"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Endereço e cidade</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Miguel = Meu nome é Miguel<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Endereço e cidade</h5><p><b>Frase chave:</b> I am Miguel = Eu sou Miguel</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'I am Miguel'",
        "opts": [
          "Eu sou Miguel",
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
          "Onde mora",
          "Como vai",
          "Quantos anos"
        ],
        "ans": 0,
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
        "q": "Quando usar 'I am Miguel'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Onde mora?",
          "Qual é seu nome?",
          "Quantos anos?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Em 'I am Miguel', qual é o nome?",
        "opts": [
          "Miguel",
          "Carro",
          "Casa",
          "John"
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
        "q": "Ordem correta: 'name / is / my / Miguel'",
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
          "Qual seu nome?",
          "Onde você mora?",
          "Meu nome não é",
          "Eu sou Miguel"
        ],
        "ans": 3,
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
    "desc": "Aprenda profissão simples - tradução correta",
    "time": "9 MIN",
    "phrase": "Hello, I am Sofia",
    "translation": "Olá, eu sou Sofia",
    "vocab": [
      [
        "Thank you",
        "Obrigado",
        "Thank you!",
        "Agradecimento"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me!",
        "Chamar atenção"
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
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you!",
        "Conhecer alguém"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon!",
        "Tarde"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night!",
        "Despedida noite"
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
        "Good morning!",
        "Até meio-dia"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Profissão simples</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Sofia = Meu nome é Sofia<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Profissão simples</h5><p><b>Frase chave:</b> Hello, I am Sofia = Olá, eu sou Sofia</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Hello, I am Sofia'",
        "opts": [
          "Boa noite",
          "Até logo",
          "Olá, eu sou Sofia",
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
        "q": "Complete: 'Hello, my ___ is Sofia'",
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
        "q": "Quando usar 'Hello, I am Sofia'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "My name is Sofia",
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
          "Como vai?",
          "Quantos anos?",
          "Onde mora?"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Em 'Hello, I am Sofia', qual é o nome?",
        "opts": [
          "John",
          "Sofia",
          "Casa",
          "Carro"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Sofia'",
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
        "q": "Ordem correta: 'name / is / my / Sofia'",
        "opts": [
          "My Sofia is name",
          "Sofia is my name",
          "Is my name Sofia",
          "My name is Sofia"
        ],
        "ans": 3,
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
          "Onde você mora?",
          "Meu nome não é",
          "Qual seu nome?",
          "Olá, eu sou Sofia"
        ],
        "ans": 3,
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
    "desc": "Aprenda hobbies favoritos - tradução correta",
    "time": "10 MIN",
    "phrase": "Nice to meet you, Emma",
    "translation": "Prazer em conhecer você, Emma",
    "vocab": [
      [
        "Good evening",
        "Boa noite",
        "Good evening!",
        "Chegada noite"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night!",
        "Despedida noite"
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
        "Hi",
        "Oi",
        "Hi, nice to see you!",
        "Informal"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me!",
        "Chamar atenção"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Hobbies favoritos</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Emma = Meu nome é Emma<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Hobbies favoritos</h5><p><b>Frase chave:</b> Nice to meet you, Emma = Prazer em conhecer você, Emma</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Nice to meet you, Emma'",
        "opts": [
          "Até logo",
          "Bom dia",
          "Prazer em conhecer você, Emma",
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
          "Onde mora",
          "Como vai"
        ],
        "ans": 1,
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
        "q": "Quando usar 'Nice to meet you, Emma'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Como vai?",
          "Quantos anos?",
          "Onde mora?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Em 'Nice to meet you, Emma', qual é o nome?",
        "opts": [
          "Casa",
          "Emma",
          "Carro",
          "John"
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
        "q": "Ordem correta: 'name / is / my / Emma'",
        "opts": [
          "Emma is my name",
          "My name is Emma",
          "Is my name Emma",
          "My Emma is name"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Emma'",
        "opts": [
          "Até logo",
          "Boa noite",
          "Prazer em conhecer você, Emma",
          "Bom dia"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Emma' significa:",
        "opts": [
          "Qual seu nome?",
          "Onde você mora?",
          "Prazer em conhecer você, Emma",
          "Meu nome não é"
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
    "desc": "Aprenda comida favorita - tradução correta",
    "time": "11 MIN",
    "phrase": "Hello, my name is John",
    "translation": "Olá, meu nome é John",
    "vocab": [
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you!",
        "Agradecimento"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night!",
        "Despedida noite"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
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
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Comida favorita</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is John = Meu nome é John<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Comida favorita</h5><p><b>Frase chave:</b> Hello, my name is John = Olá, meu nome é John</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Hello, my name is John'",
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
          "Ao comer",
          "Ao dormir",
          "Ao dirigir",
          "Ao se apresentar"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Qual palavra significa 'Olá'?",
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
          "My name is John",
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
          "Onde mora?",
          "Como vai?",
          "Quantos anos?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Em 'Hello, my name is John', qual é o nome?",
        "opts": [
          "John",
          "Casa",
          "Carro",
          "Mike"
        ],
        "ans": 0,
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
        "q": "Ordem correta: 'name / is / my / John'",
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
          "Até logo",
          "Prazer em conhecer você, John",
          "Bom dia",
          "Boa noite"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is John' significa:",
        "opts": [
          "Olá, meu nome é John",
          "Qual seu nome?",
          "Meu nome não é",
          "Onde você mora?"
        ],
        "ans": 0,
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
    "desc": "Aprenda cores favoritas - tradução correta",
    "time": "12 MIN",
    "phrase": "I am John",
    "translation": "Eu sou John",
    "vocab": [
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
        "Thank you",
        "Obrigado",
        "Thank you!",
        "Agradecimento"
      ],
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
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
        "Excuse me!",
        "Chamar atenção"
      ],
      [
        "Hi",
        "Oi",
        "Hi, nice to see you!",
        "Informal"
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
        "Good evening!",
        "Chegada noite"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Cores favoritas</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is John = Meu nome é John<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Cores favoritas</h5><p><b>Frase chave:</b> I am John = Eu sou John</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'I am John'",
        "opts": [
          "Até logo",
          "Boa noite",
          "Bom dia",
          "Eu sou John"
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
        "q": "Quando usar 'I am John'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Como vai?",
          "Quantos anos?",
          "Onde mora?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Em 'I am John', qual é o nome?",
        "opts": [
          "Mike",
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
          "are",
          "be",
          "is"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Ordem correta: 'name / is / my / John'",
        "opts": [
          "Is my name John",
          "My name is John",
          "My John is name",
          "John is my name"
        ],
        "ans": 1,
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
          "Eu sou John",
          "Meu nome não é",
          "Qual seu nome?",
          "Onde você mora?"
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
    "desc": "Aprenda tempo e clima - tradução correta",
    "time": "13 MIN",
    "phrase": "Nice to meet you, Miguel",
    "translation": "Prazer em conhecer você, Miguel",
    "vocab": [
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you!",
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
        "Good morning!",
        "Até meio-dia"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening!",
        "Chegada noite"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you!",
        "Agradecimento"
      ],
      [
        "Hi",
        "Oi",
        "Hi, nice to see you!",
        "Informal"
      ],
      [
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Tempo e clima</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Miguel = Meu nome é Miguel<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Tempo e clima</h5><p><b>Frase chave:</b> Nice to meet you, Miguel = Prazer em conhecer você, Miguel</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Nice to meet you, Miguel'",
        "opts": [
          "Boa noite",
          "Bom dia",
          "Prazer em conhecer você, Miguel",
          "Até logo"
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
        "q": "Quando usar 'Nice to meet you, Miguel'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
        "q": "Em 'Nice to meet you, Miguel', qual é o nome?",
        "opts": [
          "Casa",
          "Miguel",
          "John",
          "Carro"
        ],
        "ans": 1,
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
        "q": "Ordem correta: 'name / is / my / Miguel'",
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
          "Prazer em conhecer você, Miguel",
          "Onde você mora?",
          "Qual seu nome?"
        ],
        "ans": 1,
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
    "desc": "Aprenda dias da semana - tradução correta",
    "time": "6 MIN",
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
        "Excuse me",
        "Com licença",
        "Excuse me!",
        "Chamar atenção"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ],
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
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
        "Good evening!",
        "Chegada noite"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon!",
        "Tarde"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Dias da semana</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Pedro = Meu nome é Pedro<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Dias da semana</h5><p><b>Frase chave:</b> Hello, my name is Pedro = Olá, meu nome é Pedro</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Hello, my name is Pedro'",
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
          "big",
          "name",
          "bad"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Pedro'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Como vai?",
          "Quantos anos?",
          "Onde mora?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Em 'Hello, my name is Pedro', qual é o nome?",
        "opts": [
          "John",
          "Carro",
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
          "is",
          "are"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Ordem correta: 'name / is / my / Pedro'",
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
          "Onde você mora?",
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
    "id": 18,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Horas e compromissos",
    "desc": "Aprenda horas e compromissos - tradução correta",
    "time": "7 MIN",
    "phrase": "My name is John",
    "translation": "Meu nome é John",
    "vocab": [
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you!",
        "Conhecer alguém"
      ],
      [
        "Hi",
        "Oi",
        "Hi, nice to see you!",
        "Informal"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
      ],
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
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
        "Good evening!",
        "Chegada noite"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me!",
        "Chamar atenção"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Horas e compromissos</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is John = Meu nome é John<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Horas e compromissos</h5><p><b>Frase chave:</b> My name is John = Meu nome é John</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'My name is John'",
        "opts": [
          "Até logo",
          "Meu nome é John",
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
          "Meu nome é",
          "Como vai"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is John'",
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
        "q": "Quando usar 'My name is John'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "I am fine",
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
          "Onde mora?",
          "Como vai?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Em 'My name is John', qual é o nome?",
        "opts": [
          "John",
          "Casa",
          "Mike",
          "Carro"
        ],
        "ans": 0,
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
        "q": "Ordem correta: 'name / is / my / John'",
        "opts": [
          "Is my name John",
          "My name is John",
          "My John is name",
          "John is my name"
        ],
        "ans": 1,
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
          "Meu nome não é",
          "Onde você mora?",
          "Qual seu nome?",
          "Meu nome é John"
        ],
        "ans": 3,
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
    "desc": "Aprenda família estendida - tradução correta",
    "time": "8 MIN",
    "phrase": "I am Emma",
    "translation": "Eu sou Emma",
    "vocab": [
      [
        "Good night",
        "Boa noite",
        "Good night!",
        "Despedida noite"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
      ],
      [
        "Hi",
        "Oi",
        "Hi, nice to see you!",
        "Informal"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon!",
        "Tarde"
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
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you!",
        "Agradecimento"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Família estendida</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Emma = Meu nome é Emma<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Família estendida</h5><p><b>Frase chave:</b> I am Emma = Eu sou Emma</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'I am Emma'",
        "opts": [
          "Bom dia",
          "Boa noite",
          "Até logo",
          "Eu sou Emma"
        ],
        "ans": 3,
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
        "q": "Complete: 'Hello, my ___ is Emma'",
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
        "q": "Quando usar 'I am Emma'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "My name is Emma",
          "I am fine"
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
        "q": "Em 'I am Emma', qual é o nome?",
        "opts": [
          "Casa",
          "Emma",
          "Carro",
          "John"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Emma'",
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
        "q": "Ordem correta: 'name / is / my / Emma'",
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
          "Até logo",
          "Prazer em conhecer você, Emma",
          "Boa noite",
          "Bom dia"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Emma' significa:",
        "opts": [
          "Eu sou Emma",
          "Meu nome não é",
          "Qual seu nome?",
          "Onde você mora?"
        ],
        "ans": 0,
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
    "desc": "Aprenda casa e moradia - tradução correta",
    "time": "9 MIN",
    "phrase": "I am John",
    "translation": "Eu sou John",
    "vocab": [
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon!",
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
        "Excuse me!",
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
        "Good evening!",
        "Chegada noite"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "Hi",
        "Oi",
        "Hi, nice to see you!",
        "Informal"
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
        "Good night!",
        "Despedida noite"
      ],
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Casa e moradia</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is John = Meu nome é John<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Casa e moradia</h5><p><b>Frase chave:</b> I am John = Eu sou John</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'I am John'",
        "opts": [
          "Eu sou John",
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
          "good",
          "name",
          "big"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Quando usar 'I am John'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Onde mora?",
          "Qual é seu nome?",
          "Quantos anos?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Em 'I am John', qual é o nome?",
        "opts": [
          "Carro",
          "Mike",
          "John",
          "Casa"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ John'",
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
        "q": "Ordem correta: 'name / is / my / John'",
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
          "Onde você mora?",
          "Qual seu nome?",
          "Meu nome não é",
          "Eu sou John"
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
    "desc": "Aprenda rotina matinal - tradução correta",
    "time": "10 MIN",
    "phrase": "I am Emma",
    "translation": "Eu sou Emma",
    "vocab": [
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon!",
        "Tarde"
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
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning!",
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
        "Good night!",
        "Despedida noite"
      ],
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you!",
        "Agradecimento"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Rotina matinal</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Emma = Meu nome é Emma<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Rotina matinal</h5><p><b>Frase chave:</b> I am Emma = Eu sou Emma</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'I am Emma'",
        "opts": [
          "Bom dia",
          "Eu sou Emma",
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
          "Quantos anos",
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
          "big",
          "name",
          "bad"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Quando usar 'I am Emma'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Onde mora?",
          "Como vai?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Em 'I am Emma', qual é o nome?",
        "opts": [
          "John",
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
          "be",
          "am",
          "are",
          "is"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Ordem correta: 'name / is / my / Emma'",
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
          "Bom dia",
          "Até logo",
          "Boa noite"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Emma' significa:",
        "opts": [
          "Onde você mora?",
          "Meu nome não é",
          "Eu sou Emma",
          "Qual seu nome?"
        ],
        "ans": 2,
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
    "desc": "Aprenda rotina noturna - tradução correta",
    "time": "11 MIN",
    "phrase": "Nice to meet you, Sarah",
    "translation": "Prazer em conhecer você, Sarah",
    "vocab": [
      [
        "Thank you",
        "Obrigado",
        "Thank you!",
        "Agradecimento"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me!",
        "Chamar atenção"
      ],
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
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
        "Hi",
        "Oi",
        "Hi, nice to see you!",
        "Informal"
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
        "Nice to meet you!",
        "Conhecer alguém"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Rotina noturna</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Sarah = Meu nome é Sarah<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Rotina noturna</h5><p><b>Frase chave:</b> Nice to meet you, Sarah = Prazer em conhecer você, Sarah</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Nice to meet you, Sarah'",
        "opts": [
          "Boa noite",
          "Bom dia",
          "Prazer em conhecer você, Sarah",
          "Até logo"
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
        "q": "Complete: 'Hello, my ___ is Sarah'",
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
        "q": "Quando usar 'Nice to meet you, Sarah'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "My name is Sarah",
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
        "q": "Em 'Nice to meet you, Sarah', qual é o nome?",
        "opts": [
          "Casa",
          "John",
          "Carro",
          "Sarah"
        ],
        "ans": 3,
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
        "q": "Ordem correta: 'name / is / my / Sarah'",
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
          "Onde você mora?",
          "Qual seu nome?",
          "Prazer em conhecer você, Sarah"
        ],
        "ans": 3,
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
    "desc": "Aprenda fim de semana - tradução correta",
    "time": "12 MIN",
    "phrase": "My name is Sarah",
    "translation": "Meu nome é Sarah",
    "vocab": [
      [
        "Excuse me",
        "Com licença",
        "Excuse me!",
        "Chamar atenção"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening!",
        "Chegada noite"
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
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
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
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon!",
        "Tarde"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Fim de semana</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Sarah = Meu nome é Sarah<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Fim de semana</h5><p><b>Frase chave:</b> My name is Sarah = Meu nome é Sarah</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'My name is Sarah'",
        "opts": [
          "Bom dia",
          "Boa noite",
          "Meu nome é Sarah",
          "Até logo"
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
          "big",
          "bad",
          "name",
          "good"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Quando usar 'My name is Sarah'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Como vai?",
          "Quantos anos?",
          "Qual é seu nome?",
          "Onde mora?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Em 'My name is Sarah', qual é o nome?",
        "opts": [
          "Carro",
          "Sarah",
          "John",
          "Casa"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Sarah'",
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
        "q": "Ordem correta: 'name / is / my / Sarah'",
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
          "Meu nome é Sarah",
          "Onde você mora?",
          "Meu nome não é",
          "Qual seu nome?"
        ],
        "ans": 0,
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
    "desc": "Aprenda compras básicas - tradução correta",
    "time": "13 MIN",
    "phrase": "Nice to meet you, Sofia",
    "translation": "Prazer em conhecer você, Sofia",
    "vocab": [
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you!",
        "Conhecer alguém"
      ],
      [
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
      ],
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon!",
        "Tarde"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
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
        "Thank you",
        "Obrigado",
        "Thank you!",
        "Agradecimento"
      ],
      [
        "Hi",
        "Oi",
        "Hi, nice to see you!",
        "Informal"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Compras básicas</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Sofia = Meu nome é Sofia<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Compras básicas</h5><p><b>Frase chave:</b> Nice to meet you, Sofia = Prazer em conhecer você, Sofia</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Nice to meet you, Sofia'",
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
          "good",
          "big",
          "name",
          "bad"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Nice to meet you, Sofia'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
        "q": "Em 'Nice to meet you, Sofia', qual é o nome?",
        "opts": [
          "Carro",
          "Casa",
          "Sofia",
          "John"
        ],
        "ans": 2,
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
        "q": "Ordem correta: 'name / is / my / Sofia'",
        "opts": [
          "Sofia is my name",
          "Is my name Sofia",
          "My name is Sofia",
          "My Sofia is name"
        ],
        "ans": 2,
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
          "Onde você mora?",
          "Meu nome não é",
          "Prazer em conhecer você, Sofia",
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
    "desc": "Aprenda transporte - tradução correta",
    "time": "6 MIN",
    "phrase": "Good morning, I am Carlos",
    "translation": "Bom dia, eu sou Carlos",
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
        "Good night!",
        "Despedida noite"
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
        "Thank you",
        "Obrigado",
        "Thank you!",
        "Agradecimento"
      ],
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
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
        "Excuse me!",
        "Chamar atenção"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Transporte</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Carlos = Meu nome é Carlos<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Transporte</h5><p><b>Frase chave:</b> Good morning, I am Carlos = Bom dia, eu sou Carlos</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Good morning, I am Carlos'",
        "opts": [
          "Bom dia",
          "Até logo",
          "Bom dia, eu sou Carlos",
          "Boa noite"
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
        "q": "Quando usar 'Good morning, I am Carlos'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "My name is Carlos",
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
          "Onde mora?",
          "Quantos anos?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Em 'Good morning, I am Carlos', qual é o nome?",
        "opts": [
          "Casa",
          "Carlos",
          "John",
          "Carro"
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
        "q": "Ordem correta: 'name / is / my / Carlos'",
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
          "Meu nome não é",
          "Onde você mora?",
          "Bom dia, eu sou Carlos",
          "Qual seu nome?"
        ],
        "ans": 2,
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
    "desc": "Aprenda comida e restaurante - tradução correta",
    "time": "7 MIN",
    "phrase": "I am Lucas",
    "translation": "Eu sou Lucas",
    "vocab": [
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you!",
        "Conhecer alguém"
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
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Hi",
        "Oi",
        "Hi, nice to see you!",
        "Informal"
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
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Comida e restaurante</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Lucas = Meu nome é Lucas<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Comida e restaurante</h5><p><b>Frase chave:</b> I am Lucas = Eu sou Lucas</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'I am Lucas'",
        "opts": [
          "Bom dia",
          "Eu sou Lucas",
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
          "bad",
          "name",
          "good",
          "big"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Quando usar 'I am Lucas'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Thank you",
          "I am fine",
          "Goodbye",
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
        "q": "Em 'I am Lucas', qual é o nome?",
        "opts": [
          "Lucas",
          "Casa",
          "John",
          "Carro"
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
        "q": "Ordem correta: 'name / is / my / Lucas'",
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
          "Boa noite",
          "Até logo",
          "Bom dia",
          "Prazer em conhecer você, Lucas"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Lucas' significa:",
        "opts": [
          "Onde você mora?",
          "Qual seu nome?",
          "Meu nome não é",
          "Eu sou Lucas"
        ],
        "ans": 3,
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
    "desc": "Aprenda bebidas - tradução correta",
    "time": "8 MIN",
    "phrase": "Good morning, I am Emma",
    "translation": "Bom dia, eu sou Emma",
    "vocab": [
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
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
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Hi",
        "Oi",
        "Hi, nice to see you!",
        "Informal"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you!",
        "Conhecer alguém"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me!",
        "Chamar atenção"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening!",
        "Chegada noite"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Bebidas</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Emma = Meu nome é Emma<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Bebidas</h5><p><b>Frase chave:</b> Good morning, I am Emma = Bom dia, eu sou Emma</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Good morning, I am Emma'",
        "opts": [
          "Bom dia",
          "Bom dia, eu sou Emma",
          "Boa noite",
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
        "q": "Quando usar 'Good morning, I am Emma'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Goodbye",
          "Thank you",
          "My name is Emma"
        ],
        "ans": 3,
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
        "q": "Em 'Good morning, I am Emma', qual é o nome?",
        "opts": [
          "Emma",
          "Carro",
          "Casa",
          "John"
        ],
        "ans": 0,
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
        "q": "Ordem correta: 'name / is / my / Emma'",
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
          "Bom dia, eu sou Emma",
          "Qual seu nome?",
          "Onde você mora?",
          "Meu nome não é"
        ],
        "ans": 0,
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
    "desc": "Aprenda pedindo ajuda - tradução correta",
    "time": "9 MIN",
    "phrase": "Good morning, I am Maria",
    "translation": "Bom dia, eu sou Maria",
    "vocab": [
      [
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
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
        "Excuse me!",
        "Chamar atenção"
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
        "Nice to meet you!",
        "Conhecer alguém"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "Hi",
        "Oi",
        "Hi, nice to see you!",
        "Informal"
      ],
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning!",
        "Até meio-dia"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Pedindo ajuda</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Maria = Meu nome é Maria<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Pedindo ajuda</h5><p><b>Frase chave:</b> Good morning, I am Maria = Bom dia, eu sou Maria</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Good morning, I am Maria'",
        "opts": [
          "Até logo",
          "Bom dia, eu sou Maria",
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
        "q": "Complete: 'Hello, my ___ is Maria'",
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
        "q": "Quando usar 'Good morning, I am Maria'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Goodbye",
          "Thank you",
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
          "Como vai?",
          "Onde mora?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Em 'Good morning, I am Maria', qual é o nome?",
        "opts": [
          "John",
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
          "are",
          "is",
          "am",
          "be"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Ordem correta: 'name / is / my / Maria'",
        "opts": [
          "My Maria is name",
          "My name is Maria",
          "Maria is my name",
          "Is my name Maria"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Maria'",
        "opts": [
          "Prazer em conhecer você, Maria",
          "Boa noite",
          "Até logo",
          "Bom dia"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Maria' significa:",
        "opts": [
          "Qual seu nome?",
          "Meu nome não é",
          "Onde você mora?",
          "Bom dia, eu sou Maria"
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
    "desc": "Aprenda direções simples - tradução correta",
    "time": "10 MIN",
    "phrase": "Good morning, I am Miguel",
    "translation": "Bom dia, eu sou Miguel",
    "vocab": [
      [
        "Good evening",
        "Boa noite",
        "Good evening!",
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
        "Nice to meet you!",
        "Conhecer alguém"
      ],
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
      ],
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you!",
        "Agradecimento"
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
        "Excuse me!",
        "Chamar atenção"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon!",
        "Tarde"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Direções simples</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Miguel = Meu nome é Miguel<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Direções simples</h5><p><b>Frase chave:</b> Good morning, I am Miguel = Bom dia, eu sou Miguel</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Good morning, I am Miguel'",
        "opts": [
          "Bom dia",
          "Até logo",
          "Bom dia, eu sou Miguel",
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
        "q": "Complete: 'Hello, my ___ is Miguel'",
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
        "q": "Quando usar 'Good morning, I am Miguel'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Onde mora?",
          "Quantos anos?",
          "Como vai?"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Em 'Good morning, I am Miguel', qual é o nome?",
        "opts": [
          "Carro",
          "John",
          "Casa",
          "Miguel"
        ],
        "ans": 3,
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
        "q": "Ordem correta: 'name / is / my / Miguel'",
        "opts": [
          "My name is Miguel",
          "Miguel is my name",
          "My Miguel is name",
          "Is my name Miguel"
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
          "Meu nome não é",
          "Bom dia, eu sou Miguel",
          "Qual seu nome?",
          "Onde você mora?"
        ],
        "ans": 1,
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
    "desc": "Aprenda preços e dinheiro - tradução correta",
    "time": "11 MIN",
    "phrase": "Nice to meet you, Maria",
    "translation": "Prazer em conhecer você, Maria",
    "vocab": [
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon!",
        "Tarde"
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
        "Good night!",
        "Despedida noite"
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
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me!",
        "Chamar atenção"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening!",
        "Chegada noite"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Preços e dinheiro</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Maria = Meu nome é Maria<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Preços e dinheiro</h5><p><b>Frase chave:</b> Nice to meet you, Maria = Prazer em conhecer você, Maria</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Nice to meet you, Maria'",
        "opts": [
          "Boa noite",
          "Bom dia",
          "Prazer em conhecer você, Maria",
          "Até logo"
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
        "q": "Complete: 'Hello, my ___ is Maria'",
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
        "q": "Quando usar 'Nice to meet you, Maria'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "My name is Maria",
          "Thank you"
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
        "q": "Em 'Nice to meet you, Maria', qual é o nome?",
        "opts": [
          "John",
          "Casa",
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
          "is",
          "am",
          "be"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Ordem correta: 'name / is / my / Maria'",
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
          "Qual seu nome?",
          "Prazer em conhecer você, Maria",
          "Onde você mora?",
          "Meu nome não é"
        ],
        "ans": 1,
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
    "desc": "Aprenda roupas - tradução correta",
    "time": "12 MIN",
    "phrase": "Hello, I am Emma",
    "translation": "Olá, eu sou Emma",
    "vocab": [
      [
        "Hi",
        "Oi",
        "Hi, nice to see you!",
        "Informal"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning!",
        "Até meio-dia"
      ],
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night!",
        "Despedida noite"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
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
        "Nice to meet you!",
        "Conhecer alguém"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me!",
        "Chamar atenção"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Roupas</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Emma = Meu nome é Emma<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Roupas</h5><p><b>Frase chave:</b> Hello, I am Emma = Olá, eu sou Emma</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Hello, I am Emma'",
        "opts": [
          "Boa noite",
          "Bom dia",
          "Olá, eu sou Emma",
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
        "q": "Complete: 'Hello, my ___ is Emma'",
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
        "q": "Quando usar 'Hello, I am Emma'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "My name is Emma",
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
        "q": "Em 'Hello, I am Emma', qual é o nome?",
        "opts": [
          "Emma",
          "Carro",
          "Casa",
          "John"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Emma'",
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
        "q": "Ordem correta: 'name / is / my / Emma'",
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
          "Bom dia",
          "Prazer em conhecer você, Emma",
          "Boa noite",
          "Até logo"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Emma' significa:",
        "opts": [
          "Meu nome não é",
          "Qual seu nome?",
          "Olá, eu sou Emma",
          "Onde você mora?"
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
    "desc": "Aprenda saúde básica - tradução correta",
    "time": "13 MIN",
    "phrase": "Hello, my name is Pedro",
    "translation": "Olá, meu nome é Pedro",
    "vocab": [
      [
        "Good night",
        "Boa noite",
        "Good night!",
        "Despedida noite"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Hi",
        "Oi",
        "Hi, nice to see you!",
        "Informal"
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
        "Excuse me!",
        "Chamar atenção"
      ],
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
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
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Saúde básica</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Pedro = Meu nome é Pedro<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Saúde básica</h5><p><b>Frase chave:</b> Hello, my name is Pedro = Olá, meu nome é Pedro</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Hello, my name is Pedro'",
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
          "Como vai",
          "Meu nome é",
          "Quantos anos",
          "Onde mora"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Pedro'",
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
        "q": "Quando usar 'Hello, my name is Pedro'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Qual é seu nome?",
          "Quantos anos?",
          "Como vai?",
          "Onde mora?"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Em 'Hello, my name is Pedro', qual é o nome?",
        "opts": [
          "John",
          "Carro",
          "Casa",
          "Pedro"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Pedro'",
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
        "q": "Ordem correta: 'name / is / my / Pedro'",
        "opts": [
          "My name is Pedro",
          "Pedro is my name",
          "Is my name Pedro",
          "My Pedro is name"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Pedro'",
        "opts": [
          "Boa noite",
          "Até logo",
          "Prazer em conhecer você, Pedro",
          "Bom dia"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Pedro' significa:",
        "opts": [
          "Olá, meu nome é Pedro",
          "Onde você mora?",
          "Meu nome não é",
          "Qual seu nome?"
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
    "desc": "Aprenda emoções - tradução correta",
    "time": "6 MIN",
    "phrase": "Nice to meet you, Emma",
    "translation": "Prazer em conhecer você, Emma",
    "vocab": [
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon!",
        "Tarde"
      ],
      [
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you!",
        "Agradecimento"
      ],
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
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
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Emoções</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Emma = Meu nome é Emma<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Emoções</h5><p><b>Frase chave:</b> Nice to meet you, Emma = Prazer em conhecer você, Emma</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Nice to meet you, Emma'",
        "opts": [
          "Até logo",
          "Prazer em conhecer você, Emma",
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
          "name",
          "good"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Nice to meet you, Emma'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "My name is Emma",
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
        "q": "Em 'Nice to meet you, Emma', qual é o nome?",
        "opts": [
          "John",
          "Casa",
          "Carro",
          "Emma"
        ],
        "ans": 3,
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
        "q": "Ordem correta: 'name / is / my / Emma'",
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
          "Bom dia",
          "Prazer em conhecer você, Emma",
          "Boa noite"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Emma' significa:",
        "opts": [
          "Onde você mora?",
          "Meu nome não é",
          "Qual seu nome?",
          "Prazer em conhecer você, Emma"
        ],
        "ans": 3,
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
    "desc": "Aprenda convites - tradução correta",
    "time": "7 MIN",
    "phrase": "Hello, I am Lucas",
    "translation": "Olá, eu sou Lucas",
    "vocab": [
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
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
        "Good afternoon!",
        "Tarde"
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
        "Excuse me",
        "Com licença",
        "Excuse me!",
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
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Convites</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Lucas = Meu nome é Lucas<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Convites</h5><p><b>Frase chave:</b> Hello, I am Lucas = Olá, eu sou Lucas</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Hello, I am Lucas'",
        "opts": [
          "Até logo",
          "Bom dia",
          "Boa noite",
          "Olá, eu sou Lucas"
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
        "q": "Complete: 'Hello, my ___ is Lucas'",
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
        "q": "Quando usar 'Hello, I am Lucas'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "I am fine",
          "My name is Lucas",
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
          "Como vai?",
          "Onde mora?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Em 'Hello, I am Lucas', qual é o nome?",
        "opts": [
          "John",
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
          "is",
          "am",
          "are",
          "be"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Ordem correta: 'name / is / my / Lucas'",
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
          "Até logo",
          "Prazer em conhecer você, Lucas",
          "Boa noite",
          "Bom dia"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Lucas' significa:",
        "opts": [
          "Qual seu nome?",
          "Meu nome não é",
          "Olá, eu sou Lucas",
          "Onde você mora?"
        ],
        "ans": 2,
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
    "desc": "Aprenda telefone - tradução correta",
    "time": "8 MIN",
    "phrase": "Nice to meet you, John",
    "translation": "Prazer em conhecer você, John",
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
        "Excuse me!",
        "Chamar atenção"
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
        "Good morning",
        "Bom dia",
        "Good morning!",
        "Até meio-dia"
      ],
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
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
        "Good evening",
        "Boa noite",
        "Good evening!",
        "Chegada noite"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Telefone</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is John = Meu nome é John<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Telefone</h5><p><b>Frase chave:</b> Nice to meet you, John = Prazer em conhecer você, John</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Nice to meet you, John'",
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
        "q": "Quando usar 'Nice to meet you, John'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Qual é seu nome?",
          "Onde mora?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Em 'Nice to meet you, John', qual é o nome?",
        "opts": [
          "Carro",
          "John",
          "Casa",
          "Mike"
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
        "q": "Ordem correta: 'name / is / my / John'",
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
          "Meu nome não é",
          "Qual seu nome?",
          "Prazer em conhecer você, John",
          "Onde você mora?"
        ],
        "ans": 2,
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
    "desc": "Aprenda email e contato - tradução correta",
    "time": "9 MIN",
    "phrase": "I am Julia",
    "translation": "Eu sou Julia",
    "vocab": [
      [
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you!",
        "Agradecimento"
      ],
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you!",
        "Conhecer alguém"
      ],
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
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
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Hi",
        "Oi",
        "Hi, nice to see you!",
        "Informal"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Email e contato</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Julia = Meu nome é Julia<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Email e contato</h5><p><b>Frase chave:</b> I am Julia = Eu sou Julia</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'I am Julia'",
        "opts": [
          "Eu sou Julia",
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
        "q": "Complete: 'Hello, my ___ is Julia'",
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
        "q": "Quando usar 'I am Julia'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "My name is Julia",
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
          "Como vai?",
          "Quantos anos?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Em 'I am Julia', qual é o nome?",
        "opts": [
          "John",
          "Carro",
          "Julia",
          "Casa"
        ],
        "ans": 2,
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
        "q": "Ordem correta: 'name / is / my / Julia'",
        "opts": [
          "My name is Julia",
          "Julia is my name",
          "Is my name Julia",
          "My Julia is name"
        ],
        "ans": 0,
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
          "Eu sou Julia",
          "Qual seu nome?",
          "Onde você mora?",
          "Meu nome não é"
        ],
        "ans": 0,
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
    "desc": "Aprenda planos futuros - tradução correta",
    "time": "10 MIN",
    "phrase": "Nice to meet you, Julia",
    "translation": "Prazer em conhecer você, Julia",
    "vocab": [
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon!",
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
        "Good night!",
        "Despedida noite"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening!",
        "Chegada noite"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me!",
        "Chamar atenção"
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
        "Thank you",
        "Obrigado",
        "Thank you!",
        "Agradecimento"
      ],
      [
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Planos futuros</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Julia = Meu nome é Julia<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Planos futuros</h5><p><b>Frase chave:</b> Nice to meet you, Julia = Prazer em conhecer você, Julia</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Nice to meet you, Julia'",
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
          "good",
          "name",
          "big",
          "bad"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Nice to meet you, Julia'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Qual é seu nome?",
          "Quantos anos?",
          "Como vai?",
          "Onde mora?"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Em 'Nice to meet you, Julia', qual é o nome?",
        "opts": [
          "Casa",
          "Carro",
          "John",
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
        "q": "Ordem correta: 'name / is / my / Julia'",
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
          "Bom dia",
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
          "Prazer em conhecer você, Julia",
          "Onde você mora?",
          "Qual seu nome?"
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
    "desc": "Aprenda passado simples - tradução correta",
    "time": "11 MIN",
    "phrase": "Nice to meet you, Sofia",
    "translation": "Prazer em conhecer você, Sofia",
    "vocab": [
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me!",
        "Chamar atenção"
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
        "Good afternoon!",
        "Tarde"
      ],
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ],
      [
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you!",
        "Conhecer alguém"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening!",
        "Chegada noite"
      ],
      [
        "Hi",
        "Oi",
        "Hi, nice to see you!",
        "Informal"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Passado simples</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Sofia = Meu nome é Sofia<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Passado simples</h5><p><b>Frase chave:</b> Nice to meet you, Sofia = Prazer em conhecer você, Sofia</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Nice to meet you, Sofia'",
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
        "q": "Quando usar 'Nice to meet you, Sofia'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "My name is Sofia",
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
          "Como vai?",
          "Quantos anos?",
          "Onde mora?"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Em 'Nice to meet you, Sofia', qual é o nome?",
        "opts": [
          "Carro",
          "Casa",
          "John",
          "Sofia"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Sofia'",
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
        "q": "Ordem correta: 'name / is / my / Sofia'",
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
          "Prazer em conhecer você, Sofia",
          "Bom dia",
          "Boa noite",
          "Até logo"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Sofia' significa:",
        "opts": [
          "Onde você mora?",
          "Prazer em conhecer você, Sofia",
          "Qual seu nome?",
          "Meu nome não é"
        ],
        "ans": 1,
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
    "desc": "Aprenda experiências - tradução correta",
    "time": "12 MIN",
    "phrase": "Good morning, I am Carlos",
    "translation": "Bom dia, eu sou Carlos",
    "vocab": [
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon!",
        "Tarde"
      ],
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
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
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you!",
        "Agradecimento"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me!",
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
        "Good morning",
        "Bom dia",
        "Good morning!",
        "Até meio-dia"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Experiências</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Carlos = Meu nome é Carlos<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Experiências</h5><p><b>Frase chave:</b> Good morning, I am Carlos = Bom dia, eu sou Carlos</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Good morning, I am Carlos'",
        "opts": [
          "Bom dia, eu sou Carlos",
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
        "q": "Complete: 'Hello, my ___ is Carlos'",
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
        "q": "Quando usar 'Good morning, I am Carlos'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Como vai?",
          "Onde mora?",
          "Qual é seu nome?",
          "Quantos anos?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Em 'Good morning, I am Carlos', qual é o nome?",
        "opts": [
          "Carro",
          "Casa",
          "Carlos",
          "John"
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
        "q": "Ordem correta: 'name / is / my / Carlos'",
        "opts": [
          "Is my name Carlos",
          "My Carlos is name",
          "Carlos is my name",
          "My name is Carlos"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Carlos'",
        "opts": [
          "Prazer em conhecer você, Carlos",
          "Bom dia",
          "Até logo",
          "Boa noite"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Carlos' significa:",
        "opts": [
          "Onde você mora?",
          "Qual seu nome?",
          "Bom dia, eu sou Carlos",
          "Meu nome não é"
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
    "desc": "Aprenda preferências - tradução correta",
    "time": "13 MIN",
    "phrase": "I am Sarah",
    "translation": "Eu sou Sarah",
    "vocab": [
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon!",
        "Tarde"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening!",
        "Chegada noite"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night!",
        "Despedida noite"
      ],
      [
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
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
        "Excuse me!",
        "Chamar atenção"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Preferências</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Sarah = Meu nome é Sarah<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Preferências</h5><p><b>Frase chave:</b> I am Sarah = Eu sou Sarah</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'I am Sarah'",
        "opts": [
          "Eu sou Sarah",
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
          "good",
          "bad",
          "big"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Quando usar 'I am Sarah'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "My name is Sarah",
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
          "Onde mora?",
          "Qual é seu nome?",
          "Quantos anos?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Em 'I am Sarah', qual é o nome?",
        "opts": [
          "Sarah",
          "Carro",
          "John",
          "Casa"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Sarah'",
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
        "q": "Ordem correta: 'name / is / my / Sarah'",
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
          "Qual seu nome?",
          "Eu sou Sarah",
          "Meu nome não é",
          "Onde você mora?"
        ],
        "ans": 1,
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
    "desc": "Aprenda opiniões simples - tradução correta",
    "time": "6 MIN",
    "phrase": "My name is Emma",
    "translation": "Meu nome é Emma",
    "vocab": [
      [
        "Excuse me",
        "Com licença",
        "Excuse me!",
        "Chamar atenção"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
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
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon!",
        "Tarde"
      ],
      [
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening!",
        "Chegada noite"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Opiniões simples</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Emma = Meu nome é Emma<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Opiniões simples</h5><p><b>Frase chave:</b> My name is Emma = Meu nome é Emma</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'My name is Emma'",
        "opts": [
          "Até logo",
          "Meu nome é Emma",
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
          "Como vai",
          "Quantos anos",
          "Onde mora"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Emma'",
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
        "q": "Quando usar 'My name is Emma'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "My name is Emma",
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
          "Como vai?",
          "Qual é seu nome?",
          "Quantos anos?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Em 'My name is Emma', qual é o nome?",
        "opts": [
          "Carro",
          "Emma",
          "John",
          "Casa"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Emma'",
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
        "q": "Ordem correta: 'name / is / my / Emma'",
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
          "Meu nome não é",
          "Qual seu nome?",
          "Onde você mora?",
          "Meu nome é Emma"
        ],
        "ans": 3,
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
    "desc": "Aprenda comparações - tradução correta",
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
        "Good evening",
        "Boa noite",
        "Good evening!",
        "Chegada noite"
      ],
      [
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you!",
        "Agradecimento"
      ],
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you!",
        "Conhecer alguém"
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
        "Good morning!",
        "Até meio-dia"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon!",
        "Tarde"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Comparações</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Ana = Meu nome é Ana<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Comparações</h5><p><b>Frase chave:</b> Hello, my name is Ana = Olá, meu nome é Ana</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Hello, my name is Ana'",
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
          "Onde mora",
          "Meu nome é",
          "Como vai",
          "Quantos anos"
        ],
        "ans": 1,
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
          "Ao dirigir",
          "Ao dormir",
          "Ao se apresentar",
          "Ao comer"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Qual palavra significa 'Olá'?",
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
          "Onde mora?",
          "Como vai?",
          "Qual é seu nome?",
          "Quantos anos?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Em 'Hello, my name is Ana', qual é o nome?",
        "opts": [
          "Carro",
          "John",
          "Casa",
          "Ana"
        ],
        "ans": 3,
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
        "q": "Ordem correta: 'name / is / my / Ana'",
        "opts": [
          "Ana is my name",
          "Is my name Ana",
          "My Ana is name",
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
          "Prazer em conhecer você, Ana",
          "Até logo"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Ana' significa:",
        "opts": [
          "Meu nome não é",
          "Onde você mora?",
          "Qual seu nome?",
          "Olá, meu nome é Ana"
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
    "desc": "Aprenda conselhos - tradução correta",
    "time": "8 MIN",
    "phrase": "Hello, my name is Carlos",
    "translation": "Olá, meu nome é Carlos",
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
        "Good evening!",
        "Chegada noite"
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
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night!",
        "Despedida noite"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon!",
        "Tarde"
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
        "Thank you!",
        "Agradecimento"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Conselhos</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Carlos = Meu nome é Carlos<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Conselhos</h5><p><b>Frase chave:</b> Hello, my name is Carlos = Olá, meu nome é Carlos</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Hello, my name is Carlos'",
        "opts": [
          "Bom dia",
          "Até logo",
          "Boa noite",
          "Olá, meu nome é Carlos"
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
        "q": "Complete: 'Hello, my ___ is Carlos'",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Thank you",
          "My name is Carlos",
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
        "q": "Em 'Hello, my name is Carlos', qual é o nome?",
        "opts": [
          "Carlos",
          "Casa",
          "John",
          "Carro"
        ],
        "ans": 0,
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
        "q": "Ordem correta: 'name / is / my / Carlos'",
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
          "Prazer em conhecer você, Carlos",
          "Bom dia",
          "Boa noite",
          "Até logo"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Carlos' significa:",
        "opts": [
          "Onde você mora?",
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
    "id": 44,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Convite para café",
    "desc": "Aprenda convite para café - tradução correta",
    "time": "9 MIN",
    "phrase": "Hello, my name is Emma",
    "translation": "Olá, meu nome é Emma",
    "vocab": [
      [
        "Thank you",
        "Obrigado",
        "Thank you!",
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
        "Good morning!",
        "Até meio-dia"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me!",
        "Chamar atenção"
      ],
      [
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening!",
        "Chegada noite"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night!",
        "Despedida noite"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you!",
        "Conhecer alguém"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Convite para café</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Emma = Meu nome é Emma<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Convite para café</h5><p><b>Frase chave:</b> Hello, my name is Emma = Olá, meu nome é Emma</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Hello, my name is Emma'",
        "opts": [
          "Bom dia",
          "Até logo",
          "Boa noite",
          "Olá, meu nome é Emma"
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
          "Ao se apresentar",
          "Ao dormir",
          "Ao comer"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Qual palavra significa 'Olá'?",
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
          "Thank you",
          "My name is Emma"
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
        "q": "Em 'Hello, my name is Emma', qual é o nome?",
        "opts": [
          "Casa",
          "Emma",
          "John",
          "Carro"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Emma'",
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
        "q": "Ordem correta: 'name / is / my / Emma'",
        "opts": [
          "My name is Emma",
          "Emma is my name",
          "Is my name Emma",
          "My Emma is name"
        ],
        "ans": 0,
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
          "Onde você mora?"
        ],
        "ans": 1,
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
    "desc": "Aprenda conhecendo vizinhos - tradução correta",
    "time": "10 MIN",
    "phrase": "Nice to meet you, Maria",
    "translation": "Prazer em conhecer você, Maria",
    "vocab": [
      [
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you!",
        "Agradecimento"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you!",
        "Conhecer alguém"
      ],
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
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
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me!",
        "Chamar atenção"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Conhecendo vizinhos</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Maria = Meu nome é Maria<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Conhecendo vizinhos</h5><p><b>Frase chave:</b> Nice to meet you, Maria = Prazer em conhecer você, Maria</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Nice to meet you, Maria'",
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
        "q": "Complete: 'Hello, my ___ is Maria'",
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
        "q": "Quando usar 'Nice to meet you, Maria'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Goodbye",
          "I am fine",
          "My name is Maria"
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
        "q": "Em 'Nice to meet you, Maria', qual é o nome?",
        "opts": [
          "John",
          "Maria",
          "Casa",
          "Carro"
        ],
        "ans": 1,
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
        "q": "Ordem correta: 'name / is / my / Maria'",
        "opts": [
          "Maria is my name",
          "My name is Maria",
          "My Maria is name",
          "Is my name Maria"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Maria'",
        "opts": [
          "Boa noite",
          "Prazer em conhecer você, Maria",
          "Bom dia",
          "Até logo"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Maria' significa:",
        "opts": [
          "Onde você mora?",
          "Prazer em conhecer você, Maria",
          "Meu nome não é",
          "Qual seu nome?"
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
    "desc": "Aprenda festa e celebração - tradução correta",
    "time": "11 MIN",
    "phrase": "Hello, I am Maria",
    "translation": "Olá, eu sou Maria",
    "vocab": [
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
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
        "Good night!",
        "Despedida noite"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you!",
        "Conhecer alguém"
      ],
      [
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening!",
        "Chegada noite"
      ],
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Hi",
        "Oi",
        "Hi, nice to see you!",
        "Informal"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Festa e celebração</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Maria = Meu nome é Maria<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Festa e celebração</h5><p><b>Frase chave:</b> Hello, I am Maria = Olá, eu sou Maria</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Hello, I am Maria'",
        "opts": [
          "Olá, eu sou Maria",
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
        "q": "Quando usar 'Hello, I am Maria'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Qual é seu nome?",
          "Quantos anos?",
          "Onde mora?",
          "Como vai?"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Em 'Hello, I am Maria', qual é o nome?",
        "opts": [
          "Maria",
          "Carro",
          "John",
          "Casa"
        ],
        "ans": 0,
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
        "q": "Ordem correta: 'name / is / my / Maria'",
        "opts": [
          "My Maria is name",
          "Is my name Maria",
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
          "Bom dia",
          "Boa noite"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Maria' significa:",
        "opts": [
          "Onde você mora?",
          "Qual seu nome?",
          "Olá, eu sou Maria",
          "Meu nome não é"
        ],
        "ans": 2,
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
    "desc": "Aprenda filmes e música - tradução correta",
    "time": "12 MIN",
    "phrase": "Nice to meet you, Julia",
    "translation": "Prazer em conhecer você, Julia",
    "vocab": [
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
      ],
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night!",
        "Despedida noite"
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
        "Good morning!",
        "Até meio-dia"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "Hi",
        "Oi",
        "Hi, nice to see you!",
        "Informal"
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
        "Good evening!",
        "Chegada noite"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Filmes e música</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Julia = Meu nome é Julia<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Filmes e música</h5><p><b>Frase chave:</b> Nice to meet you, Julia = Prazer em conhecer você, Julia</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Nice to meet you, Julia'",
        "opts": [
          "Até logo",
          "Boa noite",
          "Bom dia",
          "Prazer em conhecer você, Julia"
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
        "q": "Complete: 'Hello, my ___ is Julia'",
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
        "q": "Quando usar 'Nice to meet you, Julia'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Como vai?",
          "Qual é seu nome?",
          "Onde mora?",
          "Quantos anos?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Em 'Nice to meet you, Julia', qual é o nome?",
        "opts": [
          "Carro",
          "John",
          "Casa",
          "Julia"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Julia'",
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
        "q": "Ordem correta: 'name / is / my / Julia'",
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
          "Boa noite",
          "Até logo",
          "Bom dia",
          "Prazer em conhecer você, Julia"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Julia' significa:",
        "opts": [
          "Onde você mora?",
          "Qual seu nome?",
          "Meu nome não é",
          "Prazer em conhecer você, Julia"
        ],
        "ans": 3,
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
    "desc": "Aprenda esportes - tradução correta",
    "time": "13 MIN",
    "phrase": "Good morning, I am Sarah",
    "translation": "Bom dia, eu sou Sarah",
    "vocab": [
      [
        "Hi",
        "Oi",
        "Hi, nice to see you!",
        "Informal"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you!",
        "Conhecer alguém"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon!",
        "Tarde"
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
        "Good night!",
        "Despedida noite"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you!",
        "Agradecimento"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Esportes</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Sarah = Meu nome é Sarah<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Esportes</h5><p><b>Frase chave:</b> Good morning, I am Sarah = Bom dia, eu sou Sarah</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Good morning, I am Sarah'",
        "opts": [
          "Até logo",
          "Bom dia",
          "Bom dia, eu sou Sarah",
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
        "q": "Quando usar 'Good morning, I am Sarah'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Como vai?",
          "Quantos anos?",
          "Qual é seu nome?",
          "Onde mora?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Em 'Good morning, I am Sarah', qual é o nome?",
        "opts": [
          "Casa",
          "John",
          "Sarah",
          "Carro"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Sarah'",
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
        "q": "Ordem correta: 'name / is / my / Sarah'",
        "opts": [
          "Sarah is my name",
          "My name is Sarah",
          "Is my name Sarah",
          "My Sarah is name"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Sarah'",
        "opts": [
          "Até logo",
          "Prazer em conhecer você, Sarah",
          "Bom dia",
          "Boa noite"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Sarah' significa:",
        "opts": [
          "Qual seu nome?",
          "Bom dia, eu sou Sarah",
          "Meu nome não é",
          "Onde você mora?"
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
    "desc": "Aprenda viagem curta - tradução correta",
    "time": "6 MIN",
    "phrase": "I am John",
    "translation": "Eu sou John",
    "vocab": [
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you!",
        "Conhecer alguém"
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
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ],
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night!",
        "Despedida noite"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning!",
        "Até meio-dia"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Viagem curta</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is John = Meu nome é John<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Viagem curta</h5><p><b>Frase chave:</b> I am John = Eu sou John</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'I am John'",
        "opts": [
          "Boa noite",
          "Eu sou John",
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
          "Onde mora",
          "Como vai",
          "Meu nome é"
        ],
        "ans": 3,
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
        "q": "Quando usar 'I am John'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Goodbye",
          "Thank you",
          "My name is John",
          "I am fine"
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
        "q": "Em 'I am John', qual é o nome?",
        "opts": [
          "John",
          "Carro",
          "Casa",
          "Mike"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ John'",
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
        "q": "Ordem correta: 'name / is / my / John'",
        "opts": [
          "My name is John",
          "John is my name",
          "Is my name John",
          "My John is name"
        ],
        "ans": 0,
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
          "Meu nome não é",
          "Qual seu nome?",
          "Eu sou John",
          "Onde você mora?"
        ],
        "ans": 2,
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
    "desc": "Aprenda cultura local - tradução correta",
    "time": "7 MIN",
    "phrase": "I am Maria",
    "translation": "Eu sou Maria",
    "vocab": [
      [
        "Good night",
        "Boa noite",
        "Good night!",
        "Despedida noite"
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
        "Good afternoon",
        "Boa tarde",
        "Good afternoon!",
        "Tarde"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening!",
        "Chegada noite"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me!",
        "Chamar atenção"
      ],
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Cultura local</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Maria = Meu nome é Maria<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Cultura local</h5><p><b>Frase chave:</b> I am Maria = Eu sou Maria</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'I am Maria'",
        "opts": [
          "Boa noite",
          "Eu sou Maria",
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
          "Meu nome é",
          "Como vai",
          "Quantos anos"
        ],
        "ans": 1,
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
        "q": "Quando usar 'I am Maria'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Goodbye",
          "My name is Maria"
        ],
        "ans": 3,
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
        "q": "Em 'I am Maria', qual é o nome?",
        "opts": [
          "John",
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
          "be",
          "is",
          "am"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Ordem correta: 'name / is / my / Maria'",
        "opts": [
          "Is my name Maria",
          "Maria is my name",
          "My Maria is name",
          "My name is Maria"
        ],
        "ans": 3,
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
          "Onde você mora?",
          "Eu sou Maria",
          "Qual seu nome?",
          "Meu nome não é"
        ],
        "ans": 1,
        "type": "translation"
      }
    ]
  },
  {
    "id": 51,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Apresentação no trabalho",
    "desc": "Aprenda apresentação no trabalho - tradução correta",
    "time": "8 MIN",
    "phrase": "My name is Sarah",
    "translation": "Meu nome é Sarah",
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
        "Hi",
        "Oi",
        "Hi, nice to see you!",
        "Informal"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night!",
        "Despedida noite"
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
        "Thank you!",
        "Agradecimento"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you!",
        "Conhecer alguém"
      ],
      [
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Apresentação no trabalho</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Sarah = Meu nome é Sarah<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Apresentação no trabalho</h5><p><b>Frase chave:</b> My name is Sarah = Meu nome é Sarah</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'My name is Sarah'",
        "opts": [
          "Boa noite",
          "Até logo",
          "Bom dia",
          "Meu nome é Sarah"
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
        "q": "Complete: 'Hello, my ___ is Sarah'",
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
        "q": "Quando usar 'My name is Sarah'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "My name is Sarah",
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
          "Onde mora?",
          "Como vai?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Em 'My name is Sarah', qual é o nome?",
        "opts": [
          "Sarah",
          "Casa",
          "John",
          "Carro"
        ],
        "ans": 0,
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
        "q": "Ordem correta: 'name / is / my / Sarah'",
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
          "Meu nome é Sarah",
          "Onde você mora?",
          "Meu nome não é",
          "Qual seu nome?"
        ],
        "ans": 0,
        "type": "translation"
      }
    ]
  },
  {
    "id": 52,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Primeiro dia",
    "desc": "Aprenda primeiro dia - tradução correta",
    "time": "9 MIN",
    "phrase": "Good morning, I am Lucas",
    "translation": "Bom dia, eu sou Lucas",
    "vocab": [
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon!",
        "Tarde"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night!",
        "Despedida noite"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ],
      [
        "Hi",
        "Oi",
        "Hi, nice to see you!",
        "Informal"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Primeiro dia</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Lucas = Meu nome é Lucas<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Primeiro dia</h5><p><b>Frase chave:</b> Good morning, I am Lucas = Bom dia, eu sou Lucas</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Good morning, I am Lucas'",
        "opts": [
          "Até logo",
          "Bom dia",
          "Boa noite",
          "Bom dia, eu sou Lucas"
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
          "bad",
          "big",
          "good",
          "name"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Good morning, I am Lucas'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "My name is Lucas",
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
        "q": "Em 'Good morning, I am Lucas', qual é o nome?",
        "opts": [
          "Lucas",
          "Carro",
          "Casa",
          "John"
        ],
        "ans": 0,
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
        "q": "Ordem correta: 'name / is / my / Lucas'",
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
          "Meu nome não é",
          "Qual seu nome?",
          "Bom dia, eu sou Lucas",
          "Onde você mora?"
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
    "title": "Reunião de equipe",
    "desc": "Aprenda reunião de equipe - tradução correta",
    "time": "10 MIN",
    "phrase": "My name is Carlos",
    "translation": "Meu nome é Carlos",
    "vocab": [
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon!",
        "Tarde"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening!",
        "Chegada noite"
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
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you!",
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
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Hi",
        "Oi",
        "Hi, nice to see you!",
        "Informal"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Reunião de equipe</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Carlos = Meu nome é Carlos<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Reunião de equipe</h5><p><b>Frase chave:</b> My name is Carlos = Meu nome é Carlos</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'My name is Carlos'",
        "opts": [
          "Bom dia",
          "Meu nome é Carlos",
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
          "Meu nome é",
          "Onde mora"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Carlos'",
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
        "q": "Quando usar 'My name is Carlos'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "My name is Carlos",
          "I am fine"
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
        "q": "Em 'My name is Carlos', qual é o nome?",
        "opts": [
          "Casa",
          "Carro",
          "John",
          "Carlos"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Carlos'",
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
        "q": "Ordem correta: 'name / is / my / Carlos'",
        "opts": [
          "Carlos is my name",
          "My name is Carlos",
          "Is my name Carlos",
          "My Carlos is name"
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
          "Onde você mora?",
          "Meu nome não é",
          "Qual seu nome?",
          "Meu nome é Carlos"
        ],
        "ans": 3,
        "type": "translation"
      }
    ]
  },
  {
    "id": 54,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Email profissional",
    "desc": "Aprenda email profissional - tradução correta",
    "time": "11 MIN",
    "phrase": "Hello, I am Sofia",
    "translation": "Olá, eu sou Sofia",
    "vocab": [
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you!",
        "Conhecer alguém"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me!",
        "Chamar atenção"
      ],
      [
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
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
        "Thank you",
        "Obrigado",
        "Thank you!",
        "Agradecimento"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Hi",
        "Oi",
        "Hi, nice to see you!",
        "Informal"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening!",
        "Chegada noite"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Email profissional</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Sofia = Meu nome é Sofia<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Email profissional</h5><p><b>Frase chave:</b> Hello, I am Sofia = Olá, eu sou Sofia</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Hello, I am Sofia'",
        "opts": [
          "Boa noite",
          "Bom dia",
          "Olá, eu sou Sofia",
          "Até logo"
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
          "big",
          "bad",
          "name",
          "good"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, I am Sofia'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Qual é seu nome?",
          "Quantos anos?",
          "Onde mora?",
          "Como vai?"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Em 'Hello, I am Sofia', qual é o nome?",
        "opts": [
          "Casa",
          "Sofia",
          "John",
          "Carro"
        ],
        "ans": 1,
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
        "q": "Ordem correta: 'name / is / my / Sofia'",
        "opts": [
          "My Sofia is name",
          "My name is Sofia",
          "Is my name Sofia",
          "Sofia is my name"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Sofia'",
        "opts": [
          "Prazer em conhecer você, Sofia",
          "Até logo",
          "Boa noite",
          "Bom dia"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Sofia' significa:",
        "opts": [
          "Meu nome não é",
          "Onde você mora?",
          "Olá, eu sou Sofia",
          "Qual seu nome?"
        ],
        "ans": 2,
        "type": "translation"
      }
    ]
  },
  {
    "id": 55,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Entrevista",
    "desc": "Aprenda entrevista - tradução correta",
    "time": "12 MIN",
    "phrase": "Nice to meet you, Sarah",
    "translation": "Prazer em conhecer você, Sarah",
    "vocab": [
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you!",
        "Conhecer alguém"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you!",
        "Agradecimento"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Hi",
        "Oi",
        "Hi, nice to see you!",
        "Informal"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night!",
        "Despedida noite"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Entrevista</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Sarah = Meu nome é Sarah<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Entrevista</h5><p><b>Frase chave:</b> Nice to meet you, Sarah = Prazer em conhecer você, Sarah</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Nice to meet you, Sarah'",
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
          "good",
          "bad",
          "big"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Nice to meet you, Sarah'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "I am fine",
          "Goodbye",
          "My name is Sarah"
        ],
        "ans": 3,
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
        "q": "Em 'Nice to meet you, Sarah', qual é o nome?",
        "opts": [
          "Casa",
          "Carro",
          "Sarah",
          "John"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Sarah'",
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
        "q": "Ordem correta: 'name / is / my / Sarah'",
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
          "Prazer em conhecer você, Sarah",
          "Onde você mora?"
        ],
        "ans": 2,
        "type": "translation"
      }
    ]
  },
  {
    "id": 56,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Negociação",
    "desc": "Aprenda negociação - tradução correta",
    "time": "13 MIN",
    "phrase": "I am Emma",
    "translation": "Eu sou Emma",
    "vocab": [
      [
        "Excuse me",
        "Com licença",
        "Excuse me!",
        "Chamar atenção"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening!",
        "Chegada noite"
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
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ],
      [
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon!",
        "Tarde"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Negociação</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Emma = Meu nome é Emma<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Negociação</h5><p><b>Frase chave:</b> I am Emma = Eu sou Emma</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'I am Emma'",
        "opts": [
          "Bom dia",
          "Até logo",
          "Boa noite",
          "Eu sou Emma"
        ],
        "ans": 3,
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
        "q": "Complete: 'Hello, my ___ is Emma'",
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
        "q": "Quando usar 'I am Emma'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Como vai?",
          "Onde mora?"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Em 'I am Emma', qual é o nome?",
        "opts": [
          "Emma",
          "Casa",
          "John",
          "Carro"
        ],
        "ans": 0,
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
        "q": "Ordem correta: 'name / is / my / Emma'",
        "opts": [
          "My name is Emma",
          "My Emma is name",
          "Is my name Emma",
          "Emma is my name"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Emma'",
        "opts": [
          "Até logo",
          "Boa noite",
          "Prazer em conhecer você, Emma",
          "Bom dia"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Emma' significa:",
        "opts": [
          "Onde você mora?",
          "Qual seu nome?",
          "Meu nome não é",
          "Eu sou Emma"
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
    "title": "Atendimento ao cliente",
    "desc": "Aprenda atendimento ao cliente - tradução correta",
    "time": "6 MIN",
    "phrase": "Good morning, I am Julia",
    "translation": "Bom dia, eu sou Julia",
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
        "Excuse me!",
        "Chamar atenção"
      ],
      [
        "Hi",
        "Oi",
        "Hi, nice to see you!",
        "Informal"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you!",
        "Conhecer alguém"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
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
        "Good night!",
        "Despedida noite"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Atendimento ao cliente</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Julia = Meu nome é Julia<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Atendimento ao cliente</h5><p><b>Frase chave:</b> Good morning, I am Julia = Bom dia, eu sou Julia</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Good morning, I am Julia'",
        "opts": [
          "Até logo",
          "Bom dia, eu sou Julia",
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
          "Quantos anos",
          "Onde mora"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Julia'",
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
        "q": "Quando usar 'Good morning, I am Julia'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
        "q": "Em 'Good morning, I am Julia', qual é o nome?",
        "opts": [
          "John",
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
        "q": "Ordem correta: 'name / is / my / Julia'",
        "opts": [
          "Julia is my name",
          "My name is Julia",
          "Is my name Julia",
          "My Julia is name"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Julia'",
        "opts": [
          "Prazer em conhecer você, Julia",
          "Até logo",
          "Bom dia",
          "Boa noite"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Julia' significa:",
        "opts": [
          "Meu nome não é",
          "Bom dia, eu sou Julia",
          "Onde você mora?",
          "Qual seu nome?"
        ],
        "ans": 1,
        "type": "translation"
      }
    ]
  },
  {
    "id": 58,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Feedback",
    "desc": "Aprenda feedback - tradução correta",
    "time": "7 MIN",
    "phrase": "My name is Sarah",
    "translation": "Meu nome é Sarah",
    "vocab": [
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Hi",
        "Oi",
        "Hi, nice to see you!",
        "Informal"
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
        "Thank you",
        "Obrigado",
        "Thank you!",
        "Agradecimento"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning!",
        "Até meio-dia"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon!",
        "Tarde"
      ],
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
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
        "Nice to meet you!",
        "Conhecer alguém"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Feedback</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Sarah = Meu nome é Sarah<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Feedback</h5><p><b>Frase chave:</b> My name is Sarah = Meu nome é Sarah</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'My name is Sarah'",
        "opts": [
          "Até logo",
          "Meu nome é Sarah",
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
          "bad",
          "name",
          "good",
          "big"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Quando usar 'My name is Sarah'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Como vai?",
          "Quantos anos?",
          "Onde mora?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Em 'My name is Sarah', qual é o nome?",
        "opts": [
          "Casa",
          "Carro",
          "Sarah",
          "John"
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
        "q": "Ordem correta: 'name / is / my / Sarah'",
        "opts": [
          "Sarah is my name",
          "My name is Sarah",
          "Is my name Sarah",
          "My Sarah is name"
        ],
        "ans": 1,
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
          "Meu nome é Sarah",
          "Qual seu nome?",
          "Meu nome não é",
          "Onde você mora?"
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
    "title": "Desculpas profissionais",
    "desc": "Aprenda desculpas profissionais - tradução correta",
    "time": "8 MIN",
    "phrase": "Hello, I am Julia",
    "translation": "Olá, eu sou Julia",
    "vocab": [
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon!",
        "Tarde"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Hi",
        "Oi",
        "Hi, nice to see you!",
        "Informal"
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
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ],
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night!",
        "Despedida noite"
      ],
      [
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Desculpas profissionais</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Julia = Meu nome é Julia<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Desculpas profissionais</h5><p><b>Frase chave:</b> Hello, I am Julia = Olá, eu sou Julia</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Hello, I am Julia'",
        "opts": [
          "Bom dia",
          "Olá, eu sou Julia",
          "Até logo",
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
          "Meu nome é",
          "Quantos anos"
        ],
        "ans": 2,
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
        "q": "Quando usar 'Hello, I am Julia'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Como vai?",
          "Onde mora?",
          "Qual é seu nome?",
          "Quantos anos?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Em 'Hello, I am Julia', qual é o nome?",
        "opts": [
          "Julia",
          "Carro",
          "John",
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
          "is",
          "are"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Ordem correta: 'name / is / my / Julia'",
        "opts": [
          "Julia is my name",
          "My Julia is name",
          "My name is Julia",
          "Is my name Julia"
        ],
        "ans": 2,
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
          "Onde você mora?",
          "Meu nome não é",
          "Qual seu nome?",
          "Olá, eu sou Julia"
        ],
        "ans": 3,
        "type": "translation"
      }
    ]
  },
  {
    "id": 60,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Elogios",
    "desc": "Aprenda elogios - tradução correta",
    "time": "9 MIN",
    "phrase": "Hello, my name is Lucas",
    "translation": "Olá, meu nome é Lucas",
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
        "Thank you!",
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
        "Good afternoon!",
        "Tarde"
      ],
      [
        "Hi",
        "Oi",
        "Hi, nice to see you!",
        "Informal"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me!",
        "Chamar atenção"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning!",
        "Até meio-dia"
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
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Elogios</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Lucas = Meu nome é Lucas<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Elogios</h5><p><b>Frase chave:</b> Hello, my name is Lucas = Olá, meu nome é Lucas</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Hello, my name is Lucas'",
        "opts": [
          "Até logo",
          "Boa noite",
          "Olá, meu nome é Lucas",
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
          "Ao comer",
          "Ao dirigir",
          "Ao dormir"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Qual palavra significa 'Olá'?",
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
          "My name is Lucas",
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
        "q": "Em 'Hello, my name is Lucas', qual é o nome?",
        "opts": [
          "John",
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
          "is",
          "am",
          "be",
          "are"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Ordem correta: 'name / is / my / Lucas'",
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
          "Onde você mora?",
          "Meu nome não é",
          "Qual seu nome?",
          "Olá, meu nome é Lucas"
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
    "title": "Férias e folga",
    "desc": "Aprenda férias e folga - tradução correta",
    "time": "10 MIN",
    "phrase": "Hello, I am John",
    "translation": "Olá, eu sou John",
    "vocab": [
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you!",
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
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening!",
        "Chegada noite"
      ],
      [
        "Hi",
        "Oi",
        "Hi, nice to see you!",
        "Informal"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you!",
        "Agradecimento"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me!",
        "Chamar atenção"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Férias e folga</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is John = Meu nome é John<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Férias e folga</h5><p><b>Frase chave:</b> Hello, I am John = Olá, eu sou John</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Hello, I am John'",
        "opts": [
          "Até logo",
          "Olá, eu sou John",
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
        "q": "Quando usar 'Hello, I am John'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "My name is John",
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
        "q": "Em 'Hello, I am John', qual é o nome?",
        "opts": [
          "Casa",
          "John",
          "Carro",
          "Mike"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ John'",
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
        "q": "Ordem correta: 'name / is / my / John'",
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
          "Meu nome não é",
          "Qual seu nome?",
          "Onde você mora?",
          "Olá, eu sou John"
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
    "title": "Horário de trabalho",
    "desc": "Aprenda horário de trabalho - tradução correta",
    "time": "11 MIN",
    "phrase": "Hello, I am Lucas",
    "translation": "Olá, eu sou Lucas",
    "vocab": [
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
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
      ],
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ],
      [
        "Hi",
        "Oi",
        "Hi, nice to see you!",
        "Informal"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning!",
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
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me!",
        "Chamar atenção"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Horário de trabalho</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Lucas = Meu nome é Lucas<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Horário de trabalho</h5><p><b>Frase chave:</b> Hello, I am Lucas = Olá, eu sou Lucas</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Hello, I am Lucas'",
        "opts": [
          "Olá, eu sou Lucas",
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
          "good",
          "big",
          "bad"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, I am Lucas'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Quantos anos?",
          "Onde mora?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Em 'Hello, I am Lucas', qual é o nome?",
        "opts": [
          "Carro",
          "Casa",
          "John",
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
          "am",
          "are"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Ordem correta: 'name / is / my / Lucas'",
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
          "Qual seu nome?",
          "Olá, eu sou Lucas",
          "Onde você mora?",
          "Meu nome não é"
        ],
        "ans": 1,
        "type": "translation"
      }
    ]
  },
  {
    "id": 63,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Projetos e prazos",
    "desc": "Aprenda projetos e prazos - tradução correta",
    "time": "12 MIN",
    "phrase": "I am Miguel",
    "translation": "Eu sou Miguel",
    "vocab": [
      [
        "Good evening",
        "Boa noite",
        "Good evening!",
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
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night!",
        "Despedida noite"
      ],
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ],
      [
        "Hi",
        "Oi",
        "Hi, nice to see you!",
        "Informal"
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
        "Excuse me!",
        "Chamar atenção"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Projetos e prazos</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Miguel = Meu nome é Miguel<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Projetos e prazos</h5><p><b>Frase chave:</b> I am Miguel = Eu sou Miguel</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'I am Miguel'",
        "opts": [
          "Eu sou Miguel",
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
          "big",
          "bad",
          "name",
          "good"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Quando usar 'I am Miguel'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Onde mora?",
          "Quantos anos?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Em 'I am Miguel', qual é o nome?",
        "opts": [
          "Casa",
          "Carro",
          "Miguel",
          "John"
        ],
        "ans": 2,
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
        "q": "Ordem correta: 'name / is / my / Miguel'",
        "opts": [
          "My name is Miguel",
          "My Miguel is name",
          "Is my name Miguel",
          "Miguel is my name"
        ],
        "ans": 0,
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
          "Eu sou Miguel",
          "Meu nome não é",
          "Qual seu nome?",
          "Onde você mora?"
        ],
        "ans": 0,
        "type": "translation"
      }
    ]
  },
  {
    "id": 64,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Trabalho em equipe",
    "desc": "Aprenda trabalho em equipe - tradução correta",
    "time": "13 MIN",
    "phrase": "Good morning, I am Sofia",
    "translation": "Bom dia, eu sou Sofia",
    "vocab": [
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you!",
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
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me!",
        "Chamar atenção"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night!",
        "Despedida noite"
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
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening!",
        "Chegada noite"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Trabalho em equipe</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Sofia = Meu nome é Sofia<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Trabalho em equipe</h5><p><b>Frase chave:</b> Good morning, I am Sofia = Bom dia, eu sou Sofia</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Good morning, I am Sofia'",
        "opts": [
          "Bom dia, eu sou Sofia",
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
          "big",
          "bad",
          "name"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Good morning, I am Sofia'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Qual é seu nome?",
          "Onde mora?",
          "Quantos anos?",
          "Como vai?"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Em 'Good morning, I am Sofia', qual é o nome?",
        "opts": [
          "Carro",
          "John",
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
          "be",
          "are",
          "is"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Ordem correta: 'name / is / my / Sofia'",
        "opts": [
          "My name is Sofia",
          "My Sofia is name",
          "Sofia is my name",
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
          "Bom dia, eu sou Sofia",
          "Onde você mora?",
          "Meu nome não é"
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
    "title": "Liderança",
    "desc": "Aprenda liderança - tradução correta",
    "time": "6 MIN",
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
        "Good afternoon",
        "Boa tarde",
        "Good afternoon!",
        "Tarde"
      ],
      [
        "Hi",
        "Oi",
        "Hi, nice to see you!",
        "Informal"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning!",
        "Até meio-dia"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
      ],
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
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
        "Nice to meet you!",
        "Conhecer alguém"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening!",
        "Chegada noite"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Liderança</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Ana = Meu nome é Ana<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Liderança</h5><p><b>Frase chave:</b> Hello, my name is Ana = Olá, meu nome é Ana</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Hello, my name is Ana'",
        "opts": [
          "Olá, meu nome é Ana",
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
          "Meu nome é",
          "Como vai"
        ],
        "ans": 2,
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
          "Ao se apresentar",
          "Ao dirigir",
          "Ao dormir"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Qual palavra significa 'Olá'?",
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
          "Onde mora?",
          "Quantos anos?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Em 'Hello, my name is Ana', qual é o nome?",
        "opts": [
          "John",
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
          "is",
          "be",
          "are",
          "am"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Ordem correta: 'name / is / my / Ana'",
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
          "Até logo",
          "Boa noite",
          "Bom dia",
          "Prazer em conhecer você, Ana"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Ana' significa:",
        "opts": [
          "Olá, meu nome é Ana",
          "Onde você mora?",
          "Qual seu nome?",
          "Meu nome não é"
        ],
        "ans": 0,
        "type": "translation"
      }
    ]
  },
  {
    "id": 66,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Resolvendo problemas",
    "desc": "Aprenda resolvendo problemas - tradução correta",
    "time": "7 MIN",
    "phrase": "Good morning, I am John",
    "translation": "Bom dia, eu sou John",
    "vocab": [
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you!",
        "Conhecer alguém"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning!",
        "Até meio-dia"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you!",
        "Agradecimento"
      ],
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me!",
        "Chamar atenção"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night!",
        "Despedida noite"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon!",
        "Tarde"
      ],
      [
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
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
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Resolvendo problemas</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is John = Meu nome é John<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Resolvendo problemas</h5><p><b>Frase chave:</b> Good morning, I am John = Bom dia, eu sou John</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Good morning, I am John'",
        "opts": [
          "Até logo",
          "Bom dia",
          "Boa noite",
          "Bom dia, eu sou John"
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
          "bad",
          "name",
          "good",
          "big"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Good morning, I am John'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Goodbye",
          "I am fine",
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
          "Onde mora?",
          "Como vai?"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Em 'Good morning, I am John', qual é o nome?",
        "opts": [
          "Mike",
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
          "am",
          "is",
          "be",
          "are"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Ordem correta: 'name / is / my / John'",
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
          "Bom dia, eu sou John",
          "Meu nome não é",
          "Qual seu nome?",
          "Onde você mora?"
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
    "title": "Decisões",
    "desc": "Aprenda decisões - tradução correta",
    "time": "8 MIN",
    "phrase": "My name is Sarah",
    "translation": "Meu nome é Sarah",
    "vocab": [
      [
        "Thank you",
        "Obrigado",
        "Thank you!",
        "Agradecimento"
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
        "Good evening!",
        "Chegada noite"
      ],
      [
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
      ],
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
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
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you!",
        "Conhecer alguém"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Decisões</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Sarah = Meu nome é Sarah<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Decisões</h5><p><b>Frase chave:</b> My name is Sarah = Meu nome é Sarah</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'My name is Sarah'",
        "opts": [
          "Boa noite",
          "Meu nome é Sarah",
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
        "q": "Quando usar 'My name is Sarah'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
        "q": "Em 'My name is Sarah', qual é o nome?",
        "opts": [
          "Casa",
          "John",
          "Sarah",
          "Carro"
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
        "q": "Ordem correta: 'name / is / my / Sarah'",
        "opts": [
          "My name is Sarah",
          "My Sarah is name",
          "Sarah is my name",
          "Is my name Sarah"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Sarah'",
        "opts": [
          "Bom dia",
          "Boa noite",
          "Prazer em conhecer você, Sarah",
          "Até logo"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Sarah' significa:",
        "opts": [
          "Qual seu nome?",
          "Onde você mora?",
          "Meu nome não é",
          "Meu nome é Sarah"
        ],
        "ans": 3,
        "type": "translation"
      }
    ]
  },
  {
    "id": 68,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Metas e objetivos",
    "desc": "Aprenda metas e objetivos - tradução correta",
    "time": "9 MIN",
    "phrase": "Hello, my name is Carlos",
    "translation": "Olá, meu nome é Carlos",
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
        "Thank you!",
        "Agradecimento"
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
        "Excuse me",
        "Com licença",
        "Excuse me!",
        "Chamar atenção"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
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
        "Good evening!",
        "Chegada noite"
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
        "Good morning!",
        "Até meio-dia"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Metas e objetivos</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Carlos = Meu nome é Carlos<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Metas e objetivos</h5><p><b>Frase chave:</b> Hello, my name is Carlos = Olá, meu nome é Carlos</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Hello, my name is Carlos'",
        "opts": [
          "Até logo",
          "Bom dia",
          "Olá, meu nome é Carlos",
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
        "q": "Complete: 'Hello, my ___ is Carlos'",
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
        "q": "Quando usar 'Hello, my name is Carlos'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Goodbye",
          "My name is Carlos"
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
        "q": "Em 'Hello, my name is Carlos', qual é o nome?",
        "opts": [
          "Carlos",
          "Casa",
          "Carro",
          "John"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Carlos'",
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
        "q": "Ordem correta: 'name / is / my / Carlos'",
        "opts": [
          "Carlos is my name",
          "My name is Carlos",
          "My Carlos is name",
          "Is my name Carlos"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Carlos'",
        "opts": [
          "Boa noite",
          "Prazer em conhecer você, Carlos",
          "Bom dia",
          "Até logo"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Carlos' significa:",
        "opts": [
          "Qual seu nome?",
          "Onde você mora?",
          "Olá, meu nome é Carlos",
          "Meu nome não é"
        ],
        "ans": 2,
        "type": "translation"
      }
    ]
  },
  {
    "id": 69,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Produtividade",
    "desc": "Aprenda produtividade - tradução correta",
    "time": "10 MIN",
    "phrase": "I am Miguel",
    "translation": "Eu sou Miguel",
    "vocab": [
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you!",
        "Conhecer alguém"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night!",
        "Despedida noite"
      ],
      [
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon!",
        "Tarde"
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
        "Excuse me!",
        "Chamar atenção"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Hi",
        "Oi",
        "Hi, nice to see you!",
        "Informal"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you!",
        "Agradecimento"
      ],
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Produtividade</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Miguel = Meu nome é Miguel<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Produtividade</h5><p><b>Frase chave:</b> I am Miguel = Eu sou Miguel</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'I am Miguel'",
        "opts": [
          "Até logo",
          "Bom dia",
          "Eu sou Miguel",
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
        "q": "Quando usar 'I am Miguel'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Goodbye",
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
        "q": "Em 'I am Miguel', qual é o nome?",
        "opts": [
          "Carro",
          "Miguel",
          "John",
          "Casa"
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
        "q": "Ordem correta: 'name / is / my / Miguel'",
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
          "Boa noite",
          "Até logo",
          "Prazer em conhecer você, Miguel",
          "Bom dia"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Miguel' significa:",
        "opts": [
          "Onde você mora?",
          "Eu sou Miguel",
          "Meu nome não é",
          "Qual seu nome?"
        ],
        "ans": 1,
        "type": "translation"
      }
    ]
  },
  {
    "id": 70,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Networking",
    "desc": "Aprenda networking - tradução correta",
    "time": "11 MIN",
    "phrase": "Nice to meet you, Sofia",
    "translation": "Prazer em conhecer você, Sofia",
    "vocab": [
      [
        "Hi",
        "Oi",
        "Hi, nice to see you!",
        "Informal"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me!",
        "Chamar atenção"
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
        "Thank you!",
        "Agradecimento"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning!",
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
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening!",
        "Chegada noite"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Networking</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Sofia = Meu nome é Sofia<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Networking</h5><p><b>Frase chave:</b> Nice to meet you, Sofia = Prazer em conhecer você, Sofia</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Nice to meet you, Sofia'",
        "opts": [
          "Até logo",
          "Prazer em conhecer você, Sofia",
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
        "q": "Quando usar 'Nice to meet you, Sofia'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "My name is Sofia",
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
          "Quantos anos?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Em 'Nice to meet you, Sofia', qual é o nome?",
        "opts": [
          "John",
          "Sofia",
          "Casa",
          "Carro"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Sofia'",
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
        "q": "Ordem correta: 'name / is / my / Sofia'",
        "opts": [
          "Sofia is my name",
          "Is my name Sofia",
          "My Sofia is name",
          "My name is Sofia"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Sofia'",
        "opts": [
          "Prazer em conhecer você, Sofia",
          "Boa noite",
          "Até logo",
          "Bom dia"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Sofia' significa:",
        "opts": [
          "Onde você mora?",
          "Meu nome não é",
          "Prazer em conhecer você, Sofia",
          "Qual seu nome?"
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
    "title": "Vendas e apresentação",
    "desc": "Aprenda vendas e apresentação - tradução correta",
    "time": "12 MIN",
    "phrase": "Good morning, I am Maria",
    "translation": "Bom dia, eu sou Maria",
    "vocab": [
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon!",
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
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Hi",
        "Oi",
        "Hi, nice to see you!",
        "Informal"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you!",
        "Conhecer alguém"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Vendas e apresentação</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Maria = Meu nome é Maria<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Vendas e apresentação</h5><p><b>Frase chave:</b> Good morning, I am Maria = Bom dia, eu sou Maria</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Good morning, I am Maria'",
        "opts": [
          "Até logo",
          "Bom dia, eu sou Maria",
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
          "Como vai",
          "Meu nome é",
          "Onde mora"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Maria'",
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
        "q": "Quando usar 'Good morning, I am Maria'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "I am fine",
          "My name is Maria",
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
          "Onde mora?",
          "Como vai?"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Em 'Good morning, I am Maria', qual é o nome?",
        "opts": [
          "Casa",
          "Maria",
          "Carro",
          "John"
        ],
        "ans": 1,
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
        "q": "Ordem correta: 'name / is / my / Maria'",
        "opts": [
          "Maria is my name",
          "My name is Maria",
          "Is my name Maria",
          "My Maria is name"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Maria'",
        "opts": [
          "Bom dia",
          "Prazer em conhecer você, Maria",
          "Até logo",
          "Boa noite"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Maria' significa:",
        "opts": [
          "Meu nome não é",
          "Onde você mora?",
          "Bom dia, eu sou Maria",
          "Qual seu nome?"
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
    "title": "Reclamação e solução",
    "desc": "Aprenda reclamação e solução - tradução correta",
    "time": "13 MIN",
    "phrase": "Nice to meet you, David",
    "translation": "Prazer em conhecer você, David",
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
        "Nice to meet you!",
        "Conhecer alguém"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you!",
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
        "Good evening",
        "Boa noite",
        "Good evening!",
        "Chegada noite"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Reclamação e solução</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is David = Meu nome é David<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Reclamação e solução</h5><p><b>Frase chave:</b> Nice to meet you, David = Prazer em conhecer você, David</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Nice to meet you, David'",
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
        "q": "Complete: 'Hello, my ___ is David'",
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
        "q": "Quando usar 'Nice to meet you, David'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Como vai?",
          "Quantos anos?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Em 'Nice to meet you, David', qual é o nome?",
        "opts": [
          "David",
          "John",
          "Casa",
          "Carro"
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
        "q": "Ordem correta: 'name / is / my / David'",
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
          "Até logo",
          "Bom dia",
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
          "Onde você mora?",
          "Qual seu nome?",
          "Prazer em conhecer você, David"
        ],
        "ans": 3,
        "type": "translation"
      }
    ]
  },
  {
    "id": 73,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Concordando e discordando",
    "desc": "Aprenda concordando e discordando - tradução correta",
    "time": "6 MIN",
    "phrase": "Hello, my name is Sofia",
    "translation": "Olá, meu nome é Sofia",
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
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
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
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon!",
        "Tarde"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you!",
        "Agradecimento"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Concordando e discordando</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Sofia = Meu nome é Sofia<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Concordando e discordando</h5><p><b>Frase chave:</b> Hello, my name is Sofia = Olá, meu nome é Sofia</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Hello, my name is Sofia'",
        "opts": [
          "Boa noite",
          "Bom dia",
          "Olá, meu nome é Sofia",
          "Até logo"
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
        "q": "Complete: 'Hello, my ___ is Sofia'",
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
        "q": "Quando usar 'Hello, my name is Sofia'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "My name is Sofia",
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
        "q": "Em 'Hello, my name is Sofia', qual é o nome?",
        "opts": [
          "Casa",
          "John",
          "Carro",
          "Sofia"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Sofia'",
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
        "q": "Ordem correta: 'name / is / my / Sofia'",
        "opts": [
          "Sofia is my name",
          "Is my name Sofia",
          "My Sofia is name",
          "My name is Sofia"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Sofia'",
        "opts": [
          "Até logo",
          "Prazer em conhecer você, Sofia",
          "Boa noite",
          "Bom dia"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Sofia' significa:",
        "opts": [
          "Meu nome não é",
          "Qual seu nome?",
          "Onde você mora?",
          "Olá, meu nome é Sofia"
        ],
        "ans": 3,
        "type": "translation"
      }
    ]
  },
  {
    "id": 74,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Sugestões",
    "desc": "Aprenda sugestões - tradução correta",
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
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you!",
        "Agradecimento"
      ],
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me!",
        "Chamar atenção"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you!",
        "Conhecer alguém"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Sugestões</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Miguel = Meu nome é Miguel<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Sugestões</h5><p><b>Frase chave:</b> Hello, my name is Miguel = Olá, meu nome é Miguel</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Hello, my name is Miguel'",
        "opts": [
          "Boa noite",
          "Olá, meu nome é Miguel",
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
          "Onde mora",
          "Como vai"
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
          "Ao dirigir",
          "Ao dormir",
          "Ao se apresentar",
          "Ao comer"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Qual palavra significa 'Olá'?",
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
        "q": "Em 'Hello, my name is Miguel', qual é o nome?",
        "opts": [
          "Carro",
          "Miguel",
          "Casa",
          "John"
        ],
        "ans": 1,
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
        "q": "Ordem correta: 'name / is / my / Miguel'",
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
          "Olá, meu nome é Miguel",
          "Onde você mora?",
          "Qual seu nome?"
        ],
        "ans": 1,
        "type": "translation"
      }
    ]
  },
  {
    "id": 75,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Agradecimentos formais",
    "desc": "Aprenda agradecimentos formais - tradução correta",
    "time": "8 MIN",
    "phrase": "My name is David",
    "translation": "Meu nome é David",
    "vocab": [
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon!",
        "Tarde"
      ],
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me!",
        "Chamar atenção"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
      ],
      [
        "Hi",
        "Oi",
        "Hi, nice to see you!",
        "Informal"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you!",
        "Conhecer alguém"
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
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Agradecimentos formais</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is David = Meu nome é David<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Agradecimentos formais</h5><p><b>Frase chave:</b> My name is David = Meu nome é David</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'My name is David'",
        "opts": [
          "Até logo",
          "Meu nome é David",
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
          "Onde mora",
          "Quantos anos",
          "Meu nome é"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is David'",
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
        "q": "Quando usar 'My name is David'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Onde mora?",
          "Quantos anos?",
          "Qual é seu nome?",
          "Como vai?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Em 'My name is David', qual é o nome?",
        "opts": [
          "John",
          "Casa",
          "David",
          "Carro"
        ],
        "ans": 2,
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
        "q": "Ordem correta: 'name / is / my / David'",
        "opts": [
          "Is my name David",
          "David is my name",
          "My David is name",
          "My name is David"
        ],
        "ans": 3,
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
          "Qual seu nome?",
          "Meu nome não é",
          "Onde você mora?",
          "Meu nome é David"
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
    "title": "Despedida profissional",
    "desc": "Aprenda despedida profissional - tradução correta",
    "time": "9 MIN",
    "phrase": "Hello, my name is David",
    "translation": "Olá, meu nome é David",
    "vocab": [
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
      ],
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
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
        "Good evening!",
        "Chegada noite"
      ],
      [
        "Hi",
        "Oi",
        "Hi, nice to see you!",
        "Informal"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Despedida profissional</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is David = Meu nome é David<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Despedida profissional</h5><p><b>Frase chave:</b> Hello, my name is David = Olá, meu nome é David</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Hello, my name is David'",
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
          "Como vai",
          "Quantos anos",
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
          "name",
          "bad"
        ],
        "ans": 2,
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Quantos anos?",
          "Onde mora?",
          "Qual é seu nome?",
          "Como vai?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Em 'Hello, my name is David', qual é o nome?",
        "opts": [
          "Carro",
          "John",
          "Casa",
          "David"
        ],
        "ans": 3,
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
        "q": "Ordem correta: 'name / is / my / David'",
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
          "Meu nome não é",
          "Olá, meu nome é David",
          "Onde você mora?"
        ],
        "ans": 2,
        "type": "translation"
      }
    ]
  },
  {
    "id": 77,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Viagem de negócios",
    "desc": "Aprenda viagem de negócios - tradução correta",
    "time": "10 MIN",
    "phrase": "Nice to meet you, Lucas",
    "translation": "Prazer em conhecer você, Lucas",
    "vocab": [
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Hi",
        "Oi",
        "Hi, nice to see you!",
        "Informal"
      ],
      [
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night!",
        "Despedida noite"
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
        "Excuse me",
        "Com licença",
        "Excuse me!",
        "Chamar atenção"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning!",
        "Até meio-dia"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Viagem de negócios</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Lucas = Meu nome é Lucas<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Viagem de negócios</h5><p><b>Frase chave:</b> Nice to meet you, Lucas = Prazer em conhecer você, Lucas</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Nice to meet you, Lucas'",
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
          "good",
          "big",
          "bad"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Nice to meet you, Lucas'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Thank you",
          "Goodbye",
          "My name is Lucas"
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
        "q": "Em 'Nice to meet you, Lucas', qual é o nome?",
        "opts": [
          "Lucas",
          "John",
          "Carro",
          "Casa"
        ],
        "ans": 0,
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
        "q": "Ordem correta: 'name / is / my / Lucas'",
        "opts": [
          "Is my name Lucas",
          "My Lucas is name",
          "My name is Lucas",
          "Lucas is my name"
        ],
        "ans": 2,
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
          "Onde você mora?",
          "Prazer em conhecer você, Lucas",
          "Meu nome não é",
          "Qual seu nome?"
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
    "title": "Conferência",
    "desc": "Aprenda conferência - tradução correta",
    "time": "11 MIN",
    "phrase": "Good morning, I am Lucas",
    "translation": "Bom dia, eu sou Lucas",
    "vocab": [
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon!",
        "Tarde"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening!",
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
        "Nice to meet you!",
        "Conhecer alguém"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
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
        "Excuse me",
        "Com licença",
        "Excuse me!",
        "Chamar atenção"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Conferência</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Lucas = Meu nome é Lucas<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Conferência</h5><p><b>Frase chave:</b> Good morning, I am Lucas = Bom dia, eu sou Lucas</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Good morning, I am Lucas'",
        "opts": [
          "Bom dia",
          "Até logo",
          "Bom dia, eu sou Lucas",
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
        "q": "Complete: 'Hello, my ___ is Lucas'",
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
        "q": "Quando usar 'Good morning, I am Lucas'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Thank you",
          "My name is Lucas",
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
        "q": "Em 'Good morning, I am Lucas', qual é o nome?",
        "opts": [
          "Lucas",
          "John",
          "Casa",
          "Carro"
        ],
        "ans": 0,
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
        "q": "Ordem correta: 'name / is / my / Lucas'",
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
          "Bom dia, eu sou Lucas",
          "Onde você mora?",
          "Meu nome não é",
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
    "title": "Inglês para reuniões",
    "desc": "Aprenda inglês para reuniões - tradução correta",
    "time": "12 MIN",
    "phrase": "Hello, my name is Sarah",
    "translation": "Olá, meu nome é Sarah",
    "vocab": [
      [
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon!",
        "Tarde"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night!",
        "Despedida noite"
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
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning!",
        "Até meio-dia"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Inglês para reuniões</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Sarah = Meu nome é Sarah<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Inglês para reuniões</h5><p><b>Frase chave:</b> Hello, my name is Sarah = Olá, meu nome é Sarah</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Hello, my name is Sarah'",
        "opts": [
          "Olá, meu nome é Sarah",
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
          "good",
          "bad",
          "big",
          "name"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Sarah'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "I am fine",
          "My name is Sarah"
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
        "q": "Em 'Hello, my name is Sarah', qual é o nome?",
        "opts": [
          "John",
          "Sarah",
          "Casa",
          "Carro"
        ],
        "ans": 1,
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
        "q": "Ordem correta: 'name / is / my / Sarah'",
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
          "Olá, meu nome é Sarah",
          "Onde você mora?",
          "Meu nome não é",
          "Qual seu nome?"
        ],
        "ans": 0,
        "type": "translation"
      }
    ]
  },
  {
    "id": 80,
    "module": 1,
    "moduleName": "Conhecendo Pessoas",
    "level": "A1",
    "title": "Inglês para emails",
    "desc": "Aprenda inglês para emails - tradução correta",
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
        "Good night",
        "Boa noite",
        "Good night!",
        "Despedida noite"
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
        "Excuse me!",
        "Chamar atenção"
      ],
      [
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
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
        "Good afternoon!",
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
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Inglês para emails</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Julia = Meu nome é Julia<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Inglês para emails</h5><p><b>Frase chave:</b> Hello, my name is Julia = Olá, meu nome é Julia</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Hello, my name is Julia'",
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
          "bad",
          "good",
          "big",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Qual é seu nome?",
          "Quantos anos?",
          "Onde mora?",
          "Como vai?"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Em 'Hello, my name is Julia', qual é o nome?",
        "opts": [
          "John",
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
          "be",
          "are",
          "am",
          "is"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Ordem correta: 'name / is / my / Julia'",
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
          "Bom dia",
          "Prazer em conhecer você, Julia",
          "Até logo",
          "Boa noite"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Julia' significa:",
        "opts": [
          "Onde você mora?",
          "Qual seu nome?",
          "Olá, meu nome é Julia",
          "Meu nome não é"
        ],
        "ans": 2,
        "type": "translation"
      }
    ]
  },
  {
    "id": 81,
    "module": 2,
    "moduleName": "Vida Diária",
    "level": "A2",
    "title": "Olá e apresentações",
    "desc": "Aprenda olá e apresentações - tradução correta",
    "time": "6 MIN",
    "phrase": "Hello, I am Maria",
    "translation": "Olá, eu sou Maria",
    "vocab": [
      [
        "Excuse me",
        "Com licença",
        "Excuse me!",
        "Chamar atenção"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning!",
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
        "Thank you!",
        "Agradecimento"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night!",
        "Despedida noite"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Hi",
        "Oi",
        "Hi, nice to see you!",
        "Informal"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Olá e apresentações</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Maria = Meu nome é Maria<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Olá e apresentações</h5><p><b>Frase chave:</b> Hello, I am Maria = Olá, eu sou Maria</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Hello, I am Maria'",
        "opts": [
          "Olá, eu sou Maria",
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
          "Como vai",
          "Onde mora",
          "Quantos anos",
          "Meu nome é"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Maria'",
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
        "q": "Quando usar 'Hello, I am Maria'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "My name is Maria",
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
        "q": "Em 'Hello, I am Maria', qual é o nome?",
        "opts": [
          "Casa",
          "Carro",
          "Maria",
          "John"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Maria'",
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
        "q": "Ordem correta: 'name / is / my / Maria'",
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
          "Olá, eu sou Maria",
          "Onde você mora?",
          "Qual seu nome?",
          "Meu nome não é"
        ],
        "ans": 0,
        "type": "translation"
      }
    ]
  },
  {
    "id": 82,
    "module": 2,
    "moduleName": "Vida Diária",
    "level": "A2",
    "title": "Dizendo seu nome",
    "desc": "Aprenda dizendo seu nome - tradução correta",
    "time": "7 MIN",
    "phrase": "Hello, my name is Sarah",
    "translation": "Olá, meu nome é Sarah",
    "vocab": [
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning!",
        "Até meio-dia"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me!",
        "Chamar atenção"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
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
        "Good afternoon!",
        "Tarde"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night!",
        "Despedida noite"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Dizendo seu nome</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Sarah = Meu nome é Sarah<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Dizendo seu nome</h5><p><b>Frase chave:</b> Hello, my name is Sarah = Olá, meu nome é Sarah</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Hello, my name is Sarah'",
        "opts": [
          "Olá, meu nome é Sarah",
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
        "q": "Complete: 'Hello, my ___ is Sarah'",
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
        "q": "Quando usar 'Hello, my name is Sarah'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Goodbye",
          "I am fine",
          "My name is Sarah"
        ],
        "ans": 3,
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
        "q": "Em 'Hello, my name is Sarah', qual é o nome?",
        "opts": [
          "Casa",
          "Carro",
          "Sarah",
          "John"
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
        "q": "Ordem correta: 'name / is / my / Sarah'",
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
          "Prazer em conhecer você, Sarah",
          "Boa noite",
          "Bom dia",
          "Até logo"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Sarah' significa:",
        "opts": [
          "Meu nome não é",
          "Olá, meu nome é Sarah",
          "Onde você mora?",
          "Qual seu nome?"
        ],
        "ans": 1,
        "type": "translation"
      }
    ]
  },
  {
    "id": 83,
    "module": 2,
    "moduleName": "Vida Diária",
    "level": "A2",
    "title": "De onde você é",
    "desc": "Aprenda de onde você é - tradução correta",
    "time": "8 MIN",
    "phrase": "Good morning, I am John",
    "translation": "Bom dia, eu sou John",
    "vocab": [
      [
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Hi",
        "Oi",
        "Hi, nice to see you!",
        "Informal"
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
        "Good afternoon!",
        "Tarde"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning!",
        "Até meio-dia"
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
        "Good night",
        "Boa noite",
        "Good night!",
        "Despedida noite"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: De onde você é</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is John = Meu nome é John<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: De onde você é</h5><p><b>Frase chave:</b> Good morning, I am John = Bom dia, eu sou John</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Good morning, I am John'",
        "opts": [
          "Boa noite",
          "Bom dia",
          "Até logo",
          "Bom dia, eu sou John"
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
        "q": "Quando usar 'Good morning, I am John'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Thank you",
          "My name is John",
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
        "q": "Em 'Good morning, I am John', qual é o nome?",
        "opts": [
          "Casa",
          "Mike",
          "John",
          "Carro"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ John'",
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
        "q": "Ordem correta: 'name / is / my / John'",
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
          "Boa noite",
          "Prazer em conhecer você, John"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is John' significa:",
        "opts": [
          "Bom dia, eu sou John",
          "Meu nome não é",
          "Qual seu nome?",
          "Onde você mora?"
        ],
        "ans": 0,
        "type": "translation"
      }
    ]
  },
  {
    "id": 84,
    "module": 2,
    "moduleName": "Vida Diária",
    "level": "A2",
    "title": "Perguntando o nome",
    "desc": "Aprenda perguntando o nome - tradução correta",
    "time": "9 MIN",
    "phrase": "Hello, my name is Lucas",
    "translation": "Olá, meu nome é Lucas",
    "vocab": [
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
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
        "Hi",
        "Oi",
        "Hi, nice to see you!",
        "Informal"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon!",
        "Tarde"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
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
        "Nice to meet you!",
        "Conhecer alguém"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Perguntando o nome</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Lucas = Meu nome é Lucas<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Perguntando o nome</h5><p><b>Frase chave:</b> Hello, my name is Lucas = Olá, meu nome é Lucas</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Hello, my name is Lucas'",
        "opts": [
          "Até logo",
          "Boa noite",
          "Olá, meu nome é Lucas",
          "Bom dia"
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
        "q": "Complete: 'Hello, my ___ is Lucas'",
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
        "q": "Quando usar 'Hello, my name is Lucas'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Como vai?",
          "Qual é seu nome?",
          "Onde mora?",
          "Quantos anos?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Em 'Hello, my name is Lucas', qual é o nome?",
        "opts": [
          "Lucas",
          "Casa",
          "John",
          "Carro"
        ],
        "ans": 0,
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
        "q": "Ordem correta: 'name / is / my / Lucas'",
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
          "Boa noite",
          "Prazer em conhecer você, Lucas",
          "Até logo",
          "Bom dia"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Lucas' significa:",
        "opts": [
          "Onde você mora?",
          "Meu nome não é",
          "Qual seu nome?",
          "Olá, meu nome é Lucas"
        ],
        "ans": 3,
        "type": "translation"
      }
    ]
  },
  {
    "id": 85,
    "module": 2,
    "moduleName": "Vida Diária",
    "level": "A2",
    "title": "Idade e aniversário",
    "desc": "Aprenda idade e aniversário - tradução correta",
    "time": "10 MIN",
    "phrase": "I am David",
    "translation": "Eu sou David",
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
        "Hi",
        "Oi",
        "Hi, nice to see you!",
        "Informal"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you!",
        "Agradecimento"
      ],
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
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
        "Excuse me!",
        "Chamar atenção"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon!",
        "Tarde"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Idade e aniversário</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is David = Meu nome é David<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Idade e aniversário</h5><p><b>Frase chave:</b> I am David = Eu sou David</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'I am David'",
        "opts": [
          "Até logo",
          "Bom dia",
          "Eu sou David",
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
          "Meu nome é",
          "Como vai"
        ],
        "ans": 2,
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
        "q": "Quando usar 'I am David'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Como vai?",
          "Onde mora?",
          "Quantos anos?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Em 'I am David', qual é o nome?",
        "opts": [
          "David",
          "Carro",
          "John",
          "Casa"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ David'",
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
        "q": "Ordem correta: 'name / is / my / David'",
        "opts": [
          "Is my name David",
          "David is my name",
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
          "Meu nome não é",
          "Onde você mora?",
          "Eu sou David",
          "Qual seu nome?"
        ],
        "ans": 2,
        "type": "translation"
      }
    ]
  },
  {
    "id": 86,
    "module": 2,
    "moduleName": "Vida Diária",
    "level": "A2",
    "title": "Família básica",
    "desc": "Aprenda família básica - tradução correta",
    "time": "11 MIN",
    "phrase": "Good morning, I am Miguel",
    "translation": "Bom dia, eu sou Miguel",
    "vocab": [
      [
        "Thank you",
        "Obrigado",
        "Thank you!",
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
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me!",
        "Chamar atenção"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning!",
        "Até meio-dia"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening!",
        "Chegada noite"
      ],
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
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
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Família básica</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Miguel = Meu nome é Miguel<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Família básica</h5><p><b>Frase chave:</b> Good morning, I am Miguel = Bom dia, eu sou Miguel</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Good morning, I am Miguel'",
        "opts": [
          "Boa noite",
          "Bom dia, eu sou Miguel",
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
          "big",
          "name"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Good morning, I am Miguel'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Qual é seu nome?",
          "Como vai?",
          "Quantos anos?",
          "Onde mora?"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Em 'Good morning, I am Miguel', qual é o nome?",
        "opts": [
          "John",
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
          "am",
          "be",
          "are",
          "is"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Ordem correta: 'name / is / my / Miguel'",
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
          "Onde você mora?",
          "Bom dia, eu sou Miguel"
        ],
        "ans": 3,
        "type": "translation"
      }
    ]
  },
  {
    "id": 87,
    "module": 2,
    "moduleName": "Vida Diária",
    "level": "A2",
    "title": "Cumprimentos formais",
    "desc": "Aprenda cumprimentos formais - tradução correta",
    "time": "12 MIN",
    "phrase": "Hello, I am Maria",
    "translation": "Olá, eu sou Maria",
    "vocab": [
      [
        "Good morning",
        "Bom dia",
        "Good morning!",
        "Até meio-dia"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you!",
        "Conhecer alguém"
      ],
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
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
        "Thank you!",
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
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Cumprimentos formais</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Maria = Meu nome é Maria<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Cumprimentos formais</h5><p><b>Frase chave:</b> Hello, I am Maria = Olá, eu sou Maria</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Hello, I am Maria'",
        "opts": [
          "Boa noite",
          "Até logo",
          "Bom dia",
          "Olá, eu sou Maria"
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
          "bad",
          "good",
          "big"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, I am Maria'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "My name is Maria",
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
        "q": "Em 'Hello, I am Maria', qual é o nome?",
        "opts": [
          "Carro",
          "Casa",
          "John",
          "Maria"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Maria'",
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
        "q": "Ordem correta: 'name / is / my / Maria'",
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
          "Olá, eu sou Maria",
          "Qual seu nome?",
          "Meu nome não é",
          "Onde você mora?"
        ],
        "ans": 0,
        "type": "translation"
      }
    ]
  },
  {
    "id": 88,
    "module": 2,
    "moduleName": "Vida Diária",
    "level": "A2",
    "title": "Despedidas",
    "desc": "Aprenda despedidas - tradução correta",
    "time": "13 MIN",
    "phrase": "I am Sofia",
    "translation": "Eu sou Sofia",
    "vocab": [
      [
        "Good morning",
        "Bom dia",
        "Good morning!",
        "Até meio-dia"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you!",
        "Conhecer alguém"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night!",
        "Despedida noite"
      ],
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening!",
        "Chegada noite"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me!",
        "Chamar atenção"
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
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Despedidas</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Sofia = Meu nome é Sofia<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Despedidas</h5><p><b>Frase chave:</b> I am Sofia = Eu sou Sofia</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'I am Sofia'",
        "opts": [
          "Bom dia",
          "Boa noite",
          "Eu sou Sofia",
          "Até logo"
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
          "bad",
          "name",
          "big",
          "good"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Quando usar 'I am Sofia'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Thank you",
          "My name is Sofia",
          "I am fine"
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
        "q": "Em 'I am Sofia', qual é o nome?",
        "opts": [
          "Casa",
          "Sofia",
          "Carro",
          "John"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Sofia'",
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
        "q": "Ordem correta: 'name / is / my / Sofia'",
        "opts": [
          "Sofia is my name",
          "Is my name Sofia",
          "My Sofia is name",
          "My name is Sofia"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Sofia'",
        "opts": [
          "Prazer em conhecer você, Sofia",
          "Bom dia",
          "Até logo",
          "Boa noite"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Sofia' significa:",
        "opts": [
          "Eu sou Sofia",
          "Onde você mora?",
          "Meu nome não é",
          "Qual seu nome?"
        ],
        "ans": 0,
        "type": "translation"
      }
    ]
  },
  {
    "id": 89,
    "module": 2,
    "moduleName": "Vida Diária",
    "level": "A2",
    "title": "Como você está",
    "desc": "Aprenda como você está - tradução correta",
    "time": "6 MIN",
    "phrase": "Good morning, I am Emma",
    "translation": "Bom dia, eu sou Emma",
    "vocab": [
      [
        "Thank you",
        "Obrigado",
        "Thank you!",
        "Agradecimento"
      ],
      [
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you!",
        "Conhecer alguém"
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
        "Excuse me!",
        "Chamar atenção"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon!",
        "Tarde"
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
        "Good morning!",
        "Até meio-dia"
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
        "Good evening!",
        "Chegada noite"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Como você está</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Emma = Meu nome é Emma<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Como você está</h5><p><b>Frase chave:</b> Good morning, I am Emma = Bom dia, eu sou Emma</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Good morning, I am Emma'",
        "opts": [
          "Bom dia, eu sou Emma",
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
          "name",
          "big",
          "bad"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Good morning, I am Emma'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Onde mora?",
          "Qual é seu nome?",
          "Como vai?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Em 'Good morning, I am Emma', qual é o nome?",
        "opts": [
          "Casa",
          "John",
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
          "am",
          "be",
          "are"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Ordem correta: 'name / is / my / Emma'",
        "opts": [
          "Emma is my name",
          "My name is Emma",
          "Is my name Emma",
          "My Emma is name"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Emma'",
        "opts": [
          "Bom dia",
          "Prazer em conhecer você, Emma",
          "Boa noite",
          "Até logo"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Emma' significa:",
        "opts": [
          "Bom dia, eu sou Emma",
          "Onde você mora?",
          "Meu nome não é",
          "Qual seu nome?"
        ],
        "ans": 0,
        "type": "translation"
      }
    ]
  },
  {
    "id": 90,
    "module": 2,
    "moduleName": "Vida Diária",
    "level": "A2",
    "title": "Números e telefone",
    "desc": "Aprenda números e telefone - tradução correta",
    "time": "7 MIN",
    "phrase": "I am Sarah",
    "translation": "Eu sou Sarah",
    "vocab": [
      [
        "Good night",
        "Boa noite",
        "Good night!",
        "Despedida noite"
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
        "Good morning!",
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
        "Good evening!",
        "Chegada noite"
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
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you!",
        "Conhecer alguém"
      ],
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Números e telefone</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Sarah = Meu nome é Sarah<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Números e telefone</h5><p><b>Frase chave:</b> I am Sarah = Eu sou Sarah</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'I am Sarah'",
        "opts": [
          "Boa noite",
          "Bom dia",
          "Até logo",
          "Eu sou Sarah"
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
        "q": "Complete: 'Hello, my ___ is Sarah'",
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
        "q": "Quando usar 'I am Sarah'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "My name is Sarah",
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
          "Quantos anos?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Em 'I am Sarah', qual é o nome?",
        "opts": [
          "John",
          "Carro",
          "Casa",
          "Sarah"
        ],
        "ans": 3,
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
        "q": "Ordem correta: 'name / is / my / Sarah'",
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
          "Bom dia",
          "Boa noite",
          "Prazer em conhecer você, Sarah",
          "Até logo"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Sarah' significa:",
        "opts": [
          "Eu sou Sarah",
          "Meu nome não é",
          "Onde você mora?",
          "Qual seu nome?"
        ],
        "ans": 0,
        "type": "translation"
      }
    ]
  },
  {
    "id": 91,
    "module": 2,
    "moduleName": "Vida Diária",
    "level": "A2",
    "title": "Endereço e cidade",
    "desc": "Aprenda endereço e cidade - tradução correta",
    "time": "8 MIN",
    "phrase": "Hello, I am John",
    "translation": "Olá, eu sou John",
    "vocab": [
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you!",
        "Conhecer alguém"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon!",
        "Tarde"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you!",
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
        "Good evening",
        "Boa noite",
        "Good evening!",
        "Chegada noite"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning!",
        "Até meio-dia"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night!",
        "Despedida noite"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Endereço e cidade</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is John = Meu nome é John<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Endereço e cidade</h5><p><b>Frase chave:</b> Hello, I am John = Olá, eu sou John</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Hello, I am John'",
        "opts": [
          "Boa noite",
          "Até logo",
          "Olá, eu sou John",
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
        "q": "Complete: 'Hello, my ___ is John'",
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
        "q": "Quando usar 'Hello, I am John'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Como vai?",
          "Quantos anos?",
          "Onde mora?"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Em 'Hello, I am John', qual é o nome?",
        "opts": [
          "Carro",
          "John",
          "Mike",
          "Casa"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ John'",
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
        "q": "Ordem correta: 'name / is / my / John'",
        "opts": [
          "My name is John",
          "My John is name",
          "John is my name",
          "Is my name John"
        ],
        "ans": 0,
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
          "Meu nome não é",
          "Qual seu nome?",
          "Olá, eu sou John",
          "Onde você mora?"
        ],
        "ans": 2,
        "type": "translation"
      }
    ]
  },
  {
    "id": 92,
    "module": 2,
    "moduleName": "Vida Diária",
    "level": "A2",
    "title": "Profissão simples",
    "desc": "Aprenda profissão simples - tradução correta",
    "time": "9 MIN",
    "phrase": "Nice to meet you, Sofia",
    "translation": "Prazer em conhecer você, Sofia",
    "vocab": [
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
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you!",
        "Conhecer alguém"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening!",
        "Chegada noite"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon!",
        "Tarde"
      ],
      [
        "Hi",
        "Oi",
        "Hi, nice to see you!",
        "Informal"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me!",
        "Chamar atenção"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Profissão simples</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Sofia = Meu nome é Sofia<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Profissão simples</h5><p><b>Frase chave:</b> Nice to meet you, Sofia = Prazer em conhecer você, Sofia</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Nice to meet you, Sofia'",
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
          "good",
          "name"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Nice to meet you, Sofia'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Quantos anos?",
          "Qual é seu nome?",
          "Como vai?",
          "Onde mora?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Em 'Nice to meet you, Sofia', qual é o nome?",
        "opts": [
          "Casa",
          "Carro",
          "Sofia",
          "John"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Sofia'",
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
        "q": "Ordem correta: 'name / is / my / Sofia'",
        "opts": [
          "My Sofia is name",
          "Is my name Sofia",
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
          "Bom dia",
          "Prazer em conhecer você, Sofia",
          "Boa noite"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Sofia' significa:",
        "opts": [
          "Meu nome não é",
          "Prazer em conhecer você, Sofia",
          "Onde você mora?",
          "Qual seu nome?"
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
    "title": "Hobbies favoritos",
    "desc": "Aprenda hobbies favoritos - tradução correta",
    "time": "10 MIN",
    "phrase": "Hello, my name is Sofia",
    "translation": "Olá, meu nome é Sofia",
    "vocab": [
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon!",
        "Tarde"
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
        "Thank you!",
        "Agradecimento"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night!",
        "Despedida noite"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
      ],
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me!",
        "Chamar atenção"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Hobbies favoritos</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Sofia = Meu nome é Sofia<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Hobbies favoritos</h5><p><b>Frase chave:</b> Hello, my name is Sofia = Olá, meu nome é Sofia</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Hello, my name is Sofia'",
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
          "Quantos anos",
          "Meu nome é",
          "Onde mora",
          "Como vai"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Sofia'",
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
        "q": "Quando usar 'Hello, my name is Sofia'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Qual é seu nome?",
          "Como vai?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Em 'Hello, my name is Sofia', qual é o nome?",
        "opts": [
          "Sofia",
          "Carro",
          "John",
          "Casa"
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
        "q": "Ordem correta: 'name / is / my / Sofia'",
        "opts": [
          "Is my name Sofia",
          "Sofia is my name",
          "My Sofia is name",
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
          "Onde você mora?",
          "Qual seu nome?",
          "Olá, meu nome é Sofia",
          "Meu nome não é"
        ],
        "ans": 2,
        "type": "translation"
      }
    ]
  },
  {
    "id": 94,
    "module": 2,
    "moduleName": "Vida Diária",
    "level": "A2",
    "title": "Comida favorita",
    "desc": "Aprenda comida favorita - tradução correta",
    "time": "11 MIN",
    "phrase": "Hello, I am Miguel",
    "translation": "Olá, eu sou Miguel",
    "vocab": [
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ],
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me!",
        "Chamar atenção"
      ],
      [
        "Hi",
        "Oi",
        "Hi, nice to see you!",
        "Informal"
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
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon!",
        "Tarde"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Comida favorita</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Miguel = Meu nome é Miguel<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Comida favorita</h5><p><b>Frase chave:</b> Hello, I am Miguel = Olá, eu sou Miguel</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Hello, I am Miguel'",
        "opts": [
          "Bom dia",
          "Boa noite",
          "Olá, eu sou Miguel",
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
        "q": "Quando usar 'Hello, I am Miguel'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Onde mora?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Em 'Hello, I am Miguel', qual é o nome?",
        "opts": [
          "John",
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
          "is",
          "be",
          "are",
          "am"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Ordem correta: 'name / is / my / Miguel'",
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
          "Meu nome não é",
          "Olá, eu sou Miguel",
          "Onde você mora?",
          "Qual seu nome?"
        ],
        "ans": 1,
        "type": "translation"
      }
    ]
  },
  {
    "id": 95,
    "module": 2,
    "moduleName": "Vida Diária",
    "level": "A2",
    "title": "Cores favoritas",
    "desc": "Aprenda cores favoritas - tradução correta",
    "time": "12 MIN",
    "phrase": "My name is David",
    "translation": "Meu nome é David",
    "vocab": [
      [
        "Good evening",
        "Boa noite",
        "Good evening!",
        "Chegada noite"
      ],
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you!",
        "Agradecimento"
      ],
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
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
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you!",
        "Conhecer alguém"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Cores favoritas</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is David = Meu nome é David<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Cores favoritas</h5><p><b>Frase chave:</b> My name is David = Meu nome é David</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'My name is David'",
        "opts": [
          "Boa noite",
          "Até logo",
          "Meu nome é David",
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
        "q": "Complete: 'Hello, my ___ is David'",
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
        "q": "Quando usar 'My name is David'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Quantos anos?",
          "Como vai?",
          "Onde mora?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Em 'My name is David', qual é o nome?",
        "opts": [
          "Carro",
          "Casa",
          "John",
          "David"
        ],
        "ans": 3,
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
        "q": "Ordem correta: 'name / is / my / David'",
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
          "Meu nome é David",
          "Qual seu nome?",
          "Onde você mora?"
        ],
        "ans": 1,
        "type": "translation"
      }
    ]
  },
  {
    "id": 96,
    "module": 2,
    "moduleName": "Vida Diária",
    "level": "A2",
    "title": "Tempo e clima",
    "desc": "Aprenda tempo e clima - tradução correta",
    "time": "13 MIN",
    "phrase": "Good morning, I am Lucas",
    "translation": "Bom dia, eu sou Lucas",
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
        "Good night",
        "Boa noite",
        "Good night!",
        "Despedida noite"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me!",
        "Chamar atenção"
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
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon!",
        "Tarde"
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
        "Good evening!",
        "Chegada noite"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Tempo e clima</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Lucas = Meu nome é Lucas<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Tempo e clima</h5><p><b>Frase chave:</b> Good morning, I am Lucas = Bom dia, eu sou Lucas</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Good morning, I am Lucas'",
        "opts": [
          "Até logo",
          "Bom dia, eu sou Lucas",
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
          "name",
          "bad",
          "good"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Good morning, I am Lucas'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "My name is Lucas",
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
          "Qual é seu nome?",
          "Como vai?",
          "Onde mora?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Em 'Good morning, I am Lucas', qual é o nome?",
        "opts": [
          "John",
          "Carro",
          "Lucas",
          "Casa"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Lucas'",
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
        "q": "Ordem correta: 'name / is / my / Lucas'",
        "opts": [
          "Lucas is my name",
          "Is my name Lucas",
          "My name is Lucas",
          "My Lucas is name"
        ],
        "ans": 2,
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
          "Bom dia, eu sou Lucas",
          "Meu nome não é",
          "Qual seu nome?",
          "Onde você mora?"
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
    "title": "Dias da semana",
    "desc": "Aprenda dias da semana - tradução correta",
    "time": "6 MIN",
    "phrase": "Good morning, I am Emma",
    "translation": "Bom dia, eu sou Emma",
    "vocab": [
      [
        "Hi",
        "Oi",
        "Hi, nice to see you!",
        "Informal"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me!",
        "Chamar atenção"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
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
        "Good evening",
        "Boa noite",
        "Good evening!",
        "Chegada noite"
      ],
      [
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you!",
        "Agradecimento"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Dias da semana</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Emma = Meu nome é Emma<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Dias da semana</h5><p><b>Frase chave:</b> Good morning, I am Emma = Bom dia, eu sou Emma</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Good morning, I am Emma'",
        "opts": [
          "Até logo",
          "Bom dia, eu sou Emma",
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
        "q": "Quando usar 'Good morning, I am Emma'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "My name is Emma",
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
          "Onde mora?",
          "Como vai?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Em 'Good morning, I am Emma', qual é o nome?",
        "opts": [
          "Emma",
          "Casa",
          "John",
          "Carro"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Emma'",
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
        "q": "Ordem correta: 'name / is / my / Emma'",
        "opts": [
          "Emma is my name",
          "My Emma is name",
          "Is my name Emma",
          "My name is Emma"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Emma'",
        "opts": [
          "Bom dia",
          "Prazer em conhecer você, Emma",
          "Até logo",
          "Boa noite"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Emma' significa:",
        "opts": [
          "Bom dia, eu sou Emma",
          "Onde você mora?",
          "Meu nome não é",
          "Qual seu nome?"
        ],
        "ans": 0,
        "type": "translation"
      }
    ]
  },
  {
    "id": 98,
    "module": 2,
    "moduleName": "Vida Diária",
    "level": "A2",
    "title": "Horas e compromissos",
    "desc": "Aprenda horas e compromissos - tradução correta",
    "time": "7 MIN",
    "phrase": "Good morning, I am John",
    "translation": "Bom dia, eu sou John",
    "vocab": [
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you!",
        "Conhecer alguém"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night!",
        "Despedida noite"
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
        "Excuse me!",
        "Chamar atenção"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning!",
        "Até meio-dia"
      ],
      [
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
      ],
      [
        "Hi",
        "Oi",
        "Hi, nice to see you!",
        "Informal"
      ],
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Horas e compromissos</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is John = Meu nome é John<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Horas e compromissos</h5><p><b>Frase chave:</b> Good morning, I am John = Bom dia, eu sou John</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Good morning, I am John'",
        "opts": [
          "Bom dia, eu sou John",
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
          "Meu nome é",
          "Como vai"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is John'",
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
        "q": "Quando usar 'Good morning, I am John'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "My name is John",
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
          "Onde mora?",
          "Quantos anos?",
          "Como vai?"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Em 'Good morning, I am John', qual é o nome?",
        "opts": [
          "Casa",
          "Carro",
          "John",
          "Mike"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ John'",
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
        "q": "Ordem correta: 'name / is / my / John'",
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
          "Onde você mora?",
          "Bom dia, eu sou John",
          "Qual seu nome?",
          "Meu nome não é"
        ],
        "ans": 1,
        "type": "translation"
      }
    ]
  },
  {
    "id": 99,
    "module": 2,
    "moduleName": "Vida Diária",
    "level": "A2",
    "title": "Família estendida",
    "desc": "Aprenda família estendida - tradução correta",
    "time": "8 MIN",
    "phrase": "I am David",
    "translation": "Eu sou David",
    "vocab": [
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Hi",
        "Oi",
        "Hi, nice to see you!",
        "Informal"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning!",
        "Até meio-dia"
      ],
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
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
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you!",
        "Conhecer alguém"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me!",
        "Chamar atenção"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Família estendida</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is David = Meu nome é David<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Família estendida</h5><p><b>Frase chave:</b> I am David = Eu sou David</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'I am David'",
        "opts": [
          "Eu sou David",
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
        "q": "Quando usar 'I am David'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Qual é seu nome?",
          "Onde mora?",
          "Quantos anos?",
          "Como vai?"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Em 'I am David', qual é o nome?",
        "opts": [
          "Casa",
          "Carro",
          "David",
          "John"
        ],
        "ans": 2,
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
        "q": "Ordem correta: 'name / is / my / David'",
        "opts": [
          "David is my name",
          "Is my name David",
          "My name is David",
          "My David is name"
        ],
        "ans": 2,
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
          "Eu sou David",
          "Qual seu nome?",
          "Meu nome não é",
          "Onde você mora?"
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
    "title": "Casa e moradia",
    "desc": "Aprenda casa e moradia - tradução correta",
    "time": "9 MIN",
    "phrase": "I am Ana",
    "translation": "Eu sou Ana",
    "vocab": [
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
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
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night!",
        "Despedida noite"
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
        "Good afternoon",
        "Boa tarde",
        "Good afternoon!",
        "Tarde"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Casa e moradia</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Ana = Meu nome é Ana<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Casa e moradia</h5><p><b>Frase chave:</b> I am Ana = Eu sou Ana</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'I am Ana'",
        "opts": [
          "Boa noite",
          "Bom dia",
          "Até logo",
          "Eu sou Ana"
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
        "q": "Quando usar 'I am Ana'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Onde mora?",
          "Como vai?"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Em 'I am Ana', qual é o nome?",
        "opts": [
          "Casa",
          "Ana",
          "John",
          "Carro"
        ],
        "ans": 1,
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
        "q": "Ordem correta: 'name / is / my / Ana'",
        "opts": [
          "Is my name Ana",
          "My Ana is name",
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
          "Eu sou Ana",
          "Onde você mora?",
          "Meu nome não é",
          "Qual seu nome?"
        ],
        "ans": 0,
        "type": "translation"
      }
    ]
  },
  {
    "id": 101,
    "module": 2,
    "moduleName": "Vida Diária",
    "level": "A2",
    "title": "Rotina matinal",
    "desc": "Aprenda rotina matinal - tradução correta",
    "time": "10 MIN",
    "phrase": "My name is Miguel",
    "translation": "Meu nome é Miguel",
    "vocab": [
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon!",
        "Tarde"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ],
      [
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Hi",
        "Oi",
        "Hi, nice to see you!",
        "Informal"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening!",
        "Chegada noite"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you!",
        "Conhecer alguém"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me!",
        "Chamar atenção"
      ],
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Rotina matinal</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Miguel = Meu nome é Miguel<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Rotina matinal</h5><p><b>Frase chave:</b> My name is Miguel = Meu nome é Miguel</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'My name is Miguel'",
        "opts": [
          "Boa noite",
          "Até logo",
          "Meu nome é Miguel",
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
        "q": "Quando usar 'My name is Miguel'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Como vai?",
          "Quantos anos?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Em 'My name is Miguel', qual é o nome?",
        "opts": [
          "Casa",
          "Carro",
          "Miguel",
          "John"
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
        "q": "Ordem correta: 'name / is / my / Miguel'",
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
          "Prazer em conhecer você, Miguel",
          "Até logo",
          "Bom dia",
          "Boa noite"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Miguel' significa:",
        "opts": [
          "Meu nome não é",
          "Onde você mora?",
          "Qual seu nome?",
          "Meu nome é Miguel"
        ],
        "ans": 3,
        "type": "translation"
      }
    ]
  },
  {
    "id": 102,
    "module": 2,
    "moduleName": "Vida Diária",
    "level": "A2",
    "title": "Rotina noturna",
    "desc": "Aprenda rotina noturna - tradução correta",
    "time": "11 MIN",
    "phrase": "Hello, I am John",
    "translation": "Olá, eu sou John",
    "vocab": [
      [
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
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
        "Good evening!",
        "Chegada noite"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon!",
        "Tarde"
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
        "Good night!",
        "Despedida noite"
      ],
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you!",
        "Agradecimento"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Rotina noturna</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is John = Meu nome é John<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Rotina noturna</h5><p><b>Frase chave:</b> Hello, I am John = Olá, eu sou John</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Hello, I am John'",
        "opts": [
          "Olá, eu sou John",
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
          "Onde mora",
          "Quantos anos",
          "Como vai"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is John'",
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
        "q": "Quando usar 'Hello, I am John'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Quantos anos?",
          "Qual é seu nome?",
          "Onde mora?",
          "Como vai?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Em 'Hello, I am John', qual é o nome?",
        "opts": [
          "Carro",
          "Mike",
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
          "be",
          "is",
          "am"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Ordem correta: 'name / is / my / John'",
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
          "Boa noite",
          "Bom dia",
          "Até logo",
          "Prazer em conhecer você, John"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is John' significa:",
        "opts": [
          "Olá, eu sou John",
          "Meu nome não é",
          "Qual seu nome?",
          "Onde você mora?"
        ],
        "ans": 0,
        "type": "translation"
      }
    ]
  },
  {
    "id": 103,
    "module": 2,
    "moduleName": "Vida Diária",
    "level": "A2",
    "title": "Fim de semana",
    "desc": "Aprenda fim de semana - tradução correta",
    "time": "12 MIN",
    "phrase": "Nice to meet you, Carlos",
    "translation": "Prazer em conhecer você, Carlos",
    "vocab": [
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you!",
        "Agradecimento"
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
        "Good afternoon!",
        "Tarde"
      ],
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night!",
        "Despedida noite"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Fim de semana</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Carlos = Meu nome é Carlos<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Fim de semana</h5><p><b>Frase chave:</b> Nice to meet you, Carlos = Prazer em conhecer você, Carlos</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Nice to meet you, Carlos'",
        "opts": [
          "Até logo",
          "Boa noite",
          "Prazer em conhecer você, Carlos",
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
        "q": "Quando usar 'Nice to meet you, Carlos'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Onde mora?",
          "Quantos anos?",
          "Como vai?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Em 'Nice to meet you, Carlos', qual é o nome?",
        "opts": [
          "Carlos",
          "Casa",
          "John",
          "Carro"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Carlos'",
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
        "q": "Ordem correta: 'name / is / my / Carlos'",
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
          "Bom dia",
          "Prazer em conhecer você, Carlos",
          "Até logo",
          "Boa noite"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Carlos' significa:",
        "opts": [
          "Onde você mora?",
          "Qual seu nome?",
          "Prazer em conhecer você, Carlos",
          "Meu nome não é"
        ],
        "ans": 2,
        "type": "translation"
      }
    ]
  },
  {
    "id": 104,
    "module": 2,
    "moduleName": "Vida Diária",
    "level": "A2",
    "title": "Compras básicas",
    "desc": "Aprenda compras básicas - tradução correta",
    "time": "13 MIN",
    "phrase": "Hello, I am Pedro",
    "translation": "Olá, eu sou Pedro",
    "vocab": [
      [
        "Good morning",
        "Bom dia",
        "Good morning!",
        "Até meio-dia"
      ],
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ],
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me!",
        "Chamar atenção"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night!",
        "Despedida noite"
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
        "Good afternoon!",
        "Tarde"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you!",
        "Conhecer alguém"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Compras básicas</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Pedro = Meu nome é Pedro<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Compras básicas</h5><p><b>Frase chave:</b> Hello, I am Pedro = Olá, eu sou Pedro</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Hello, I am Pedro'",
        "opts": [
          "Boa noite",
          "Olá, eu sou Pedro",
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
          "big",
          "name",
          "bad"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, I am Pedro'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Thank you",
          "My name is Pedro",
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
          "Qual é seu nome?",
          "Quantos anos?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Em 'Hello, I am Pedro', qual é o nome?",
        "opts": [
          "Pedro",
          "John",
          "Carro",
          "Casa"
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
        "q": "Ordem correta: 'name / is / my / Pedro'",
        "opts": [
          "Is my name Pedro",
          "Pedro is my name",
          "My Pedro is name",
          "My name is Pedro"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Pedro'",
        "opts": [
          "Boa noite",
          "Até logo",
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
          "Olá, eu sou Pedro",
          "Onde você mora?",
          "Meu nome não é"
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
    "title": "Transporte",
    "desc": "Aprenda transporte - tradução correta",
    "time": "6 MIN",
    "phrase": "Nice to meet you, Emma",
    "translation": "Prazer em conhecer você, Emma",
    "vocab": [
      [
        "Good morning",
        "Bom dia",
        "Good morning!",
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
        "Good afternoon!",
        "Tarde"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night!",
        "Despedida noite"
      ],
      [
        "Hi",
        "Oi",
        "Hi, nice to see you!",
        "Informal"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me!",
        "Chamar atenção"
      ],
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening!",
        "Chegada noite"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Transporte</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Emma = Meu nome é Emma<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Transporte</h5><p><b>Frase chave:</b> Nice to meet you, Emma = Prazer em conhecer você, Emma</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Nice to meet you, Emma'",
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
        "q": "Complete: 'Hello, my ___ is Emma'",
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
        "q": "Quando usar 'Nice to meet you, Emma'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
        "q": "Em 'Nice to meet you, Emma', qual é o nome?",
        "opts": [
          "Casa",
          "Emma",
          "Carro",
          "John"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Emma'",
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
        "q": "Ordem correta: 'name / is / my / Emma'",
        "opts": [
          "My name is Emma",
          "Emma is my name",
          "My Emma is name",
          "Is my name Emma"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Emma'",
        "opts": [
          "Boa noite",
          "Até logo",
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
          "Prazer em conhecer você, Emma",
          "Onde você mora?",
          "Meu nome não é"
        ],
        "ans": 1,
        "type": "translation"
      }
    ]
  },
  {
    "id": 106,
    "module": 2,
    "moduleName": "Vida Diária",
    "level": "A2",
    "title": "Comida e restaurante",
    "desc": "Aprenda comida e restaurante - tradução correta",
    "time": "7 MIN",
    "phrase": "Hello, I am Ana",
    "translation": "Olá, eu sou Ana",
    "vocab": [
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning!",
        "Até meio-dia"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening!",
        "Chegada noite"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon!",
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
        "Hi",
        "Oi",
        "Hi, nice to see you!",
        "Informal"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night!",
        "Despedida noite"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Comida e restaurante</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Ana = Meu nome é Ana<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Comida e restaurante</h5><p><b>Frase chave:</b> Hello, I am Ana = Olá, eu sou Ana</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Hello, I am Ana'",
        "opts": [
          "Olá, eu sou Ana",
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
        "q": "Quando usar 'Hello, I am Ana'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "My name is Ana",
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
        "q": "Em 'Hello, I am Ana', qual é o nome?",
        "opts": [
          "Ana",
          "John",
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
          "is",
          "are",
          "am"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Ordem correta: 'name / is / my / Ana'",
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
          "Qual seu nome?",
          "Onde você mora?",
          "Olá, eu sou Ana",
          "Meu nome não é"
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
    "title": "Bebidas",
    "desc": "Aprenda bebidas - tradução correta",
    "time": "8 MIN",
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
        "Good afternoon",
        "Boa tarde",
        "Good afternoon!",
        "Tarde"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night!",
        "Despedida noite"
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
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you!",
        "Conhecer alguém"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Bebidas</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Julia = Meu nome é Julia<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Bebidas</h5><p><b>Frase chave:</b> Hello, my name is Julia = Olá, meu nome é Julia</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Hello, my name is Julia'",
        "opts": [
          "Boa noite",
          "Até logo",
          "Olá, meu nome é Julia",
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
          "Ao comer",
          "Ao dormir",
          "Ao dirigir",
          "Ao se apresentar"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Qual palavra significa 'Olá'?",
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
          "My name is Julia",
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
        "q": "Em 'Hello, my name is Julia', qual é o nome?",
        "opts": [
          "Carro",
          "Julia",
          "Casa",
          "John"
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
        "q": "Ordem correta: 'name / is / my / Julia'",
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
          "Boa noite",
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
          "Onde você mora?",
          "Olá, meu nome é Julia",
          "Meu nome não é"
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
    "title": "Pedindo ajuda",
    "desc": "Aprenda pedindo ajuda - tradução correta",
    "time": "9 MIN",
    "phrase": "Hello, I am Sarah",
    "translation": "Olá, eu sou Sarah",
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
        "Good afternoon",
        "Boa tarde",
        "Good afternoon!",
        "Tarde"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you!",
        "Agradecimento"
      ],
      [
        "Hi",
        "Oi",
        "Hi, nice to see you!",
        "Informal"
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
        "Good morning",
        "Bom dia",
        "Good morning!",
        "Até meio-dia"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Pedindo ajuda</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Sarah = Meu nome é Sarah<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Pedindo ajuda</h5><p><b>Frase chave:</b> Hello, I am Sarah = Olá, eu sou Sarah</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Hello, I am Sarah'",
        "opts": [
          "Boa noite",
          "Olá, eu sou Sarah",
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
          "bad",
          "good",
          "big"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, I am Sarah'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Quantos anos?",
          "Como vai?",
          "Onde mora?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Em 'Hello, I am Sarah', qual é o nome?",
        "opts": [
          "Carro",
          "Casa",
          "John",
          "Sarah"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Sarah'",
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
        "q": "Ordem correta: 'name / is / my / Sarah'",
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
          "Prazer em conhecer você, Sarah",
          "Até logo",
          "Bom dia",
          "Boa noite"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Sarah' significa:",
        "opts": [
          "Qual seu nome?",
          "Onde você mora?",
          "Olá, eu sou Sarah",
          "Meu nome não é"
        ],
        "ans": 2,
        "type": "translation"
      }
    ]
  },
  {
    "id": 109,
    "module": 2,
    "moduleName": "Vida Diária",
    "level": "A2",
    "title": "Direções simples",
    "desc": "Aprenda direções simples - tradução correta",
    "time": "10 MIN",
    "phrase": "Good morning, I am Sofia",
    "translation": "Bom dia, eu sou Sofia",
    "vocab": [
      [
        "Good evening",
        "Boa noite",
        "Good evening!",
        "Chegada noite"
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
        "Good night!",
        "Despedida noite"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you!",
        "Conhecer alguém"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you!",
        "Agradecimento"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning!",
        "Até meio-dia"
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
        "Family",
        "Família",
        "My family is big",
        "Família"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Direções simples</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Sofia = Meu nome é Sofia<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Direções simples</h5><p><b>Frase chave:</b> Good morning, I am Sofia = Bom dia, eu sou Sofia</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Good morning, I am Sofia'",
        "opts": [
          "Boa noite",
          "Bom dia",
          "Bom dia, eu sou Sofia",
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
          "Onde mora",
          "Quantos anos"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Sofia'",
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
        "q": "Quando usar 'Good morning, I am Sofia'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Quantos anos?",
          "Onde mora?",
          "Qual é seu nome?",
          "Como vai?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Em 'Good morning, I am Sofia', qual é o nome?",
        "opts": [
          "John",
          "Casa",
          "Sofia",
          "Carro"
        ],
        "ans": 2,
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
        "q": "Ordem correta: 'name / is / my / Sofia'",
        "opts": [
          "My Sofia is name",
          "Sofia is my name",
          "Is my name Sofia",
          "My name is Sofia"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Sofia'",
        "opts": [
          "Bom dia",
          "Prazer em conhecer você, Sofia",
          "Até logo",
          "Boa noite"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Sofia' significa:",
        "opts": [
          "Qual seu nome?",
          "Bom dia, eu sou Sofia",
          "Meu nome não é",
          "Onde você mora?"
        ],
        "ans": 1,
        "type": "translation"
      }
    ]
  },
  {
    "id": 110,
    "module": 2,
    "moduleName": "Vida Diária",
    "level": "A2",
    "title": "Preços e dinheiro",
    "desc": "Aprenda preços e dinheiro - tradução correta",
    "time": "11 MIN",
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
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you!",
        "Agradecimento"
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
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
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
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Preços e dinheiro</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Emma = Meu nome é Emma<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Preços e dinheiro</h5><p><b>Frase chave:</b> Hello, my name is Emma = Olá, meu nome é Emma</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Hello, my name is Emma'",
        "opts": [
          "Olá, meu nome é Emma",
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
          "Quantos anos",
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
          "Ao se apresentar",
          "Ao dormir",
          "Ao dirigir"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Qual palavra significa 'Olá'?",
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
          "Onde mora?",
          "Como vai?",
          "Qual é seu nome?",
          "Quantos anos?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Em 'Hello, my name is Emma', qual é o nome?",
        "opts": [
          "Carro",
          "Casa",
          "John",
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
          "is",
          "am"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Ordem correta: 'name / is / my / Emma'",
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
          "Bom dia",
          "Prazer em conhecer você, Emma",
          "Boa noite",
          "Até logo"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Emma' significa:",
        "opts": [
          "Qual seu nome?",
          "Olá, meu nome é Emma",
          "Onde você mora?",
          "Meu nome não é"
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
    "title": "Roupas",
    "desc": "Aprenda roupas - tradução correta",
    "time": "12 MIN",
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
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you!",
        "Agradecimento"
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
        "Nice to meet you!",
        "Conhecer alguém"
      ],
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ],
      [
        "Hi",
        "Oi",
        "Hi, nice to see you!",
        "Informal"
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
        "Good afternoon!",
        "Tarde"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Roupas</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Sarah = Meu nome é Sarah<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Roupas</h5><p><b>Frase chave:</b> Hello, my name is Sarah = Olá, meu nome é Sarah</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Hello, my name is Sarah'",
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
          "Quantos anos",
          "Meu nome é",
          "Onde mora",
          "Como vai"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Sarah'",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Como vai?",
          "Qual é seu nome?",
          "Onde mora?",
          "Quantos anos?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Em 'Hello, my name is Sarah', qual é o nome?",
        "opts": [
          "Sarah",
          "John",
          "Casa",
          "Carro"
        ],
        "ans": 0,
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
        "q": "Ordem correta: 'name / is / my / Sarah'",
        "opts": [
          "Is my name Sarah",
          "My Sarah is name",
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
          "Olá, meu nome é Sarah",
          "Meu nome não é",
          "Qual seu nome?",
          "Onde você mora?"
        ],
        "ans": 0,
        "type": "translation"
      }
    ]
  },
  {
    "id": 112,
    "module": 2,
    "moduleName": "Vida Diária",
    "level": "A2",
    "title": "Saúde básica",
    "desc": "Aprenda saúde básica - tradução correta",
    "time": "13 MIN",
    "phrase": "Hello, my name is David",
    "translation": "Olá, meu nome é David",
    "vocab": [
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
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
        "Good evening!",
        "Chegada noite"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning!",
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
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Saúde básica</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is David = Meu nome é David<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Saúde básica</h5><p><b>Frase chave:</b> Hello, my name is David = Olá, meu nome é David</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Hello, my name is David'",
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
          "Ao dormir",
          "Ao se apresentar",
          "Ao dirigir",
          "Ao comer"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Qual palavra significa 'Olá'?",
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
          "My name is David",
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
          "Onde mora?",
          "Como vai?"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Em 'Hello, my name is David', qual é o nome?",
        "opts": [
          "Carro",
          "Casa",
          "David",
          "John"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ David'",
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
        "q": "Ordem correta: 'name / is / my / David'",
        "opts": [
          "My name is David",
          "David is my name",
          "My David is name",
          "Is my name David"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, David'",
        "opts": [
          "Até logo",
          "Prazer em conhecer você, David",
          "Bom dia",
          "Boa noite"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is David' significa:",
        "opts": [
          "Qual seu nome?",
          "Olá, meu nome é David",
          "Meu nome não é",
          "Onde você mora?"
        ],
        "ans": 1,
        "type": "translation"
      }
    ]
  },
  {
    "id": 113,
    "module": 2,
    "moduleName": "Vida Diária",
    "level": "A2",
    "title": "Emoções",
    "desc": "Aprenda emoções - tradução correta",
    "time": "6 MIN",
    "phrase": "My name is Carlos",
    "translation": "Meu nome é Carlos",
    "vocab": [
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
      ],
      [
        "Hi",
        "Oi",
        "Hi, nice to see you!",
        "Informal"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
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
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
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
        "Good afternoon!",
        "Tarde"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Emoções</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Carlos = Meu nome é Carlos<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Emoções</h5><p><b>Frase chave:</b> My name is Carlos = Meu nome é Carlos</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'My name is Carlos'",
        "opts": [
          "Boa noite",
          "Bom dia",
          "Até logo",
          "Meu nome é Carlos"
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
        "q": "Complete: 'Hello, my ___ is Carlos'",
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
        "q": "Quando usar 'My name is Carlos'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Onde mora?",
          "Quantos anos?",
          "Qual é seu nome?",
          "Como vai?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Em 'My name is Carlos', qual é o nome?",
        "opts": [
          "Carro",
          "John",
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
        "q": "Ordem correta: 'name / is / my / Carlos'",
        "opts": [
          "Carlos is my name",
          "Is my name Carlos",
          "My name is Carlos",
          "My Carlos is name"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Carlos'",
        "opts": [
          "Até logo",
          "Bom dia",
          "Boa noite",
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
          "Meu nome é Carlos",
          "Onde você mora?"
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
    "title": "Convites",
    "desc": "Aprenda convites - tradução correta",
    "time": "7 MIN",
    "phrase": "Hello, I am Carlos",
    "translation": "Olá, eu sou Carlos",
    "vocab": [
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you!",
        "Conhecer alguém"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ],
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening!",
        "Chegada noite"
      ],
      [
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
      ],
      [
        "Hi",
        "Oi",
        "Hi, nice to see you!",
        "Informal"
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
        "Good night!",
        "Despedida noite"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Convites</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Carlos = Meu nome é Carlos<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Convites</h5><p><b>Frase chave:</b> Hello, I am Carlos = Olá, eu sou Carlos</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Hello, I am Carlos'",
        "opts": [
          "Bom dia",
          "Boa noite",
          "Até logo",
          "Olá, eu sou Carlos"
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
          "good",
          "name",
          "bad",
          "big"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, I am Carlos'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Como vai?",
          "Onde mora?",
          "Quantos anos?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Em 'Hello, I am Carlos', qual é o nome?",
        "opts": [
          "John",
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
          "be",
          "is",
          "am"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Ordem correta: 'name / is / my / Carlos'",
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
          "Bom dia",
          "Até logo",
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
          "Olá, eu sou Carlos",
          "Onde você mora?"
        ],
        "ans": 2,
        "type": "translation"
      }
    ]
  },
  {
    "id": 115,
    "module": 2,
    "moduleName": "Vida Diária",
    "level": "A2",
    "title": "Telefone",
    "desc": "Aprenda telefone - tradução correta",
    "time": "8 MIN",
    "phrase": "Hello, I am Miguel",
    "translation": "Olá, eu sou Miguel",
    "vocab": [
      [
        "Hi",
        "Oi",
        "Hi, nice to see you!",
        "Informal"
      ],
      [
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning!",
        "Até meio-dia"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you!",
        "Agradecimento"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening!",
        "Chegada noite"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night!",
        "Despedida noite"
      ],
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me!",
        "Chamar atenção"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Telefone</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Miguel = Meu nome é Miguel<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Telefone</h5><p><b>Frase chave:</b> Hello, I am Miguel = Olá, eu sou Miguel</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Hello, I am Miguel'",
        "opts": [
          "Até logo",
          "Bom dia",
          "Olá, eu sou Miguel",
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
          "Meu nome é",
          "Como vai"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Miguel'",
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
        "q": "Quando usar 'Hello, I am Miguel'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Goodbye",
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
          "Como vai?",
          "Qual é seu nome?",
          "Quantos anos?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Em 'Hello, I am Miguel', qual é o nome?",
        "opts": [
          "Miguel",
          "Casa",
          "Carro",
          "John"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Miguel'",
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
        "q": "Ordem correta: 'name / is / my / Miguel'",
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
          "Meu nome não é",
          "Olá, eu sou Miguel",
          "Qual seu nome?",
          "Onde você mora?"
        ],
        "ans": 1,
        "type": "translation"
      }
    ]
  },
  {
    "id": 116,
    "module": 2,
    "moduleName": "Vida Diária",
    "level": "A2",
    "title": "Email e contato",
    "desc": "Aprenda email e contato - tradução correta",
    "time": "9 MIN",
    "phrase": "Good morning, I am Carlos",
    "translation": "Bom dia, eu sou Carlos",
    "vocab": [
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
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
        "Good night!",
        "Despedida noite"
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
        "Good evening!",
        "Chegada noite"
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
        "Good afternoon!",
        "Tarde"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you!",
        "Agradecimento"
      ],
      [
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Email e contato</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Carlos = Meu nome é Carlos<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Email e contato</h5><p><b>Frase chave:</b> Good morning, I am Carlos = Bom dia, eu sou Carlos</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Good morning, I am Carlos'",
        "opts": [
          "Bom dia",
          "Até logo",
          "Bom dia, eu sou Carlos",
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
          "Quantos anos",
          "Como vai"
        ],
        "ans": 0,
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
        "q": "Quando usar 'Good morning, I am Carlos'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Como vai?",
          "Quantos anos?",
          "Onde mora?"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Em 'Good morning, I am Carlos', qual é o nome?",
        "opts": [
          "John",
          "Casa",
          "Carlos",
          "Carro"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Carlos'",
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
        "q": "Ordem correta: 'name / is / my / Carlos'",
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
          "Bom dia",
          "Prazer em conhecer você, Carlos",
          "Até logo",
          "Boa noite"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Carlos' significa:",
        "opts": [
          "Meu nome não é",
          "Qual seu nome?",
          "Bom dia, eu sou Carlos",
          "Onde você mora?"
        ],
        "ans": 2,
        "type": "translation"
      }
    ]
  },
  {
    "id": 117,
    "module": 2,
    "moduleName": "Vida Diária",
    "level": "A2",
    "title": "Planos futuros",
    "desc": "Aprenda planos futuros - tradução correta",
    "time": "10 MIN",
    "phrase": "Hello, I am Carlos",
    "translation": "Olá, eu sou Carlos",
    "vocab": [
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
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
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
        "Thank you!",
        "Agradecimento"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you!",
        "Conhecer alguém"
      ],
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Planos futuros</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Carlos = Meu nome é Carlos<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Planos futuros</h5><p><b>Frase chave:</b> Hello, I am Carlos = Olá, eu sou Carlos</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Hello, I am Carlos'",
        "opts": [
          "Boa noite",
          "Olá, eu sou Carlos",
          "Até logo",
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
        "q": "Complete: 'Hello, my ___ is Carlos'",
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
        "q": "Quando usar 'Hello, I am Carlos'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "My name is Carlos",
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
          "Como vai?",
          "Onde mora?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Em 'Hello, I am Carlos', qual é o nome?",
        "opts": [
          "Carro",
          "Casa",
          "Carlos",
          "John"
        ],
        "ans": 2,
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
        "q": "Ordem correta: 'name / is / my / Carlos'",
        "opts": [
          "Carlos is my name",
          "My Carlos is name",
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
          "Meu nome não é",
          "Onde você mora?",
          "Olá, eu sou Carlos",
          "Qual seu nome?"
        ],
        "ans": 2,
        "type": "translation"
      }
    ]
  },
  {
    "id": 118,
    "module": 2,
    "moduleName": "Vida Diária",
    "level": "A2",
    "title": "Passado simples",
    "desc": "Aprenda passado simples - tradução correta",
    "time": "11 MIN",
    "phrase": "Good morning, I am Sofia",
    "translation": "Bom dia, eu sou Sofia",
    "vocab": [
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Hi",
        "Oi",
        "Hi, nice to see you!",
        "Informal"
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
        "House",
        "Casa",
        "My house is big",
        "Casa"
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
        "Nice to meet you!",
        "Conhecer alguém"
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
        "Good morning!",
        "Até meio-dia"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Passado simples</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Sofia = Meu nome é Sofia<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Passado simples</h5><p><b>Frase chave:</b> Good morning, I am Sofia = Bom dia, eu sou Sofia</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Good morning, I am Sofia'",
        "opts": [
          "Até logo",
          "Bom dia",
          "Bom dia, eu sou Sofia",
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
        "q": "Quando usar 'Good morning, I am Sofia'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "My name is Sofia",
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
        "q": "Em 'Good morning, I am Sofia', qual é o nome?",
        "opts": [
          "Sofia",
          "John",
          "Casa",
          "Carro"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Sofia'",
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
        "q": "Ordem correta: 'name / is / my / Sofia'",
        "opts": [
          "My name is Sofia",
          "My Sofia is name",
          "Sofia is my name",
          "Is my name Sofia"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Sofia'",
        "opts": [
          "Bom dia",
          "Até logo",
          "Prazer em conhecer você, Sofia",
          "Boa noite"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Sofia' significa:",
        "opts": [
          "Onde você mora?",
          "Bom dia, eu sou Sofia",
          "Qual seu nome?",
          "Meu nome não é"
        ],
        "ans": 1,
        "type": "translation"
      }
    ]
  },
  {
    "id": 119,
    "module": 2,
    "moduleName": "Vida Diária",
    "level": "A2",
    "title": "Experiências",
    "desc": "Aprenda experiências - tradução correta",
    "time": "12 MIN",
    "phrase": "My name is David",
    "translation": "Meu nome é David",
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
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you!",
        "Conhecer alguém"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me!",
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
        "Good evening!",
        "Chegada noite"
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
        "Thank you",
        "Obrigado",
        "Thank you!",
        "Agradecimento"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Experiências</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is David = Meu nome é David<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Experiências</h5><p><b>Frase chave:</b> My name is David = Meu nome é David</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'My name is David'",
        "opts": [
          "Meu nome é David",
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
        "q": "Complete: 'Hello, my ___ is David'",
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
        "q": "Quando usar 'My name is David'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "I am fine",
          "Thank you",
          "My name is David"
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
        "q": "Em 'My name is David', qual é o nome?",
        "opts": [
          "Casa",
          "David",
          "John",
          "Carro"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ David'",
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
        "q": "Ordem correta: 'name / is / my / David'",
        "opts": [
          "Is my name David",
          "My name is David",
          "My David is name",
          "David is my name"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, David'",
        "opts": [
          "Boa noite",
          "Prazer em conhecer você, David",
          "Até logo",
          "Bom dia"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is David' significa:",
        "opts": [
          "Meu nome não é",
          "Onde você mora?",
          "Meu nome é David",
          "Qual seu nome?"
        ],
        "ans": 2,
        "type": "translation"
      }
    ]
  },
  {
    "id": 120,
    "module": 2,
    "moduleName": "Vida Diária",
    "level": "A2",
    "title": "Preferências",
    "desc": "Aprenda preferências - tradução correta",
    "time": "13 MIN",
    "phrase": "Good morning, I am Maria",
    "translation": "Bom dia, eu sou Maria",
    "vocab": [
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
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
        "Thank you",
        "Obrigado",
        "Thank you!",
        "Agradecimento"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Hi",
        "Oi",
        "Hi, nice to see you!",
        "Informal"
      ],
      [
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me!",
        "Chamar atenção"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Preferências</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Maria = Meu nome é Maria<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Preferências</h5><p><b>Frase chave:</b> Good morning, I am Maria = Bom dia, eu sou Maria</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Good morning, I am Maria'",
        "opts": [
          "Boa noite",
          "Bom dia, eu sou Maria",
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
        "q": "Quando usar 'Good morning, I am Maria'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "My name is Maria",
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
        "q": "Em 'Good morning, I am Maria', qual é o nome?",
        "opts": [
          "Maria",
          "Casa",
          "Carro",
          "John"
        ],
        "ans": 0,
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
        "q": "Ordem correta: 'name / is / my / Maria'",
        "opts": [
          "My Maria is name",
          "My name is Maria",
          "Is my name Maria",
          "Maria is my name"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Maria'",
        "opts": [
          "Boa noite",
          "Prazer em conhecer você, Maria",
          "Bom dia",
          "Até logo"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Maria' significa:",
        "opts": [
          "Meu nome não é",
          "Onde você mora?",
          "Bom dia, eu sou Maria",
          "Qual seu nome?"
        ],
        "ans": 2,
        "type": "translation"
      }
    ]
  },
  {
    "id": 121,
    "module": 2,
    "moduleName": "Vida Diária",
    "level": "A2",
    "title": "Opiniões simples",
    "desc": "Aprenda opiniões simples - tradução correta",
    "time": "6 MIN",
    "phrase": "I am Julia",
    "translation": "Eu sou Julia",
    "vocab": [
      [
        "Excuse me",
        "Com licença",
        "Excuse me!",
        "Chamar atenção"
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
        "Good evening!",
        "Chegada noite"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon!",
        "Tarde"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night!",
        "Despedida noite"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you!",
        "Agradecimento"
      ],
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Opiniões simples</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Julia = Meu nome é Julia<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Opiniões simples</h5><p><b>Frase chave:</b> I am Julia = Eu sou Julia</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'I am Julia'",
        "opts": [
          "Bom dia",
          "Até logo",
          "Boa noite",
          "Eu sou Julia"
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
        "q": "Quando usar 'I am Julia'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Como vai?",
          "Onde mora?",
          "Qual é seu nome?",
          "Quantos anos?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Em 'I am Julia', qual é o nome?",
        "opts": [
          "Casa",
          "Carro",
          "Julia",
          "John"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Julia'",
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
        "q": "Ordem correta: 'name / is / my / Julia'",
        "opts": [
          "Is my name Julia",
          "My Julia is name",
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
          "Eu sou Julia",
          "Onde você mora?",
          "Qual seu nome?",
          "Meu nome não é"
        ],
        "ans": 0,
        "type": "translation"
      }
    ]
  },
  {
    "id": 122,
    "module": 2,
    "moduleName": "Vida Diária",
    "level": "A2",
    "title": "Comparações",
    "desc": "Aprenda comparações - tradução correta",
    "time": "7 MIN",
    "phrase": "Nice to meet you, Julia",
    "translation": "Prazer em conhecer você, Julia",
    "vocab": [
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening!",
        "Chegada noite"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon!",
        "Tarde"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night!",
        "Despedida noite"
      ],
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning!",
        "Até meio-dia"
      ],
      [
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
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
        "Excuse me",
        "Com licença",
        "Excuse me!",
        "Chamar atenção"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Comparações</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Julia = Meu nome é Julia<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Comparações</h5><p><b>Frase chave:</b> Nice to meet you, Julia = Prazer em conhecer você, Julia</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Nice to meet you, Julia'",
        "opts": [
          "Boa noite",
          "Até logo",
          "Bom dia",
          "Prazer em conhecer você, Julia"
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
        "q": "Quando usar 'Nice to meet you, Julia'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
        "q": "Em 'Nice to meet you, Julia', qual é o nome?",
        "opts": [
          "Casa",
          "John",
          "Carro",
          "Julia"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Julia'",
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
        "q": "Ordem correta: 'name / is / my / Julia'",
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
          "Meu nome não é",
          "Onde você mora?",
          "Prazer em conhecer você, Julia",
          "Qual seu nome?"
        ],
        "ans": 2,
        "type": "translation"
      }
    ]
  },
  {
    "id": 123,
    "module": 2,
    "moduleName": "Vida Diária",
    "level": "A2",
    "title": "Conselhos",
    "desc": "Aprenda conselhos - tradução correta",
    "time": "8 MIN",
    "phrase": "Hello, I am Pedro",
    "translation": "Olá, eu sou Pedro",
    "vocab": [
      [
        "Hi",
        "Oi",
        "Hi, nice to see you!",
        "Informal"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you!",
        "Conhecer alguém"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening!",
        "Chegada noite"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon!",
        "Tarde"
      ],
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night!",
        "Despedida noite"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you!",
        "Agradecimento"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Conselhos</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Pedro = Meu nome é Pedro<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Conselhos</h5><p><b>Frase chave:</b> Hello, I am Pedro = Olá, eu sou Pedro</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Hello, I am Pedro'",
        "opts": [
          "Até logo",
          "Olá, eu sou Pedro",
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
          "Como vai",
          "Meu nome é",
          "Quantos anos"
        ],
        "ans": 2,
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
        "q": "Quando usar 'Hello, I am Pedro'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Como vai?",
          "Onde mora?",
          "Quantos anos?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Em 'Hello, I am Pedro', qual é o nome?",
        "opts": [
          "Pedro",
          "John",
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
        "q": "Ordem correta: 'name / is / my / Pedro'",
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
          "Onde você mora?",
          "Meu nome não é",
          "Olá, eu sou Pedro"
        ],
        "ans": 3,
        "type": "translation"
      }
    ]
  },
  {
    "id": 124,
    "module": 2,
    "moduleName": "Vida Diária",
    "level": "A2",
    "title": "Convite para café",
    "desc": "Aprenda convite para café - tradução correta",
    "time": "9 MIN",
    "phrase": "Nice to meet you, John",
    "translation": "Prazer em conhecer você, John",
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
        "Excuse me!",
        "Chamar atenção"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you!",
        "Conhecer alguém"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
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
        "Thank you!",
        "Agradecimento"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night!",
        "Despedida noite"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening!",
        "Chegada noite"
      ],
      [
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
      ],
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Convite para café</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is John = Meu nome é John<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Convite para café</h5><p><b>Frase chave:</b> Nice to meet you, John = Prazer em conhecer você, John</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Nice to meet you, John'",
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
          "good",
          "name"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Nice to meet you, John'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "My name is John",
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
          "Qual é seu nome?",
          "Onde mora?",
          "Como vai?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Em 'Nice to meet you, John', qual é o nome?",
        "opts": [
          "Mike",
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
          "are",
          "be",
          "is"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Ordem correta: 'name / is / my / John'",
        "opts": [
          "My name is John",
          "John is my name",
          "Is my name John",
          "My John is name"
        ],
        "ans": 0,
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
          "Meu nome não é",
          "Onde você mora?",
          "Qual seu nome?",
          "Prazer em conhecer você, John"
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
    "title": "Conhecendo vizinhos",
    "desc": "Aprenda conhecendo vizinhos - tradução correta",
    "time": "10 MIN",
    "phrase": "Hello, my name is Sarah",
    "translation": "Olá, meu nome é Sarah",
    "vocab": [
      [
        "Thank you",
        "Obrigado",
        "Thank you!",
        "Agradecimento"
      ],
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
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
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon!",
        "Tarde"
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
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Conhecendo vizinhos</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Sarah = Meu nome é Sarah<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Conhecendo vizinhos</h5><p><b>Frase chave:</b> Hello, my name is Sarah = Olá, meu nome é Sarah</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Hello, my name is Sarah'",
        "opts": [
          "Bom dia",
          "Boa noite",
          "Olá, meu nome é Sarah",
          "Até logo"
        ],
        "ans": 2,
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
          "good",
          "name",
          "bad",
          "big"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Sarah'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "I am fine",
          "Goodbye",
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
          "Como vai?",
          "Onde mora?"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Em 'Hello, my name is Sarah', qual é o nome?",
        "opts": [
          "Casa",
          "John",
          "Carro",
          "Sarah"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Sarah'",
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
        "q": "Ordem correta: 'name / is / my / Sarah'",
        "opts": [
          "My name is Sarah",
          "Is my name Sarah",
          "My Sarah is name",
          "Sarah is my name"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Sarah'",
        "opts": [
          "Boa noite",
          "Até logo",
          "Prazer em conhecer você, Sarah",
          "Bom dia"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Sarah' significa:",
        "opts": [
          "Qual seu nome?",
          "Onde você mora?",
          "Meu nome não é",
          "Olá, meu nome é Sarah"
        ],
        "ans": 3,
        "type": "translation"
      }
    ]
  },
  {
    "id": 126,
    "module": 2,
    "moduleName": "Vida Diária",
    "level": "A2",
    "title": "Festa e celebração",
    "desc": "Aprenda festa e celebração - tradução correta",
    "time": "11 MIN",
    "phrase": "My name is Carlos",
    "translation": "Meu nome é Carlos",
    "vocab": [
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
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
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning!",
        "Até meio-dia"
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
        "Good evening!",
        "Chegada noite"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you!",
        "Agradecimento"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you!",
        "Conhecer alguém"
      ],
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Festa e celebração</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Carlos = Meu nome é Carlos<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Festa e celebração</h5><p><b>Frase chave:</b> My name is Carlos = Meu nome é Carlos</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'My name is Carlos'",
        "opts": [
          "Meu nome é Carlos",
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
          "Meu nome é",
          "Como vai",
          "Quantos anos"
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
        "q": "Quando usar 'My name is Carlos'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "My name is Carlos"
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
        "q": "Em 'My name is Carlos', qual é o nome?",
        "opts": [
          "John",
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
          "am",
          "are",
          "be",
          "is"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Ordem correta: 'name / is / my / Carlos'",
        "opts": [
          "Carlos is my name",
          "My Carlos is name",
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
          "Bom dia",
          "Boa noite"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Carlos' significa:",
        "opts": [
          "Qual seu nome?",
          "Onde você mora?",
          "Meu nome é Carlos",
          "Meu nome não é"
        ],
        "ans": 2,
        "type": "translation"
      }
    ]
  },
  {
    "id": 127,
    "module": 2,
    "moduleName": "Vida Diária",
    "level": "A2",
    "title": "Filmes e música",
    "desc": "Aprenda filmes e música - tradução correta",
    "time": "12 MIN",
    "phrase": "My name is Miguel",
    "translation": "Meu nome é Miguel",
    "vocab": [
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening!",
        "Chegada noite"
      ],
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
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
        "Nice to meet you!",
        "Conhecer alguém"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
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
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Filmes e música</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Miguel = Meu nome é Miguel<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Filmes e música</h5><p><b>Frase chave:</b> My name is Miguel = Meu nome é Miguel</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'My name is Miguel'",
        "opts": [
          "Até logo",
          "Meu nome é Miguel",
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
        "q": "Quando usar 'My name is Miguel'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Qual é seu nome?",
          "Onde mora?",
          "Como vai?",
          "Quantos anos?"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Em 'My name is Miguel', qual é o nome?",
        "opts": [
          "John",
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
          "are",
          "am",
          "be",
          "is"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Ordem correta: 'name / is / my / Miguel'",
        "opts": [
          "My name is Miguel",
          "My Miguel is name",
          "Miguel is my name",
          "Is my name Miguel"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Miguel'",
        "opts": [
          "Boa noite",
          "Até logo",
          "Prazer em conhecer você, Miguel",
          "Bom dia"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Miguel' significa:",
        "opts": [
          "Onde você mora?",
          "Qual seu nome?",
          "Meu nome é Miguel",
          "Meu nome não é"
        ],
        "ans": 2,
        "type": "translation"
      }
    ]
  },
  {
    "id": 128,
    "module": 2,
    "moduleName": "Vida Diária",
    "level": "A2",
    "title": "Esportes",
    "desc": "Aprenda esportes - tradução correta",
    "time": "13 MIN",
    "phrase": "Hello, I am Emma",
    "translation": "Olá, eu sou Emma",
    "vocab": [
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
        "Good afternoon!",
        "Tarde"
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
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me!",
        "Chamar atenção"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning!",
        "Até meio-dia"
      ],
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Esportes</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Emma = Meu nome é Emma<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Esportes</h5><p><b>Frase chave:</b> Hello, I am Emma = Olá, eu sou Emma</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Hello, I am Emma'",
        "opts": [
          "Bom dia",
          "Olá, eu sou Emma",
          "Até logo",
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
          "Como vai",
          "Meu nome é"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Emma'",
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
        "q": "Quando usar 'Hello, I am Emma'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "My name is Emma",
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
          "Onde mora?",
          "Como vai?"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Em 'Hello, I am Emma', qual é o nome?",
        "opts": [
          "Carro",
          "Casa",
          "Emma",
          "John"
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
        "q": "Ordem correta: 'name / is / my / Emma'",
        "opts": [
          "My name is Emma",
          "My Emma is name",
          "Is my name Emma",
          "Emma is my name"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Emma'",
        "opts": [
          "Bom dia",
          "Prazer em conhecer você, Emma",
          "Boa noite",
          "Até logo"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Emma' significa:",
        "opts": [
          "Onde você mora?",
          "Meu nome não é",
          "Qual seu nome?",
          "Olá, eu sou Emma"
        ],
        "ans": 3,
        "type": "translation"
      }
    ]
  },
  {
    "id": 129,
    "module": 2,
    "moduleName": "Vida Diária",
    "level": "A2",
    "title": "Viagem curta",
    "desc": "Aprenda viagem curta - tradução correta",
    "time": "6 MIN",
    "phrase": "My name is Sarah",
    "translation": "Meu nome é Sarah",
    "vocab": [
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
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
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you!",
        "Agradecimento"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night!",
        "Despedida noite"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Viagem curta</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Sarah = Meu nome é Sarah<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Viagem curta</h5><p><b>Frase chave:</b> My name is Sarah = Meu nome é Sarah</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'My name is Sarah'",
        "opts": [
          "Até logo",
          "Meu nome é Sarah",
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
        "q": "Quando usar 'My name is Sarah'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "My name is Sarah"
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
        "q": "Em 'My name is Sarah', qual é o nome?",
        "opts": [
          "Sarah",
          "Carro",
          "Casa",
          "John"
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
        "q": "Ordem correta: 'name / is / my / Sarah'",
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
          "Meu nome é Sarah",
          "Qual seu nome?",
          "Meu nome não é",
          "Onde você mora?"
        ],
        "ans": 0,
        "type": "translation"
      }
    ]
  },
  {
    "id": 130,
    "module": 2,
    "moduleName": "Vida Diária",
    "level": "A2",
    "title": "Cultura local",
    "desc": "Aprenda cultura local - tradução correta",
    "time": "7 MIN",
    "phrase": "Good morning, I am Sofia",
    "translation": "Bom dia, eu sou Sofia",
    "vocab": [
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon!",
        "Tarde"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening!",
        "Chegada noite"
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
        "Good night!",
        "Despedida noite"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you!",
        "Agradecimento"
      ],
      [
        "Hi",
        "Oi",
        "Hi, nice to see you!",
        "Informal"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Cultura local</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Sofia = Meu nome é Sofia<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Cultura local</h5><p><b>Frase chave:</b> Good morning, I am Sofia = Bom dia, eu sou Sofia</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Good morning, I am Sofia'",
        "opts": [
          "Bom dia, eu sou Sofia",
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
        "q": "Quando usar 'Good morning, I am Sofia'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Thank you",
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
          "Como vai?",
          "Qual é seu nome?",
          "Onde mora?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Em 'Good morning, I am Sofia', qual é o nome?",
        "opts": [
          "Carro",
          "Casa",
          "Sofia",
          "John"
        ],
        "ans": 2,
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
        "q": "Ordem correta: 'name / is / my / Sofia'",
        "opts": [
          "My Sofia is name",
          "My name is Sofia",
          "Sofia is my name",
          "Is my name Sofia"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Sofia'",
        "opts": [
          "Bom dia",
          "Prazer em conhecer você, Sofia",
          "Até logo",
          "Boa noite"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Sofia' significa:",
        "opts": [
          "Qual seu nome?",
          "Bom dia, eu sou Sofia",
          "Onde você mora?",
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
    "title": "Apresentação no trabalho",
    "desc": "Aprenda apresentação no trabalho - tradução correta",
    "time": "8 MIN",
    "phrase": "Good morning, I am John",
    "translation": "Bom dia, eu sou John",
    "vocab": [
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ],
      [
        "Hi",
        "Oi",
        "Hi, nice to see you!",
        "Informal"
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
        "Excuse me!",
        "Chamar atenção"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you!",
        "Agradecimento"
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
        "Good afternoon",
        "Boa tarde",
        "Good afternoon!",
        "Tarde"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night!",
        "Despedida noite"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning!",
        "Até meio-dia"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Apresentação no trabalho</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is John = Meu nome é John<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Apresentação no trabalho</h5><p><b>Frase chave:</b> Good morning, I am John = Bom dia, eu sou John</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Good morning, I am John'",
        "opts": [
          "Boa noite",
          "Bom dia",
          "Até logo",
          "Bom dia, eu sou John"
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
        "q": "Quando usar 'Good morning, I am John'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "My name is John",
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
          "Onde mora?",
          "Como vai?",
          "Quantos anos?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Em 'Good morning, I am John', qual é o nome?",
        "opts": [
          "Casa",
          "Carro",
          "John",
          "Mike"
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
        "q": "Ordem correta: 'name / is / my / John'",
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
          "Onde você mora?",
          "Qual seu nome?",
          "Bom dia, eu sou John",
          "Meu nome não é"
        ],
        "ans": 2,
        "type": "translation"
      }
    ]
  },
  {
    "id": 132,
    "module": 3,
    "moduleName": "Comunicação",
    "level": "B1",
    "title": "Primeiro dia",
    "desc": "Aprenda primeiro dia - tradução correta",
    "time": "9 MIN",
    "phrase": "Hello, I am Maria",
    "translation": "Olá, eu sou Maria",
    "vocab": [
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
        "Good morning",
        "Bom dia",
        "Good morning!",
        "Até meio-dia"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
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
        "Good afternoon!",
        "Tarde"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Primeiro dia</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Maria = Meu nome é Maria<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Primeiro dia</h5><p><b>Frase chave:</b> Hello, I am Maria = Olá, eu sou Maria</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Hello, I am Maria'",
        "opts": [
          "Olá, eu sou Maria",
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
          "Quantos anos",
          "Onde mora",
          "Meu nome é"
        ],
        "ans": 3,
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
        "q": "Quando usar 'Hello, I am Maria'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Goodbye",
          "My name is Maria"
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
        "q": "Em 'Hello, I am Maria', qual é o nome?",
        "opts": [
          "Maria",
          "Casa",
          "John",
          "Carro"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Maria'",
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
        "q": "Ordem correta: 'name / is / my / Maria'",
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
          "Até logo",
          "Bom dia",
          "Boa noite",
          "Prazer em conhecer você, Maria"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Maria' significa:",
        "opts": [
          "Qual seu nome?",
          "Onde você mora?",
          "Meu nome não é",
          "Olá, eu sou Maria"
        ],
        "ans": 3,
        "type": "translation"
      }
    ]
  },
  {
    "id": 133,
    "module": 3,
    "moduleName": "Comunicação",
    "level": "B1",
    "title": "Reunião de equipe",
    "desc": "Aprenda reunião de equipe - tradução correta",
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
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening!",
        "Chegada noite"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you!",
        "Agradecimento"
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
        "Good night",
        "Boa noite",
        "Good night!",
        "Despedida noite"
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
        "Excuse me!",
        "Chamar atenção"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning!",
        "Até meio-dia"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Reunião de equipe</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is David = Meu nome é David<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Reunião de equipe</h5><p><b>Frase chave:</b> Hello, my name is David = Olá, meu nome é David</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Hello, my name is David'",
        "opts": [
          "Boa noite",
          "Bom dia",
          "Até logo",
          "Olá, meu nome é David"
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
          "Ao dirigir",
          "Ao comer",
          "Ao se apresentar"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Qual palavra significa 'Olá'?",
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
          "My name is David"
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
        "q": "Em 'Hello, my name is David', qual é o nome?",
        "opts": [
          "Casa",
          "John",
          "Carro",
          "David"
        ],
        "ans": 3,
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
        "q": "Ordem correta: 'name / is / my / David'",
        "opts": [
          "My name is David",
          "My David is name",
          "David is my name",
          "Is my name David"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, David'",
        "opts": [
          "Boa noite",
          "Prazer em conhecer você, David",
          "Até logo",
          "Bom dia"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is David' significa:",
        "opts": [
          "Qual seu nome?",
          "Meu nome não é",
          "Olá, meu nome é David",
          "Onde você mora?"
        ],
        "ans": 2,
        "type": "translation"
      }
    ]
  },
  {
    "id": 134,
    "module": 3,
    "moduleName": "Comunicação",
    "level": "B1",
    "title": "Email profissional",
    "desc": "Aprenda email profissional - tradução correta",
    "time": "11 MIN",
    "phrase": "Good morning, I am Julia",
    "translation": "Bom dia, eu sou Julia",
    "vocab": [
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Hi",
        "Oi",
        "Hi, nice to see you!",
        "Informal"
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
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon!",
        "Tarde"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning!",
        "Até meio-dia"
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
        "Good night!",
        "Despedida noite"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Email profissional</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Julia = Meu nome é Julia<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Email profissional</h5><p><b>Frase chave:</b> Good morning, I am Julia = Bom dia, eu sou Julia</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Good morning, I am Julia'",
        "opts": [
          "Boa noite",
          "Bom dia",
          "Até logo",
          "Bom dia, eu sou Julia"
        ],
        "ans": 3,
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
          "good",
          "bad",
          "big",
          "name"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Good morning, I am Julia'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Como vai?",
          "Quantos anos?",
          "Onde mora?"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Em 'Good morning, I am Julia', qual é o nome?",
        "opts": [
          "Julia",
          "Carro",
          "John",
          "Casa"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Julia'",
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
        "q": "Ordem correta: 'name / is / my / Julia'",
        "opts": [
          "My name is Julia",
          "Julia is my name",
          "Is my name Julia",
          "My Julia is name"
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
          "Bom dia, eu sou Julia",
          "Meu nome não é",
          "Qual seu nome?",
          "Onde você mora?"
        ],
        "ans": 0,
        "type": "translation"
      }
    ]
  },
  {
    "id": 135,
    "module": 3,
    "moduleName": "Comunicação",
    "level": "B1",
    "title": "Entrevista",
    "desc": "Aprenda entrevista - tradução correta",
    "time": "12 MIN",
    "phrase": "Nice to meet you, Julia",
    "translation": "Prazer em conhecer você, Julia",
    "vocab": [
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
      ],
      [
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
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
        "Good morning!",
        "Até meio-dia"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening!",
        "Chegada noite"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me!",
        "Chamar atenção"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Entrevista</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Julia = Meu nome é Julia<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Entrevista</h5><p><b>Frase chave:</b> Nice to meet you, Julia = Prazer em conhecer você, Julia</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Nice to meet you, Julia'",
        "opts": [
          "Até logo",
          "Boa noite",
          "Bom dia",
          "Prazer em conhecer você, Julia"
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
        "q": "Complete: 'Hello, my ___ is Julia'",
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
        "q": "Quando usar 'Nice to meet you, Julia'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Onde mora?",
          "Qual é seu nome?",
          "Quantos anos?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Em 'Nice to meet you, Julia', qual é o nome?",
        "opts": [
          "John",
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
          "are",
          "am",
          "be"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Ordem correta: 'name / is / my / Julia'",
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
          "Prazer em conhecer você, Julia",
          "Qual seu nome?",
          "Onde você mora?",
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
    "title": "Negociação",
    "desc": "Aprenda negociação - tradução correta",
    "time": "13 MIN",
    "phrase": "My name is David",
    "translation": "Meu nome é David",
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
        "Good night!",
        "Despedida noite"
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
        "Good morning!",
        "Até meio-dia"
      ],
      [
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
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
        "Good evening!",
        "Chegada noite"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Negociação</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is David = Meu nome é David<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Negociação</h5><p><b>Frase chave:</b> My name is David = Meu nome é David</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'My name is David'",
        "opts": [
          "Até logo",
          "Bom dia",
          "Boa noite",
          "Meu nome é David"
        ],
        "ans": 3,
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
        "q": "Complete: 'Hello, my ___ is David'",
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
        "q": "Quando usar 'My name is David'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Onde mora?",
          "Como vai?",
          "Quantos anos?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Em 'My name is David', qual é o nome?",
        "opts": [
          "Carro",
          "John",
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
          "is",
          "am",
          "are"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Ordem correta: 'name / is / my / David'",
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
          "Meu nome é David",
          "Onde você mora?"
        ],
        "ans": 2,
        "type": "translation"
      }
    ]
  },
  {
    "id": 137,
    "module": 3,
    "moduleName": "Comunicação",
    "level": "B1",
    "title": "Atendimento ao cliente",
    "desc": "Aprenda atendimento ao cliente - tradução correta",
    "time": "6 MIN",
    "phrase": "Hello, my name is Lucas",
    "translation": "Olá, meu nome é Lucas",
    "vocab": [
      [
        "Excuse me",
        "Com licença",
        "Excuse me!",
        "Chamar atenção"
      ],
      [
        "Hi",
        "Oi",
        "Hi, nice to see you!",
        "Informal"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you!",
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
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
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
        "Good afternoon!",
        "Tarde"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Atendimento ao cliente</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Lucas = Meu nome é Lucas<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Atendimento ao cliente</h5><p><b>Frase chave:</b> Hello, my name is Lucas = Olá, meu nome é Lucas</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Hello, my name is Lucas'",
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
          "Ao comer",
          "Ao dormir",
          "Ao se apresentar",
          "Ao dirigir"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Qual palavra significa 'Olá'?",
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
        "q": "Em 'Hello, my name is Lucas', qual é o nome?",
        "opts": [
          "Lucas",
          "John",
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
        "q": "Ordem correta: 'name / is / my / Lucas'",
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
          "Prazer em conhecer você, Lucas",
          "Boa noite",
          "Até logo",
          "Bom dia"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Lucas' significa:",
        "opts": [
          "Meu nome não é",
          "Qual seu nome?",
          "Olá, meu nome é Lucas",
          "Onde você mora?"
        ],
        "ans": 2,
        "type": "translation"
      }
    ]
  },
  {
    "id": 138,
    "module": 3,
    "moduleName": "Comunicação",
    "level": "B1",
    "title": "Feedback",
    "desc": "Aprenda feedback - tradução correta",
    "time": "7 MIN",
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
        "Good evening!",
        "Chegada noite"
      ],
      [
        "Hi",
        "Oi",
        "Hi, nice to see you!",
        "Informal"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me!",
        "Chamar atenção"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon!",
        "Tarde"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Feedback</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Miguel = Meu nome é Miguel<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Feedback</h5><p><b>Frase chave:</b> Hello, my name is Miguel = Olá, meu nome é Miguel</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Hello, my name is Miguel'",
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
          "Ao dirigir",
          "Ao se apresentar",
          "Ao comer"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Qual palavra significa 'Olá'?",
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
        "q": "Em 'Hello, my name is Miguel', qual é o nome?",
        "opts": [
          "John",
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
          "are",
          "be",
          "is",
          "am"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Ordem correta: 'name / is / my / Miguel'",
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
          "Meu nome não é",
          "Qual seu nome?",
          "Onde você mora?",
          "Olá, meu nome é Miguel"
        ],
        "ans": 3,
        "type": "translation"
      }
    ]
  },
  {
    "id": 139,
    "module": 3,
    "moduleName": "Comunicação",
    "level": "B1",
    "title": "Desculpas profissionais",
    "desc": "Aprenda desculpas profissionais - tradução correta",
    "time": "8 MIN",
    "phrase": "Nice to meet you, John",
    "translation": "Prazer em conhecer você, John",
    "vocab": [
      [
        "Thank you",
        "Obrigado",
        "Thank you!",
        "Agradecimento"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night!",
        "Despedida noite"
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
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
      ],
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning!",
        "Até meio-dia"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
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
        "Good evening!",
        "Chegada noite"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Desculpas profissionais</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is John = Meu nome é John<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Desculpas profissionais</h5><p><b>Frase chave:</b> Nice to meet you, John = Prazer em conhecer você, John</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Nice to meet you, John'",
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
          "good",
          "bad",
          "big",
          "name"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Nice to meet you, John'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Como vai?",
          "Qual é seu nome?",
          "Onde mora?",
          "Quantos anos?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Em 'Nice to meet you, John', qual é o nome?",
        "opts": [
          "Casa",
          "Mike",
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
          "am",
          "is",
          "be"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Ordem correta: 'name / is / my / John'",
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
          "Até logo",
          "Bom dia",
          "Boa noite",
          "Prazer em conhecer você, John"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is John' significa:",
        "opts": [
          "Qual seu nome?",
          "Meu nome não é",
          "Prazer em conhecer você, John",
          "Onde você mora?"
        ],
        "ans": 2,
        "type": "translation"
      }
    ]
  },
  {
    "id": 140,
    "module": 3,
    "moduleName": "Comunicação",
    "level": "B1",
    "title": "Elogios",
    "desc": "Aprenda elogios - tradução correta",
    "time": "9 MIN",
    "phrase": "Nice to meet you, Lucas",
    "translation": "Prazer em conhecer você, Lucas",
    "vocab": [
      [
        "Good morning",
        "Bom dia",
        "Good morning!",
        "Até meio-dia"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me!",
        "Chamar atenção"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
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
        "Thank you!",
        "Agradecimento"
      ],
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night!",
        "Despedida noite"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Hi",
        "Oi",
        "Hi, nice to see you!",
        "Informal"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Elogios</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Lucas = Meu nome é Lucas<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Elogios</h5><p><b>Frase chave:</b> Nice to meet you, Lucas = Prazer em conhecer você, Lucas</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Nice to meet you, Lucas'",
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
          "bad",
          "big",
          "good",
          "name"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Nice to meet you, Lucas'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Como vai?",
          "Onde mora?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Em 'Nice to meet you, Lucas', qual é o nome?",
        "opts": [
          "Carro",
          "John",
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
          "be",
          "is",
          "are"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Ordem correta: 'name / is / my / Lucas'",
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
          "Bom dia",
          "Até logo",
          "Boa noite",
          "Prazer em conhecer você, Lucas"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Lucas' significa:",
        "opts": [
          "Onde você mora?",
          "Qual seu nome?",
          "Meu nome não é",
          "Prazer em conhecer você, Lucas"
        ],
        "ans": 3,
        "type": "translation"
      }
    ]
  },
  {
    "id": 141,
    "module": 3,
    "moduleName": "Comunicação",
    "level": "B1",
    "title": "Férias e folga",
    "desc": "Aprenda férias e folga - tradução correta",
    "time": "10 MIN",
    "phrase": "Nice to meet you, Emma",
    "translation": "Prazer em conhecer você, Emma",
    "vocab": [
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Hi",
        "Oi",
        "Hi, nice to see you!",
        "Informal"
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
        "Nice to meet you!",
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
        "Good night!",
        "Despedida noite"
      ],
      [
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
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
        "Good evening!",
        "Chegada noite"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Férias e folga</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Emma = Meu nome é Emma<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Férias e folga</h5><p><b>Frase chave:</b> Nice to meet you, Emma = Prazer em conhecer você, Emma</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Nice to meet you, Emma'",
        "opts": [
          "Boa noite",
          "Até logo",
          "Prazer em conhecer você, Emma",
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
          "Meu nome é",
          "Quantos anos"
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
        "q": "Quando usar 'Nice to meet you, Emma'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Como vai?",
          "Quantos anos?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Em 'Nice to meet you, Emma', qual é o nome?",
        "opts": [
          "Emma",
          "Carro",
          "Casa",
          "John"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Emma'",
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
        "q": "Ordem correta: 'name / is / my / Emma'",
        "opts": [
          "Emma is my name",
          "My Emma is name",
          "My name is Emma",
          "Is my name Emma"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Emma'",
        "opts": [
          "Bom dia",
          "Até logo",
          "Prazer em conhecer você, Emma",
          "Boa noite"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Emma' significa:",
        "opts": [
          "Onde você mora?",
          "Qual seu nome?",
          "Prazer em conhecer você, Emma",
          "Meu nome não é"
        ],
        "ans": 2,
        "type": "translation"
      }
    ]
  },
  {
    "id": 142,
    "module": 3,
    "moduleName": "Comunicação",
    "level": "B1",
    "title": "Horário de trabalho",
    "desc": "Aprenda horário de trabalho - tradução correta",
    "time": "11 MIN",
    "phrase": "Hello, my name is Emma",
    "translation": "Olá, meu nome é Emma",
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
        "Thank you!",
        "Agradecimento"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning!",
        "Até meio-dia"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
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
        "Nice to meet you!",
        "Conhecer alguém"
      ],
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
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
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Horário de trabalho</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Emma = Meu nome é Emma<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Horário de trabalho</h5><p><b>Frase chave:</b> Hello, my name is Emma = Olá, meu nome é Emma</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Hello, my name is Emma'",
        "opts": [
          "Olá, meu nome é Emma",
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
          "Meu nome é",
          "Quantos anos"
        ],
        "ans": 2,
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
          "Ao dirigir",
          "Ao dormir",
          "Ao se apresentar"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Qual palavra significa 'Olá'?",
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
          "Goodbye",
          "I am fine",
          "My name is Emma"
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
        "q": "Em 'Hello, my name is Emma', qual é o nome?",
        "opts": [
          "John",
          "Carro",
          "Emma",
          "Casa"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Emma'",
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
        "q": "Ordem correta: 'name / is / my / Emma'",
        "opts": [
          "Is my name Emma",
          "My Emma is name",
          "My name is Emma",
          "Emma is my name"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Emma'",
        "opts": [
          "Boa noite",
          "Prazer em conhecer você, Emma",
          "Até logo",
          "Bom dia"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Emma' significa:",
        "opts": [
          "Meu nome não é",
          "Qual seu nome?",
          "Olá, meu nome é Emma",
          "Onde você mora?"
        ],
        "ans": 2,
        "type": "translation"
      }
    ]
  },
  {
    "id": 143,
    "module": 3,
    "moduleName": "Comunicação",
    "level": "B1",
    "title": "Projetos e prazos",
    "desc": "Aprenda projetos e prazos - tradução correta",
    "time": "12 MIN",
    "phrase": "I am Carlos",
    "translation": "Eu sou Carlos",
    "vocab": [
      [
        "Good night",
        "Boa noite",
        "Good night!",
        "Despedida noite"
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
        "Good afternoon",
        "Boa tarde",
        "Good afternoon!",
        "Tarde"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening!",
        "Chegada noite"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you!",
        "Agradecimento"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you!",
        "Conhecer alguém"
      ],
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Projetos e prazos</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Carlos = Meu nome é Carlos<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Projetos e prazos</h5><p><b>Frase chave:</b> I am Carlos = Eu sou Carlos</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'I am Carlos'",
        "opts": [
          "Bom dia",
          "Eu sou Carlos",
          "Boa noite",
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
        "q": "Complete: 'Hello, my ___ is Carlos'",
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
        "q": "Quando usar 'I am Carlos'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "I am fine",
          "Thank you",
          "Goodbye",
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
        "q": "Em 'I am Carlos', qual é o nome?",
        "opts": [
          "John",
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
          "are",
          "is",
          "am"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Ordem correta: 'name / is / my / Carlos'",
        "opts": [
          "Carlos is my name",
          "My name is Carlos",
          "My Carlos is name",
          "Is my name Carlos"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Carlos'",
        "opts": [
          "Prazer em conhecer você, Carlos",
          "Boa noite",
          "Até logo",
          "Bom dia"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Carlos' significa:",
        "opts": [
          "Meu nome não é",
          "Onde você mora?",
          "Qual seu nome?",
          "Eu sou Carlos"
        ],
        "ans": 3,
        "type": "translation"
      }
    ]
  },
  {
    "id": 144,
    "module": 3,
    "moduleName": "Comunicação",
    "level": "B1",
    "title": "Trabalho em equipe",
    "desc": "Aprenda trabalho em equipe - tradução correta",
    "time": "13 MIN",
    "phrase": "I am Julia",
    "translation": "Eu sou Julia",
    "vocab": [
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you!",
        "Conhecer alguém"
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
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
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
        "Thank you!",
        "Agradecimento"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me!",
        "Chamar atenção"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Trabalho em equipe</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Julia = Meu nome é Julia<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Trabalho em equipe</h5><p><b>Frase chave:</b> I am Julia = Eu sou Julia</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'I am Julia'",
        "opts": [
          "Bom dia",
          "Eu sou Julia",
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
        "q": "Complete: 'Hello, my ___ is Julia'",
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
        "q": "Quando usar 'I am Julia'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "My name is Julia",
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
        "q": "Em 'I am Julia', qual é o nome?",
        "opts": [
          "Julia",
          "Casa",
          "John",
          "Carro"
        ],
        "ans": 0,
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
        "q": "Ordem correta: 'name / is / my / Julia'",
        "opts": [
          "My name is Julia",
          "My Julia is name",
          "Is my name Julia",
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
          "Bom dia",
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
          "Onde você mora?",
          "Eu sou Julia"
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
    "title": "Liderança",
    "desc": "Aprenda liderança - tradução correta",
    "time": "6 MIN",
    "phrase": "Good morning, I am Maria",
    "translation": "Bom dia, eu sou Maria",
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
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
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
        "Excuse me!",
        "Chamar atenção"
      ],
      [
        "Hi",
        "Oi",
        "Hi, nice to see you!",
        "Informal"
      ],
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night!",
        "Despedida noite"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you!",
        "Conhecer alguém"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning!",
        "Até meio-dia"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Liderança</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Maria = Meu nome é Maria<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Liderança</h5><p><b>Frase chave:</b> Good morning, I am Maria = Bom dia, eu sou Maria</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Good morning, I am Maria'",
        "opts": [
          "Bom dia",
          "Boa noite",
          "Até logo",
          "Bom dia, eu sou Maria"
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
          "bad",
          "big",
          "good",
          "name"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Good morning, I am Maria'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Onde mora?",
          "Quantos anos?",
          "Como vai?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Em 'Good morning, I am Maria', qual é o nome?",
        "opts": [
          "Carro",
          "Casa",
          "Maria",
          "John"
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
        "q": "Ordem correta: 'name / is / my / Maria'",
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
          "Boa noite",
          "Até logo",
          "Bom dia",
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
          "Bom dia, eu sou Maria",
          "Onde você mora?"
        ],
        "ans": 2,
        "type": "translation"
      }
    ]
  },
  {
    "id": 146,
    "module": 3,
    "moduleName": "Comunicação",
    "level": "B1",
    "title": "Resolvendo problemas",
    "desc": "Aprenda resolvendo problemas - tradução correta",
    "time": "7 MIN",
    "phrase": "Hello, my name is Maria",
    "translation": "Olá, meu nome é Maria",
    "vocab": [
      [
        "Good night",
        "Boa noite",
        "Good night!",
        "Despedida noite"
      ],
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
      ],
      [
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening!",
        "Chegada noite"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me!",
        "Chamar atenção"
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
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Resolvendo problemas</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Maria = Meu nome é Maria<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Resolvendo problemas</h5><p><b>Frase chave:</b> Hello, my name is Maria = Olá, meu nome é Maria</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Hello, my name is Maria'",
        "opts": [
          "Olá, meu nome é Maria",
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
          "Quantos anos",
          "Como vai",
          "Onde mora"
        ],
        "ans": 0,
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
          "Ao dormir",
          "Ao se apresentar",
          "Ao dirigir"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Qual palavra significa 'Olá'?",
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
          "My name is Maria",
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
        "q": "Em 'Hello, my name is Maria', qual é o nome?",
        "opts": [
          "Casa",
          "John",
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
          "be",
          "are",
          "am"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Ordem correta: 'name / is / my / Maria'",
        "opts": [
          "Maria is my name",
          "My Maria is name",
          "Is my name Maria",
          "My name is Maria"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Maria'",
        "opts": [
          "Até logo",
          "Boa noite",
          "Bom dia",
          "Prazer em conhecer você, Maria"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Maria' significa:",
        "opts": [
          "Onde você mora?",
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
    "id": 147,
    "module": 3,
    "moduleName": "Comunicação",
    "level": "B1",
    "title": "Decisões",
    "desc": "Aprenda decisões - tradução correta",
    "time": "8 MIN",
    "phrase": "Nice to meet you, John",
    "translation": "Prazer em conhecer você, John",
    "vocab": [
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon!",
        "Tarde"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you!",
        "Conhecer alguém"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night!",
        "Despedida noite"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you!",
        "Agradecimento"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening!",
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
        "Good morning!",
        "Até meio-dia"
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
        "Hi",
        "Oi",
        "Hi, nice to see you!",
        "Informal"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Decisões</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is John = Meu nome é John<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Decisões</h5><p><b>Frase chave:</b> Nice to meet you, John = Prazer em conhecer você, John</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Nice to meet you, John'",
        "opts": [
          "Até logo",
          "Boa noite",
          "Bom dia",
          "Prazer em conhecer você, John"
        ],
        "ans": 3,
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
          "bad",
          "good",
          "big",
          "name"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Nice to meet you, John'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "My name is John",
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
          "Onde mora?",
          "Qual é seu nome?",
          "Quantos anos?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Em 'Nice to meet you, John', qual é o nome?",
        "opts": [
          "John",
          "Mike",
          "Carro",
          "Casa"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ John'",
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
        "q": "Ordem correta: 'name / is / my / John'",
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
          "Prazer em conhecer você, John",
          "Qual seu nome?",
          "Meu nome não é",
          "Onde você mora?"
        ],
        "ans": 0,
        "type": "translation"
      }
    ]
  },
  {
    "id": 148,
    "module": 3,
    "moduleName": "Comunicação",
    "level": "B1",
    "title": "Metas e objetivos",
    "desc": "Aprenda metas e objetivos - tradução correta",
    "time": "9 MIN",
    "phrase": "Hello, I am Maria",
    "translation": "Olá, eu sou Maria",
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
        "Nice to meet you!",
        "Conhecer alguém"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening!",
        "Chegada noite"
      ],
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you!",
        "Agradecimento"
      ],
      [
        "Hi",
        "Oi",
        "Hi, nice to see you!",
        "Informal"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning!",
        "Até meio-dia"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon!",
        "Tarde"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night!",
        "Despedida noite"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Metas e objetivos</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Maria = Meu nome é Maria<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Metas e objetivos</h5><p><b>Frase chave:</b> Hello, I am Maria = Olá, eu sou Maria</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Hello, I am Maria'",
        "opts": [
          "Olá, eu sou Maria",
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
          "Como vai",
          "Quantos anos",
          "Onde mora"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Maria'",
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
        "q": "Quando usar 'Hello, I am Maria'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
        "q": "Em 'Hello, I am Maria', qual é o nome?",
        "opts": [
          "John",
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
          "be",
          "are",
          "am",
          "is"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Ordem correta: 'name / is / my / Maria'",
        "opts": [
          "Maria is my name",
          "My name is Maria",
          "Is my name Maria",
          "My Maria is name"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Maria'",
        "opts": [
          "Prazer em conhecer você, Maria",
          "Boa noite",
          "Bom dia",
          "Até logo"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Maria' significa:",
        "opts": [
          "Meu nome não é",
          "Olá, eu sou Maria",
          "Onde você mora?",
          "Qual seu nome?"
        ],
        "ans": 1,
        "type": "translation"
      }
    ]
  },
  {
    "id": 149,
    "module": 3,
    "moduleName": "Comunicação",
    "level": "B1",
    "title": "Produtividade",
    "desc": "Aprenda produtividade - tradução correta",
    "time": "10 MIN",
    "phrase": "Nice to meet you, Julia",
    "translation": "Prazer em conhecer você, Julia",
    "vocab": [
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon!",
        "Tarde"
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
        "Hi",
        "Oi",
        "Hi, nice to see you!",
        "Informal"
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
        "Good evening!",
        "Chegada noite"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me!",
        "Chamar atenção"
      ],
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ],
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Produtividade</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Julia = Meu nome é Julia<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Produtividade</h5><p><b>Frase chave:</b> Nice to meet you, Julia = Prazer em conhecer você, Julia</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Nice to meet you, Julia'",
        "opts": [
          "Bom dia",
          "Prazer em conhecer você, Julia",
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
        "q": "Quando usar 'Nice to meet you, Julia'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Quantos anos?",
          "Como vai?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Em 'Nice to meet you, Julia', qual é o nome?",
        "opts": [
          "Julia",
          "Casa",
          "Carro",
          "John"
        ],
        "ans": 0,
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
        "q": "Ordem correta: 'name / is / my / Julia'",
        "opts": [
          "My Julia is name",
          "Julia is my name",
          "My name is Julia",
          "Is my name Julia"
        ],
        "ans": 2,
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
          "Prazer em conhecer você, Julia",
          "Qual seu nome?",
          "Meu nome não é",
          "Onde você mora?"
        ],
        "ans": 0,
        "type": "translation"
      }
    ]
  },
  {
    "id": 150,
    "module": 3,
    "moduleName": "Comunicação",
    "level": "B1",
    "title": "Networking",
    "desc": "Aprenda networking - tradução correta",
    "time": "11 MIN",
    "phrase": "I am Ana",
    "translation": "Eu sou Ana",
    "vocab": [
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon!",
        "Tarde"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me!",
        "Chamar atenção"
      ],
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening!",
        "Chegada noite"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you!",
        "Agradecimento"
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
        "Good night",
        "Boa noite",
        "Good night!",
        "Despedida noite"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you!",
        "Conhecer alguém"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning!",
        "Até meio-dia"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Networking</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Ana = Meu nome é Ana<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Networking</h5><p><b>Frase chave:</b> I am Ana = Eu sou Ana</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'I am Ana'",
        "opts": [
          "Eu sou Ana",
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
          "Quantos anos",
          "Meu nome é",
          "Onde mora"
        ],
        "ans": 2,
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
        "q": "Quando usar 'I am Ana'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "My name is Ana"
        ],
        "ans": 3,
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
        "q": "Em 'I am Ana', qual é o nome?",
        "opts": [
          "Casa",
          "Carro",
          "Ana",
          "John"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Ana'",
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
        "q": "Ordem correta: 'name / is / my / Ana'",
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
          "Até logo",
          "Boa noite",
          "Bom dia",
          "Prazer em conhecer você, Ana"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Ana' significa:",
        "opts": [
          "Meu nome não é",
          "Onde você mora?",
          "Qual seu nome?",
          "Eu sou Ana"
        ],
        "ans": 3,
        "type": "translation"
      }
    ]
  },
  {
    "id": 151,
    "module": 3,
    "moduleName": "Comunicação",
    "level": "B1",
    "title": "Vendas e apresentação",
    "desc": "Aprenda vendas e apresentação - tradução correta",
    "time": "12 MIN",
    "phrase": "My name is Lucas",
    "translation": "Meu nome é Lucas",
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
        "Thank you",
        "Obrigado",
        "Thank you!",
        "Agradecimento"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night!",
        "Despedida noite"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon!",
        "Tarde"
      ],
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
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
        "Excuse me!",
        "Chamar atenção"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Vendas e apresentação</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Lucas = Meu nome é Lucas<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Vendas e apresentação</h5><p><b>Frase chave:</b> My name is Lucas = Meu nome é Lucas</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'My name is Lucas'",
        "opts": [
          "Até logo",
          "Meu nome é Lucas",
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
        "q": "Complete: 'Hello, my ___ is Lucas'",
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
        "q": "Quando usar 'My name is Lucas'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Thank you",
          "My name is Lucas",
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
        "q": "Em 'My name is Lucas', qual é o nome?",
        "opts": [
          "John",
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
          "am",
          "be",
          "are",
          "is"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Ordem correta: 'name / is / my / Lucas'",
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
          "Boa noite",
          "Bom dia",
          "Até logo"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Lucas' significa:",
        "opts": [
          "Onde você mora?",
          "Qual seu nome?",
          "Meu nome é Lucas",
          "Meu nome não é"
        ],
        "ans": 2,
        "type": "translation"
      }
    ]
  },
  {
    "id": 152,
    "module": 3,
    "moduleName": "Comunicação",
    "level": "B1",
    "title": "Reclamação e solução",
    "desc": "Aprenda reclamação e solução - tradução correta",
    "time": "13 MIN",
    "phrase": "Good morning, I am John",
    "translation": "Bom dia, eu sou John",
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
        "Excuse me",
        "Com licença",
        "Excuse me!",
        "Chamar atenção"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you!",
        "Agradecimento"
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
        "Nice to meet you!",
        "Conhecer alguém"
      ],
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
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
        "Good evening!",
        "Chegada noite"
      ],
      [
        "Hi",
        "Oi",
        "Hi, nice to see you!",
        "Informal"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Reclamação e solução</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is John = Meu nome é John<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Reclamação e solução</h5><p><b>Frase chave:</b> Good morning, I am John = Bom dia, eu sou John</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Good morning, I am John'",
        "opts": [
          "Bom dia, eu sou John",
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
          "Como vai",
          "Onde mora",
          "Quantos anos",
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
        "q": "Quando usar 'Good morning, I am John'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Como vai?",
          "Onde mora?",
          "Quantos anos?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Em 'Good morning, I am John', qual é o nome?",
        "opts": [
          "John",
          "Mike",
          "Carro",
          "Casa"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ John'",
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
        "q": "Ordem correta: 'name / is / my / John'",
        "opts": [
          "Is my name John",
          "My name is John",
          "My John is name",
          "John is my name"
        ],
        "ans": 1,
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
          "Bom dia, eu sou John",
          "Meu nome não é",
          "Onde você mora?",
          "Qual seu nome?"
        ],
        "ans": 0,
        "type": "translation"
      }
    ]
  },
  {
    "id": 153,
    "module": 3,
    "moduleName": "Comunicação",
    "level": "B1",
    "title": "Concordando e discordando",
    "desc": "Aprenda concordando e discordando - tradução correta",
    "time": "6 MIN",
    "phrase": "Hello, my name is Sofia",
    "translation": "Olá, meu nome é Sofia",
    "vocab": [
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon!",
        "Tarde"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
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
        "Nice to meet you!",
        "Conhecer alguém"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening!",
        "Chegada noite"
      ],
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
      ],
      [
        "Hi",
        "Oi",
        "Hi, nice to see you!",
        "Informal"
      ],
      [
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Concordando e discordando</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Sofia = Meu nome é Sofia<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Concordando e discordando</h5><p><b>Frase chave:</b> Hello, my name is Sofia = Olá, meu nome é Sofia</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Hello, my name is Sofia'",
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
          "Onde mora",
          "Como vai",
          "Meu nome é",
          "Quantos anos"
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
          "Ao comer",
          "Ao se apresentar",
          "Ao dirigir",
          "Ao dormir"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Qual palavra significa 'Olá'?",
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
          "My name is Sofia"
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
        "q": "Em 'Hello, my name is Sofia', qual é o nome?",
        "opts": [
          "John",
          "Sofia",
          "Carro",
          "Casa"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Sofia'",
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
        "q": "Ordem correta: 'name / is / my / Sofia'",
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
          "Onde você mora?",
          "Qual seu nome?",
          "Meu nome não é"
        ],
        "ans": 0,
        "type": "translation"
      }
    ]
  },
  {
    "id": 154,
    "module": 3,
    "moduleName": "Comunicação",
    "level": "B1",
    "title": "Sugestões",
    "desc": "Aprenda sugestões - tradução correta",
    "time": "7 MIN",
    "phrase": "My name is Julia",
    "translation": "Meu nome é Julia",
    "vocab": [
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning!",
        "Até meio-dia"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
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
        "Good evening!",
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
        "Excuse me!",
        "Chamar atenção"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Sugestões</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Julia = Meu nome é Julia<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Sugestões</h5><p><b>Frase chave:</b> My name is Julia = Meu nome é Julia</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'My name is Julia'",
        "opts": [
          "Até logo",
          "Meu nome é Julia",
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
        "q": "Quando usar 'My name is Julia'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Onde mora?",
          "Como vai?",
          "Quantos anos?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Em 'My name is Julia', qual é o nome?",
        "opts": [
          "John",
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
          "is",
          "are",
          "be"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Ordem correta: 'name / is / my / Julia'",
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
          "Até logo",
          "Boa noite",
          "Prazer em conhecer você, Julia",
          "Bom dia"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Julia' significa:",
        "opts": [
          "Qual seu nome?",
          "Meu nome não é",
          "Onde você mora?",
          "Meu nome é Julia"
        ],
        "ans": 3,
        "type": "translation"
      }
    ]
  },
  {
    "id": 155,
    "module": 3,
    "moduleName": "Comunicação",
    "level": "B1",
    "title": "Agradecimentos formais",
    "desc": "Aprenda agradecimentos formais - tradução correta",
    "time": "8 MIN",
    "phrase": "Good morning, I am David",
    "translation": "Bom dia, eu sou David",
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
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon!",
        "Tarde"
      ],
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
      ],
      [
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning!",
        "Até meio-dia"
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
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Agradecimentos formais</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is David = Meu nome é David<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Agradecimentos formais</h5><p><b>Frase chave:</b> Good morning, I am David = Bom dia, eu sou David</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Good morning, I am David'",
        "opts": [
          "Bom dia",
          "Até logo",
          "Boa noite",
          "Bom dia, eu sou David"
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
        "q": "Complete: 'Hello, my ___ is David'",
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
        "q": "Quando usar 'Good morning, I am David'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "My name is David"
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
        "q": "Em 'Good morning, I am David', qual é o nome?",
        "opts": [
          "Carro",
          "David",
          "John",
          "Casa"
        ],
        "ans": 1,
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
        "q": "Ordem correta: 'name / is / my / David'",
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
          "Bom dia, eu sou David",
          "Meu nome não é",
          "Onde você mora?",
          "Qual seu nome?"
        ],
        "ans": 0,
        "type": "translation"
      }
    ]
  },
  {
    "id": 156,
    "module": 3,
    "moduleName": "Comunicação",
    "level": "B1",
    "title": "Despedida profissional",
    "desc": "Aprenda despedida profissional - tradução correta",
    "time": "9 MIN",
    "phrase": "Hello, my name is Sofia",
    "translation": "Olá, meu nome é Sofia",
    "vocab": [
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
      ],
      [
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
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
        "Good morning!",
        "Até meio-dia"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you!",
        "Agradecimento"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Hi",
        "Oi",
        "Hi, nice to see you!",
        "Informal"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening!",
        "Chegada noite"
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
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Despedida profissional</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Sofia = Meu nome é Sofia<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Despedida profissional</h5><p><b>Frase chave:</b> Hello, my name is Sofia = Olá, meu nome é Sofia</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Hello, my name is Sofia'",
        "opts": [
          "Bom dia",
          "Boa noite",
          "Olá, meu nome é Sofia",
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
          "Ao se apresentar",
          "Ao dormir",
          "Ao comer",
          "Ao dirigir"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Qual palavra significa 'Olá'?",
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
          "Onde mora?",
          "Como vai?",
          "Qual é seu nome?",
          "Quantos anos?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Em 'Hello, my name is Sofia', qual é o nome?",
        "opts": [
          "Carro",
          "Sofia",
          "Casa",
          "John"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Sofia'",
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
        "q": "Ordem correta: 'name / is / my / Sofia'",
        "opts": [
          "Sofia is my name",
          "My name is Sofia",
          "My Sofia is name",
          "Is my name Sofia"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Sofia'",
        "opts": [
          "Prazer em conhecer você, Sofia",
          "Boa noite",
          "Até logo",
          "Bom dia"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Sofia' significa:",
        "opts": [
          "Qual seu nome?",
          "Onde você mora?",
          "Meu nome não é",
          "Olá, meu nome é Sofia"
        ],
        "ans": 3,
        "type": "translation"
      }
    ]
  },
  {
    "id": 157,
    "module": 3,
    "moduleName": "Comunicação",
    "level": "B1",
    "title": "Viagem de negócios",
    "desc": "Aprenda viagem de negócios - tradução correta",
    "time": "10 MIN",
    "phrase": "Good morning, I am Miguel",
    "translation": "Bom dia, eu sou Miguel",
    "vocab": [
      [
        "Excuse me",
        "Com licença",
        "Excuse me!",
        "Chamar atenção"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
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
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
      ],
      [
        "Hi",
        "Oi",
        "Hi, nice to see you!",
        "Informal"
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
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Viagem de negócios</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Miguel = Meu nome é Miguel<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Viagem de negócios</h5><p><b>Frase chave:</b> Good morning, I am Miguel = Bom dia, eu sou Miguel</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Good morning, I am Miguel'",
        "opts": [
          "Boa noite",
          "Bom dia, eu sou Miguel",
          "Até logo",
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
        "q": "Quando usar 'Good morning, I am Miguel'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Como vai?",
          "Onde mora?",
          "Quantos anos?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Em 'Good morning, I am Miguel', qual é o nome?",
        "opts": [
          "Carro",
          "Miguel",
          "John",
          "Casa"
        ],
        "ans": 1,
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
        "q": "Ordem correta: 'name / is / my / Miguel'",
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
          "Bom dia, eu sou Miguel",
          "Meu nome não é",
          "Qual seu nome?",
          "Onde você mora?"
        ],
        "ans": 0,
        "type": "translation"
      }
    ]
  },
  {
    "id": 158,
    "module": 3,
    "moduleName": "Comunicação",
    "level": "B1",
    "title": "Conferência",
    "desc": "Aprenda conferência - tradução correta",
    "time": "11 MIN",
    "phrase": "Good morning, I am Carlos",
    "translation": "Bom dia, eu sou Carlos",
    "vocab": [
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon!",
        "Tarde"
      ],
      [
        "Hi",
        "Oi",
        "Hi, nice to see you!",
        "Informal"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night!",
        "Despedida noite"
      ],
      [
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you!",
        "Conhecer alguém"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me!",
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
        "Good morning!",
        "Até meio-dia"
      ],
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Conferência</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Carlos = Meu nome é Carlos<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Conferência</h5><p><b>Frase chave:</b> Good morning, I am Carlos = Bom dia, eu sou Carlos</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Good morning, I am Carlos'",
        "opts": [
          "Bom dia, eu sou Carlos",
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
          "Como vai",
          "Meu nome é"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Carlos'",
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
        "q": "Quando usar 'Good morning, I am Carlos'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Qual é seu nome?",
          "Onde mora?",
          "Quantos anos?",
          "Como vai?"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Em 'Good morning, I am Carlos', qual é o nome?",
        "opts": [
          "Carlos",
          "John",
          "Casa",
          "Carro"
        ],
        "ans": 0,
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
        "q": "Ordem correta: 'name / is / my / Carlos'",
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
          "Bom dia",
          "Prazer em conhecer você, Carlos",
          "Até logo",
          "Boa noite"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Carlos' significa:",
        "opts": [
          "Qual seu nome?",
          "Meu nome não é",
          "Bom dia, eu sou Carlos",
          "Onde você mora?"
        ],
        "ans": 2,
        "type": "translation"
      }
    ]
  },
  {
    "id": 159,
    "module": 3,
    "moduleName": "Comunicação",
    "level": "B1",
    "title": "Inglês para reuniões",
    "desc": "Aprenda inglês para reuniões - tradução correta",
    "time": "12 MIN",
    "phrase": "Good morning, I am Lucas",
    "translation": "Bom dia, eu sou Lucas",
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
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
      ],
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Hi",
        "Oi",
        "Hi, nice to see you!",
        "Informal"
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
        "Good afternoon!",
        "Tarde"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening!",
        "Chegada noite"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Inglês para reuniões</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Lucas = Meu nome é Lucas<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Inglês para reuniões</h5><p><b>Frase chave:</b> Good morning, I am Lucas = Bom dia, eu sou Lucas</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Good morning, I am Lucas'",
        "opts": [
          "Boa noite",
          "Bom dia",
          "Até logo",
          "Bom dia, eu sou Lucas"
        ],
        "ans": 3,
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
          "bad",
          "big",
          "name",
          "good"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Good morning, I am Lucas'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Quantos anos?",
          "Qual é seu nome?",
          "Onde mora?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Em 'Good morning, I am Lucas', qual é o nome?",
        "opts": [
          "Lucas",
          "Carro",
          "Casa",
          "John"
        ],
        "ans": 0,
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
        "q": "Ordem correta: 'name / is / my / Lucas'",
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
          "Bom dia, eu sou Lucas",
          "Meu nome não é",
          "Onde você mora?"
        ],
        "ans": 1,
        "type": "translation"
      }
    ]
  },
  {
    "id": 160,
    "module": 3,
    "moduleName": "Comunicação",
    "level": "B1",
    "title": "Inglês para emails",
    "desc": "Aprenda inglês para emails - tradução correta",
    "time": "13 MIN",
    "phrase": "Nice to meet you, David",
    "translation": "Prazer em conhecer você, David",
    "vocab": [
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon!",
        "Tarde"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening!",
        "Chegada noite"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning!",
        "Até meio-dia"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me!",
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
        "Good night!",
        "Despedida noite"
      ],
      [
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Inglês para emails</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is David = Meu nome é David<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Inglês para emails</h5><p><b>Frase chave:</b> Nice to meet you, David = Prazer em conhecer você, David</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Nice to meet you, David'",
        "opts": [
          "Até logo",
          "Bom dia",
          "Prazer em conhecer você, David",
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
        "q": "Complete: 'Hello, my ___ is David'",
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
        "q": "Quando usar 'Nice to meet you, David'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Qual é seu nome?",
          "Quantos anos?",
          "Como vai?",
          "Onde mora?"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Em 'Nice to meet you, David', qual é o nome?",
        "opts": [
          "John",
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
          "be",
          "am"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Ordem correta: 'name / is / my / David'",
        "opts": [
          "Is my name David",
          "David is my name",
          "My name is David",
          "My David is name"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, David'",
        "opts": [
          "Boa noite",
          "Bom dia",
          "Prazer em conhecer você, David",
          "Até logo"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is David' significa:",
        "opts": [
          "Onde você mora?",
          "Prazer em conhecer você, David",
          "Qual seu nome?",
          "Meu nome não é"
        ],
        "ans": 1,
        "type": "translation"
      }
    ]
  },
  {
    "id": 161,
    "module": 4,
    "moduleName": "Trabalho e Vida",
    "level": "B1",
    "title": "Olá e apresentações",
    "desc": "Aprenda olá e apresentações - tradução correta",
    "time": "6 MIN",
    "phrase": "Hello, my name is Carlos",
    "translation": "Olá, meu nome é Carlos",
    "vocab": [
      [
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
      ],
      [
        "Hi",
        "Oi",
        "Hi, nice to see you!",
        "Informal"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night!",
        "Despedida noite"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me!",
        "Chamar atenção"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you!",
        "Agradecimento"
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
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Olá e apresentações</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Carlos = Meu nome é Carlos<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Olá e apresentações</h5><p><b>Frase chave:</b> Hello, my name is Carlos = Olá, meu nome é Carlos</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Hello, my name is Carlos'",
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
          "Quantos anos",
          "Onde mora",
          "Meu nome é",
          "Como vai"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Carlos'",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Como vai?",
          "Onde mora?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Em 'Hello, my name is Carlos', qual é o nome?",
        "opts": [
          "Carlos",
          "John",
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
          "are",
          "be",
          "am"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Ordem correta: 'name / is / my / Carlos'",
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
          "Qual seu nome?",
          "Onde você mora?",
          "Meu nome não é",
          "Olá, meu nome é Carlos"
        ],
        "ans": 3,
        "type": "translation"
      }
    ]
  },
  {
    "id": 162,
    "module": 4,
    "moduleName": "Trabalho e Vida",
    "level": "B1",
    "title": "Dizendo seu nome",
    "desc": "Aprenda dizendo seu nome - tradução correta",
    "time": "7 MIN",
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
        "Good night",
        "Boa noite",
        "Good night!",
        "Despedida noite"
      ],
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
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
        "Thank you!",
        "Agradecimento"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening!",
        "Chegada noite"
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
        "Excuse me!",
        "Chamar atenção"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Dizendo seu nome</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Maria = Meu nome é Maria<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Dizendo seu nome</h5><p><b>Frase chave:</b> Hello, my name is Maria = Olá, meu nome é Maria</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Hello, my name is Maria'",
        "opts": [
          "Até logo",
          "Olá, meu nome é Maria",
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
          "Onde mora",
          "Quantos anos",
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
          "big",
          "bad"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Maria'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Goodbye",
          "I am fine",
          "My name is Maria",
          "Thank you"
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
        "q": "Em 'Hello, my name is Maria', qual é o nome?",
        "opts": [
          "Maria",
          "Casa",
          "John",
          "Carro"
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
        "q": "Ordem correta: 'name / is / my / Maria'",
        "opts": [
          "Is my name Maria",
          "My name is Maria",
          "Maria is my name",
          "My Maria is name"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Maria'",
        "opts": [
          "Até logo",
          "Boa noite",
          "Bom dia",
          "Prazer em conhecer você, Maria"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Maria' significa:",
        "opts": [
          "Onde você mora?",
          "Olá, meu nome é Maria",
          "Meu nome não é",
          "Qual seu nome?"
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
    "title": "De onde você é",
    "desc": "Aprenda de onde você é - tradução correta",
    "time": "8 MIN",
    "phrase": "Nice to meet you, Pedro",
    "translation": "Prazer em conhecer você, Pedro",
    "vocab": [
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning!",
        "Até meio-dia"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night!",
        "Despedida noite"
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
        "Thank you!",
        "Agradecimento"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening!",
        "Chegada noite"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon!",
        "Tarde"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: De onde você é</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Pedro = Meu nome é Pedro<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: De onde você é</h5><p><b>Frase chave:</b> Nice to meet you, Pedro = Prazer em conhecer você, Pedro</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Nice to meet you, Pedro'",
        "opts": [
          "Prazer em conhecer você, Pedro",
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
          "Quantos anos",
          "Onde mora",
          "Como vai"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Pedro'",
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
        "q": "Quando usar 'Nice to meet you, Pedro'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "I am fine",
          "My name is Pedro",
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
          "Como vai?",
          "Quantos anos?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Em 'Nice to meet you, Pedro', qual é o nome?",
        "opts": [
          "Casa",
          "Carro",
          "John",
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
        "q": "Ordem correta: 'name / is / my / Pedro'",
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
          "Boa noite",
          "Até logo",
          "Prazer em conhecer você, Pedro",
          "Bom dia"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Pedro' significa:",
        "opts": [
          "Prazer em conhecer você, Pedro",
          "Onde você mora?",
          "Qual seu nome?",
          "Meu nome não é"
        ],
        "ans": 0,
        "type": "translation"
      }
    ]
  },
  {
    "id": 164,
    "module": 4,
    "moduleName": "Trabalho e Vida",
    "level": "B1",
    "title": "Perguntando o nome",
    "desc": "Aprenda perguntando o nome - tradução correta",
    "time": "9 MIN",
    "phrase": "Hello, my name is Miguel",
    "translation": "Olá, meu nome é Miguel",
    "vocab": [
      [
        "Thank you",
        "Obrigado",
        "Thank you!",
        "Agradecimento"
      ],
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
      ],
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
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
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night!",
        "Despedida noite"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon!",
        "Tarde"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Perguntando o nome</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Miguel = Meu nome é Miguel<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Perguntando o nome</h5><p><b>Frase chave:</b> Hello, my name is Miguel = Olá, meu nome é Miguel</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Hello, my name is Miguel'",
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
          "Meu nome é",
          "Onde mora",
          "Quantos anos"
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
          "Ao dormir",
          "Ao se apresentar",
          "Ao dirigir",
          "Ao comer"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Qual palavra significa 'Olá'?",
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
          "Como vai?",
          "Quantos anos?",
          "Qual é seu nome?",
          "Onde mora?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Em 'Hello, my name is Miguel', qual é o nome?",
        "opts": [
          "Miguel",
          "Casa",
          "John",
          "Carro"
        ],
        "ans": 0,
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
        "q": "Ordem correta: 'name / is / my / Miguel'",
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
          "Meu nome não é",
          "Onde você mora?",
          "Qual seu nome?",
          "Olá, meu nome é Miguel"
        ],
        "ans": 3,
        "type": "translation"
      }
    ]
  },
  {
    "id": 165,
    "module": 4,
    "moduleName": "Trabalho e Vida",
    "level": "B1",
    "title": "Idade e aniversário",
    "desc": "Aprenda idade e aniversário - tradução correta",
    "time": "10 MIN",
    "phrase": "My name is Sofia",
    "translation": "Meu nome é Sofia",
    "vocab": [
      [
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
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
        "Thank you!",
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
        "Good afternoon!",
        "Tarde"
      ],
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
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
        "Good night!",
        "Despedida noite"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning!",
        "Até meio-dia"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening!",
        "Chegada noite"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Idade e aniversário</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Sofia = Meu nome é Sofia<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Idade e aniversário</h5><p><b>Frase chave:</b> My name is Sofia = Meu nome é Sofia</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'My name is Sofia'",
        "opts": [
          "Meu nome é Sofia",
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
          "big",
          "bad",
          "name"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Quando usar 'My name is Sofia'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "My name is Sofia",
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
        "q": "Em 'My name is Sofia', qual é o nome?",
        "opts": [
          "John",
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
          "is",
          "be",
          "am",
          "are"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Ordem correta: 'name / is / my / Sofia'",
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
          "Bom dia",
          "Prazer em conhecer você, Sofia",
          "Até logo",
          "Boa noite"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Sofia' significa:",
        "opts": [
          "Onde você mora?",
          "Qual seu nome?",
          "Meu nome é Sofia",
          "Meu nome não é"
        ],
        "ans": 2,
        "type": "translation"
      }
    ]
  },
  {
    "id": 166,
    "module": 4,
    "moduleName": "Trabalho e Vida",
    "level": "B1",
    "title": "Família básica",
    "desc": "Aprenda família básica - tradução correta",
    "time": "11 MIN",
    "phrase": "I am Julia",
    "translation": "Eu sou Julia",
    "vocab": [
      [
        "Thank you",
        "Obrigado",
        "Thank you!",
        "Agradecimento"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon!",
        "Tarde"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you!",
        "Conhecer alguém"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night!",
        "Despedida noite"
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
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Família básica</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Julia = Meu nome é Julia<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Família básica</h5><p><b>Frase chave:</b> I am Julia = Eu sou Julia</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'I am Julia'",
        "opts": [
          "Eu sou Julia",
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
        "q": "Quando usar 'I am Julia'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "My name is Julia",
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
          "Qual é seu nome?",
          "Onde mora?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Em 'I am Julia', qual é o nome?",
        "opts": [
          "John",
          "Carro",
          "Julia",
          "Casa"
        ],
        "ans": 2,
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
        "q": "Ordem correta: 'name / is / my / Julia'",
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
          "Boa noite",
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
          "Onde você mora?",
          "Eu sou Julia",
          "Meu nome não é"
        ],
        "ans": 2,
        "type": "translation"
      }
    ]
  },
  {
    "id": 167,
    "module": 4,
    "moduleName": "Trabalho e Vida",
    "level": "B1",
    "title": "Cumprimentos formais",
    "desc": "Aprenda cumprimentos formais - tradução correta",
    "time": "12 MIN",
    "phrase": "Good morning, I am Sofia",
    "translation": "Bom dia, eu sou Sofia",
    "vocab": [
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon!",
        "Tarde"
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
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning!",
        "Até meio-dia"
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
        "Good night!",
        "Despedida noite"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you!",
        "Agradecimento"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Hi",
        "Oi",
        "Hi, nice to see you!",
        "Informal"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Cumprimentos formais</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Sofia = Meu nome é Sofia<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Cumprimentos formais</h5><p><b>Frase chave:</b> Good morning, I am Sofia = Bom dia, eu sou Sofia</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Good morning, I am Sofia'",
        "opts": [
          "Até logo",
          "Bom dia, eu sou Sofia",
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
          "Meu nome é",
          "Como vai",
          "Onde mora"
        ],
        "ans": 1,
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
        "q": "Quando usar 'Good morning, I am Sofia'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "My name is Sofia",
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
        "q": "Em 'Good morning, I am Sofia', qual é o nome?",
        "opts": [
          "Sofia",
          "Casa",
          "John",
          "Carro"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Sofia'",
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
        "q": "Ordem correta: 'name / is / my / Sofia'",
        "opts": [
          "My name is Sofia",
          "Sofia is my name",
          "Is my name Sofia",
          "My Sofia is name"
        ],
        "ans": 0,
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
          "Onde você mora?",
          "Bom dia, eu sou Sofia",
          "Meu nome não é",
          "Qual seu nome?"
        ],
        "ans": 1,
        "type": "translation"
      }
    ]
  },
  {
    "id": 168,
    "module": 4,
    "moduleName": "Trabalho e Vida",
    "level": "B1",
    "title": "Despedidas",
    "desc": "Aprenda despedidas - tradução correta",
    "time": "13 MIN",
    "phrase": "Good morning, I am Sarah",
    "translation": "Bom dia, eu sou Sarah",
    "vocab": [
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
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning!",
        "Até meio-dia"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening!",
        "Chegada noite"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you!",
        "Conhecer alguém"
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
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Despedidas</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Sarah = Meu nome é Sarah<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Despedidas</h5><p><b>Frase chave:</b> Good morning, I am Sarah = Bom dia, eu sou Sarah</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Good morning, I am Sarah'",
        "opts": [
          "Boa noite",
          "Até logo",
          "Bom dia, eu sou Sarah",
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
          "good",
          "name",
          "bad"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Good morning, I am Sarah'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Onde mora?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Em 'Good morning, I am Sarah', qual é o nome?",
        "opts": [
          "John",
          "Carro",
          "Casa",
          "Sarah"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Sarah'",
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
        "q": "Ordem correta: 'name / is / my / Sarah'",
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
          "Onde você mora?",
          "Bom dia, eu sou Sarah",
          "Meu nome não é",
          "Qual seu nome?"
        ],
        "ans": 1,
        "type": "translation"
      }
    ]
  },
  {
    "id": 169,
    "module": 4,
    "moduleName": "Trabalho e Vida",
    "level": "B1",
    "title": "Como você está",
    "desc": "Aprenda como você está - tradução correta",
    "time": "6 MIN",
    "phrase": "Nice to meet you, Miguel",
    "translation": "Prazer em conhecer você, Miguel",
    "vocab": [
      [
        "Excuse me",
        "Com licença",
        "Excuse me!",
        "Chamar atenção"
      ],
      [
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
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
        "Good morning!",
        "Até meio-dia"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
      ],
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you!",
        "Agradecimento"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Como você está</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Miguel = Meu nome é Miguel<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Como você está</h5><p><b>Frase chave:</b> Nice to meet you, Miguel = Prazer em conhecer você, Miguel</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Nice to meet you, Miguel'",
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
          "bad",
          "good",
          "big",
          "name"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Nice to meet you, Miguel'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Goodbye",
          "My name is Miguel",
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
          "Como vai?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Em 'Nice to meet you, Miguel', qual é o nome?",
        "opts": [
          "Miguel",
          "John",
          "Carro",
          "Casa"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Miguel'",
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
        "q": "Ordem correta: 'name / is / my / Miguel'",
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
          "Meu nome não é",
          "Prazer em conhecer você, Miguel",
          "Onde você mora?",
          "Qual seu nome?"
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
    "title": "Números e telefone",
    "desc": "Aprenda números e telefone - tradução correta",
    "time": "7 MIN",
    "phrase": "Nice to meet you, Ana",
    "translation": "Prazer em conhecer você, Ana",
    "vocab": [
      [
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning!",
        "Até meio-dia"
      ],
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you!",
        "Agradecimento"
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
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
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
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Números e telefone</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Ana = Meu nome é Ana<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Números e telefone</h5><p><b>Frase chave:</b> Nice to meet you, Ana = Prazer em conhecer você, Ana</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Nice to meet you, Ana'",
        "opts": [
          "Bom dia",
          "Prazer em conhecer você, Ana",
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
          "Quantos anos",
          "Como vai",
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
          "bad",
          "name"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Nice to meet you, Ana'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Onde mora?",
          "Quantos anos?",
          "Qual é seu nome?",
          "Como vai?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Em 'Nice to meet you, Ana', qual é o nome?",
        "opts": [
          "John",
          "Casa",
          "Ana",
          "Carro"
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
        "q": "Ordem correta: 'name / is / my / Ana'",
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
          "Bom dia",
          "Boa noite",
          "Prazer em conhecer você, Ana",
          "Até logo"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Ana' significa:",
        "opts": [
          "Qual seu nome?",
          "Prazer em conhecer você, Ana",
          "Onde você mora?",
          "Meu nome não é"
        ],
        "ans": 1,
        "type": "translation"
      }
    ]
  },
  {
    "id": 171,
    "module": 4,
    "moduleName": "Trabalho e Vida",
    "level": "B1",
    "title": "Endereço e cidade",
    "desc": "Aprenda endereço e cidade - tradução correta",
    "time": "8 MIN",
    "phrase": "Hello, my name is David",
    "translation": "Olá, meu nome é David",
    "vocab": [
      [
        "Good morning",
        "Bom dia",
        "Good morning!",
        "Até meio-dia"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
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
        "Thank you",
        "Obrigado",
        "Thank you!",
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
        "Nice to meet you!",
        "Conhecer alguém"
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
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Endereço e cidade</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is David = Meu nome é David<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Endereço e cidade</h5><p><b>Frase chave:</b> Hello, my name is David = Olá, meu nome é David</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Hello, my name is David'",
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
          "name",
          "good",
          "bad",
          "big"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is David'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "My name is David"
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
        "q": "Em 'Hello, my name is David', qual é o nome?",
        "opts": [
          "John",
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
          "are",
          "be",
          "is",
          "am"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Ordem correta: 'name / is / my / David'",
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
          "Até logo",
          "Bom dia",
          "Prazer em conhecer você, David",
          "Boa noite"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is David' significa:",
        "opts": [
          "Qual seu nome?",
          "Onde você mora?",
          "Meu nome não é",
          "Olá, meu nome é David"
        ],
        "ans": 3,
        "type": "translation"
      }
    ]
  },
  {
    "id": 172,
    "module": 4,
    "moduleName": "Trabalho e Vida",
    "level": "B1",
    "title": "Profissão simples",
    "desc": "Aprenda profissão simples - tradução correta",
    "time": "9 MIN",
    "phrase": "Nice to meet you, Maria",
    "translation": "Prazer em conhecer você, Maria",
    "vocab": [
      [
        "Thank you",
        "Obrigado",
        "Thank you!",
        "Agradecimento"
      ],
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me!",
        "Chamar atenção"
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
        "Good morning",
        "Bom dia",
        "Good morning!",
        "Até meio-dia"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you!",
        "Conhecer alguém"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening!",
        "Chegada noite"
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
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Profissão simples</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Maria = Meu nome é Maria<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Profissão simples</h5><p><b>Frase chave:</b> Nice to meet you, Maria = Prazer em conhecer você, Maria</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Nice to meet you, Maria'",
        "opts": [
          "Prazer em conhecer você, Maria",
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
          "name",
          "good",
          "bad"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Nice to meet you, Maria'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Goodbye",
          "My name is Maria",
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
        "q": "Em 'Nice to meet you, Maria', qual é o nome?",
        "opts": [
          "Casa",
          "Maria",
          "John",
          "Carro"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Maria'",
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
        "q": "Ordem correta: 'name / is / my / Maria'",
        "opts": [
          "Is my name Maria",
          "My Maria is name",
          "Maria is my name",
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
          "Prazer em conhecer você, Maria",
          "Onde você mora?"
        ],
        "ans": 2,
        "type": "translation"
      }
    ]
  },
  {
    "id": 173,
    "module": 4,
    "moduleName": "Trabalho e Vida",
    "level": "B1",
    "title": "Hobbies favoritos",
    "desc": "Aprenda hobbies favoritos - tradução correta",
    "time": "10 MIN",
    "phrase": "Hello, my name is Sofia",
    "translation": "Olá, meu nome é Sofia",
    "vocab": [
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
      ],
      [
        "Hi",
        "Oi",
        "Hi, nice to see you!",
        "Informal"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me!",
        "Chamar atenção"
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
        "Good morning",
        "Bom dia",
        "Good morning!",
        "Até meio-dia"
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
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Hobbies favoritos</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Sofia = Meu nome é Sofia<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Hobbies favoritos</h5><p><b>Frase chave:</b> Hello, my name is Sofia = Olá, meu nome é Sofia</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Hello, my name is Sofia'",
        "opts": [
          "Bom dia",
          "Olá, meu nome é Sofia",
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
          "good",
          "name",
          "bad",
          "big"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Sofia'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "My name is Sofia",
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
          "Onde mora?",
          "Quantos anos?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Em 'Hello, my name is Sofia', qual é o nome?",
        "opts": [
          "Casa",
          "John",
          "Carro",
          "Sofia"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Sofia'",
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
        "q": "Ordem correta: 'name / is / my / Sofia'",
        "opts": [
          "My Sofia is name",
          "Is my name Sofia",
          "Sofia is my name",
          "My name is Sofia"
        ],
        "ans": 3,
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
          "Qual seu nome?",
          "Olá, meu nome é Sofia",
          "Meu nome não é",
          "Onde você mora?"
        ],
        "ans": 1,
        "type": "translation"
      }
    ]
  },
  {
    "id": 174,
    "module": 4,
    "moduleName": "Trabalho e Vida",
    "level": "B1",
    "title": "Comida favorita",
    "desc": "Aprenda comida favorita - tradução correta",
    "time": "11 MIN",
    "phrase": "Hello, my name is Ana",
    "translation": "Olá, meu nome é Ana",
    "vocab": [
      [
        "Good morning",
        "Bom dia",
        "Good morning!",
        "Até meio-dia"
      ],
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ],
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
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
        "Excuse me!",
        "Chamar atenção"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Comida favorita</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Ana = Meu nome é Ana<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Comida favorita</h5><p><b>Frase chave:</b> Hello, my name is Ana = Olá, meu nome é Ana</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Hello, my name is Ana'",
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
          "Ao dormir",
          "Ao comer",
          "Ao dirigir"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Qual palavra significa 'Olá'?",
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
          "Quantos anos?",
          "Qual é seu nome?",
          "Onde mora?",
          "Como vai?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Em 'Hello, my name is Ana', qual é o nome?",
        "opts": [
          "Carro",
          "Casa",
          "Ana",
          "John"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Ana'",
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
        "q": "Ordem correta: 'name / is / my / Ana'",
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
          "Olá, meu nome é Ana",
          "Qual seu nome?",
          "Onde você mora?",
          "Meu nome não é"
        ],
        "ans": 0,
        "type": "translation"
      }
    ]
  },
  {
    "id": 175,
    "module": 4,
    "moduleName": "Trabalho e Vida",
    "level": "B1",
    "title": "Cores favoritas",
    "desc": "Aprenda cores favoritas - tradução correta",
    "time": "12 MIN",
    "phrase": "My name is Ana",
    "translation": "Meu nome é Ana",
    "vocab": [
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon!",
        "Tarde"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night!",
        "Despedida noite"
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
        "Good evening!",
        "Chegada noite"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Hi",
        "Oi",
        "Hi, nice to see you!",
        "Informal"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Cores favoritas</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Ana = Meu nome é Ana<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Cores favoritas</h5><p><b>Frase chave:</b> My name is Ana = Meu nome é Ana</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'My name is Ana'",
        "opts": [
          "Bom dia",
          "Boa noite",
          "Até logo",
          "Meu nome é Ana"
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
        "q": "Complete: 'Hello, my ___ is Ana'",
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
        "q": "Quando usar 'My name is Ana'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
        "q": "Em 'My name is Ana', qual é o nome?",
        "opts": [
          "Casa",
          "Carro",
          "Ana",
          "John"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Ana'",
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
        "q": "Ordem correta: 'name / is / my / Ana'",
        "opts": [
          "Is my name Ana",
          "Ana is my name",
          "My Ana is name",
          "My name is Ana"
        ],
        "ans": 3,
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
          "Qual seu nome?",
          "Meu nome não é",
          "Onde você mora?",
          "Meu nome é Ana"
        ],
        "ans": 3,
        "type": "translation"
      }
    ]
  },
  {
    "id": 176,
    "module": 4,
    "moduleName": "Trabalho e Vida",
    "level": "B1",
    "title": "Tempo e clima",
    "desc": "Aprenda tempo e clima - tradução correta",
    "time": "13 MIN",
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
        "Good morning",
        "Bom dia",
        "Good morning!",
        "Até meio-dia"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon!",
        "Tarde"
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
        "Excuse me",
        "Com licença",
        "Excuse me!",
        "Chamar atenção"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Hi",
        "Oi",
        "Hi, nice to see you!",
        "Informal"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Tempo e clima</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Sarah = Meu nome é Sarah<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Tempo e clima</h5><p><b>Frase chave:</b> Hello, my name is Sarah = Olá, meu nome é Sarah</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Hello, my name is Sarah'",
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
          "Ao se apresentar",
          "Ao dirigir",
          "Ao dormir"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Qual palavra significa 'Olá'?",
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
          "My name is Sarah",
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
          "Quantos anos?",
          "Qual é seu nome?",
          "Onde mora?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Em 'Hello, my name is Sarah', qual é o nome?",
        "opts": [
          "John",
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
          "are",
          "is",
          "be",
          "am"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Ordem correta: 'name / is / my / Sarah'",
        "opts": [
          "Is my name Sarah",
          "My Sarah is name",
          "Sarah is my name",
          "My name is Sarah"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Sarah'",
        "opts": [
          "Prazer em conhecer você, Sarah",
          "Boa noite",
          "Bom dia",
          "Até logo"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Sarah' significa:",
        "opts": [
          "Olá, meu nome é Sarah",
          "Meu nome não é",
          "Onde você mora?",
          "Qual seu nome?"
        ],
        "ans": 0,
        "type": "translation"
      }
    ]
  },
  {
    "id": 177,
    "module": 4,
    "moduleName": "Trabalho e Vida",
    "level": "B1",
    "title": "Dias da semana",
    "desc": "Aprenda dias da semana - tradução correta",
    "time": "6 MIN",
    "phrase": "Hello, my name is Sarah",
    "translation": "Olá, meu nome é Sarah",
    "vocab": [
      [
        "Thank you",
        "Obrigado",
        "Thank you!",
        "Agradecimento"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you!",
        "Conhecer alguém"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon!",
        "Tarde"
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
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ],
      [
        "Hi",
        "Oi",
        "Hi, nice to see you!",
        "Informal"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me!",
        "Chamar atenção"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night!",
        "Despedida noite"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Dias da semana</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Sarah = Meu nome é Sarah<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Dias da semana</h5><p><b>Frase chave:</b> Hello, my name is Sarah = Olá, meu nome é Sarah</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Hello, my name is Sarah'",
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
          "Meu nome é",
          "Onde mora",
          "Como vai",
          "Quantos anos"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Sarah'",
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
        "q": "Quando usar 'Hello, my name is Sarah'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Onde mora?",
          "Qual é seu nome?",
          "Quantos anos?",
          "Como vai?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Em 'Hello, my name is Sarah', qual é o nome?",
        "opts": [
          "Sarah",
          "Carro",
          "John",
          "Casa"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Sarah'",
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
        "q": "Ordem correta: 'name / is / my / Sarah'",
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
          "Prazer em conhecer você, Sarah",
          "Bom dia",
          "Boa noite",
          "Até logo"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Sarah' significa:",
        "opts": [
          "Onde você mora?",
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
    "id": 178,
    "module": 4,
    "moduleName": "Trabalho e Vida",
    "level": "B1",
    "title": "Horas e compromissos",
    "desc": "Aprenda horas e compromissos - tradução correta",
    "time": "7 MIN",
    "phrase": "My name is Emma",
    "translation": "Meu nome é Emma",
    "vocab": [
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon!",
        "Tarde"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning!",
        "Até meio-dia"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night!",
        "Despedida noite"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you!",
        "Conhecer alguém"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Horas e compromissos</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Emma = Meu nome é Emma<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Horas e compromissos</h5><p><b>Frase chave:</b> My name is Emma = Meu nome é Emma</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'My name is Emma'",
        "opts": [
          "Até logo",
          "Bom dia",
          "Boa noite",
          "Meu nome é Emma"
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
        "q": "Quando usar 'My name is Emma'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Thank you",
          "My name is Emma"
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
        "q": "Em 'My name is Emma', qual é o nome?",
        "opts": [
          "Casa",
          "Emma",
          "Carro",
          "John"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Emma'",
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
        "q": "Ordem correta: 'name / is / my / Emma'",
        "opts": [
          "Emma is my name",
          "My name is Emma",
          "Is my name Emma",
          "My Emma is name"
        ],
        "ans": 1,
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
          "Meu nome é Emma",
          "Onde você mora?",
          "Meu nome não é"
        ],
        "ans": 1,
        "type": "translation"
      }
    ]
  },
  {
    "id": 179,
    "module": 4,
    "moduleName": "Trabalho e Vida",
    "level": "B1",
    "title": "Família estendida",
    "desc": "Aprenda família estendida - tradução correta",
    "time": "8 MIN",
    "phrase": "Hello, I am David",
    "translation": "Olá, eu sou David",
    "vocab": [
      [
        "Thank you",
        "Obrigado",
        "Thank you!",
        "Agradecimento"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me!",
        "Chamar atenção"
      ],
      [
        "Hi",
        "Oi",
        "Hi, nice to see you!",
        "Informal"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night!",
        "Despedida noite"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning!",
        "Até meio-dia"
      ],
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you!",
        "Conhecer alguém"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
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
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Família estendida</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is David = Meu nome é David<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Família estendida</h5><p><b>Frase chave:</b> Hello, I am David = Olá, eu sou David</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Hello, I am David'",
        "opts": [
          "Boa noite",
          "Até logo",
          "Olá, eu sou David",
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
        "q": "Quando usar 'Hello, I am David'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Qual é seu nome?",
          "Quantos anos?",
          "Onde mora?",
          "Como vai?"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Em 'Hello, I am David', qual é o nome?",
        "opts": [
          "John",
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
        "q": "Ordem correta: 'name / is / my / David'",
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
          "Qual seu nome?",
          "Meu nome não é",
          "Onde você mora?",
          "Olá, eu sou David"
        ],
        "ans": 3,
        "type": "translation"
      }
    ]
  },
  {
    "id": 180,
    "module": 4,
    "moduleName": "Trabalho e Vida",
    "level": "B1",
    "title": "Casa e moradia",
    "desc": "Aprenda casa e moradia - tradução correta",
    "time": "9 MIN",
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
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
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
        "Good evening",
        "Boa noite",
        "Good evening!",
        "Chegada noite"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon!",
        "Tarde"
      ],
      [
        "Hi",
        "Oi",
        "Hi, nice to see you!",
        "Informal"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me!",
        "Chamar atenção"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Casa e moradia</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Sarah = Meu nome é Sarah<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Casa e moradia</h5><p><b>Frase chave:</b> Hello, my name is Sarah = Olá, meu nome é Sarah</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Hello, my name is Sarah'",
        "opts": [
          "Boa noite",
          "Bom dia",
          "Olá, meu nome é Sarah",
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
        "q": "Complete: 'Hello, my ___ is Sarah'",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "I am fine",
          "My name is Sarah"
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
        "q": "Em 'Hello, my name is Sarah', qual é o nome?",
        "opts": [
          "Carro",
          "Sarah",
          "Casa",
          "John"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Sarah'",
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
        "q": "Ordem correta: 'name / is / my / Sarah'",
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
          "Até logo",
          "Prazer em conhecer você, Sarah",
          "Bom dia",
          "Boa noite"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Sarah' significa:",
        "opts": [
          "Onde você mora?",
          "Meu nome não é",
          "Olá, meu nome é Sarah",
          "Qual seu nome?"
        ],
        "ans": 2,
        "type": "translation"
      }
    ]
  },
  {
    "id": 181,
    "module": 5,
    "moduleName": "Inglês Profissional",
    "level": "B2",
    "title": "Rotina matinal",
    "desc": "Aprenda rotina matinal - tradução correta",
    "time": "10 MIN",
    "phrase": "I am Ana",
    "translation": "Eu sou Ana",
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
        "Thank you!",
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
        "Good evening!",
        "Chegada noite"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
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
        "Good night!",
        "Despedida noite"
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
        "Good morning!",
        "Até meio-dia"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Rotina matinal</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Ana = Meu nome é Ana<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Rotina matinal</h5><p><b>Frase chave:</b> I am Ana = Eu sou Ana</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'I am Ana'",
        "opts": [
          "Eu sou Ana",
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
          "Como vai",
          "Quantos anos",
          "Meu nome é"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Ana'",
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
        "q": "Quando usar 'I am Ana'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Quantos anos?",
          "Onde mora?",
          "Como vai?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Em 'I am Ana', qual é o nome?",
        "opts": [
          "John",
          "Casa",
          "Ana",
          "Carro"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Ana'",
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
        "q": "Ordem correta: 'name / is / my / Ana'",
        "opts": [
          "My name is Ana",
          "Is my name Ana",
          "My Ana is name",
          "Ana is my name"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Ana'",
        "opts": [
          "Prazer em conhecer você, Ana",
          "Boa noite",
          "Bom dia",
          "Até logo"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Ana' significa:",
        "opts": [
          "Qual seu nome?",
          "Meu nome não é",
          "Eu sou Ana",
          "Onde você mora?"
        ],
        "ans": 2,
        "type": "translation"
      }
    ]
  },
  {
    "id": 182,
    "module": 5,
    "moduleName": "Inglês Profissional",
    "level": "B2",
    "title": "Rotina noturna",
    "desc": "Aprenda rotina noturna - tradução correta",
    "time": "11 MIN",
    "phrase": "Nice to meet you, Carlos",
    "translation": "Prazer em conhecer você, Carlos",
    "vocab": [
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
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
        "Good evening!",
        "Chegada noite"
      ],
      [
        "Hi",
        "Oi",
        "Hi, nice to see you!",
        "Informal"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you!",
        "Agradecimento"
      ],
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Rotina noturna</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Carlos = Meu nome é Carlos<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Rotina noturna</h5><p><b>Frase chave:</b> Nice to meet you, Carlos = Prazer em conhecer você, Carlos</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Nice to meet you, Carlos'",
        "opts": [
          "Bom dia",
          "Prazer em conhecer você, Carlos",
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
          "name",
          "bad"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Nice to meet you, Carlos'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Qual é seu nome?",
          "Como vai?",
          "Quantos anos?",
          "Onde mora?"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Em 'Nice to meet you, Carlos', qual é o nome?",
        "opts": [
          "Carro",
          "Casa",
          "John",
          "Carlos"
        ],
        "ans": 3,
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
        "q": "Ordem correta: 'name / is / my / Carlos'",
        "opts": [
          "Is my name Carlos",
          "My name is Carlos",
          "Carlos is my name",
          "My Carlos is name"
        ],
        "ans": 1,
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
          "Qual seu nome?",
          "Prazer em conhecer você, Carlos",
          "Meu nome não é",
          "Onde você mora?"
        ],
        "ans": 1,
        "type": "translation"
      }
    ]
  },
  {
    "id": 183,
    "module": 5,
    "moduleName": "Inglês Profissional",
    "level": "B2",
    "title": "Fim de semana",
    "desc": "Aprenda fim de semana - tradução correta",
    "time": "12 MIN",
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
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
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
        "Good evening!",
        "Chegada noite"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you!",
        "Conhecer alguém"
      ],
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
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
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Fim de semana</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Lucas = Meu nome é Lucas<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Fim de semana</h5><p><b>Frase chave:</b> Hello, my name is Lucas = Olá, meu nome é Lucas</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Hello, my name is Lucas'",
        "opts": [
          "Boa noite",
          "Olá, meu nome é Lucas",
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
          "Onde mora",
          "Quantos anos"
        ],
        "ans": 1,
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
        "q": "Qual palavra significa 'Olá'?",
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
        "q": "Em 'Hello, my name is Lucas', qual é o nome?",
        "opts": [
          "Casa",
          "Carro",
          "John",
          "Lucas"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Lucas'",
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
        "q": "Ordem correta: 'name / is / my / Lucas'",
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
          "Boa noite",
          "Prazer em conhecer você, Lucas",
          "Até logo",
          "Bom dia"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Lucas' significa:",
        "opts": [
          "Qual seu nome?",
          "Olá, meu nome é Lucas",
          "Onde você mora?",
          "Meu nome não é"
        ],
        "ans": 1,
        "type": "translation"
      }
    ]
  },
  {
    "id": 184,
    "module": 5,
    "moduleName": "Inglês Profissional",
    "level": "B2",
    "title": "Compras básicas",
    "desc": "Aprenda compras básicas - tradução correta",
    "time": "13 MIN",
    "phrase": "Nice to meet you, Carlos",
    "translation": "Prazer em conhecer você, Carlos",
    "vocab": [
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you!",
        "Conhecer alguém"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening!",
        "Chegada noite"
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
        "Excuse me!",
        "Chamar atenção"
      ],
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
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
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Compras básicas</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Carlos = Meu nome é Carlos<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Compras básicas</h5><p><b>Frase chave:</b> Nice to meet you, Carlos = Prazer em conhecer você, Carlos</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Nice to meet you, Carlos'",
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
          "bad",
          "name",
          "good",
          "big"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Nice to meet you, Carlos'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Qual é seu nome?",
          "Como vai?",
          "Quantos anos?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Em 'Nice to meet you, Carlos', qual é o nome?",
        "opts": [
          "Carlos",
          "John",
          "Casa",
          "Carro"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Carlos'",
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
        "q": "Ordem correta: 'name / is / my / Carlos'",
        "opts": [
          "Is my name Carlos",
          "My Carlos is name",
          "Carlos is my name",
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
          "Prazer em conhecer você, Carlos",
          "Meu nome não é",
          "Onde você mora?",
          "Qual seu nome?"
        ],
        "ans": 0,
        "type": "translation"
      }
    ]
  },
  {
    "id": 185,
    "module": 5,
    "moduleName": "Inglês Profissional",
    "level": "B2",
    "title": "Transporte",
    "desc": "Aprenda transporte - tradução correta",
    "time": "6 MIN",
    "phrase": "Good morning, I am John",
    "translation": "Bom dia, eu sou John",
    "vocab": [
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night!",
        "Despedida noite"
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
        "Good afternoon!",
        "Tarde"
      ],
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
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
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you!",
        "Conhecer alguém"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Transporte</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is John = Meu nome é John<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Transporte</h5><p><b>Frase chave:</b> Good morning, I am John = Bom dia, eu sou John</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Good morning, I am John'",
        "opts": [
          "Bom dia, eu sou John",
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
          "Como vai",
          "Meu nome é"
        ],
        "ans": 3,
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
        "q": "Quando usar 'Good morning, I am John'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "My name is John",
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
          "Onde mora?",
          "Qual é seu nome?",
          "Como vai?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Em 'Good morning, I am John', qual é o nome?",
        "opts": [
          "Mike",
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
          "is",
          "be",
          "am",
          "are"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Ordem correta: 'name / is / my / John'",
        "opts": [
          "John is my name",
          "My name is John",
          "Is my name John",
          "My John is name"
        ],
        "ans": 1,
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
          "Qual seu nome?",
          "Onde você mora?",
          "Bom dia, eu sou John"
        ],
        "ans": 3,
        "type": "translation"
      }
    ]
  },
  {
    "id": 186,
    "module": 5,
    "moduleName": "Inglês Profissional",
    "level": "B2",
    "title": "Comida e restaurante",
    "desc": "Aprenda comida e restaurante - tradução correta",
    "time": "7 MIN",
    "phrase": "Good morning, I am Emma",
    "translation": "Bom dia, eu sou Emma",
    "vocab": [
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
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening!",
        "Chegada noite"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon!",
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
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you!",
        "Conhecer alguém"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning!",
        "Até meio-dia"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Comida e restaurante</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Emma = Meu nome é Emma<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Comida e restaurante</h5><p><b>Frase chave:</b> Good morning, I am Emma = Bom dia, eu sou Emma</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Good morning, I am Emma'",
        "opts": [
          "Bom dia",
          "Bom dia, eu sou Emma",
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
          "Quantos anos",
          "Como vai",
          "Meu nome é"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Emma'",
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
        "q": "Quando usar 'Good morning, I am Emma'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Quantos anos?",
          "Onde mora?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Em 'Good morning, I am Emma', qual é o nome?",
        "opts": [
          "Emma",
          "John",
          "Carro",
          "Casa"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Emma'",
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
        "q": "Ordem correta: 'name / is / my / Emma'",
        "opts": [
          "My name is Emma",
          "Emma is my name",
          "My Emma is name",
          "Is my name Emma"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Emma'",
        "opts": [
          "Até logo",
          "Bom dia",
          "Prazer em conhecer você, Emma",
          "Boa noite"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Emma' significa:",
        "opts": [
          "Meu nome não é",
          "Bom dia, eu sou Emma",
          "Onde você mora?",
          "Qual seu nome?"
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
    "title": "Bebidas",
    "desc": "Aprenda bebidas - tradução correta",
    "time": "8 MIN",
    "phrase": "My name is John",
    "translation": "Meu nome é John",
    "vocab": [
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you!",
        "Conhecer alguém"
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
        "Good evening!",
        "Chegada noite"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Hi",
        "Oi",
        "Hi, nice to see you!",
        "Informal"
      ],
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
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
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night!",
        "Despedida noite"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Bebidas</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is John = Meu nome é John<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Bebidas</h5><p><b>Frase chave:</b> My name is John = Meu nome é John</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'My name is John'",
        "opts": [
          "Boa noite",
          "Bom dia",
          "Meu nome é John",
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
          "Como vai",
          "Meu nome é"
        ],
        "ans": 3,
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
        "q": "Quando usar 'My name is John'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Thank you",
          "I am fine",
          "My name is John"
        ],
        "ans": 3,
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
        "q": "Em 'My name is John', qual é o nome?",
        "opts": [
          "John",
          "Carro",
          "Casa",
          "Mike"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ John'",
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
        "q": "Ordem correta: 'name / is / my / John'",
        "opts": [
          "My name is John",
          "John is my name",
          "Is my name John",
          "My John is name"
        ],
        "ans": 0,
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
          "Meu nome é John",
          "Meu nome não é",
          "Onde você mora?",
          "Qual seu nome?"
        ],
        "ans": 0,
        "type": "translation"
      }
    ]
  },
  {
    "id": 188,
    "module": 5,
    "moduleName": "Inglês Profissional",
    "level": "B2",
    "title": "Pedindo ajuda",
    "desc": "Aprenda pedindo ajuda - tradução correta",
    "time": "9 MIN",
    "phrase": "I am John",
    "translation": "Eu sou John",
    "vocab": [
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you!",
        "Conhecer alguém"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening!",
        "Chegada noite"
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
        "Thank you",
        "Obrigado",
        "Thank you!",
        "Agradecimento"
      ],
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
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
        "Good morning!",
        "Até meio-dia"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me!",
        "Chamar atenção"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Pedindo ajuda</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is John = Meu nome é John<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Pedindo ajuda</h5><p><b>Frase chave:</b> I am John = Eu sou John</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'I am John'",
        "opts": [
          "Eu sou John",
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
          "good",
          "bad",
          "big"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Quando usar 'I am John'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Thank you",
          "My name is John",
          "I am fine"
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
        "q": "Em 'I am John', qual é o nome?",
        "opts": [
          "Casa",
          "Carro",
          "John",
          "Mike"
        ],
        "ans": 2,
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
        "q": "Ordem correta: 'name / is / my / John'",
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
          "Bom dia",
          "Boa noite",
          "Até logo"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is John' significa:",
        "opts": [
          "Meu nome não é",
          "Eu sou John",
          "Qual seu nome?",
          "Onde você mora?"
        ],
        "ans": 1,
        "type": "translation"
      }
    ]
  },
  {
    "id": 189,
    "module": 5,
    "moduleName": "Inglês Profissional",
    "level": "B2",
    "title": "Direções simples",
    "desc": "Aprenda direções simples - tradução correta",
    "time": "10 MIN",
    "phrase": "Nice to meet you, Pedro",
    "translation": "Prazer em conhecer você, Pedro",
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
        "Thank you!",
        "Agradecimento"
      ],
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
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
        "Good afternoon!",
        "Tarde"
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
        "Good evening",
        "Boa noite",
        "Good evening!",
        "Chegada noite"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night!",
        "Despedida noite"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Direções simples</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Pedro = Meu nome é Pedro<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Direções simples</h5><p><b>Frase chave:</b> Nice to meet you, Pedro = Prazer em conhecer você, Pedro</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Nice to meet you, Pedro'",
        "opts": [
          "Boa noite",
          "Bom dia",
          "Até logo",
          "Prazer em conhecer você, Pedro"
        ],
        "ans": 3,
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
          "good",
          "bad",
          "name",
          "big"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Nice to meet you, Pedro'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Goodbye",
          "My name is Pedro",
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
          "Qual é seu nome?",
          "Onde mora?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Em 'Nice to meet you, Pedro', qual é o nome?",
        "opts": [
          "Pedro",
          "Carro",
          "Casa",
          "John"
        ],
        "ans": 0,
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
        "q": "Ordem correta: 'name / is / my / Pedro'",
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
          "Boa noite",
          "Até logo",
          "Prazer em conhecer você, Pedro",
          "Bom dia"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Pedro' significa:",
        "opts": [
          "Prazer em conhecer você, Pedro",
          "Meu nome não é",
          "Onde você mora?",
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
    "title": "Preços e dinheiro",
    "desc": "Aprenda preços e dinheiro - tradução correta",
    "time": "11 MIN",
    "phrase": "Nice to meet you, Sarah",
    "translation": "Prazer em conhecer você, Sarah",
    "vocab": [
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
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
        "Good evening!",
        "Chegada noite"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you!",
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
        "Good afternoon!",
        "Tarde"
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
        "Good morning!",
        "Até meio-dia"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you!",
        "Agradecimento"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Preços e dinheiro</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Sarah = Meu nome é Sarah<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Preços e dinheiro</h5><p><b>Frase chave:</b> Nice to meet you, Sarah = Prazer em conhecer você, Sarah</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Nice to meet you, Sarah'",
        "opts": [
          "Boa noite",
          "Prazer em conhecer você, Sarah",
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
          "Como vai",
          "Meu nome é"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Sarah'",
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
        "q": "Quando usar 'Nice to meet you, Sarah'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Goodbye",
          "I am fine",
          "My name is Sarah"
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
        "q": "Em 'Nice to meet you, Sarah', qual é o nome?",
        "opts": [
          "Sarah",
          "John",
          "Carro",
          "Casa"
        ],
        "ans": 0,
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
        "q": "Ordem correta: 'name / is / my / Sarah'",
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
          "Qual seu nome?",
          "Meu nome não é",
          "Prazer em conhecer você, Sarah",
          "Onde você mora?"
        ],
        "ans": 2,
        "type": "translation"
      }
    ]
  },
  {
    "id": 191,
    "module": 5,
    "moduleName": "Inglês Profissional",
    "level": "B2",
    "title": "Roupas",
    "desc": "Aprenda roupas - tradução correta",
    "time": "12 MIN",
    "phrase": "Good morning, I am Miguel",
    "translation": "Bom dia, eu sou Miguel",
    "vocab": [
      [
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me!",
        "Chamar atenção"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you!",
        "Conhecer alguém"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening!",
        "Chegada noite"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night!",
        "Despedida noite"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning!",
        "Até meio-dia"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Roupas</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Miguel = Meu nome é Miguel<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Roupas</h5><p><b>Frase chave:</b> Good morning, I am Miguel = Bom dia, eu sou Miguel</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Good morning, I am Miguel'",
        "opts": [
          "Bom dia, eu sou Miguel",
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
          "name",
          "good",
          "big",
          "bad"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Good morning, I am Miguel'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Como vai?",
          "Quantos anos?",
          "Qual é seu nome?",
          "Onde mora?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Em 'Good morning, I am Miguel', qual é o nome?",
        "opts": [
          "Carro",
          "John",
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
          "is",
          "are",
          "be"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Ordem correta: 'name / is / my / Miguel'",
        "opts": [
          "Is my name Miguel",
          "My name is Miguel",
          "My Miguel is name",
          "Miguel is my name"
        ],
        "ans": 1,
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
          "Meu nome não é",
          "Qual seu nome?",
          "Onde você mora?",
          "Bom dia, eu sou Miguel"
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
    "title": "Saúde básica",
    "desc": "Aprenda saúde básica - tradução correta",
    "time": "13 MIN",
    "phrase": "Good morning, I am Emma",
    "translation": "Bom dia, eu sou Emma",
    "vocab": [
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
      ],
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
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
        "Good morning",
        "Bom dia",
        "Good morning!",
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
        "Excuse me",
        "Com licença",
        "Excuse me!",
        "Chamar atenção"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Saúde básica</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Emma = Meu nome é Emma<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Saúde básica</h5><p><b>Frase chave:</b> Good morning, I am Emma = Bom dia, eu sou Emma</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Good morning, I am Emma'",
        "opts": [
          "Boa noite",
          "Bom dia, eu sou Emma",
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
          "big",
          "name",
          "bad",
          "good"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Good morning, I am Emma'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "My name is Emma",
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
          "Qual é seu nome?",
          "Quantos anos?",
          "Como vai?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Em 'Good morning, I am Emma', qual é o nome?",
        "opts": [
          "Emma",
          "Carro",
          "Casa",
          "John"
        ],
        "ans": 0,
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
        "q": "Ordem correta: 'name / is / my / Emma'",
        "opts": [
          "My name is Emma",
          "My Emma is name",
          "Emma is my name",
          "Is my name Emma"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Emma'",
        "opts": [
          "Bom dia",
          "Prazer em conhecer você, Emma",
          "Boa noite",
          "Até logo"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Emma' significa:",
        "opts": [
          "Meu nome não é",
          "Bom dia, eu sou Emma",
          "Qual seu nome?",
          "Onde você mora?"
        ],
        "ans": 1,
        "type": "translation"
      }
    ]
  },
  {
    "id": 193,
    "module": 5,
    "moduleName": "Inglês Profissional",
    "level": "B2",
    "title": "Emoções",
    "desc": "Aprenda emoções - tradução correta",
    "time": "6 MIN",
    "phrase": "Hello, I am Pedro",
    "translation": "Olá, eu sou Pedro",
    "vocab": [
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon!",
        "Tarde"
      ],
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
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
        "Hi",
        "Oi",
        "Hi, nice to see you!",
        "Informal"
      ],
      [
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Emoções</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Pedro = Meu nome é Pedro<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Emoções</h5><p><b>Frase chave:</b> Hello, I am Pedro = Olá, eu sou Pedro</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Hello, I am Pedro'",
        "opts": [
          "Olá, eu sou Pedro",
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
        "q": "Complete: 'Hello, my ___ is Pedro'",
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
        "q": "Quando usar 'Hello, I am Pedro'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Como vai?",
          "Qual é seu nome?",
          "Quantos anos?",
          "Onde mora?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Em 'Hello, I am Pedro', qual é o nome?",
        "opts": [
          "Pedro",
          "Casa",
          "John",
          "Carro"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Pedro'",
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
        "q": "Ordem correta: 'name / is / my / Pedro'",
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
          "Onde você mora?",
          "Olá, eu sou Pedro",
          "Qual seu nome?",
          "Meu nome não é"
        ],
        "ans": 1,
        "type": "translation"
      }
    ]
  },
  {
    "id": 194,
    "module": 5,
    "moduleName": "Inglês Profissional",
    "level": "B2",
    "title": "Convites",
    "desc": "Aprenda convites - tradução correta",
    "time": "7 MIN",
    "phrase": "My name is Ana",
    "translation": "Meu nome é Ana",
    "vocab": [
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you!",
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
        "Good morning!",
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
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night!",
        "Despedida noite"
      ],
      [
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening!",
        "Chegada noite"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Convites</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Ana = Meu nome é Ana<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Convites</h5><p><b>Frase chave:</b> My name is Ana = Meu nome é Ana</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'My name is Ana'",
        "opts": [
          "Meu nome é Ana",
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
          "Meu nome é",
          "Como vai"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Ana'",
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
        "q": "Quando usar 'My name is Ana'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
        "q": "Em 'My name is Ana', qual é o nome?",
        "opts": [
          "Ana",
          "John",
          "Casa",
          "Carro"
        ],
        "ans": 0,
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
        "q": "Ordem correta: 'name / is / my / Ana'",
        "opts": [
          "My Ana is name",
          "My name is Ana",
          "Is my name Ana",
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
          "Meu nome é Ana",
          "Onde você mora?",
          "Qual seu nome?",
          "Meu nome não é"
        ],
        "ans": 0,
        "type": "translation"
      }
    ]
  },
  {
    "id": 195,
    "module": 5,
    "moduleName": "Inglês Profissional",
    "level": "B2",
    "title": "Telefone",
    "desc": "Aprenda telefone - tradução correta",
    "time": "8 MIN",
    "phrase": "Nice to meet you, Maria",
    "translation": "Prazer em conhecer você, Maria",
    "vocab": [
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon!",
        "Tarde"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me!",
        "Chamar atenção"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening!",
        "Chegada noite"
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
        "Good morning",
        "Bom dia",
        "Good morning!",
        "Até meio-dia"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night!",
        "Despedida noite"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Telefone</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Maria = Meu nome é Maria<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Telefone</h5><p><b>Frase chave:</b> Nice to meet you, Maria = Prazer em conhecer você, Maria</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Nice to meet you, Maria'",
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
        "q": "Quando usar 'Nice to meet you, Maria'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "My name is Maria"
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
        "q": "Em 'Nice to meet you, Maria', qual é o nome?",
        "opts": [
          "Carro",
          "Maria",
          "John",
          "Casa"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ Maria'",
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
        "q": "Ordem correta: 'name / is / my / Maria'",
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
          "Bom dia",
          "Boa noite",
          "Prazer em conhecer você, Maria",
          "Até logo"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Maria' significa:",
        "opts": [
          "Meu nome não é",
          "Qual seu nome?",
          "Onde você mora?",
          "Prazer em conhecer você, Maria"
        ],
        "ans": 3,
        "type": "translation"
      }
    ]
  },
  {
    "id": 196,
    "module": 6,
    "moduleName": "Domínio da Fluência",
    "level": "B2",
    "title": "Email e contato",
    "desc": "Aprenda email e contato - tradução correta",
    "time": "9 MIN",
    "phrase": "My name is David",
    "translation": "Meu nome é David",
    "vocab": [
      [
        "Excuse me",
        "Com licença",
        "Excuse me!",
        "Chamar atenção"
      ],
      [
        "Hi",
        "Oi",
        "Hi, nice to see you!",
        "Informal"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
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
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you!",
        "Conhecer alguém"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you!",
        "Agradecimento"
      ],
      [
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
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
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Email e contato</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is David = Meu nome é David<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Email e contato</h5><p><b>Frase chave:</b> My name is David = Meu nome é David</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'My name is David'",
        "opts": [
          "Boa noite",
          "Meu nome é David",
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
          "Quantos anos",
          "Onde mora",
          "Como vai"
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
        "q": "Quando usar 'My name is David'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Qual é seu nome?",
          "Onde mora?",
          "Como vai?",
          "Quantos anos?"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Em 'My name is David', qual é o nome?",
        "opts": [
          "David",
          "Carro",
          "John",
          "Casa"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ David'",
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
        "q": "Ordem correta: 'name / is / my / David'",
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
          "Onde você mora?",
          "Meu nome é David",
          "Meu nome não é",
          "Qual seu nome?"
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
    "title": "Planos futuros",
    "desc": "Aprenda planos futuros - tradução correta",
    "time": "10 MIN",
    "phrase": "I am Sofia",
    "translation": "Eu sou Sofia",
    "vocab": [
      [
        "Good night",
        "Boa noite",
        "Good night!",
        "Despedida noite"
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
        "Good morning!",
        "Até meio-dia"
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
        "House",
        "Casa",
        "My house is big",
        "Casa"
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
        "Nice to meet you!",
        "Conhecer alguém"
      ],
      [
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon!",
        "Tarde"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Planos futuros</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Sofia = Meu nome é Sofia<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Planos futuros</h5><p><b>Frase chave:</b> I am Sofia = Eu sou Sofia</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'I am Sofia'",
        "opts": [
          "Boa noite",
          "Eu sou Sofia",
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
          "Como vai",
          "Quantos anos"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, my ___ is Sofia'",
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
        "q": "Quando usar 'I am Sofia'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "My name is Sofia",
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
          "Como vai?",
          "Quantos anos?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Em 'I am Sofia', qual é o nome?",
        "opts": [
          "John",
          "Casa",
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
          "are",
          "am",
          "be"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Ordem correta: 'name / is / my / Sofia'",
        "opts": [
          "Is my name Sofia",
          "My name is Sofia",
          "My Sofia is name",
          "Sofia is my name"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Nice to meet you, Sofia'",
        "opts": [
          "Prazer em conhecer você, Sofia",
          "Boa noite",
          "Até logo",
          "Bom dia"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Sofia' significa:",
        "opts": [
          "Meu nome não é",
          "Eu sou Sofia",
          "Qual seu nome?",
          "Onde você mora?"
        ],
        "ans": 1,
        "type": "translation"
      }
    ]
  },
  {
    "id": 198,
    "module": 6,
    "moduleName": "Domínio da Fluência",
    "level": "B2",
    "title": "Passado simples",
    "desc": "Aprenda passado simples - tradução correta",
    "time": "11 MIN",
    "phrase": "Good morning, I am Miguel",
    "translation": "Bom dia, eu sou Miguel",
    "vocab": [
      [
        "Food",
        "Comida",
        "I like Brazilian food",
        "Comida"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "How are you?",
        "Como você está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening!",
        "Chegada noite"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me!",
        "Chamar atenção"
      ],
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Hi",
        "Oi",
        "Hi, nice to see you!",
        "Informal"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Passado simples</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Miguel = Meu nome é Miguel<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Passado simples</h5><p><b>Frase chave:</b> Good morning, I am Miguel = Bom dia, eu sou Miguel</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Good morning, I am Miguel'",
        "opts": [
          "Bom dia",
          "Boa noite",
          "Bom dia, eu sou Miguel",
          "Até logo"
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
        "q": "Complete: 'Hello, my ___ is Miguel'",
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
        "q": "Quando usar 'Good morning, I am Miguel'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "Quantos anos?",
          "Onde mora?",
          "Como vai?"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Em 'Good morning, I am Miguel', qual é o nome?",
        "opts": [
          "John",
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
        "q": "Ordem correta: 'name / is / my / Miguel'",
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
          "Meu nome não é",
          "Qual seu nome?",
          "Bom dia, eu sou Miguel",
          "Onde você mora?"
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
    "title": "Experiências",
    "desc": "Aprenda experiências - tradução correta",
    "time": "12 MIN",
    "phrase": "My name is John",
    "translation": "Meu nome é John",
    "vocab": [
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
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
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon!",
        "Tarde"
      ],
      [
        "Nice to meet you",
        "Prazer em conhecer você",
        "Nice to meet you!",
        "Conhecer alguém"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning!",
        "Até meio-dia"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you!",
        "Agradecimento"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night!",
        "Despedida noite"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me!",
        "Chamar atenção"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Experiências</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is John = Meu nome é John<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Experiências</h5><p><b>Frase chave:</b> My name is John = Meu nome é John</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'My name is John'",
        "opts": [
          "Bom dia",
          "Boa noite",
          "Meu nome é John",
          "Até logo"
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
        "q": "Quando usar 'My name is John'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "My name is John",
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
          "Como vai?",
          "Onde mora?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Em 'My name is John', qual é o nome?",
        "opts": [
          "John",
          "Carro",
          "Mike",
          "Casa"
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
        "q": "Ordem correta: 'name / is / my / John'",
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
          "Onde você mora?",
          "Meu nome não é",
          "Meu nome é John"
        ],
        "ans": 3,
        "type": "translation"
      }
    ]
  },
  {
    "id": 200,
    "module": 6,
    "moduleName": "Domínio da Fluência",
    "level": "B2",
    "title": "Preferências",
    "desc": "Aprenda preferências - tradução correta",
    "time": "13 MIN",
    "phrase": "Nice to meet you, Sarah",
    "translation": "Prazer em conhecer você, Sarah",
    "vocab": [
      [
        "Work",
        "Trabalho",
        "I work as a teacher",
        "Trabalho"
      ],
      [
        "Hi",
        "Oi",
        "Hi, nice to see you!",
        "Informal"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning!",
        "Até meio-dia"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta positiva"
      ],
      [
        "Time",
        "Hora",
        "What time is it?",
        "Hora"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you!",
        "Agradecimento"
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
        "Good afternoon!",
        "Tarde"
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
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Preferências</h4><p><b>Estrutura:</b> My name is + nome<br>Ex: My name is Sarah = Meu nome é Sarah<br><b>Dica:</b> Use \"My name is\" para se apresentar. Sempre use mesmo nome em inglês e português!</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Preferências</h5><p><b>Frase chave:</b> Nice to meet you, Sarah = Prazer em conhecer você, Sarah</p><p><b>Quando usar:</b> Ao conhecer alguém</p></div>",
    "quiz": [
      {
        "q": "Traduza corretamente: 'Nice to meet you, Sarah'",
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
        "q": "Complete: 'Hello, my ___ is Sarah'",
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
        "q": "Quando usar 'Nice to meet you, Sarah'?",
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
        "q": "Qual palavra significa 'Olá'?",
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
          "I am fine",
          "My name is Sarah",
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
        "q": "Em 'Nice to meet you, Sarah', qual é o nome?",
        "opts": [
          "John",
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
          "be",
          "am",
          "are",
          "is"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Ordem correta: 'name / is / my / Sarah'",
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
          "Bom dia",
          "Até logo"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "'Hello, my name is Sarah' significa:",
        "opts": [
          "Prazer em conhecer você, Sarah",
          "Onde você mora?",
          "Qual seu nome?",
          "Meu nome não é"
        ],
        "ans": 0,
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
 const vocabHtml=`<div style="margin-bottom:12px;padding:10px;background:#f5fae5;border-radius:10px;font-size:12px;color:#276246"><strong>📖 ${l.vocab.length} palavras - Tradução correta garantida</strong></div><div class="vocab-grid">${l.vocab.map(v=>`<div class="vocab-item" style="border:1px solid #e9e5da;padding:12px;border-radius:10px;background:#fff"><div style="display:flex;justify-content:space-between"><div><strong>${v[0]}</strong> — ${v[1]}<br><small style="color:#718078">${v[2]}</small><br><small style="color:#9ca3af;font-size:11px">💡 ${v[3]||""}</small></div><div style="display:flex;flex-direction:column;gap:4px"><button class="tab" style="font-size:10px" onclick="speakEnglish('${v[0].replace(/'/g,"\'")}')">🔊 EN</button><button class="tab" style="font-size:10px" onclick="speakPortuguese('${v[1].replace(/'/g,"\'")}')">🔊 PT</button></div></div></div>`).join('')}</div>`;
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
   const typeLabel = {"translation":"🌐 Tradução","meaning":"💡 Significado","fill":"✏️ Completar","context":"🎯 Contexto","grammar":"📚 Gramática","listening":"🎧 Escuta","vocab":"📖 Vocabulário","translation_word":"🔤 Palavra","truefalse":"✔️ Verdadeiro/Falso","order":"🔀 Ordem","conversation":"💬 Conversa","interpretation":"🧠 Interpretação"}[q.type] || "❓";
   return `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px"><p><span style="background:#e8f4d1;padding:4px 8px;border-radius:999px;font-size:11px;font-weight:700">${typeLabel}</span> <strong>Pergunta ${currentQuizIndex+1} de ${l.quiz.length}</strong> <span style="background:#dbeafe;padding:2px 6px;border-radius:999px;font-size:10px">🔀 Embaralhado</span></p><div style="height:6px;width:100px;background:#e9e5da;border-radius:999px;overflow:hidden"><i style="display:block;height:100%;width:${(currentQuizIndex/l.quiz.length*100)}%;background:var(--green)"></i></div></div><p style="font-size:15px;margin:12px 0;font-weight:500">${q.q}</p><div style="display:grid;gap:10px">${displayOpts.map((o,i)=>`<button class="option" style="text-align:left;padding:14px 16px;border:1.5px solid #e9e5da;border-radius:12px;background:#fff;cursor:pointer;font-size:14px;line-height:1.4" data-answer="${i}"><span style="display:inline-block;width:28px;height:28px;background:#f1efe8;border-radius:50%;text-align:center;line-height:28px;font-weight:700;font-size:12px;margin-right:8px">${String.fromCharCode(65+i)}</span> ${o}</button>`).join('')}</div><div id="feedback" style="margin-top:12px;font-weight:700"></div><div style="display:flex;gap:8px;margin-top:14px;justify-content:space-between"><button id="prev-q" class="tab" ${currentQuizIndex===0?'disabled':''}>← Anterior</button><span style="font-size:11px;color:#718078">💡 ${currentQuizIndex+1}/${l.quiz.length} · ${l.title}</span><button id="next-q" class="tab" ${currentQuizIndex===l.quiz.length-1?'disabled':''}>Próxima →</button></div>`;
 }
 function renderModal(){
   return `<p style="font-size:10px;letter-spacing:.12em;color:#718078;font-weight:700">MÓDULO ${l.module} · ${l.level} · ${l.time} · ${l.quiz.length} PERGUNTAS · ${l.vocab.length} PALAVRAS</p><h2 style="font-family:Fraunces;margin:4px 0">${l.title}</h2><p style="color:#718078;font-size:13px">${l.desc}</p>${tabs}<div id="tab-dialog"><p style="font-family:Fraunces;font-size:22px;color:#276246;margin:16px 0 6px">${l.phrase}</p><p style="color:#718078">${l.translation}</p><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px"><button class="primary" onclick="speakEnglish('${l.phrase.replace(/'/g,"\'")}')">🔊 EN Nativo</button><button class="tab" onclick="speakPortuguese('${l.translation.replace(/'/g,"\'")}')">🔊 PT</button><button class="tab" onclick="speakSlow('${l.phrase.replace(/'/g,"\'")}')">🐢 Devagar</button><button class="tab" onclick="speakBilingual('${l.phrase.replace(/'/g,"\'")}','${l.translation.replace(/'/g,"\'")}')">🔊 Bilíngue</button></div><div style="margin-top:12px;padding:8px;background:#f5fae5;border-radius:8px;font-size:11px;color:#276246">✅ Tradução verificada: EN e PT com mesmo nome</div></div><div id="tab-vocab" class="hidden">${vocabHtml}</div><div id="tab-grammar" class="hidden"><div style="background:#f5fae5;padding:12px;border-radius:10px">${l.grammar}<br><br><button class="primary" onclick="speakBilingual('${l.phrase.replace(/'/g,"\'")}','${l.translation.replace(/'/g,"\'")}')">🔊 Ouvir bilíngue</button></div></div><div id="tab-quiz" class="hidden"><div id="quiz-container">${getQuizHtml()}</div></div>`;
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
         points+=10; save(); const ptsEl=document.getElementById('points'); if(ptsEl) ptsEl.textContent=points;
         speakEnglish('Correct! Very good!');
         setTimeout(()=>{
           if(currentQuizIndex < l.quiz.length-1){
             currentQuizIndex++;
             document.getElementById('quiz-container').innerHTML=getQuizHtml();
             attachQuiz();
           } else {
             fb.innerHTML+=`<br><br><strong style="color:#276246">🎉 Lição concluída! Você respondeu ${l.quiz.length} perguntas e ganhou ${l.quiz.length*10} XP!</strong>`;
             if(!completed.includes(l.id)){ completed.push(l.id); save(); renderLessons(); }
             speakBilingual('Congratulations! Lesson completed!', 'Parabéns! Lição concluída!');
             setTimeout(()=>{ const nxt=lessons.find(x=>x.id>l.id && !completed.includes(x.id)); if(nxt) openLesson(nxt.id); else { const m=document.getElementById('lesson-modal'); if(m){ m.classList.add('hidden'); m.style.display='none'; } } }, 1800);
           }
         }, 800);
       } else {
         const correctText = q._shuffled ? q._shuffled[q._currentDisplayAns] : q.opts[q.ans];
         fb.innerHTML=`<span style="color:#dc2626">❌ Quase! Correta: "${correctText}"</span><br><small style="color:#718078">Clique em 🔊 para ouvir</small>`;
         b.style.background='#ffe4e6';
         speakPortuguese('Quase! A resposta correta é: ' + q.opts[q.ans]);
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
const words=[['Hello','Olá','Hello, nice to meet you.'],['Work','Trabalho','I work as a designer.'],['Travel','Viajar','I love to travel.'],['Family','Família','My family is big.'],['Future','Futuro','My future is bright.'],['Success','Sucesso','Success takes time.']]; let ci=0; function renderCard(){ const c=words[ci]; const w=document.getElementById('word'); const tr=document.getElementById('translation'); const ex=document.getElementById('example'); const idx=document.getElementById('card-index'); if(w){ w.textContent=c[0]; if(tr) tr.textContent=c[1]; if(ex) ex.textContent=c[2]; if(idx) idx.textContent=(ci+1)+'/'+words.length; }} const nextCardBtn=document.getElementById('next-card'); if(nextCardBtn) nextCardBtn.onclick=()=>{ ci=(ci+1)%words.length; renderCard(); }; const listenWord=document.getElementById('listen-word'); if(listenWord) listenWord.onclick=()=>speakEnglish(document.getElementById('word').textContent);
const dateEl=document.getElementById('date-now'); if(dateEl) dateEl.textContent=new Date().toLocaleDateString('pt-BR',{weekday:'long',day:'numeric',month:'long'}).toUpperCase();
const currentDateEl=document.getElementById('current-date'); if(currentDateEl){ const now=new Date(); currentDateEl.textContent=now.toLocaleDateString('pt-BR',{weekday:'long',day:'numeric',month:'long',year:'numeric'}).toUpperCase(); }
const sKey='zeuvastec-student-name'; function applyName(v){ const name=(v||'amigo').trim()||'amigo'; const el1=document.getElementById('student-name'); const el2=document.getElementById('profile-name'); const el3=document.getElementById('profile-initials'); if(el1) el1.textContent=name; if(el2) el2.textContent=name; if(el3) el3.textContent=name.split(/\s+/).slice(0,2).map(p=>p[0]).join('').toUpperCase(); } const saved=localStorage.getItem(sKey); if(saved) applyName(saved); const editBtn=document.getElementById('edit-profile'); if(editBtn) editBtn.addEventListener('click', (e)=>{ e.preventDefault(); const m=document.getElementById('name-modal'); if(m){ m.classList.remove('hidden'); m.style.display='grid'; const inp=document.getElementById('student-name-input'); if(inp){ inp.value=localStorage.getItem(sKey)||''; setTimeout(()=>inp.focus(),100); } } }); const nameForm=document.getElementById('name-form'); if(nameForm) nameForm.addEventListener('submit', (e)=>{ e.preventDefault(); const inp=document.getElementById('student-name-input'); const n=inp?inp.value.trim():''; if(!n) return; localStorage.setItem(sKey,n); applyName(n); const m=document.getElementById('name-modal'); if(m){ m.classList.add('hidden'); m.style.display='none'; } });
const soundToggle=document.getElementById('sound-toggle'); if(soundToggle) soundToggle.onclick=()=>{ soundOn=!soundOn; soundToggle.style.opacity=soundOn?'1':'.45'; };
renderLessons(); renderCard();
