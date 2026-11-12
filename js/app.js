/* ====================== Интерфейс ====================== */
(() => {
const $ = s => document.querySelector(s);
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const STORE = 'kod-dalasy-users-v1', OLD_STORE = 'kod-dalasy-alg-v1';
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* Барлық деректер бір объектіде: оқушылар, қонақ барысы, баптаулар */
let DB = null;
try { DB = JSON.parse(localStorage.getItem(STORE) || 'null'); } catch (e) { DB = null; }
if (!DB || typeof DB !== 'object') DB = { v:1 };
DB.users = DB.users || {}; DB.guest = DB.guest || {}; DB.settings = DB.settings || {};
if (!DB.migrated){
  /* Тіркелуге дейінгі барыс қонақ барысына көшеді */
  try {
    const old = JSON.parse(localStorage.getItem(OLD_STORE) || 'null');
    if (old && typeof old === 'object'){ const s = old._s || {}; delete old._s; Object.assign(DB.guest, old); Object.assign(DB.settings, s); }
  } catch (e) {}
  DB.migrated = true;
}
let progress = {};
const currentUser = () => (DB.current && DB.current !== 'guest' ? DB.users[DB.current] || null : null);
function bindProgress(){ const u = currentUser(); progress = u ? (u.progress = u.progress || {}) : DB.guest; }
bindProgress();
function saveProgress(){
  const u = currentUser(); if (u) u.last = Date.now();
  try { localStorage.setItem(STORE, JSON.stringify(DB)); } catch (e) {}
}
const P = id => (progress[id] = progress[id] || {});
const settings = () => DB.settings;
LANG = LANGS[DB.settings.lang] ? DB.settings.lang : 'kk';
document.documentElement.lang = LANG;
SFX.setMuted(!!settings().mute);
const SND_ON = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 6h2.5L8 3v10L4.5 10H2z" fill="currentColor"/><path d="M10.5 5.5a3.5 3.5 0 0 1 0 5M12.5 3.5a6.3 6.3 0 0 1 0 9" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';
const SND_OFF = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 6h2.5L8 3v10L4.5 10H2z" fill="currentColor"/><path d="M10.5 6l4 4M14.5 6l-4 4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';
function renderSound(){
  const b = document.querySelector('#soundBtn');
  b.innerHTML = (SFX.muted ? SND_OFF : SND_ON) + `<span class="bl">${SFX.muted ? t('snd.off') : t('snd.on')}</span>`;
  b.setAttribute('aria-label', SFX.muted ? t('snd.aOff') : t('snd.aOn'));
  b.setAttribute('aria-pressed', String(!SFX.muted));
}
document.querySelector('#soundBtn').onclick = () => {
  settings().mute = !SFX.muted; saveProgress(); SFX.setMuted(settings().mute); renderSound();
  if (!SFX.muted){ SFX.unlock(); SFX.click(); }
};
renderSound();
SFX.setMusic(!settings().musicOff);
const MUS_ICON = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6 12.5V3.2l7-1.4v9.2" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><circle cx="4.3" cy="12.6" r="1.9" fill="currentColor"/><circle cx="11.3" cy="11.1" r="1.9" fill="currentColor"/></svg>';
function renderMusic(){
  const b = document.querySelector('#musicBtn');
  b.innerHTML = MUS_ICON + `<span class="bl">${SFX.music ? t('mus.on') : t('mus.off')}</span>`;
  b.setAttribute('aria-pressed', String(SFX.music));
  b.setAttribute('aria-label', SFX.music ? t('mus.aOn') : t('mus.aOff'));
}
document.querySelector('#musicBtn').onclick = () => {
  settings().musicOff = SFX.music; saveProgress();
  SFX.setMusic(!settings().musicOff); SFX.unlock(); renderMusic();
};
renderMusic();
/* Браузер дыбысты тек алғашқы әрекеттен кейін рұқсат етеді */
function firstGesture(){
  SFX.unlock();
  document.removeEventListener('pointerdown', firstGesture); document.removeEventListener('keydown', firstGesture);
}
document.addEventListener('pointerdown', firstGesture); document.addEventListener('keydown', firstGesture);

let screen = 'map', curIdx = 0, L = null, vi = 0, info = null, view = null;
let running = false, runToken = 0, speed = 1, lastResult = null, lastCaret = null;
let lastRun = null;
let activeLine = null, errLine = null, hintShown = false, vStatus = [], logCount = 0, logErr = false;

const mapScreen = $('#mapScreen'), levelScreen = $('#levelScreen');
const ta = $('#code'), hl = $('#hl'), hlPre = $('#hlPre'), gutter = $('#gutter');
const bandActive = $('#bandActive'), bandErr = $('#bandErr');
const cv = $('#world'), ctx = cv.getContext('2d');
const fcWrap = $('#fcWrap');

function star8(on){
  const p = [];
  for (let k = 0; k < 16; k++){
    const a = Math.PI / 8 * k - Math.PI / 2, r = k % 2 ? 5.4 : 11;
    p.push((12 + r * Math.cos(a)).toFixed(1) + ',' + (12 + r * Math.sin(a)).toFixed(1));
  }
  return `<svg class="st${on ? ' on' : ''}" viewBox="0 0 24 24" aria-hidden="true"><polygon points="${p.join(' ')}"/></svg>`;
}
const starsOf = id => { const p = progress[id] || {}; return (p.passed ? 1 : 0) + (p.eff ? 1 : 0) + (p.quiz ? 1 : 0); };
const starRow = n => [0,1,2].map(i => star8(i < n)).join('');
const passed = i => !!(progress[LEVELS[i].id] || {}).passed;
const unlocked = i => i === 0 || !!settings().all || passed(i - 1);
const nextIdx = () => { const i = LEVELS.findIndex((_, k) => !passed(k)); return i < 0 ? LEVELS.length - 1 : i; };
const chapterOf = i => CHAPTERS.find(c => i >= c.levels[0] && i <= c.levels[1]);

function updateTotal(){
  const total = LEVELS.reduce((s, l) => s + starsOf(l.id), 0);
  $('#total').innerHTML = `${star8(true)}<b>${total}</b> / ${LEVELS.length * 3}`;
  return total;
}

/* ---------- Карта ---------- */
const NODE_POS = [[6,82],[13,64],[20,80],[27,62],[34,78],[41,60],[50,78],[57,59],[64,75],[70,55],[78,72],[84,52],[90,68],[95,47]];
function smoothPath(pts){
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++){
    const p0 = pts[i-1] || pts[i], p1 = pts[i], p2 = pts[i+1], p3 = pts[i+2] || p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0]} ${p2[1]}`;
  }
  return d;
}
function buildMapArt(){
  let seed = 7; const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  let stars = '';
  for (let i = 0; i < 70; i++) stars += `<circle cx="${(rnd()*1000).toFixed(0)}" cy="${(rnd()*190).toFixed(0)}" r="${(rnd()*1.4+.4).toFixed(1)}" fill="#f6ecd2" opacity="${(rnd()*.6+.3).toFixed(2)}"/>`;
  let tufts = '';
  for (let i = 0; i < 90; i++){
    const x = rnd()*1000, y = 260 + rnd()*235;
    tufts += `<path d="M${x.toFixed(0)} ${y.toFixed(0)}l-3 -9M${x.toFixed(0)} ${y.toFixed(0)}l1 -11M${x.toFixed(0)} ${y.toFixed(0)}l5 -8" stroke="#7a8a48" stroke-width="1.6" opacity=".55" stroke-linecap="round"/>`;
  }
  const pts = NODE_POS.map(([x, y]) => [x * 10, y * 5]);
  const d = smoothPath(pts);
  const seg = c => { const a = NODE_POS[c.levels[0]][0], b = NODE_POS[c.levels[1]][0]; return (a + b) * 5; };
  const labels = CHAPTERS.map(c => `<text x="${seg(c)}" y="40" text-anchor="middle" fill="#f0d08a" font-family="Golos Text, system-ui, sans-serif" font-size="15" font-weight="700" letter-spacing="2.5">${c.n} · ${esc(chT(c, 'short').toLocaleUpperCase())}</text>`).join('');
  const borders = [45.5, 74].map(x => `<line x1="${x*10}" y1="56" x2="${x*10}" y2="470" stroke="#f0d08a" stroke-width="1.2" stroke-dasharray="3 7" opacity=".35"/>`).join('');
  $('#mapArt').innerHTML = `
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#17204a"/><stop offset=".55" stop-color="#3c3b74"/><stop offset="1" stop-color="#c7775a"/></linearGradient>
    <linearGradient id="land" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5f6d3c"/><stop offset="1" stop-color="#2e3923"/></linearGradient>
  </defs>
  <rect width="1000" height="500" fill="url(#sky)"/>
  ${stars}
  <circle cx="838" cy="98" r="22" fill="#f6e3b0" opacity=".92"/><circle cx="828" cy="92" r="22" fill="#3a3f7a" opacity=".35"/>
  <path d="M0 238L70 182L130 210L215 128L285 196L350 160L425 214L515 136L595 205L675 150L755 210L848 126L925 196L1000 168V270H0Z" fill="#2b2f62"/>
  <path d="M215 128L196 146L208 143L218 152L229 142L236 146ZM515 136L497 152L509 149L518 158L528 148L535 152ZM848 126L829 143L842 140L851 149L861 139L868 143Z" fill="#dfe4f4" opacity=".85"/>
  <path d="M0 252Q150 222 300 248T600 244T1000 236V500H0Z" fill="url(#land)"/>
  <path d="M590 500C566 432 655 392 628 330C610 290 668 268 720 252" stroke="#5aa6c9" stroke-width="16" fill="none" opacity=".45" stroke-linecap="round"/>
  ${tufts}
  ${borders}
  ${labels}
  <path d="${d}" stroke="#1c160a" stroke-width="16" fill="none" opacity=".35" stroke-linecap="round"/>
  <path d="${d}" stroke="#f0d08a" stroke-width="4" fill="none" stroke-dasharray="2 13" stroke-linecap="round"/>`;
}
function renderMap(){
  const ni = nextIdx();
  $('#mapNodes').innerHTML = LEVELS.map((l, i) => {
    const lock = !unlocked(i), done = passed(i);
    const cls = lock ? 'locked' : done ? 'done' : '';
    const nx = (!lock && !done && i === ni) ? ' next' : '';
    return `<button type="button" class="node ${cls}${nx}" data-i="${i}" style="left:${NODE_POS[i][0]}%;top:${NODE_POS[i][1]}%"
      ${lock ? 'aria-disabled="true"' : ''} aria-label="${t('map.level', {n:i + 1})}: ${esc(lv(l, 'title'))}${lock ? ', ' + t('map.locked') : ''}">
      <span class="tip">${i + 1}. ${esc(lv(l, 'title'))}${lock ? ' · ' + t('map.locked') : ''}</span>
      <span class="num">${lock ? '<svg width="15" height="15" viewBox="0 0 16 16" aria-hidden="true"><rect x="3" y="7" width="10" height="7" rx="1.5" fill="currentColor"/><path d="M5 7V5a3 3 0 0 1 6 0v2" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>' : i + 1}</span>
      ${done ? `<span class="nstars">${starRow(starsOf(l.id))}</span>` : ''}
    </button>`;
  }).join('');
  $('#levelList').innerHTML = LEVELS.map((l, i) => {
    const lock = !unlocked(i), done = passed(i), c = chapterOf(i);
    const head = c.levels[0] === i ? `<li class="ch-h">${t('map.chapter', {n:c.n})} · ${esc(chT(c, 'title'))}</li>` : '';
    return head + `<li><button type="button" class="lvl-item ${lock ? 'locked' : done ? 'done' : ''}" data-i="${i}" ${lock ? 'aria-disabled="true"' : ''}>
      <span class="num">${i + 1}</span><span><b>${esc(lv(l, 'title'))}</b><small>${esc(lv(l, 'concept'))}${l.code ? ' · ' + l.code : ''}${lock ? ' · ' + t('map.locked') : ''}</small></span>
      <span class="nstars">${starRow(starsOf(l.id))}</span></button></li>`;
  }).join('');
  const total = updateTotal();
  const doneCount = LEVELS.filter((_, i) => passed(i)).length;
  const all = doneCount === LEVELS.length;
  $('#side').innerHTML = `
    <div>
      <h3>${t('side.progress')}</h3>
      <div class="meter"><span><b>${total}</b> / ${LEVELS.length * 3} ${t('side.stars')}</span><span>${doneCount}/${LEVELS.length} ${t('side.levels')}</span></div>
      <div class="bar"><i style="width:${(total / (LEVELS.length * 3) * 100).toFixed(1)}%"></i></div>
    </div>
    ${all ? `<p class="done-note">${t('side.allDone')}</p>` : ''}
    <button type="button" class="btn primary" id="continueBtn">${all ? t('side.replay') : t(doneCount ? 'side.continue' : 'side.start', {n:ni + 1})}</button>
    <div>
      <h3>${t('side.chapters')}</h3>
      <ul class="chapters">${CHAPTERS.map(c => {
        const ids = LEVELS.slice(c.levels[0], c.levels[1] + 1);
        const d = ids.filter((_, k) => passed(c.levels[0] + k)).length;
        return `<li class="${d === ids.length ? 'done' : ''}"><span class="cn">${c.n}</span><div><b>${esc(chT(c, 'title'))}</b>
          <small>${t('side.chInfo', {a:c.levels[0] + 1, b:c.levels[1] + 1, d, t:ids.length})}</small>
          <small class="codes">${esc(chT(c, 'codes'))}</small></div></li>`;
      }).join('')}</ul>
    </div>
    <div class="side-actions"><button type="button" class="btn small ghost danger" id="wipeBtn">${t('side.wipe')}</button></div>`;
  $('#continueBtn').onclick = () => openLevel(ni);
  const wipe = $('#wipeBtn'); let armed = false, tmr;
  wipe.onclick = () => {
    if (!armed){ armed = true; wipe.textContent = t('side.wipeSure'); tmr = setTimeout(() => { armed = false; wipe.textContent = t('side.wipe'); }, 3500); return; }
    clearTimeout(tmr); Object.keys(progress).forEach(k => delete progress[k]); saveProgress(); renderMap();
  };
}
function onNodeClick(e){
  const b = e.target.closest('[data-i]'); if (!b) return;
  const i = +b.dataset.i; if (unlocked(i)){ SFX.click(); openLevel(i); }
}
$('#mapNodes').addEventListener('click', onNodeClick);
$('#levelList').addEventListener('click', onNodeClick);

function showMap(){
  if (!DB.current){ showAuth(); return; }
  stopRun(); screen = 'map';
  levelScreen.hidden = true; mapScreen.hidden = false; $('#authScreen').hidden = true; renderUserChip();
  renderMap(); window.scrollTo(0, 0);
}
$('#homeBtn').onclick = showMap;
$('#backBtn').onclick = showMap;

/* ---------- Деңгей ---------- */
const SNIPS = {
  move_right:'hero.move_right()', move_left:'hero.move_left()', move_up:'hero.move_up()', move_down:'hero.move_down()',
  say:'hero.say("")', plant:'hero.plant()', var:'kilt = ""', for:'for i in range(3):',
  if_can:'if hero.can_move("right"):', if_hole:'if hero.on_hole():', if_n:'if n > 10:',
  elif:'elif n <= 20:', else:'else:', read:'n = hero.read()', while:'while not hero.at_yurt():'
};
function openLevel(i){
  if (!unlocked(i)) return;
  stopRun();
  curIdx = i; L = LEVELS[i]; screen = 'level';
  mapScreen.hidden = true; levelScreen.hidden = false; $('#authScreen').hidden = true;
  $('#lvlCount').textContent = `${i + 1} / ${LEVELS.length}`;
  renderLevelTexts();
  renderLevelStars();
  const saved = (progress[L.id] || {}).code;
  ta.value = typeof saved === 'string' ? saved : localCode(L.starter);
  lastCaret = null; errLine = null; activeLine = null; lastResult = null; lastRun = null; hintShown = false;
  vStatus = L.variants.map(() => null);
  showVars(null);
  selectVariant(0, true);
  refreshEditor(); renderGoals(); setRunUI(false); updateFlow(true);
  clearConsole(); log('info', t('log.start'));
  mentorSay(lv(L, 'intro'));
  aiReset();
  selectTab('flow');
  sizeCanvas(); window.scrollTo(0, 0);
}
function renderLevelTexts(){
  $('#lvlTitle').textContent = lv(L, 'title');
  $('#lvlChip').textContent = lv(L, 'concept');
  const code = $('#lvlCode');
  if (L.code){ code.hidden = false; code.textContent = t('lvl.objective', {c:L.code}); code.title = objT(L.code) || ''; } else code.hidden = true;
  $('#palette').innerHTML = `<span class="lbl">${t('ed.palette')}</span>` + L.palette.map(k => `<button type="button" class="snip" data-s="${k}">${esc(localCode(SNIPS[k]))}</button>`).join('');
  const rb = $('#ruleBox'), rule = lv(L, 'ruleText');
  if (rule){ rb.hidden = false; rb.innerHTML = `<b>${t('lvl.rule')}</b> ${esc(rule)}`; } else rb.hidden = true;
}
function renderLevelStars(){ $('#lvlStars').innerHTML = starRow(starsOf(L.id)); }
function mentorSay(msg, err){ $('#mentorText').textContent = msg; $('#mentor').classList.toggle('err', !!err); }
$('#hintBtn').onclick = () => { hintShown = !hintShown; mentorSay(hintShown ? lv(L, 'hint') : lv(L, 'intro')); };

function renderVariants(){
  const box = $('#variants');
  if (L.variants.length < 2){ box.hidden = true; return; }
  box.hidden = false;
  box.innerHTML = `<span class="lbl">${t('lvl.maps')}</span>` + L.variants.map((V, k) =>
    `<button type="button" class="vtab ${vStatus[k] === true ? 'ok' : vStatus[k] === false ? 'bad' : ''}" data-v="${k}" aria-pressed="${k === vi}">
      <span class="vs" aria-hidden="true"></span>${k + 1}${V.sign !== undefined ? ` <span style="color:var(--muted);font-weight:500">· ${esc(V.sign)}</span>` : ''}</button>`).join('');
}
$('#variants').addEventListener('click', e => {
  const b = e.target.closest('[data-v]'); if (!b || running) return;
  selectVariant(+b.dataset.v);
});
function selectVariant(k, silent){
  vi = k; info = levelInfo(L.variants[vi].map);
  resetView(); renderVariants();
  if (!silent) setActiveLine(null);
}

function renderGoals(){
  const res = lastResult || evaluate(L, null, ta.value, null);
  const tick = '<svg viewBox="0 0 16 16"><path d="M3.5 8.5l3 3 6-7"/></svg>';
  $('#goalList').innerHTML = res.goals.map(g => {
    const on = g.done && (lastResult || !g.req);
    return `<li class="${on ? 'done' : ''} ${g.req ? '' : 'opt'}"><span class="box">${on ? tick : ''}</span><span>${esc(g.text)}</span>${g.req ? '' : `<span class="tag">${t('goal.bonus')}</span>`}</li>`;
  }).join('');
}

/* ---------- Блок-схема ---------- */
let flowTimer = null, flowProg = null;
function updateFlow(now){
  clearTimeout(flowTimer);
  const go = () => {
    const note = $('#fcNote');
    try {
      const prog = parseProgram(ta.value);
      flowProg = prog;
      fcWrap.innerHTML = flowSvg(prog);
      fcWrap.classList.remove('stale'); note.hidden = true;
      $('#algoType').textContent = t('ed.algo', {t:algoType(prog)});
    } catch (e){
      if (!(e instanceof CodeError)) throw e;
      fcWrap.classList.add('stale'); note.hidden = false;
      note.textContent = t('fc.stale', {n:e.line});
      $('#algoType').textContent = t('ed.algo', {t:'—'});
    }
  };
  now ? go() : (flowTimer = setTimeout(go, 220));
}
let fcOn = null, fcLbl = null;
function fcHighlight(id, result, err){
  if (fcOn) fcOn.classList.remove('on', 'err');
  if (fcLbl) fcLbl.classList.remove('on');
  fcOn = fcLbl = null;
  if (!id) return;
  const g = fcWrap.querySelector(`[data-id="${id}"]`);
  if (!g) return;
  g.classList.add(err ? 'err' : 'on'); fcOn = g;
  if (result !== undefined){
    const t = fcWrap.querySelector(`[data-br="${id}:${result ? 1 : 0}"]`);
    if (t){ t.classList.add('on'); fcLbl = t; }
  }
  const box = g.getBBox ? g.getBBox() : null, svg = fcWrap.querySelector('svg');
  if (box && svg){
    const scale = svg.getBoundingClientRect().width / svg.viewBox.baseVal.width || 1;
    const top = box.y * scale, bottom = (box.y + box.height) * scale;
    if (top < fcWrap.scrollTop + 10 || bottom > fcWrap.scrollTop + fcWrap.clientHeight - 10)
      fcWrap.scrollTop = Math.max(0, top - fcWrap.clientHeight / 2 + box.height * scale / 2);
  }
}

/* ---------- Айнымалылар ---------- */
let varsMap = new Map();
function showVars(map, flash){
  const box = $('#vars');
  if (!map || !map.size){ box.hidden = true; box.innerHTML = ''; return; }
  box.hidden = false;
  box.innerHTML = `<span>${t('ed.vars')}</span>` + [...map].map(([k, v]) => `<code class="${k === flash ? 'flash' : ''}">${esc(k)} = ${esc(v)}</code>`).join('');
}

/* ---------- Редактор ---------- */
const KWS = new Set(['if','elif','else','while','for','in','not','and','or','True','False','None','pass','break']);
const FNS = new Set(['range','print','str','int','len','abs']);
function hlLine(line){
  let out = '', i = 0;
  while (i < line.length){
    const ch = line[i];
    if (ch === '#'){ out += `<span class="t-com">${esc(line.slice(i))}</span>`; break; }
    if (ch === '"' || ch === "'"){ let j = i + 1; while (j < line.length && line[j] !== ch) j++; out += `<span class="t-str">${esc(line.slice(i, j + 1))}</span>`; i = j + 1; continue; }
    if (/\d/.test(ch)){ let j = i; while (j < line.length && /[\d.]/.test(line[j])) j++; out += `<span class="t-num">${line.slice(i, j)}</span>`; i = j; continue; }
    if (ID_START.test(ch)){
      let j = i; while (j < line.length && ID_PART.test(line[j])) j++;
      const w = line.slice(i, j);
      const cls = KWS.has(w) ? 't-kw' : FNS.has(w) ? 't-fn' : w === 'hero' ? 't-hero' : line[i-1] === '.' ? 't-meth' : '';
      out += cls ? `<span class="${cls}">${esc(w)}</span>` : esc(w); i = j; continue;
    }
    out += esc(ch); i++;
  }
  return out;
}
const lh = () => parseFloat(getComputedStyle(ta).lineHeight) || 22;
function refreshEditor(){
  const lines = ta.value.split('\n');
  hl.innerHTML = lines.map(hlLine).join('\n') + '\n ';
  gutter.innerHTML = lines.map((_, i) => `<span class="${i + 1 === errLine ? 'err' : i + 1 === activeLine ? 'active' : ''}">${i + 1}</span>`).join('');
  syncScroll();
}
function syncScroll(){
  hlPre.scrollTop = ta.scrollTop; hlPre.scrollLeft = ta.scrollLeft;
  gutter.style.transform = `translateY(${-ta.scrollTop}px)`;
  placeBand(bandActive, activeLine); placeBand(bandErr, errLine);
}
function placeBand(el, n){
  if (!n){ el.hidden = true; return; }
  el.hidden = false; el.style.transform = `translateY(${12 + (n - 1) * lh() - ta.scrollTop}px)`;
}
function setActiveLine(n){
  activeLine = n;
  gutter.querySelectorAll('span').forEach((s, i) => s.classList.toggle('active', i + 1 === n && i + 1 !== errLine));
  placeBand(bandActive, n);
  if (n){
    const top = 12 + (n - 1) * lh();
    if (top < ta.scrollTop || top + lh() > ta.scrollTop + ta.clientHeight){ ta.scrollTop = top - ta.clientHeight / 2; syncScroll(); }
  }
}
function setErrLine(n){ errLine = n; refreshEditor(); }
function onCodeInput(){
  P(L.id).code = ta.value; saveProgress();
  errLine = null; lastResult = null; lastRun = null; vStatus = L.variants.map(() => null);
  if (lastRunInfo) lastRunInfo.stale = true;
  if (!running){ resetView(); renderVariants(); showVars(null); fcHighlight(null); }
  refreshEditor(); renderGoals(); updateFlow();
}
ta.addEventListener('input', onCodeInput);
ta.addEventListener('scroll', syncScroll);
['keyup','click','select'].forEach(ev => ta.addEventListener(ev, () => { lastCaret = ta.selectionStart; }));
let escArmed = false;
function insertText(text){ ta.setRangeText(text, ta.selectionStart, ta.selectionEnd, 'end'); onCodeInput(); lastCaret = ta.selectionStart; }
ta.addEventListener('keydown', e => {
  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)){ e.preventDefault(); run(); return; }
  if (e.key === 'Escape'){ escArmed = true; return; }
  if (e.key === 'Tab' && !escArmed){
    e.preventDefault();
    if (e.shiftKey){
      const v = ta.value, s = ta.selectionStart, ls = v.lastIndexOf('\n', s - 1) + 1;
      const m = v.slice(ls).match(/^ {1,4}/);
      if (m){ ta.setRangeText('', ls, ls + m[0].length, 'start'); ta.selectionStart = ta.selectionEnd = Math.max(ls, s - m[0].length); onCodeInput(); }
    } else insertText('    ');
    return;
  }
  escArmed = false;
  if (e.key === 'Enter' && !e.shiftKey){
    e.preventDefault();
    const v = ta.value, s = ta.selectionStart, ls = v.lastIndexOf('\n', s - 1) + 1;
    const cur = v.slice(ls, s);
    let ind = cur.match(/^ */)[0];
    if (stripComment(cur).trim().endsWith(':')) ind += '    ';
    insertText('\n' + ind);
  }
});
$('#palette').addEventListener('click', e => {
  const b = e.target.closest('[data-s]'); if (!b || running) return;
  const key = b.dataset.s, snip = SNIPS[key];
  const v = ta.value;
  const s = lastCaret == null ? v.length : Math.min(lastCaret, v.length);
  const ls = v.lastIndexOf('\n', s - 1) + 1;
  let le = v.indexOf('\n', s); if (le < 0) le = v.length;
  const line = v.slice(ls, le);
  let ind = line.match(/^ */)[0];
  if (line.trim() && stripComment(line).trim().endsWith(':')) ind += '    ';
  if (key === 'else' || key === 'elif') ind = ind.length >= 4 ? ind.slice(4) : '';
  const block = snip.endsWith(':');
  const text = snip + (block ? '\n' + ind + '    ' : '');
  if (line.trim() === '') ta.setRangeText((key === 'else' || key === 'elif' ? ind : line.match(/^ */)[0]) + text, ls, le, 'end');
  else ta.setRangeText('\n' + ind + text, le, le, 'end');
  if (!block && /""\)?$/.test(snip)) ta.selectionStart = ta.selectionEnd = ta.selectionEnd - (snip.endsWith(')') ? 2 : 1);
  ta.focus(); onCodeInput(); lastCaret = ta.selectionStart;
});
let resetArmed = false, resetTmr;
$('#resetBtn').onclick = () => {
  const b = $('#resetBtn');
  if (!resetArmed){ resetArmed = true; b.textContent = t('ed.resetSure'); resetTmr = setTimeout(() => { resetArmed = false; b.textContent = t('ed.reset'); }, 3500); return; }
  clearTimeout(resetTmr); resetArmed = false; b.textContent = t('ed.reset');
  stopRun(); ta.value = localCode(L.starter); onCodeInput(); clearConsole(); log('info', t('log.reset'));
};
$('#speedBtn').onclick = () => { speed = speed === 1 ? 2 : speed === 2 ? 4 : 1; $('#speedBtn').textContent = t('ed.speed', {s:speed}); };

/* ---------- Қойындылар мен хабарлар ---------- */
function selectTab(which){
  const tabs = { flow:['#tabFlow', '#panelFlow'], log:['#tabLog', '#panelLog'], ai:['#tabAi', '#panelAi'] };
  for (const [k, [tb, pn]] of Object.entries(tabs)){ $(tb).setAttribute('aria-selected', k === which); $(pn).hidden = k !== which; }
  if (which === 'log'){ logErr = false; updateBadge(); }
  if (which === 'ai') aiScroll();
}
$('#tabFlow').onclick = () => selectTab('flow');
$('#tabLog').onclick = () => selectTab('log');
$('#tabAi').onclick = () => selectTab('ai');
const consoleBox = $('#consoleBox');
function updateBadge(){ const b = $('#logBadge'); b.textContent = logCount; b.classList.toggle('err', logErr); }
function clearConsole(){ consoleBox.innerHTML = ''; logCount = 0; logErr = false; updateBadge(); }
function log(kind, msg, line){
  const p = document.createElement('p');
  p.className = 'log ' + kind;
  p.innerHTML = (line ? `<span class="ln">${t('log.line', {n:line})}</span>` : '') + esc(msg);
  consoleBox.append(p); consoleBox.scrollTop = consoleBox.scrollHeight;
  if (kind !== 'info'){ logCount++; if (kind === 'err' && $('#panelLog').hidden) logErr = true; updateBadge(); }
}

/* ---------- Іске қосу ---------- */
const PLAY_ICON = () => '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2.5l9 5.5-9 5.5z" fill="currentColor"/></svg>' + t('ed.run');
const STOP_ICON = () => '<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="3.5" y="3.5" width="9" height="9" rx="1.5" fill="currentColor"/></svg>' + t('ed.stop');
function setRunUI(on){ const b = $('#runBtn'); b.innerHTML = on ? STOP_ICON() : PLAY_ICON(); b.classList.toggle('stop', on); }
$('#runBtn').onclick = () => running ? (stopRun(), resetView(), log('info', t('log.stopped'))) : run();
function stopRun(){ runToken++; running = false; setRunUI(false); setActiveLine(null); fcHighlight(null); }
const sleep = (ms, tok) => new Promise(r => setTimeout(() => r(tok === runToken), ms));

async function run(){
  if (running || !L) return;
  P(L.id).code = ta.value; saveProgress();
  SFX.unlock();
  errLine = null; lastResult = null; refreshEditor(); clearConsole(); updateFlow(true);
  let prog;
  try { prog = parseProgram(ta.value); }
  catch (e){
    if (!(e instanceof CodeError)) throw e;
    setErrLine(e.line); log('err', e.msg, e.line); SFX.error();
    lastRunInfo = { parseError:`line ${e.line}: ${e.msg}` }; showAiAsk(true);
    mentorSay(t('m.errLine', {n:e.line, m:e.msg}), true);
    resetView(); renderGoals(); return;
  }
  const sims = L.variants.map((_, k) => simulate(prog, L, k));
  vStatus = sims.map(s => variantOk(L, s));
  resetView(); running = true; const tok = ++runToken; setRunUI(true); SFX.run();
  selectTab('flow');
  const multi = L.variants.length > 1;
  log('info', multi ? t('log.goMap', {n:vi + 1}) : t('log.go'));
  if (!await play(sims[vi].actions, tok)) return;
  let shown = vi;
  if (!sims[vi].error && vStatus[vi]){
    const bad = vStatus.findIndex(v => !v);
    if (bad >= 0){
      log('note', t('log.otherMap', {a:vi + 1, b:bad + 1, r:variantReason(L, sims[bad])}));
      mentorSay(t('m.otherMap', {n:bad + 1}));
      SFX.tick(false);
      if (!await sleep(900 / speed, tok)) return;
      selectVariant(bad, true); renderVariants(); shown = bad;
      log('info', t('log.goMap', {n:bad + 1}));
      if (!await play(sims[bad].actions, tok)) return;
    }
  }
  running = false; setRunUI(false); setActiveLine(null);
  const res = evaluate(L, sims, ta.value, prog);
  lastRun = { sims, prog };
  lastResult = res; renderGoals(); renderVariants();
  const sim = sims[shown];
  lastRunInfo = {
    maps:sims.map((s, k) => ({ n:k + 1, ok:variantOk(L, s), error:s.error ? `line ${s.error.line}: ${s.error.msg}` : '', why:variantOk(L, s) ? '' : variantReason(L, s) })),
    missing:res.goals.filter(g => g.req && !g.done).map(g => g.text),
    ok:res.ok
  };
  showAiAsk(!res.ok);
  if (sim.error){
    setErrLine(sim.error.line);
    mentorSay(t('m.errLine', {n:sim.error.line, m:sim.error.msg}), true);
    return;
  }
  fcHighlight(null);
  if (res.ok){
    log('ok', multi ? t('log.winMaps', {n:L.variants.length}) : t('log.win'));
    mentorSay(t('m.win'));
    onWin(res);
  } else {
    const msg = vStatus[shown] ? res.firstFail.fail : variantReason(L, sim);
    log('err', msg.charAt(0).toUpperCase() + msg.slice(1)); SFX.fail();
    mentorSay(t('m.fixGoals', {m:msg.charAt(0).toUpperCase() + msg.slice(1)}), true);
  }
}

const D = () => { const k = (REDUCED ? .45 : 1) / speed; return { move:270*k, say:950*k, gate:600*k, plant:500*k, bump:460*k, eval:420*k, set:300*k, iter:260*k }; };
function tween(ms, fn, tok){
  return new Promise(res => {
    const t0 = performance.now();
    const tick = now => {
      if (tok !== runToken) return res(false);
      const p = Math.min(1, (now - t0) / ms);
      fn(p);
      p < 1 ? requestAnimationFrame(tick) : res(true);
    };
    requestAnimationFrame(tick);
  });
}
const ease = p => p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
async function play(actsIn, tok){
  let acts = actsIn;
  if (acts.length > 260){
    const tail = acts[acts.length - 1];
    acts = acts.slice(0, 200).concat(tail.type === 'error' || tail.type === 'bump' ? [tail] : []);
  }
  varsMap = new Map(); showVars(null);
  for (const a of acts){
    if (tok !== runToken) return false;
    if (a.line) setActiveLine(a.line);
    if (a.id && a.type !== 'collect') fcHighlight(a.id, a.type === 'eval' || a.type === 'iter' ? a.result : undefined);
    const d = D();
    if (a.type === 'move'){
      SFX.step();
      if (a.x !== a.fx) view.dir = a.x > a.fx ? 1 : -1;
      if (!await tween(d.move, p => { const e = ease(p); view.x = a.fx + (a.x - a.fx) * e; view.y = a.fy + (a.y - a.fy) * e; view.bob = Math.sin(p * Math.PI); }, tok)) return false;
      view.x = a.x; view.y = a.y; view.bob = 0;
    } else if (a.type === 'collect'){
      SFX.collect(); view.gems.delete(a.x + ',' + a.y); burst(a.x, a.y, ['#f0b23e', '#ffe2a0', '#fff']);
    } else if (a.type === 'say'){
      view.bubble = a.text; SFX.say();
      if (!await tween(d.say, () => {}, tok)) return false;
      view.bubble = null;
    } else if (a.type === 'gate'){
      SFX.gate();
      if (!await tween(d.gate, p => { view.gate[a.x + ',' + a.y] = ease(p); }, tok)) return false;
    } else if (a.type === 'plant'){
      SFX.plant();
      if (!await tween(d.plant, p => { view.plants[a.x + ',' + a.y] = ease(p); }, tok)) return false;
      burst(a.x, a.y, ['#58a463', '#9fd88e']);
    } else if (a.type === 'eval' || a.type === 'sense'){
      SFX.tick(a.type === 'sense' || a.result);
      if (!await sleep(d.eval, tok)) return false;
    } else if (a.type === 'set' || a.type === 'iter'){
      varsMap.set(a.name, a.value); showVars(varsMap, a.name); SFX.blip();
      if (!await sleep(a.type === 'set' ? d.set : d.iter, tok)) return false;
    } else if (a.type === 'print'){
      log('out', a.text, a.line); SFX.blip();
      if (!await sleep(d.set, tok)) return false;
    } else if (a.type === 'note'){
      log('note', a.msg, a.line);
    } else if (a.type === 'bump'){
      if (a.dx < 0) view.dir = -1; else if (a.dx > 0) view.dir = 1;
      const bx = view.x, by = view.y;
      SFX.bump(d.bump * .45 / 1000);
      if (!await tween(d.bump, p => { const k = Math.sin(p * Math.PI) * .28; view.x = bx + a.dx * k; view.y = by + a.dy * k; view.shake = p > .5 ? Math.sin(p * 40) * .03 * (1 - p) : 0; }, tok)) return false;
      view.x = bx; view.y = by; view.shake = 0;
      log('err', a.msg, a.line);
      markErr(a.line);
    } else if (a.type === 'error'){
      log('err', a.msg, a.line); SFX.error();
      markErr(a.line);
    }
  }
  return tok === runToken;
}
function markErr(line){
  if (!flowProg) return;
  let id = null;
  walk(flowProg, s => { if (!id && s.line === line) id = s.id; });
  fcHighlight(id, undefined, true);
}
function burst(x, y, colors){
  if (REDUCED) return;
  for (let i = 0; i < 14; i++){
    const a = Math.random() * Math.PI * 2, s = .6 + Math.random() * 1.4;
    view.particles.push({ x:x + .5, y:y + .45, vx:Math.cos(a) * s, vy:Math.sin(a) * s - .8, life:1, c:colors[i % colors.length] });
  }
}

/* ---------- Жеңіс терезесі ---------- */
/* Жеңіс терезесі: күйі winState-та сақталады, сондықтан тіл ауысқанда қайта сызылады */
let winState = null;
function onWin(res){
  const p = P(L.id); p.passed = true; if (res.eff) p.eff = true; saveProgress();
  renderLevelStars(); updateTotal();
  SFX.win();
  winState = { res, pick:null };
  paintWin();
  $('#winModal').hidden = false;
  setTimeout(() => { const f = $('#quizOpts .opt'); if (f) f.focus(); }, 30);
}
function paintWin(){
  if (!winState) return;
  const res = winState.res, pick = winState.pick;
  const last = curIdx === LEVELS.length - 1;
  const ch = chapterOf(curIdx), chEnd = ch.levels[1] === curIdx;
  $('#winEyebrow').textContent = t('win.passed', {n:curIdx + 1}) + (chEnd ? t('win.chDone', {n:ch.n}) : '');
  $('#winTitle').textContent = last ? t('win.titleAll') : chEnd ? t('win.titleCh', {c:chT(ch, 'title')}) : t('win.title');
  const q = P(L.id);
  $('#winStars').innerHTML = [
    [true, t('win.s1')],
    [!!q.eff, t('win.s2', {t:L.target}) + (q.eff ? '' : t('win.s2you', {n:res.lines}))],
    [!!q.quiz, t('win.s3')]
  ].map(([on, label]) => `<div>${star8(on)}<span class="${on ? 'on-label' : ''}">${esc(label)}</span></div>`).join('');
  const qz = Object.assign({}, L.quiz, lv(L, 'quiz')), ex = $('#quizExplain');
  $('#quizQ').textContent = qz.q;
  $('#quizOpts').innerHTML = qz.opts.map((o, i) => {
    const cls = pick === null ? '' : i === L.quiz.a ? ' right' : i === pick ? ' wrong' : '';
    return `<button type="button" class="opt${cls}" data-o="${i}"${pick === null ? '' : ' disabled'}>${esc(o)}</button>`;
  }).join('');
  if (pick === null){ ex.hidden = true; ex.className = 'explain'; }
  else {
    const right = pick === L.quiz.a;
    ex.hidden = false; ex.className = 'explain ' + (right ? 'good' : 'bad');
    ex.textContent = (right ? t('win.right') : t('win.wrong')) + qz.explain;
  }
  $('#nextBtn').textContent = last ? t('win.backMap') : t('win.next');
  $('#toMapBtn').hidden = last;
}
$('#quizOpts').addEventListener('click', e => {
  const b = e.target.closest('[data-o]'); if (!b || b.disabled || !winState || winState.pick !== null) return;
  const pick = +b.dataset.o, right = pick === L.quiz.a;
  winState.pick = pick;
  if (right) SFX.right(); else SFX.wrong();
  if (right){ setTimeout(() => SFX.star(), 220); P(L.id).quiz = true; saveProgress(); renderLevelStars(); updateTotal(); }
  paintWin();
  $('#nextBtn').focus();
});
function closeWin(){ $('#winModal').hidden = true; }
$('#stayBtn').onclick = closeWin;
$('#toMapBtn').onclick = () => { closeWin(); showMap(); };
$('#nextBtn').onclick = () => { closeWin(); curIdx < LEVELS.length - 1 ? openLevel(curIdx + 1) : showMap(); };

/* ---------- Анықтама және мұғалім ---------- */
function openModal(id, focusSel){ $(id).hidden = false; const f = $(focusSel); if (f) f.focus(); }
$('#refBtn').onclick = () => openModal('#refModal', '#refClose');
$('#refClose').onclick = () => { $('#refModal').hidden = true; $('#refBtn').focus(); };
function renderTeacher(){
  const rows = [];
  CHAPTERS.forEach(c => {
    rows.push(`<tr class="chrow"><td colspan="5">${t('map.chapter', {n:c.n})} · ${esc(chT(c, 'title'))} — ${esc(chT(c, 'goal'))}</td></tr>`);
    for (let i = c.levels[0]; i <= c.levels[1]; i++){
      const l = LEVELS[i];
      rows.push(`<tr><td>${i + 1}</td><td><b>${esc(lv(l, 'title'))}</b><small>${esc(lv(l, 'concept'))}${l.variants.length > 1 ? t('t.mapsN', {n:l.variants.length}) : ''}</small></td>
        <td>${esc(algoType(parseProgram(localCode(l.solution))))}</td>
        <td class="code">${l.code ? `${l.code}<small style="font-family:var(--f-body);white-space:normal">${esc(objT(l.code))}</small>` : `<small style="font-family:var(--f-body)">${t('t.ch1obj')}</small>`}</td>
        <td><details><summary>${t('t.solution', {n:codeLines(l.solution)})}</summary><pre>${esc(localCode(l.solution))}</pre></details></td></tr>`);
    }
  });
  $('#teachTable').innerHTML = `<thead><tr><th>${t('t.colN')}</th><th>${t('t.colLevel')}</th><th>${t('t.colType')}</th><th>${t('t.colObj')}</th><th>${t('t.colSol')}</th></tr></thead><tbody>${rows.join('')}</tbody>`;
  $('#unlockBtn').textContent = settings().all ? t('t.unlockSeq') : t('t.unlockAll');
}
$('#teacherBtn').onclick = () => { renderTeacher(); renderStudents(); aiAvail(); $('#csvNote').textContent = ''; openModal('#teachModal', '#teachClose'); };
$('#teachClose').onclick = () => { $('#teachModal').hidden = true; $('#teacherBtn').focus(); };
$('#unlockBtn').onclick = () => { settings().all = !settings().all; saveProgress(); renderTeacher(); if (screen === 'map') renderMap(); };
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  for (const id of ['#refModal', '#teachModal', '#winModal']) if (!$(id).hidden){ $(id).hidden = true; return; }
});
['#winModal', '#refModal', '#teachModal'].forEach(id => { const m = $(id); m.addEventListener('click', e => { if (e.target === m) m.hidden = true; }); });


/* ---------- Тіркелу және кіру ---------- */
const AVA_COLORS = ['#f0b23e', '#69c493', '#7cc6e6', '#e0644b', '#c9a8ff', '#f28fb0'];
const fullName = u => `${u.name} ${u.surname}`.trim();
const avaHtml = (u, big) => `<span class="ava${big ? ' big' : ''}" style="background:${AVA_COLORS[u.color || 0]}" aria-hidden="true">${esc(((u.name || '?')[0] + ((u.surname || '')[0] || '')).toUpperCase())}</span>`;
async function hashPin(id, pin){
  const text = 'kod-dalasy:' + id + ':' + pin;
  try {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
    return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (e) {
    let h = 5381; for (const ch of text) h = ((h * 33) ^ ch.charCodeAt(0)) >>> 0;
    return 'x' + h.toString(16);
  }
}
let pickId = null, regColor = 0;
function renderUserChip(){
  const b = $('#userBtn'), u = currentUser();
  if (!DB.current){ b.hidden = true; return; }
  b.hidden = false;
  const LOGOUT = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6 2.5H3.5v11H6M10 5l3 3-3 3M13 8H6.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  b.innerHTML = u ? `${avaHtml(u)}<span class="nm">${esc(fullName(u))}</span>${LOGOUT}`
                  : `<span class="ava" style="background:var(--panel-2);color:var(--muted)" aria-hidden="true">?</span><span class="nm">${t('guest')}</span>${LOGOUT}`;
  b.title = t('user.switchT');
  b.setAttribute('aria-label', (u ? fullName(u) : t('guest')) + ': ' + t('user.switch'));
}
$('#userBtn').onclick = () => { SFX.click(); DB.current = null; saveProgress(); showAuth(); };
function selectAuthTab(which){
  const login = which === 'login';
  $('#tabLogin').setAttribute('aria-selected', login); $('#tabReg').setAttribute('aria-selected', !login);
  $('#authLogin').hidden = !login; $('#authReg').hidden = login;
  if (login) renderUserGrid(); else { $('#regErr').textContent = ''; setTimeout(() => $('#regName').focus(), 20); }
}
$('#tabLogin').onclick = () => selectAuthTab('login');
$('#tabReg').onclick = () => selectAuthTab('reg');
function sortedUsers(){
  return Object.entries(DB.users).map(([id, u]) => ({id, ...u}))
    .sort((a, b) => (a.cls || '').localeCompare(b.cls || '', 'kk') || fullName(a).localeCompare(fullName(b), 'kk'));
}
function renderUserGrid(){
  const list = sortedUsers(), q = $('#userSearch').value.trim().toLocaleLowerCase('kk');
  $('#searchWrap').hidden = list.length < 7;
  $('#pickBox').hidden = false; $('#pinBox').hidden = true; pickId = null;
  const shown = q ? list.filter(u => (fullName(u) + ' ' + u.cls).toLocaleLowerCase('kk').includes(q)) : list;
  $('#userGrid').innerHTML = !list.length
    ? `<p class="empty-note" style="grid-column:1/-1">${t('a.empty')}</p>`
    : !shown.length ? `<p class="empty-note" style="grid-column:1/-1">${t('a.notFound')}</p>`
    : shown.map(u => `<button type="button" class="user-card" data-u="${esc(u.id)}">${avaHtml(u, true)}<b>${esc(fullName(u))}</b><small>${esc(t('a.classOf', {c:u.cls}))}</small></button>`).join('');
}
$('#userSearch').addEventListener('input', renderUserGrid);
$('#userGrid').addEventListener('click', e => {
  const b = e.target.closest('[data-u]'); if (!b) return;
  const u = DB.users[b.dataset.u]; if (!u) return;
  SFX.click(); pickId = b.dataset.u;
  $('#pickBox').hidden = true; $('#pinBox').hidden = false;
  $('#pinAva').outerHTML = avaHtml(u, true).replace('class="ava big"', 'class="ava big" id="pinAva"');
  $('#pinName').textContent = u.name; $('#pinErr').textContent = ''; $('#pinInput').value = '';
  setTimeout(() => $('#pinInput').focus(), 20);
});
$('#pinBack').onclick = renderUserGrid;
$('#pinBox').addEventListener('submit', async e => {
  e.preventDefault();
  const u = DB.users[pickId], pin = $('#pinInput').value.trim();
  if (!u) return renderUserGrid();
  if (!/^\d{4}$/.test(pin)){ $('#pinErr').textContent = t('a.errPin4'); return; }
  if (await hashPin(pickId, pin) !== u.pin){ $('#pinErr').textContent = t('a.errPin'); $('#pinInput').select(); SFX.error(); return; }
  login(pickId);
});
$('#pinInput').addEventListener('input', e => { e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4); });
['#regPin', '#regPin2'].forEach(id => $(id).addEventListener('input', e => { e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4); }));
function renderSwatches(){
  $('#swatches').innerHTML = AVA_COLORS.map((c, i) => `<button type="button" class="swatch" role="radio" aria-checked="${i === regColor}" aria-label="${t('a.colorN', {n:i + 1})}" data-c="${i}" style="background:${c}"></button>`).join('');
}
$('#swatches').addEventListener('click', e => { const b = e.target.closest('[data-c]'); if (!b) return; regColor = +b.dataset.c; renderSwatches(); });
const cleanName = s => s.trim().replace(/\s+/g, ' ');
const capital = s => s ? s.charAt(0).toLocaleUpperCase('kk') + s.slice(1) : s;
$('#authReg').addEventListener('submit', async e => {
  e.preventDefault();
  const err = $('#regErr');
  const name = capital(cleanName($('#regName').value)), surname = capital(cleanName($('#regSurname').value));
  const cls = $('#regGrade').value + $('#regLetter').value, pin = $('#regPin').value, pin2 = $('#regPin2').value;
  if (!name || !surname){ err.textContent = t('a.errName'); return; }
  if (!/^[\p{L}\s'-]+$/u.test(name + surname)){ err.textContent = t('a.errLetters'); return; }
  if (!/^\d{4}$/.test(pin)){ err.textContent = t('a.errPinLen'); return; }
  if (pin !== pin2){ err.textContent = t('a.errPinMatch'); return; }
  const dup = Object.values(DB.users).some(u => fullName(u).toLocaleLowerCase('kk') === `${name} ${surname}`.toLocaleLowerCase('kk') && u.cls === cls);
  if (dup){ err.textContent = t('a.errDup'); return; }
  const id = 'u' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  DB.users[id] = { name, surname, cls, color:regColor, pin:await hashPin(id, pin), created:Date.now(), progress:{} };
  ['#regName', '#regSurname', '#regPin', '#regPin2'].forEach(s => { $(s).value = ''; });
  login(id, true);
});
$('#guestBtn').onclick = () => { SFX.click(); DB.current = 'guest'; bindProgress(); saveProgress(); showMap(); };
function login(id, fresh){
  DB.current = id; bindProgress(); saveProgress();
  SFX.run(); showMap();
  const u = currentUser();
  if (u && fresh) setTimeout(() => SFX.star(), 200);
}
function showAuth(){
  stopRun(); screen = 'auth';
  mapScreen.hidden = true; levelScreen.hidden = true; $('#authScreen').hidden = false;
  renderUserChip(); renderSwatches();
  $('#userSearch').value = '';
  selectAuthTab(Object.keys(DB.users).length ? 'login' : 'reg');
  window.scrollTo(0, 0);
}

/* ---------- Мұғалімге: оқушылар кестесі ---------- */
const fmtDate = t => { if (!t) return '—'; const d = new Date(t); const p = n => String(n).padStart(2, '0'); return `${p(d.getDate())}.${p(d.getMonth() + 1)}.${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}`; };
function statsOf(u){
  const pr = u.progress || {};
  const st = LEVELS.map(l => { const p = pr[l.id] || {}; return (p.passed ? 1 : 0) + (p.eff ? 1 : 0) + (p.quiz ? 1 : 0); });
  return { stars:st.reduce((a, b) => a + b, 0), done:LEVELS.filter(l => (pr[l.id] || {}).passed).length, per:st };
}
let armedAct = null, armedTmr = null;
function renderStudents(){
  const all = sortedUsers(), sel = $('#clsFilter');
  const classes = [...new Set(all.map(u => u.cls))].sort((a, b) => a.localeCompare(b, 'kk', {numeric:true}));
  const cur = sel.value;
  sel.innerHTML = `<option value="">${t('t.all')}</option>` + classes.map(c => `<option value="${esc(c)}">${esc(c)}</option>`).join('');
  sel.value = classes.includes(cur) ? cur : '';
  const list = all.filter(u => !sel.value || u.cls === sel.value);
  $('#stuEmpty').hidden = all.length > 0; $('#stuWrap').hidden = !all.length; $('#csvBtn').disabled = !list.length;
  $('#stuTable').innerHTML = `<thead><tr><th>${t('t.cStudent')}</th><th>${t('t.cClass')}</th><th>${t('t.cLevels')}</th><th>${t('t.cStars')}</th><th>${t('t.cLast')}</th><th>${t('t.cAct')}</th></tr></thead><tbody>` +
    list.map(u => { const s = statsOf(u); return `<tr><td><span class="who">${avaHtml(u)}<b>${esc(fullName(u))}</b></span></td><td>${esc(u.cls)}</td>
      <td class="num">${s.done} / ${LEVELS.length}</td><td class="num">${s.stars} / ${LEVELS.length * 3}</td><td class="num">${fmtDate(u.last)}</td>
      <td><span class="act"><button type="button" class="btn small ghost" data-act="pin" data-u="${esc(u.id)}">PIN → 0000</button><button type="button" class="btn small ghost danger" data-act="del" data-u="${esc(u.id)}">${t('t.del')}</button></span></td></tr>`; }).join('') + '</tbody>';
}
$('#clsFilter').addEventListener('change', renderStudents);
$('#stuTable').addEventListener('click', async e => {
  const b = e.target.closest('[data-act]'); if (!b) return;
  const key = b.dataset.act + ':' + b.dataset.u, u = DB.users[b.dataset.u]; if (!u) return;
  if (armedAct !== key){
    armedAct = key; clearTimeout(armedTmr);
    b.textContent = b.dataset.act === 'del' ? t('t.delSure') : t('t.pinSure');
    armedTmr = setTimeout(() => { armedAct = null; renderStudents(); }, 3500);
    return;
  }
  armedAct = null; clearTimeout(armedTmr);
  if (b.dataset.act === 'del'){ delete DB.users[b.dataset.u]; if (DB.current === b.dataset.u){ DB.current = null; bindProgress(); saveProgress(); $('#teachModal').hidden = true; showAuth(); return; } }
  else { u.pin = await hashPin(b.dataset.u, '0000'); }
  saveProgress(); renderStudents(); renderUserChip();
  $('#csvNote').textContent = b.dataset.act === 'del' ? t('t.deleted', {n:fullName(u)}) : t('t.pinDone', {n:fullName(u)});
});
function buildCsv(list){
  const q = v => { const s = String(v); return /[;"\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
  const head = [t('csv.name'), t('csv.class'), t('csv.done'), t('csv.stars'), ...LEVELS.map((l, i) => `${i + 1}. ${lv(l, 'title')}`), t('csv.last')];
  const rows = list.map(u => { const s = statsOf(u); return [fullName(u), u.cls, s.done, s.stars, ...s.per, fmtDate(u.last)]; });
  return '﻿' + [head, ...rows].map(r => r.map(q).join(';')).join('\r\n');
}
$('#csvBtn').onclick = async () => {
  const note = $('#csvNote'), sel = $('#clsFilter').value;
  const list = sortedUsers().filter(u => !sel || u.cls === sel);
  if (!list.length) return;
  const d = new Date(), stamp = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const filename = `kod-dalasy-${sel || 'barlyq'}-${stamp}.csv`.replace(/[^\w.\-]/g, c => ({'А':'A','Ә':'AE','Б':'B','В':'V','Г':'G','Д':'D','Е':'E'}[c] || '_'));
  const data = buildCsv(list);
  try {
    const url = URL.createObjectURL(new Blob([data], { type:'text/csv;charset=utf-8' }));
    const a = document.createElement('a'); a.href = url; a.download = filename;
    document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    note.textContent = t('t.saved'); return;
  } catch (e) {}
  try { await navigator.clipboard.writeText(data.slice(1).replace(/;/g, '\t')); note.textContent = t('t.copied'); }
  catch (e){ note.textContent = t('t.failed'); }
};



/* ---------- Қыран ЖИ (GitHub нұсқасында өшірулі) ---------- */
let AI = null, aiReady = false, aiTurns = [], aiBusy = false, aiCtl = null, aiDead = false, lastRunInfo = null;
const LANG_NAME = { kk:'Kazakh (қазақ тілі)', ru:'Russian', en:'English' };
const KYRAN_AVA = '<svg viewBox="0 0 56 56" aria-hidden="true"><circle cx="28" cy="28" r="27" fill="#2b3766"/><path d="M12 50C10 30 18 14 34 13C42 12.5 47 17 47 22C47 25 45 27 42 27C40 34 33 40 26 50Z" fill="#8a5a2f"/><path d="M41.5 17.5C48 17.5 52.5 21 51 27C49 24.5 46 23.6 42.5 24.2Z" fill="#f0b23e"/><circle cx="38" cy="19" r="2.3" fill="#121a33"/></svg>';
const aiEnabled = () => !!AI && !aiDead && !settings().aiOff;
(async () => {
  AI = null; /* GitHub нұсқасында ЖИ жоқ */
  aiReady = true;
  aiAvail();
})();
/* Қойынды әрқашан көрінеді; ЖИ жұмыс істей алмаса, ішінде себебі жазылады */
function aiAvail(){
  const on = aiEnabled();
  $('#tabAi').hidden = true;
  $('#tabAi').classList.toggle('off', !on);
  $('#aiToggleBtn').hidden = !AI || aiDead;
  $('#aiToggleBtn').textContent = settings().aiOff ? t('t.aiOff') : t('t.aiOn');
  const note = $('#aiState');
  note.hidden = on;
  note.textContent = on ? '' : settings().aiOff && AI ? t('ai.off') : !aiReady ? t('ai.checking') : t('ai.unavailableLong');
  ['#aiChips', '#aiLog', '#aiForm', '#aiNote'].forEach(s => { $(s).hidden = !on; });
  if (!on) $('#aiAskBtn').hidden = true;
}
function showAiAsk(show){ $('#aiAskBtn').hidden = !(show && aiEnabled()); }
function aiFormat(text){
  return esc(text).replace(/`([^`\n]+)`/g, '<code>$1</code>').replace(/\*\*([^*\n]+)\*\*/g, '<b>$1</b>');
}
function aiBubble(role, html, cls){
  const box = document.createElement('div');
  box.className = 'ai-msg' + (role === 'me' ? ' me' : '');
  const ava = role === 'me' ? `<span class="who-ava">${esc(t('ai.you'))}</span>` : `<span class="who-ava">${KYRAN_AVA}</span>`;
  box.innerHTML = ava + `<div class="bubble${cls ? ' ' + cls : ''}">${html}</div>`;
  $('#aiLog').append(box); aiScroll();
  return box.querySelector('.bubble');
}
function aiScroll(){ const l = $('#aiLog'); l.scrollTop = l.scrollHeight; }
function aiChips(){
  const chips = [['err', t('ai.cError')], ['hint', t('ai.cHint')], ['concept', t('ai.cConcept')], ['review', t('ai.cReview')]];
  $('#aiChips').innerHTML = chips.map(([k, l]) => `<button type="button" class="ai-chip" data-q="${k}"${aiBusy ? ' disabled' : ''}>${esc(l)}</button>`).join('');
}
function aiRenderLog(){
  $('#aiLog').innerHTML = '';
  aiBubble('ai', aiFormat(t('ai.hello')));
  aiTurns.forEach(m => aiBubble(m.role === 'user' ? 'me' : 'ai', aiFormat(m.content)));
}
function aiReset(){
  if (aiCtl) aiCtl.abort();
  aiTurns = []; aiBusy = false; lastRunInfo = null;
  showAiAsk(false); aiChips(); aiRenderLog(); aiSetBusy(false);
  $('#aiInput').value = '';
}
function aiSetBusy(b){
  aiBusy = b;
  $('#aiSend').hidden = b; $('#aiStop').hidden = !b;
  $('#aiInput').disabled = b;
  $('#aiChips').querySelectorAll('button').forEach(x => { x.disabled = b; });
}
/* Claude-қа жіберілетін нұсқау: деңгей, карта, оқушының коды және соңғы нәтиже */
function aiContext(){
  const R = L.require || {};
  const must = [R.if && 'if', R.for && 'for', R.while && 'while', R.var && 'a variable inside hero.say'].filter(Boolean);
  const maps = L.variants.map((V, k) => `Map ${k + 1}${V.sign !== undefined ? ` (number on the gate sign: ${V.sign})` : ''}:\n` + V.map.map((r, y) => `  row ${y + 1}: ${r}`).join('\n')).join('\n');
  const code = ta.value.split('\n').map((l, i) => `${String(i + 1).padStart(2)}| ${l}`).join('\n');
  let run = 'The student has not run this code yet.';
  if (lastRunInfo){
    if (lastRunInfo.parseError) run = `Python could not read the code: ${lastRunInfo.parseError}`;
    else run = (lastRunInfo.ok ? 'The level is solved.' : 'The level is NOT solved yet.') + '\n' +
      lastRunInfo.maps.map(m => `  Map ${m.n}: ${m.ok ? 'works' : 'fails' + (m.error ? ' with error ' + m.error : '') + (m.why ? ' (' + m.why + ')' : '')}`).join('\n') +
      (lastRunInfo.missing.length ? '\n  Goals not reached: ' + lastRunInfo.missing.join('; ') : '');
    if (lastRunInfo.stale) run += '\n  (The student has edited the code since this run.)';
  }
  return `You are "Kyran", a kind golden-eagle mentor inside "Kod Dalasy", a game where school students aged 11-14 in Kazakhstan learn algorithms with Python. The student is on level ${curIdx + 1} of ${LEVELS.length}: "${lv(L, 'title')}" (topic: ${lv(L, 'concept')}).

How you answer:
- Write ONLY in ${LANG_NAME[LANG]}, with simple words a 12-year-old understands. Be warm and encouraging.
- Keep it short: at most 4 sentences, or up to 4 short lines.
- Never give the full solution of this level. Show at most 2 lines of code, only to illustrate an idea. Prefer a guiding question or one concrete next step.
- When it helps, point to the student's code by line number.
- Use only the game commands below; never invent other commands.
- If the question is not about this game, Python or algorithms, kindly bring the student back to the task.
- Plain text only: no headings, no tables. Put code in \`backticks\`.

Game commands: hero.move_right(n), hero.move_left(n), hero.move_up(n), hero.move_down(n) move n squares (1 if empty). hero.say("word") opens a gate on a neighbouring square if the word is right (the word may be in Kazakh, Russian or English). hero.plant() plants a tree in a hole under the hero. Sensors: hero.can_move("right"|"left"|"up"|"down") gives True/False (False for rock, water, closed gate or edge); hero.on_hole() gives True if the hero stands on an empty hole; hero.at_yurt() gives True at the yurt; n = hero.read() reads the number or word on the sign of a neighbouring gate. Python in the game: variables, numbers, text, + - * / // %, comparisons, and/or/not, if/elif/else, for i in range(...), while, break, print, str, int, len, abs.
Map legend: H = hero start, Y = yurt (goal), # = rock, ~ = water, . = grass, g = gold coin (collected by walking over it), s = hole for a tree, G = gate. Row 1 is the top row; columns go left to right. "right" moves to the next column, "down" to the next row.

Level task: ${lv(L, 'intro')}
${lv(L, 'ruleText') ? 'Gate rule: ' + lv(L, 'ruleText') + '\n' : ''}${must.length ? 'The code must use: ' + must.join(', ') + '\n' : ''}Short-code star: ${L.target} lines or fewer.
${L.variants.length > 1 ? `The same code must work on all ${L.variants.length} maps:` : 'Map:'}
${maps}

Student's current code (line numbers added, not part of the code):
${code}

Last run: ${run}`;
}
async function aiAsk(question){
  question = String(question || '').trim();
  if (!question || aiBusy || !aiEnabled()) return;
  selectTab('ai');
  aiBubble('me', aiFormat(question));
  const turns = aiTurns.slice(-8);
  aiTurns.push({ role:'user', content:question });
  const bubble = aiBubble('ai', `<span class="ai-dots">${esc(t('ai.thinking'))}</span>`);
  aiSetBusy(true);
  const ctl = aiCtl = new AbortController();
  const input = [{ role:'user', content:aiContext() }, ...turns, { role:'user', content:question }];
  try {
    const { text, truncated } = await AI(input, {
      modelTier:'quick', cache:false, signal:ctl.signal,
      onText:({ text }) => { bubble.innerHTML = aiFormat(text); aiScroll(); }
    });
    bubble.innerHTML = aiFormat(text) + (truncated ? `<span class="cut">${esc(t('ai.cut'))}</span>` : '');
    aiTurns.push({ role:'assistant', content:text });
    SFX.blip();
  } catch (e){
    const code = e && e.code;
    aiTurns.pop();
    if (code === 'cancelled'){ bubble.innerHTML = e.text ? aiFormat(e.text) : '…'; }
    else if (['not_granted', 'sampling_disabled', 'not_declared', 'capability_disabled', 'capability_removed', 'session_expired'].includes(code)){
      bubble.classList.add('err'); bubble.textContent = t('ai.unavailable');
      aiDead = true; setTimeout(aiAvail, 2500);
    }
    else if (code === 'rate_limited'){ bubble.classList.add('err'); bubble.textContent = (e.text ? e.text + '\n\n' : '') + t('ai.busy'); }
    else if (code === 'refused'){ bubble.classList.add('err'); bubble.textContent = t('ai.refused'); }
    else { bubble.classList.add('err'); bubble.innerHTML = (e && e.text ? aiFormat(e.text) + '\n\n' : '') + esc(t('ai.failed')); }
  } finally {
    if (aiCtl === ctl) aiCtl = null;
    aiSetBusy(false); aiScroll();
  }
}
$('#aiForm').addEventListener('submit', e => { e.preventDefault(); const q = $('#aiInput').value; $('#aiInput').value = ''; aiAsk(q); });
$('#aiInput').addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey){ e.preventDefault(); $('#aiForm').requestSubmit(); } });
$('#aiStop').onclick = () => { if (aiCtl) aiCtl.abort(); };
$('#aiChips').addEventListener('click', e => {
  const b = e.target.closest('[data-q]'); if (!b || b.disabled) return;
  const k = b.dataset.q;
  aiAsk(k === 'err' ? t('ai.qError') : k === 'hint' ? t('ai.qHint') : k === 'concept' ? t('ai.qConcept', {c:lv(L, 'concept')}) : t('ai.qReview'));
});
$('#aiAskBtn').onclick = () => { SFX.click(); aiAsk(t('ai.qError')); };
$('#aiToggleBtn').onclick = () => { settings().aiOff = !settings().aiOff; saveProgress(); aiAvail(); };

