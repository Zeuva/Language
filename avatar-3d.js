/* Zeuvastec Language — Maya realistic avatar V6
 * Real GLB avatar + TalkingHead + HeadTTS.
 * No talking-photo fallback. HeadTTS provides phoneme/viseme timestamps and
 * TalkingHead applies them to ARKit/Oculus facial blendshapes.
 */
import { TalkingHead } from 'https://cdn.jsdelivr.net/npm/@met4citizen/talkinghead@1.7/+esm';
import { HeadTTS } from 'https://cdn.jsdelivr.net/npm/@met4citizen/headtts@1.3/+esm';

const CONFIG = Object.freeze({
  is_talking_photo: false,
  full_facial_animation: true,
  audio_driven_lipsync: true,
  head_idle_animation: true,
  model_fps: 60,
  voice: 'af_bella',
  language: 'en-us',
  // Temporary public demo model with ARKit + Oculus visemes. Replace later
  // with the custom Maya GLB when it has the same blendshape contract.
  avatar_url: 'https://huggingface.co/spaces/victor/gemma-avatar/resolve/main/public/avatars/brunette.glb'
});
window.ZEUVASTEC_AVATAR_CONFIG = CONFIG;

const stage = document.getElementById('tutor-stage');
const node = document.getElementById('tutor-3d-avatar');
const loading = document.getElementById('avatar-3d-loading');
if (!stage || !node) throw new Error('Tutor avatar container not found');

let head = null;
let headtts = null;
let ready = false;
let initialized = false;
let speechCallback = null;
let configuredRate = null;
let speechEndTimer = null;

function setLoading(text, visible = true) {
  if (!loading) return;
  loading.textContent = text;
  loading.style.display = visible ? '' : 'none';
}

function setState(state) {
  stage.dataset.state = state;
  if (typeof window.tutorAvatarSetState === 'function') window.tutorAvatarSetState(state);
}

function setAvatarError(message) {
  stage.classList.add('avatar-3d-error');
  setLoading(message, true);
  window.ZEUVASTEC_AVATAR_READY = false;
}

async function initAvatar() {
  setLoading('Carregando Maya 3D…');

  head = new TalkingHead(node, {
    ttsEndpoint: 'N/A',
    lipsyncModules: [],
    cameraView: 'upper',
    cameraDistance: -0.72,
    cameraRotateEnable: false,
    cameraZoomEnable: false,
    cameraPanEnable: false,
    modelFPS: 60,
    avatarIdleEyeContact: 0.72,
    avatarSpeakingEyeContact: 0.9,
    avatarListeningEyeContact: 0.8,
    avatarSpeakingHeadMove: 0.7,
    avatarListeningHeadMove: 0.45,
    avatarMood: 'neutral',
    lightAmbientIntensity: 1.0,
    lightDirectIntensity: 1.1,
    lightSpotIntensity: 0.5,
    lightAmbientColor: 0xffffff,
    lightDirectColor: 0xffffff,
    lightSpotColor: 0xffffff
  });

  await head.showAvatar({
    url: CONFIG.avatar_url,
    body: 'F',
    avatarMood: 'neutral',
    lipsyncLang: 'en'
  }, (ev) => {
    if (ev?.lengthComputable) {
      const pct = Math.round((ev.loaded / ev.total) * 100);
      setLoading(`Carregando Maya 3D… ${pct}%`);
    }
  });

  // Keep the framing close to the learner: face + shoulders, with room for mic below.
  head.setView('upper', {
    cameraDistance: -0.72,
    cameraX: 0,
    cameraY: 0.02,
    cameraRotateX: 0,
    cameraRotateY: 0
  });

  stage.classList.add('avatar-3d-ready');
  setLoading('', false);
}

