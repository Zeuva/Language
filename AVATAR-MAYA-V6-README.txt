ZEUVASTEC LANGUAGE — MAYA AVATAR V6

Esta versão substitui o avatar procedural/cartoon pelo pipeline:
TalkingHead + HeadTTS + GLB com ARKit/Oculus visemes.

CONFIGURAÇÃO:
- is_talking_photo = false
- full_facial_animation = true
- audio_driven_lipsync = true
- head_idle_animation = true
- 60 FPS no motor do avatar
- voz HeadTTS: af_bella (inglês)

O áudio gerado pelo HeadTTS é enviado ao TalkingHead com visemes e timestamps.
Isso permite sincronizar mandíbula, lábios, olhos e expressões do modelo, em vez de mover apenas uma imagem.

MODELO TEMPORÁRIO:
O arquivo avatar-3d.js aponta para um GLB feminino de demonstração hospedado no Hugging Face,
compatível com TalkingHead. Ele é usado apenas como etapa funcional até que o modelo 3D próprio da Maya
seja criado com a aparência da referência visual aprovada.

LICENÇA DO MODELO TEMPORÁRIO:
O README do projeto que hospeda o modelo informa CC BY-NC 4.0 para o avatar Ready Player Me.
O Zeuvastec deve manter a atribuição e confirmar que o uso pretendido permanece dentro dos termos da licença.

IMPORTANTE:
A imagem maya-mini.png é somente uma miniatura/identidade visual. Ela NÃO é usada como avatar falante.
O avatar falante é o GLB 3D carregado pelo TalkingHead.

V11: mobile uses native device speech to reduce WebGPU/WASM memory pressure; desktop retains HeadTTS + audio-driven viseme lip-sync. 3D framing is fixed to prevent canvas growth. Service worker cache version bumped and old caches removed.

V13: fixed camera framing; HeadTTS audio is passed to TalkingHead with isRaw:true for tighter audio/viseme synchronization.
