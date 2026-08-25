/* Zeuvastec Language — Tutor Alex Avatar 3D V4
 * Real 3D avatar: NO talking-photo fallback.
 * Audio is the animation driver. HeadTTS returns phoneme/viseme timestamps and
 * TalkingHead applies them to ARKit/Oculus facial blend shapes while its own
 * idle/speaking animation drives eyes, brows, head and upper-body motion.
 */
import { TalkingHead } from 'https://cdn.jsdelivr.net/npm/@met4citizen/talkinghead@1.7/modules/talkinghead.mjs';
import { HeadTTS } from 'https://cdn.jsdelivr.net/npm/@met4citizen/headtts@1.3/+esm';

const AVATAR_CONFIG = Object.freeze({
  is_talking_photo: false,
  full_facial_animation: true,
  audio_driven_lipsync: true,
  head_idle_animation: true,
  natural_blink_interval_min_s: 3.0,
  natural_blink_interval_max_s: 4.0,
  model_fps: 60,
  voice: 'am_fenrir',
  language: 'en-us'
});

window.ZEUVASTEC_AVATAR_CONFIG = AVATAR_CONFIG;

const stage = document.getElementById('tutor-stage');
const node = document.getElementById('tutor-3d-avatar');
const loading = document.getElementById('avatar-3d-loading');
if (!stage || !node) throw new Error('Tutor 3D container not found');

// This is the working male avatar distributed with HeadAudio/TalkingHead demos.
// It is a real GLB rig, not a photograph.
const AVATAR_URL = 'https://cdn.jsdelivr.net/gh/met4citizen/HeadAudio@main/avatars/david.glb';

let head = null;
let headtts = null;
let ready = false;
let speechQueueBusy = false;
let speechCallback = null;
let idleTimer = null;

function setLoading(text, visible = true) {
  if (!loading) return;
  loading.textContent = text;
  loading.style.display = visible ? '' : 'none';
}

function setState(state) {
  stage.dataset.state = state;
  if (typeof window.tutorAvatarSetState === 'function') window.tutorAvatarSetState(state);
}

function scheduleIdleAttention() {
  clearTimeout(idleTimer);
  if (!head || document.visibilityState !== 'visible') return;
  const wait = 3000 + Math.random() * 1000;
  idleTimer = setTimeout(() => {
    if (!head || speechQueueBusy) return scheduleIdleAttention();
    // TalkingHead's own idle animation handles the actual blink/head motion.
    head.lookAtCamera(500 + Math.random() * 700);
    scheduleIdleAttention();
  }, wait);
}