/* ---------- Тіл ауыстыру ---------- */
function applyStatic(){
  document.documentElement.lang = LANG;
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll('[data-i18n-html]').forEach(el => { el.innerHTML = t(el.dataset.i18nHtml); });
  document.querySelectorAll('[data-i18n-aria]').forEach(el => { el.setAttribute('aria-label', t(el.dataset.i18nAria)); });
  document.querySelectorAll('[data-i18n-ph]').forEach(el => { el.placeholder = t(el.dataset.i18nPh); });
  aiAvail(); aiChips();
  $('#refBody').innerHTML = REF[LANG] || REF.kk;
  if (pickId && DB.users[pickId]) $('#pinName').textContent = DB.users[pickId].name;
  $('#langSel').value = LANG;
  $('#speedBtn').textContent = t('ed.speed', {s:speed});
  renderSound(); renderMusic(); setRunUI(running); renderUserChip();
}
function setLang(l){
  if (!LANGS[l] || l === LANG) return;
  LANG = l; settings().lang = l; saveProgress();
  applyStatic(); buildMapArt();
  if (screen === 'map') renderMap();
  else if (screen === 'level'){
    renderLevelTexts(); renderVariants();
    if (lastRun) lastResult = evaluate(L, lastRun.sims, ta.value, lastRun.prog);
    renderGoals(); updateFlow(true);
    if (varsMap.size) showVars(varsMap);
    aiRenderLog();
    mentorSay(hintShown ? lv(L, 'hint') : lv(L, 'intro'));
  } else if (screen === 'auth'){
    if ($('#pinBox').hidden) renderUserGrid();
    renderSwatches();
  }
  if (!$('#teachModal').hidden){ renderTeacher(); renderStudents(); }
  if (!$('#winModal').hidden) paintWin();
}
$('#langSel').addEventListener('change', e => { SFX.click(); setLang(e.target.value); });

