/* ====================== Блок-схема ====================== */
const MOVE_KEY = { move_right:'right', move_left:'left', move_up:'up', move_down:'down' };
const DIR_KEY = { right:'right', left:'left', up:'up', down:'down', 'оңға':'right', 'солға':'left', 'жоғары':'up', 'төмен':'down' };
const fcEsc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const clip = (s, n) => s.length > n ? s.slice(0, n - 1) + '…' : s;

function describeStmt(s){
  if (s.type === 'expr'){
    const e = s.e;
    if (e.k === 'hcall'){
      if (MOVE_KEY[e.name]) return { kind:'proc', text:t('f.move', {d:t('f.' + MOVE_KEY[e.name]), n:e.args.length ? e.argSrc[0] : '1'}) };
      if (e.name === 'say') return { kind:'io', text:t('f.say', {x:e.argSrc[0]}) };
      if (e.name === 'plant') return { kind:'proc', text:t('f.plant') };
      if (e.name === 'read') return { kind:'io', text:t('f.read') };
      return { kind:'proc', text:s.src };
    }
    return { kind:'io', text:t('f.print', {x:e.argSrc.join(', ')}) };
  }
  if (s.type === 'assign'){
    if (s.expr.k === 'hcall' && s.expr.name === 'read') return { kind:'io', text:t('f.input', {n:s.name}) };
    if (s.op !== '=') return { kind:'proc', text:`${s.name} = ${s.name} ${s.op[0]} ${s.valSrc}` };
    return { kind:'proc', text:`${s.name} = ${s.valSrc}` };
  }
  if (s.type === 'break') return { kind:'proc', text:t('f.break') };
  return { kind:'proc', text:s.src };
}
function describeCond(e, src){
  const sens = x => x && x.k === 'hcall' ? x : null;
  const c = sens(e), nc = e.k === 'not' ? sens(e.e) : null;
  const dk = x => DIR_KEY[String(x.args[0] && x.args[0].v).toLowerCase()];
  const dirV = x => { const k = dk(x); return k ? {D:t('f.D' + k), d:t('f.' + k)} : null; };
  if (c){
    if (c.name === 'can_move' && dirV(c)) return t('f.can', dirV(c));
    if (c.name === 'on_hole') return t('f.hole');
    if (c.name === 'at_yurt') return t('f.yurt');
  }
  if (nc){
    if (nc.name === 'can_move' && dirV(nc)) return t('f.cannot', dirV(nc));
    if (nc.name === 'on_hole') return t('f.noHole');
    if (nc.name === 'at_yurt') return t('f.notYurt');
  }
  return src + ' ?';
}
function describeFor(s){
  const lit = s.args.every(a => a.k === 'num');
  if (lit){
    const a = s.args.map(x => x.v);
    const [f, to, st] = a.length === 1 ? [0, a[0], 1] : [a[0], a[1], a[2] || 1];
    const last = st > 0 ? to - 1 : to + 1;
    return st === 1 ? `${s.v} = ${f} … ${last}` : `${s.v} = ${f} … ${last}` + t('f.step', {s:st});
  }
  return `${s.v} ∈ range(${s.argSrc.join(', ')})`;
}

const FC_GAP = 18;
const tw = (s, min = 104, max = 236) => Math.min(max, Math.max(min, s.length * 6.9 + 30));

function shapeSvg(kind, cx, y, w, h, text, id, full){
  const x = cx - w / 2, my = y + h / 2;
  let sh;
  if (kind === 'term') sh = `<rect class="fc-shape" x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}"/>`;
  else if (kind === 'proc') sh = `<rect class="fc-shape" x="${x}" y="${y}" width="${w}" height="${h}" rx="3"/>`;
  else if (kind === 'io') sh = `<polygon class="fc-shape" points="${x + 11},${y} ${x + w},${y} ${x + w - 11},${y + h} ${x},${y + h}"/>`;
  else if (kind === 'dec') sh = `<polygon class="fc-shape" points="${cx},${y} ${x + w},${my} ${cx},${y + h} ${x},${my}"/>`;
  else sh = `<polygon class="fc-shape" points="${x},${my} ${x + 13},${y} ${x + w - 13},${y} ${x + w},${my} ${x + w - 13},${y + h} ${x + 13},${y + h}"/>`;
  return `<g class="fc-node fc-${kind}"${id ? ` data-id="${id}"` : ''}><title>${fcEsc(full || text)}</title>${sh}<text x="${cx}" y="${my + 4.5}" text-anchor="middle">${fcEsc(text)}</text></g>`;
}
const pl = (pts, arrow) => `<polyline class="fc-line" points="${pts.map(p => p.join(',')).join(' ')}"${arrow ? ' marker-end="url(#fcArr)"' : ''}/>`;
const lbl = (x, y, t, anchor, key) => `<text class="fc-lbl" data-br="${key}" x="${x}" y="${y}" text-anchor="${anchor}">${t}</text>`;

