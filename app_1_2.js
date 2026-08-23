
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
    "desc": "Aprenda olá e apresentações - vocabulário ampliado e gramática completa",
    "time": "6 MIN",
    "phrase": "Hello, my name is John",
    "translation": "Olá, meu nome é Ana",
    "vocab": [
      [
        "Work",
        "Trabalho",
        "I work as teacher",
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
        "How are you?",
        "Como está?",
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
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Food",
        "Comida",
        "I like food",
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
        "Excuse me, where is...?",
        "Atenção"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Olá e apresentações</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Olá e apresentações</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is John'",
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
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Onde mora",
          "Como vai",
          "Prazer em conhecê-lo",
          "Quantos anos"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "big",
          "nice",
          "good",
          "bad"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is John'?",
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
        "q": "Qual verbo em 'Hello, my name is John'?",
        "opts": [
          "is",
          "the",
          "and",
          "or"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "I am fine",
          "Nice to meet you too",
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
          "Qual é seu nome?",
          "Como vai?",
          "Quantos anos?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello' é:",
        "opts": [
          "Despedida",
          "Pedido",
          "Um cumprimento",
          "Agradecimento"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "Meet you nice to",
          "You nice to meet",
          "To you nice meet",
          "Nice to meet you"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa noite",
          "Boa tarde",
          "Olá",
          "Bom dia"
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
    "desc": "Aprenda dizendo seu nome - vocabulário ampliado e gramática completa",
    "time": "7 MIN",
    "phrase": "Hello, my name is Ana",
    "translation": "Olá, meu nome é João",
    "vocab": [
      [
        "Food",
        "Comida",
        "I like food",
        "Comida"
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
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta"
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
        "Time",
        "Tempo",
        "What time is it?",
        "Hora"
      ],
      [
        "How are you?",
        "Como está?",
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
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Dizendo seu nome</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Dizendo seu nome</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Ana'",
        "opts": [
          "Boa noite",
          "Bom dia",
          "Olá, meu nome é João",
          "Até logo"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Como vai",
          "Prazer em conhecê-lo",
          "Onde mora",
          "Quantos anos"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "big",
          "nice",
          "good",
          "bad"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Ana'?",
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
        "q": "Qual verbo em 'Hello, my name is Ana'?",
        "opts": [
          "is",
          "and",
          "the",
          "or"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "I am fine",
          "Nice to meet you too",
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
          "Qual é seu nome?",
          "Quantos anos?",
          "Como vai?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello' é:",
        "opts": [
          "Despedida",
          "Um cumprimento",
          "Pedido",
          "Agradecimento"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "Nice to meet you",
          "Meet you nice to",
          "You nice to meet",
          "To you nice meet"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa tarde",
          "Bom dia",
          "Boa noite",
          "Olá"
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
    "desc": "Aprenda de onde você é - vocabulário ampliado e gramática completa",
    "time": "8 MIN",
    "phrase": "Hello, my name is Mike",
    "translation": "Olá, meu nome é Miguel",
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
        "How are you?",
        "Como está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Atenção"
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
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: De onde você é</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: De onde você é</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Mike'",
        "opts": [
          "Até logo",
          "Bom dia",
          "Olá, meu nome é Miguel",
          "Boa noite"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Como vai",
          "Quantos anos",
          "Onde mora",
          "Prazer em conhecê-lo"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "bad",
          "good",
          "nice",
          "big"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Mike'?",
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
        "q": "Qual verbo em 'Hello, my name is Mike'?",
        "opts": [
          "and",
          "or",
          "is",
          "the"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Thank you",
          "I am fine",
          "Nice to meet you too",
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
        "q": "'Hello' é:",
        "opts": [
          "Despedida",
          "Um cumprimento",
          "Pedido",
          "Agradecimento"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "Nice to meet you",
          "To you nice meet",
          "You nice to meet",
          "Meet you nice to"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Olá",
          "Bom dia",
          "Boa noite",
          "Boa tarde"
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
    "desc": "Aprenda perguntando o nome - vocabulário ampliado e gramática completa",
    "time": "9 MIN",
    "phrase": "Hello, my name is Ana",
    "translation": "Olá, meu nome é Miguel",
    "vocab": [
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
        "Resposta"
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
        "I like food",
        "Comida"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Perguntando o nome</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Perguntando o nome</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Ana'",
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
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Prazer em conhecê-lo",
          "Quantos anos",
          "Onde mora",
          "Como vai"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "good",
          "bad",
          "big",
          "nice"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Ana'?",
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
        "q": "Qual verbo em 'Hello, my name is Ana'?",
        "opts": [
          "or",
          "is",
          "and",
          "the"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Nice to meet you too",
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
          "Quantos anos?",
          "Qual é seu nome?",
          "Como vai?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "'Hello' é:",
        "opts": [
          "Agradecimento",
          "Um cumprimento",
          "Pedido",
          "Despedida"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "To you nice meet",
          "Meet you nice to",
          "You nice to meet",
          "Nice to meet you"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa noite",
          "Bom dia",
          "Boa tarde",
          "Olá"
        ],
        "ans": 1,
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
    "desc": "Aprenda idade e aniversário - vocabulário ampliado e gramática completa",
    "time": "10 MIN",
    "phrase": "Hello, my name is Mike",
    "translation": "Olá, meu nome é Ana",
    "vocab": [
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "Work",
        "Trabalho",
        "I work as teacher",
        "Trabalho"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Nice to meet you",
        "Prazer",
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
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "How are you?",
        "Como está?",
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
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Idade e aniversário</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Idade e aniversário</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Mike'",
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
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Como vai",
          "Onde mora",
          "Quantos anos",
          "Prazer em conhecê-lo"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "big",
          "good",
          "nice",
          "bad"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Mike'?",
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
        "q": "Qual verbo em 'Hello, my name is Mike'?",
        "opts": [
          "the",
          "and",
          "is",
          "or"
        ],
        "ans": 2,
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Nice to meet you too",
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
          "Quantos anos?",
          "Como vai?",
          "Onde mora?"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "'Hello' é:",
        "opts": [
          "Um cumprimento",
          "Agradecimento",
          "Pedido",
          "Despedida"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "To you nice meet",
          "Meet you nice to",
          "Nice to meet you",
          "You nice to meet"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Bom dia",
          "Boa tarde",
          "Olá",
          "Boa noite"
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
    "desc": "Aprenda família básica - vocabulário ampliado e gramática completa",
    "time": "11 MIN",
    "phrase": "Hello, my name is Mike",
    "translation": "Olá, meu nome é Sarah",
    "vocab": [
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "Time",
        "Tempo",
        "What time is it?",
        "Hora"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Atenção"
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
        "Resposta"
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
        "I like food",
        "Comida"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "How are you?",
        "Como está?",
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
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Família básica</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Família básica</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Mike'",
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
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Quantos anos",
          "Como vai",
          "Prazer em conhecê-lo",
          "Onde mora"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "nice",
          "big",
          "good",
          "bad"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Mike'?",
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
        "q": "Qual verbo em 'Hello, my name is Mike'?",
        "opts": [
          "or",
          "is",
          "the",
          "and"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Nice to meet you too",
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
          "Como vai?",
          "Quantos anos?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "'Hello' é:",
        "opts": [
          "Despedida",
          "Um cumprimento",
          "Agradecimento",
          "Pedido"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "Meet you nice to",
          "To you nice meet",
          "Nice to meet you",
          "You nice to meet"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Bom dia",
          "Boa noite",
          "Olá",
          "Boa tarde"
        ],
        "ans": 0,
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
    "desc": "Aprenda cumprimentos formais - vocabulário ampliado e gramática completa",
    "time": "12 MIN",
    "phrase": "Hello, my name is John",
    "translation": "Olá, meu nome é Sarah",
    "vocab": [
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "How are you?",
        "Como está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Day",
        "Dia",
        "What day is today?",
        "Dia"
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
        "Time",
        "Tempo",
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
        "Nice to meet you",
        "Prazer",
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
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Cumprimentos formais</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Cumprimentos formais</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is John'",
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
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Como vai",
          "Quantos anos",
          "Prazer em conhecê-lo",
          "Onde mora"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "good",
          "nice",
          "big",
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
        "q": "Qual verbo em 'Hello, my name is John'?",
        "opts": [
          "or",
          "is",
          "the",
          "and"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Goodbye",
          "I am fine",
          "Thank you",
          "Nice to meet you too"
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
        "q": "'Hello' é:",
        "opts": [
          "Um cumprimento",
          "Despedida",
          "Agradecimento",
          "Pedido"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "You nice to meet",
          "To you nice meet",
          "Nice to meet you",
          "Meet you nice to"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Olá",
          "Bom dia",
          "Boa noite",
          "Boa tarde"
        ],
        "ans": 1,
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
    "desc": "Aprenda despedidas - vocabulário ampliado e gramática completa",
    "time": "13 MIN",
    "phrase": "Hello, my name is Mike",
    "translation": "Olá, meu nome é João",
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
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "Nice to meet you",
        "Prazer",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta"
      ],
      [
        "Day",
        "Dia",
        "What day is today?",
        "Dia"
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
        "Time",
        "Tempo",
        "What time is it?",
        "Hora"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Despedidas</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Despedidas</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Mike'",
        "opts": [
          "Até logo",
          "Olá, meu nome é João",
          "Boa noite",
          "Bom dia"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Onde mora",
          "Como vai",
          "Prazer em conhecê-lo",
          "Quantos anos"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "good",
          "big",
          "nice",
          "bad"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Mike'?",
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
        "q": "Qual verbo em 'Hello, my name is Mike'?",
        "opts": [
          "and",
          "is",
          "the",
          "or"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Nice to meet you too",
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
          "Qual é seu nome?",
          "Como vai?",
          "Quantos anos?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello' é:",
        "opts": [
          "Despedida",
          "Agradecimento",
          "Pedido",
          "Um cumprimento"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "To you nice meet",
          "You nice to meet",
          "Nice to meet you",
          "Meet you nice to"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa tarde",
          "Boa noite",
          "Bom dia",
          "Olá"
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
    "desc": "Aprenda como você está - vocabulário ampliado e gramática completa",
    "time": "6 MIN",
    "phrase": "Hello, my name is Mike",
    "translation": "Olá, meu nome é Ana",
    "vocab": [
      [
        "Day",
        "Dia",
        "What day is today?",
        "Dia"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "How are you?",
        "Como está?",
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
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Atenção"
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
        "I work as teacher",
        "Trabalho"
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
        "Resposta"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Como você está</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Como você está</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Mike'",
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
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Quantos anos",
          "Onde mora",
          "Prazer em conhecê-lo",
          "Como vai"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "bad",
          "big",
          "good",
          "nice"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Mike'?",
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
        "q": "Qual verbo em 'Hello, my name is Mike'?",
        "opts": [
          "and",
          "or",
          "is",
          "the"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Thank you",
          "Nice to meet you too",
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
          "Quantos anos?",
          "Como vai?"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "'Hello' é:",
        "opts": [
          "Pedido",
          "Despedida",
          "Agradecimento",
          "Um cumprimento"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "Meet you nice to",
          "You nice to meet",
          "Nice to meet you",
          "To you nice meet"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Bom dia",
          "Olá",
          "Boa tarde",
          "Boa noite"
        ],
        "ans": 0,
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
    "desc": "Aprenda números e telefone - vocabulário ampliado e gramática completa",
    "time": "7 MIN",
    "phrase": "Hello, my name is Mike",
    "translation": "Olá, meu nome é Sarah",
    "vocab": [
      [
        "Day",
        "Dia",
        "What day is today?",
        "Dia"
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
        "Nice to meet you",
        "Prazer",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Atenção"
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
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "How are you?",
        "Como está?",
        "How are you today?",
        "Bem-estar"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Números e telefone</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Números e telefone</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Mike'",
        "opts": [
          "Olá, meu nome é Sarah",
          "Boa noite",
          "Bom dia",
          "Até logo"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Onde mora",
          "Quantos anos",
          "Como vai",
          "Prazer em conhecê-lo"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "bad",
          "big",
          "nice",
          "good"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Mike'?",
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
        "q": "Qual verbo em 'Hello, my name is Mike'?",
        "opts": [
          "is",
          "the",
          "or",
          "and"
        ],
        "ans": 0,
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Goodbye",
          "Nice to meet you too",
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
        "q": "'Hello' é:",
        "opts": [
          "Despedida",
          "Pedido",
          "Agradecimento",
          "Um cumprimento"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "Meet you nice to",
          "You nice to meet",
          "Nice to meet you",
          "To you nice meet"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa noite",
          "Olá",
          "Boa tarde",
          "Bom dia"
        ],
        "ans": 3,
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
    "desc": "Aprenda endereço e cidade - vocabulário ampliado e gramática completa",
    "time": "8 MIN",
    "phrase": "Hello, my name is Sarah",
    "translation": "Olá, meu nome é João",
    "vocab": [
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ],
      [
        "Nice to meet you",
        "Prazer",
        "Nice to meet you, John!",
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
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Time",
        "Tempo",
        "What time is it?",
        "Hora"
      ],
      [
        "How are you?",
        "Como está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Day",
        "Dia",
        "What day is today?",
        "Dia"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Endereço e cidade</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Endereço e cidade</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Sarah'",
        "opts": [
          "Até logo",
          "Boa noite",
          "Olá, meu nome é João",
          "Bom dia"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Prazer em conhecê-lo",
          "Onde mora",
          "Quantos anos",
          "Como vai"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "big",
          "good",
          "bad",
          "nice"
        ],
        "ans": 3,
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
        "q": "Qual verbo em 'Hello, my name is Sarah'?",
        "opts": [
          "or",
          "is",
          "and",
          "the"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Nice to meet you too",
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
          "Qual é seu nome?",
          "Onde mora?",
          "Como vai?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello' é:",
        "opts": [
          "Pedido",
          "Despedida",
          "Um cumprimento",
          "Agradecimento"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "You nice to meet",
          "Meet you nice to",
          "To you nice meet",
          "Nice to meet you"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Bom dia",
          "Boa tarde",
          "Olá",
          "Boa noite"
        ],
        "ans": 0,
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
    "desc": "Aprenda profissão simples - vocabulário ampliado e gramática completa",
    "time": "9 MIN",
    "phrase": "Hello, my name is Mike",
    "translation": "Olá, meu nome é Sarah",
    "vocab": [
      [
        "Work",
        "Trabalho",
        "I work as teacher",
        "Trabalho"
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
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "How are you?",
        "Como está?",
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
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta"
      ],
      [
        "Food",
        "Comida",
        "I like food",
        "Comida"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Profissão simples</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Profissão simples</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Mike'",
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
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Quantos anos",
          "Onde mora",
          "Prazer em conhecê-lo",
          "Como vai"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "bad",
          "good",
          "big",
          "nice"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Mike'?",
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
        "q": "Qual verbo em 'Hello, my name is Mike'?",
        "opts": [
          "or",
          "and",
          "is",
          "the"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Nice to meet you too",
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
        "q": "'Hello' é:",
        "opts": [
          "Pedido",
          "Agradecimento",
          "Despedida",
          "Um cumprimento"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "Nice to meet you",
          "To you nice meet",
          "Meet you nice to",
          "You nice to meet"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa noite",
          "Boa tarde",
          "Bom dia",
          "Olá"
        ],
        "ans": 2,
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
    "desc": "Aprenda hobbies favoritos - vocabulário ampliado e gramática completa",
    "time": "10 MIN",
    "phrase": "Hello, my name is John",
    "translation": "Olá, meu nome é Miguel",
    "vocab": [
      [
        "Time",
        "Tempo",
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
        "I work as teacher",
        "Trabalho"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta"
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
        "Atenção"
      ],
      [
        "How are you?",
        "Como está?",
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
        "I like food",
        "Comida"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Hobbies favoritos</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Hobbies favoritos</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is John'",
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
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Onde mora",
          "Como vai",
          "Prazer em conhecê-lo",
          "Quantos anos"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "good",
          "nice",
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
          "Ao dirigir",
          "Ao se apresentar"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Qual verbo em 'Hello, my name is John'?",
        "opts": [
          "is",
          "and",
          "the",
          "or"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Thank you",
          "I am fine",
          "Goodbye",
          "Nice to meet you too"
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
        "q": "'Hello' é:",
        "opts": [
          "Agradecimento",
          "Despedida",
          "Um cumprimento",
          "Pedido"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "To you nice meet",
          "Nice to meet you",
          "Meet you nice to",
          "You nice to meet"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Olá",
          "Boa noite",
          "Bom dia",
          "Boa tarde"
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
    "desc": "Aprenda comida favorita - vocabulário ampliado e gramática completa",
    "time": "11 MIN",
    "phrase": "Hello, my name is Sarah",
    "translation": "Olá, meu nome é Miguel",
    "vocab": [
      [
        "Day",
        "Dia",
        "What day is today?",
        "Dia"
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
        "Resposta"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Food",
        "Comida",
        "I like food",
        "Comida"
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
        "I work as teacher",
        "Trabalho"
      ],
      [
        "Time",
        "Tempo",
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
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Comida favorita</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Comida favorita</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Sarah'",
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
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Quantos anos",
          "Prazer em conhecê-lo",
          "Onde mora",
          "Como vai"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "good",
          "nice",
          "bad",
          "big"
        ],
        "ans": 1,
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
        "q": "Qual verbo em 'Hello, my name is Sarah'?",
        "opts": [
          "is",
          "the",
          "or",
          "and"
        ],
        "ans": 0,
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Goodbye",
          "Nice to meet you too",
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
          "Onde mora?",
          "Quantos anos?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "'Hello' é:",
        "opts": [
          "Pedido",
          "Agradecimento",
          "Um cumprimento",
          "Despedida"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "To you nice meet",
          "You nice to meet",
          "Meet you nice to",
          "Nice to meet you"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa tarde",
          "Olá",
          "Bom dia",
          "Boa noite"
        ],
        "ans": 2,
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
    "desc": "Aprenda cores favoritas - vocabulário ampliado e gramática completa",
    "time": "12 MIN",
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
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "How are you?",
        "Como está?",
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
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta"
      ],
      [
        "Time",
        "Tempo",
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
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Nice to meet you",
        "Prazer",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Cores favoritas</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Cores favoritas</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Ana'",
        "opts": [
          "Até logo",
          "Olá, meu nome é Ana",
          "Bom dia",
          "Boa noite"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Onde mora",
          "Quantos anos",
          "Prazer em conhecê-lo",
          "Como vai"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "good",
          "big",
          "nice",
          "bad"
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
        "q": "Qual verbo em 'Hello, my name is Ana'?",
        "opts": [
          "is",
          "and",
          "or",
          "the"
        ],
        "ans": 0,
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "I am fine",
          "Nice to meet you too",
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
          "Quantos anos?",
          "Qual é seu nome?",
          "Como vai?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "'Hello' é:",
        "opts": [
          "Pedido",
          "Agradecimento",
          "Despedida",
          "Um cumprimento"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "Meet you nice to",
          "To you nice meet",
          "Nice to meet you",
          "You nice to meet"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa noite",
          "Bom dia",
          "Boa tarde",
          "Olá"
        ],
        "ans": 1,
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
    "desc": "Aprenda tempo e clima - vocabulário ampliado e gramática completa",
    "time": "13 MIN",
    "phrase": "Hello, my name is Ana",
    "translation": "Olá, meu nome é João",
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
        "Day",
        "Dia",
        "What day is today?",
        "Dia"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta"
      ],
      [
        "Food",
        "Comida",
        "I like food",
        "Comida"
      ],
      [
        "How are you?",
        "Como está?",
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
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ],
      [
        "Time",
        "Tempo",
        "What time is it?",
        "Hora"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Tempo e clima</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Tempo e clima</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Ana'",
        "opts": [
          "Olá, meu nome é João",
          "Bom dia",
          "Boa noite",
          "Até logo"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Prazer em conhecê-lo",
          "Onde mora",
          "Quantos anos",
          "Como vai"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "bad",
          "nice",
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
        "q": "Qual verbo em 'Hello, my name is Ana'?",
        "opts": [
          "the",
          "or",
          "and",
          "is"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Thank you",
          "I am fine",
          "Nice to meet you too",
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
        "q": "'Hello' é:",
        "opts": [
          "Despedida",
          "Pedido",
          "Um cumprimento",
          "Agradecimento"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "Nice to meet you",
          "To you nice meet",
          "You nice to meet",
          "Meet you nice to"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Olá",
          "Bom dia",
          "Boa tarde",
          "Boa noite"
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
    "desc": "Aprenda dias da semana - vocabulário ampliado e gramática completa",
    "time": "6 MIN",
    "phrase": "Hello, my name is Sarah",
    "translation": "Olá, meu nome é Sarah",
    "vocab": [
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
        "Day",
        "Dia",
        "What day is today?",
        "Dia"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Atenção"
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
        "I work as teacher",
        "Trabalho"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Nice to meet you",
        "Prazer",
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
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Dias da semana</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Dias da semana</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Sarah'",
        "opts": [
          "Boa noite",
          "Até logo",
          "Olá, meu nome é Sarah",
          "Bom dia"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Como vai",
          "Onde mora",
          "Prazer em conhecê-lo",
          "Quantos anos"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "bad",
          "nice",
          "good",
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
        "q": "Qual verbo em 'Hello, my name is Sarah'?",
        "opts": [
          "or",
          "is",
          "and",
          "the"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "I am fine",
          "Nice to meet you too",
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
          "Onde mora?",
          "Qual é seu nome?",
          "Como vai?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "'Hello' é:",
        "opts": [
          "Despedida",
          "Agradecimento",
          "Pedido",
          "Um cumprimento"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "You nice to meet",
          "Nice to meet you",
          "Meet you nice to",
          "To you nice meet"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Olá",
          "Boa tarde",
          "Boa noite",
          "Bom dia"
        ],
        "ans": 3,
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
    "desc": "Aprenda horas e compromissos - vocabulário ampliado e gramática completa",
    "time": "7 MIN",
    "phrase": "Hello, my name is Ana",
    "translation": "Olá, meu nome é Miguel",
    "vocab": [
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "Nice to meet you",
        "Prazer",
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
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "How are you?",
        "Como está?",
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
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Atenção"
      ],
      [
        "Time",
        "Tempo",
        "What time is it?",
        "Hora"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Horas e compromissos</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Horas e compromissos</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Ana'",
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
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Prazer em conhecê-lo",
          "Quantos anos",
          "Como vai",
          "Onde mora"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "bad",
          "nice",
          "good",
          "big"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Ana'?",
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
        "q": "Qual verbo em 'Hello, my name is Ana'?",
        "opts": [
          "and",
          "or",
          "the",
          "is"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Thank you",
          "Nice to meet you too",
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
        "q": "'Hello' é:",
        "opts": [
          "Um cumprimento",
          "Despedida",
          "Agradecimento",
          "Pedido"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "To you nice meet",
          "Meet you nice to",
          "Nice to meet you",
          "You nice to meet"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa noite",
          "Olá",
          "Bom dia",
          "Boa tarde"
        ],
        "ans": 2,
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
    "desc": "Aprenda família estendida - vocabulário ampliado e gramática completa",
    "time": "8 MIN",
    "phrase": "Hello, my name is Ana",
    "translation": "Olá, meu nome é Sarah",
    "vocab": [
      [
        "Time",
        "Tempo",
        "What time is it?",
        "Hora"
      ],
      [
        "How are you?",
        "Como está?",
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
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Nice to meet you",
        "Prazer",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Food",
        "Comida",
        "I like food",
        "Comida"
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
        "Resposta"
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
        "Atenção"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Família estendida</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Família estendida</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Ana'",
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
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Como vai",
          "Quantos anos",
          "Prazer em conhecê-lo",
          "Onde mora"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "bad",
          "nice",
          "good",
          "big"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Ana'?",
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
        "q": "Qual verbo em 'Hello, my name is Ana'?",
        "opts": [
          "is",
          "the",
          "and",
          "or"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Thank you",
          "Goodbye",
          "I am fine",
          "Nice to meet you too"
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
        "q": "'Hello' é:",
        "opts": [
          "Um cumprimento",
          "Despedida",
          "Agradecimento",
          "Pedido"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "Meet you nice to",
          "You nice to meet",
          "To you nice meet",
          "Nice to meet you"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Bom dia",
          "Boa tarde",
          "Boa noite",
          "Olá"
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
    "desc": "Aprenda casa e moradia - vocabulário ampliado e gramática completa",
    "time": "9 MIN",
    "phrase": "Hello, my name is John",
    "translation": "Olá, meu nome é Sarah",
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
        "Atenção"
      ],
      [
        "Day",
        "Dia",
        "What day is today?",
        "Dia"
      ],
      [
        "Food",
        "Comida",
        "I like food",
        "Comida"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "How are you?",
        "Como está?",
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
        "Time",
        "Tempo",
        "What time is it?",
        "Hora"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Casa e moradia</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Casa e moradia</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is John'",
        "opts": [
          "Até logo",
          "Olá, meu nome é Sarah",
          "Bom dia",
          "Boa noite"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Como vai",
          "Prazer em conhecê-lo",
          "Onde mora",
          "Quantos anos"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "big",
          "bad",
          "good",
          "nice"
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
        "q": "Qual verbo em 'Hello, my name is John'?",
        "opts": [
          "is",
          "or",
          "the",
          "and"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Thank you",
          "Nice to meet you too",
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
          "Quantos anos?",
          "Onde mora?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "'Hello' é:",
        "opts": [
          "Pedido",
          "Despedida",
          "Um cumprimento",
          "Agradecimento"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "Meet you nice to",
          "You nice to meet",
          "To you nice meet",
          "Nice to meet you"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa noite",
          "Boa tarde",
          "Olá",
          "Bom dia"
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
    "desc": "Aprenda rotina matinal - vocabulário ampliado e gramática completa",
    "time": "10 MIN",
    "phrase": "Hello, my name is Mike",
    "translation": "Olá, meu nome é Sarah",
    "vocab": [
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
        "I work as teacher",
        "Trabalho"
      ],
      [
        "Food",
        "Comida",
        "I like food",
        "Comida"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "Time",
        "Tempo",
        "What time is it?",
        "Hora"
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
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Rotina matinal</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Rotina matinal</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Mike'",
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
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Prazer em conhecê-lo",
          "Como vai",
          "Onde mora",
          "Quantos anos"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "good",
          "nice",
          "bad",
          "big"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Mike'?",
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
        "q": "Qual verbo em 'Hello, my name is Mike'?",
        "opts": [
          "or",
          "the",
          "is",
          "and"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Goodbye",
          "Nice to meet you too",
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
        "q": "'Hello' é:",
        "opts": [
          "Pedido",
          "Despedida",
          "Um cumprimento",
          "Agradecimento"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "Nice to meet you",
          "Meet you nice to",
          "You nice to meet",
          "To you nice meet"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa tarde",
          "Bom dia",
          "Olá",
          "Boa noite"
        ],
        "ans": 1,
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
    "desc": "Aprenda rotina noturna - vocabulário ampliado e gramática completa",
    "time": "11 MIN",
    "phrase": "Hello, my name is Mike",
    "translation": "Olá, meu nome é Ana",
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
        "Como está?",
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
        "Nice to meet you",
        "Prazer",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Work",
        "Trabalho",
        "I work as teacher",
        "Trabalho"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Rotina noturna</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Rotina noturna</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Mike'",
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
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Onde mora",
          "Quantos anos",
          "Prazer em conhecê-lo",
          "Como vai"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "bad",
          "big",
          "good",
          "nice"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Mike'?",
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
        "q": "Qual verbo em 'Hello, my name is Mike'?",
        "opts": [
          "and",
          "the",
          "is",
          "or"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "I am fine",
          "Goodbye",
          "Nice to meet you too",
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
          "Quantos anos?",
          "Como vai?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello' é:",
        "opts": [
          "Agradecimento",
          "Pedido",
          "Um cumprimento",
          "Despedida"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "Meet you nice to",
          "Nice to meet you",
          "To you nice meet",
          "You nice to meet"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa noite",
          "Olá",
          "Bom dia",
          "Boa tarde"
        ],
        "ans": 2,
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
    "desc": "Aprenda fim de semana - vocabulário ampliado e gramática completa",
    "time": "12 MIN",
    "phrase": "Hello, my name is Ana",
    "translation": "Olá, meu nome é Sarah",
    "vocab": [
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "Time",
        "Tempo",
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
        "Food",
        "Comida",
        "I like food",
        "Comida"
      ],
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ],
      [
        "Nice to meet you",
        "Prazer",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta"
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
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Fim de semana</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Fim de semana</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Ana'",
        "opts": [
          "Olá, meu nome é Sarah",
          "Boa noite",
          "Bom dia",
          "Até logo"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Quantos anos",
          "Prazer em conhecê-lo",
          "Onde mora",
          "Como vai"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "big",
          "bad",
          "nice",
          "good"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Ana'?",
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
        "q": "Qual verbo em 'Hello, my name is Ana'?",
        "opts": [
          "the",
          "and",
          "is",
          "or"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Goodbye",
          "Nice to meet you too",
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
          "Onde mora?",
          "Como vai?"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "'Hello' é:",
        "opts": [
          "Agradecimento",
          "Pedido",
          "Despedida",
          "Um cumprimento"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "To you nice meet",
          "Nice to meet you",
          "You nice to meet",
          "Meet you nice to"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa tarde",
          "Bom dia",
          "Boa noite",
          "Olá"
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
    "desc": "Aprenda compras básicas - vocabulário ampliado e gramática completa",
    "time": "13 MIN",
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
        "Day",
        "Dia",
        "What day is today?",
        "Dia"
      ],
      [
        "Nice to meet you",
        "Prazer",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Work",
        "Trabalho",
        "I work as teacher",
        "Trabalho"
      ],
      [
        "How are you?",
        "Como está?",
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
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Compras básicas</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Compras básicas</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Sarah'",
        "opts": [
          "Olá, meu nome é Sarah",
          "Bom dia",
          "Boa noite",
          "Até logo"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Como vai",
          "Quantos anos",
          "Prazer em conhecê-lo",
          "Onde mora"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "nice",
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
          "Ao se apresentar",
          "Ao dormir",
          "Ao comer",
          "Ao dirigir"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Qual verbo em 'Hello, my name is Sarah'?",
        "opts": [
          "and",
          "or",
          "is",
          "the"
        ],
        "ans": 2,
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Nice to meet you too",
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
          "Qual é seu nome?",
          "Como vai?",
          "Quantos anos?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello' é:",
        "opts": [
          "Despedida",
          "Um cumprimento",
          "Pedido",
          "Agradecimento"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "To you nice meet",
          "You nice to meet",
          "Meet you nice to",
          "Nice to meet you"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa tarde",
          "Olá",
          "Bom dia",
          "Boa noite"
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
    "desc": "Aprenda transporte - vocabulário ampliado e gramática completa",
    "time": "6 MIN",
    "phrase": "Hello, my name is John",
    "translation": "Olá, meu nome é Miguel",
    "vocab": [
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Day",
        "Dia",
        "What day is today?",
        "Dia"
      ],
      [
        "Work",
        "Trabalho",
        "I work as teacher",
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
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Nice to meet you",
        "Prazer",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Atenção"
      ],
      [
        "Food",
        "Comida",
        "I like food",
        "Comida"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Transporte</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Transporte</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is John'",
        "opts": [
          "Bom dia",
          "Até logo",
          "Boa noite",
          "Olá, meu nome é Miguel"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Onde mora",
          "Quantos anos",
          "Como vai",
          "Prazer em conhecê-lo"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "good",
          "nice",
          "big",
          "bad"
        ],
        "ans": 1,
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
        "q": "Qual verbo em 'Hello, my name is John'?",
        "opts": [
          "or",
          "and",
          "the",
          "is"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Nice to meet you too",
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
          "Quantos anos?",
          "Como vai?"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "'Hello' é:",
        "opts": [
          "Agradecimento",
          "Um cumprimento",
          "Despedida",
          "Pedido"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "You nice to meet",
          "Nice to meet you",
          "Meet you nice to",
          "To you nice meet"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa tarde",
          "Bom dia",
          "Olá",
          "Boa noite"
        ],
        "ans": 1,
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
    "desc": "Aprenda comida e restaurante - vocabulário ampliado e gramática completa",
    "time": "7 MIN",
    "phrase": "Hello, my name is Mike",
    "translation": "Olá, meu nome é Miguel",
    "vocab": [
      [
        "Food",
        "Comida",
        "I like food",
        "Comida"
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
        "Resposta"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Atenção"
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
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Nice to meet you",
        "Prazer",
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
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Comida e restaurante</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Comida e restaurante</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Mike'",
        "opts": [
          "Boa noite",
          "Até logo",
          "Olá, meu nome é Miguel",
          "Bom dia"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Quantos anos",
          "Onde mora",
          "Prazer em conhecê-lo",
          "Como vai"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "bad",
          "good",
          "big",
          "nice"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Mike'?",
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
        "q": "Qual verbo em 'Hello, my name is Mike'?",
        "opts": [
          "or",
          "is",
          "the",
          "and"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Thank you",
          "Goodbye",
          "I am fine",
          "Nice to meet you too"
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
        "q": "'Hello' é:",
        "opts": [
          "Um cumprimento",
          "Agradecimento",
          "Despedida",
          "Pedido"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "Meet you nice to",
          "You nice to meet",
          "Nice to meet you",
          "To you nice meet"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Olá",
          "Bom dia",
          "Boa tarde",
          "Boa noite"
        ],
        "ans": 1,
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
    "desc": "Aprenda bebidas - vocabulário ampliado e gramática completa",
    "time": "8 MIN",
    "phrase": "Hello, my name is John",
    "translation": "Olá, meu nome é João",
    "vocab": [
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
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Nice to meet you",
        "Prazer",
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
        "Atenção"
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
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Bebidas</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Bebidas</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is John'",
        "opts": [
          "Bom dia",
          "Boa noite",
          "Olá, meu nome é João",
          "Até logo"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Quantos anos",
          "Como vai",
          "Onde mora",
          "Prazer em conhecê-lo"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "nice",
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
          "Ao dirigir",
          "Ao se apresentar",
          "Ao dormir"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Qual verbo em 'Hello, my name is John'?",
        "opts": [
          "is",
          "the",
          "and",
          "or"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Goodbye",
          "Thank you",
          "Nice to meet you too",
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
          "Como vai?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "'Hello' é:",
        "opts": [
          "Despedida",
          "Um cumprimento",
          "Pedido",
          "Agradecimento"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "You nice to meet",
          "To you nice meet",
          "Nice to meet you",
          "Meet you nice to"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Olá",
          "Bom dia",
          "Boa noite",
          "Boa tarde"
        ],
        "ans": 1,
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
    "desc": "Aprenda pedindo ajuda - vocabulário ampliado e gramática completa",
    "time": "9 MIN",
    "phrase": "Hello, my name is Sarah",
    "translation": "Olá, meu nome é Ana",
    "vocab": [
      [
        "Food",
        "Comida",
        "I like food",
        "Comida"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "Time",
        "Tempo",
        "What time is it?",
        "Hora"
      ],
      [
        "Work",
        "Trabalho",
        "I work as teacher",
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
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Day",
        "Dia",
        "What day is today?",
        "Dia"
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
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Pedindo ajuda</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Pedindo ajuda</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Sarah'",
        "opts": [
          "Até logo",
          "Olá, meu nome é Ana",
          "Bom dia",
          "Boa noite"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Quantos anos",
          "Onde mora",
          "Prazer em conhecê-lo",
          "Como vai"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "good",
          "nice",
          "big",
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
        "q": "Qual verbo em 'Hello, my name is Sarah'?",
        "opts": [
          "or",
          "is",
          "the",
          "and"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "I am fine",
          "Nice to meet you too",
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
        "q": "'Hello' é:",
        "opts": [
          "Um cumprimento",
          "Agradecimento",
          "Despedida",
          "Pedido"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "To you nice meet",
          "Nice to meet you",
          "You nice to meet",
          "Meet you nice to"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa tarde",
          "Bom dia",
          "Olá",
          "Boa noite"
        ],
        "ans": 1,
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
    "desc": "Aprenda direções simples - vocabulário ampliado e gramática completa",
    "time": "10 MIN",
    "phrase": "Hello, my name is John",
    "translation": "Olá, meu nome é Miguel",
    "vocab": [
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta"
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
        "Como está?",
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
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "Time",
        "Tempo",
        "What time is it?",
        "Hora"
      ],
      [
        "Nice to meet you",
        "Prazer",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Direções simples</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Direções simples</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is John'",
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
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Prazer em conhecê-lo",
          "Onde mora",
          "Quantos anos",
          "Como vai"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "good",
          "nice",
          "big",
          "bad"
        ],
        "ans": 1,
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
        "q": "Qual verbo em 'Hello, my name is John'?",
        "opts": [
          "the",
          "and",
          "or",
          "is"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "I am fine",
          "Thank you",
          "Nice to meet you too",
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
          "Qual é seu nome?",
          "Quantos anos?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "'Hello' é:",
        "opts": [
          "Pedido",
          "Um cumprimento",
          "Agradecimento",
          "Despedida"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "To you nice meet",
          "Meet you nice to",
          "Nice to meet you",
          "You nice to meet"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa tarde",
          "Boa noite",
          "Bom dia",
          "Olá"
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
    "desc": "Aprenda preços e dinheiro - vocabulário ampliado e gramática completa",
    "time": "11 MIN",
    "phrase": "Hello, my name is Sarah",
    "translation": "Olá, meu nome é Ana",
    "vocab": [
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
        "Food",
        "Comida",
        "I like food",
        "Comida"
      ],
      [
        "Work",
        "Trabalho",
        "I work as teacher",
        "Trabalho"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "Day",
        "Dia",
        "What day is today?",
        "Dia"
      ],
      [
        "Time",
        "Tempo",
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
        "Good evening, welcome!",
        "Chegada noite"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Preços e dinheiro</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Preços e dinheiro</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Sarah'",
        "opts": [
          "Boa noite",
          "Até logo",
          "Olá, meu nome é Ana",
          "Bom dia"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Prazer em conhecê-lo",
          "Onde mora",
          "Quantos anos",
          "Como vai"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "good",
          "nice",
          "bad",
          "big"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Sarah'?",
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
        "q": "Qual verbo em 'Hello, my name is Sarah'?",
        "opts": [
          "the",
          "is",
          "or",
          "and"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "I am fine",
          "Nice to meet you too",
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
          "Qual é seu nome?",
          "Quantos anos?",
          "Como vai?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello' é:",
        "opts": [
          "Despedida",
          "Pedido",
          "Um cumprimento",
          "Agradecimento"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "Meet you nice to",
          "Nice to meet you",
          "You nice to meet",
          "To you nice meet"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Bom dia",
          "Boa tarde",
          "Boa noite",
          "Olá"
        ],
        "ans": 0,
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
    "desc": "Aprenda roupas - vocabulário ampliado e gramática completa",
    "time": "12 MIN",
    "phrase": "Hello, my name is Mike",
    "translation": "Olá, meu nome é Miguel",
    "vocab": [
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
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ],
      [
        "How are you?",
        "Como está?",
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
        "Food",
        "Comida",
        "I like food",
        "Comida"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta"
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
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Roupas</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Roupas</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Mike'",
        "opts": [
          "Olá, meu nome é Miguel",
          "Bom dia",
          "Até logo",
          "Boa noite"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Prazer em conhecê-lo",
          "Quantos anos",
          "Onde mora",
          "Como vai"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "big",
          "bad",
          "good",
          "nice"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Mike'?",
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
        "q": "Qual verbo em 'Hello, my name is Mike'?",
        "opts": [
          "is",
          "or",
          "the",
          "and"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Thank you",
          "Goodbye",
          "Nice to meet you too",
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
        "q": "'Hello' é:",
        "opts": [
          "Pedido",
          "Agradecimento",
          "Um cumprimento",
          "Despedida"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "You nice to meet",
          "Meet you nice to",
          "Nice to meet you",
          "To you nice meet"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa tarde",
          "Olá",
          "Bom dia",
          "Boa noite"
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
    "desc": "Aprenda saúde básica - vocabulário ampliado e gramática completa",
    "time": "13 MIN",
    "phrase": "Hello, my name is Sarah",
    "translation": "Olá, meu nome é Miguel",
    "vocab": [
      [
        "Work",
        "Trabalho",
        "I work as teacher",
        "Trabalho"
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
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Atenção"
      ],
      [
        "Time",
        "Tempo",
        "What time is it?",
        "Hora"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "How are you?",
        "Como está?",
        "How are you today?",
        "Bem-estar"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Saúde básica</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Saúde básica</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Sarah'",
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
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Prazer em conhecê-lo",
          "Onde mora",
          "Como vai",
          "Quantos anos"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "good",
          "bad",
          "nice",
          "big"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Sarah'?",
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
        "q": "Qual verbo em 'Hello, my name is Sarah'?",
        "opts": [
          "the",
          "or",
          "is",
          "and"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "I am fine",
          "Goodbye",
          "Nice to meet you too",
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
        "q": "'Hello' é:",
        "opts": [
          "Pedido",
          "Um cumprimento",
          "Despedida",
          "Agradecimento"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "To you nice meet",
          "You nice to meet",
          "Nice to meet you",
          "Meet you nice to"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa tarde",
          "Bom dia",
          "Olá",
          "Boa noite"
        ],
        "ans": 1,
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
    "desc": "Aprenda emoções - vocabulário ampliado e gramática completa",
    "time": "6 MIN",
    "phrase": "Hello, my name is Mike",
    "translation": "Olá, meu nome é Sarah",
    "vocab": [
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
        "Excuse me, where is...?",
        "Atenção"
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
        "Resposta"
      ],
      [
        "Time",
        "Tempo",
        "What time is it?",
        "Hora"
      ],
      [
        "Nice to meet you",
        "Prazer",
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
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Emoções</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Emoções</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Mike'",
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
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Onde mora",
          "Como vai",
          "Quantos anos",
          "Prazer em conhecê-lo"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "bad",
          "nice",
          "good",
          "big"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Mike'?",
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
        "q": "Qual verbo em 'Hello, my name is Mike'?",
        "opts": [
          "the",
          "or",
          "is",
          "and"
        ],
        "ans": 2,
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Goodbye",
          "Nice to meet you too",
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
        "q": "'Hello' é:",
        "opts": [
          "Agradecimento",
          "Um cumprimento",
          "Despedida",
          "Pedido"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "Meet you nice to",
          "To you nice meet",
          "Nice to meet you",
          "You nice to meet"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa tarde",
          "Olá",
          "Bom dia",
          "Boa noite"
        ],
        "ans": 2,
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
    "desc": "Aprenda convites - vocabulário ampliado e gramática completa",
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
        "Work",
        "Trabalho",
        "I work as teacher",
        "Trabalho"
      ],
      [
        "How are you?",
        "Como está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Atenção"
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
        "Time",
        "Tempo",
        "What time is it?",
        "Hora"
      ],
      [
        "Day",
        "Dia",
        "What day is today?",
        "Dia"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Convites</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Convites</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
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
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Quantos anos",
          "Onde mora",
          "Prazer em conhecê-lo",
          "Como vai"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "bad",
          "good",
          "big",
          "nice"
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
        "q": "Qual verbo em 'Hello, my name is Ana'?",
        "opts": [
          "or",
          "the",
          "and",
          "is"
        ],
        "ans": 3,
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Goodbye",
          "Nice to meet you too",
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
        "q": "'Hello' é:",
        "opts": [
          "Agradecimento",
          "Pedido",
          "Um cumprimento",
          "Despedida"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "To you nice meet",
          "You nice to meet",
          "Meet you nice to",
          "Nice to meet you"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Olá",
          "Boa noite",
          "Boa tarde",
          "Bom dia"
        ],
        "ans": 3,
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
    "desc": "Aprenda telefone - vocabulário ampliado e gramática completa",
    "time": "8 MIN",
    "phrase": "Hello, my name is Mike",
    "translation": "Olá, meu nome é João",
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
        "Work",
        "Trabalho",
        "I work as teacher",
        "Trabalho"
      ],
      [
        "Time",
        "Tempo",
        "What time is it?",
        "Hora"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Telefone</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Telefone</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Mike'",
        "opts": [
          "Bom dia",
          "Até logo",
          "Olá, meu nome é João",
          "Boa noite"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Onde mora",
          "Como vai",
          "Quantos anos",
          "Prazer em conhecê-lo"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "big",
          "bad",
          "good",
          "nice"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Mike'?",
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
        "q": "Qual verbo em 'Hello, my name is Mike'?",
        "opts": [
          "the",
          "is",
          "or",
          "and"
        ],
        "ans": 1,
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Nice to meet you too",
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
          "Qual é seu nome?",
          "Onde mora?",
          "Como vai?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello' é:",
        "opts": [
          "Agradecimento",
          "Despedida",
          "Pedido",
          "Um cumprimento"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "You nice to meet",
          "Nice to meet you",
          "To you nice meet",
          "Meet you nice to"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa tarde",
          "Olá",
          "Bom dia",
          "Boa noite"
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
    "desc": "Aprenda email e contato - vocabulário ampliado e gramática completa",
    "time": "9 MIN",
    "phrase": "Hello, my name is John",
    "translation": "Olá, meu nome é Sarah",
    "vocab": [
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Food",
        "Comida",
        "I like food",
        "Comida"
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
        "How are you?",
        "Como está?",
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
        "Time",
        "Tempo",
        "What time is it?",
        "Hora"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Atenção"
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
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Email e contato</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Email e contato</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is John'",
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
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Prazer em conhecê-lo",
          "Quantos anos",
          "Como vai",
          "Onde mora"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "nice",
          "bad",
          "good",
          "big"
        ],
        "ans": 0,
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
        "q": "Qual verbo em 'Hello, my name is John'?",
        "opts": [
          "is",
          "and",
          "the",
          "or"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "I am fine",
          "Thank you",
          "Goodbye",
          "Nice to meet you too"
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
        "q": "'Hello' é:",
        "opts": [
          "Um cumprimento",
          "Despedida",
          "Agradecimento",
          "Pedido"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "To you nice meet",
          "Nice to meet you",
          "Meet you nice to",
          "You nice to meet"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Olá",
          "Bom dia",
          "Boa noite",
          "Boa tarde"
        ],
        "ans": 1,
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
    "desc": "Aprenda planos futuros - vocabulário ampliado e gramática completa",
    "time": "10 MIN",
    "phrase": "Hello, my name is John",
    "translation": "Olá, meu nome é Ana",
    "vocab": [
      [
        "Time",
        "Tempo",
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
        "Day",
        "Dia",
        "What day is today?",
        "Dia"
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
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Planos futuros</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Planos futuros</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is John'",
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
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Onde mora",
          "Prazer em conhecê-lo",
          "Quantos anos",
          "Como vai"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "nice",
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
          "Ao se apresentar",
          "Ao dirigir",
          "Ao dormir",
          "Ao comer"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Qual verbo em 'Hello, my name is John'?",
        "opts": [
          "or",
          "the",
          "is",
          "and"
        ],
        "ans": 2,
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Thank you",
          "Nice to meet you too",
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
        "q": "'Hello' é:",
        "opts": [
          "Pedido",
          "Despedida",
          "Um cumprimento",
          "Agradecimento"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "Nice to meet you",
          "You nice to meet",
          "Meet you nice to",
          "To you nice meet"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa noite",
          "Boa tarde",
          "Olá",
          "Bom dia"
        ],
        "ans": 3,
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
    "desc": "Aprenda passado simples - vocabulário ampliado e gramática completa",
    "time": "11 MIN",
    "phrase": "Hello, my name is John",
    "translation": "Olá, meu nome é João",
    "vocab": [
      [
        "Work",
        "Trabalho",
        "I work as teacher",
        "Trabalho"
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
        "Prazer",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Day",
        "Dia",
        "What day is today?",
        "Dia"
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
        "Resposta"
      ],
      [
        "Food",
        "Comida",
        "I like food",
        "Comida"
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
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Passado simples</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Passado simples</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is John'",
        "opts": [
          "Boa noite",
          "Até logo",
          "Bom dia",
          "Olá, meu nome é João"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Onde mora",
          "Como vai",
          "Prazer em conhecê-lo",
          "Quantos anos"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "big",
          "good",
          "nice",
          "bad"
        ],
        "ans": 2,
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
        "q": "Qual verbo em 'Hello, my name is John'?",
        "opts": [
          "the",
          "and",
          "is",
          "or"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Thank you",
          "Goodbye",
          "Nice to meet you too",
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
        "q": "'Hello' é:",
        "opts": [
          "Agradecimento",
          "Despedida",
          "Pedido",
          "Um cumprimento"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "Nice to meet you",
          "To you nice meet",
          "Meet you nice to",
          "You nice to meet"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Bom dia",
          "Boa noite",
          "Olá",
          "Boa tarde"
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
    "desc": "Aprenda experiências - vocabulário ampliado e gramática completa",
    "time": "12 MIN",
    "phrase": "Hello, my name is John",
    "translation": "Olá, meu nome é Ana",
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
        "Atenção"
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
        "Resposta"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
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
        "I work as teacher",
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
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Nice to meet you",
        "Prazer",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Experiências</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Experiências</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is John'",
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
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Quantos anos",
          "Prazer em conhecê-lo",
          "Como vai",
          "Onde mora"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "big",
          "good",
          "nice",
          "bad"
        ],
        "ans": 2,
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
        "q": "Qual verbo em 'Hello, my name is John'?",
        "opts": [
          "or",
          "is",
          "the",
          "and"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Nice to meet you too",
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
          "Qual é seu nome?",
          "Como vai?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "'Hello' é:",
        "opts": [
          "Pedido",
          "Agradecimento",
          "Um cumprimento",
          "Despedida"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "To you nice meet",
          "Meet you nice to",
          "You nice to meet",
          "Nice to meet you"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Bom dia",
          "Boa noite",
          "Olá",
          "Boa tarde"
        ],
        "ans": 0,
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
    "desc": "Aprenda preferências - vocabulário ampliado e gramática completa",
    "time": "13 MIN",
    "phrase": "Hello, my name is Mike",
    "translation": "Olá, meu nome é Ana",
    "vocab": [
      [
        "Time",
        "Tempo",
        "What time is it?",
        "Hora"
      ],
      [
        "Food",
        "Comida",
        "I like food",
        "Comida"
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
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Work",
        "Trabalho",
        "I work as teacher",
        "Trabalho"
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
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Preferências</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Preferências</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Mike'",
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
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Quantos anos",
          "Prazer em conhecê-lo",
          "Como vai",
          "Onde mora"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "good",
          "bad",
          "nice",
          "big"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Mike'?",
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
        "q": "Qual verbo em 'Hello, my name is Mike'?",
        "opts": [
          "and",
          "the",
          "or",
          "is"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "I am fine",
          "Goodbye",
          "Thank you",
          "Nice to meet you too"
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
        "q": "'Hello' é:",
        "opts": [
          "Pedido",
          "Um cumprimento",
          "Agradecimento",
          "Despedida"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "You nice to meet",
          "Meet you nice to",
          "To you nice meet",
          "Nice to meet you"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Bom dia",
          "Olá",
          "Boa noite",
          "Boa tarde"
        ],
        "ans": 0,
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
    "desc": "Aprenda opiniões simples - vocabulário ampliado e gramática completa",
    "time": "6 MIN",
    "phrase": "Hello, my name is Mike",
    "translation": "Olá, meu nome é João",
    "vocab": [
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
        "Nice to meet you",
        "Prazer",
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
        "How are you?",
        "Como está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Atenção"
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
        "Resposta"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Opiniões simples</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Opiniões simples</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Mike'",
        "opts": [
          "Olá, meu nome é João",
          "Até logo",
          "Bom dia",
          "Boa noite"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Como vai",
          "Onde mora",
          "Prazer em conhecê-lo",
          "Quantos anos"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "good",
          "big",
          "nice",
          "bad"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Mike'?",
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
        "q": "Qual verbo em 'Hello, my name is Mike'?",
        "opts": [
          "and",
          "is",
          "the",
          "or"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "I am fine",
          "Nice to meet you too",
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
          "Qual é seu nome?",
          "Quantos anos?",
          "Onde mora?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello' é:",
        "opts": [
          "Um cumprimento",
          "Pedido",
          "Agradecimento",
          "Despedida"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "Nice to meet you",
          "Meet you nice to",
          "You nice to meet",
          "To you nice meet"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Bom dia",
          "Olá",
          "Boa tarde",
          "Boa noite"
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
    "desc": "Aprenda comparações - vocabulário ampliado e gramática completa",
    "time": "7 MIN",
    "phrase": "Hello, my name is Ana",
    "translation": "Olá, meu nome é João",
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
        "Nice to meet you",
        "Prazer",
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
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Work",
        "Trabalho",
        "I work as teacher",
        "Trabalho"
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
        "I like food",
        "Comida"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Comparações</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Comparações</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Ana'",
        "opts": [
          "Bom dia",
          "Olá, meu nome é João",
          "Boa noite",
          "Até logo"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Como vai",
          "Prazer em conhecê-lo",
          "Quantos anos",
          "Onde mora"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "nice",
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
          "Ao dormir",
          "Ao comer",
          "Ao se apresentar",
          "Ao dirigir"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Qual verbo em 'Hello, my name is Ana'?",
        "opts": [
          "or",
          "the",
          "and",
          "is"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Thank you",
          "Nice to meet you too",
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
        "q": "'Hello' é:",
        "opts": [
          "Agradecimento",
          "Pedido",
          "Um cumprimento",
          "Despedida"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "Nice to meet you",
          "You nice to meet",
          "Meet you nice to",
          "To you nice meet"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Bom dia",
          "Boa noite",
          "Boa tarde",
          "Olá"
        ],
        "ans": 0,
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
    "desc": "Aprenda conselhos - vocabulário ampliado e gramática completa",
    "time": "8 MIN",
    "phrase": "Hello, my name is Sarah",
    "translation": "Olá, meu nome é Sarah",
    "vocab": [
      [
        "Work",
        "Trabalho",
        "I work as teacher",
        "Trabalho"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
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
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Time",
        "Tempo",
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
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "How are you?",
        "Como está?",
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
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Conselhos</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Conselhos</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Sarah'",
        "opts": [
          "Até logo",
          "Olá, meu nome é Sarah",
          "Bom dia",
          "Boa noite"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Prazer em conhecê-lo",
          "Onde mora",
          "Quantos anos",
          "Como vai"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "bad",
          "good",
          "nice",
          "big"
        ],
        "ans": 2,
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
        "q": "Qual verbo em 'Hello, my name is Sarah'?",
        "opts": [
          "or",
          "is",
          "the",
          "and"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Goodbye",
          "Nice to meet you too",
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
          "Qual é seu nome?",
          "Como vai?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "'Hello' é:",
        "opts": [
          "Agradecimento",
          "Despedida",
          "Pedido",
          "Um cumprimento"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "Meet you nice to",
          "Nice to meet you",
          "To you nice meet",
          "You nice to meet"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Bom dia",
          "Boa tarde",
          "Boa noite",
          "Olá"
        ],
        "ans": 0,
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
    "desc": "Aprenda convite para café - vocabulário ampliado e gramática completa",
    "time": "9 MIN",
    "phrase": "Hello, my name is Mike",
    "translation": "Olá, meu nome é Ana",
    "vocab": [
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "How are you?",
        "Como está?",
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
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Atenção"
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
        "I like food",
        "Comida"
      ],
      [
        "Time",
        "Tempo",
        "What time is it?",
        "Hora"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Convite para café</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Convite para café</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Mike'",
        "opts": [
          "Boa noite",
          "Até logo",
          "Olá, meu nome é Ana",
          "Bom dia"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Quantos anos",
          "Onde mora",
          "Prazer em conhecê-lo",
          "Como vai"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "nice",
          "big",
          "bad",
          "good"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Mike'?",
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
        "q": "Qual verbo em 'Hello, my name is Mike'?",
        "opts": [
          "and",
          "the",
          "is",
          "or"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "I am fine",
          "Thank you",
          "Nice to meet you too",
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
        "q": "'Hello' é:",
        "opts": [
          "Pedido",
          "Um cumprimento",
          "Agradecimento",
          "Despedida"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "To you nice meet",
          "Nice to meet you",
          "You nice to meet",
          "Meet you nice to"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Olá",
          "Boa tarde",
          "Bom dia",
          "Boa noite"
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
    "desc": "Aprenda conhecendo vizinhos - vocabulário ampliado e gramática completa",
    "time": "10 MIN",
    "phrase": "Hello, my name is Mike",
    "translation": "Olá, meu nome é João",
    "vocab": [
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
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
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Nice to meet you",
        "Prazer",
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
        "Day",
        "Dia",
        "What day is today?",
        "Dia"
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
        "I like food",
        "Comida"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Conhecendo vizinhos</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Conhecendo vizinhos</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Mike'",
        "opts": [
          "Boa noite",
          "Olá, meu nome é João",
          "Bom dia",
          "Até logo"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Prazer em conhecê-lo",
          "Onde mora",
          "Como vai",
          "Quantos anos"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "good",
          "big",
          "nice",
          "bad"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Mike'?",
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
        "q": "Qual verbo em 'Hello, my name is Mike'?",
        "opts": [
          "is",
          "the",
          "or",
          "and"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Thank you",
          "Nice to meet you too",
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
          "Qual é seu nome?",
          "Quantos anos?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "'Hello' é:",
        "opts": [
          "Despedida",
          "Agradecimento",
          "Um cumprimento",
          "Pedido"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "To you nice meet",
          "You nice to meet",
          "Nice to meet you",
          "Meet you nice to"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Olá",
          "Boa tarde",
          "Bom dia",
          "Boa noite"
        ],
        "ans": 2,
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
    "desc": "Aprenda festa e celebração - vocabulário ampliado e gramática completa",
    "time": "11 MIN",
    "phrase": "Hello, my name is Ana",
    "translation": "Olá, meu nome é Miguel",
    "vocab": [
      [
        "Work",
        "Trabalho",
        "I work as teacher",
        "Trabalho"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta"
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
        "Excuse me, where is...?",
        "Atenção"
      ],
      [
        "How are you?",
        "Como está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Festa e celebração</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Festa e celebração</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Ana'",
        "opts": [
          "Boa noite",
          "Até logo",
          "Olá, meu nome é Miguel",
          "Bom dia"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Onde mora",
          "Prazer em conhecê-lo",
          "Quantos anos",
          "Como vai"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "big",
          "good",
          "bad",
          "nice"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Ana'?",
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
        "q": "Qual verbo em 'Hello, my name is Ana'?",
        "opts": [
          "is",
          "and",
          "or",
          "the"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Goodbye",
          "Thank you",
          "Nice to meet you too",
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
        "q": "'Hello' é:",
        "opts": [
          "Despedida",
          "Pedido",
          "Agradecimento",
          "Um cumprimento"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "You nice to meet",
          "Nice to meet you",
          "Meet you nice to",
          "To you nice meet"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Olá",
          "Boa noite",
          "Bom dia",
          "Boa tarde"
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
    "desc": "Aprenda filmes e música - vocabulário ampliado e gramática completa",
    "time": "12 MIN",
    "phrase": "Hello, my name is Sarah",
    "translation": "Olá, meu nome é Sarah",
    "vocab": [
      [
        "Day",
        "Dia",
        "What day is today?",
        "Dia"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Atenção"
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
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta"
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
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Filmes e música</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Filmes e música</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Sarah'",
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
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Prazer em conhecê-lo",
          "Quantos anos",
          "Onde mora",
          "Como vai"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "big",
          "nice",
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
          "Ao comer",
          "Ao se apresentar",
          "Ao dormir"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Qual verbo em 'Hello, my name is Sarah'?",
        "opts": [
          "is",
          "or",
          "the",
          "and"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Thank you",
          "Goodbye",
          "Nice to meet you too",
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
        "q": "'Hello' é:",
        "opts": [
          "Agradecimento",
          "Despedida",
          "Pedido",
          "Um cumprimento"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "To you nice meet",
          "Meet you nice to",
          "Nice to meet you",
          "You nice to meet"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa tarde",
          "Bom dia",
          "Boa noite",
          "Olá"
        ],
        "ans": 1,
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
    "desc": "Aprenda esportes - vocabulário ampliado e gramática completa",
    "time": "13 MIN",
    "phrase": "Hello, my name is John",
    "translation": "Olá, meu nome é Miguel",
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
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Atenção"
      ],
      [
        "Food",
        "Comida",
        "I like food",
        "Comida"
      ],
      [
        "How are you?",
        "Como está?",
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
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Esportes</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Esportes</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is John'",
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
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Onde mora",
          "Prazer em conhecê-lo",
          "Como vai",
          "Quantos anos"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "bad",
          "good",
          "nice",
          "big"
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
        "q": "Qual verbo em 'Hello, my name is John'?",
        "opts": [
          "or",
          "and",
          "the",
          "is"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Goodbye",
          "I am fine",
          "Thank you",
          "Nice to meet you too"
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
        "q": "'Hello' é:",
        "opts": [
          "Despedida",
          "Pedido",
          "Agradecimento",
          "Um cumprimento"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "Nice to meet you",
          "To you nice meet",
          "You nice to meet",
          "Meet you nice to"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa noite",
          "Olá",
          "Bom dia",
          "Boa tarde"
        ],
        "ans": 2,
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
    "desc": "Aprenda viagem curta - vocabulário ampliado e gramática completa",
    "time": "6 MIN",
    "phrase": "Hello, my name is Ana",
    "translation": "Olá, meu nome é Ana",
    "vocab": [
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Food",
        "Comida",
        "I like food",
        "Comida"
      ],
      [
        "Work",
        "Trabalho",
        "I work as teacher",
        "Trabalho"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Nice to meet you",
        "Prazer",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ],
      [
        "How are you?",
        "Como está?",
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
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Viagem curta</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Viagem curta</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
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
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Quantos anos",
          "Como vai",
          "Onde mora",
          "Prazer em conhecê-lo"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "good",
          "bad",
          "nice",
          "big"
        ],
        "ans": 2,
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
        "q": "Qual verbo em 'Hello, my name is Ana'?",
        "opts": [
          "or",
          "the",
          "is",
          "and"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Nice to meet you too",
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
        "q": "'Hello' é:",
        "opts": [
          "Um cumprimento",
          "Agradecimento",
          "Despedida",
          "Pedido"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "You nice to meet",
          "Nice to meet you",
          "To you nice meet",
          "Meet you nice to"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa noite",
          "Bom dia",
          "Olá",
          "Boa tarde"
        ],
        "ans": 1,
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
    "desc": "Aprenda cultura local - vocabulário ampliado e gramática completa",
    "time": "7 MIN",
    "phrase": "Hello, my name is Ana",
    "translation": "Olá, meu nome é Miguel",
    "vocab": [
      [
        "Time",
        "Tempo",
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
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Day",
        "Dia",
        "What day is today?",
        "Dia"
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
        "Como está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Atenção"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Cultura local</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Cultura local</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Ana'",
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
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Onde mora",
          "Quantos anos",
          "Como vai",
          "Prazer em conhecê-lo"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "bad",
          "good",
          "big",
          "nice"
        ],
        "ans": 3,
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
        "q": "Qual verbo em 'Hello, my name is Ana'?",
        "opts": [
          "the",
          "or",
          "is",
          "and"
        ],
        "ans": 2,
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "I am fine",
          "Thank you",
          "Nice to meet you too",
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
        "q": "'Hello' é:",
        "opts": [
          "Um cumprimento",
          "Despedida",
          "Agradecimento",
          "Pedido"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "Meet you nice to",
          "Nice to meet you",
          "To you nice meet",
          "You nice to meet"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa tarde",
          "Bom dia",
          "Olá",
          "Boa noite"
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
    "title": "Olá e apresentações",
    "desc": "Aprenda olá e apresentações - vocabulário ampliado e gramática completa",
    "time": "8 MIN",
    "phrase": "Hello, my name is John",
    "translation": "Olá, meu nome é Miguel",
    "vocab": [
      [
        "How are you?",
        "Como está?",
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
        "Time",
        "Tempo",
        "What time is it?",
        "Hora"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Atenção"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta"
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
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Olá e apresentações</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Olá e apresentações</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is John'",
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
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Quantos anos",
          "Onde mora",
          "Prazer em conhecê-lo",
          "Como vai"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "nice",
          "big",
          "good",
          "bad"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is John'?",
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
        "q": "Qual verbo em 'Hello, my name is John'?",
        "opts": [
          "or",
          "is",
          "the",
          "and"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Nice to meet you too",
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
          "Qual é seu nome?",
          "Quantos anos?",
          "Onde mora?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello' é:",
        "opts": [
          "Um cumprimento",
          "Agradecimento",
          "Despedida",
          "Pedido"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "Meet you nice to",
          "To you nice meet",
          "You nice to meet",
          "Nice to meet you"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa tarde",
          "Boa noite",
          "Olá",
          "Bom dia"
        ],
        "ans": 3,
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
    "desc": "Aprenda dizendo seu nome - vocabulário ampliado e gramática completa",
    "time": "9 MIN",
    "phrase": "Hello, my name is Ana",
    "translation": "Olá, meu nome é Ana",
    "vocab": [
      [
        "Food",
        "Comida",
        "I like food",
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
        "Tempo",
        "What time is it?",
        "Hora"
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
        "How are you?",
        "Como está?",
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
        "Work",
        "Trabalho",
        "I work as teacher",
        "Trabalho"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Dizendo seu nome</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Dizendo seu nome</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Ana'",
        "opts": [
          "Até logo",
          "Olá, meu nome é Ana",
          "Bom dia",
          "Boa noite"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Onde mora",
          "Como vai",
          "Quantos anos",
          "Prazer em conhecê-lo"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "bad",
          "nice",
          "good",
          "big"
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
        "q": "Qual verbo em 'Hello, my name is Ana'?",
        "opts": [
          "or",
          "and",
          "is",
          "the"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Thank you",
          "I am fine",
          "Goodbye",
          "Nice to meet you too"
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
        "q": "'Hello' é:",
        "opts": [
          "Agradecimento",
          "Despedida",
          "Um cumprimento",
          "Pedido"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "Meet you nice to",
          "To you nice meet",
          "Nice to meet you",
          "You nice to meet"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Olá",
          "Boa tarde",
          "Boa noite",
          "Bom dia"
        ],
        "ans": 3,
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
    "desc": "Aprenda de onde você é - vocabulário ampliado e gramática completa",
    "time": "10 MIN",
    "phrase": "Hello, my name is Ana",
    "translation": "Olá, meu nome é Sarah",
    "vocab": [
      [
        "Day",
        "Dia",
        "What day is today?",
        "Dia"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
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
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: De onde você é</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: De onde você é</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Ana'",
        "opts": [
          "Até logo",
          "Olá, meu nome é Sarah",
          "Bom dia",
          "Boa noite"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Como vai",
          "Onde mora",
          "Prazer em conhecê-lo",
          "Quantos anos"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "good",
          "bad",
          "big",
          "nice"
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
        "q": "Qual verbo em 'Hello, my name is Ana'?",
        "opts": [
          "the",
          "and",
          "is",
          "or"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "I am fine",
          "Goodbye",
          "Thank you",
          "Nice to meet you too"
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
        "q": "'Hello' é:",
        "opts": [
          "Um cumprimento",
          "Agradecimento",
          "Pedido",
          "Despedida"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "You nice to meet",
          "Nice to meet you",
          "Meet you nice to",
          "To you nice meet"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa noite",
          "Boa tarde",
          "Bom dia",
          "Olá"
        ],
        "ans": 2,
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
    "desc": "Aprenda perguntando o nome - vocabulário ampliado e gramática completa",
    "time": "11 MIN",
    "phrase": "Hello, my name is John",
    "translation": "Olá, meu nome é João",
    "vocab": [
      [
        "Work",
        "Trabalho",
        "I work as teacher",
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
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta"
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
        "How are you?",
        "Como está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Nice to meet you",
        "Prazer",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Perguntando o nome</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Perguntando o nome</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is John'",
        "opts": [
          "Boa noite",
          "Até logo",
          "Bom dia",
          "Olá, meu nome é João"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Prazer em conhecê-lo",
          "Como vai",
          "Quantos anos",
          "Onde mora"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "nice",
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
          "Ao dormir",
          "Ao comer",
          "Ao se apresentar"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Qual verbo em 'Hello, my name is John'?",
        "opts": [
          "is",
          "or",
          "the",
          "and"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Nice to meet you too",
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
        "q": "'Hello' é:",
        "opts": [
          "Agradecimento",
          "Despedida",
          "Pedido",
          "Um cumprimento"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "You nice to meet",
          "Meet you nice to",
          "Nice to meet you",
          "To you nice meet"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa noite",
          "Bom dia",
          "Olá",
          "Boa tarde"
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
    "desc": "Aprenda idade e aniversário - vocabulário ampliado e gramática completa",
    "time": "12 MIN",
    "phrase": "Hello, my name is Sarah",
    "translation": "Olá, meu nome é Ana",
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
        "Excuse me, where is...?",
        "Atenção"
      ],
      [
        "Time",
        "Tempo",
        "What time is it?",
        "Hora"
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
        "Food",
        "Comida",
        "I like food",
        "Comida"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Idade e aniversário</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Idade e aniversário</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Sarah'",
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
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Onde mora",
          "Quantos anos",
          "Prazer em conhecê-lo",
          "Como vai"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "big",
          "good",
          "bad",
          "nice"
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
        "q": "Qual verbo em 'Hello, my name is Sarah'?",
        "opts": [
          "or",
          "and",
          "is",
          "the"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Thank you",
          "Nice to meet you too",
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
        "q": "'Hello' é:",
        "opts": [
          "Um cumprimento",
          "Pedido",
          "Despedida",
          "Agradecimento"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "You nice to meet",
          "Meet you nice to",
          "To you nice meet",
          "Nice to meet you"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Bom dia",
          "Boa noite",
          "Boa tarde",
          "Olá"
        ],
        "ans": 0,
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
    "desc": "Aprenda família básica - vocabulário ampliado e gramática completa",
    "time": "13 MIN",
    "phrase": "Hello, my name is John",
    "translation": "Olá, meu nome é Miguel",
    "vocab": [
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "How are you?",
        "Como está?",
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
        "Work",
        "Trabalho",
        "I work as teacher",
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
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Família básica</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Família básica</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is John'",
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
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Onde mora",
          "Prazer em conhecê-lo",
          "Como vai",
          "Quantos anos"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "bad",
          "big",
          "good",
          "nice"
        ],
        "ans": 3,
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
        "q": "Qual verbo em 'Hello, my name is John'?",
        "opts": [
          "is",
          "the",
          "or",
          "and"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Goodbye",
          "Nice to meet you too",
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
        "q": "'Hello' é:",
        "opts": [
          "Despedida",
          "Agradecimento",
          "Pedido",
          "Um cumprimento"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "To you nice meet",
          "You nice to meet",
          "Meet you nice to",
          "Nice to meet you"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa tarde",
          "Olá",
          "Bom dia",
          "Boa noite"
        ],
        "ans": 2,
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
    "desc": "Aprenda cumprimentos formais - vocabulário ampliado e gramática completa",
    "time": "6 MIN",
    "phrase": "Hello, my name is Ana",
    "translation": "Olá, meu nome é Ana",
    "vocab": [
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
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta"
      ],
      [
        "How are you?",
        "Como está?",
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
        "Food",
        "Comida",
        "I like food",
        "Comida"
      ],
      [
        "Work",
        "Trabalho",
        "I work as teacher",
        "Trabalho"
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
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Nice to meet you",
        "Prazer",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Cumprimentos formais</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Cumprimentos formais</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
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
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Onde mora",
          "Quantos anos",
          "Como vai",
          "Prazer em conhecê-lo"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "big",
          "good",
          "nice",
          "bad"
        ],
        "ans": 2,
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
        "q": "Qual verbo em 'Hello, my name is Ana'?",
        "opts": [
          "the",
          "or",
          "and",
          "is"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "I am fine",
          "Goodbye",
          "Nice to meet you too",
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
        "q": "'Hello' é:",
        "opts": [
          "Despedida",
          "Pedido",
          "Um cumprimento",
          "Agradecimento"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "You nice to meet",
          "Nice to meet you",
          "To you nice meet",
          "Meet you nice to"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Olá",
          "Boa noite",
          "Boa tarde",
          "Bom dia"
        ],
        "ans": 3,
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
    "desc": "Aprenda despedidas - vocabulário ampliado e gramática completa",
    "time": "7 MIN",
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
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "Day",
        "Dia",
        "What day is today?",
        "Dia"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Time",
        "Tempo",
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
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Food",
        "Comida",
        "I like food",
        "Comida"
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
        "Resposta"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Despedidas</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Despedidas</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Sarah'",
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
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Onde mora",
          "Prazer em conhecê-lo",
          "Como vai",
          "Quantos anos"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "good",
          "big",
          "nice",
          "bad"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Sarah'?",
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
        "q": "Qual verbo em 'Hello, my name is Sarah'?",
        "opts": [
          "or",
          "is",
          "and",
          "the"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "I am fine",
          "Thank you",
          "Nice to meet you too",
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
        "q": "'Hello' é:",
        "opts": [
          "Um cumprimento",
          "Despedida",
          "Agradecimento",
          "Pedido"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "To you nice meet",
          "Nice to meet you",
          "You nice to meet",
          "Meet you nice to"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Olá",
          "Bom dia",
          "Boa tarde",
          "Boa noite"
        ],
        "ans": 1,
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
    "desc": "Aprenda como você está - vocabulário ampliado e gramática completa",
    "time": "8 MIN",
    "phrase": "Hello, my name is Mike",
    "translation": "Olá, meu nome é Ana",
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
        "Atenção"
      ],
      [
        "Food",
        "Comida",
        "I like food",
        "Comida"
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
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Time",
        "Tempo",
        "What time is it?",
        "Hora"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Como você está</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Como você está</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Mike'",
        "opts": [
          "Boa noite",
          "Olá, meu nome é Ana",
          "Bom dia",
          "Até logo"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Quantos anos",
          "Prazer em conhecê-lo",
          "Onde mora",
          "Como vai"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "big",
          "good",
          "bad",
          "nice"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Mike'?",
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
        "q": "Qual verbo em 'Hello, my name is Mike'?",
        "opts": [
          "is",
          "the",
          "or",
          "and"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "I am fine",
          "Goodbye",
          "Nice to meet you too",
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
        "q": "'Hello' é:",
        "opts": [
          "Despedida",
          "Pedido",
          "Um cumprimento",
          "Agradecimento"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "To you nice meet",
          "Meet you nice to",
          "You nice to meet",
          "Nice to meet you"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Bom dia",
          "Boa tarde",
          "Boa noite",
          "Olá"
        ],
        "ans": 0,
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
    "desc": "Aprenda números e telefone - vocabulário ampliado e gramática completa",
    "time": "9 MIN",
    "phrase": "Hello, my name is Ana",
    "translation": "Olá, meu nome é Ana",
    "vocab": [
      [
        "Nice to meet you",
        "Prazer",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Atenção"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta"
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
        "Good morning, everyone!",
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
        "Food",
        "Comida",
        "I like food",
        "Comida"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Números e telefone</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Números e telefone</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
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
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Prazer em conhecê-lo",
          "Como vai",
          "Quantos anos",
          "Onde mora"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "good",
          "big",
          "bad",
          "nice"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Ana'?",
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
        "q": "Qual verbo em 'Hello, my name is Ana'?",
        "opts": [
          "and",
          "is",
          "or",
          "the"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "I am fine",
          "Nice to meet you too",
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
          "Qual é seu nome?",
          "Onde mora?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "'Hello' é:",
        "opts": [
          "Despedida",
          "Um cumprimento",
          "Agradecimento",
          "Pedido"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "You nice to meet",
          "Nice to meet you",
          "Meet you nice to",
          "To you nice meet"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa tarde",
          "Boa noite",
          "Olá",
          "Bom dia"
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
    "desc": "Aprenda endereço e cidade - vocabulário ampliado e gramática completa",
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
        "How are you?",
        "Como está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Atenção"
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
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Day",
        "Dia",
        "What day is today?",
        "Dia"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta"
      ],
      [
        "Food",
        "Comida",
        "I like food",
        "Comida"
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
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Endereço e cidade</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Endereço e cidade</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
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
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Quantos anos",
          "Prazer em conhecê-lo",
          "Como vai",
          "Onde mora"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "good",
          "bad",
          "nice",
          "big"
        ],
        "ans": 2,
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
        "q": "Qual verbo em 'Hello, my name is Ana'?",
        "opts": [
          "and",
          "or",
          "the",
          "is"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Thank you",
          "I am fine",
          "Goodbye",
          "Nice to meet you too"
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
        "q": "'Hello' é:",
        "opts": [
          "Agradecimento",
          "Despedida",
          "Um cumprimento",
          "Pedido"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "Meet you nice to",
          "Nice to meet you",
          "You nice to meet",
          "To you nice meet"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa tarde",
          "Boa noite",
          "Olá",
          "Bom dia"
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
    "desc": "Aprenda profissão simples - vocabulário ampliado e gramática completa",
    "time": "11 MIN",
    "phrase": "Hello, my name is Mike",
    "translation": "Olá, meu nome é Sarah",
    "vocab": [
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "Time",
        "Tempo",
        "What time is it?",
        "Hora"
      ],
      [
        "Work",
        "Trabalho",
        "I work as teacher",
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
        "Food",
        "Comida",
        "I like food",
        "Comida"
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
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Profissão simples</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Profissão simples</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Mike'",
        "opts": [
          "Até logo",
          "Bom dia",
          "Boa noite",
          "Olá, meu nome é Sarah"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Como vai",
          "Quantos anos",
          "Onde mora",
          "Prazer em conhecê-lo"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "good",
          "bad",
          "big",
          "nice"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Mike'?",
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
        "q": "Qual verbo em 'Hello, my name is Mike'?",
        "opts": [
          "and",
          "is",
          "or",
          "the"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Thank you",
          "Nice to meet you too",
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
        "q": "'Hello' é:",
        "opts": [
          "Um cumprimento",
          "Agradecimento",
          "Despedida",
          "Pedido"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "You nice to meet",
          "Meet you nice to",
          "Nice to meet you",
          "To you nice meet"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Olá",
          "Boa noite",
          "Boa tarde",
          "Bom dia"
        ],
        "ans": 3,
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
    "desc": "Aprenda hobbies favoritos - vocabulário ampliado e gramática completa",
    "time": "12 MIN",
    "phrase": "Hello, my name is Sarah",
    "translation": "Olá, meu nome é Miguel",
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
        "Resposta"
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
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Atenção"
      ],
      [
        "Time",
        "Tempo",
        "What time is it?",
        "Hora"
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
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Hobbies favoritos</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Hobbies favoritos</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Sarah'",
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
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Onde mora",
          "Prazer em conhecê-lo",
          "Como vai",
          "Quantos anos"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "big",
          "bad",
          "nice",
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
        "q": "Qual verbo em 'Hello, my name is Sarah'?",
        "opts": [
          "and",
          "is",
          "or",
          "the"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Nice to meet you too",
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
          "Qual é seu nome?",
          "Quantos anos?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "'Hello' é:",
        "opts": [
          "Pedido",
          "Despedida",
          "Um cumprimento",
          "Agradecimento"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "To you nice meet",
          "Nice to meet you",
          "Meet you nice to",
          "You nice to meet"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Olá",
          "Boa tarde",
          "Boa noite",
          "Bom dia"
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
    "desc": "Aprenda comida favorita - vocabulário ampliado e gramática completa",
    "time": "13 MIN",
    "phrase": "Hello, my name is Sarah",
    "translation": "Olá, meu nome é João",
    "vocab": [
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
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
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Food",
        "Comida",
        "I like food",
        "Comida"
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
        "I work as teacher",
        "Trabalho"
      ],
      [
        "How are you?",
        "Como está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Time",
        "Tempo",
        "What time is it?",
        "Hora"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Atenção"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Comida favorita</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Comida favorita</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Sarah'",
        "opts": [
          "Boa noite",
          "Bom dia",
          "Até logo",
          "Olá, meu nome é João"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Prazer em conhecê-lo",
          "Quantos anos",
          "Onde mora",
          "Como vai"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "bad",
          "good",
          "big",
          "nice"
        ],
        "ans": 3,
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
        "q": "Qual verbo em 'Hello, my name is Sarah'?",
        "opts": [
          "is",
          "the",
          "and",
          "or"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "I am fine",
          "Goodbye",
          "Nice to meet you too",
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
        "q": "'Hello' é:",
        "opts": [
          "Um cumprimento",
          "Despedida",
          "Pedido",
          "Agradecimento"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "Meet you nice to",
          "Nice to meet you",
          "You nice to meet",
          "To you nice meet"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Olá",
          "Bom dia",
          "Boa noite",
          "Boa tarde"
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
    "desc": "Aprenda cores favoritas - vocabulário ampliado e gramática completa",
    "time": "6 MIN",
    "phrase": "Hello, my name is Sarah",
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
        "Resposta"
      ],
      [
        "Nice to meet you",
        "Prazer",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Time",
        "Tempo",
        "What time is it?",
        "Hora"
      ],
      [
        "Day",
        "Dia",
        "What day is today?",
        "Dia"
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
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Cores favoritas</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Cores favoritas</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Sarah'",
        "opts": [
          "Até logo",
          "Boa noite",
          "Bom dia",
          "Olá, meu nome é Ana"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Como vai",
          "Prazer em conhecê-lo",
          "Quantos anos",
          "Onde mora"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "nice",
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
          "Ao dormir",
          "Ao se apresentar",
          "Ao dirigir",
          "Ao comer"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Qual verbo em 'Hello, my name is Sarah'?",
        "opts": [
          "or",
          "the",
          "and",
          "is"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Thank you",
          "I am fine",
          "Goodbye",
          "Nice to meet you too"
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
        "q": "'Hello' é:",
        "opts": [
          "Agradecimento",
          "Pedido",
          "Despedida",
          "Um cumprimento"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "Meet you nice to",
          "You nice to meet",
          "To you nice meet",
          "Nice to meet you"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Bom dia",
          "Olá",
          "Boa tarde",
          "Boa noite"
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
    "title": "Tempo e clima",
    "desc": "Aprenda tempo e clima - vocabulário ampliado e gramática completa",
    "time": "7 MIN",
    "phrase": "Hello, my name is Sarah",
    "translation": "Olá, meu nome é Ana",
    "vocab": [
      [
        "Food",
        "Comida",
        "I like food",
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
        "Good evening, welcome!",
        "Chegada noite"
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
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "How are you?",
        "Como está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Atenção"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "Nice to meet you",
        "Prazer",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Tempo e clima</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Tempo e clima</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Sarah'",
        "opts": [
          "Boa noite",
          "Olá, meu nome é Ana",
          "Bom dia",
          "Até logo"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Onde mora",
          "Como vai",
          "Prazer em conhecê-lo",
          "Quantos anos"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "bad",
          "good",
          "big",
          "nice"
        ],
        "ans": 3,
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
        "q": "Qual verbo em 'Hello, my name is Sarah'?",
        "opts": [
          "and",
          "or",
          "is",
          "the"
        ],
        "ans": 2,
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Thank you",
          "Nice to meet you too",
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
          "Como vai?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "'Hello' é:",
        "opts": [
          "Um cumprimento",
          "Pedido",
          "Despedida",
          "Agradecimento"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "Nice to meet you",
          "To you nice meet",
          "Meet you nice to",
          "You nice to meet"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Bom dia",
          "Olá",
          "Boa tarde",
          "Boa noite"
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
    "desc": "Aprenda dias da semana - vocabulário ampliado e gramática completa",
    "time": "8 MIN",
    "phrase": "Hello, my name is Mike",
    "translation": "Olá, meu nome é Sarah",
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
        "Work",
        "Trabalho",
        "I work as teacher",
        "Trabalho"
      ],
      [
        "How are you?",
        "Como está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Nice to meet you",
        "Prazer",
        "Nice to meet you, John!",
        "Conhecer alguém"
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
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Dias da semana</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Dias da semana</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Mike'",
        "opts": [
          "Olá, meu nome é Sarah",
          "Bom dia",
          "Boa noite",
          "Até logo"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Onde mora",
          "Como vai",
          "Quantos anos",
          "Prazer em conhecê-lo"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "bad",
          "big",
          "nice",
          "good"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Mike'?",
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
        "q": "Qual verbo em 'Hello, my name is Mike'?",
        "opts": [
          "is",
          "the",
          "and",
          "or"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Nice to meet you too",
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
          "Qual é seu nome?",
          "Quantos anos?",
          "Onde mora?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello' é:",
        "opts": [
          "Pedido",
          "Um cumprimento",
          "Agradecimento",
          "Despedida"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "You nice to meet",
          "To you nice meet",
          "Nice to meet you",
          "Meet you nice to"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa noite",
          "Olá",
          "Boa tarde",
          "Bom dia"
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
    "title": "Horas e compromissos",
    "desc": "Aprenda horas e compromissos - vocabulário ampliado e gramática completa",
    "time": "9 MIN",
    "phrase": "Hello, my name is Sarah",
    "translation": "Olá, meu nome é Sarah",
    "vocab": [
      [
        "Day",
        "Dia",
        "What day is today?",
        "Dia"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta"
      ],
      [
        "Food",
        "Comida",
        "I like food",
        "Comida"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Time",
        "Tempo",
        "What time is it?",
        "Hora"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Atenção"
      ],
      [
        "How are you?",
        "Como está?",
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
        "Nice to meet you",
        "Prazer",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Horas e compromissos</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Horas e compromissos</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
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
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Quantos anos",
          "Como vai",
          "Onde mora",
          "Prazer em conhecê-lo"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "good",
          "big",
          "nice",
          "bad"
        ],
        "ans": 2,
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
        "q": "Qual verbo em 'Hello, my name is Sarah'?",
        "opts": [
          "the",
          "is",
          "or",
          "and"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Nice to meet you too",
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
          "Como vai?",
          "Onde mora?",
          "Quantos anos?"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "'Hello' é:",
        "opts": [
          "Despedida",
          "Pedido",
          "Agradecimento",
          "Um cumprimento"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "You nice to meet",
          "To you nice meet",
          "Meet you nice to",
          "Nice to meet you"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa tarde",
          "Boa noite",
          "Bom dia",
          "Olá"
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
    "title": "Família estendida",
    "desc": "Aprenda família estendida - vocabulário ampliado e gramática completa",
    "time": "10 MIN",
    "phrase": "Hello, my name is Sarah",
    "translation": "Olá, meu nome é Miguel",
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
        "Resposta"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Atenção"
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
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Família estendida</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Família estendida</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Sarah'",
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
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Onde mora",
          "Prazer em conhecê-lo",
          "Quantos anos",
          "Como vai"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "bad",
          "nice",
          "good",
          "big"
        ],
        "ans": 1,
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
        "q": "Qual verbo em 'Hello, my name is Sarah'?",
        "opts": [
          "is",
          "or",
          "and",
          "the"
        ],
        "ans": 0,
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Goodbye",
          "Nice to meet you too",
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
          "Quantos anos?",
          "Como vai?"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "'Hello' é:",
        "opts": [
          "Despedida",
          "Um cumprimento",
          "Pedido",
          "Agradecimento"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "Nice to meet you",
          "You nice to meet",
          "To you nice meet",
          "Meet you nice to"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Bom dia",
          "Boa noite",
          "Olá",
          "Boa tarde"
        ],
        "ans": 0,
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
    "desc": "Aprenda casa e moradia - vocabulário ampliado e gramática completa",
    "time": "11 MIN",
    "phrase": "Hello, my name is Sarah",
    "translation": "Olá, meu nome é Ana",
    "vocab": [
      [
        "Day",
        "Dia",
        "What day is today?",
        "Dia"
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
        "I work as teacher",
        "Trabalho"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Atenção"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
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
        "Nice to meet you",
        "Prazer",
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
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Casa e moradia</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Casa e moradia</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Sarah'",
        "opts": [
          "Boa noite",
          "Olá, meu nome é Ana",
          "Bom dia",
          "Até logo"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Quantos anos",
          "Como vai",
          "Prazer em conhecê-lo",
          "Onde mora"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "bad",
          "nice",
          "good",
          "big"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Sarah'?",
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
        "q": "Qual verbo em 'Hello, my name is Sarah'?",
        "opts": [
          "or",
          "the",
          "and",
          "is"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Thank you",
          "Goodbye",
          "Nice to meet you too",
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
        "q": "'Hello' é:",
        "opts": [
          "Pedido",
          "Despedida",
          "Agradecimento",
          "Um cumprimento"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "You nice to meet",
          "Meet you nice to",
          "To you nice meet",
          "Nice to meet you"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa tarde",
          "Olá",
          "Boa noite",
          "Bom dia"
        ],
        "ans": 3,
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
    "desc": "Aprenda rotina matinal - vocabulário ampliado e gramática completa",
    "time": "12 MIN",
    "phrase": "Hello, my name is Sarah",
    "translation": "Olá, meu nome é Sarah",
    "vocab": [
      [
        "Day",
        "Dia",
        "What day is today?",
        "Dia"
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
        "I work as teacher",
        "Trabalho"
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
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta"
      ],
      [
        "Nice to meet you",
        "Prazer",
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
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Rotina matinal</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Rotina matinal</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
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
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Quantos anos",
          "Como vai",
          "Prazer em conhecê-lo",
          "Onde mora"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "good",
          "bad",
          "big",
          "nice"
        ],
        "ans": 3,
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
        "q": "Qual verbo em 'Hello, my name is Sarah'?",
        "opts": [
          "the",
          "and",
          "or",
          "is"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Goodbye",
          "Nice to meet you too",
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
        "q": "'Hello' é:",
        "opts": [
          "Pedido",
          "Um cumprimento",
          "Despedida",
          "Agradecimento"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "Nice to meet you",
          "To you nice meet",
          "Meet you nice to",
          "You nice to meet"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Olá",
          "Boa noite",
          "Bom dia",
          "Boa tarde"
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
    "desc": "Aprenda rotina noturna - vocabulário ampliado e gramática completa",
    "time": "13 MIN",
    "phrase": "Hello, my name is Mike",
    "translation": "Olá, meu nome é Miguel",
    "vocab": [
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta"
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
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "How are you?",
        "Como está?",
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
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Atenção"
      ],
      [
        "Nice to meet you",
        "Prazer",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Rotina noturna</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Rotina noturna</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Mike'",
        "opts": [
          "Bom dia",
          "Olá, meu nome é Miguel",
          "Até logo",
          "Boa noite"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Prazer em conhecê-lo",
          "Como vai",
          "Onde mora",
          "Quantos anos"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "bad",
          "good",
          "big",
          "nice"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Mike'?",
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
        "q": "Qual verbo em 'Hello, my name is Mike'?",
        "opts": [
          "or",
          "the",
          "is",
          "and"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Nice to meet you too",
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
          "Onde mora?",
          "Quantos anos?"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "'Hello' é:",
        "opts": [
          "Despedida",
          "Agradecimento",
          "Um cumprimento",
          "Pedido"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "To you nice meet",
          "Meet you nice to",
          "Nice to meet you",
          "You nice to meet"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa tarde",
          "Bom dia",
          "Olá",
          "Boa noite"
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
    "desc": "Aprenda fim de semana - vocabulário ampliado e gramática completa",
    "time": "6 MIN",
    "phrase": "Hello, my name is John",
    "translation": "Olá, meu nome é João",
    "vocab": [
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ],
      [
        "Time",
        "Tempo",
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
        "How are you?",
        "Como está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Food",
        "Comida",
        "I like food",
        "Comida"
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
        "Resposta"
      ],
      [
        "Day",
        "Dia",
        "What day is today?",
        "Dia"
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
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Fim de semana</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Fim de semana</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is John'",
        "opts": [
          "Olá, meu nome é João",
          "Boa noite",
          "Até logo",
          "Bom dia"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Quantos anos",
          "Onde mora",
          "Como vai",
          "Prazer em conhecê-lo"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "nice",
          "big",
          "good",
          "bad"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is John'?",
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
        "q": "Qual verbo em 'Hello, my name is John'?",
        "opts": [
          "or",
          "and",
          "the",
          "is"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Nice to meet you too",
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
        "q": "'Hello' é:",
        "opts": [
          "Agradecimento",
          "Um cumprimento",
          "Pedido",
          "Despedida"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "Nice to meet you",
          "You nice to meet",
          "Meet you nice to",
          "To you nice meet"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Olá",
          "Boa noite",
          "Bom dia",
          "Boa tarde"
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
    "desc": "Aprenda compras básicas - vocabulário ampliado e gramática completa",
    "time": "7 MIN",
    "phrase": "Hello, my name is John",
    "translation": "Olá, meu nome é Ana",
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
        "Nice to meet you",
        "Prazer",
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
        "Work",
        "Trabalho",
        "I work as teacher",
        "Trabalho"
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
        "Excuse me, where is...?",
        "Atenção"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta"
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
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Compras básicas</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Compras básicas</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is John'",
        "opts": [
          "Até logo",
          "Boa noite",
          "Bom dia",
          "Olá, meu nome é Ana"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Onde mora",
          "Como vai",
          "Prazer em conhecê-lo",
          "Quantos anos"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "bad",
          "big",
          "good",
          "nice"
        ],
        "ans": 3,
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
        "q": "Qual verbo em 'Hello, my name is John'?",
        "opts": [
          "and",
          "the",
          "is",
          "or"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Goodbye",
          "I am fine",
          "Thank you",
          "Nice to meet you too"
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
        "q": "'Hello' é:",
        "opts": [
          "Despedida",
          "Um cumprimento",
          "Agradecimento",
          "Pedido"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "To you nice meet",
          "Nice to meet you",
          "You nice to meet",
          "Meet you nice to"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Olá",
          "Bom dia",
          "Boa noite",
          "Boa tarde"
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
    "title": "Transporte",
    "desc": "Aprenda transporte - vocabulário ampliado e gramática completa",
    "time": "8 MIN",
    "phrase": "Hello, my name is Sarah",
    "translation": "Olá, meu nome é João",
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
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta"
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
        "Nice to meet you",
        "Prazer",
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
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Transporte</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Transporte</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Sarah'",
        "opts": [
          "Boa noite",
          "Até logo",
          "Olá, meu nome é João",
          "Bom dia"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Como vai",
          "Onde mora",
          "Prazer em conhecê-lo",
          "Quantos anos"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "nice",
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
          "Ao dormir",
          "Ao se apresentar",
          "Ao comer",
          "Ao dirigir"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Qual verbo em 'Hello, my name is Sarah'?",
        "opts": [
          "is",
          "the",
          "or",
          "and"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Thank you",
          "Nice to meet you too",
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
          "Qual é seu nome?",
          "Onde mora?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "'Hello' é:",
        "opts": [
          "Despedida",
          "Pedido",
          "Agradecimento",
          "Um cumprimento"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "You nice to meet",
          "Nice to meet you",
          "Meet you nice to",
          "To you nice meet"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Olá",
          "Boa tarde",
          "Boa noite",
          "Bom dia"
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
    "desc": "Aprenda comida e restaurante - vocabulário ampliado e gramática completa",
    "time": "9 MIN",
    "phrase": "Hello, my name is Ana",
    "translation": "Olá, meu nome é João",
    "vocab": [
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
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Time",
        "Tempo",
        "What time is it?",
        "Hora"
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
        "I work as teacher",
        "Trabalho"
      ],
      [
        "Nice to meet you",
        "Prazer",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Day",
        "Dia",
        "What day is today?",
        "Dia"
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
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Comida e restaurante</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Comida e restaurante</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Ana'",
        "opts": [
          "Bom dia",
          "Olá, meu nome é João",
          "Boa noite",
          "Até logo"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Quantos anos",
          "Prazer em conhecê-lo",
          "Como vai",
          "Onde mora"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "big",
          "nice",
          "bad",
          "good"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Ana'?",
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
        "q": "Qual verbo em 'Hello, my name is Ana'?",
        "opts": [
          "and",
          "or",
          "the",
          "is"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Nice to meet you too",
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
        "q": "'Hello' é:",
        "opts": [
          "Agradecimento",
          "Despedida",
          "Um cumprimento",
          "Pedido"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "You nice to meet",
          "To you nice meet",
          "Meet you nice to",
          "Nice to meet you"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa noite",
          "Boa tarde",
          "Bom dia",
          "Olá"
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
    "title": "Bebidas",
    "desc": "Aprenda bebidas - vocabulário ampliado e gramática completa",
    "time": "10 MIN",
    "phrase": "Hello, my name is Ana",
    "translation": "Olá, meu nome é Miguel",
    "vocab": [
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "Time",
        "Tempo",
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
        "Resposta"
      ],
      [
        "Nice to meet you",
        "Prazer",
        "Nice to meet you, John!",
        "Conhecer alguém"
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
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Bebidas</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Bebidas</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Ana'",
        "opts": [
          "Boa noite",
          "Até logo",
          "Olá, meu nome é Miguel",
          "Bom dia"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Prazer em conhecê-lo",
          "Onde mora",
          "Como vai",
          "Quantos anos"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "bad",
          "good",
          "nice",
          "big"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Ana'?",
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
        "q": "Qual verbo em 'Hello, my name is Ana'?",
        "opts": [
          "the",
          "or",
          "is",
          "and"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Goodbye",
          "Nice to meet you too",
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
        "q": "'Hello' é:",
        "opts": [
          "Um cumprimento",
          "Pedido",
          "Agradecimento",
          "Despedida"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "Meet you nice to",
          "Nice to meet you",
          "To you nice meet",
          "You nice to meet"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Bom dia",
          "Boa noite",
          "Boa tarde",
          "Olá"
        ],
        "ans": 0,
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
    "desc": "Aprenda pedindo ajuda - vocabulário ampliado e gramática completa",
    "time": "11 MIN",
    "phrase": "Hello, my name is Ana",
    "translation": "Olá, meu nome é Sarah",
    "vocab": [
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
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
        "Time",
        "Tempo",
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
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "How are you?",
        "Como está?",
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
        "Work",
        "Trabalho",
        "I work as teacher",
        "Trabalho"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Pedindo ajuda</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Pedindo ajuda</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Ana'",
        "opts": [
          "Boa noite",
          "Até logo",
          "Olá, meu nome é Sarah",
          "Bom dia"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Como vai",
          "Quantos anos",
          "Prazer em conhecê-lo",
          "Onde mora"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "good",
          "nice",
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
        "q": "Qual verbo em 'Hello, my name is Ana'?",
        "opts": [
          "the",
          "and",
          "or",
          "is"
        ],
        "ans": 3,
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Goodbye",
          "I am fine",
          "Thank you",
          "Nice to meet you too"
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
        "q": "'Hello' é:",
        "opts": [
          "Agradecimento",
          "Pedido",
          "Um cumprimento",
          "Despedida"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "Meet you nice to",
          "To you nice meet",
          "Nice to meet you",
          "You nice to meet"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Bom dia",
          "Boa noite",
          "Olá",
          "Boa tarde"
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
    "desc": "Aprenda direções simples - vocabulário ampliado e gramática completa",
    "time": "12 MIN",
    "phrase": "Hello, my name is John",
    "translation": "Olá, meu nome é Miguel",
    "vocab": [
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Day",
        "Dia",
        "What day is today?",
        "Dia"
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
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Food",
        "Comida",
        "I like food",
        "Comida"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Atenção"
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
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Direções simples</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Direções simples</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is John'",
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
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Onde mora",
          "Quantos anos",
          "Como vai",
          "Prazer em conhecê-lo"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "good",
          "big",
          "bad",
          "nice"
        ],
        "ans": 3,
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
        "q": "Qual verbo em 'Hello, my name is John'?",
        "opts": [
          "or",
          "and",
          "is",
          "the"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Goodbye",
          "Nice to meet you too",
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
          "Onde mora?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "'Hello' é:",
        "opts": [
          "Agradecimento",
          "Despedida",
          "Pedido",
          "Um cumprimento"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "To you nice meet",
          "You nice to meet",
          "Nice to meet you",
          "Meet you nice to"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa tarde",
          "Olá",
          "Boa noite",
          "Bom dia"
        ],
        "ans": 3,
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
    "desc": "Aprenda preços e dinheiro - vocabulário ampliado e gramática completa",
    "time": "13 MIN",
    "phrase": "Hello, my name is Mike",
    "translation": "Olá, meu nome é Sarah",
    "vocab": [
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta"
      ],
      [
        "How are you?",
        "Como está?",
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
        "Nice to meet you",
        "Prazer",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Food",
        "Comida",
        "I like food",
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
        "I work as teacher",
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
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Preços e dinheiro</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Preços e dinheiro</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Mike'",
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
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Quantos anos",
          "Onde mora",
          "Como vai",
          "Prazer em conhecê-lo"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "bad",
          "nice",
          "big",
          "good"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Mike'?",
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
        "q": "Qual verbo em 'Hello, my name is Mike'?",
        "opts": [
          "is",
          "and",
          "or",
          "the"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Thank you",
          "I am fine",
          "Nice to meet you too",
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
        "q": "'Hello' é:",
        "opts": [
          "Pedido",
          "Um cumprimento",
          "Despedida",
          "Agradecimento"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "Nice to meet you",
          "Meet you nice to",
          "You nice to meet",
          "To you nice meet"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Olá",
          "Bom dia",
          "Boa tarde",
          "Boa noite"
        ],
        "ans": 1,
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
    "desc": "Aprenda roupas - vocabulário ampliado e gramática completa",
    "time": "6 MIN",
    "phrase": "Hello, my name is John",
    "translation": "Olá, meu nome é João",
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
        "I work as teacher",
        "Trabalho"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
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
        "Como está?",
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
        "Day",
        "Dia",
        "What day is today?",
        "Dia"
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
        "Food",
        "Comida",
        "I like food",
        "Comida"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Roupas</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Roupas</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is John'",
        "opts": [
          "Boa noite",
          "Olá, meu nome é João",
          "Até logo",
          "Bom dia"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Onde mora",
          "Prazer em conhecê-lo",
          "Como vai",
          "Quantos anos"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "good",
          "nice",
          "big",
          "bad"
        ],
        "ans": 1,
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
        "q": "Qual verbo em 'Hello, my name is John'?",
        "opts": [
          "or",
          "and",
          "is",
          "the"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Thank you",
          "Goodbye",
          "I am fine",
          "Nice to meet you too"
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
        "q": "'Hello' é:",
        "opts": [
          "Agradecimento",
          "Pedido",
          "Despedida",
          "Um cumprimento"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "To you nice meet",
          "Nice to meet you",
          "You nice to meet",
          "Meet you nice to"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Olá",
          "Bom dia",
          "Boa noite",
          "Boa tarde"
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
    "desc": "Aprenda saúde básica - vocabulário ampliado e gramática completa",
    "time": "7 MIN",
    "phrase": "Hello, my name is John",
    "translation": "Olá, meu nome é Ana",
    "vocab": [
      [
        "Nice to meet you",
        "Prazer",
        "Nice to meet you, John!",
        "Conhecer alguém"
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
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Work",
        "Trabalho",
        "I work as teacher",
        "Trabalho"
      ],
      [
        "Food",
        "Comida",
        "I like food",
        "Comida"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Atenção"
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
        "Resposta"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Saúde básica</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Saúde básica</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is John'",
        "opts": [
          "Bom dia",
          "Até logo",
          "Olá, meu nome é Ana",
          "Boa noite"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Onde mora",
          "Quantos anos",
          "Como vai",
          "Prazer em conhecê-lo"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "big",
          "bad",
          "good",
          "nice"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is John'?",
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
        "q": "Qual verbo em 'Hello, my name is John'?",
        "opts": [
          "or",
          "is",
          "and",
          "the"
        ],
        "ans": 1,
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Thank you",
          "Goodbye",
          "I am fine",
          "Nice to meet you too"
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
        "q": "'Hello' é:",
        "opts": [
          "Agradecimento",
          "Um cumprimento",
          "Despedida",
          "Pedido"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "You nice to meet",
          "Meet you nice to",
          "Nice to meet you",
          "To you nice meet"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa tarde",
          "Olá",
          "Boa noite",
          "Bom dia"
        ],
        "ans": 3,
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
    "desc": "Aprenda emoções - vocabulário ampliado e gramática completa",
    "time": "8 MIN",
    "phrase": "Hello, my name is John",
    "translation": "Olá, meu nome é João",
    "vocab": [
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Time",
        "Tempo",
        "What time is it?",
        "Hora"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "How are you?",
        "Como está?",
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
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
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
        "Work",
        "Trabalho",
        "I work as teacher",
        "Trabalho"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Emoções</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Emoções</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is John'",
        "opts": [
          "Bom dia",
          "Olá, meu nome é João",
          "Até logo",
          "Boa noite"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Quantos anos",
          "Como vai",
          "Onde mora",
          "Prazer em conhecê-lo"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "good",
          "nice",
          "bad",
          "big"
        ],
        "ans": 1,
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
        "q": "Qual verbo em 'Hello, my name is John'?",
        "opts": [
          "or",
          "is",
          "the",
          "and"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Nice to meet you too",
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
        "q": "'Hello' é:",
        "opts": [
          "Pedido",
          "Agradecimento",
          "Despedida",
          "Um cumprimento"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "To you nice meet",
          "You nice to meet",
          "Meet you nice to",
          "Nice to meet you"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Olá",
          "Boa noite",
          "Boa tarde",
          "Bom dia"
        ],
        "ans": 3,
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
    "desc": "Aprenda convites - vocabulário ampliado e gramática completa",
    "time": "9 MIN",
    "phrase": "Hello, my name is John",
    "translation": "Olá, meu nome é Sarah",
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
        "Work",
        "Trabalho",
        "I work as teacher",
        "Trabalho"
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
        "I like food",
        "Comida"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Atenção"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "How are you?",
        "Como está?",
        "How are you today?",
        "Bem-estar"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Convites</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Convites</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is John'",
        "opts": [
          "Olá, meu nome é Sarah",
          "Boa noite",
          "Bom dia",
          "Até logo"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Como vai",
          "Onde mora",
          "Quantos anos",
          "Prazer em conhecê-lo"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "bad",
          "nice",
          "big",
          "good"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is John'?",
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
        "q": "Qual verbo em 'Hello, my name is John'?",
        "opts": [
          "is",
          "or",
          "and",
          "the"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Nice to meet you too",
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
        "q": "'Hello' é:",
        "opts": [
          "Um cumprimento",
          "Despedida",
          "Pedido",
          "Agradecimento"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "Meet you nice to",
          "You nice to meet",
          "To you nice meet",
          "Nice to meet you"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Olá",
          "Bom dia",
          "Boa noite",
          "Boa tarde"
        ],
        "ans": 1,
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
    "desc": "Aprenda telefone - vocabulário ampliado e gramática completa",
    "time": "10 MIN",
    "phrase": "Hello, my name is John",
    "translation": "Olá, meu nome é João",
    "vocab": [
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Atenção"
      ],
      [
        "Nice to meet you",
        "Prazer",
        "Nice to meet you, John!",
        "Conhecer alguém"
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
        "I like food",
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
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Telefone</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Telefone</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is John'",
        "opts": [
          "Boa noite",
          "Até logo",
          "Olá, meu nome é João",
          "Bom dia"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Onde mora",
          "Quantos anos",
          "Como vai",
          "Prazer em conhecê-lo"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "nice",
          "big",
          "good",
          "bad"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is John'?",
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
        "q": "Qual verbo em 'Hello, my name is John'?",
        "opts": [
          "the",
          "and",
          "is",
          "or"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Thank you",
          "I am fine",
          "Goodbye",
          "Nice to meet you too"
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
        "q": "'Hello' é:",
        "opts": [
          "Agradecimento",
          "Despedida",
          "Um cumprimento",
          "Pedido"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "You nice to meet",
          "Meet you nice to",
          "To you nice meet",
          "Nice to meet you"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa tarde",
          "Boa noite",
          "Bom dia",
          "Olá"
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
    "title": "Email e contato",
    "desc": "Aprenda email e contato - vocabulário ampliado e gramática completa",
    "time": "11 MIN",
    "phrase": "Hello, my name is John",
    "translation": "Olá, meu nome é Ana",
    "vocab": [
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta"
      ],
      [
        "Time",
        "Tempo",
        "What time is it?",
        "Hora"
      ],
      [
        "Day",
        "Dia",
        "What day is today?",
        "Dia"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
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
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Nice to meet you",
        "Prazer",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Work",
        "Trabalho",
        "I work as teacher",
        "Trabalho"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Email e contato</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Email e contato</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is John'",
        "opts": [
          "Boa noite",
          "Até logo",
          "Olá, meu nome é Ana",
          "Bom dia"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Prazer em conhecê-lo",
          "Como vai",
          "Onde mora",
          "Quantos anos"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "big",
          "nice",
          "bad",
          "good"
        ],
        "ans": 1,
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
        "q": "Qual verbo em 'Hello, my name is John'?",
        "opts": [
          "is",
          "the",
          "or",
          "and"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Goodbye",
          "Nice to meet you too",
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
          "Quantos anos?",
          "Como vai?"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "'Hello' é:",
        "opts": [
          "Um cumprimento",
          "Pedido",
          "Agradecimento",
          "Despedida"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "You nice to meet",
          "Nice to meet you",
          "To you nice meet",
          "Meet you nice to"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa tarde",
          "Bom dia",
          "Boa noite",
          "Olá"
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
    "desc": "Aprenda planos futuros - vocabulário ampliado e gramática completa",
    "time": "12 MIN",
    "phrase": "Hello, my name is Sarah",
    "translation": "Olá, meu nome é Ana",
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
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "Day",
        "Dia",
        "What day is today?",
        "Dia"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "How are you?",
        "Como está?",
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
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Atenção"
      ],
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Planos futuros</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Planos futuros</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Sarah'",
        "opts": [
          "Boa noite",
          "Até logo",
          "Olá, meu nome é Ana",
          "Bom dia"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Onde mora",
          "Como vai",
          "Quantos anos",
          "Prazer em conhecê-lo"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "big",
          "nice",
          "bad",
          "good"
        ],
        "ans": 1,
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
        "q": "Qual verbo em 'Hello, my name is Sarah'?",
        "opts": [
          "is",
          "the",
          "and",
          "or"
        ],
        "ans": 0,
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Nice to meet you too",
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
        "q": "'Hello' é:",
        "opts": [
          "Um cumprimento",
          "Despedida",
          "Pedido",
          "Agradecimento"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "You nice to meet",
          "To you nice meet",
          "Meet you nice to",
          "Nice to meet you"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Bom dia",
          "Boa noite",
          "Boa tarde",
          "Olá"
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
    "title": "Passado simples",
    "desc": "Aprenda passado simples - vocabulário ampliado e gramática completa",
    "time": "13 MIN",
    "phrase": "Hello, my name is John",
    "translation": "Olá, meu nome é Miguel",
    "vocab": [
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Day",
        "Dia",
        "What day is today?",
        "Dia"
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
        "Work",
        "Trabalho",
        "I work as teacher",
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
        "Resposta"
      ],
      [
        "Nice to meet you",
        "Prazer",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Atenção"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Passado simples</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Passado simples</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is John'",
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
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Onde mora",
          "Como vai",
          "Quantos anos",
          "Prazer em conhecê-lo"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "nice",
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
          "Ao comer",
          "Ao dormir",
          "Ao se apresentar"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Qual verbo em 'Hello, my name is John'?",
        "opts": [
          "and",
          "the",
          "is",
          "or"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Goodbye",
          "Thank you",
          "I am fine",
          "Nice to meet you too"
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
        "q": "'Hello' é:",
        "opts": [
          "Agradecimento",
          "Despedida",
          "Pedido",
          "Um cumprimento"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "You nice to meet",
          "Meet you nice to",
          "To you nice meet",
          "Nice to meet you"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa tarde",
          "Olá",
          "Bom dia",
          "Boa noite"
        ],
        "ans": 2,
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
    "desc": "Aprenda experiências - vocabulário ampliado e gramática completa",
    "time": "6 MIN",
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
        "Nice to meet you",
        "Prazer",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Time",
        "Tempo",
        "What time is it?",
        "Hora"
      ],
      [
        "How are you?",
        "Como está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Experiências</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Experiências</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
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
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Prazer em conhecê-lo",
          "Quantos anos",
          "Como vai",
          "Onde mora"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "good",
          "bad",
          "big",
          "nice"
        ],
        "ans": 3,
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
        "q": "Qual verbo em 'Hello, my name is Sarah'?",
        "opts": [
          "and",
          "or",
          "is",
          "the"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "I am fine",
          "Nice to meet you too",
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
        "q": "'Hello' é:",
        "opts": [
          "Pedido",
          "Despedida",
          "Um cumprimento",
          "Agradecimento"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "Meet you nice to",
          "Nice to meet you",
          "To you nice meet",
          "You nice to meet"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa tarde",
          "Olá",
          "Boa noite",
          "Bom dia"
        ],
        "ans": 3,
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
    "desc": "Aprenda preferências - vocabulário ampliado e gramática completa",
    "time": "7 MIN",
    "phrase": "Hello, my name is Sarah",
    "translation": "Olá, meu nome é Miguel",
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
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Food",
        "Comida",
        "I like food",
        "Comida"
      ],
      [
        "Time",
        "Tempo",
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
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Preferências</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Preferências</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Sarah'",
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
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Quantos anos",
          "Prazer em conhecê-lo",
          "Onde mora",
          "Como vai"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "big",
          "bad",
          "good",
          "nice"
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
        "q": "Qual verbo em 'Hello, my name is Sarah'?",
        "opts": [
          "and",
          "is",
          "the",
          "or"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "I am fine",
          "Goodbye",
          "Thank you",
          "Nice to meet you too"
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
        "q": "'Hello' é:",
        "opts": [
          "Um cumprimento",
          "Pedido",
          "Agradecimento",
          "Despedida"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "To you nice meet",
          "You nice to meet",
          "Nice to meet you",
          "Meet you nice to"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa tarde",
          "Olá",
          "Bom dia",
          "Boa noite"
        ],
        "ans": 2,
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
    "desc": "Aprenda opiniões simples - vocabulário ampliado e gramática completa",
    "time": "8 MIN",
    "phrase": "Hello, my name is Mike",
    "translation": "Olá, meu nome é Ana",
    "vocab": [
      [
        "Food",
        "Comida",
        "I like food",
        "Comida"
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
        "Nice to meet you",
        "Prazer",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Atenção"
      ],
      [
        "How are you?",
        "Como está?",
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
        "Day",
        "Dia",
        "What day is today?",
        "Dia"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Opiniões simples</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Opiniões simples</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Mike'",
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
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Prazer em conhecê-lo",
          "Como vai",
          "Onde mora",
          "Quantos anos"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "bad",
          "good",
          "nice",
          "big"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Mike'?",
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
        "q": "Qual verbo em 'Hello, my name is Mike'?",
        "opts": [
          "is",
          "and",
          "or",
          "the"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Thank you",
          "Nice to meet you too",
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
          "Quantos anos?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "'Hello' é:",
        "opts": [
          "Agradecimento",
          "Pedido",
          "Um cumprimento",
          "Despedida"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "Meet you nice to",
          "To you nice meet",
          "You nice to meet",
          "Nice to meet you"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Olá",
          "Boa noite",
          "Bom dia",
          "Boa tarde"
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
    "title": "Comparações",
    "desc": "Aprenda comparações - vocabulário ampliado e gramática completa",
    "time": "9 MIN",
    "phrase": "Hello, my name is Sarah",
    "translation": "Olá, meu nome é Miguel",
    "vocab": [
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "Time",
        "Tempo",
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
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Day",
        "Dia",
        "What day is today?",
        "Dia"
      ],
      [
        "Work",
        "Trabalho",
        "I work as teacher",
        "Trabalho"
      ],
      [
        "Food",
        "Comida",
        "I like food",
        "Comida"
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
        "Family",
        "Família",
        "My family is big",
        "Família"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Comparações</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Comparações</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Sarah'",
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
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Prazer em conhecê-lo",
          "Onde mora",
          "Quantos anos",
          "Como vai"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "bad",
          "good",
          "nice",
          "big"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Sarah'?",
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
        "q": "Qual verbo em 'Hello, my name is Sarah'?",
        "opts": [
          "the",
          "and",
          "is",
          "or"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Goodbye",
          "I am fine",
          "Thank you",
          "Nice to meet you too"
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
        "q": "'Hello' é:",
        "opts": [
          "Agradecimento",
          "Um cumprimento",
          "Pedido",
          "Despedida"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "You nice to meet",
          "Nice to meet you",
          "Meet you nice to",
          "To you nice meet"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa tarde",
          "Boa noite",
          "Bom dia",
          "Olá"
        ],
        "ans": 2,
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
    "desc": "Aprenda conselhos - vocabulário ampliado e gramática completa",
    "time": "10 MIN",
    "phrase": "Hello, my name is Ana",
    "translation": "Olá, meu nome é João",
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
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta"
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
        "I like food",
        "Comida"
      ],
      [
        "Day",
        "Dia",
        "What day is today?",
        "Dia"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Atenção"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Conselhos</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Conselhos</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Ana'",
        "opts": [
          "Boa noite",
          "Até logo",
          "Bom dia",
          "Olá, meu nome é João"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Quantos anos",
          "Como vai",
          "Onde mora",
          "Prazer em conhecê-lo"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "nice",
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
          "Ao dormir",
          "Ao comer",
          "Ao dirigir",
          "Ao se apresentar"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Qual verbo em 'Hello, my name is Ana'?",
        "opts": [
          "and",
          "the",
          "is",
          "or"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "I am fine",
          "Goodbye",
          "Nice to meet you too",
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
        "q": "'Hello' é:",
        "opts": [
          "Um cumprimento",
          "Agradecimento",
          "Pedido",
          "Despedida"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "Nice to meet you",
          "To you nice meet",
          "Meet you nice to",
          "You nice to meet"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Olá",
          "Bom dia",
          "Boa tarde",
          "Boa noite"
        ],
        "ans": 1,
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
    "desc": "Aprenda convite para café - vocabulário ampliado e gramática completa",
    "time": "11 MIN",
    "phrase": "Hello, my name is Sarah",
    "translation": "Olá, meu nome é João",
    "vocab": [
      [
        "Food",
        "Comida",
        "I like food",
        "Comida"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Nice to meet you",
        "Prazer",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Day",
        "Dia",
        "What day is today?",
        "Dia"
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
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Convite para café</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Convite para café</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Sarah'",
        "opts": [
          "Bom dia",
          "Boa noite",
          "Olá, meu nome é João",
          "Até logo"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Prazer em conhecê-lo",
          "Quantos anos",
          "Onde mora",
          "Como vai"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "nice",
          "big",
          "bad",
          "good"
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
        "q": "Qual verbo em 'Hello, my name is Sarah'?",
        "opts": [
          "and",
          "or",
          "is",
          "the"
        ],
        "ans": 2,
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Nice to meet you too",
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
        "q": "'Hello' é:",
        "opts": [
          "Agradecimento",
          "Despedida",
          "Um cumprimento",
          "Pedido"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "To you nice meet",
          "Meet you nice to",
          "You nice to meet",
          "Nice to meet you"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Olá",
          "Boa tarde",
          "Bom dia",
          "Boa noite"
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
    "desc": "Aprenda conhecendo vizinhos - vocabulário ampliado e gramática completa",
    "time": "12 MIN",
    "phrase": "Hello, my name is Ana",
    "translation": "Olá, meu nome é Miguel",
    "vocab": [
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "Work",
        "Trabalho",
        "I work as teacher",
        "Trabalho"
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
        "Food",
        "Comida",
        "I like food",
        "Comida"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "Time",
        "Tempo",
        "What time is it?",
        "Hora"
      ],
      [
        "Nice to meet you",
        "Prazer",
        "Nice to meet you, John!",
        "Conhecer alguém"
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
        "Good morning, everyone!",
        "Até meio-dia"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Conhecendo vizinhos</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Conhecendo vizinhos</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Ana'",
        "opts": [
          "Bom dia",
          "Olá, meu nome é Miguel",
          "Até logo",
          "Boa noite"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Como vai",
          "Prazer em conhecê-lo",
          "Quantos anos",
          "Onde mora"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "bad",
          "nice",
          "good",
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
        "q": "Qual verbo em 'Hello, my name is Ana'?",
        "opts": [
          "is",
          "or",
          "and",
          "the"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "I am fine",
          "Goodbye",
          "Nice to meet you too",
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
        "q": "'Hello' é:",
        "opts": [
          "Despedida",
          "Agradecimento",
          "Pedido",
          "Um cumprimento"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "To you nice meet",
          "Nice to meet you",
          "You nice to meet",
          "Meet you nice to"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Bom dia",
          "Boa tarde",
          "Olá",
          "Boa noite"
        ],
        "ans": 0,
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
    "desc": "Aprenda festa e celebração - vocabulário ampliado e gramática completa",
    "time": "13 MIN",
    "phrase": "Hello, my name is John",
    "translation": "Olá, meu nome é Ana",
    "vocab": [
      [
        "Day",
        "Dia",
        "What day is today?",
        "Dia"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Time",
        "Tempo",
        "What time is it?",
        "Hora"
      ],
      [
        "Work",
        "Trabalho",
        "I work as teacher",
        "Trabalho"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "Food",
        "Comida",
        "I like food",
        "Comida"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ],
      [
        "How are you?",
        "Como está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Atenção"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Festa e celebração</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Festa e celebração</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is John'",
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
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Onde mora",
          "Como vai",
          "Prazer em conhecê-lo",
          "Quantos anos"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "nice",
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
          "Ao dormir",
          "Ao se apresentar",
          "Ao dirigir",
          "Ao comer"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Qual verbo em 'Hello, my name is John'?",
        "opts": [
          "and",
          "or",
          "the",
          "is"
        ],
        "ans": 3,
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "I am fine",
          "Nice to meet you too",
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
          "Onde mora?",
          "Como vai?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "'Hello' é:",
        "opts": [
          "Pedido",
          "Agradecimento",
          "Despedida",
          "Um cumprimento"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "To you nice meet",
          "You nice to meet",
          "Nice to meet you",
          "Meet you nice to"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Olá",
          "Boa tarde",
          "Boa noite",
          "Bom dia"
        ],
        "ans": 3,
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
    "desc": "Aprenda filmes e música - vocabulário ampliado e gramática completa",
    "time": "6 MIN",
    "phrase": "Hello, my name is Sarah",
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
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Atenção"
      ],
      [
        "Nice to meet you",
        "Prazer",
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
        "Day",
        "Dia",
        "What day is today?",
        "Dia"
      ],
      [
        "Food",
        "Comida",
        "I like food",
        "Comida"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Filmes e música</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Filmes e música</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Sarah'",
        "opts": [
          "Até logo",
          "Boa noite",
          "Bom dia",
          "Olá, meu nome é Ana"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Quantos anos",
          "Como vai",
          "Onde mora",
          "Prazer em conhecê-lo"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "big",
          "nice",
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
          "Ao comer",
          "Ao dormir",
          "Ao se apresentar"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Qual verbo em 'Hello, my name is Sarah'?",
        "opts": [
          "and",
          "or",
          "the",
          "is"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "I am fine",
          "Nice to meet you too",
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
        "q": "'Hello' é:",
        "opts": [
          "Despedida",
          "Um cumprimento",
          "Pedido",
          "Agradecimento"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "To you nice meet",
          "You nice to meet",
          "Meet you nice to",
          "Nice to meet you"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa tarde",
          "Bom dia",
          "Boa noite",
          "Olá"
        ],
        "ans": 1,
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
    "desc": "Aprenda esportes - vocabulário ampliado e gramática completa",
    "time": "7 MIN",
    "phrase": "Hello, my name is Ana",
    "translation": "Olá, meu nome é Sarah",
    "vocab": [
      [
        "Day",
        "Dia",
        "What day is today?",
        "Dia"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
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
        "I work as teacher",
        "Trabalho"
      ],
      [
        "Food",
        "Comida",
        "I like food",
        "Comida"
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
        "Atenção"
      ],
      [
        "How are you?",
        "Como está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Time",
        "Tempo",
        "What time is it?",
        "Hora"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Esportes</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Esportes</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Ana'",
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
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Onde mora",
          "Como vai",
          "Prazer em conhecê-lo",
          "Quantos anos"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "bad",
          "big",
          "good",
          "nice"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Ana'?",
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
        "q": "Qual verbo em 'Hello, my name is Ana'?",
        "opts": [
          "and",
          "is",
          "the",
          "or"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Thank you",
          "Nice to meet you too",
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
          "Como vai?",
          "Quantos anos?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello' é:",
        "opts": [
          "Despedida",
          "Agradecimento",
          "Pedido",
          "Um cumprimento"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "Nice to meet you",
          "Meet you nice to",
          "To you nice meet",
          "You nice to meet"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa noite",
          "Olá",
          "Boa tarde",
          "Bom dia"
        ],
        "ans": 3,
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
    "desc": "Aprenda viagem curta - vocabulário ampliado e gramática completa",
    "time": "8 MIN",
    "phrase": "Hello, my name is John",
    "translation": "Olá, meu nome é João",
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
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Atenção"
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
        "Day",
        "Dia",
        "What day is today?",
        "Dia"
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
        "Resposta"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Viagem curta</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Viagem curta</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is John'",
        "opts": [
          "Bom dia",
          "Até logo",
          "Olá, meu nome é João",
          "Boa noite"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Onde mora",
          "Prazer em conhecê-lo",
          "Quantos anos",
          "Como vai"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "big",
          "nice",
          "bad",
          "good"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is John'?",
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
        "q": "Qual verbo em 'Hello, my name is John'?",
        "opts": [
          "and",
          "is",
          "or",
          "the"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Nice to meet you too",
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
          "Quantos anos?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "'Hello' é:",
        "opts": [
          "Despedida",
          "Agradecimento",
          "Pedido",
          "Um cumprimento"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "To you nice meet",
          "Meet you nice to",
          "Nice to meet you",
          "You nice to meet"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa tarde",
          "Olá",
          "Bom dia",
          "Boa noite"
        ],
        "ans": 2,
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
    "desc": "Aprenda cultura local - vocabulário ampliado e gramática completa",
    "time": "9 MIN",
    "phrase": "Hello, my name is Mike",
    "translation": "Olá, meu nome é Ana",
    "vocab": [
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Atenção"
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
        "Resposta"
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
        "I work as teacher",
        "Trabalho"
      ],
      [
        "Food",
        "Comida",
        "I like food",
        "Comida"
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
        "Prazer",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Cultura local</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Cultura local</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Mike'",
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
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Como vai",
          "Prazer em conhecê-lo",
          "Quantos anos",
          "Onde mora"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "nice",
          "big",
          "good",
          "bad"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Mike'?",
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
        "q": "Qual verbo em 'Hello, my name is Mike'?",
        "opts": [
          "or",
          "and",
          "the",
          "is"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "I am fine",
          "Nice to meet you too",
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
          "Qual é seu nome?",
          "Quantos anos?",
          "Como vai?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello' é:",
        "opts": [
          "Agradecimento",
          "Pedido",
          "Um cumprimento",
          "Despedida"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "Meet you nice to",
          "You nice to meet",
          "To you nice meet",
          "Nice to meet you"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Bom dia",
          "Boa tarde",
          "Olá",
          "Boa noite"
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
    "title": "Olá e apresentações",
    "desc": "Aprenda olá e apresentações - vocabulário ampliado e gramática completa",
    "time": "10 MIN",
    "phrase": "Hello, my name is John",
    "translation": "Olá, meu nome é Miguel",
    "vocab": [
      [
        "Nice to meet you",
        "Prazer",
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
        "Day",
        "Dia",
        "What day is today?",
        "Dia"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
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
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "Work",
        "Trabalho",
        "I work as teacher",
        "Trabalho"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Olá e apresentações</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Olá e apresentações</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is John'",
        "opts": [
          "Bom dia",
          "Boa noite",
          "Olá, meu nome é Miguel",
          "Até logo"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Prazer em conhecê-lo",
          "Quantos anos",
          "Como vai",
          "Onde mora"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "big",
          "good",
          "bad",
          "nice"
        ],
        "ans": 3,
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
        "q": "Qual verbo em 'Hello, my name is John'?",
        "opts": [
          "the",
          "or",
          "is",
          "and"
        ],
        "ans": 2,
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Goodbye",
          "Nice to meet you too",
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
        "q": "'Hello' é:",
        "opts": [
          "Agradecimento",
          "Despedida",
          "Pedido",
          "Um cumprimento"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "You nice to meet",
          "To you nice meet",
          "Nice to meet you",
          "Meet you nice to"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa tarde",
          "Olá",
          "Boa noite",
          "Bom dia"
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
    "title": "Dizendo seu nome",
    "desc": "Aprenda dizendo seu nome - vocabulário ampliado e gramática completa",
    "time": "11 MIN",
    "phrase": "Hello, my name is Mike",
    "translation": "Olá, meu nome é Ana",
    "vocab": [
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Atenção"
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
        "Work",
        "Trabalho",
        "I work as teacher",
        "Trabalho"
      ],
      [
        "Day",
        "Dia",
        "What day is today?",
        "Dia"
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
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Dizendo seu nome</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Dizendo seu nome</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Mike'",
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
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Prazer em conhecê-lo",
          "Quantos anos",
          "Onde mora",
          "Como vai"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "good",
          "bad",
          "big",
          "nice"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Mike'?",
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
        "q": "Qual verbo em 'Hello, my name is Mike'?",
        "opts": [
          "and",
          "or",
          "is",
          "the"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Nice to meet you too",
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
        "q": "'Hello' é:",
        "opts": [
          "Despedida",
          "Pedido",
          "Agradecimento",
          "Um cumprimento"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "Meet you nice to",
          "Nice to meet you",
          "To you nice meet",
          "You nice to meet"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa noite",
          "Boa tarde",
          "Olá",
          "Bom dia"
        ],
        "ans": 3,
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
    "desc": "Aprenda de onde você é - vocabulário ampliado e gramática completa",
    "time": "12 MIN",
    "phrase": "Hello, my name is Mike",
    "translation": "Olá, meu nome é Ana",
    "vocab": [
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
        "Work",
        "Trabalho",
        "I work as teacher",
        "Trabalho"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Day",
        "Dia",
        "What day is today?",
        "Dia"
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
        "Food",
        "Comida",
        "I like food",
        "Comida"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Time",
        "Tempo",
        "What time is it?",
        "Hora"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: De onde você é</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: De onde você é</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Mike'",
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
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Onde mora",
          "Quantos anos",
          "Prazer em conhecê-lo",
          "Como vai"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "big",
          "nice",
          "good",
          "bad"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Mike'?",
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
        "q": "Qual verbo em 'Hello, my name is Mike'?",
        "opts": [
          "is",
          "the",
          "or",
          "and"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "I am fine",
          "Thank you",
          "Nice to meet you too",
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
        "q": "'Hello' é:",
        "opts": [
          "Despedida",
          "Pedido",
          "Um cumprimento",
          "Agradecimento"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "Meet you nice to",
          "You nice to meet",
          "To you nice meet",
          "Nice to meet you"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa tarde",
          "Bom dia",
          "Olá",
          "Boa noite"
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
    "desc": "Aprenda perguntando o nome - vocabulário ampliado e gramática completa",
    "time": "13 MIN",
    "phrase": "Hello, my name is Mike",
    "translation": "Olá, meu nome é João",
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
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "How are you?",
        "Como está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Food",
        "Comida",
        "I like food",
        "Comida"
      ],
      [
        "Time",
        "Tempo",
        "What time is it?",
        "Hora"
      ],
      [
        "Nice to meet you",
        "Prazer",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Perguntando o nome</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Perguntando o nome</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Mike'",
        "opts": [
          "Boa noite",
          "Até logo",
          "Olá, meu nome é João",
          "Bom dia"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Como vai",
          "Quantos anos",
          "Onde mora",
          "Prazer em conhecê-lo"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "good",
          "big",
          "nice",
          "bad"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Mike'?",
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
        "q": "Qual verbo em 'Hello, my name is Mike'?",
        "opts": [
          "or",
          "and",
          "is",
          "the"
        ],
        "ans": 2,
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "I am fine",
          "Goodbye",
          "Thank you",
          "Nice to meet you too"
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
        "q": "'Hello' é:",
        "opts": [
          "Despedida",
          "Um cumprimento",
          "Agradecimento",
          "Pedido"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "You nice to meet",
          "Meet you nice to",
          "Nice to meet you",
          "To you nice meet"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa tarde",
          "Boa noite",
          "Olá",
          "Bom dia"
        ],
        "ans": 3,
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
    "desc": "Aprenda idade e aniversário - vocabulário ampliado e gramática completa",
    "time": "6 MIN",
    "phrase": "Hello, my name is Sarah",
    "translation": "Olá, meu nome é Miguel",
    "vocab": [
      [
        "Day",
        "Dia",
        "What day is today?",
        "Dia"
      ],
      [
        "Work",
        "Trabalho",
        "I work as teacher",
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
        "Resposta"
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
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Atenção"
      ],
      [
        "How are you?",
        "Como está?",
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
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Idade e aniversário</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Idade e aniversário</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Sarah'",
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
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Como vai",
          "Quantos anos",
          "Onde mora",
          "Prazer em conhecê-lo"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "good",
          "bad",
          "nice",
          "big"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Sarah'?",
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
        "q": "Qual verbo em 'Hello, my name is Sarah'?",
        "opts": [
          "and",
          "or",
          "the",
          "is"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "I am fine",
          "Goodbye",
          "Thank you",
          "Nice to meet you too"
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
        "q": "'Hello' é:",
        "opts": [
          "Pedido",
          "Agradecimento",
          "Um cumprimento",
          "Despedida"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "You nice to meet",
          "Meet you nice to",
          "To you nice meet",
          "Nice to meet you"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Bom dia",
          "Boa tarde",
          "Boa noite",
          "Olá"
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
    "desc": "Aprenda família básica - vocabulário ampliado e gramática completa",
    "time": "7 MIN",
    "phrase": "Hello, my name is Sarah",
    "translation": "Olá, meu nome é João",
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
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ],
      [
        "Time",
        "Tempo",
        "What time is it?",
        "Hora"
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
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "How are you?",
        "Como está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Food",
        "Comida",
        "I like food",
        "Comida"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Atenção"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Família básica</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Família básica</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Sarah'",
        "opts": [
          "Olá, meu nome é João",
          "Até logo",
          "Bom dia",
          "Boa noite"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Como vai",
          "Prazer em conhecê-lo",
          "Quantos anos",
          "Onde mora"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "big",
          "bad",
          "nice",
          "good"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Sarah'?",
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
        "q": "Qual verbo em 'Hello, my name is Sarah'?",
        "opts": [
          "is",
          "and",
          "the",
          "or"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Goodbye",
          "I am fine",
          "Thank you",
          "Nice to meet you too"
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
        "q": "'Hello' é:",
        "opts": [
          "Pedido",
          "Agradecimento",
          "Despedida",
          "Um cumprimento"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "Nice to meet you",
          "You nice to meet",
          "To you nice meet",
          "Meet you nice to"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Olá",
          "Boa tarde",
          "Bom dia",
          "Boa noite"
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
    "desc": "Aprenda cumprimentos formais - vocabulário ampliado e gramática completa",
    "time": "8 MIN",
    "phrase": "Hello, my name is Ana",
    "translation": "Olá, meu nome é Miguel",
    "vocab": [
      [
        "Nice to meet you",
        "Prazer",
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
        "Food",
        "Comida",
        "I like food",
        "Comida"
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
        "I work as teacher",
        "Trabalho"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Time",
        "Tempo",
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
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Atenção"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Cumprimentos formais</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Cumprimentos formais</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Ana'",
        "opts": [
          "Bom dia",
          "Até logo",
          "Boa noite",
          "Olá, meu nome é Miguel"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Como vai",
          "Prazer em conhecê-lo",
          "Onde mora",
          "Quantos anos"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "good",
          "big",
          "bad",
          "nice"
        ],
        "ans": 3,
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
        "q": "Qual verbo em 'Hello, my name is Ana'?",
        "opts": [
          "and",
          "or",
          "is",
          "the"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Goodbye",
          "I am fine",
          "Nice to meet you too",
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
        "q": "'Hello' é:",
        "opts": [
          "Agradecimento",
          "Despedida",
          "Um cumprimento",
          "Pedido"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "You nice to meet",
          "Meet you nice to",
          "Nice to meet you",
          "To you nice meet"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Olá",
          "Boa tarde",
          "Boa noite",
          "Bom dia"
        ],
        "ans": 3,
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
    "desc": "Aprenda despedidas - vocabulário ampliado e gramática completa",
    "time": "9 MIN",
    "phrase": "Hello, my name is Sarah",
    "translation": "Olá, meu nome é João",
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
        "Work",
        "Trabalho",
        "I work as teacher",
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
        "Resposta"
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
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Despedidas</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Despedidas</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Sarah'",
        "opts": [
          "Bom dia",
          "Boa noite",
          "Olá, meu nome é João",
          "Até logo"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Como vai",
          "Quantos anos",
          "Onde mora",
          "Prazer em conhecê-lo"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "nice",
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
        "q": "Qual verbo em 'Hello, my name is Sarah'?",
        "opts": [
          "the",
          "and",
          "or",
          "is"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "I am fine",
          "Nice to meet you too",
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
        "q": "'Hello' é:",
        "opts": [
          "Um cumprimento",
          "Agradecimento",
          "Despedida",
          "Pedido"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "To you nice meet",
          "You nice to meet",
          "Meet you nice to",
          "Nice to meet you"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Bom dia",
          "Boa noite",
          "Boa tarde",
          "Olá"
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
    "desc": "Aprenda como você está - vocabulário ampliado e gramática completa",
    "time": "10 MIN",
    "phrase": "Hello, my name is Ana",
    "translation": "Olá, meu nome é Miguel",
    "vocab": [
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Atenção"
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
        "Resposta"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Time",
        "Tempo",
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
        "Food",
        "Comida",
        "I like food",
        "Comida"
      ],
      [
        "Day",
        "Dia",
        "What day is today?",
        "Dia"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Como você está</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Como você está</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Ana'",
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
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Prazer em conhecê-lo",
          "Como vai",
          "Onde mora",
          "Quantos anos"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "good",
          "bad",
          "big",
          "nice"
        ],
        "ans": 3,
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
        "q": "Qual verbo em 'Hello, my name is Ana'?",
        "opts": [
          "is",
          "or",
          "and",
          "the"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Nice to meet you too",
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
          "Quantos anos?",
          "Onde mora?"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "'Hello' é:",
        "opts": [
          "Pedido",
          "Um cumprimento",
          "Despedida",
          "Agradecimento"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "To you nice meet",
          "Meet you nice to",
          "You nice to meet",
          "Nice to meet you"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa noite",
          "Boa tarde",
          "Olá",
          "Bom dia"
        ],
        "ans": 3,
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
    "desc": "Aprenda números e telefone - vocabulário ampliado e gramática completa",
    "time": "11 MIN",
    "phrase": "Hello, my name is John",
    "translation": "Olá, meu nome é João",
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
        "Work",
        "Trabalho",
        "I work as teacher",
        "Trabalho"
      ],
      [
        "Nice to meet you",
        "Prazer",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "How are you?",
        "Como está?",
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
        "Time",
        "Tempo",
        "What time is it?",
        "Hora"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Números e telefone</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Números e telefone</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is John'",
        "opts": [
          "Boa noite",
          "Bom dia",
          "Olá, meu nome é João",
          "Até logo"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Prazer em conhecê-lo",
          "Quantos anos",
          "Como vai",
          "Onde mora"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "big",
          "bad",
          "good",
          "nice"
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
        "q": "Qual verbo em 'Hello, my name is John'?",
        "opts": [
          "and",
          "or",
          "is",
          "the"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Goodbye",
          "I am fine",
          "Nice to meet you too",
          "Thank you"
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
        "q": "'Hello' é:",
        "opts": [
          "Despedida",
          "Pedido",
          "Agradecimento",
          "Um cumprimento"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "Meet you nice to",
          "Nice to meet you",
          "To you nice meet",
          "You nice to meet"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Bom dia",
          "Boa noite",
          "Boa tarde",
          "Olá"
        ],
        "ans": 0,
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
    "desc": "Aprenda endereço e cidade - vocabulário ampliado e gramática completa",
    "time": "12 MIN",
    "phrase": "Hello, my name is Sarah",
    "translation": "Olá, meu nome é Sarah",
    "vocab": [
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "How are you?",
        "Como está?",
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
        "Prazer",
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
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Endereço e cidade</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Endereço e cidade</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
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
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Onde mora",
          "Como vai",
          "Prazer em conhecê-lo",
          "Quantos anos"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "good",
          "bad",
          "big",
          "nice"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Sarah'?",
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
        "q": "Qual verbo em 'Hello, my name is Sarah'?",
        "opts": [
          "or",
          "is",
          "the",
          "and"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Goodbye",
          "Thank you",
          "I am fine",
          "Nice to meet you too"
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
        "q": "'Hello' é:",
        "opts": [
          "Um cumprimento",
          "Despedida",
          "Pedido",
          "Agradecimento"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "To you nice meet",
          "Nice to meet you",
          "You nice to meet",
          "Meet you nice to"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Bom dia",
          "Olá",
          "Boa tarde",
          "Boa noite"
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
    "title": "Profissão simples",
    "desc": "Aprenda profissão simples - vocabulário ampliado e gramática completa",
    "time": "13 MIN",
    "phrase": "Hello, my name is Sarah",
    "translation": "Olá, meu nome é Miguel",
    "vocab": [
      [
        "Day",
        "Dia",
        "What day is today?",
        "Dia"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Atenção"
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
        "Nice to meet you",
        "Prazer",
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
        "How are you?",
        "Como está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Work",
        "Trabalho",
        "I work as teacher",
        "Trabalho"
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
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Profissão simples</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Profissão simples</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Sarah'",
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
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Prazer em conhecê-lo",
          "Quantos anos",
          "Onde mora",
          "Como vai"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "bad",
          "good",
          "nice",
          "big"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Sarah'?",
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
        "q": "Qual verbo em 'Hello, my name is Sarah'?",
        "opts": [
          "the",
          "and",
          "or",
          "is"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "I am fine",
          "Nice to meet you too",
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
          "Qual é seu nome?",
          "Onde mora?",
          "Quantos anos?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello' é:",
        "opts": [
          "Pedido",
          "Um cumprimento",
          "Despedida",
          "Agradecimento"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "Nice to meet you",
          "To you nice meet",
          "You nice to meet",
          "Meet you nice to"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa noite",
          "Bom dia",
          "Boa tarde",
          "Olá"
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
    "title": "Hobbies favoritos",
    "desc": "Aprenda hobbies favoritos - vocabulário ampliado e gramática completa",
    "time": "6 MIN",
    "phrase": "Hello, my name is Mike",
    "translation": "Olá, meu nome é João",
    "vocab": [
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta"
      ],
      [
        "Time",
        "Tempo",
        "What time is it?",
        "Hora"
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
        "Food",
        "Comida",
        "I like food",
        "Comida"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
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
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Nice to meet you",
        "Prazer",
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
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Hobbies favoritos</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Hobbies favoritos</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Mike'",
        "opts": [
          "Até logo",
          "Boa noite",
          "Olá, meu nome é João",
          "Bom dia"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Quantos anos",
          "Prazer em conhecê-lo",
          "Onde mora",
          "Como vai"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "good",
          "bad",
          "nice",
          "big"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Mike'?",
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
        "q": "Qual verbo em 'Hello, my name is Mike'?",
        "opts": [
          "or",
          "is",
          "the",
          "and"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Thank you",
          "Nice to meet you too",
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
          "Qual é seu nome?",
          "Como vai?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "'Hello' é:",
        "opts": [
          "Um cumprimento",
          "Pedido",
          "Despedida",
          "Agradecimento"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "Meet you nice to",
          "You nice to meet",
          "To you nice meet",
          "Nice to meet you"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Olá",
          "Bom dia",
          "Boa noite",
          "Boa tarde"
        ],
        "ans": 1,
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
    "desc": "Aprenda comida favorita - vocabulário ampliado e gramática completa",
    "time": "7 MIN",
    "phrase": "Hello, my name is Ana",
    "translation": "Olá, meu nome é Sarah",
    "vocab": [
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Nice to meet you",
        "Prazer",
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
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta"
      ],
      [
        "Food",
        "Comida",
        "I like food",
        "Comida"
      ],
      [
        "Day",
        "Dia",
        "What day is today?",
        "Dia"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Comida favorita</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Comida favorita</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Ana'",
        "opts": [
          "Olá, meu nome é Sarah",
          "Bom dia",
          "Boa noite",
          "Até logo"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Quantos anos",
          "Onde mora",
          "Prazer em conhecê-lo",
          "Como vai"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "bad",
          "good",
          "nice",
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
        "q": "Qual verbo em 'Hello, my name is Ana'?",
        "opts": [
          "and",
          "or",
          "the",
          "is"
        ],
        "ans": 3,
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Thank you",
          "Goodbye",
          "Nice to meet you too",
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
        "q": "'Hello' é:",
        "opts": [
          "Um cumprimento",
          "Agradecimento",
          "Despedida",
          "Pedido"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "Nice to meet you",
          "To you nice meet",
          "Meet you nice to",
          "You nice to meet"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Olá",
          "Boa tarde",
          "Boa noite",
          "Bom dia"
        ],
        "ans": 3,
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
    "desc": "Aprenda cores favoritas - vocabulário ampliado e gramática completa",
    "time": "8 MIN",
    "phrase": "Hello, my name is Mike",
    "translation": "Olá, meu nome é Sarah",
    "vocab": [
      [
        "Time",
        "Tempo",
        "What time is it?",
        "Hora"
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
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ],
      [
        "Day",
        "Dia",
        "What day is today?",
        "Dia"
      ],
      [
        "Food",
        "Comida",
        "I like food",
        "Comida"
      ],
      [
        "Nice to meet you",
        "Prazer",
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
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Cores favoritas</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Cores favoritas</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Mike'",
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
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Onde mora",
          "Quantos anos",
          "Como vai",
          "Prazer em conhecê-lo"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "big",
          "bad",
          "nice",
          "good"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Mike'?",
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
        "q": "Qual verbo em 'Hello, my name is Mike'?",
        "opts": [
          "is",
          "or",
          "and",
          "the"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Goodbye",
          "Nice to meet you too",
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
        "q": "'Hello' é:",
        "opts": [
          "Agradecimento",
          "Um cumprimento",
          "Pedido",
          "Despedida"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "To you nice meet",
          "You nice to meet",
          "Meet you nice to",
          "Nice to meet you"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa noite",
          "Boa tarde",
          "Olá",
          "Bom dia"
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
    "desc": "Aprenda tempo e clima - vocabulário ampliado e gramática completa",
    "time": "9 MIN",
    "phrase": "Hello, my name is Ana",
    "translation": "Olá, meu nome é Miguel",
    "vocab": [
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
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "Day",
        "Dia",
        "What day is today?",
        "Dia"
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
        "How are you?",
        "Como está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Atenção"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Tempo e clima</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Tempo e clima</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Ana'",
        "opts": [
          "Até logo",
          "Olá, meu nome é Miguel",
          "Boa noite",
          "Bom dia"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Prazer em conhecê-lo",
          "Quantos anos",
          "Como vai",
          "Onde mora"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "nice",
          "bad",
          "good",
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
          "Ao dirigir",
          "Ao dormir"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Qual verbo em 'Hello, my name is Ana'?",
        "opts": [
          "is",
          "or",
          "the",
          "and"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Thank you",
          "I am fine",
          "Nice to meet you too",
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
        "q": "'Hello' é:",
        "opts": [
          "Pedido",
          "Despedida",
          "Um cumprimento",
          "Agradecimento"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "You nice to meet",
          "Meet you nice to",
          "Nice to meet you",
          "To you nice meet"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa tarde",
          "Boa noite",
          "Bom dia",
          "Olá"
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
    "title": "Dias da semana",
    "desc": "Aprenda dias da semana - vocabulário ampliado e gramática completa",
    "time": "10 MIN",
    "phrase": "Hello, my name is John",
    "translation": "Olá, meu nome é Ana",
    "vocab": [
      [
        "Nice to meet you",
        "Prazer",
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
        "Work",
        "Trabalho",
        "I work as teacher",
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
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Atenção"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Dias da semana</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Dias da semana</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is John'",
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
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Prazer em conhecê-lo",
          "Onde mora",
          "Quantos anos",
          "Como vai"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "bad",
          "nice",
          "good",
          "big"
        ],
        "ans": 1,
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
        "q": "Qual verbo em 'Hello, my name is John'?",
        "opts": [
          "or",
          "is",
          "and",
          "the"
        ],
        "ans": 1,
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Goodbye",
          "Nice to meet you too",
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
        "q": "'Hello' é:",
        "opts": [
          "Agradecimento",
          "Pedido",
          "Despedida",
          "Um cumprimento"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "Nice to meet you",
          "To you nice meet",
          "You nice to meet",
          "Meet you nice to"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa tarde",
          "Olá",
          "Boa noite",
          "Bom dia"
        ],
        "ans": 3,
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
    "desc": "Aprenda horas e compromissos - vocabulário ampliado e gramática completa",
    "time": "11 MIN",
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
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Nice to meet you",
        "Prazer",
        "Nice to meet you, John!",
        "Conhecer alguém"
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
        "How are you?",
        "Como está?",
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
        "Time",
        "Tempo",
        "What time is it?",
        "Hora"
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
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Horas e compromissos</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Horas e compromissos</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Ana'",
        "opts": [
          "Boa noite",
          "Bom dia",
          "Até logo",
          "Olá, meu nome é Ana"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Como vai",
          "Prazer em conhecê-lo",
          "Onde mora",
          "Quantos anos"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "big",
          "good",
          "bad",
          "nice"
        ],
        "ans": 3,
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
        "q": "Qual verbo em 'Hello, my name is Ana'?",
        "opts": [
          "the",
          "or",
          "and",
          "is"
        ],
        "ans": 3,
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "I am fine",
          "Goodbye",
          "Thank you",
          "Nice to meet you too"
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
        "q": "'Hello' é:",
        "opts": [
          "Um cumprimento",
          "Agradecimento",
          "Despedida",
          "Pedido"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "Meet you nice to",
          "To you nice meet",
          "You nice to meet",
          "Nice to meet you"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Bom dia",
          "Boa tarde",
          "Boa noite",
          "Olá"
        ],
        "ans": 0,
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
    "desc": "Aprenda família estendida - vocabulário ampliado e gramática completa",
    "time": "12 MIN",
    "phrase": "Hello, my name is Mike",
    "translation": "Olá, meu nome é Ana",
    "vocab": [
      [
        "Time",
        "Tempo",
        "What time is it?",
        "Hora"
      ],
      [
        "Nice to meet you",
        "Prazer",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "How are you?",
        "Como está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Day",
        "Dia",
        "What day is today?",
        "Dia"
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
        "Food",
        "Comida",
        "I like food",
        "Comida"
      ],
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Família estendida</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Família estendida</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Mike'",
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
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Prazer em conhecê-lo",
          "Onde mora",
          "Quantos anos",
          "Como vai"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "good",
          "big",
          "bad",
          "nice"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Mike'?",
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
        "q": "Qual verbo em 'Hello, my name is Mike'?",
        "opts": [
          "or",
          "is",
          "the",
          "and"
        ],
        "ans": 1,
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "I am fine",
          "Nice to meet you too",
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
        "q": "'Hello' é:",
        "opts": [
          "Despedida",
          "Agradecimento",
          "Pedido",
          "Um cumprimento"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "You nice to meet",
          "To you nice meet",
          "Nice to meet you",
          "Meet you nice to"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa tarde",
          "Olá",
          "Bom dia",
          "Boa noite"
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
    "title": "Casa e moradia",
    "desc": "Aprenda casa e moradia - vocabulário ampliado e gramática completa",
    "time": "13 MIN",
    "phrase": "Hello, my name is Sarah",
    "translation": "Olá, meu nome é Sarah",
    "vocab": [
      [
        "Time",
        "Tempo",
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
        "Food",
        "Comida",
        "I like food",
        "Comida"
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
        "Resposta"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Day",
        "Dia",
        "What day is today?",
        "Dia"
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
        "Atenção"
      ],
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Casa e moradia</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Casa e moradia</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Sarah'",
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
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Como vai",
          "Prazer em conhecê-lo",
          "Onde mora",
          "Quantos anos"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "bad",
          "nice",
          "good",
          "big"
        ],
        "ans": 1,
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
        "q": "Qual verbo em 'Hello, my name is Sarah'?",
        "opts": [
          "and",
          "or",
          "is",
          "the"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Nice to meet you too",
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
        "q": "'Hello' é:",
        "opts": [
          "Despedida",
          "Pedido",
          "Agradecimento",
          "Um cumprimento"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "You nice to meet",
          "Nice to meet you",
          "To you nice meet",
          "Meet you nice to"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa tarde",
          "Bom dia",
          "Boa noite",
          "Olá"
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
    "desc": "Aprenda rotina matinal - vocabulário ampliado e gramática completa",
    "time": "6 MIN",
    "phrase": "Hello, my name is Sarah",
    "translation": "Olá, meu nome é Miguel",
    "vocab": [
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
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Time",
        "Tempo",
        "What time is it?",
        "Hora"
      ],
      [
        "Food",
        "Comida",
        "I like food",
        "Comida"
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
        "I work as teacher",
        "Trabalho"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "Nice to meet you",
        "Prazer",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Rotina matinal</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Rotina matinal</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Sarah'",
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
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Onde mora",
          "Prazer em conhecê-lo",
          "Como vai",
          "Quantos anos"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "big",
          "bad",
          "nice",
          "good"
        ],
        "ans": 2,
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
        "q": "Qual verbo em 'Hello, my name is Sarah'?",
        "opts": [
          "is",
          "or",
          "the",
          "and"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Nice to meet you too",
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
        "q": "'Hello' é:",
        "opts": [
          "Agradecimento",
          "Um cumprimento",
          "Pedido",
          "Despedida"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "You nice to meet",
          "Meet you nice to",
          "To you nice meet",
          "Nice to meet you"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Olá",
          "Boa tarde",
          "Bom dia",
          "Boa noite"
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
    "desc": "Aprenda rotina noturna - vocabulário ampliado e gramática completa",
    "time": "7 MIN",
    "phrase": "Hello, my name is Mike",
    "translation": "Olá, meu nome é João",
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
        "How are you?",
        "Como está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Nice to meet you",
        "Prazer",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Atenção"
      ],
      [
        "Day",
        "Dia",
        "What day is today?",
        "Dia"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Rotina noturna</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Rotina noturna</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Mike'",
        "opts": [
          "Boa noite",
          "Bom dia",
          "Até logo",
          "Olá, meu nome é João"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Onde mora",
          "Como vai",
          "Prazer em conhecê-lo",
          "Quantos anos"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "nice",
          "good",
          "big",
          "bad"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Mike'?",
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
        "q": "Qual verbo em 'Hello, my name is Mike'?",
        "opts": [
          "the",
          "is",
          "or",
          "and"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Goodbye",
          "Thank you",
          "Nice to meet you too",
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
        "q": "'Hello' é:",
        "opts": [
          "Agradecimento",
          "Um cumprimento",
          "Despedida",
          "Pedido"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "Meet you nice to",
          "Nice to meet you",
          "To you nice meet",
          "You nice to meet"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa tarde",
          "Bom dia",
          "Boa noite",
          "Olá"
        ],
        "ans": 1,
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
    "desc": "Aprenda fim de semana - vocabulário ampliado e gramática completa",
    "time": "8 MIN",
    "phrase": "Hello, my name is John",
    "translation": "Olá, meu nome é Miguel",
    "vocab": [
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
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "How are you?",
        "Como está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Atenção"
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
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Day",
        "Dia",
        "What day is today?",
        "Dia"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Fim de semana</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Fim de semana</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is John'",
        "opts": [
          "Até logo",
          "Olá, meu nome é Miguel",
          "Boa noite",
          "Bom dia"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Prazer em conhecê-lo",
          "Onde mora",
          "Como vai",
          "Quantos anos"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "good",
          "bad",
          "big",
          "nice"
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
        "q": "Qual verbo em 'Hello, my name is John'?",
        "opts": [
          "and",
          "is",
          "the",
          "or"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "I am fine",
          "Thank you",
          "Goodbye",
          "Nice to meet you too"
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
        "q": "'Hello' é:",
        "opts": [
          "Um cumprimento",
          "Agradecimento",
          "Pedido",
          "Despedida"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "Nice to meet you",
          "Meet you nice to",
          "You nice to meet",
          "To you nice meet"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa tarde",
          "Olá",
          "Boa noite",
          "Bom dia"
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
    "title": "Compras básicas",
    "desc": "Aprenda compras básicas - vocabulário ampliado e gramática completa",
    "time": "9 MIN",
    "phrase": "Hello, my name is John",
    "translation": "Olá, meu nome é Ana",
    "vocab": [
      [
        "How are you?",
        "Como está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Nice to meet you",
        "Prazer",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Work",
        "Trabalho",
        "I work as teacher",
        "Trabalho"
      ],
      [
        "Day",
        "Dia",
        "What day is today?",
        "Dia"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Atenção"
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
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Compras básicas</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Compras básicas</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is John'",
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
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Quantos anos",
          "Onde mora",
          "Prazer em conhecê-lo",
          "Como vai"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "nice",
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
          "Ao se apresentar",
          "Ao dirigir",
          "Ao dormir",
          "Ao comer"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Qual verbo em 'Hello, my name is John'?",
        "opts": [
          "and",
          "is",
          "or",
          "the"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Nice to meet you too",
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
          "Quantos anos?",
          "Qual é seu nome?",
          "Onde mora?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "'Hello' é:",
        "opts": [
          "Agradecimento",
          "Um cumprimento",
          "Pedido",
          "Despedida"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "You nice to meet",
          "To you nice meet",
          "Nice to meet you",
          "Meet you nice to"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Bom dia",
          "Olá",
          "Boa tarde",
          "Boa noite"
        ],
        "ans": 0,
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
    "desc": "Aprenda transporte - vocabulário ampliado e gramática completa",
    "time": "10 MIN",
    "phrase": "Hello, my name is Ana",
    "translation": "Olá, meu nome é João",
    "vocab": [
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Nice to meet you",
        "Prazer",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Day",
        "Dia",
        "What day is today?",
        "Dia"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Time",
        "Tempo",
        "What time is it?",
        "Hora"
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
        "Resposta"
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
        "How are you?",
        "Como está?",
        "How are you today?",
        "Bem-estar"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Transporte</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Transporte</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Ana'",
        "opts": [
          "Olá, meu nome é João",
          "Até logo",
          "Bom dia",
          "Boa noite"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Prazer em conhecê-lo",
          "Quantos anos",
          "Onde mora",
          "Como vai"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "nice",
          "big",
          "bad",
          "good"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Ana'?",
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
        "q": "Qual verbo em 'Hello, my name is Ana'?",
        "opts": [
          "is",
          "the",
          "and",
          "or"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Thank you",
          "I am fine",
          "Nice to meet you too",
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
        "q": "'Hello' é:",
        "opts": [
          "Agradecimento",
          "Despedida",
          "Pedido",
          "Um cumprimento"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "To you nice meet",
          "Nice to meet you",
          "You nice to meet",
          "Meet you nice to"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Bom dia",
          "Boa tarde",
          "Olá",
          "Boa noite"
        ],
        "ans": 0,
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
    "desc": "Aprenda comida e restaurante - vocabulário ampliado e gramática completa",
    "time": "11 MIN",
    "phrase": "Hello, my name is John",
    "translation": "Olá, meu nome é João",
    "vocab": [
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "Time",
        "Tempo",
        "What time is it?",
        "Hora"
      ],
      [
        "Day",
        "Dia",
        "What day is today?",
        "Dia"
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
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Comida e restaurante</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Comida e restaurante</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is John'",
        "opts": [
          "Até logo",
          "Bom dia",
          "Olá, meu nome é João",
          "Boa noite"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Como vai",
          "Quantos anos",
          "Onde mora",
          "Prazer em conhecê-lo"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "big",
          "bad",
          "good",
          "nice"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is John'?",
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
        "q": "Qual verbo em 'Hello, my name is John'?",
        "opts": [
          "the",
          "and",
          "is",
          "or"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Goodbye",
          "I am fine",
          "Nice to meet you too",
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
        "q": "'Hello' é:",
        "opts": [
          "Agradecimento",
          "Pedido",
          "Um cumprimento",
          "Despedida"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "You nice to meet",
          "Meet you nice to",
          "To you nice meet",
          "Nice to meet you"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Olá",
          "Bom dia",
          "Boa tarde",
          "Boa noite"
        ],
        "ans": 1,
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
    "desc": "Aprenda bebidas - vocabulário ampliado e gramática completa",
    "time": "12 MIN",
    "phrase": "Hello, my name is Mike",
    "translation": "Olá, meu nome é João",
    "vocab": [
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
        "Atenção"
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
        "How are you?",
        "Como está?",
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
        "Food",
        "Comida",
        "I like food",
        "Comida"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Day",
        "Dia",
        "What day is today?",
        "Dia"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Bebidas</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Bebidas</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Mike'",
        "opts": [
          "Bom dia",
          "Boa noite",
          "Até logo",
          "Olá, meu nome é João"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Como vai",
          "Onde mora",
          "Prazer em conhecê-lo",
          "Quantos anos"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "nice",
          "bad",
          "big",
          "good"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Mike'?",
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
        "q": "Qual verbo em 'Hello, my name is Mike'?",
        "opts": [
          "or",
          "and",
          "is",
          "the"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "I am fine",
          "Nice to meet you too",
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
        "q": "'Hello' é:",
        "opts": [
          "Um cumprimento",
          "Despedida",
          "Agradecimento",
          "Pedido"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "To you nice meet",
          "Meet you nice to",
          "Nice to meet you",
          "You nice to meet"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Bom dia",
          "Olá",
          "Boa tarde",
          "Boa noite"
        ],
        "ans": 0,
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
    "desc": "Aprenda pedindo ajuda - vocabulário ampliado e gramática completa",
    "time": "13 MIN",
    "phrase": "Hello, my name is Sarah",
    "translation": "Olá, meu nome é João",
    "vocab": [
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Time",
        "Tempo",
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
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Nice to meet you",
        "Prazer",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Day",
        "Dia",
        "What day is today?",
        "Dia"
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
        "I work as teacher",
        "Trabalho"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Atenção"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Pedindo ajuda</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Pedindo ajuda</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Sarah'",
        "opts": [
          "Boa noite",
          "Olá, meu nome é João",
          "Até logo",
          "Bom dia"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Onde mora",
          "Quantos anos",
          "Prazer em conhecê-lo",
          "Como vai"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "bad",
          "big",
          "nice",
          "good"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Sarah'?",
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
        "q": "Qual verbo em 'Hello, my name is Sarah'?",
        "opts": [
          "is",
          "and",
          "the",
          "or"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "I am fine",
          "Goodbye",
          "Nice to meet you too",
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
        "q": "'Hello' é:",
        "opts": [
          "Despedida",
          "Pedido",
          "Agradecimento",
          "Um cumprimento"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "Meet you nice to",
          "You nice to meet",
          "Nice to meet you",
          "To you nice meet"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa noite",
          "Boa tarde",
          "Olá",
          "Bom dia"
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
    "title": "Direções simples",
    "desc": "Aprenda direções simples - vocabulário ampliado e gramática completa",
    "time": "6 MIN",
    "phrase": "Hello, my name is Sarah",
    "translation": "Olá, meu nome é Ana",
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
        "Excuse me, where is...?",
        "Atenção"
      ],
      [
        "Day",
        "Dia",
        "What day is today?",
        "Dia"
      ],
      [
        "Work",
        "Trabalho",
        "I work as teacher",
        "Trabalho"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "Nice to meet you",
        "Prazer",
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
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Direções simples</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Direções simples</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Sarah'",
        "opts": [
          "Boa noite",
          "Até logo",
          "Olá, meu nome é Ana",
          "Bom dia"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Onde mora",
          "Quantos anos",
          "Como vai",
          "Prazer em conhecê-lo"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "bad",
          "nice",
          "big",
          "good"
        ],
        "ans": 1,
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
        "q": "Qual verbo em 'Hello, my name is Sarah'?",
        "opts": [
          "is",
          "and",
          "or",
          "the"
        ],
        "ans": 0,
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Thank you",
          "Nice to meet you too",
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
          "Como vai?",
          "Quantos anos?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "'Hello' é:",
        "opts": [
          "Pedido",
          "Despedida",
          "Agradecimento",
          "Um cumprimento"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "Meet you nice to",
          "Nice to meet you",
          "To you nice meet",
          "You nice to meet"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Bom dia",
          "Boa tarde",
          "Boa noite",
          "Olá"
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
    "title": "Preços e dinheiro",
    "desc": "Aprenda preços e dinheiro - vocabulário ampliado e gramática completa",
    "time": "7 MIN",
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
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "Food",
        "Comida",
        "I like food",
        "Comida"
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
        "Time",
        "Tempo",
        "What time is it?",
        "Hora"
      ],
      [
        "Work",
        "Trabalho",
        "I work as teacher",
        "Trabalho"
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
        "Atenção"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Preços e dinheiro</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Preços e dinheiro</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Sarah'",
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
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Prazer em conhecê-lo",
          "Como vai",
          "Quantos anos",
          "Onde mora"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "good",
          "bad",
          "nice",
          "big"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Sarah'?",
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
        "q": "Qual verbo em 'Hello, my name is Sarah'?",
        "opts": [
          "and",
          "is",
          "or",
          "the"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "I am fine",
          "Nice to meet you too",
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
          "Quantos anos?",
          "Qual é seu nome?",
          "Como vai?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "'Hello' é:",
        "opts": [
          "Agradecimento",
          "Pedido",
          "Despedida",
          "Um cumprimento"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "You nice to meet",
          "To you nice meet",
          "Nice to meet you",
          "Meet you nice to"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa tarde",
          "Olá",
          "Boa noite",
          "Bom dia"
        ],
        "ans": 3,
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
    "desc": "Aprenda roupas - vocabulário ampliado e gramática completa",
    "time": "8 MIN",
    "phrase": "Hello, my name is Ana",
    "translation": "Olá, meu nome é Sarah",
    "vocab": [
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
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Atenção"
      ],
      [
        "Nice to meet you",
        "Prazer",
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
        "Day",
        "Dia",
        "What day is today?",
        "Dia"
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
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Roupas</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Roupas</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Ana'",
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
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Como vai",
          "Prazer em conhecê-lo",
          "Quantos anos",
          "Onde mora"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "bad",
          "nice",
          "good",
          "big"
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
        "q": "Qual verbo em 'Hello, my name is Ana'?",
        "opts": [
          "the",
          "or",
          "is",
          "and"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Nice to meet you too",
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
        "q": "'Hello' é:",
        "opts": [
          "Pedido",
          "Agradecimento",
          "Despedida",
          "Um cumprimento"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "You nice to meet",
          "Meet you nice to",
          "Nice to meet you",
          "To you nice meet"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa tarde",
          "Bom dia",
          "Boa noite",
          "Olá"
        ],
        "ans": 1,
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
    "desc": "Aprenda saúde básica - vocabulário ampliado e gramática completa",
    "time": "9 MIN",
    "phrase": "Hello, my name is Ana",
    "translation": "Olá, meu nome é João",
    "vocab": [
      [
        "Time",
        "Tempo",
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
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "Nice to meet you",
        "Prazer",
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
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Food",
        "Comida",
        "I like food",
        "Comida"
      ],
      [
        "Day",
        "Dia",
        "What day is today?",
        "Dia"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Saúde básica</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Saúde básica</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Ana'",
        "opts": [
          "Olá, meu nome é João",
          "Até logo",
          "Boa noite",
          "Bom dia"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Como vai",
          "Onde mora",
          "Quantos anos",
          "Prazer em conhecê-lo"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "nice",
          "big",
          "bad",
          "good"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Ana'?",
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
        "q": "Qual verbo em 'Hello, my name is Ana'?",
        "opts": [
          "is",
          "and",
          "or",
          "the"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "I am fine",
          "Thank you",
          "Nice to meet you too",
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
          "Qual é seu nome?",
          "Quantos anos?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "'Hello' é:",
        "opts": [
          "Um cumprimento",
          "Pedido",
          "Agradecimento",
          "Despedida"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "To you nice meet",
          "Nice to meet you",
          "You nice to meet",
          "Meet you nice to"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Olá",
          "Boa noite",
          "Bom dia",
          "Boa tarde"
        ],
        "ans": 2,
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
    "desc": "Aprenda emoções - vocabulário ampliado e gramática completa",
    "time": "10 MIN",
    "phrase": "Hello, my name is Ana",
    "translation": "Olá, meu nome é João",
    "vocab": [
      [
        "Nice to meet you",
        "Prazer",
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
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta"
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
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Food",
        "Comida",
        "I like food",
        "Comida"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Atenção"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Emoções</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Emoções</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Ana'",
        "opts": [
          "Bom dia",
          "Boa noite",
          "Até logo",
          "Olá, meu nome é João"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Quantos anos",
          "Prazer em conhecê-lo",
          "Onde mora",
          "Como vai"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "nice",
          "bad",
          "big",
          "good"
        ],
        "ans": 0,
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
        "q": "Qual verbo em 'Hello, my name is Ana'?",
        "opts": [
          "is",
          "the",
          "and",
          "or"
        ],
        "ans": 0,
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "I am fine",
          "Goodbye",
          "Thank you",
          "Nice to meet you too"
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
        "q": "'Hello' é:",
        "opts": [
          "Agradecimento",
          "Um cumprimento",
          "Despedida",
          "Pedido"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "Nice to meet you",
          "Meet you nice to",
          "You nice to meet",
          "To you nice meet"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa tarde",
          "Bom dia",
          "Olá",
          "Boa noite"
        ],
        "ans": 1,
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
    "desc": "Aprenda convites - vocabulário ampliado e gramática completa",
    "time": "11 MIN",
    "phrase": "Hello, my name is Ana",
    "translation": "Olá, meu nome é Miguel",
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
        "Resposta"
      ],
      [
        "Day",
        "Dia",
        "What day is today?",
        "Dia"
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
        "Food",
        "Comida",
        "I like food",
        "Comida"
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
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "Nice to meet you",
        "Prazer",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Convites</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Convites</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Ana'",
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
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Onde mora",
          "Prazer em conhecê-lo",
          "Quantos anos",
          "Como vai"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "nice",
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
          "Ao se apresentar",
          "Ao dirigir",
          "Ao dormir",
          "Ao comer"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Qual verbo em 'Hello, my name is Ana'?",
        "opts": [
          "the",
          "or",
          "and",
          "is"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Goodbye",
          "I am fine",
          "Nice to meet you too",
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
        "q": "'Hello' é:",
        "opts": [
          "Um cumprimento",
          "Pedido",
          "Agradecimento",
          "Despedida"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "You nice to meet",
          "Nice to meet you",
          "To you nice meet",
          "Meet you nice to"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Bom dia",
          "Boa tarde",
          "Olá",
          "Boa noite"
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
    "title": "Telefone",
    "desc": "Aprenda telefone - vocabulário ampliado e gramática completa",
    "time": "12 MIN",
    "phrase": "Hello, my name is Sarah",
    "translation": "Olá, meu nome é Ana",
    "vocab": [
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
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Nice to meet you",
        "Prazer",
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
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Atenção"
      ],
      [
        "How are you?",
        "Como está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Telefone</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Telefone</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Sarah'",
        "opts": [
          "Boa noite",
          "Olá, meu nome é Ana",
          "Até logo",
          "Bom dia"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Como vai",
          "Onde mora",
          "Quantos anos",
          "Prazer em conhecê-lo"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "nice",
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
          "Ao comer",
          "Ao dormir",
          "Ao se apresentar"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Qual verbo em 'Hello, my name is Sarah'?",
        "opts": [
          "or",
          "and",
          "the",
          "is"
        ],
        "ans": 3,
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Goodbye",
          "Thank you",
          "I am fine",
          "Nice to meet you too"
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
        "q": "'Hello' é:",
        "opts": [
          "Agradecimento",
          "Pedido",
          "Um cumprimento",
          "Despedida"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "To you nice meet",
          "Meet you nice to",
          "You nice to meet",
          "Nice to meet you"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Bom dia",
          "Boa noite",
          "Boa tarde",
          "Olá"
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
    "desc": "Aprenda email e contato - vocabulário ampliado e gramática completa",
    "time": "13 MIN",
    "phrase": "Hello, my name is Ana",
    "translation": "Olá, meu nome é Miguel",
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
        "Excuse me, where is...?",
        "Atenção"
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
        "I work as teacher",
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
        "Day",
        "Dia",
        "What day is today?",
        "Dia"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Email e contato</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Email e contato</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Ana'",
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
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Onde mora",
          "Quantos anos",
          "Prazer em conhecê-lo",
          "Como vai"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "big",
          "bad",
          "nice",
          "good"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Ana'?",
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
        "q": "Qual verbo em 'Hello, my name is Ana'?",
        "opts": [
          "and",
          "is",
          "the",
          "or"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "I am fine",
          "Goodbye",
          "Thank you",
          "Nice to meet you too"
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
        "q": "'Hello' é:",
        "opts": [
          "Pedido",
          "Agradecimento",
          "Despedida",
          "Um cumprimento"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "Nice to meet you",
          "You nice to meet",
          "To you nice meet",
          "Meet you nice to"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa tarde",
          "Boa noite",
          "Olá",
          "Bom dia"
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
    "desc": "Aprenda planos futuros - vocabulário ampliado e gramática completa",
    "time": "6 MIN",
    "phrase": "Hello, my name is Mike",
    "translation": "Olá, meu nome é Miguel",
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
        "Time",
        "Tempo",
        "What time is it?",
        "Hora"
      ],
      [
        "How are you?",
        "Como está?",
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
        "I work as teacher",
        "Trabalho"
      ],
      [
        "Day",
        "Dia",
        "What day is today?",
        "Dia"
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
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Planos futuros</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Planos futuros</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Mike'",
        "opts": [
          "Boa noite",
          "Bom dia",
          "Até logo",
          "Olá, meu nome é Miguel"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Como vai",
          "Quantos anos",
          "Prazer em conhecê-lo",
          "Onde mora"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "bad",
          "big",
          "nice",
          "good"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Mike'?",
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
        "q": "Qual verbo em 'Hello, my name is Mike'?",
        "opts": [
          "the",
          "and",
          "or",
          "is"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Nice to meet you too",
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
          "Qual é seu nome?",
          "Como vai?",
          "Quantos anos?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello' é:",
        "opts": [
          "Um cumprimento",
          "Agradecimento",
          "Despedida",
          "Pedido"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "You nice to meet",
          "Nice to meet you",
          "Meet you nice to",
          "To you nice meet"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Bom dia",
          "Boa noite",
          "Olá",
          "Boa tarde"
        ],
        "ans": 0,
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
    "desc": "Aprenda passado simples - vocabulário ampliado e gramática completa",
    "time": "7 MIN",
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
        "Time",
        "Tempo",
        "What time is it?",
        "Hora"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta"
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
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "Food",
        "Comida",
        "I like food",
        "Comida"
      ],
      [
        "Work",
        "Trabalho",
        "I work as teacher",
        "Trabalho"
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
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Passado simples</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Passado simples</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Ana'",
        "opts": [
          "Boa noite",
          "Olá, meu nome é Ana",
          "Até logo",
          "Bom dia"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Onde mora",
          "Como vai",
          "Quantos anos",
          "Prazer em conhecê-lo"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "big",
          "bad",
          "good",
          "nice"
        ],
        "ans": 3,
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
        "q": "Qual verbo em 'Hello, my name is Ana'?",
        "opts": [
          "is",
          "or",
          "and",
          "the"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Nice to meet you too",
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
        "q": "'Hello' é:",
        "opts": [
          "Um cumprimento",
          "Agradecimento",
          "Pedido",
          "Despedida"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "To you nice meet",
          "You nice to meet",
          "Meet you nice to",
          "Nice to meet you"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa noite",
          "Olá",
          "Boa tarde",
          "Bom dia"
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
    "title": "Experiências",
    "desc": "Aprenda experiências - vocabulário ampliado e gramática completa",
    "time": "8 MIN",
    "phrase": "Hello, my name is John",
    "translation": "Olá, meu nome é Sarah",
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
        "Atenção"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "Time",
        "Tempo",
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
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta"
      ],
      [
        "Work",
        "Trabalho",
        "I work as teacher",
        "Trabalho"
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
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Experiências</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Experiências</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is John'",
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
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Quantos anos",
          "Como vai",
          "Onde mora",
          "Prazer em conhecê-lo"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "good",
          "nice",
          "bad",
          "big"
        ],
        "ans": 1,
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
        "q": "Qual verbo em 'Hello, my name is John'?",
        "opts": [
          "or",
          "is",
          "and",
          "the"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "I am fine",
          "Thank you",
          "Nice to meet you too",
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
        "q": "'Hello' é:",
        "opts": [
          "Agradecimento",
          "Despedida",
          "Pedido",
          "Um cumprimento"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "To you nice meet",
          "You nice to meet",
          "Meet you nice to",
          "Nice to meet you"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa noite",
          "Olá",
          "Bom dia",
          "Boa tarde"
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
    "title": "Preferências",
    "desc": "Aprenda preferências - vocabulário ampliado e gramática completa",
    "time": "9 MIN",
    "phrase": "Hello, my name is Ana",
    "translation": "Olá, meu nome é Sarah",
    "vocab": [
      [
        "Work",
        "Trabalho",
        "I work as teacher",
        "Trabalho"
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
        "I like food",
        "Comida"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta"
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
        "Atenção"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "How are you?",
        "Como está?",
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
        "Nice to meet you",
        "Prazer",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Preferências</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Preferências</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Ana'",
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
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Onde mora",
          "Quantos anos",
          "Prazer em conhecê-lo",
          "Como vai"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "bad",
          "good",
          "big",
          "nice"
        ],
        "ans": 3,
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
        "q": "Qual verbo em 'Hello, my name is Ana'?",
        "opts": [
          "and",
          "is",
          "or",
          "the"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Thank you",
          "Nice to meet you too",
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
        "q": "'Hello' é:",
        "opts": [
          "Um cumprimento",
          "Agradecimento",
          "Pedido",
          "Despedida"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "Nice to meet you",
          "To you nice meet",
          "You nice to meet",
          "Meet you nice to"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Olá",
          "Boa tarde",
          "Boa noite",
          "Bom dia"
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
    "title": "Opiniões simples",
    "desc": "Aprenda opiniões simples - vocabulário ampliado e gramática completa",
    "time": "10 MIN",
    "phrase": "Hello, my name is Mike",
    "translation": "Olá, meu nome é Ana",
    "vocab": [
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
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
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Time",
        "Tempo",
        "What time is it?",
        "Hora"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "How are you?",
        "Como está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta"
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
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Opiniões simples</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Opiniões simples</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Mike'",
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
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Quantos anos",
          "Prazer em conhecê-lo",
          "Como vai",
          "Onde mora"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "good",
          "bad",
          "nice",
          "big"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Mike'?",
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
        "q": "Qual verbo em 'Hello, my name is Mike'?",
        "opts": [
          "and",
          "the",
          "or",
          "is"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Goodbye",
          "Nice to meet you too",
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
        "q": "'Hello' é:",
        "opts": [
          "Pedido",
          "Despedida",
          "Agradecimento",
          "Um cumprimento"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "Meet you nice to",
          "Nice to meet you",
          "You nice to meet",
          "To you nice meet"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa noite",
          "Boa tarde",
          "Olá",
          "Bom dia"
        ],
        "ans": 3,
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
    "desc": "Aprenda comparações - vocabulário ampliado e gramática completa",
    "time": "11 MIN",
    "phrase": "Hello, my name is Sarah",
    "translation": "Olá, meu nome é Miguel",
    "vocab": [
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Atenção"
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
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta"
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
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Work",
        "Trabalho",
        "I work as teacher",
        "Trabalho"
      ],
      [
        "Food",
        "Comida",
        "I like food",
        "Comida"
      ],
      [
        "Day",
        "Dia",
        "What day is today?",
        "Dia"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Comparações</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Comparações</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Sarah'",
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
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Como vai",
          "Prazer em conhecê-lo",
          "Quantos anos",
          "Onde mora"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "big",
          "good",
          "bad",
          "nice"
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
        "q": "Qual verbo em 'Hello, my name is Sarah'?",
        "opts": [
          "and",
          "is",
          "the",
          "or"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Goodbye",
          "Thank you",
          "Nice to meet you too",
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
        "q": "'Hello' é:",
        "opts": [
          "Despedida",
          "Agradecimento",
          "Pedido",
          "Um cumprimento"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "Nice to meet you",
          "You nice to meet",
          "To you nice meet",
          "Meet you nice to"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa tarde",
          "Bom dia",
          "Olá",
          "Boa noite"
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
    "desc": "Aprenda conselhos - vocabulário ampliado e gramática completa",
    "time": "12 MIN",
    "phrase": "Hello, my name is Sarah",
    "translation": "Olá, meu nome é João",
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
        "Resposta"
      ],
      [
        "How are you?",
        "Como está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Atenção"
      ],
      [
        "Day",
        "Dia",
        "What day is today?",
        "Dia"
      ],
      [
        "Work",
        "Trabalho",
        "I work as teacher",
        "Trabalho"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Conselhos</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Conselhos</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Sarah'",
        "opts": [
          "Boa noite",
          "Bom dia",
          "Até logo",
          "Olá, meu nome é João"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Quantos anos",
          "Prazer em conhecê-lo",
          "Onde mora",
          "Como vai"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "nice",
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
          "Ao comer",
          "Ao dormir",
          "Ao dirigir",
          "Ao se apresentar"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Qual verbo em 'Hello, my name is Sarah'?",
        "opts": [
          "the",
          "and",
          "is",
          "or"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Thank you",
          "I am fine",
          "Goodbye",
          "Nice to meet you too"
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
        "q": "'Hello' é:",
        "opts": [
          "Um cumprimento",
          "Despedida",
          "Agradecimento",
          "Pedido"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "Nice to meet you",
          "Meet you nice to",
          "You nice to meet",
          "To you nice meet"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa noite",
          "Boa tarde",
          "Bom dia",
          "Olá"
        ],
        "ans": 2,
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
    "desc": "Aprenda convite para café - vocabulário ampliado e gramática completa",
    "time": "13 MIN",
    "phrase": "Hello, my name is John",
    "translation": "Olá, meu nome é Miguel",
    "vocab": [
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Day",
        "Dia",
        "What day is today?",
        "Dia"
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
        "Work",
        "Trabalho",
        "I work as teacher",
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
        "Como está?",
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
        "Time",
        "Tempo",
        "What time is it?",
        "Hora"
      ],
      [
        "Nice to meet you",
        "Prazer",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Convite para café</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Convite para café</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is John'",
        "opts": [
          "Olá, meu nome é Miguel",
          "Bom dia",
          "Até logo",
          "Boa noite"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Onde mora",
          "Prazer em conhecê-lo",
          "Como vai",
          "Quantos anos"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "big",
          "good",
          "bad",
          "nice"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is John'?",
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
        "q": "Qual verbo em 'Hello, my name is John'?",
        "opts": [
          "is",
          "the",
          "or",
          "and"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Nice to meet you too",
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
        "q": "'Hello' é:",
        "opts": [
          "Pedido",
          "Agradecimento",
          "Um cumprimento",
          "Despedida"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "You nice to meet",
          "Meet you nice to",
          "Nice to meet you",
          "To you nice meet"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa noite",
          "Bom dia",
          "Boa tarde",
          "Olá"
        ],
        "ans": 1,
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
    "desc": "Aprenda conhecendo vizinhos - vocabulário ampliado e gramática completa",
    "time": "6 MIN",
    "phrase": "Hello, my name is Ana",
    "translation": "Olá, meu nome é Miguel",
    "vocab": [
      [
        "Work",
        "Trabalho",
        "I work as teacher",
        "Trabalho"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta"
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
        "Atenção"
      ],
      [
        "Nice to meet you",
        "Prazer",
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
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "How are you?",
        "Como está?",
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
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Conhecendo vizinhos</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Conhecendo vizinhos</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Ana'",
        "opts": [
          "Bom dia",
          "Até logo",
          "Boa noite",
          "Olá, meu nome é Miguel"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Como vai",
          "Onde mora",
          "Prazer em conhecê-lo",
          "Quantos anos"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "bad",
          "good",
          "nice",
          "big"
        ],
        "ans": 2,
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
        "q": "Qual verbo em 'Hello, my name is Ana'?",
        "opts": [
          "is",
          "the",
          "or",
          "and"
        ],
        "ans": 0,
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Goodbye",
          "Thank you",
          "Nice to meet you too",
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
          "Como vai?",
          "Quantos anos?"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "'Hello' é:",
        "opts": [
          "Um cumprimento",
          "Despedida",
          "Pedido",
          "Agradecimento"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "Meet you nice to",
          "You nice to meet",
          "Nice to meet you",
          "To you nice meet"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa tarde",
          "Bom dia",
          "Boa noite",
          "Olá"
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
    "desc": "Aprenda festa e celebração - vocabulário ampliado e gramática completa",
    "time": "7 MIN",
    "phrase": "Hello, my name is Mike",
    "translation": "Olá, meu nome é Miguel",
    "vocab": [
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
        "Resposta"
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
        "Time",
        "Tempo",
        "What time is it?",
        "Hora"
      ],
      [
        "Work",
        "Trabalho",
        "I work as teacher",
        "Trabalho"
      ],
      [
        "Day",
        "Dia",
        "What day is today?",
        "Dia"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Festa e celebração</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Festa e celebração</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Mike'",
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
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Prazer em conhecê-lo",
          "Como vai",
          "Onde mora",
          "Quantos anos"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "big",
          "nice",
          "bad",
          "good"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Mike'?",
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
        "q": "Qual verbo em 'Hello, my name is Mike'?",
        "opts": [
          "is",
          "the",
          "or",
          "and"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Thank you",
          "I am fine",
          "Nice to meet you too",
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
        "q": "'Hello' é:",
        "opts": [
          "Agradecimento",
          "Despedida",
          "Pedido",
          "Um cumprimento"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "Meet you nice to",
          "Nice to meet you",
          "To you nice meet",
          "You nice to meet"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa tarde",
          "Boa noite",
          "Bom dia",
          "Olá"
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
    "title": "Filmes e música",
    "desc": "Aprenda filmes e música - vocabulário ampliado e gramática completa",
    "time": "8 MIN",
    "phrase": "Hello, my name is Sarah",
    "translation": "Olá, meu nome é Ana",
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
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "Day",
        "Dia",
        "What day is today?",
        "Dia"
      ],
      [
        "Work",
        "Trabalho",
        "I work as teacher",
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
        "Atenção"
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
        "Resposta"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Filmes e música</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Filmes e música</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Sarah'",
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
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Onde mora",
          "Como vai",
          "Quantos anos",
          "Prazer em conhecê-lo"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "bad",
          "nice",
          "good",
          "big"
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
        "q": "Qual verbo em 'Hello, my name is Sarah'?",
        "opts": [
          "the",
          "and",
          "or",
          "is"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Thank you",
          "I am fine",
          "Nice to meet you too",
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
        "q": "'Hello' é:",
        "opts": [
          "Despedida",
          "Um cumprimento",
          "Pedido",
          "Agradecimento"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "Nice to meet you",
          "Meet you nice to",
          "You nice to meet",
          "To you nice meet"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa noite",
          "Olá",
          "Boa tarde",
          "Bom dia"
        ],
        "ans": 3,
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
    "desc": "Aprenda esportes - vocabulário ampliado e gramática completa",
    "time": "9 MIN",
    "phrase": "Hello, my name is Ana",
    "translation": "Olá, meu nome é Sarah",
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
        "Resposta"
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
        "I work as teacher",
        "Trabalho"
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
        "Good evening, welcome!",
        "Chegada noite"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Esportes</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Esportes</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Ana'",
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
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Como vai",
          "Quantos anos",
          "Prazer em conhecê-lo",
          "Onde mora"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "nice",
          "bad",
          "big",
          "good"
        ],
        "ans": 0,
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
        "q": "Qual verbo em 'Hello, my name is Ana'?",
        "opts": [
          "or",
          "is",
          "the",
          "and"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Nice to meet you too",
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
          "Qual é seu nome?",
          "Onde mora?",
          "Quantos anos?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello' é:",
        "opts": [
          "Um cumprimento",
          "Despedida",
          "Pedido",
          "Agradecimento"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "You nice to meet",
          "Meet you nice to",
          "Nice to meet you",
          "To you nice meet"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa noite",
          "Bom dia",
          "Boa tarde",
          "Olá"
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
    "title": "Viagem curta",
    "desc": "Aprenda viagem curta - vocabulário ampliado e gramática completa",
    "time": "10 MIN",
    "phrase": "Hello, my name is Sarah",
    "translation": "Olá, meu nome é Ana",
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
        "Resposta"
      ],
      [
        "Food",
        "Comida",
        "I like food",
        "Comida"
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
        "Nice to meet you",
        "Prazer",
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
        "House",
        "Casa",
        "My house is big",
        "Casa"
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
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Viagem curta</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Viagem curta</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Sarah'",
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
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Quantos anos",
          "Como vai",
          "Prazer em conhecê-lo",
          "Onde mora"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "nice",
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
          "Ao se apresentar",
          "Ao comer",
          "Ao dirigir",
          "Ao dormir"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Qual verbo em 'Hello, my name is Sarah'?",
        "opts": [
          "the",
          "and",
          "is",
          "or"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Nice to meet you too",
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
          "Como vai?",
          "Onde mora?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello' é:",
        "opts": [
          "Pedido",
          "Um cumprimento",
          "Agradecimento",
          "Despedida"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "You nice to meet",
          "Nice to meet you",
          "Meet you nice to",
          "To you nice meet"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Olá",
          "Boa tarde",
          "Boa noite",
          "Bom dia"
        ],
        "ans": 3,
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
    "desc": "Aprenda cultura local - vocabulário ampliado e gramática completa",
    "time": "11 MIN",
    "phrase": "Hello, my name is Ana",
    "translation": "Olá, meu nome é Sarah",
    "vocab": [
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Nice to meet you",
        "Prazer",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Atenção"
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
        "Time",
        "Tempo",
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
        "How are you?",
        "Como está?",
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
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Cultura local</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Cultura local</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Ana'",
        "opts": [
          "Boa noite",
          "Até logo",
          "Olá, meu nome é Sarah",
          "Bom dia"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Como vai",
          "Quantos anos",
          "Prazer em conhecê-lo",
          "Onde mora"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "bad",
          "nice",
          "good",
          "big"
        ],
        "ans": 1,
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
        "q": "Qual verbo em 'Hello, my name is Ana'?",
        "opts": [
          "and",
          "the",
          "is",
          "or"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Nice to meet you too",
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
          "Qual é seu nome?",
          "Como vai?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "'Hello' é:",
        "opts": [
          "Despedida",
          "Um cumprimento",
          "Agradecimento",
          "Pedido"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "You nice to meet",
          "To you nice meet",
          "Meet you nice to",
          "Nice to meet you"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa tarde",
          "Olá",
          "Boa noite",
          "Bom dia"
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
    "title": "Olá e apresentações",
    "desc": "Aprenda olá e apresentações - vocabulário ampliado e gramática completa",
    "time": "12 MIN",
    "phrase": "Hello, my name is Sarah",
    "translation": "Olá, meu nome é Sarah",
    "vocab": [
      [
        "Nice to meet you",
        "Prazer",
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
        "Work",
        "Trabalho",
        "I work as teacher",
        "Trabalho"
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
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "How are you?",
        "Como está?",
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
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Olá e apresentações</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Olá e apresentações</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Sarah'",
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
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Prazer em conhecê-lo",
          "Onde mora",
          "Como vai",
          "Quantos anos"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "good",
          "big",
          "bad",
          "nice"
        ],
        "ans": 3,
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
        "q": "Qual verbo em 'Hello, my name is Sarah'?",
        "opts": [
          "the",
          "or",
          "is",
          "and"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Nice to meet you too",
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
        "q": "'Hello' é:",
        "opts": [
          "Pedido",
          "Um cumprimento",
          "Despedida",
          "Agradecimento"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "You nice to meet",
          "Meet you nice to",
          "Nice to meet you",
          "To you nice meet"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa tarde",
          "Boa noite",
          "Bom dia",
          "Olá"
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
    "title": "Dizendo seu nome",
    "desc": "Aprenda dizendo seu nome - vocabulário ampliado e gramática completa",
    "time": "13 MIN",
    "phrase": "Hello, my name is John",
    "translation": "Olá, meu nome é João",
    "vocab": [
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "Time",
        "Tempo",
        "What time is it?",
        "Hora"
      ],
      [
        "How are you?",
        "Como está?",
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
        "Family",
        "Família",
        "My family is big",
        "Família"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Dizendo seu nome</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Dizendo seu nome</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is John'",
        "opts": [
          "Bom dia",
          "Olá, meu nome é João",
          "Boa noite",
          "Até logo"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Como vai",
          "Prazer em conhecê-lo",
          "Quantos anos",
          "Onde mora"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "nice",
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
          "Ao se apresentar",
          "Ao dormir",
          "Ao comer",
          "Ao dirigir"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Qual verbo em 'Hello, my name is John'?",
        "opts": [
          "the",
          "and",
          "or",
          "is"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "I am fine",
          "Thank you",
          "Goodbye",
          "Nice to meet you too"
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
        "q": "'Hello' é:",
        "opts": [
          "Despedida",
          "Um cumprimento",
          "Pedido",
          "Agradecimento"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "Nice to meet you",
          "You nice to meet",
          "To you nice meet",
          "Meet you nice to"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa tarde",
          "Bom dia",
          "Boa noite",
          "Olá"
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
    "desc": "Aprenda de onde você é - vocabulário ampliado e gramática completa",
    "time": "6 MIN",
    "phrase": "Hello, my name is Ana",
    "translation": "Olá, meu nome é Miguel",
    "vocab": [
      [
        "How are you?",
        "Como está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Work",
        "Trabalho",
        "I work as teacher",
        "Trabalho"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta"
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
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Atenção"
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
        "Nice to meet you",
        "Prazer",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: De onde você é</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: De onde você é</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Ana'",
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
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Onde mora",
          "Quantos anos",
          "Prazer em conhecê-lo",
          "Como vai"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "big",
          "good",
          "bad",
          "nice"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Ana'?",
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
        "q": "Qual verbo em 'Hello, my name is Ana'?",
        "opts": [
          "or",
          "and",
          "the",
          "is"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "I am fine",
          "Goodbye",
          "Thank you",
          "Nice to meet you too"
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
        "q": "'Hello' é:",
        "opts": [
          "Pedido",
          "Um cumprimento",
          "Agradecimento",
          "Despedida"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "Meet you nice to",
          "Nice to meet you",
          "You nice to meet",
          "To you nice meet"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa noite",
          "Bom dia",
          "Boa tarde",
          "Olá"
        ],
        "ans": 1,
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
    "desc": "Aprenda perguntando o nome - vocabulário ampliado e gramática completa",
    "time": "7 MIN",
    "phrase": "Hello, my name is Ana",
    "translation": "Olá, meu nome é Miguel",
    "vocab": [
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
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
        "Nice to meet you",
        "Prazer",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Atenção"
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
        "I work as teacher",
        "Trabalho"
      ],
      [
        "Day",
        "Dia",
        "What day is today?",
        "Dia"
      ],
      [
        "Time",
        "Tempo",
        "What time is it?",
        "Hora"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Perguntando o nome</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Perguntando o nome</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Ana'",
        "opts": [
          "Boa noite",
          "Bom dia",
          "Olá, meu nome é Miguel",
          "Até logo"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Quantos anos",
          "Onde mora",
          "Como vai",
          "Prazer em conhecê-lo"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "good",
          "nice",
          "big",
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
        "q": "Qual verbo em 'Hello, my name is Ana'?",
        "opts": [
          "is",
          "and",
          "or",
          "the"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Nice to meet you too",
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
        "q": "'Hello' é:",
        "opts": [
          "Pedido",
          "Um cumprimento",
          "Agradecimento",
          "Despedida"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "You nice to meet",
          "Nice to meet you",
          "Meet you nice to",
          "To you nice meet"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa tarde",
          "Boa noite",
          "Bom dia",
          "Olá"
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
    "desc": "Aprenda idade e aniversário - vocabulário ampliado e gramática completa",
    "time": "8 MIN",
    "phrase": "Hello, my name is John",
    "translation": "Olá, meu nome é João",
    "vocab": [
      [
        "How are you?",
        "Como está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Nice to meet you",
        "Prazer",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta"
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
      ],
      [
        "Work",
        "Trabalho",
        "I work as teacher",
        "Trabalho"
      ],
      [
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
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
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Idade e aniversário</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Idade e aniversário</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is John'",
        "opts": [
          "Boa noite",
          "Bom dia",
          "Até logo",
          "Olá, meu nome é João"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Quantos anos",
          "Prazer em conhecê-lo",
          "Onde mora",
          "Como vai"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "nice",
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
        "q": "Qual verbo em 'Hello, my name is John'?",
        "opts": [
          "or",
          "is",
          "and",
          "the"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Nice to meet you too",
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
          "Quantos anos?",
          "Onde mora?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello' é:",
        "opts": [
          "Pedido",
          "Um cumprimento",
          "Agradecimento",
          "Despedida"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "Meet you nice to",
          "Nice to meet you",
          "To you nice meet",
          "You nice to meet"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Bom dia",
          "Boa noite",
          "Boa tarde",
          "Olá"
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
    "title": "Família básica",
    "desc": "Aprenda família básica - vocabulário ampliado e gramática completa",
    "time": "9 MIN",
    "phrase": "Hello, my name is Sarah",
    "translation": "Olá, meu nome é Ana",
    "vocab": [
      [
        "Time",
        "Tempo",
        "What time is it?",
        "Hora"
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
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ],
      [
        "How are you?",
        "Como está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Food",
        "Comida",
        "I like food",
        "Comida"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
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
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Família básica</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Família básica</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Sarah'",
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
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Quantos anos",
          "Prazer em conhecê-lo",
          "Onde mora",
          "Como vai"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "nice",
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
          "Ao se apresentar",
          "Ao dormir",
          "Ao comer",
          "Ao dirigir"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Qual verbo em 'Hello, my name is Sarah'?",
        "opts": [
          "the",
          "or",
          "and",
          "is"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "I am fine",
          "Nice to meet you too",
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
          "Onde mora?",
          "Como vai?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "'Hello' é:",
        "opts": [
          "Despedida",
          "Um cumprimento",
          "Agradecimento",
          "Pedido"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "To you nice meet",
          "You nice to meet",
          "Nice to meet you",
          "Meet you nice to"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa tarde",
          "Bom dia",
          "Olá",
          "Boa noite"
        ],
        "ans": 1,
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
    "desc": "Aprenda cumprimentos formais - vocabulário ampliado e gramática completa",
    "time": "10 MIN",
    "phrase": "Hello, my name is Sarah",
    "translation": "Olá, meu nome é Miguel",
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
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Atenção"
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
        "I like food",
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
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Cumprimentos formais</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Cumprimentos formais</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Sarah'",
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
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Prazer em conhecê-lo",
          "Quantos anos",
          "Como vai",
          "Onde mora"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "bad",
          "good",
          "big",
          "nice"
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
        "q": "Qual verbo em 'Hello, my name is Sarah'?",
        "opts": [
          "or",
          "the",
          "is",
          "and"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Nice to meet you too",
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
          "Qual é seu nome?",
          "Como vai?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "'Hello' é:",
        "opts": [
          "Um cumprimento",
          "Agradecimento",
          "Despedida",
          "Pedido"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "You nice to meet",
          "Nice to meet you",
          "To you nice meet",
          "Meet you nice to"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Bom dia",
          "Boa tarde",
          "Olá",
          "Boa noite"
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
    "title": "Despedidas",
    "desc": "Aprenda despedidas - vocabulário ampliado e gramática completa",
    "time": "11 MIN",
    "phrase": "Hello, my name is John",
    "translation": "Olá, meu nome é Miguel",
    "vocab": [
      [
        "Nice to meet you",
        "Prazer",
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
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Work",
        "Trabalho",
        "I work as teacher",
        "Trabalho"
      ],
      [
        "Day",
        "Dia",
        "What day is today?",
        "Dia"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta"
      ],
      [
        "How are you?",
        "Como está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Food",
        "Comida",
        "I like food",
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
        "Good evening, welcome!",
        "Chegada noite"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Despedidas</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Despedidas</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is John'",
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
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Como vai",
          "Prazer em conhecê-lo",
          "Quantos anos",
          "Onde mora"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "big",
          "nice",
          "bad",
          "good"
        ],
        "ans": 1,
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
        "q": "Qual verbo em 'Hello, my name is John'?",
        "opts": [
          "or",
          "the",
          "is",
          "and"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Goodbye",
          "Nice to meet you too",
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
          "Como vai?",
          "Qual é seu nome?",
          "Onde mora?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "'Hello' é:",
        "opts": [
          "Agradecimento",
          "Pedido",
          "Um cumprimento",
          "Despedida"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "To you nice meet",
          "Nice to meet you",
          "Meet you nice to",
          "You nice to meet"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa tarde",
          "Bom dia",
          "Boa noite",
          "Olá"
        ],
        "ans": 1,
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
    "desc": "Aprenda como você está - vocabulário ampliado e gramática completa",
    "time": "12 MIN",
    "phrase": "Hello, my name is John",
    "translation": "Olá, meu nome é Sarah",
    "vocab": [
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Atenção"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta"
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
        "Work",
        "Trabalho",
        "I work as teacher",
        "Trabalho"
      ],
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
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
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Como você está</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Como você está</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is John'",
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
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Como vai",
          "Quantos anos",
          "Prazer em conhecê-lo",
          "Onde mora"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "nice",
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
          "Ao comer",
          "Ao se apresentar",
          "Ao dirigir",
          "Ao dormir"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Qual verbo em 'Hello, my name is John'?",
        "opts": [
          "or",
          "the",
          "and",
          "is"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "I am fine",
          "Thank you",
          "Goodbye",
          "Nice to meet you too"
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
        "q": "'Hello' é:",
        "opts": [
          "Um cumprimento",
          "Despedida",
          "Pedido",
          "Agradecimento"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "You nice to meet",
          "Nice to meet you",
          "Meet you nice to",
          "To you nice meet"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa noite",
          "Olá",
          "Boa tarde",
          "Bom dia"
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
    "desc": "Aprenda números e telefone - vocabulário ampliado e gramática completa",
    "time": "13 MIN",
    "phrase": "Hello, my name is Mike",
    "translation": "Olá, meu nome é Ana",
    "vocab": [
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "How are you?",
        "Como está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Nice to meet you",
        "Prazer",
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
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Time",
        "Tempo",
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
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta"
      ],
      [
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Números e telefone</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Números e telefone</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Mike'",
        "opts": [
          "Até logo",
          "Olá, meu nome é Ana",
          "Bom dia",
          "Boa noite"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Quantos anos",
          "Prazer em conhecê-lo",
          "Onde mora",
          "Como vai"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "bad",
          "good",
          "big",
          "nice"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Mike'?",
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
        "q": "Qual verbo em 'Hello, my name is Mike'?",
        "opts": [
          "is",
          "or",
          "and",
          "the"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Goodbye",
          "Thank you",
          "I am fine",
          "Nice to meet you too"
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
        "q": "'Hello' é:",
        "opts": [
          "Despedida",
          "Agradecimento",
          "Um cumprimento",
          "Pedido"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "Meet you nice to",
          "You nice to meet",
          "To you nice meet",
          "Nice to meet you"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Bom dia",
          "Boa tarde",
          "Boa noite",
          "Olá"
        ],
        "ans": 0,
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
    "desc": "Aprenda endereço e cidade - vocabulário ampliado e gramática completa",
    "time": "6 MIN",
    "phrase": "Hello, my name is Ana",
    "translation": "Olá, meu nome é Ana",
    "vocab": [
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
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
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Day",
        "Dia",
        "What day is today?",
        "Dia"
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
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta"
      ],
      [
        "Nice to meet you",
        "Prazer",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Endereço e cidade</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Endereço e cidade</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
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
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Quantos anos",
          "Como vai",
          "Prazer em conhecê-lo",
          "Onde mora"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "big",
          "good",
          "nice",
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
          "Ao dormir",
          "Ao dirigir"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Qual verbo em 'Hello, my name is Ana'?",
        "opts": [
          "and",
          "the",
          "is",
          "or"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Nice to meet you too",
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
        "q": "'Hello' é:",
        "opts": [
          "Pedido",
          "Um cumprimento",
          "Despedida",
          "Agradecimento"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "To you nice meet",
          "You nice to meet",
          "Nice to meet you",
          "Meet you nice to"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Bom dia",
          "Olá",
          "Boa noite",
          "Boa tarde"
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
    "desc": "Aprenda profissão simples - vocabulário ampliado e gramática completa",
    "time": "7 MIN",
    "phrase": "Hello, my name is Mike",
    "translation": "Olá, meu nome é João",
    "vocab": [
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Food",
        "Comida",
        "I like food",
        "Comida"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "Day",
        "Dia",
        "What day is today?",
        "Dia"
      ],
      [
        "Time",
        "Tempo",
        "What time is it?",
        "Hora"
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
        "Resposta"
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
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Profissão simples</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Profissão simples</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Mike'",
        "opts": [
          "Bom dia",
          "Olá, meu nome é João",
          "Até logo",
          "Boa noite"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Prazer em conhecê-lo",
          "Onde mora",
          "Quantos anos",
          "Como vai"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "bad",
          "big",
          "nice",
          "good"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Mike'?",
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
        "q": "Qual verbo em 'Hello, my name is Mike'?",
        "opts": [
          "is",
          "and",
          "or",
          "the"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Goodbye",
          "I am fine",
          "Thank you",
          "Nice to meet you too"
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
        "q": "'Hello' é:",
        "opts": [
          "Pedido",
          "Despedida",
          "Agradecimento",
          "Um cumprimento"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "Nice to meet you",
          "To you nice meet",
          "You nice to meet",
          "Meet you nice to"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Olá",
          "Bom dia",
          "Boa tarde",
          "Boa noite"
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
    "desc": "Aprenda hobbies favoritos - vocabulário ampliado e gramática completa",
    "time": "8 MIN",
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
        "Day",
        "Dia",
        "What day is today?",
        "Dia"
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
        "Excuse me, where is...?",
        "Atenção"
      ],
      [
        "Nice to meet you",
        "Prazer",
        "Nice to meet you, John!",
        "Conhecer alguém"
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
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "Food",
        "Comida",
        "I like food",
        "Comida"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Hobbies favoritos</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Hobbies favoritos</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Sarah'",
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
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Onde mora",
          "Quantos anos",
          "Como vai",
          "Prazer em conhecê-lo"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "good",
          "bad",
          "nice",
          "big"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Sarah'?",
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
        "q": "Qual verbo em 'Hello, my name is Sarah'?",
        "opts": [
          "or",
          "and",
          "is",
          "the"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Nice to meet you too",
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
        "q": "'Hello' é:",
        "opts": [
          "Um cumprimento",
          "Pedido",
          "Agradecimento",
          "Despedida"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "To you nice meet",
          "You nice to meet",
          "Meet you nice to",
          "Nice to meet you"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa noite",
          "Boa tarde",
          "Olá",
          "Bom dia"
        ],
        "ans": 3,
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
    "desc": "Aprenda comida favorita - vocabulário ampliado e gramática completa",
    "time": "9 MIN",
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
        "Time",
        "Tempo",
        "What time is it?",
        "Hora"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "Nice to meet you",
        "Prazer",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Day",
        "Dia",
        "What day is today?",
        "Dia"
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
        "I work as teacher",
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
        "How are you?",
        "Como está?",
        "How are you today?",
        "Bem-estar"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Comida favorita</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Comida favorita</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Sarah'",
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
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Onde mora",
          "Como vai",
          "Prazer em conhecê-lo",
          "Quantos anos"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "big",
          "nice",
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
          "Ao se apresentar",
          "Ao comer",
          "Ao dirigir"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Qual verbo em 'Hello, my name is Sarah'?",
        "opts": [
          "the",
          "or",
          "and",
          "is"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Goodbye",
          "Thank you",
          "Nice to meet you too",
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
          "Como vai?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "'Hello' é:",
        "opts": [
          "Pedido",
          "Despedida",
          "Agradecimento",
          "Um cumprimento"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "Meet you nice to",
          "To you nice meet",
          "Nice to meet you",
          "You nice to meet"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa tarde",
          "Boa noite",
          "Bom dia",
          "Olá"
        ],
        "ans": 2,
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
    "desc": "Aprenda cores favoritas - vocabulário ampliado e gramática completa",
    "time": "10 MIN",
    "phrase": "Hello, my name is Sarah",
    "translation": "Olá, meu nome é João",
    "vocab": [
      [
        "Time",
        "Tempo",
        "What time is it?",
        "Hora"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Atenção"
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
        "Food",
        "Comida",
        "I like food",
        "Comida"
      ],
      [
        "Work",
        "Trabalho",
        "I work as teacher",
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
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "How are you?",
        "Como está?",
        "How are you today?",
        "Bem-estar"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Cores favoritas</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Cores favoritas</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Sarah'",
        "opts": [
          "Bom dia",
          "Até logo",
          "Olá, meu nome é João",
          "Boa noite"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Quantos anos",
          "Como vai",
          "Prazer em conhecê-lo",
          "Onde mora"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "good",
          "nice",
          "bad",
          "big"
        ],
        "ans": 1,
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
        "q": "Qual verbo em 'Hello, my name is Sarah'?",
        "opts": [
          "is",
          "or",
          "and",
          "the"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Nice to meet you too",
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
          "Qual é seu nome?",
          "Quantos anos?",
          "Onde mora?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello' é:",
        "opts": [
          "Agradecimento",
          "Despedida",
          "Um cumprimento",
          "Pedido"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "Nice to meet you",
          "Meet you nice to",
          "You nice to meet",
          "To you nice meet"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa noite",
          "Boa tarde",
          "Bom dia",
          "Olá"
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
    "title": "Tempo e clima",
    "desc": "Aprenda tempo e clima - vocabulário ampliado e gramática completa",
    "time": "11 MIN",
    "phrase": "Hello, my name is John",
    "translation": "Olá, meu nome é Ana",
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
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta"
      ],
      [
        "Time",
        "Tempo",
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
        "Work",
        "Trabalho",
        "I work as teacher",
        "Trabalho"
      ],
      [
        "Day",
        "Dia",
        "What day is today?",
        "Dia"
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
        "Family",
        "Família",
        "My family is big",
        "Família"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Tempo e clima</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Tempo e clima</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is John'",
        "opts": [
          "Até logo",
          "Olá, meu nome é Ana",
          "Bom dia",
          "Boa noite"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Onde mora",
          "Prazer em conhecê-lo",
          "Quantos anos",
          "Como vai"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "bad",
          "good",
          "big",
          "nice"
        ],
        "ans": 3,
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
        "q": "Qual verbo em 'Hello, my name is John'?",
        "opts": [
          "and",
          "or",
          "the",
          "is"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Thank you",
          "Goodbye",
          "I am fine",
          "Nice to meet you too"
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
        "q": "'Hello' é:",
        "opts": [
          "Despedida",
          "Pedido",
          "Agradecimento",
          "Um cumprimento"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "You nice to meet",
          "Meet you nice to",
          "Nice to meet you",
          "To you nice meet"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa noite",
          "Bom dia",
          "Boa tarde",
          "Olá"
        ],
        "ans": 1,
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
    "desc": "Aprenda dias da semana - vocabulário ampliado e gramática completa",
    "time": "12 MIN",
    "phrase": "Hello, my name is Mike",
    "translation": "Olá, meu nome é Miguel",
    "vocab": [
      [
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "How are you?",
        "Como está?",
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
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Atenção"
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
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Day",
        "Dia",
        "What day is today?",
        "Dia"
      ],
      [
        "Food",
        "Comida",
        "I like food",
        "Comida"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Dias da semana</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Dias da semana</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Mike'",
        "opts": [
          "Olá, meu nome é Miguel",
          "Bom dia",
          "Até logo",
          "Boa noite"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Onde mora",
          "Quantos anos",
          "Prazer em conhecê-lo",
          "Como vai"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "bad",
          "good",
          "nice",
          "big"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Mike'?",
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
        "q": "Qual verbo em 'Hello, my name is Mike'?",
        "opts": [
          "or",
          "is",
          "and",
          "the"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "I am fine",
          "Goodbye",
          "Thank you",
          "Nice to meet you too"
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
        "q": "'Hello' é:",
        "opts": [
          "Despedida",
          "Um cumprimento",
          "Pedido",
          "Agradecimento"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "Nice to meet you",
          "You nice to meet",
          "Meet you nice to",
          "To you nice meet"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa noite",
          "Bom dia",
          "Olá",
          "Boa tarde"
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
    "title": "Horas e compromissos",
    "desc": "Aprenda horas e compromissos - vocabulário ampliado e gramática completa",
    "time": "13 MIN",
    "phrase": "Hello, my name is John",
    "translation": "Olá, meu nome é Ana",
    "vocab": [
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Nice to meet you",
        "Prazer",
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
        "Day",
        "Dia",
        "What day is today?",
        "Dia"
      ],
      [
        "Food",
        "Comida",
        "I like food",
        "Comida"
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
        "Resposta"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Horas e compromissos</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Horas e compromissos</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is John'",
        "opts": [
          "Bom dia",
          "Até logo",
          "Olá, meu nome é Ana",
          "Boa noite"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Prazer em conhecê-lo",
          "Quantos anos",
          "Onde mora",
          "Como vai"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "big",
          "bad",
          "good",
          "nice"
        ],
        "ans": 3,
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
        "q": "Qual verbo em 'Hello, my name is John'?",
        "opts": [
          "the",
          "and",
          "is",
          "or"
        ],
        "ans": 2,
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Thank you",
          "I am fine",
          "Goodbye",
          "Nice to meet you too"
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
        "q": "'Hello' é:",
        "opts": [
          "Pedido",
          "Agradecimento",
          "Um cumprimento",
          "Despedida"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "Meet you nice to",
          "To you nice meet",
          "Nice to meet you",
          "You nice to meet"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa noite",
          "Boa tarde",
          "Olá",
          "Bom dia"
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
    "desc": "Aprenda família estendida - vocabulário ampliado e gramática completa",
    "time": "6 MIN",
    "phrase": "Hello, my name is Ana",
    "translation": "Olá, meu nome é Miguel",
    "vocab": [
      [
        "Day",
        "Dia",
        "What day is today?",
        "Dia"
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
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Nice to meet you",
        "Prazer",
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
        "I work as teacher",
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
      ],
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Família estendida</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Família estendida</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Ana'",
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
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Prazer em conhecê-lo",
          "Onde mora",
          "Quantos anos",
          "Como vai"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "nice",
          "big",
          "bad",
          "good"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Ana'?",
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
        "q": "Qual verbo em 'Hello, my name is Ana'?",
        "opts": [
          "the",
          "or",
          "is",
          "and"
        ],
        "ans": 2,
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Thank you",
          "Goodbye",
          "Nice to meet you too",
          "I am fine"
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
        "q": "'Hello' é:",
        "opts": [
          "Agradecimento",
          "Pedido",
          "Despedida",
          "Um cumprimento"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "Nice to meet you",
          "To you nice meet",
          "You nice to meet",
          "Meet you nice to"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa noite",
          "Olá",
          "Boa tarde",
          "Bom dia"
        ],
        "ans": 3,
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
    "desc": "Aprenda casa e moradia - vocabulário ampliado e gramática completa",
    "time": "7 MIN",
    "phrase": "Hello, my name is Ana",
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
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "Work",
        "Trabalho",
        "I work as teacher",
        "Trabalho"
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
        "Atenção"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Casa e moradia</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Casa e moradia</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Ana'",
        "opts": [
          "Até logo",
          "Boa noite",
          "Bom dia",
          "Olá, meu nome é Sarah"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Prazer em conhecê-lo",
          "Onde mora",
          "Como vai",
          "Quantos anos"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "good",
          "big",
          "bad",
          "nice"
        ],
        "ans": 3,
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
        "q": "Qual verbo em 'Hello, my name is Ana'?",
        "opts": [
          "the",
          "and",
          "is",
          "or"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Goodbye",
          "Thank you",
          "Nice to meet you too",
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
        "q": "'Hello' é:",
        "opts": [
          "Pedido",
          "Um cumprimento",
          "Agradecimento",
          "Despedida"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "To you nice meet",
          "Meet you nice to",
          "You nice to meet",
          "Nice to meet you"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Olá",
          "Boa tarde",
          "Boa noite",
          "Bom dia"
        ],
        "ans": 3,
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
    "desc": "Aprenda rotina matinal - vocabulário ampliado e gramática completa",
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
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Day",
        "Dia",
        "What day is today?",
        "Dia"
      ],
      [
        "Nice to meet you",
        "Prazer",
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
        "Work",
        "Trabalho",
        "I work as teacher",
        "Trabalho"
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
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Time",
        "Tempo",
        "What time is it?",
        "Hora"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Rotina matinal</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Rotina matinal</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
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
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Quantos anos",
          "Onde mora",
          "Prazer em conhecê-lo",
          "Como vai"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "nice",
          "big",
          "bad",
          "good"
        ],
        "ans": 0,
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
        "q": "Qual verbo em 'Hello, my name is Sarah'?",
        "opts": [
          "is",
          "and",
          "the",
          "or"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Nice to meet you too",
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
        "q": "'Hello' é:",
        "opts": [
          "Pedido",
          "Um cumprimento",
          "Despedida",
          "Agradecimento"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "Meet you nice to",
          "You nice to meet",
          "To you nice meet",
          "Nice to meet you"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Olá",
          "Bom dia",
          "Boa tarde",
          "Boa noite"
        ],
        "ans": 1,
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
    "desc": "Aprenda rotina noturna - vocabulário ampliado e gramática completa",
    "time": "9 MIN",
    "phrase": "Hello, my name is Ana",
    "translation": "Olá, meu nome é João",
    "vocab": [
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
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
        "Thank you so much!",
        "Agradecimento"
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
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Day",
        "Dia",
        "What day is today?",
        "Dia"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Atenção"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Rotina noturna</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Rotina noturna</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Ana'",
        "opts": [
          "Boa noite",
          "Olá, meu nome é João",
          "Até logo",
          "Bom dia"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Como vai",
          "Quantos anos",
          "Prazer em conhecê-lo",
          "Onde mora"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "big",
          "nice",
          "bad",
          "good"
        ],
        "ans": 1,
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
        "q": "Qual verbo em 'Hello, my name is Ana'?",
        "opts": [
          "and",
          "or",
          "is",
          "the"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "I am fine",
          "Nice to meet you too",
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
          "Quantos anos?",
          "Qual é seu nome?",
          "Como vai?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "'Hello' é:",
        "opts": [
          "Agradecimento",
          "Um cumprimento",
          "Pedido",
          "Despedida"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "Nice to meet you",
          "To you nice meet",
          "You nice to meet",
          "Meet you nice to"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa noite",
          "Boa tarde",
          "Bom dia",
          "Olá"
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
    "title": "Fim de semana",
    "desc": "Aprenda fim de semana - vocabulário ampliado e gramática completa",
    "time": "10 MIN",
    "phrase": "Hello, my name is John",
    "translation": "Olá, meu nome é Ana",
    "vocab": [
      [
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Time",
        "Tempo",
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
        "Work",
        "Trabalho",
        "I work as teacher",
        "Trabalho"
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
        "Prazer",
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
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Fim de semana</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Fim de semana</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is John'",
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
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Prazer em conhecê-lo",
          "Quantos anos",
          "Como vai",
          "Onde mora"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "big",
          "good",
          "bad",
          "nice"
        ],
        "ans": 3,
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
        "q": "Qual verbo em 'Hello, my name is John'?",
        "opts": [
          "or",
          "and",
          "is",
          "the"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Nice to meet you too",
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
        "q": "'Hello' é:",
        "opts": [
          "Um cumprimento",
          "Pedido",
          "Despedida",
          "Agradecimento"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "Meet you nice to",
          "You nice to meet",
          "To you nice meet",
          "Nice to meet you"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Olá",
          "Boa noite",
          "Boa tarde",
          "Bom dia"
        ],
        "ans": 3,
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
    "desc": "Aprenda compras básicas - vocabulário ampliado e gramática completa",
    "time": "11 MIN",
    "phrase": "Hello, my name is Sarah",
    "translation": "Olá, meu nome é Sarah",
    "vocab": [
      [
        "How are you?",
        "Como está?",
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
        "Prazer",
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
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Day",
        "Dia",
        "What day is today?",
        "Dia"
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
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Compras básicas</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Compras básicas</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
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
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Como vai",
          "Quantos anos",
          "Prazer em conhecê-lo",
          "Onde mora"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "big",
          "bad",
          "good",
          "nice"
        ],
        "ans": 3,
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
        "q": "Qual verbo em 'Hello, my name is Sarah'?",
        "opts": [
          "the",
          "or",
          "and",
          "is"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Goodbye",
          "I am fine",
          "Nice to meet you too",
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
        "q": "'Hello' é:",
        "opts": [
          "Despedida",
          "Pedido",
          "Um cumprimento",
          "Agradecimento"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "You nice to meet",
          "To you nice meet",
          "Nice to meet you",
          "Meet you nice to"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Bom dia",
          "Boa tarde",
          "Boa noite",
          "Olá"
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
    "title": "Transporte",
    "desc": "Aprenda transporte - vocabulário ampliado e gramática completa",
    "time": "12 MIN",
    "phrase": "Hello, my name is John",
    "translation": "Olá, meu nome é João",
    "vocab": [
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
        "Resposta"
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
        "Time",
        "Tempo",
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
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
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
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Transporte</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Transporte</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is John'",
        "opts": [
          "Boa noite",
          "Bom dia",
          "Olá, meu nome é João",
          "Até logo"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Quantos anos",
          "Como vai",
          "Onde mora",
          "Prazer em conhecê-lo"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "big",
          "bad",
          "good",
          "nice"
        ],
        "ans": 3,
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
        "q": "Qual verbo em 'Hello, my name is John'?",
        "opts": [
          "the",
          "is",
          "and",
          "or"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Nice to meet you too",
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
          "Como vai?",
          "Qual é seu nome?",
          "Onde mora?"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "'Hello' é:",
        "opts": [
          "Pedido",
          "Um cumprimento",
          "Agradecimento",
          "Despedida"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "Nice to meet you",
          "Meet you nice to",
          "To you nice meet",
          "You nice to meet"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Olá",
          "Boa noite",
          "Boa tarde",
          "Bom dia"
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
    "title": "Comida e restaurante",
    "desc": "Aprenda comida e restaurante - vocabulário ampliado e gramática completa",
    "time": "13 MIN",
    "phrase": "Hello, my name is Sarah",
    "translation": "Olá, meu nome é João",
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
        "Day",
        "Dia",
        "What day is today?",
        "Dia"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
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
        "Thank you so much!",
        "Agradecimento"
      ],
      [
        "Nice to meet you",
        "Prazer",
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
        "Food",
        "Comida",
        "I like food",
        "Comida"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Comida e restaurante</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Comida e restaurante</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Sarah'",
        "opts": [
          "Olá, meu nome é João",
          "Bom dia",
          "Boa noite",
          "Até logo"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Quantos anos",
          "Onde mora",
          "Como vai",
          "Prazer em conhecê-lo"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "big",
          "good",
          "nice",
          "bad"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Sarah'?",
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
        "q": "Qual verbo em 'Hello, my name is Sarah'?",
        "opts": [
          "the",
          "and",
          "or",
          "is"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "I am fine",
          "Goodbye",
          "Thank you",
          "Nice to meet you too"
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
        "q": "'Hello' é:",
        "opts": [
          "Um cumprimento",
          "Pedido",
          "Despedida",
          "Agradecimento"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "You nice to meet",
          "Nice to meet you",
          "To you nice meet",
          "Meet you nice to"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Bom dia",
          "Boa noite",
          "Olá",
          "Boa tarde"
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
    "title": "Bebidas",
    "desc": "Aprenda bebidas - vocabulário ampliado e gramática completa",
    "time": "6 MIN",
    "phrase": "Hello, my name is Mike",
    "translation": "Olá, meu nome é João",
    "vocab": [
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ],
      [
        "Nice to meet you",
        "Prazer",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Atenção"
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
        "How are you?",
        "Como está?",
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
        "Time",
        "Tempo",
        "What time is it?",
        "Hora"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Bebidas</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Bebidas</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Mike'",
        "opts": [
          "Olá, meu nome é João",
          "Até logo",
          "Bom dia",
          "Boa noite"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Como vai",
          "Onde mora",
          "Quantos anos",
          "Prazer em conhecê-lo"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "bad",
          "good",
          "big",
          "nice"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Mike'?",
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
        "q": "Qual verbo em 'Hello, my name is Mike'?",
        "opts": [
          "or",
          "is",
          "the",
          "and"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Nice to meet you too",
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
        "q": "'Hello' é:",
        "opts": [
          "Um cumprimento",
          "Agradecimento",
          "Pedido",
          "Despedida"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "Nice to meet you",
          "Meet you nice to",
          "To you nice meet",
          "You nice to meet"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Olá",
          "Boa tarde",
          "Boa noite",
          "Bom dia"
        ],
        "ans": 3,
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
    "desc": "Aprenda pedindo ajuda - vocabulário ampliado e gramática completa",
    "time": "7 MIN",
    "phrase": "Hello, my name is Ana",
    "translation": "Olá, meu nome é Sarah",
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
        "Work",
        "Trabalho",
        "I work as teacher",
        "Trabalho"
      ],
      [
        "Nice to meet you",
        "Prazer",
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
        "Hello",
        "Olá",
        "Hello, how are you?",
        "Cumprimento universal"
      ],
      [
        "Day",
        "Dia",
        "What day is today?",
        "Dia"
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
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Pedindo ajuda</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Pedindo ajuda</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Ana'",
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
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Quantos anos",
          "Prazer em conhecê-lo",
          "Como vai",
          "Onde mora"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "good",
          "big",
          "bad",
          "nice"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Ana'?",
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
        "q": "Qual verbo em 'Hello, my name is Ana'?",
        "opts": [
          "is",
          "or",
          "the",
          "and"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Nice to meet you too",
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
        "q": "'Hello' é:",
        "opts": [
          "Um cumprimento",
          "Pedido",
          "Despedida",
          "Agradecimento"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "To you nice meet",
          "Nice to meet you",
          "You nice to meet",
          "Meet you nice to"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa noite",
          "Olá",
          "Boa tarde",
          "Bom dia"
        ],
        "ans": 3,
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
    "desc": "Aprenda direções simples - vocabulário ampliado e gramática completa",
    "time": "8 MIN",
    "phrase": "Hello, my name is Sarah",
    "translation": "Olá, meu nome é Ana",
    "vocab": [
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
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
        "How are you?",
        "Como está?",
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
        "Resposta"
      ],
      [
        "Day",
        "Dia",
        "What day is today?",
        "Dia"
      ],
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Direções simples</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Direções simples</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Sarah'",
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
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Como vai",
          "Onde mora",
          "Prazer em conhecê-lo",
          "Quantos anos"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "good",
          "big",
          "nice",
          "bad"
        ],
        "ans": 2,
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
        "q": "Qual verbo em 'Hello, my name is Sarah'?",
        "opts": [
          "is",
          "or",
          "and",
          "the"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Thank you",
          "Nice to meet you too",
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
        "q": "'Hello' é:",
        "opts": [
          "Um cumprimento",
          "Agradecimento",
          "Pedido",
          "Despedida"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "To you nice meet",
          "Meet you nice to",
          "Nice to meet you",
          "You nice to meet"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa tarde",
          "Olá",
          "Bom dia",
          "Boa noite"
        ],
        "ans": 2,
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
    "desc": "Aprenda preços e dinheiro - vocabulário ampliado e gramática completa",
    "time": "9 MIN",
    "phrase": "Hello, my name is Ana",
    "translation": "Olá, meu nome é João",
    "vocab": [
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta"
      ],
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "Time",
        "Tempo",
        "What time is it?",
        "Hora"
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
        "Prazer",
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
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
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
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Preços e dinheiro</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Preços e dinheiro</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Ana'",
        "opts": [
          "Até logo",
          "Boa noite",
          "Olá, meu nome é João",
          "Bom dia"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Quantos anos",
          "Como vai",
          "Onde mora",
          "Prazer em conhecê-lo"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "big",
          "good",
          "nice",
          "bad"
        ],
        "ans": 2,
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
        "q": "Qual verbo em 'Hello, my name is Ana'?",
        "opts": [
          "and",
          "is",
          "or",
          "the"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Goodbye",
          "Nice to meet you too",
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
        "q": "'Hello' é:",
        "opts": [
          "Um cumprimento",
          "Agradecimento",
          "Despedida",
          "Pedido"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "To you nice meet",
          "Meet you nice to",
          "Nice to meet you",
          "You nice to meet"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa noite",
          "Boa tarde",
          "Bom dia",
          "Olá"
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
    "title": "Roupas",
    "desc": "Aprenda roupas - vocabulário ampliado e gramática completa",
    "time": "10 MIN",
    "phrase": "Hello, my name is Sarah",
    "translation": "Olá, meu nome é Miguel",
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
        "Food",
        "Comida",
        "I like food",
        "Comida"
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
        "I work as teacher",
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
        "Atenção"
      ],
      [
        "Family",
        "Família",
        "My family is big",
        "Família"
      ],
      [
        "Nice to meet you",
        "Prazer",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Roupas</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Roupas</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Sarah'",
        "opts": [
          "Bom dia",
          "Boa noite",
          "Olá, meu nome é Miguel",
          "Até logo"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Prazer em conhecê-lo",
          "Como vai",
          "Quantos anos",
          "Onde mora"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "nice",
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
          "Ao comer",
          "Ao dormir",
          "Ao se apresentar"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Qual verbo em 'Hello, my name is Sarah'?",
        "opts": [
          "or",
          "and",
          "the",
          "is"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Goodbye",
          "Thank you",
          "I am fine",
          "Nice to meet you too"
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
        "q": "'Hello' é:",
        "opts": [
          "Agradecimento",
          "Um cumprimento",
          "Pedido",
          "Despedida"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "Nice to meet you",
          "You nice to meet",
          "Meet you nice to",
          "To you nice meet"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa tarde",
          "Boa noite",
          "Olá",
          "Bom dia"
        ],
        "ans": 3,
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
    "desc": "Aprenda saúde básica - vocabulário ampliado e gramática completa",
    "time": "11 MIN",
    "phrase": "Hello, my name is Sarah",
    "translation": "Olá, meu nome é João",
    "vocab": [
      [
        "Nice to meet you",
        "Prazer",
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
        "Time",
        "Tempo",
        "What time is it?",
        "Hora"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Atenção"
      ],
      [
        "How are you?",
        "Como está?",
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
        "Food",
        "Comida",
        "I like food",
        "Comida"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta"
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
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Saúde básica</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Saúde básica</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Sarah'",
        "opts": [
          "Boa noite",
          "Até logo",
          "Olá, meu nome é João",
          "Bom dia"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Prazer em conhecê-lo",
          "Quantos anos",
          "Onde mora",
          "Como vai"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "good",
          "big",
          "nice",
          "bad"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Sarah'?",
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
        "q": "Qual verbo em 'Hello, my name is Sarah'?",
        "opts": [
          "is",
          "the",
          "or",
          "and"
        ],
        "ans": 0,
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Thank you",
          "I am fine",
          "Goodbye",
          "Nice to meet you too"
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
        "q": "'Hello' é:",
        "opts": [
          "Despedida",
          "Agradecimento",
          "Pedido",
          "Um cumprimento"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "You nice to meet",
          "Meet you nice to",
          "To you nice meet",
          "Nice to meet you"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Bom dia",
          "Olá",
          "Boa noite",
          "Boa tarde"
        ],
        "ans": 0,
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
    "desc": "Aprenda emoções - vocabulário ampliado e gramática completa",
    "time": "12 MIN",
    "phrase": "Hello, my name is Ana",
    "translation": "Olá, meu nome é Sarah",
    "vocab": [
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
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
        "How are you?",
        "Como está?",
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
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Atenção"
      ],
      [
        "Time",
        "Tempo",
        "What time is it?",
        "Hora"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta"
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
        "I like food",
        "Comida"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Emoções</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Emoções</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Ana'",
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
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Quantos anos",
          "Onde mora",
          "Como vai",
          "Prazer em conhecê-lo"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "big",
          "bad",
          "good",
          "nice"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Ana'?",
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
        "q": "Qual verbo em 'Hello, my name is Ana'?",
        "opts": [
          "the",
          "and",
          "or",
          "is"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "I am fine",
          "Nice to meet you too",
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
          "Qual é seu nome?",
          "Quantos anos?",
          "Como vai?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello' é:",
        "opts": [
          "Agradecimento",
          "Um cumprimento",
          "Pedido",
          "Despedida"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "You nice to meet",
          "To you nice meet",
          "Meet you nice to",
          "Nice to meet you"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa tarde",
          "Bom dia",
          "Olá",
          "Boa noite"
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
    "title": "Convites",
    "desc": "Aprenda convites - vocabulário ampliado e gramática completa",
    "time": "13 MIN",
    "phrase": "Hello, my name is Sarah",
    "translation": "Olá, meu nome é Ana",
    "vocab": [
      [
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "Day",
        "Dia",
        "What day is today?",
        "Dia"
      ],
      [
        "Food",
        "Comida",
        "I like food",
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
        "Tempo",
        "What time is it?",
        "Hora"
      ],
      [
        "Nice to meet you",
        "Prazer",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Atenção"
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
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Convites</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Convites</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Sarah'",
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
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Onde mora",
          "Prazer em conhecê-lo",
          "Quantos anos",
          "Como vai"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "good",
          "big",
          "nice",
          "bad"
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
        "q": "Qual verbo em 'Hello, my name is Sarah'?",
        "opts": [
          "and",
          "or",
          "the",
          "is"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "I am fine",
          "Thank you",
          "Nice to meet you too",
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
          "Como vai?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "'Hello' é:",
        "opts": [
          "Pedido",
          "Um cumprimento",
          "Despedida",
          "Agradecimento"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "To you nice meet",
          "Meet you nice to",
          "You nice to meet",
          "Nice to meet you"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa noite",
          "Olá",
          "Bom dia",
          "Boa tarde"
        ],
        "ans": 2,
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
    "desc": "Aprenda telefone - vocabulário ampliado e gramática completa",
    "time": "6 MIN",
    "phrase": "Hello, my name is Ana",
    "translation": "Olá, meu nome é Miguel",
    "vocab": [
      [
        "Day",
        "Dia",
        "What day is today?",
        "Dia"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Atenção"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "How are you?",
        "Como está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta"
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
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Nice to meet you",
        "Prazer",
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
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Telefone</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Telefone</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Ana'",
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
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Quantos anos",
          "Onde mora",
          "Prazer em conhecê-lo",
          "Como vai"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "nice",
          "bad",
          "good",
          "big"
        ],
        "ans": 0,
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
        "q": "Qual verbo em 'Hello, my name is Ana'?",
        "opts": [
          "the",
          "and",
          "or",
          "is"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Nice to meet you too",
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
        "q": "'Hello' é:",
        "opts": [
          "Um cumprimento",
          "Agradecimento",
          "Despedida",
          "Pedido"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "Nice to meet you",
          "You nice to meet",
          "To you nice meet",
          "Meet you nice to"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa tarde",
          "Boa noite",
          "Bom dia",
          "Olá"
        ],
        "ans": 2,
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
    "desc": "Aprenda email e contato - vocabulário ampliado e gramática completa",
    "time": "7 MIN",
    "phrase": "Hello, my name is John",
    "translation": "Olá, meu nome é Ana",
    "vocab": [
      [
        "Nice to meet you",
        "Prazer",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Day",
        "Dia",
        "What day is today?",
        "Dia"
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
        "Food",
        "Comida",
        "I like food",
        "Comida"
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
        "Como está?",
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
        "Time",
        "Tempo",
        "What time is it?",
        "Hora"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Email e contato</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Email e contato</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is John'",
        "opts": [
          "Boa noite",
          "Bom dia",
          "Até logo",
          "Olá, meu nome é Ana"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Como vai",
          "Prazer em conhecê-lo",
          "Onde mora",
          "Quantos anos"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "bad",
          "big",
          "nice",
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
        "q": "Qual verbo em 'Hello, my name is John'?",
        "opts": [
          "and",
          "the",
          "is",
          "or"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Thank you",
          "Goodbye",
          "Nice to meet you too",
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
        "q": "'Hello' é:",
        "opts": [
          "Agradecimento",
          "Um cumprimento",
          "Pedido",
          "Despedida"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "To you nice meet",
          "You nice to meet",
          "Meet you nice to",
          "Nice to meet you"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa noite",
          "Boa tarde",
          "Bom dia",
          "Olá"
        ],
        "ans": 2,
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
    "desc": "Aprenda planos futuros - vocabulário ampliado e gramática completa",
    "time": "8 MIN",
    "phrase": "Hello, my name is John",
    "translation": "Olá, meu nome é Sarah",
    "vocab": [
      [
        "I am from",
        "Eu sou de",
        "I am from Brazil",
        "Origem"
      ],
      [
        "How are you?",
        "Como está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Nice to meet you",
        "Prazer",
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
        "Day",
        "Dia",
        "What day is today?",
        "Dia"
      ],
      [
        "Work",
        "Trabalho",
        "I work as teacher",
        "Trabalho"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
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
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Planos futuros</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Planos futuros</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is John'",
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
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Quantos anos",
          "Onde mora",
          "Como vai",
          "Prazer em conhecê-lo"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "bad",
          "good",
          "nice",
          "big"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is John'?",
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
        "q": "Qual verbo em 'Hello, my name is John'?",
        "opts": [
          "and",
          "the",
          "is",
          "or"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "I am fine",
          "Nice to meet you too",
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
          "Onde mora?",
          "Quantos anos?",
          "Como vai?"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "'Hello' é:",
        "opts": [
          "Agradecimento",
          "Um cumprimento",
          "Despedida",
          "Pedido"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "Nice to meet you",
          "You nice to meet",
          "Meet you nice to",
          "To you nice meet"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Olá",
          "Bom dia",
          "Boa tarde",
          "Boa noite"
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
    "desc": "Aprenda passado simples - vocabulário ampliado e gramática completa",
    "time": "9 MIN",
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
        "Good morning",
        "Bom dia",
        "Good morning, everyone!",
        "Até meio-dia"
      ],
      [
        "Day",
        "Dia",
        "What day is today?",
        "Dia"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta"
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
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Atenção"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Passado simples</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Passado simples</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Sarah'",
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
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Como vai",
          "Prazer em conhecê-lo",
          "Quantos anos",
          "Onde mora"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "nice",
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
        "q": "Qual verbo em 'Hello, my name is Sarah'?",
        "opts": [
          "the",
          "or",
          "is",
          "and"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Nice to meet you too",
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
        "q": "'Hello' é:",
        "opts": [
          "Despedida",
          "Agradecimento",
          "Pedido",
          "Um cumprimento"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "To you nice meet",
          "You nice to meet",
          "Nice to meet you",
          "Meet you nice to"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa noite",
          "Olá",
          "Bom dia",
          "Boa tarde"
        ],
        "ans": 2,
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
    "desc": "Aprenda experiências - vocabulário ampliado e gramática completa",
    "time": "10 MIN",
    "phrase": "Hello, my name is Mike",
    "translation": "Olá, meu nome é Sarah",
    "vocab": [
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Work",
        "Trabalho",
        "I work as teacher",
        "Trabalho"
      ],
      [
        "Time",
        "Tempo",
        "What time is it?",
        "Hora"
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
        "Please",
        "Por favor",
        "Please, help me!",
        "Cortesia"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta"
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
        "I like food",
        "Comida"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Experiências</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Experiências</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Mike'",
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
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Prazer em conhecê-lo",
          "Como vai",
          "Quantos anos",
          "Onde mora"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "nice",
          "good",
          "big",
          "bad"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Mike'?",
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
        "q": "Qual verbo em 'Hello, my name is Mike'?",
        "opts": [
          "and",
          "the",
          "or",
          "is"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "I am fine",
          "Goodbye",
          "Nice to meet you too",
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
        "q": "'Hello' é:",
        "opts": [
          "Pedido",
          "Agradecimento",
          "Despedida",
          "Um cumprimento"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "To you nice meet",
          "Meet you nice to",
          "Nice to meet you",
          "You nice to meet"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Olá",
          "Bom dia",
          "Boa tarde",
          "Boa noite"
        ],
        "ans": 1,
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
    "desc": "Aprenda preferências - vocabulário ampliado e gramática completa",
    "time": "11 MIN",
    "phrase": "Hello, my name is Sarah",
    "translation": "Olá, meu nome é Ana",
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
        "Nice to meet you",
        "Prazer",
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
        "Food",
        "Comida",
        "I like food",
        "Comida"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta"
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
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Preferências</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Preferências</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Sarah'",
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
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Onde mora",
          "Prazer em conhecê-lo",
          "Como vai",
          "Quantos anos"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "good",
          "bad",
          "big",
          "nice"
        ],
        "ans": 3,
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
        "q": "Qual verbo em 'Hello, my name is Sarah'?",
        "opts": [
          "and",
          "is",
          "the",
          "or"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Goodbye",
          "Thank you",
          "Nice to meet you too",
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
        "q": "'Hello' é:",
        "opts": [
          "Pedido",
          "Despedida",
          "Agradecimento",
          "Um cumprimento"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "Nice to meet you",
          "You nice to meet",
          "Meet you nice to",
          "To you nice meet"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa noite",
          "Bom dia",
          "Boa tarde",
          "Olá"
        ],
        "ans": 1,
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
    "desc": "Aprenda opiniões simples - vocabulário ampliado e gramática completa",
    "time": "12 MIN",
    "phrase": "Hello, my name is Sarah",
    "translation": "Olá, meu nome é Ana",
    "vocab": [
      [
        "How are you?",
        "Como está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Work",
        "Trabalho",
        "I work as teacher",
        "Trabalho"
      ],
      [
        "Day",
        "Dia",
        "What day is today?",
        "Dia"
      ],
      [
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Food",
        "Comida",
        "I like food",
        "Comida"
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
        "Resposta"
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
        "My name is",
        "Meu nome é",
        "My name is Ana",
        "Apresentação"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Opiniões simples</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Opiniões simples</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Sarah'",
        "opts": [
          "Boa noite",
          "Olá, meu nome é Ana",
          "Até logo",
          "Bom dia"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Quantos anos",
          "Onde mora",
          "Como vai",
          "Prazer em conhecê-lo"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "good",
          "nice",
          "big",
          "bad"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Sarah'?",
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
        "q": "Qual verbo em 'Hello, my name is Sarah'?",
        "opts": [
          "the",
          "and",
          "or",
          "is"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Nice to meet you too",
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
        "q": "'Hello' é:",
        "opts": [
          "Um cumprimento",
          "Pedido",
          "Agradecimento",
          "Despedida"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "Nice to meet you",
          "To you nice meet",
          "Meet you nice to",
          "You nice to meet"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Olá",
          "Boa tarde",
          "Bom dia",
          "Boa noite"
        ],
        "ans": 2,
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
    "desc": "Aprenda comparações - vocabulário ampliado e gramática completa",
    "time": "13 MIN",
    "phrase": "Hello, my name is John",
    "translation": "Olá, meu nome é Sarah",
    "vocab": [
      [
        "Time",
        "Tempo",
        "What time is it?",
        "Hora"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "Food",
        "Comida",
        "I like food",
        "Comida"
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
        "Como está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta"
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
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Comparações</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Comparações</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is John'",
        "opts": [
          "Olá, meu nome é Sarah",
          "Bom dia",
          "Boa noite",
          "Até logo"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Prazer em conhecê-lo",
          "Como vai",
          "Quantos anos",
          "Onde mora"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "big",
          "good",
          "bad",
          "nice"
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
        "q": "Qual verbo em 'Hello, my name is John'?",
        "opts": [
          "the",
          "is",
          "or",
          "and"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "I am fine",
          "Thank you",
          "Goodbye",
          "Nice to meet you too"
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
        "q": "'Hello' é:",
        "opts": [
          "Agradecimento",
          "Pedido",
          "Um cumprimento",
          "Despedida"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "You nice to meet",
          "To you nice meet",
          "Meet you nice to",
          "Nice to meet you"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Olá",
          "Bom dia",
          "Boa tarde",
          "Boa noite"
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
    "title": "Conselhos",
    "desc": "Aprenda conselhos - vocabulário ampliado e gramática completa",
    "time": "6 MIN",
    "phrase": "Hello, my name is Ana",
    "translation": "Olá, meu nome é Miguel",
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
        "Atenção"
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
        "Resposta"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
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
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "Food",
        "Comida",
        "I like food",
        "Comida"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Conselhos</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Conselhos</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Ana'",
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
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Prazer em conhecê-lo",
          "Como vai",
          "Quantos anos",
          "Onde mora"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "bad",
          "good",
          "big",
          "nice"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Ana'?",
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
        "q": "Qual verbo em 'Hello, my name is Ana'?",
        "opts": [
          "the",
          "is",
          "or",
          "and"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Nice to meet you too",
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
          "Qual é seu nome?",
          "Como vai?",
          "Quantos anos?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello' é:",
        "opts": [
          "Despedida",
          "Um cumprimento",
          "Agradecimento",
          "Pedido"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "Meet you nice to",
          "You nice to meet",
          "To you nice meet",
          "Nice to meet you"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa noite",
          "Bom dia",
          "Olá",
          "Boa tarde"
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
    "title": "Convite para café",
    "desc": "Aprenda convite para café - vocabulário ampliado e gramática completa",
    "time": "7 MIN",
    "phrase": "Hello, my name is Mike",
    "translation": "Olá, meu nome é Sarah",
    "vocab": [
      [
        "Work",
        "Trabalho",
        "I work as teacher",
        "Trabalho"
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
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "Day",
        "Dia",
        "What day is today?",
        "Dia"
      ],
      [
        "Good afternoon",
        "Boa tarde",
        "Good afternoon, sir!",
        "Tarde"
      ],
      [
        "Food",
        "Comida",
        "I like food",
        "Comida"
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
        "Resposta"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Convite para café</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Convite para café</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Mike'",
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
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Prazer em conhecê-lo",
          "Como vai",
          "Onde mora",
          "Quantos anos"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "bad",
          "big",
          "good",
          "nice"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Mike'?",
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
        "q": "Qual verbo em 'Hello, my name is Mike'?",
        "opts": [
          "or",
          "is",
          "the",
          "and"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "I am fine",
          "Goodbye",
          "Nice to meet you too",
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
          "Como vai?",
          "Onde mora?"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "'Hello' é:",
        "opts": [
          "Um cumprimento",
          "Despedida",
          "Pedido",
          "Agradecimento"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "Nice to meet you",
          "You nice to meet",
          "Meet you nice to",
          "To you nice meet"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa tarde",
          "Boa noite",
          "Olá",
          "Bom dia"
        ],
        "ans": 3,
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
    "desc": "Aprenda conhecendo vizinhos - vocabulário ampliado e gramática completa",
    "time": "8 MIN",
    "phrase": "Hello, my name is Mike",
    "translation": "Olá, meu nome é Miguel",
    "vocab": [
      [
        "Work",
        "Trabalho",
        "I work as teacher",
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
        "Food",
        "Comida",
        "I like food",
        "Comida"
      ],
      [
        "Day",
        "Dia",
        "What day is today?",
        "Dia"
      ],
      [
        "How are you?",
        "Como está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Time",
        "Tempo",
        "What time is it?",
        "Hora"
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
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Conhecendo vizinhos</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Conhecendo vizinhos</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Mike'",
        "opts": [
          "Boa noite",
          "Bom dia",
          "Até logo",
          "Olá, meu nome é Miguel"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Onde mora",
          "Prazer em conhecê-lo",
          "Como vai",
          "Quantos anos"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "big",
          "bad",
          "good",
          "nice"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Mike'?",
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
        "q": "Qual verbo em 'Hello, my name is Mike'?",
        "opts": [
          "or",
          "and",
          "is",
          "the"
        ],
        "ans": 2,
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "I am fine",
          "Nice to meet you too",
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
          "Onde mora?",
          "Qual é seu nome?"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "'Hello' é:",
        "opts": [
          "Um cumprimento",
          "Pedido",
          "Despedida",
          "Agradecimento"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "To you nice meet",
          "Meet you nice to",
          "Nice to meet you",
          "You nice to meet"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa tarde",
          "Olá",
          "Boa noite",
          "Bom dia"
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
    "title": "Festa e celebração",
    "desc": "Aprenda festa e celebração - vocabulário ampliado e gramática completa",
    "time": "9 MIN",
    "phrase": "Hello, my name is Ana",
    "translation": "Olá, meu nome é João",
    "vocab": [
      [
        "Work",
        "Trabalho",
        "I work as teacher",
        "Trabalho"
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
        "Atenção"
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
        "Good evening",
        "Boa noite",
        "Good evening, welcome!",
        "Chegada noite"
      ],
      [
        "How are you?",
        "Como está?",
        "How are you today?",
        "Bem-estar"
      ],
      [
        "Food",
        "Comida",
        "I like food",
        "Comida"
      ],
      [
        "Nice to meet you",
        "Prazer",
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
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Festa e celebração</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Festa e celebração</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Ana'",
        "opts": [
          "Olá, meu nome é João",
          "Bom dia",
          "Boa noite",
          "Até logo"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Prazer em conhecê-lo",
          "Quantos anos",
          "Onde mora",
          "Como vai"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "nice",
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
          "Ao dirigir",
          "Ao se apresentar",
          "Ao comer",
          "Ao dormir"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Qual verbo em 'Hello, my name is Ana'?",
        "opts": [
          "is",
          "and",
          "the",
          "or"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "I am fine",
          "Thank you",
          "Nice to meet you too",
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
        "q": "'Hello' é:",
        "opts": [
          "Um cumprimento",
          "Agradecimento",
          "Despedida",
          "Pedido"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "Nice to meet you",
          "You nice to meet",
          "Meet you nice to",
          "To you nice meet"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Bom dia",
          "Boa noite",
          "Olá",
          "Boa tarde"
        ],
        "ans": 0,
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
    "desc": "Aprenda filmes e música - vocabulário ampliado e gramática completa",
    "time": "10 MIN",
    "phrase": "Hello, my name is Ana",
    "translation": "Olá, meu nome é Sarah",
    "vocab": [
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
        "Nice to meet you",
        "Prazer",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Atenção"
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
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ],
      [
        "Time",
        "Tempo",
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
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Filmes e música</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Filmes e música</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Ana'",
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
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Como vai",
          "Quantos anos",
          "Onde mora",
          "Prazer em conhecê-lo"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "nice",
          "good",
          "big",
          "bad"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Ana'?",
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
        "q": "Qual verbo em 'Hello, my name is Ana'?",
        "opts": [
          "or",
          "the",
          "is",
          "and"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Nice to meet you too",
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
          "Onde mora?",
          "Como vai?",
          "Quantos anos?"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "'Hello' é:",
        "opts": [
          "Agradecimento",
          "Pedido",
          "Despedida",
          "Um cumprimento"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "You nice to meet",
          "To you nice meet",
          "Nice to meet you",
          "Meet you nice to"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa tarde",
          "Bom dia",
          "Olá",
          "Boa noite"
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
    "title": "Esportes",
    "desc": "Aprenda esportes - vocabulário ampliado e gramática completa",
    "time": "11 MIN",
    "phrase": "Hello, my name is Mike",
    "translation": "Olá, meu nome é João",
    "vocab": [
      [
        "Friend",
        "Amigo",
        "My friend is kind",
        "Amigo"
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
        "House",
        "Casa",
        "My house is big",
        "Casa"
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
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Atenção"
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
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Esportes</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Esportes</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Mike'",
        "opts": [
          "Até logo",
          "Olá, meu nome é João",
          "Boa noite",
          "Bom dia"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Prazer em conhecê-lo",
          "Onde mora",
          "Como vai",
          "Quantos anos"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "bad",
          "big",
          "nice",
          "good"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Quando usar 'Hello, my name is Mike'?",
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
        "q": "Qual verbo em 'Hello, my name is Mike'?",
        "opts": [
          "is",
          "and",
          "the",
          "or"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Nice to meet you too",
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
          "Como vai?",
          "Onde mora?",
          "Quantos anos?"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "'Hello' é:",
        "opts": [
          "Agradecimento",
          "Um cumprimento",
          "Despedida",
          "Pedido"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "To you nice meet",
          "Nice to meet you",
          "Meet you nice to",
          "You nice to meet"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa noite",
          "Bom dia",
          "Olá",
          "Boa tarde"
        ],
        "ans": 1,
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
    "desc": "Aprenda viagem curta - vocabulário ampliado e gramática completa",
    "time": "12 MIN",
    "phrase": "Hello, my name is Sarah",
    "translation": "Olá, meu nome é João",
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
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Atenção"
      ],
      [
        "I'm fine",
        "Estou bem",
        "I'm fine, thank you!",
        "Resposta"
      ],
      [
        "Good night",
        "Boa noite",
        "Good night, sleep well!",
        "Despedida"
      ],
      [
        "Time",
        "Tempo",
        "What time is it?",
        "Hora"
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
        "Prazer",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "House",
        "Casa",
        "My house is big",
        "Casa"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Viagem curta</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Viagem curta</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Sarah'",
        "opts": [
          "Bom dia",
          "Até logo",
          "Boa noite",
          "Olá, meu nome é João"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Quantos anos",
          "Onde mora",
          "Como vai",
          "Prazer em conhecê-lo"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "bad",
          "big",
          "nice",
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
          "Ao comer",
          "Ao se apresentar"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Qual verbo em 'Hello, my name is Sarah'?",
        "opts": [
          "the",
          "is",
          "and",
          "or"
        ],
        "ans": 1,
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Nice to meet you too",
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
          "Quantos anos?",
          "Como vai?",
          "Onde mora?"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "'Hello' é:",
        "opts": [
          "Despedida",
          "Pedido",
          "Um cumprimento",
          "Agradecimento"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "Nice to meet you",
          "Meet you nice to",
          "To you nice meet",
          "You nice to meet"
        ],
        "ans": 0,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Olá",
          "Boa tarde",
          "Bom dia",
          "Boa noite"
        ],
        "ans": 2,
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
    "desc": "Aprenda cultura local - vocabulário ampliado e gramática completa",
    "time": "13 MIN",
    "phrase": "Hello, my name is Sarah",
    "translation": "Olá, meu nome é Sarah",
    "vocab": [
      [
        "Time",
        "Tempo",
        "What time is it?",
        "Hora"
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
        "Nice to meet you",
        "Prazer",
        "Nice to meet you, John!",
        "Conhecer alguém"
      ],
      [
        "Excuse me",
        "Com licença",
        "Excuse me, where is...?",
        "Atenção"
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
        "Thank you",
        "Obrigado",
        "Thank you so much!",
        "Agradecimento"
      ]
    ],
    "grammar": "<div style=\"background:#f5fae5;padding:16px;border-radius:12px\"><h4 style=\"margin:0 0 8px;color:#276246\">📚 Gramática: Cultura local</h4><p><b>Estrutura:</b> Subject + Verb + Complement<br>Ex: I am happy, You are kind<br><b>Dica:</b> Pratique 3x em voz alta</p></div><div style=\"margin-top:12px;padding:12px;background:#fff;border:1px solid #e9e5da;border-radius:10px\"><h5>💡 Para: Cultura local</h5><p><b>Frase chave:</b> Hello, nice to meet you = Olá, prazer em conhecê-lo</p><p><b>Quando usar:</b> Ao conhecer alguém</p><p><b>Variações:</b> Hi, nice to meet you (informal) / Hello, it's nice to meet you (formal)</p></div>",
    "quiz": [
      {
        "q": "Traduza: 'Hello, my name is Sarah'",
        "opts": [
          "Até logo",
          "Boa noite",
          "Bom dia",
          "Olá, meu nome é Sarah"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "O que significa 'Nice to meet you'?",
        "opts": [
          "Onde mora",
          "Quantos anos",
          "Prazer em conhecê-lo",
          "Como vai"
        ],
        "ans": 2,
        "type": "translation"
      },
      {
        "q": "Complete: 'Hello, ___ to meet you'",
        "opts": [
          "big",
          "good",
          "bad",
          "nice"
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
        "q": "Qual verbo em 'Hello, my name is Sarah'?",
        "opts": [
          "the",
          "or",
          "is",
          "and"
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
        "q": "Resposta para 'Nice to meet you'?",
        "opts": [
          "Thank you",
          "I am fine",
          "Goodbye",
          "Nice to meet you too"
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
        "q": "'Hello' é:",
        "opts": [
          "Despedida",
          "Um cumprimento",
          "Pedido",
          "Agradecimento"
        ],
        "ans": 1,
        "type": "translation"
      },
      {
        "q": "Correto: 'I ___ from Brazil'",
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
        "q": "Ordem: 'you / meet / nice / to'",
        "opts": [
          "Meet you nice to",
          "You nice to meet",
          "To you nice meet",
          "Nice to meet you"
        ],
        "ans": 3,
        "type": "translation"
      },
      {
        "q": "Traduza: 'Good morning'",
        "opts": [
          "Boa tarde",
          "Boa noite",
          "Olá",
          "Bom dia"
        ],
        "ans": 3,
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
 const vocabHtml=`<div style="margin-bottom:12px;padding:10px;background:#f5fae5;border-radius:10px;font-size:12px;color:#276246"><strong>📖 ${l.vocab.length} palavras nesta lição - Clique para ouvir 🔊</strong></div><div class="vocab-grid">${l.vocab.map(v=>`<div class="vocab-item" style="border:1px solid #e9e5da;padding:12px;border-radius:10px;background:#fff"><div style="display:flex;justify-content:space-between"><div><strong>${v[0]}</strong> — ${v[1]}<br><small style="color:#718078">${v[2]}</small><br><small style="color:#9ca3af;font-size:11px">💡 ${v[3]||""}</small></div><div style="display:flex;flex-direction:column;gap:4px"><button class="tab" style="font-size:10px" onclick="speakEnglish('${v[0].replace(/'/g,"\'")}')">🔊 EN</button><button class="tab" style="font-size:10px" onclick="speakPortuguese('${v[1].replace(/'/g,"\'")}')">🔊 PT</button></div></div></div>`).join('')}</div>`;
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
   return `<p style="font-size:10px;letter-spacing:.12em;color:#718078;font-weight:700">MÓDULO ${l.module} · ${l.level} · ${l.time} · ${l.quiz.length} PERGUNTAS · ${l.vocab.length} PALAVRAS</p><h2 style="font-family:Fraunces;margin:4px 0">${l.title}</h2><p style="color:#718078;font-size:13px">${l.desc}</p>${tabs}<div id="tab-dialog"><p style="font-family:Fraunces;font-size:22px;color:#276246;margin:16px 0 6px">${l.phrase}</p><p style="color:#718078">${l.translation}</p><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px"><button class="primary" onclick="speakEnglish('${l.phrase.replace(/'/g,"\'")}')">🔊 EN Nativo</button><button class="tab" onclick="speakPortuguese('${l.translation.replace(/'/g,"\'")}')">🔊 PT</button><button class="tab" onclick="speakSlow('${l.phrase.replace(/'/g,"\'")}')">🐢 Devagar</button><button class="tab" onclick="speakBilingual('${l.phrase.replace(/'/g,"\'")}','${l.translation.replace(/'/g,"\'")}')">🔊 Bilíngue</button></div></div><div id="tab-vocab" class="hidden">${vocabHtml}</div><div id="tab-grammar" class="hidden"><div style="background:#f5fae5;padding:12px;border-radius:10px">${l.grammar}<br><br><button class="primary" onclick="speakBilingual('${l.phrase.replace(/'/g,"\'")}','${l.translation.replace(/'/g,"\'")}')">🔊 Ouvir bilíngue</button></div></div><div id="tab-quiz" class="hidden"><div id="quiz-container">${getQuizHtml()}</div></div>`;
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
