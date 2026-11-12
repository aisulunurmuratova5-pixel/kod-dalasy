/* ====================== Дыбыс (Web Audio, файлсыз, жұмсақ) ====================== */
const SFX = (() => {
  let ac = null, out = null, fxBus = null, bgBus = null, verb = null;
  let fxMuted = false, musicOn = true, lastStep = 0, stepAlt = 0;
  let amb = null;
  const midi = m => 440 * Math.pow(2, (m - 69) / 12);

  function build(){
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    ac = new AC();
    const comp = ac.createDynamicsCompressor();
    comp.threshold.value = -20; comp.ratio.value = 3; comp.attack.value = .01; comp.release.value = .3;
    out = ac.createGain(); out.gain.value = .9;
    out.connect(comp); comp.connect(ac.destination);
    /* Жұмсақ жаңғырық: генерацияланған импульс */
    verb = ac.createConvolver();
    const len = Math.floor(ac.sampleRate * 2.6), ir = ac.createBuffer(2, len, ac.sampleRate);
    for (let ch = 0; ch < 2; ch++){
      const d = ir.getChannelData(ch);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.2);
    }
    verb.buffer = ir;
    const verbTone = ac.createBiquadFilter(); verbTone.type = 'lowpass'; verbTone.frequency.value = 2600;
    const wet = ac.createGain(); wet.gain.value = .32;
    verb.connect(verbTone); verbTone.connect(wet); wet.connect(out);
    /* Эффектілер шинасы: жоғары жиіліктерді жұмсартамыз */
    fxBus = ac.createGain(); fxBus.gain.value = fxMuted ? 0 : .7;
    const soft = ac.createBiquadFilter(); soft.type = 'lowpass'; soft.frequency.value = 3200; soft.Q.value = .5;
    fxBus.connect(soft); soft.connect(out); soft.connect(verb);
    /* Фон шинасы */
    bgBus = ac.createGain(); bgBus.gain.value = 0;
    bgBus.connect(out); bgBus.connect(verb);
    return true;
  }
  function ctx(){
    try {
      if (!ac && !build()) return null;
      if (ac.state === 'suspended' && !document.hidden) ac.resume();
      return ac;
    } catch (e){ return null; }
  }
  const fx = () => (fxMuted ? null : ctx());

  /* Жұмсақ қоңырау: негізгі тон + әлсіз обертондар, ақырын шабуыл */
  function bell(note, when = 0, vol = .12, dur = 1.4, bus){
    const a = bus ? ctx() : fx(); if (!a) return;
    const t = a.currentTime + when, f = midi(note);
    [[1, 1], [2, .22], [3.01, .06]].forEach(([mul, amp]) => {
      const o = a.createOscillator(), g = a.createGain();
      o.type = 'sine'; o.frequency.value = f * mul;
      const d = dur / (mul === 1 ? 1 : mul * .9);
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(vol * amp, t + .012);
      g.gain.exponentialRampToValueAtTime(.0001, t + d);
      o.connect(g); g.connect(bus || fxBus); o.start(t); o.stop(t + d + .05);
    });
  }
  function glide(f0, f1, dur, vol, when = 0, attack = .02, type = 'sine'){
    const a = fx(); if (!a) return;
    const t = a.currentTime + when;
    const o = a.createOscillator(), g = a.createGain();
    o.type = type; o.frequency.setValueAtTime(f0, t);
    if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(f1, t + dur);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + attack); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    o.connect(g); g.connect(fxBus); o.start(t); o.stop(t + dur + .05);
  }
  let noiseBuf = null;
  function noiseSrc(a){
    if (!noiseBuf){
      noiseBuf = a.createBuffer(1, a.sampleRate * 2, a.sampleRate);
      const d = noiseBuf.getChannelData(0); let b = 0;
      for (let i = 0; i < d.length; i++){ b = .97 * b + .03 * (Math.random() * 2 - 1); d[i] = b * 6; }
    }
    const s = a.createBufferSource(); s.buffer = noiseBuf; s.loop = true; return s;
  }
  function breath(dur, vol, f0, f1, when = 0, attack = .08){
    const a = fx(); if (!a) return;
    const t = a.currentTime + when;
    const s = noiseSrc(a), f = a.createBiquadFilter(), g = a.createGain();
    f.type = 'bandpass'; f.Q.value = .8; f.frequency.setValueAtTime(f0, t); f.frequency.exponentialRampToValueAtTime(f1, t + dur);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + attack); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(fxBus); s.start(t, Math.random()); s.stop(t + dur + .05);
  }

  /* ---------- Фондық дала әуені ---------- */
  const SCALE = [62, 64, 67, 69, 71, 74, 76, 79];
  function startAmbient(){
    const a = ctx(); if (!a || amb) return;
    const t = a.currentTime;
    const nodes = [];
    const padF = a.createBiquadFilter(); padF.type = 'lowpass'; padF.frequency.value = 520; padF.Q.value = .3;
    const padG = a.createGain(); padG.gain.value = .5;
    padF.connect(padG); padG.connect(bgBus);
    [[38, 0], [45, 3], [50, -4], [57, 5]].forEach(([n, det], i) => {
      const o = a.createOscillator(), g = a.createGain();
      o.type = i < 2 ? 'triangle' : 'sine'; o.frequency.value = midi(n); o.detune.value = det;
      g.gain.value = [.16, .1, .07, .04][i];
      o.connect(g); g.connect(padF); o.start(t); nodes.push(o);
    });
    const lfo = a.createOscillator(), lfoG = a.createGain();
    lfo.frequency.value = .05; lfoG.gain.value = 180; lfo.connect(lfoG); lfoG.connect(padF.frequency); lfo.start(t); nodes.push(lfo);
    const volLfo = a.createOscillator(), volG = a.createGain();
    volLfo.frequency.value = .031; volG.gain.value = .14; volLfo.connect(volG); volG.connect(padG.gain); volLfo.start(t); nodes.push(volLfo);
    /* Жел */
    const w = noiseSrc(a), wf = a.createBiquadFilter(), wg = a.createGain();
    wf.type = 'bandpass'; wf.Q.value = .6; wf.frequency.value = 500; wg.gain.value = .035;
    const wl = a.createOscillator(), wlg = a.createGain(); wl.frequency.value = .07; wlg.gain.value = 260;
    wl.connect(wlg); wlg.connect(wf.frequency);
    const wv = a.createOscillator(), wvg = a.createGain(); wv.frequency.value = .043; wvg.gain.value = .022;
    wv.connect(wvg); wvg.connect(wg.gain);
    w.connect(wf); wf.connect(wg); wg.connect(bgBus); w.start(t); wl.start(t); wv.start(t);
    nodes.push(w, wl, wv);
    let timer = null, last = 3;
    const melody = () => {
      if (!amb) return;
      const step = [-2, -1, 1, 2, 0][Math.floor(Math.random() * 5)];
      last = Math.max(0, Math.min(SCALE.length - 1, last + step));
      bell(SCALE[last], 0, .05, 3.2, bgBus);
      if (Math.random() < .35) bell(SCALE[Math.max(0, last - 2)] - 12, .02, .035, 3.6, bgBus);
      if (Math.random() < .3){ const k = Math.min(SCALE.length - 1, last + 1); bell(SCALE[k], .45, .035, 2.8, bgBus); }
      timer = setTimeout(melody, 2600 + Math.random() * 3400);
    };
    amb = { nodes, stopTimer:() => clearTimeout(timer) };
    timer = setTimeout(melody, 1800);
    bgBus.gain.cancelScheduledValues(t);
    bgBus.gain.setValueAtTime(bgBus.gain.value, t);
    bgBus.gain.linearRampToValueAtTime(.55, t + 3);
  }
  function stopAmbient(){
    if (!amb || !ac) return;
    const t = ac.currentTime, cur = amb;
    amb = null; cur.stopTimer();
    bgBus.gain.cancelScheduledValues(t);
    bgBus.gain.setValueAtTime(bgBus.gain.value, t);
    bgBus.gain.linearRampToValueAtTime(0, t + 1.2);
    setTimeout(() => cur.nodes.forEach(n => { try { n.stop(); } catch (e) {} }), 1400);
  }
  document.addEventListener('visibilitychange', () => {
    if (!ac) return;
    try { document.hidden ? ac.suspend() : ac.resume(); } catch (e) {}
  });

  return {
    get muted(){ return fxMuted; },
    get music(){ return musicOn; },
    setMuted(v){
      fxMuted = !!v;
      if (fxBus && ac) fxBus.gain.setTargetAtTime(fxMuted ? 0 : .7, ac.currentTime, .05);
    },
    setMusic(v){
      musicOn = !!v;
      if (!ac) return;
      musicOn ? startAmbient() : stopAmbient();
    },
    unlock(){ if (ctx() && musicOn) startAmbient(); },
    step(){
      const now = performance.now(); if (now - lastStep < 90) return; lastStep = now;
      stepAlt ^= 1;
      glide(stepAlt ? 200 : 180, 120, .09, .05, 0, .008);
      breath(.1, .025, 700, 400, 0, .01);
    },
    collect(){ bell(81, 0, .12, 1.4); bell(88, .09, .1, 1.8); },
    say(){ bell(69, 0, .08, .9); bell(74, .11, .07, 1.1); },
    gate(){ breath(.9, .05, 280, 900, 0, .3); bell(62, .2, .08, 2.2); bell(66, .32, .07, 2.2); bell(69, .44, .07, 2.4); },
    plant(){ glide(330, 660, .45, .06, 0, .06); bell(79, .25, .08, 1.6); },
    bump(when = 0){ glide(150, 80, .28, .14, when, .01); },
    error(){ bell(64, 0, .09, 1.1); bell(60, .18, .09, 1.4); },
    tick(yes){ bell(yes ? 86 : 79, 0, .035, .35); },
    blip(){ bell(91, 0, .025, .3); },
    run(){ bell(69, 0, .07, 1); bell(76, .08, .05, 1.2); },
    click(){ bell(84, 0, .03, .3); },
    fail(){ bell(69, 0, .08, 1.4); bell(67, .2, .08, 1.4); bell(62, .4, .09, 2); },
    win(){
      [62, 64, 67, 69, 74, 76, 79].forEach((n, i) => bell(n, i * .13, .1, 1.8));
      [50, 57, 62, 66, 69].forEach((n, i) => bell(n, .95 + i * .03, .07, 3.2));
    },
    right(){ bell(76, 0, .1, 1.2); bell(81, .12, .1, 1.6); },
    wrong(){ bell(67, 0, .08, 1.2); bell(64, .15, .08, 1.4); },
    star(){ [88, 91, 95].forEach((n, i) => bell(n, i * .08, .04, 1.2)); }
  };
})();