async function initTTS() {
  setLoading('Preparando voz da Maya + lip-sync…');
  headtts = new HeadTTS({
    endpoints: ['webgpu', 'wasm'],
    languages: ['en-us'],
    voices: ['af_bella'],
    audioCtx: head.audioCtx,
    workerModule: 'https://cdn.jsdelivr.net/npm/@met4citizen/headtts@1.3/modules/worker-tts.mjs',
    dictionaryURL: 'https://cdn.jsdelivr.net/npm/@met4citizen/headtts@1.3/dictionaries/',
    trace: 0
  });

  headtts.onstart = () => setState('speaking');
  headtts.onend = () => {
    // HeadTTS onend marks synthesis completion, not necessarily the end of
    // playback. The actual listening transition is scheduled from the
    // viseme/word duration in the audio message below.
  };
  headtts.onerror = (err) => {
    console.error('[Zeuvastec Maya] HeadTTS error', err);
    setState('normal');
    const cb = speechCallback;
    speechCallback = null;
    if (cb) cb();
  };

  headtts.onmessage = (message) => {
    if (message.type === 'audio') {
      try {
        // HeadTTS returns the audio object already containing words + visemes + timestamps.
        // TalkingHead synchronizes the entire facial animation to the audio clock.
        const audioData = message.data;
        head.speakAudio(audioData, {}, () => {});

        // Schedule the callback for the end of the actual spoken audio.
        // This avoids opening the microphone while Maya is still speaking.
        if (speechEndTimer) clearTimeout(speechEndTimer);
        const wtimes = Array.isArray(audioData?.wtimes) ? audioData.wtimes : [];
        const wdurations = Array.isArray(audioData?.wdurations) ? audioData.wdurations : [];
        const vtimes = Array.isArray(audioData?.vtimes) ? audioData.vtimes : [];
        const vdurations = Array.isArray(audioData?.vdurations) ? audioData.vdurations : [];
        const wordEnd = wtimes.length ? Math.max(...wtimes.map((t,i)=>Number(t||0)+Number(wdurations[i]||0))) : 0;
        const visemeEnd = vtimes.length ? Math.max(...vtimes.map((t,i)=>Number(t||0)+Number(vdurations[i]||0))) : 0;
        const estimatedMs = Math.max(wordEnd, visemeEnd, 250);
        speechEndTimer = setTimeout(() => {
          speechEndTimer = null;
          setState('normal');
          const cb = speechCallback;
          speechCallback = null;
          if (cb) cb();
        }, estimatedMs + 120);
      } catch (err) {
        console.error('[Zeuvastec Maya] speakAudio error', err);
        setState('normal');
        const cb = speechCallback;
        speechCallback = null;
        if (cb) cb();
      }
    } else if (message.type === 'error') {
      console.error('[Zeuvastec Maya] HeadTTS message error', message.data?.error || message.data);
      setState('normal');
      const cb = speechCallback;
      speechCallback = null;
      if (cb) cb();
    }
  };

  await headtts.connect();
  await headtts.setup({
    voice: CONFIG.voice,
    language: CONFIG.language,
    speed: 1.0,
    audioEncoding: 'wav'
  });
}

window.ZEUVASTEC_AVATAR_SPEAK = async (text, options = {}) => {
  if (!text) return;
  if (!headtts || !head) {
    if (options.onEnd) options.onEnd();
    return;
  }

  try {
    speechCallback = options.onEnd || null;
    setState('thinking');
    if (speechEndTimer) { clearTimeout(speechEndTimer); speechEndTimer = null; }
    // Não reinicializa o motor a cada frase: isso causava a pausa perceptível
    // antes da Maya começar a falar. O setup inicial já deixa o motor pronto.
    const requestedRate = Math.max(0.65, Math.min(1.15, Number(options.rate || 1.0)));
    try { headtts.clear(); } catch (e) {}
    // Reconfigure only when the requested speed actually changes. Re-running
    // setup for every sentence was the main source of the audible delay.
    if (configuredRate !== requestedRate) {
      await headtts.setup({
        voice: CONFIG.voice,
        language: CONFIG.language,
        speed: requestedRate,
        audioEncoding: 'wav'
      });
      configuredRate = requestedRate;
    }
    headtts.synthesize({ input: String(text).slice(0, 500) });
  } catch (err) {
    console.error('[Zeuvastec Maya] synthesis error', err);
    setState('normal');
    const cb = speechCallback;
    speechCallback = null;
    if (cb) cb();
  }
};

window.ZEUVASTEC_AVATAR_STOP = () => {
  try { head?.stopSpeaking?.(); } catch (e) {}
  try { headtts?.clear?.(); } catch (e) {}
  if (speechEndTimer) { clearTimeout(speechEndTimer); speechEndTimer = null; }
  setState('normal');
  const cb = speechCallback;
  speechCallback = null;
  if (cb) cb();
};

window.ZEUVASTEC_AVATAR_READY = false;
stage.dataset.isTalkingPhoto = 'false';
stage.dataset.fullFacialAnimation = 'true';
stage.dataset.audioDrivenLipsync = 'true';
stage.dataset.headIdleAnimation = 'true';

(async () => {
  if (initialized) return;
  initialized = true;
  try {
    await initAvatar();
    setState('normal');
    await initTTS();
    ready = true;
    window.ZEUVASTEC_AVATAR_READY = true;
    stage.classList.add('avatar-3d-ready');
    setLoading('', false);
    window.dispatchEvent(new CustomEvent('zeuvastec-avatar-ready'));
  } catch (err) {
    console.error('[Zeuvastec Maya] initialization failed', err);
    setAvatarError('Não foi possível carregar o Avatar 3D. Verifique a conexão e tente novamente.');
  }
})();

const mic = document.getElementById('mic-button');
if (mic) {
  mic.addEventListener('click', () => {
    if (matchMedia('(max-width:700px)').matches) {
      stage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
}
