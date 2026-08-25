/* Zeuvastec Language — Tutor Alex Avatar 3D V5
 * Procedural 3D avatar: no talking-photo fallback.
 * HeadTTS supplies WAV audio + phoneme/viseme timestamps; Three.js renders
 * a lightweight 3D character whose face, jaw, eyes, brows, head and shoulders
 * animate from the speech timeline.
 */
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js/+esm';
import { HeadTTS } from 'https://cdn.jsdelivr.net/npm/@met4citizen/headtts@1.3/+esm';

const CONFIG = Object.freeze({
  is_talking_photo: false,
  full_facial_animation: true,
  audio_driven_lipsync: true,
  head_idle_animation: true,
  natural_blink_interval_min_s: 3,
  natural_blink_interval_max_s: 4,
  model_fps: 60,
  voice: 'am_fenrir',
  language: 'en-us'
});
window.ZEUVASTEC_AVATAR_CONFIG = CONFIG;

const stage = document.getElementById('tutor-stage');
const node = document.getElementById('tutor-3d-avatar');
const loading = document.getElementById('avatar-3d-loading');
if (!stage || !node) throw new Error('Tutor 3D container not found');

let renderer, scene, camera, avatar;
let headtts = null;
let ready = false;
let currentSpeech = null;
let speechCallback = null;
let blinkAt = performance.now() + 3300;
let blinkUntil = 0;
let idleSeed = Math.random() * 10;
let raf = 0;
let resizeObserver = null;
let speechQueue = 0;

const VISEME = {
  sil:[0.02,0.00,0.10,0.00], aa:[0.90,0.72,0.35,0.02], E:[0.42,0.18,0.55,0.22],
  I:[0.30,0.12,0.48,0.18], O:[0.70,0.50,0.30,-0.04], U:[0.55,0.40,0.32,-0.02],
  PP:[0.08,0.05,0.22,0.00], SS:[0.18,0.08,0.58,0.10], TH:[0.30,0.15,0.50,0.08],
  DD:[0.34,0.16,0.46,0.12], FF:[0.24,0.10,0.60,0.14], kk:[0.36,0.18,0.44,0.04],
  nn:[0.28,0.12,0.48,0.06], RR:[0.32,0.14,0.40,0.00], CH:[0.45,0.24,0.48,0.02]
};

function setLoading(text, visible=true){ if(!loading)return; loading.textContent=text; loading.style.display=visible?'':'none'; }
function setState(state){ stage.dataset.state=state; if(typeof window.tutorAvatarSetState==='function') window.tutorAvatarSetState(state); }

function mat(color, rough=.65, metal=0){ return new THREE.MeshStandardMaterial({color, roughness:rough, metalness:metal}); }
function sphere(name, color, scale){ const m=new THREE.Mesh(new THREE.SphereGeometry(1,32,24),mat(color)); m.name=name; m.scale.set(...scale); return m; }
function box(name,color,scale,radius=.08){ const m=new THREE.Mesh(new THREE.BoxGeometry(1,1,1),mat(color)); m.name=name; m.scale.set(...scale); return m; }
function torus(name,color,r1,r2,rot=[0,0,0]){ const m=new THREE.Mesh(new THREE.TorusGeometry(r1,r2,12,48),mat(color)); m.name=name; m.rotation.set(...rot); return m; }

