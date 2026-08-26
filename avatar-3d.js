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
  model_fps: 30,
  voice: 'af_bella',
  language: 'en-us',
  // Temporary public demo model with ARKit + Oculus visemes. Replace later
  // with the custom Maya GLB when it has the same blendshape contract.
  avatar_url: 'https://huggingface.co/spaces/victor/gemma-avatar/resolve/main/public/avatars/brunette.glb'
});
window.ZEUVASTEC_AVATAR_CONFIG = CONFIG;

const stage = document.getElementById('tutor-stage');
const IS_MOBILE = window.matchMedia('(max-width: 700px), (pointer: coarse)').matches;
const MOBILE_NATIVE_TTS = IS_MOBILE; // Stability-first: avoid heavy WASM TTS on phones.
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
let ttsInitializing = null;
let mobileNativeFallback = false;
let fallbackVisemeTimer = null;

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
  // On mobile, use the first real user interaction with the microphone as a
// safe point to start loading HeadTTS WASM in the background. This prevents
// the old native-speech-only path (which had no viseme stream) while avoiding
// a heavy model load during initial page startup.

window.ZEUVASTEC_AVATAR_READY = false;
}

async function initAvatar() {
  setLoading('Carregando Maya 3D…');

  head = new TalkingHead(node, {
    ttsEndpoint: 'N/A',
    lipsyncModules: [],
    cameraView: 'upper',
    cameraDistance: 0,
    cameraZoomEnable: false,
    cameraPanEnable: false,
    cameraRotateEnable: false,
    cameraZoomEnable: false,
    cameraPanEnable: false,
    modelFPS: IS_MOBILE ? 24 : 60,
    modelPixelRatio: 1,
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
    cameraDistance: 0,
    cameraX: 0,
    cameraY: 0.02,
    cameraRotateX: 0,
    cameraRotateY: 0
  });

  stage.classList.add('avatar-3d-ready');
  setLoading('', false);
}

async function initTTS() {
  if (headtts) return headtts;
  if (ttsInitializing) return ttsInitializing;
  setLoading('Preparando voz + lip-sync…');
  ttsInitializing = (async () => {
    const endpoints = IS_MOBILE ? ['wasm'] : ['webgpu', 'wasm'];
    headtts = new HeadTTS({
      endpoints,
      languages: ['en-us'],
      voices: ['af_bella'],
      audioCtx: head.audioCtx,
      workerModule: 'https://cdn.jsdelivr.net/npm/@met4citizen/headtts@1.3/modules/worker-tts.mjs',
      dictionaryURL: 'https://cdn.jsdelivr.net/npm/@met4citizen/headtts@1.3/dictionaries/',
      trace: 0
    });

    headtts.onstart = () => setState('speaking');
    headtts.onend = () => {};
    headtts.onerror = (err) => {
      console.error('[Zeuvastec Maya] HeadTTS error', err);
      mobileNativeFallback = true;
      setState('normal');
      const cb = speechCallback; speechCallback = null; if (cb) cb();
    };
    headtts.onmessage = (message) => {
      if (message.type === 'audio') {
        try {
          const audioData = message.data;
          head.speakAudio(audioData, { isRaw: true }, () => {});
          if (speechEndTimer) clearTimeout(speechEndTimer);
          const wtimes = Array.isArray(audioData?.wtimes) ? audioData.wtimes : [];
          const wdurations = Array.isArray(audioData?.wdurations) ? audioData.wdurations : [];
          const vtimes = Array.isArray(audioData?.vtimes) ? audioData.vtimes : [];
          const vdurations = Array.isArray(audioData?.vdurations) ? audioData.vdurations : [];
          const wordEnd = wtimes.length ? Math.max(...wtimes.map((t,i)=>Number(t||0)+Number(wdurations[i]||0))) : 0;
          const visemeEnd = vtimes.length ? Math.max(...vtimes.map((t,i)=>Number(t||0)+Number(vdurations[i]||0))) : 0;
          const estimatedMs = Math.max(wordEnd, visemeEnd, 250);
          speechEndTimer = setTimeout(() => {
            speechEndTimer = null; setState('normal');
            const cb = speechCallback; speechCallback = null; if (cb) cb();
          }, estimatedMs + 120);
        } catch (err) {
          console.error('[Zeuvastec Maya] speakAudio error', err);
          setState('normal'); const cb = speechCallback; speechCallback = null; if (cb) cb();
        }
      } else if (message.type === 'error') {
        console.error('[Zeuvastec Maya] HeadTTS message error', message.data?.error || message.data);
        mobileNativeFallback = true; setState('normal');
        const cb = speechCallback; speechCallback = null; if (cb) cb();
      }
    };
    await headtts.connect();
    await headtts.setup({ voice: CONFIG.voice, language: CONFIG.language, speed: 1.05, audioEncoding: 'wav' });
    configuredRate = 1.05;
    setLoading('', false);
    return headtts;
  })();
  try { return await ttsInitializing; }
  finally { ttsInitializing = null; }
}