function fcEmpty(){ return { w:28, h:14, cx:14, draw(ox, oy, out){ out.push(pl([[ox + 14, oy], [ox + 14, oy + 14]])); } }; }
function fcSeq(list){
  if (!list || !list.length) return fcEmpty();
  const items = list.map(fcStmt);
  const left = Math.max(...items.map(b => b.cx)), right = Math.max(...items.map(b => b.w - b.cx));
  const h = items.reduce((s, b, i) => s + b.h + (i ? FC_GAP : 0), 0);
  return { w:left + right, h, cx:left, draw(ox, oy, out){
    let y = oy;
    items.forEach((b, i) => {
      if (i){ out.push(pl([[ox + left, y], [ox + left, y + FC_GAP]], true)); y += FC_GAP; }
      b.draw(ox + left - b.cx, y, out); y += b.h;
    });
  }};
}
function fcStmt(s){
  if (s.type === 'if') return fcIf(s);
  if (s.type === 'while' || s.type === 'for') return fcLoop(s);
  const d = describeStmt(s), text = clip(d.text, 30), w = tw(text), h = 34;
  return { w, h, cx:w / 2, draw(ox, oy, out){ out.push(shapeSvg(d.kind, ox + w / 2, oy, w, h, text, s.id, d.text)); } };
}
function fcIf(s){
  const full = describeCond(s.cond, s.condSrc), text = clip(full, 24);
  const dw = Math.max(128, text.length * 6.9 + 64), dh = 52;
  const T = fcSeq(s.body), E = s.orelse && s.orelse.length ? fcSeq(s.orelse) : fcEmpty();
  const gap = Math.max(30, dw + 28 - (T.w - T.cx) - E.cx);
  const tc = T.cx, ec = T.w + gap + E.cx, mid = (tc + ec) / 2;
  const drop = 22, hb = Math.max(T.h, E.h);
  const h = dh + drop + hb + 20;
  return { w:T.w + gap + E.w, h, cx:mid, draw(ox, oy, out){
    const cx = ox + mid, yv = oy + dh / 2, lx = ox + tc, rx = ox + ec, by = oy + dh + drop, my = by + hb + 10;
    out.push(shapeSvg('dec', cx, oy, dw, dh, text, s.id, full));
    out.push(pl([[cx - dw / 2, yv], [lx, yv], [lx, by]], true));
    out.push(pl([[cx + dw / 2, yv], [rx, yv], [rx, by]], true));
    out.push(lbl(cx - dw / 2 - 5, yv - 6, t('f.yes'), 'end', s.id + ':1'));
    out.push(lbl(cx + dw / 2 + 5, yv - 6, t('f.no'), 'start', s.id + ':0'));
    T.draw(ox, by, out); E.draw(ox + T.w + gap, by, out);
    out.push(pl([[lx, by + T.h], [lx, my], [rx, my], [rx, by + E.h]]));
    out.push(`<circle class="fc-dot" cx="${cx}" cy="${my}" r="2.6"/>`);
    out.push(pl([[cx, my], [cx, oy + h]]));
  }};
}
function fcLoop(s){
  const isFor = s.type === 'for';
  const full = isFor ? describeFor(s) : describeCond(s.cond, s.condSrc), text = clip(full, 24);
  const dw = isFor ? tw(text, 120) + 10 : Math.max(128, text.length * 6.9 + 64), dh = isFor ? 38 : 52;
  const B = fcSeq(s.body);
  const top = 14, drop = 22, back = 14, bottom = 22;
  const L = Math.max(dw / 2, B.cx) + 22, R = Math.max(dw / 2, B.w - B.cx) + 26;
  const h = top + dh + drop + B.h + back + bottom;
  return { w:L + R, h, cx:L, draw(ox, oy, out){
    const cx = ox + L, ry = oy + top + dh / 2, bt = oy + top + dh + drop, be = bt + B.h, ex = ox + L + R - 6;
    out.push(pl([[cx, oy], [cx, oy + top]], true));
    out.push(shapeSvg(isFor ? 'loop' : 'dec', cx, oy + top, dw, dh, text, s.id, full));
    out.push(pl([[cx, oy + top + dh], [cx, bt]], true));
    out.push(lbl(cx + 6, oy + top + dh + 14, isFor ? t('f.repeat') : t('f.yes'), 'start', s.id + ':1'));
    B.draw(cx - B.cx, bt, out);
    out.push(pl([[cx, be], [cx, be + back], [ox + 6, be + back], [ox + 6, oy + top / 2], [cx - 1, oy + top / 2]], true));
    out.push(pl([[cx + dw / 2, ry], [ex, ry], [ex, oy + h - 8], [cx, oy + h - 8], [cx, oy + h]]));
    out.push(lbl(cx + dw / 2 + 5, ry - 6, isFor ? t('f.done') : t('f.no'), 'start', s.id + ':0'));
  }};
}
function flowSvg(prog){
  const body = fcSeq(prog);
  const tw0 = 104, th = 30;
  const left = Math.max(body.cx, tw0 / 2), right = Math.max(body.w - body.cx, tw0 / 2);
  const pad = 14, W = left + right + pad * 2, cx = pad + left;
  const out = [];
  let y = pad;
  out.push(shapeSvg('term', cx, y, tw0, th, t('f.start'), 'start')); y += th;
  out.push(pl([[cx, y], [cx, y + FC_GAP]], true)); y += FC_GAP;
  if (prog.length){ body.draw(cx - body.cx, y, out); y += body.h; out.push(pl([[cx, y], [cx, y + FC_GAP]], true)); y += FC_GAP; }
  out.push(shapeSvg('term', cx, y, tw0, th, t('f.end'), 'end')); y += th + pad;
  return `<svg class="fc" viewBox="0 0 ${W} ${y}" width="${W}" height="${y}" role="img" aria-label="${t('f.aria')}">
  <defs><marker id="fcArr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="fc-arrow" d="M0 0L10 5L0 10z"/></marker></defs>
  ${out.join('')}</svg>`;
}