function createAvatar(){
  const root=new THREE.Group(); root.position.y=-0.55;
  const body=new THREE.Group(); root.add(body);
  const shirt=box('shirt',0x0b3c78,[2.15,1.55,1.05],.18); shirt.position.set(0,-1.38,0); body.add(shirt);
  const collarL=box('collarL',0x164f92,[.62,.22,.12]); collarL.position.set(-.42,-.78,.56); collarL.rotation.z=-.25; body.add(collarL);
  const collarR=box('collarR',0x164f92,[.62,.22,.12]); collarR.position.set(.42,-.78,.56); collarR.rotation.z=.25; body.add(collarR);
  const neck=sphere('neck',0xd49a72,[.42,.55,.42]); neck.position.set(0,-.55,0); body.add(neck);
  const headG=new THREE.Group(); headG.name='head'; headG.position.set(0,.20,.02); body.add(headG);
  const face=sphere('face',0xdba37c,[1.16,1.34,1.03]); face.position.z=.03; headG.add(face);
  const hair=sphere('hair',0x3a241a,[1.20,.68,1.05]); hair.position.set(0,.88,-.02); hair.rotation.x=-.18; headG.add(hair);
  const sideHairL=sphere('sideHairL',0x3a241a,[.30,.62,.60]); sideHairL.position.set(-1.02,.48,.0); headG.add(sideHairL);
  const sideHairR=sideHairL.clone(); sideHairR.position.x=1.02; headG.add(sideHairR);
  const earL=sphere('earL',0xd49a72,[.20,.34,.20]); earL.position.set(-1.12,.12,0); headG.add(earL);
  const earR=earL.clone(); earR.position.x=1.12; headG.add(earR);

  const eyeL=sphere('eyeL',0xfafafa,[.24,.17,.12]); eyeL.position.set(-.42,.32,.95); headG.add(eyeL);
  const eyeR=eyeL.clone(); eyeR.position.x=.42; eyeR.name='eyeR'; headG.add(eyeR);
  const irisL=sphere('irisL',0x1976c9,[.085,.09,.045]); irisL.position.set(-.42,.32,1.06); headG.add(irisL);
  const irisR=irisL.clone(); irisR.position.x=.42; irisR.name='irisR'; headG.add(irisR);
  const browL=box('browL',0x2b1b16,[.45,.075,.08]); browL.position.set(-.42,.60,.99); browL.rotation.z=-.08; headG.add(browL);
  const browR=browL.clone(); browR.position.x=.42; browR.rotation.z=.08; browR.name='browR'; headG.add(browR);

  const nose=sphere('nose',0xc98b68,[.14,.24,.18]); nose.position.set(0,.02,1.03); headG.add(nose);
  const mouthG=new THREE.Group(); mouthG.name='mouth'; mouthG.position.set(0,-.39,1.01); headG.add(mouthG);
  const cavity=sphere('mouthCavity',0x3a1015,[.34,.085,.035]); cavity.name='mouthCavity'; mouthG.add(cavity);
  const upper=sphere('upperLip',0xb95f68,[.34,.055,.045]); upper.position.y=.055; mouthG.add(upper);
  const lower=sphere('lowerLip',0xc76c76,[.30,.045,.05]); lower.position.y=-.055; mouthG.add(lower);
  const tongue=sphere('tongue',0xe58b86,[.18,.045,.025]); tongue.position.set(0,-.055,.04); mouthG.add(tongue);

  const glasses=new THREE.Group(); glasses.name='glasses'; headG.add(glasses);
  const frameL=torus('frameL',0x151c24,.27,.035,[Math.PI/2,0,0]); frameL.position.set(-.42,.31,1.02); glasses.add(frameL);
  const frameR=frameL.clone(); frameR.position.x=.42; frameR.name='frameR'; glasses.add(frameR);
  const bridge=box('bridge',0x151c24,[.30,.035,.035]); bridge.position.set(0,.31,1.02); glasses.add(bridge);

  const headset=new THREE.Group(); headset.name='headset'; headG.add(headset);
  const padL=box('padL',0x17263a,[.18,.50,.26],.09); padL.position.set(-1.16,.05,.02); headset.add(padL);
  const padR=padL.clone(); padR.position.x=1.16; padR.name='padR'; headset.add(padR);
  const band=torus('band',0x17263a,1.17,.045,[Math.PI/2,0,0]); band.scale.y=.95; band.position.y=.20; headset.add(band);
  const micArm=box('micArm',0x17263a,[.55,.035,.035]); micArm.position.set(.86,-.22,.70); micArm.rotation.z=-.35; headset.add(micArm);
  const micTip=sphere('micTip',0x17263a,[.10,.07,.07]); micTip.position.set(.62,-.34,.70); headset.add(micTip);

  // shoulders and subtle breathing anchors
  const shoulderL=sphere('shoulderL',0x0b3c78,[.78,.38,.72]); shoulderL.position.set(-1.15,-1.15,.0); body.add(shoulderL);
  const shoulderR=shoulderL.clone(); shoulderR.position.x=1.15; shoulderR.name='shoulderR'; body.add(shoulderR);
  root.userData={body,headG,face,mouthG,cavity,upper,lower,tongue,eyeL,eyeR,irisL,irisR,browL,browR,headset,shoulderL,shoulderR};
  return root;
}