function visemesForWord(word) {
  const w = String(word || '').toLowerCase().replace(/[^a-z]/g, '');
  if (!w) return ['sil'];
  const map = [];
  for (const ch of w) {
    if ('aeiou'.includes(ch)) {
      map.push(ch === 'a' ? 'aa' : ch === 'e' ? 'E' : ch === 'i' ? 'I' : ch === 'o' ? 'O' : 'U');
    } else if ('bmp'.includes(ch)) map.push('PP');
    else if ('fv'.includes(ch)) map.push('FF');
    else if ('sz'.includes(ch)) map.push('SS');
    else if (ch === 't' || ch === 'd') map.push('DD');
    else if (ch === 'k' || ch === 'g' || ch === 'q') map.push('kk');
    else if (ch === 'n') map.push('nn');
    else if (ch === 'r') map.push('RR');
    else if (ch === 'l') map.push('DD');
    else if (ch === 'c' || ch === 'j') map.push('CH');
    else if (ch === 'h') map.push('TH');
    else map.push('sil');
  }
  return map.slice(0, 8);
}

function animateWordVisemes(word, durationMs = 260) {
  if (!head) return;
  const seq = visemesForWord(word);
  const step = Math.max(45, Math.floor(Math.max(90, durationMs) / Math.max(1, seq.length)));
  let i = 0;
  stopFallbackFace();
  const tick = () => {
    if (!head || i >= seq.length) { fallbackVisemeTimer = null; return; }
    try { head.setFixedValue('viseme_' + seq[i++], step / 1000); } catch (e) {}
    fallbackVisemeTimer = setTimeout(tick, step);
  };
  tick();
}
function stopFallbackFace() {
  if (fallbackVisemeTimer) { clearInterval(fallbackVisemeTimer); fallbackVisemeTimer = null; }
}

window.ZEUVASTEC_AVATAR_SPEAK = async (text, options = {}) => {
  if (!text) return;
  if (!head) {
    if (options.onEnd) options.onEnd();
    return;
  }

  // Mobile: use the device TTS for stability/latency, but drive the face from
  // SpeechSynthesis word-boundary events instead of an unrelated free-running mouth loop.
  // Native mobile TTS does not expose phoneme/viseme timestamps, so this is the closest
  // browser-local synchronization path without a paid/server TTS service.
  if (MOBILE_NATIVE_TTS) {
    try {
      stopFallbackFace();
      window.speechSynthesis.cancel();
      window.speechSynthesis.resume();

      const utterance = new SpeechSynthesisUtterance(String(text).slice(0, 500));
      utterance.lang = 'en-US';
      utterance.rate = Math.max(0.85, Math.min(1.15, Number(options.rate || 1.05)));
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const female = voices.find(v => /^(en-US|en_US)$/i.test(v.lang) && /female|samantha|ava|aria|jenny|zira|susan|sara/i.test(v.name))
        || voices.find(v => /^en-US/i.test(v.lang))
        || voices.find(v => /^en/i.test(v.lang));
      if (female) utterance.voice = female;

      speechCallback = options.onEnd || null;
      setState('speaking');
      let lastBoundaryMs = 0;
      let boundaryCount = 0;
      const words = String(text).trim().split(/\s+/);

      utterance.onstart = () => {
        try { window.speechSynthesis.resume(); } catch (e) {}
        setState('speaking');
        if (words[0]) animateWordVisemes(words[0], 260);
      };

      utterance.onboundary = (event) => {
        if (event.name && event.name !== 'word') return;
        const now = Number(event.elapsedTime || 0) * 1000;
        const index = Math.max(0, Number(event.charIndex || 0));
        const before = String(text).slice(0, index);
        const wordIndex = before.trim() ? before.trim().split(/\s+/).length : 0;
        const word = String(text).slice(index).split(/\s+/)[0] || words[wordIndex] || '';
        const delta = lastBoundaryMs ? Math.max(80, now - lastBoundaryMs) : 260;
        lastBoundaryMs = now;
        boundaryCount++;
        animateWordVisemes(word, delta);
      };

      const finish = () => {
        stopFallbackFace();
        try { head.setFixedValue('viseme_sil', 0.12); } catch (e) {}
        setState('normal');
        const cb = speechCallback; speechCallback = null; if (cb) cb();
      };
      utterance.onend = finish;
      utterance.onerror = (event) => {
        console.warn('[Zeuvastec Maya] mobile speech error', event?.error);
        finish();
      };

      // Do not delay the speak call and do not run a hidden test utterance on iOS.
      // Safari is sensitive to cancellation/queued utterances.
      window.speechSynthesis.speak(utterance);
      window.setTimeout(() => { try { window.speechSynthesis.resume(); } catch (e) {} }, 50);
      return;
    } catch (err) {
      console.warn('[Zeuvastec Maya] mobile native TTS failed', err);
    }
  }

  if (!headtts) {
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
  try { window.speechSynthesis?.cancel?.(); } catch (e) {}
  if (speechEndTimer) { clearTimeout(speechEndTimer); speechEndTimer = null; }
  setState('normal');
  const cb = speechCallback;
  speechCallback = null;
  if (cb) cb();
};

// On mobile, use the first real user interaction with the microphone as a
// safe point to start loading HeadTTS WASM in the background. This prevents
// the old native-speech-only path (which had no viseme stream) while avoiding
// a heavy model load during initial page startup.

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
    if (!IS_MOBILE) {
      await initTTS();
    }
    // On mobile the TTS/lip-sync engine is loaded lazily, after the user has
    // interacted with the conversation, to avoid the startup memory spike.
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

// Microphone layout is handled by CSS; no scrollIntoView is used on mobile.
