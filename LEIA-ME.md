# Vamos conversar — diálogos mais longos + IA opcional

## O que mudou agora (já está funcionando, sem configurar nada)

- Cada uma das 9 conversas (3 no Básico, 3 no Intermediário, 3 no Avançado)
  passou de **5 para 8 falas** — quase 60% mais conteúdo por conversa.
- O tutor agora reage ao que o aluno realmente disse: além do elogio, ele
  soma uma reação contextual ("That sounds great!", "I understand", etc.)
  detectada por palavras-chave na resposta falada, deixando a conversa
  menos robótica.

## Por que não coloquei uma IA de verdade direto no app?

O app é um arquivo estático (HTML/JS) que roda no navegador/celular da
pessoa. Qualquer chave de API colocada nesse código pode ser vista e
roubada por qualquer usuário — isso violaria os termos de uso das APIs de
IA e poderia gerar cobranças indevidas na sua conta. Por segurança, uma
chave de API **precisa** ficar escondida em um servidor que só você
controla.

## Como ativar a IA de verdade (opcional)

1. Veja o arquivo `worker-exemplo.js` nesta pasta — é um servidor pronto
   (Cloudflare Worker, gratuito) que repassa a conversa para a IA com
   segurança, sem expor sua chave.
2. Siga as instruções escritas no topo do arquivo (leva uns 5 minutos:
   criar conta gratuita, colar o código, adicionar sua chave da API como
   variável secreta, publicar).
3. Depois de publicado, você recebe uma URL. Adicione esta linha no seu
   `index.html`, em qualquer lugar antes do `<script src="guided-voice.js">`:

   ```html
   <script>window.ZEUVASTEC_AI_ENDPOINT = 'https://SEU-WORKER.workers.dev';</script>
   ```

4. Pronto! A partir daí, ao terminar qualquer uma das 9 conversas
   guiadas, o app convida o aluno a continuar batendo papo livremente —
   e cada resposta é gerada de verdade por uma IA (não mais um roteiro
   fixo), respeitando o nível (básico/intermediário/avançado) escolhido.

## Sem configurar nada

O app funciona perfeitamente sem esse passo — ele simplesmente não
oferece o "bate-papo livre" no final de cada conversa, e continua com as
conversas roteirizadas de 8 falas normalmente.