function initThree(){
  scene=new THREE.Scene(); scene.background=null;
  camera=new THREE.PerspectiveCamera(24,1,.1,100); camera.position.set(0,.15,7.4); camera.lookAt(0,.0,0);
  renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(devicePixelRatio||1,2)); renderer.setSize(node.clientWidth||520,node.clientHeight||360,false);
  renderer.outputColorSpace=THREE.SRGBColorSpace; renderer.shadowMap.enabled=false; node.innerHTML=''; node.appendChild(renderer.domElement);
  const hemi=new THREE.HemisphereLight(0xffffff,0xd7e9ff,2.3); scene.add(hemi);
  const key=new THREE.DirectionalLight(0xffffff,2.4); key.position.set(3,5,6); scene.add(key);
  const fill=new THREE.DirectionalLight(0x9ecbff,1.5); fill.position.set(-4,2,3); scene.add(fill);
  avatar=createAvatar(); scene.add(avatar);
  resizeObserver=new ResizeObserver(()=>resize()); resizeObserver.observe(node);
  window.addEventListener('resize',resize,{passive:true});
}
function resize(){ if(!renderer||!camera)return; const w=Math.max(1,node.clientWidth),h=Math.max(1,node.clientHeight); camera.aspect=w/h; camera.updateProjectionMatrix(); renderer.setSize(w,h,false); }

function blinkNow(){ blinkUntil=performance.now()+155; blinkAt=performance.now()+(CONFIG.natural_blink_interval_min_s+Math.random()*(CONFIG.natural_blink_interval_max_s-CONFIG.natural_blink_interval_min_s))*1000; }
function applyViseme(v){ const a=VISEME[v]||VISEME.sil; const [open,jaw,wide,smile]=a; const u=avatar.userData; u.mouthG.scale.y=.35+open*1.7; u.mouthG.scale.x=.85+wide*.35; u.mouthG.position.y=-.39-jaw*.035; u.cavity.scale.y=.55+open*2.3; u.lower.position.y=-.055-open*.025; u.upper.position.y=.055+open*.012; u.tongue.scale.x=.7+open*.8; u.tongue.position.y=-.055-open*.03; u.browL.rotation.z=-.08-smile*.08; u.browR.rotation.z=.08+smile*.08; }
function resetFace(){ applyViseme('sil'); }

function renderLoop(now){
  raf=requestAnimationFrame(renderLoop); if(!avatar||!renderer)return;
  const t=now*.001; const u=avatar.userData;
  // Always-alive idle animation: breathing, tiny head motion, eye contact.
  const speaking=!!currentSpeech; const amp=speaking?currentSpeech.amp:0;
  avatar.position.y=-.55+Math.sin(t*1.55)*.018+(amp*.025);
  u.headG.rotation.y=Math.sin(t*.42+idleSeed)*.025 + (speaking?Math.sin(t*1.7)*.025:0);
  u.headG.rotation.x=Math.sin(t*.31+idleSeed)*.018 + (speaking?Math.sin(t*1.2)*.012:0);
  u.shoulderL.position.y=-1.15+Math.sin(t*1.55)*.012; u.shoulderR.position.y=-1.15+Math.sin(t*1.55+.15)*.012;
  u.irisL.position.x=-.42+Math.sin(t*.5)*.018; u.irisR.position.x=.42+Math.sin(t*.5)*.018;
  if(now>=blinkAt) blinkNow();
  let blink=0; if(blinkUntil>now) { const p=(now-(blinkUntil-155))/155; blink=Math.sin(Math.min(1,Math.max(0,p))*Math.PI); }
  u.eyeL.scale.y=.17*(1-blink*.94); u.eyeR.scale.y=.17*(1-blink*.94);
  if(currentSpeech){
    const elapsed=(performance.now()-currentSpeech.wallStart); const ms=elapsed;
    const idx=currentSpeech.vtimes.findIndex((x,i)=>ms>=x && ms<(x+(currentSpeech.vdurations[i]||70)));
    if(idx>=0) applyViseme(currentSpeech.visemes[idx]); else if(ms>currentSpeech.duration-90) resetFace();
    currentSpeech.amp=Math.max(0,Math.min(1,currentSpeech.amp*.86+(Math.sin(t*22)*.5+.5)*.14));
    if(ms>=currentSpeech.duration){ finishSpeech(); }
  }
  renderer.render(scene,camera);
}

