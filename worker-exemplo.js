// ============================================================
// EXEMPLO DE BACKEND (Cloudflare Worker) para o "Modo IA" do
// Zeuvastec Language — app.js/guided-voice.js chamam esta URL.
//
// Por que isso é necessário?
// A chave de API de uma IA (Anthropic, OpenAI, etc.) NUNCA pode
// ficar dentro do app (HTML/JS), porque qualquer pessoa consegue
// abrir o código do app e roubar a chave. Este pequeno servidor
// guarda a chave em segredo e só repassa a pergunta do aluno.
//
// COMO USAR:
// 1. Crie uma conta gratuita em https://workers.cloudflare.com
// 2. Crie um novo Worker e cole este código.
// 3. Em "Settings > Variables", adicione uma variável secreta:
//      ANTHROPIC_API_KEY = sua-chave-da-api-anthropic
// 4. Publique o Worker. Você vai receber uma URL, por exemplo:
//      https://zeuvastec-tutor.SEUUSUARIO.workers.dev
// 5. No app, adicione esta linha em qualquer lugar ANTES de
//    guided-voice.js ser carregado (por exemplo, no <head> do
//    index.html, dentro de uma tag <script>):
//      <script>window.ZEUVASTEC_AI_ENDPOINT = 'https://zeuvastec-tutor.SEUUSUARIO.workers.dev';</script>
//
// A partir daí, ao terminar uma conversa guiada, o app vai
// convidar o aluno a continuar conversando livremente, e cada
// fala será respondida de verdade por uma IA.
// ============================================================

export default {
  async fetch(request, env) {
    // Permite chamadas vindas do seu app (ajuste o domínio em produção)
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: corsHeaders });
    }

    try {
      const { level, scenario, history, message } = await request.json();

      const levelGuidance = {
        basico: 'Use very simple English, short sentences, present tense, common everyday words. Speak like a patient teacher talking to an A1/A2 beginner.',
        intermediario: 'Use natural, moderately complex English with some past/future tenses and everyday idioms. Speak like a teacher talking to a B1/B2 student.',
        avancado: 'Use rich, nuanced English including advanced vocabulary, idioms and complex sentence structures. Speak like a teacher challenging a C1/C2 student.'
      };
      const guidance = levelGuidance[level] || levelGuidance.basico;

      const conversation = (history || [])
        .map((turn) => `${turn.role === 'user' ? 'Student' : 'Tutor'}: ${turn.text}`)
        .join('\n');

      const systemPrompt = `You are Zeus, a friendly, encouraging English conversation tutor talking to a Brazilian Portuguese speaker practicing the topic "${scenario}". ${guidance} Keep replies short (1-3 sentences), always end with a natural follow-up question to keep the conversation going, and gently correct any obvious mistake by modeling the correct form in your reply (do not lecture about grammar). Reply in English only.`;

      const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 200,
          system: systemPrompt,
          messages: [
            { role: 'user', content: `${conversation ? conversation + '\n' : ''}Student: ${message}` }
          ]
        })
      });

      if (!anthropicRes.ok) {
        return new Response(JSON.stringify({ error: 'AI request failed' }), {
          status: 502,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const data = await anthropicRes.json();
      const reply = data.content?.find((block) => block.type === 'text')?.text || "Sorry, I didn't catch that. Could you say it again?";

      return new Response(JSON.stringify({ reply }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Bad request' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
};