async function init() {
  try {
    stage.dataset.isTalkingPhoto = 'false';
    stage.dataset.fullFacialAnimation = 'true';
    stage.dataset.audioDrivenLipsync = 'true';
    setLoading('Carregando Avatar 3D…');

    head = new TalkingHead(node, {
      cameraView: 'upper',
      modelFPS: 60,
      modelPixelRatio: Math.min(window.devicePixelRatio || 1, 2),
      modelMovementFactor: 0.85,
      cameraRotateEnable: false,
      cameraPanEnable: false,
      cameraZoomEnable: false,
      avatarIdleEyeContact: 0.72,
      avatarIdleHeadMove: 0.75,
      avatarSpeakingEyeContact: 0.92,
      avatarSpeakingHeadMove: 0.95,
      avatarListeningEyeContact: 0.82,
      mixerGainSpeech: 1.0,
      lightAmbientColor: 0xffffff,
      lightAmbientIntensity: 2.2,
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
      avatarIdleEyeContact: 0.72,
      avatarIdleHeadMove: 0.75,
      avatarSpeakingEyeContact: 0.92,
      avatarSpeakingHeadMove: 0.95,
      avatarListeningEyeContact: 0.82,
      // Keep the character lively at rest and during speech.
      baseline: {
        eyeBlinkLeft: 0.0,
        eyeBlinkRight: 0.0,
        mouthClose: 0.0
      }
    }, (ev) => {
      if (ev?.lengthComputable) {
        setLoading(`Avatar 3D ${Math.round(ev.loaded / ev.total * 100)}%`);
      }
    });

    head.setView('upper', { cameraY: 0.03, cameraDistance: -0.035 });
    head.lookAtCamera(600);

    setLoading('Preparando voz + lip-sync…');
    headtts = new HeadTTS({
      endpoints: ['webgpu', 'wasm'],
      languages: ['en-us'],
      voices: ['am_fenrir'],
      audioCtx: head.audioCtx,
      workerModule: 'https://cdn.jsdelivr.net/npm/@met4citizen/headtts@1.3/modules/worker-tts.mjs',
      dictionaryURL: 'https://cdn.jsdelivr.net/npm/@met4citizen/headtts@1.3/dictionaries/',
      defaultVoice: 'am_fenrir',
      defaultLanguage: 'en-us',
      defaultSpeed: 0.9,
      defaultAudioEncoding: 'wav',
      frameRate: 40,
      deltaStart: -10,
      deltaEnd: 10
    });

    // HeadTTS -> TalkingHead is the critical audio-driven path. The returned
    // object contains audio + words + visemes + phonemes + exact timestamps.
    headtts.onmessage = (message) => {
      if (message.type === 'error') {
        console.error('[Zeuvastec Avatar] HeadTTS error:', message.data?.error || message.data);
        return;
      }
      if (message.type !== 'audio') return;
      try {
        setState('speaking');
        speechQueueBusy = true;
        head.lookAtCamera(300);
        head.speakWithHands();
        head.speakAudio(message.data, {}, () => {
          // TalkingHead fires this callback as each queued speech item is processed.
        });
      } catch (err) {
        console.error('[Zeuvastec Avatar] speakAudio:', err);
        speechQueueBusy = false;
        setState('normal');
      }
    };

    headtts.onstart = () => {
      speechQueueBusy = true;
      setState('speaking');
      head.lookAtCamera(250);
      head.speakWithHands();
    };

    headtts.onend = () => {
      speechQueueBusy = false;
      setState('normal');
      const cb = speechCallback;
      speechCallback = null;
      if (cb) cb();
      scheduleIdleAttention();
    };

    headtts.onerror = (err) => {
      console.error('[Zeuvastec Avatar] HeadTTS:', err);
      speechQueueBusy = false;
      setState('normal');
      const cb = speechCallback;
      speechCallback = null;
      if (cb) cb();
    };

    await headtts.connect();
    await headtts.setup({ voice: 'am_fenrir', language: 'en-us', speed: 0.9, audioEncoding: 'wav' });

    ready = true;
    window.ZEUVASTEC_AVATAR_READY = true;
    stage.classList.add('avatar-3d-ready');
    setLoading('', false);
    setState('normal');
    scheduleIdleAttention();
    window.dispatchEvent(new CustomEvent('zeuvastec-avatar-ready'));
  } catch (error) {
    console.error('[Zeuvastec Avatar] Initialization failed:', error);
    ready = false;
    window.ZEUVASTEC_AVATAR_READY = false;
    stage.classList.add('avatar-3d-error');
    setLoading('Avatar 3D não pôde ser carregado. Verifique a conexão e recarregue.', true);
    setState('normal');
    // IMPORTANT: never replace the 3D avatar with a static photo.
  }
}

window.ZEUVASTEC_AVATAR_SPEAK = async (text, options = {}) => {
  if (!text) return;
  if (!ready || !headtts) {
    console.warn('[Zeuvastec Avatar] 3D engine not ready; speech was not routed to a photo fallback.');
    if (typeof options.onEnd === 'function') options.onEnd();
    return;
  }
  try {
    speechCallback = options.onEnd || null;
    headtts.clear();
    await headtts.setup({
      speed: Math.max(0.25, Math.min(4, options.rate || 0.9)),
      voice: 'am_fenrir',
      language: 'en-us',
      audioEncoding: 'wav'
    });
    setState('speaking');
    head.lookAtCamera(250);
    headtts.synthesize({ input: String(text).slice(0, 500) });
  } catch (error) {
    console.error('[Zeuvastec Avatar] synthesize:', error);
    const cb = speechCallback;
    speechCallback = null;
    speechQueueBusy = false;
    setState('normal');
    if (cb) cb();
  }
};

// If another part of the app tries to use browser speech while the avatar is
// active, cancel it so the visual/audio identity cannot drift apart.
window.addEventListener('zeuvastec-avatar-ready', () => {
  if (window.speechSynthesis) window.speechSynthesis.cancel();
});

document.addEventListener('visibilitychange', () => {
  clearTimeout(idleTimer);
  if (!head) return;
  if (document.visibilityState === 'visible') {
    head.start();
    scheduleIdleAttention();
  } else {
    head.stop();
  }
});

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