function playSpeechAudio(data){
  if(!data?.audio) throw new Error('HeadTTS não retornou AudioBuffer.');
  const ctx=new (window.AudioContext||window.webkitAudioContext)();
  if(ctx.state==='suspended') ctx.resume();
  const source=ctx.createBufferSource(); source.buffer=data.audio;
  const gain=ctx.createGain(); gain.gain.value=1;
  const analyser=ctx.createAnalyser(); analyser.fftSize=256; analyser.smoothingTimeConstant=.72;
  source.connect(gain); gain.connect(analyser); analyser.connect(ctx.destination);
  const start=ctx.currentTime;
  source.start();
  const duration=data.audio.duration*1000;
  currentSpeech={ctx,source,analyser,wallStart:performance.now(),duration,visemes:data.visemes||[],vtimes:data.vtimes||[],vdurations:data.vdurations||[],amp:0,done:false};
  source.onended=()=>{ if(currentSpeech&&currentSpeech.source===source) finishSpeech(); try{ctx.close();}catch(e){} };
  setState('speaking');
}
function finishSpeech(){ if(!currentSpeech||currentSpeech.done)return; currentSpeech.done=true; resetFace(); const cb=speechCallback; speechCallback=null; currentSpeech=null; speechQueue=Math.max(0,speechQueue-1); setState('normal'); if(cb)cb(); }

async function initTTS(){
  setLoading('Preparando voz neural + lip-sync…');
  headtts=new HeadTTS({
    endpoints:['webgpu','wasm'], languages:['en-us'], voices:['am_fenrir'],
    workerModule:'https://cdn.jsdelivr.net/npm/@met4citizen/headtts@1.3/modules/worker-tts.mjs',
    dictionaryURL:'https://cdn.jsdelivr.net/npm/@met4citizen/headtts@1.3/dictionaries/',
    defaultVoice:'am_fenrir', defaultLanguage:'en-us', defaultSpeed:.9, defaultAudioEncoding:'wav', frameRate:40
  });
  headtts.onmessage=(message)=>{
    if(message.type==='audio'){ try{ playSpeechAudio(message.data); }catch(e){ console.error('[Zeuvastec Avatar] audio',e); finishSpeech(); } }
    else if(message.type==='error'){ console.error('[Zeuvastec Avatar] HeadTTS',message.data?.error||message.data); finishSpeech(); }
  };
  headtts.onstart=()=>setState('speaking');
  headtts.onend=()=>{ if(!currentSpeech) { setState('normal'); const cb=speechCallback; speechCallback=null; if(cb)cb(); } };
  headtts.onerror=(e)=>{console.error('[Zeuvastec Avatar] HeadTTS',e); finishSpeech();};
  await headtts.connect();
  await headtts.setup({voice:'am_fenrir',language:'en-us',speed:.9,audioEncoding:'wav'});
}

window.ZEUVASTEC_AVATAR_SPEAK=async(text,options={})=>{
  if(!text)return;
  if(!headtts){ if(options.onEnd)options.onEnd(); return; }
  try{
    speechCallback=options.onEnd||null; speechQueue++; setState('thinking');
    headtts.clear(); await headtts.setup({voice:'am_fenrir',language:'en-us',speed:Math.max(.5,Math.min(1.4,options.rate||.9)),audioEncoding:'wav'});
    headtts.synthesize({input:String(text).slice(0,500)});
  }catch(e){ console.error('[Zeuvastec Avatar] synthesize',e); speechQueue=Math.max(0,speechQueue-1); const cb=speechCallback;speechCallback=null;setState('normal');if(cb)cb(); }
};

window.ZEUVASTEC_AVATAR_READY=false;
stage.dataset.isTalkingPhoto='false'; stage.dataset.fullFacialAnimation='true'; stage.dataset.audioDrivenLipsync='true';
try{
  initThree();
  setState('normal');
  setLoading('Avatar 3D pronto.');
  requestAnimationFrame(renderLoop);
  await initTTS();
  ready=true; window.ZEUVASTEC_AVATAR_READY=true; stage.classList.add('avatar-3d-ready'); setLoading('',false); window.dispatchEvent(new CustomEvent('zeuvastec-avatar-ready'));
}catch(e){
  console.error('[Zeuvastec Avatar] initialization failed',e);
  window.ZEUVASTEC_AVATAR_READY=false; stage.classList.add('avatar-3d-error'); setLoading('Avatar 3D carregado; voz neural indisponível neste aparelho.',true);
}

document.addEventListener('visibilitychange',()=>{
  if(document.visibilityState==='hidden'){ if(currentSpeech?.ctx)try{currentSpeech.ctx.suspend();}catch(e){} }
  else { if(currentSpeech?.ctx)try{currentSpeech.ctx.resume();}catch(e){} }
});

const mic=document.getElementById('mic-button');
if(mic)mic.addEventListener('click',()=>{ if(matchMedia('(max-width:700px)').matches) stage.scrollIntoView({behavior:'smooth',block:'center'}); if(avatar)avatar.userData.headG.rotation.y=0; });
