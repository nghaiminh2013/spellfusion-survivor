// Web Audio API Synthesizer - Âm thanh Retro cho Game
let audioCtx = null;
let masterGain = null;
let muted = false;
window.gameVolume = 50; // Default volume: 50%

function initAudio() {
  if (audioCtx) return;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  audioCtx = new AudioContextClass();
  masterGain = audioCtx.createGain();
  masterGain.connect(audioCtx.destination);
  const actualVol = 0.24 * (window.gameVolume / 100);
  masterGain.gain.setValueAtTime(muted ? 0 : actualVol, audioCtx.currentTime);
}

function checkResume() {
  initAudio();
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

const soundManager = {
  mute() {
    muted = true;
    if (masterGain) masterGain.gain.setValueAtTime(0, audioCtx.currentTime);
  },
  
  unmute() {
    muted = false;
    if (masterGain) {
      const actualVol = 0.24 * (window.gameVolume / 100);
      masterGain.gain.setValueAtTime(actualVol, audioCtx.currentTime);
    }
  },

  setVolume(vol) {
    window.gameVolume = vol;
    checkResume();
    if (masterGain && !muted) {
      const actualVol = 0.24 * (vol / 100);
      masterGain.gain.setValueAtTime(actualVol, audioCtx.currentTime);
    }
  },

  toggleMute() {
    if (muted) this.unmute();
    else this.mute();
    return muted;
  },

  // Âm thanh nhặt ngọc nguyên tố
  playOrbPickup(element = 'fire') {
    checkResume();
    if (!audioCtx || muted) return;

    const t = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.connect(gain);
    gain.connect(masterGain);

    osc.type = 'sine';
    
    // Tần số khác nhau cho từng loại ngọc
    let startFreq = 440;
    if (element === 'fire') startFreq = 300;
    else if (element === 'water') startFreq = 500;
    else if (element === 'lightning') startFreq = 650;
    else if (element === 'wind') startFreq = 400;
    else if (element === 'wood') startFreq = 350;
    else if (element === 'magma') startFreq = 280;

    osc.frequency.setValueAtTime(startFreq, t);
    osc.frequency.exponentialRampToValueAtTime(startFreq * 2, t + 0.15);

    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);

    osc.start(t);
    osc.stop(t + 0.15);
  },

  // Âm thanh bắn phép thuật dựa trên Combo Ngọc
  playSpell(spellType = 'normal') {
    checkResume();
    if (!audioCtx || muted) return;

    const t = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(masterGain);

    switch (spellType) {
      case 'fire_fire': // Pyroclast Stream
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, t);
        osc.frequency.linearRampToValueAtTime(100, t + 0.1);
        gain.gain.setValueAtTime(0.4, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
        osc.start(t);
        osc.stop(t + 0.15);
        break;

      case 'water_water': // Glacial Ward
        osc.type = 'sine';
        osc.frequency.setValueAtTime(500, t);
        osc.frequency.exponentialRampToValueAtTime(800, t + 0.25);
        gain.gain.setValueAtTime(0.3, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.25);
        osc.start(t);
        osc.stop(t + 0.25);
        break;

      case 'lightning_lightning': // Volt Arc
        // Âm thanh giật sét đứt quãng cực nhanh
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1200, t);
        osc.frequency.setValueAtTime(300, t + 0.04);
        osc.frequency.setValueAtTime(900, t + 0.08);
        gain.gain.setValueAtTime(0.5, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.12);
        osc.start(t);
        osc.stop(t + 0.12);
        break;

      case 'wind_wind': // Zephyr Tempest
        // Tiếng gió thổi vù vù
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(150, t);
        osc.frequency.linearRampToValueAtTime(300, t + 0.2);
        gain.gain.setValueAtTime(0.5, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);
        osc.start(t);
        osc.stop(t + 0.2);
        break;

      case 'fire_lightning': // Supernova Orb (Nổ to)
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, t);
        osc.frequency.exponentialRampToValueAtTime(40, t + 0.4);
        gain.gain.setValueAtTime(0.8, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.4);
        osc.start(t);
        osc.stop(t + 0.4);
        break;

      default: // Các chiêu cơ bản khác
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, t);
        osc.frequency.exponentialRampToValueAtTime(220, t + 0.12);
        gain.gain.setValueAtTime(0.4, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.12);
        osc.start(t);
        osc.stop(t + 0.12);
        break;
    }
  },

  // Âm thanh quái bị chém trúng / nổ
  playHit() {
    checkResume();
    if (!audioCtx || muted) return;

    const t = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.setValueAtTime(50, t + 0.05);

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(250, t);

    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);

    osc.start(t);
    osc.stop(t + 0.1);
  },

  // Âm thanh nổ to (Bùm)
  playExplosion() {
    checkResume();
    if (!audioCtx || muted) return;

    const t = audioCtx.currentTime;
    const bufferSize = audioCtx.sampleRate * 0.4;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(300, t);
    filter.frequency.exponentialRampToValueAtTime(30, t + 0.4);

    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.8, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.4);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);

    noise.start(t);
    noise.stop(t + 0.4);
  },

  // Âm thanh lên cấp (Tíng tinh tinh)
  playLevelUp() {
    checkResume();
    if (!audioCtx || muted) return;

    const t = audioCtx.currentTime;
    const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5 (Hợp âm C trưởng)
    
    notes.forEach((freq, index) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + index * 0.08);
      
      gain.gain.setValueAtTime(0, t);
      gain.gain.setValueAtTime(0.35, t + index * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.01, t + index * 0.08 + 0.25);
      
      osc.connect(gain);
      gain.connect(masterGain);
      
      osc.start(t + index * 0.08);
      osc.stop(t + index * 0.08 + 0.25);
    });
  },

  // Âm thanh Game Over (Thua cuộc buồn bã)
  playGameOver() {
    checkResume();
    if (!audioCtx || muted) return;

    const t = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(300, t);
    osc.frequency.linearRampToValueAtTime(70, t + 0.8);

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, t);
    filter.frequency.exponentialRampToValueAtTime(40, t + 0.8);

    gain.gain.setValueAtTime(0.6, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.8);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);

    osc.start(t);
    osc.stop(t + 0.8);
  }
};
