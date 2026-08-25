/* Zeuvastec Language — Tutor Alex 3D V3
 * Real-time 3D avatar + phoneme/viseme-driven speech.
 * TalkingHead renders the rigged GLB; HeadTTS supplies audio, phoneme timing and visemes.
 */
import { TalkingHead } from 'https://cdn.jsdelivr.net/npm/@met4citizen/talkinghead@1.7/modules/talkinghead.mjs';
import { HeadTTS } from 'https://cdn.jsdelivr.net/npm/@met4citizen/headtts@1.3/+esm';

const stage = document.getElementById('tutor-stage');
const node = document.getElementById('tutor-3d-avatar');
const loading = document.getElementById('avatar-3d-loading');
if (!stage || !node) throw new Error('Tutor 3D container not found');

const AVATAR_URL = 'https://cdn.jsdelivr.net/gh/met4citizen/HeadAudio@main/avatars/david.glb';
let head = null;
let headtts = null;
let ready = false;
let speakingCallback = null;
let speechQueueBusy = false;

function setLoading(text) {
  if (loading) loading.textContent = text;
}

function setState(state) {
  if (typeof window.tutorAvatarSetState === 'function') window.tutorAvatarSetState(state);
  stage.dataset.state = state;
}

async function init() {
  try {
    setLoading('Carregando tutor 3D…');
    head = new TalkingHead(node, {
      cameraView: 'upper',
      modelFPS: 60,
      modelPixelRatio: Math.min(window.devicePixelRatio || 1, 2),
      cameraRotateEnable: false,
      cameraPanEnable: false,
      cameraZoomEnable: false,
      avatarIdleEyeContact: 0.65,
      avatarIdleHeadMove: 0.55,
      avatarSpeakingEyeContact: 0.85,
      avatarSpeakingHeadMove: 0.80,
      mixerGainSpeech: 1.0,
      lightAmbientColor: 0xffffff,
      lightAmbientIntensity: 2.1,
      lightDirectColor: 0x9ecbff,
      lightDirectIntensity: 18,
      lightSpotIntensity: 0
    });
    window.ZEUVASTEC_TALKING_HEAD = head;
    head.start();

    await head.showAvatar({
      url: AVATAR_URL,
      body: 'M',
      avatarMood: 'neutral',
      lipsyncLang: 'en',
      avatarIdleEyeContact: 0.65,
      avatarSpeakingEyeContact: 0.85,
      avatarSpeakingHeadMove: 0.80,
      avatarListeningEyeContact: 0.75
    }, (ev) => {
      if (ev?.lengthComputable) setLoading(`Tutor 3D ${Math.round(ev.loaded / ev.total * 100)}%`);
    });

    head.setView('upper', { cameraY: 0.02, cameraDistance: -0.04 });
    head.lookAtCamera(500);

    setLoading('Preparando voz masculina…');
    headtts = new HeadTTS({
      endpoints: ['webgpu', 'wasm'],
      languages: ['en-us'],
      voices: ['am_fenrir'],
      audioCtx: head.audioCtx,
      workerModule: 'https://cdn.jsdelivr.net/npm/@met4citizen/headtts@1.3/modules/worker-tts.mjs',
      dictionaryURL: 'https://cdn.jsdelivr.net/npm/@met4citizen/headtts@1.3/dictionaries/',
      defaultVoice: 'am_fenrir',
      defaultLanguage: 'en-us',
      defaultSpeed: 1,
      defaultAudioEncoding: 'wav',
      frameRate: 40,
      deltaStart: -10,
      deltaEnd: 10
    });

    headtts.onmessage = (message) => {
      if (message.type !== 'audio') return;
      try {
        setState('speaking');
        if (head) {
          head.lookAtCamera(350);
          head.speakWithHands();
          head.speakAudio(message.data, { isRaw: true });
        }
      } catch (err) {
        console.error('[Zeuvastec Avatar] speakAudio', err);
      }
    };

    headtts.onstart = () => {
      speechQueueBusy = true;
      setState('speaking');
    };
    headtts.onend = () => {
      speechQueueBusy = false;
      setState('normal');
      const cb = speakingCallback;
      speakingCallback = null;
      if (cb) cb();
    };
    headtts.onerror = (err) => {
      console.error('[Zeuvastec Avatar] HeadTTS', err);
      speechQueueBusy = false;
      setState('normal');
      const cb = speakingCallback;
      speakingCallback = null;
      if (cb) cb();
    };

    await headtts.connect();
    await headtts.setup({ voice: 'am_fenrir', language: 'en-us', speed: 1, audioEncoding: 'wav' });

    ready = true;
    window.ZEUVASTEC_AVATAR_READY = true;
    stage.classList.add('avatar-3d-ready');
    setLoading('Tutor 3D pronto');
    setState('normal');
    window.dispatchEvent(new CustomEvent('zeuvastec-avatar-ready'));
  } catch (error) {
    console.error('[Zeuvastec Avatar] Falha ao inicializar', error);
    setLoading('Tutor 3D indisponível — usando modo compatível');
    window.ZEUVASTEC_AVATAR_READY = false;
  }
}

window.ZEUVASTEC_AVATAR_SPEAK = (text, options = {}) => {
  if (!text) return;
  if (!ready || !headtts) {
    // The existing speech system remains the safe fallback until the 3D engine is ready.
    if (typeof window.speechSynthesis !== 'undefined') {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'en-US';
      u.rate = options.rate || 0.9;
      u.pitch = 0.9;
      u.onend = options.onEnd || null;
      window.speechSynthesis.speak(u);
    }
    return;
  }
  try {
    headtts.clear();
    speakingCallback = options.onEnd || null;
    setState('speaking');
    head.lookAtCamera(300);
    headtts.setup({ speed: options.rate || 0.9, voice: 'am_fenrir', language: 'en-us', audioEncoding: 'wav' });
    headtts.synthesize({ input: text });
  } catch (error) {
    console.error('[Zeuvastec Avatar] synthesize', error);
    if (speakingCallback) { const cb = speakingCallback; speakingCallback = null; cb(); }
  }
};

window.addEventListener('visibilitychange', () => {
  if (!head) return;
  if (document.visibilityState === 'visible') head.start();
  else head.stop();
});

// Keep the avatar visible when the microphone is tapped on a small screen.
const mic = document.getElementById('mic-button');
if (mic) {
  mic.addEventListener('click', () => {
    if (window.matchMedia('(max-width:700px)').matches) {
      stage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    if (head) head.lookAtCamera(500);
  });
}

init();