/* ---------- Әлемді салу ---------- */
function resetView(){
  if (!info) return;
  view = { x:info.start[0], y:info.start[1], dir:1, bob:0, shake:0,
    gems:new Set(info.gems.map(([x, y]) => x + ',' + y)), gate:{}, plants:{}, bubble:null, particles:[] };
}
function sizeCanvas(){
  const r = cv.getBoundingClientRect(); if (!r.width) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  cv.width = Math.round(r.width * dpr); cv.height = Math.round(r.width * ROWS / COLS * dpr);
}
new ResizeObserver(sizeCanvas).observe($('#stage'));

const hash = (x, y) => (((x * 73856093) ^ (y * 19349663)) >>> 0) % 1000 / 1000;
function ell(cx, cy, rx, ry, fill){ ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2); ctx.fillStyle = fill; ctx.fill(); }
function poly(cx, cy, T, pts, fill){ ctx.beginPath(); pts.forEach(([px, py], i) => ctx[i ? 'lineTo' : 'moveTo'](cx + px * T, cy + py * T)); ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); }
function rr(x, y, w, h, r){ ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }

function drawRock(x, y, T){
  const s = .85 + hash(x + 3, y) * .25, cx = (x + .5) * T, cy = (y + .58) * T;
  ell(cx, cy + T * .2, T * .38 * s, T * .09, 'rgba(40,40,20,.25)');
  poly(cx, cy, T * s, [[-.38,.2],[-.31,-.1],[-.12,-.3],[.14,-.31],[.33,-.12],[.39,.2]], '#867f75');
  poly(cx, cy, T * s, [[-.24,-.08],[-.09,-.23],[.11,-.25],[.02,-.06]], '#a59e92');
  poly(cx, cy, T * s, [[.05,.2],[.33,-.1],[.39,.2]], '#6f685f');
}
function drawWater(x, y, T, t){
  ctx.fillStyle = '#3e80a8'; ctx.fillRect(x * T, y * T, T + 1, T + 1);
  ctx.strokeStyle = 'rgba(255,255,255,.32)'; ctx.lineWidth = Math.max(1, T * .035);
  for (let k = 0; k < 2; k++){
    const y0 = y * T + T * (.35 + k * .35);
    ctx.beginPath();
    for (let i = 0; i <= 8; i++){
      const px = x * T + T * i / 8, py = y0 + Math.sin((i / 8) * Math.PI * 2 + (REDUCED ? 0 : t * 1.6) + x + k * 2) * T * .04;
      i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
    }
    ctx.stroke();
  }
}
function drawTamga(x, y, T, t){
  const cx = (x + .5) * T, cy = (y + .48) * T, r = T * .2 * (1 + (REDUCED ? 0 : Math.sin(t * 3 + x) * .05));
  ell(cx, cy + T * .27, T * .18, T * .05, 'rgba(40,40,20,.25)');
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fillStyle = '#f0b23e'; ctx.fill();
  ctx.lineWidth = T * .035; ctx.strokeStyle = '#b8771c'; ctx.stroke();
  ctx.strokeStyle = '#5e3c0c'; ctx.lineWidth = T * .04; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(cx - r * .45, cy - r * .42); ctx.lineTo(cx, cy + r * .05); ctx.lineTo(cx + r * .45, cy - r * .42);
  ctx.moveTo(cx, cy + r * .05); ctx.lineTo(cx, cy + r * .5); ctx.moveTo(cx - r * .3, cy + r * .5); ctx.lineTo(cx + r * .3, cy + r * .5); ctx.stroke();
}
function drawSpot(x, y, T, p){
  const cx = (x + .5) * T, cy = (y + .62) * T;
  ell(cx, cy, T * .3, T * .15, '#7b5333'); ell(cx, cy, T * .2, T * .09, '#553521');
  if (!p) return;
  ctx.strokeStyle = '#6d4a2a'; ctx.lineWidth = T * .055; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx, cy - T * .36 * p);
  ctx.moveTo(cx, cy - T * .18 * p); ctx.lineTo(cx - T * .14 * p, cy - T * .32 * p);
  ctx.moveTo(cx, cy - T * .22 * p); ctx.lineTo(cx + T * .13 * p, cy - T * .38 * p); ctx.stroke();
  [[0,-.44,'#3f8a4f'],[-.15,-.36,'#58a463'],[.14,-.42,'#58a463'],[.04,-.52,'#6cbb72']].forEach(([dx, dy, c]) => {
    ctx.beginPath(); ctx.arc(cx + dx * T * p, cy + dy * T * p, T * .11 * p, 0, Math.PI * 2); ctx.fillStyle = c; ctx.fill();
  });
}
function drawGate(x, y, T, p, sign){
  const X = x * T, Y = y * T;
  ctx.fillStyle = '#6a4322'; ctx.fillRect(X + T * .06, Y + T * .12, T * .14, T * .86); ctx.fillRect(X + T * .8, Y + T * .12, T * .14, T * .86);
  ctx.fillStyle = '#7a4a22'; ctx.fillRect(X + T * .02, Y + T * .04, T * .96, T * .16);
  ctx.fillStyle = '#c8463a'; ctx.fillRect(X + T * .02, Y + T * .09, T * .96, T * .06);
  ctx.fillStyle = '#f0b23e';
  for (let i = 0; i < 4; i++){ const cx = X + T * (.17 + i * .22), cy = Y + T * .12; ctx.beginPath(); ctx.moveTo(cx, cy - T * .03); ctx.lineTo(cx + T * .03, cy); ctx.lineTo(cx, cy + T * .03); ctx.lineTo(cx - T * .03, cy); ctx.fill(); }
  const half = T * .3 * (1 - p);
  if (half > .5){
    ctx.fillStyle = '#a8703a';
    ctx.fillRect(X + T * .2, Y + T * .2, half, T * .78); ctx.fillRect(X + T * .8 - half, Y + T * .2, half, T * .78);
    ctx.strokeStyle = 'rgba(70,40,15,.55)'; ctx.lineWidth = Math.max(1, T * .02);
    for (let i = 1; i < 3; i++){
      ctx.beginPath(); ctx.moveTo(X + T * .2 + half * i / 3, Y + T * .2); ctx.lineTo(X + T * .2 + half * i / 3, Y + T * .98);
      ctx.moveTo(X + T * .8 - half * i / 3, Y + T * .2); ctx.lineTo(X + T * .8 - half * i / 3, Y + T * .98); ctx.stroke();
    }
  }
  if (sign !== undefined){
    const fs = Math.max(11, T * .26), w = T * .58, h = fs * 1.35, sx = X + T * .5 - w / 2, sy = Y + T * .42;
    rr(sx, sy, w, h, h * .25); ctx.fillStyle = '#f6ecd2'; ctx.fill();
    ctx.lineWidth = Math.max(1.5, T * .03); ctx.strokeStyle = '#5b3b22'; ctx.stroke();
    ctx.fillStyle = '#2a1c04'; ctx.font = `700 ${fs}px "JetBrains Mono", ui-monospace, monospace`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(String(sign), X + T * .5, sy + h / 2 + 1);
    ctx.textAlign = 'start';
  }
}
function drawYurt(x, y, T){
  const cx = (x + .5) * T, by = (y + .86) * T;
  ell(cx, by + T * .02, T * .44, T * .07, 'rgba(40,40,20,.28)');
  const bx = cx - T * .38, bw = T * .76, bh = T * .3, top = by - bh;
  ctx.fillStyle = '#efe5cf'; ctx.fillRect(bx, top, bw, bh);
  ctx.save(); ctx.beginPath(); ctx.rect(bx, top, bw, bh); ctx.clip();
  ctx.strokeStyle = '#cdb489'; ctx.lineWidth = Math.max(1, T * .015);
  for (let i = -6; i < 12; i++){ ctx.beginPath(); ctx.moveTo(bx + i * T * .09, top); ctx.lineTo(bx + i * T * .09 + bh, by); ctx.moveTo(bx + i * T * .09 + bh, top); ctx.lineTo(bx + i * T * .09, by); ctx.stroke(); }
  ctx.restore();
  ctx.beginPath(); ctx.moveTo(cx - T * .43, top); ctx.quadraticCurveTo(cx, top - T * .5, cx + T * .43, top); ctx.closePath(); ctx.fillStyle = '#f7f0e0'; ctx.fill();
  ctx.strokeStyle = '#c8463a'; ctx.lineWidth = T * .045; ctx.beginPath(); ctx.moveTo(cx - T * .4, top - T * .02); ctx.quadraticCurveTo(cx, top - T * .44, cx + T * .4, top - T * .02); ctx.stroke();
  ctx.beginPath(); ctx.arc(cx, top - T * .245, T * .06, 0, Math.PI * 2); ctx.fillStyle = '#8a5a2b'; ctx.fill();
  ctx.fillStyle = '#c8463a'; ctx.fillRect(cx - T * .1, by - T * .24, T * .2, T * .24);
  ctx.strokeStyle = '#f0b23e'; ctx.lineWidth = Math.max(1, T * .025); ctx.strokeRect(cx - T * .1, by - T * .24, T * .2, T * .24);
}
function drawHero(T){
  const gx = (view.x + .5) * T + view.shake * T, gy = (view.y + .5) * T;
  ell(gx, gy + T * .36, T * .2, T * .055, 'rgba(30,30,15,.3)');
  ctx.save(); ctx.translate(gx, gy - view.bob * T * .08); ctx.scale(view.dir, 1);
  ctx.fillStyle = '#3b2416'; ctx.fillRect(-T * .13, T * .26, T * .1, T * .09); ctx.fillRect(T * .04, T * .26, T * .1, T * .09);
  poly(0, 0, T, [[-.2,.29],[-.14,-.07],[.14,-.07],[.2,.29]], '#3446a3');
  ctx.strokeStyle = '#f0b23e'; ctx.lineWidth = T * .028;
  ctx.beginPath(); ctx.moveTo(T * .05, -T * .06); ctx.lineTo(T * .09, T * .28); ctx.moveTo(-T * .19, T * .26); ctx.lineTo(T * .19, T * .26); ctx.stroke();
  ctx.fillStyle = '#c8463a'; ctx.fillRect(-T * .16, T * .06, T * .32, T * .05);
  ctx.beginPath(); ctx.arc(0, -T * .2, T * .135, 0, Math.PI * 2); ctx.fillStyle = '#e6b48b'; ctx.fill();
  ctx.beginPath(); ctx.moveTo(-T * .16, -T * .23); ctx.quadraticCurveTo(-T * .14, -T * .44, 0, -T * .44); ctx.quadraticCurveTo(T * .14, -T * .44, T * .16, -T * .23); ctx.closePath(); ctx.fillStyle = '#9b2f2a'; ctx.fill();
  ell(-T * .02, -T * .24, T * .18, T * .045, '#e8dcc0');
  ell(-T * .15, -T * .14, T * .045, T * .085, '#e8dcc0');
  ctx.beginPath(); ctx.arc(T * .065, -T * .18, T * .022, 0, Math.PI * 2); ctx.fillStyle = '#20160e'; ctx.fill();
  ctx.restore();
}
function drawBubble(T, W){
  const fs = Math.max(11, T * .22);
  ctx.font = `600 ${fs}px "Golos Text", system-ui, sans-serif`;
  const text = view.bubble.length > 26 ? view.bubble.slice(0, 25) + '…' : view.bubble;
  const w = ctx.measureText(text).width + fs * 1.1, h = fs * 1.8;
  const hx = (view.x + .5) * T, hy = (view.y + .5) * T - T * .5;
  let bx = Math.min(Math.max(4, hx - w / 2), W - w - 4), by = Math.max(4, hy - h - T * .12);
  rr(bx, by, w, h, h * .35); ctx.fillStyle = '#fffaf0'; ctx.fill();
  ctx.lineWidth = 2; ctx.strokeStyle = '#2a1c04'; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(hx - 6, by + h - 1); ctx.lineTo(hx, by + h + 9); ctx.lineTo(hx + 6, by + h - 1); ctx.fillStyle = '#fffaf0'; ctx.fill();
  ctx.fillStyle = '#2a1c04'; ctx.textBaseline = 'middle'; ctx.fillText(text, bx + fs * .55, by + h / 2 + 1);
}
let lastT = performance.now();
function frame(now){
  requestAnimationFrame(frame);
  const dt = Math.min(.05, (now - lastT) / 1000); lastT = now;
  if (screen !== 'level' || !view || !cv.width) return;
  const W = cv.width, H = cv.height, T = W / COLS, t = now / 1000;
  const V = L.variants[vi], map = V.map;
  ctx.clearRect(0, 0, W, H);
  for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++){
    const n = hash(x, y);
    ctx.fillStyle = n < .33 ? '#a2b25c' : n < .66 ? '#a9b964' : '#9aac55';
    ctx.fillRect(x * T, y * T, T + 1, T + 1);
    if (n > .72){
      ctx.strokeStyle = '#7f9343'; ctx.lineWidth = Math.max(1, T * .025); ctx.lineCap = 'round';
      const cx = (x + .25 + n * .4) * T, cy = (y + .75) * T;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx - T * .05, cy - T * .12); ctx.moveTo(cx, cy); ctx.lineTo(cx + T * .01, cy - T * .15); ctx.moveTo(cx, cy); ctx.lineTo(cx + T * .07, cy - T * .11); ctx.stroke();
    }
  }
  ctx.strokeStyle = 'rgba(50,60,20,.12)'; ctx.lineWidth = 1;
  for (let x = 1; x < COLS; x++){ ctx.beginPath(); ctx.moveTo(x * T, 0); ctx.lineTo(x * T, H); ctx.stroke(); }
  for (let y = 1; y < ROWS; y++){ ctx.beginPath(); ctx.moveTo(0, y * T); ctx.lineTo(W, y * T); ctx.stroke(); }
  for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++){
    const c = map[y][x], k = x + ',' + y;
    if (c === '~') drawWater(x, y, T, t);
    else if (c === '#') drawRock(x, y, T);
    else if (c === 's') drawSpot(x, y, T, view.plants[k] || 0);
    else if (c === 'G') drawGate(x, y, T, view.gate[k] || 0, V.sign);
    else if (c === 'Y') drawYurt(x, y, T);
  }
  for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++)
    if (map[y][x] === 'g' && view.gems.has(x + ',' + y)) drawTamga(x, y, T, t);
  drawHero(T);
  view.particles = view.particles.filter(p => (p.life -= dt * 1.4) > 0);
  view.particles.forEach(p => {
    p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 2.2 * dt;
    ctx.globalAlpha = Math.max(0, p.life); ctx.fillStyle = p.c;
    ctx.beginPath(); ctx.arc(p.x * T, p.y * T, T * .04, 0, Math.PI * 2); ctx.fill();
  });
  ctx.globalAlpha = 1;
  if (view.bubble) drawBubble(T, W);
}
requestAnimationFrame(frame);

/* ---------- Іске қосу ---------- */
buildMapArt();
applyStatic();
const hot = window.claude && window.claude.hot;
if (hot && typeof hot.snapshot === 'function') hot.snapshot(() => ({ screen, idx:curIdx }));
const boot = data => {
  data = data || {};
  if (DB.current && DB.current !== 'guest' && !DB.users[DB.current]) DB.current = null;
  bindProgress();
  if (!DB.current) return showAuth();
  renderUserChip();
  if (data.screen === 'level' && LEVELS[data.idx || 0] && unlocked(data.idx || 0)) openLevel(data.idx || 0); else showMap();
};
hot && typeof hot.ready === 'function' ? hot.ready(boot) : boot(hot && hot.data);
})();

