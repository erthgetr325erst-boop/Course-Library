// paths.js - Learning Paths: skills graph, prerequisite locking, adaptive next stage, skill quizzes.
// Loaded after dashboard.js and before app.js. Uses app globals at call time
// (sb, me, h, courses, prog, isAdmin, toast, touchActivity) and dashboard.js helpers (Bar, courseStat, progressText).

let PD = null;       // all path data, loaded once per visit
let pathSel = null;  // selected skill on the path page
const SVGNS = 'http://www.w3.org/2000/svg';
const SK_LABEL = { done: 'أتقنتها', open: 'متاحة', locked: 'مقفولة', rec: 'مراجعة' };

function svgEl(tag, attrs, ...kids) {
  const e = document.createElementNS(SVGNS, tag);
  for (const k in attrs || {}) e.setAttribute(k, attrs[k]);
  kids.flat().filter((x) => x != null).forEach((x) => e.append(x));
  return e;
}

// ---------------------------------------------------------------- data
async function ensurePaths(force) {
  if (PD && !force) return PD;
  const q = (t, o) => { let r = sb.from(t).select('*'); return o ? r.order(o) : r; };
  const [p, s, ps, pr, sc, rs] = await Promise.all([q('paths', 'position'), q('skills'), q('path_skills', 'position'), q('skill_prereqs'), q('skill_courses'), q('skill_results')]);
  const bad = [p, s, ps, pr, sc, rs].find((x) => x.error);
  if (bad) throw new Error(bad.error.message);
  PD = {
    paths: p.data || [],
    skills: Object.fromEntries((s.data || []).map((x) => [x.id, x])),
    pathSkills: ps.data || [], prereqs: pr.data || [], links: sc.data || [],
    results: Object.fromEntries((rs.data || []).map((x) => [x.skill_id, x])),
  };
  return PD;
}

// ---------------------------------------------------------------- path logic (pure, testable)
const pathSkillIds = (pid) => PD.pathSkills.filter((r) => r.path_id === pid).sort((a, b) => a.position - b.position).map((r) => r.skill_id);
const isOptional = (pid, sid) => !!(PD.pathSkills.find((r) => r.path_id === pid && r.skill_id === sid) || {}).optional;
const isMastered = (sid) => !!(PD.results[sid] && PD.results[sid].mastered);
const skillTitle = (sid) => (PD.skills[sid] || {}).title || sid;
const hardEdges = (sid) => PD.prereqs.filter((e) => e.skill_id === sid && e.kind === 'hard');
const reviewEdges = (sid) => PD.prereqs.filter((e) => e.skill_id === sid && e.kind === 'review');
const failing = (sid) => { const r = PD.results[sid]; return !!r && !r.mastered && r.last_score <= 33; };

function skillState(sid) {
  if (isMastered(sid)) return 'done';
  if (hardEdges(sid).some((e) => !isMastered(e.requires_id))) return 'locked';
  return 'open';
}

// Stage skills = the core skills + remedial skills that quiz results have triggered.
function visibleIds(pid) {
  const all = pathSkillIds(pid);
  const main = all.filter((s) => !isOptional(pid, s));
  const trig = new Set();
  main.forEach((s) => { if (failing(s)) reviewEdges(s).forEach((e) => trig.add(e.requires_id)); });
  const opt = all.filter((s) => isOptional(pid, s) && (trig.has(s) || PD.results[s]));
  return { main, opt, trig };
}

function topoOrder(ids) {
  const set = new Set(ids), indeg = {}, out = [];
  ids.forEach((i) => (indeg[i] = 0));
  const edges = PD.prereqs.filter((e) => e.kind === 'hard' && set.has(e.skill_id) && set.has(e.requires_id));
  edges.forEach((e) => indeg[e.skill_id]++);
  const ready = ids.filter((i) => !indeg[i]);
  while (ready.length) {
    ready.sort((a, b) => ids.indexOf(a) - ids.indexOf(b));
    const x = ready.shift(); out.push(x);
    edges.filter((e) => e.requires_id === x).forEach((e) => { if (--indeg[e.skill_id] === 0) ready.push(e.skill_id); });
  }
  return out.length === ids.length ? out : ids;
}

// Remedial stages are inserted right before the skill whose weak result triggered them.
function orderOf(main, opt) {
  const order = topoOrder(main);
  opt.forEach((o) => {
    const at = order.findIndex((s) => failing(s) && reviewEdges(s).some((e) => e.requires_id === o));
    if (at >= 0) order.splice(at, 0, o); else order.unshift(o);
  });
  return order;
}

function nextStage(pid) {
  const { main } = visibleIds(pid);
  for (const s of main) {
    if (!failing(s)) continue;
    const r = reviewEdges(s).map((e) => e.requires_id).find((x) => !isMastered(x));
    if (r) return { id: r, why: 'المسار اتعدّل بناءً على نتيجتك في «' + skillTitle(s) + '»: راجع «' + skillTitle(r) + '» الأول وبعدها أعد الاختبار.' };
  }
  const nxt = topoOrder(main).find((s) => skillState(s) === 'open');
  return nxt ? { id: nxt, why: null } : null;
}

function pathStats(pid) {
  const { main } = visibleIds(pid);
  const done = main.filter(isMastered).length;
  return { done, total: main.length, pct: main.length ? Math.round((done / main.length) * 100) : 0 };
}

// ---------------------------------------------------------------- pages
function PathsView() {
  const body = h('div', null, h('div', { class: 'sk sk-card' }));
  const box = h('div', { class: 'pathsv' },
    h('h2', { class: 'sec' }, 'مسارات التعلّم'),
    h('p', { class: 'meta' }, 'اختار هدفك، والمنصة بترتّب لك المهارات حسب المتطلبات السابقة، وبيتعدّل المسار حسب نتايج اختباراتك.'), body);
  ensurePaths().then(() => {
    if (!box.isConnected) return;
    body.replaceChildren(h('div', { class: 'grid' }, PD.paths.map((p) => {
      const st = pathStats(p.id), nx = nextStage(p.id);
      return h('a', { class: 'card pcard', href: '#/path/' + p.id },
        h('span', { class: 'tag' }, st.total + ' مهارة'),
        h('h3', null, p.title),
        h('p', { class: 'meta' }, p.description),
        Bar(st.pct),
        h('span', { class: 'meta' }, st.pct + '% - ' + (nx ? 'المرحلة الجاية: ' + skillTitle(nx.id) : 'خلصت المسار')));
    })));
  }).catch((e) => { if (box.isConnected) body.replaceChildren(h('div', { class: 'empty' }, 'مقدرتش أحمّل المسارات: ' + e.message)); });
  return box;
}

function PathView(pid) {
  const box = h('div', { class: 'pathv' }, h('div', { class: 'sk sk-card' }));
  ensurePaths().then(() => { if (box.isConnected) drawPath(box, pid); })
    .catch((e) => { if (box.isConnected) box.replaceChildren(h('div', { class: 'empty' }, 'مقدرتش أحمّل المسار: ' + e.message)); });
  return box;
}

function wrapTitle(t) {
  if (t.length <= 20) return [t];
  const mid = t.length / 2; let best = -1;
  for (let i = 0; i < t.length; i++) if (t[i] === ' ' && (best < 0 || Math.abs(i - mid) < Math.abs(best - mid))) best = i;
  const cut = (x) => (x.length > 22 ? x.slice(0, 21) + '…' : x);
  return best < 0 ? [cut(t)] : [cut(t.slice(0, best)), cut(t.slice(best + 1))];
}

function drawGraph(ids, rec, select) {
  const set = new Set(ids), W = 150, H = 54, GX = 60, GY = 16, PAD = 16, depth = {};
  const dep = (s) => depth[s] !== undefined ? depth[s]
    : (depth[s] = 1 + Math.max(-1, ...hardEdges(s).filter((e) => set.has(e.requires_id)).map((e) => dep(e.requires_id))));
  ids.forEach(dep);
  const levels = Math.max(...ids.map((s) => depth[s])) + 1;
  const cols = Array.from({ length: levels }, () => []);
  ids.forEach((s) => cols[depth[s]].push(s));
  const rows = Math.max(...cols.map((c) => c.length));
  const totalW = PAD * 2 + levels * W + (levels - 1) * GX, totalH = PAD * 2 + rows * H + (rows - 1) * GY, pos = {};
  cols.forEach((col, d) => {   // first stage on the right, progress flows to the left (Arabic reading direction)
    const x = totalW - PAD - W - d * (W + GX), y0 = (totalH - (col.length * H + (col.length - 1) * GY)) / 2;
    col.forEach((s, k) => (pos[s] = { x, y: y0 + k * (H + GY) }));
  });
  const svg = svgEl('svg', { class: 'graph', viewBox: '0 0 ' + totalW + ' ' + totalH, role: 'group', 'aria-label': 'خريطة مهارات المسار',
    style: 'max-width:' + totalW + 'px;min-width:' + Math.min(totalW, 720) + 'px' });
  svg.append(svgEl('defs', null, svgEl('marker', { id: 'arr', viewBox: '0 0 10 10', refX: '9', refY: '5', markerWidth: '7', markerHeight: '7', orient: 'auto' },
    svgEl('path', { d: 'M0 0L10 5L0 10z', fill: 'currentColor' }))));
  PD.prereqs.filter((e) => set.has(e.skill_id) && set.has(e.requires_id)).forEach((e) => {
    const a = pos[e.requires_id], b = pos[e.skill_id];
    const sx = a.x, sy = a.y + H / 2, ex = b.x + W, ey = b.y + H / 2;
    svg.append(svgEl('path', { class: 'ge ' + e.kind, d: `M${sx} ${sy} C${sx - 45} ${sy} ${ex + 45} ${ey} ${ex} ${ey}`, 'marker-end': 'url(#arr)' }));
  });
  ids.forEach((s) => {
    const base = skillState(s), st = base === 'open' && rec.has(s) ? 'rec' : base;
    const g = svgEl('g', { class: 'gn ' + st + (s === pathSel ? ' sel' : ''), transform: `translate(${pos[s].x} ${pos[s].y})`,
      tabindex: '0', role: 'button', 'aria-label': skillTitle(s) + ' - ' + SK_LABEL[st] });
    g.append(svgEl('title', null, skillTitle(s)), svgEl('rect', { width: W, height: H, rx: '10' }));
    const lines = wrapTitle(skillTitle(s));
    lines.forEach((ln, i) => g.append(svgEl('text', { x: W / 2, y: lines.length === 1 ? H / 2 + 5 : H / 2 - 5 + i * 17, 'text-anchor': 'middle' }, ln)));
    g.addEventListener('click', () => select(s));
    g.addEventListener('keydown', (ev) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); select(s); } });
    svg.append(g);
  });
  return svg;
}

function drawPath(box, pid) {
  const path = PD.paths.find((p) => p.id === pid);
  if (!path) { box.replaceChildren(h('div', { class: 'empty' }, 'المسار ده مش موجود.'), h('a', { class: 'btn ghost', href: '#/paths' }, 'كل المسارات')); return; }
  const redraw = () => drawPath(box, pid);
  const select = (s) => { pathSel = s; redraw(); requestAnimationFrame(() => { const el = document.getElementById('skillp'); if (el) el.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }); };
  const { main, opt, trig } = visibleIds(pid);
  const order = orderOf(main, opt);
  const rec = new Set([...trig].filter((s) => !isMastered(s)));
  const st = pathStats(pid), nxt = nextStage(pid);
  if (!pathSel || !order.includes(pathSel)) pathSel = nxt ? nxt.id : order[0];

  const fast = main.filter((s) => isMastered(s) && PD.results[s].attempts === 1 && PD.results[s].best_score === 100).length;
  const parts = [];
  if (rec.size) parts.push('أضفنا ' + rec.size + ' مرحلة مراجعة بسبب نتايجك');
  if (fast) parts.push('اتخطيت ' + fast + ' مهارة بنتيجة كاملة من أول محاولة');

  box.replaceChildren(
    h('a', { class: 'btn ghost', href: '#/paths' }, 'كل المسارات'),
    h('h2', { class: 'sec', style: 'margin-top:16px' }, path.title),
    h('p', { class: 'meta' }, path.description),
    h('div', { class: 'cont' },
      h('div', { class: 'cont-info' },
        h('span', { class: 'tag' }, 'نسبة الإنجاز'), Bar(st.pct),
        h('span', { class: 'meta' }, st.done + ' من ' + st.total + ' مهارة (' + st.pct + '%)'),
        h('p', null, nxt ? 'المرحلة الجاية: ' + skillTitle(nxt.id) : 'خلصت المسار كله، مبروك!'),
        nxt && nxt.why ? h('p', { class: 'meta' }, nxt.why) : null),
      nxt ? h('button', { class: 'btn', type: 'button', onclick: () => select(nxt.id) }, 'روح للمرحلة الجاية') : null),
    h('div', { class: 'adapt' }, h('b', null, 'مسار بيتغيّر حسب نتايجك: '),
      parts.length ? parts.join('، ') + '.' : 'لسه على الترتيب الأساسي. النتيجة الكاملة بتخطّيك لقدّام، والنتيجة الضعيفة بتضيف مراجعة قبل ما تكمّل.'),
    h('p', { class: 'meta ghint' }, 'اسحب الخريطة يمين وشمال عشان تشوفها كلها.'),
    h('div', { class: 'graphwrap' }, drawGraph(order, rec, select)),
    h('div', { class: 'legend' },
      h('span', null, h('i', { class: 'lg done' }), 'أتقنتها'), h('span', null, h('i', { class: 'lg open' }), 'متاحة'),
      h('span', null, h('i', { class: 'lg locked' }), 'مقفولة'), h('span', null, h('i', { class: 'lg rec' }), 'مراجعة مقترحة'),
      h('span', null, '- - -  خط متقطع: مهارة تقوية')),
    SkillPanel(pid, pathSel, redraw),
    h('h3', { class: 'sub' }, 'مراحل المسار بالترتيب'),
    h('ol', { class: 'stages' }, order.map((s, i) => {
      const b = skillState(s), x = b === 'open' && rec.has(s) ? 'rec' : b;
      return h('li', null, h('button', { type: 'button', class: 'stg ' + x + (s === pathSel ? ' sel' : ''), onclick: () => select(s) },
        h('span', { class: 'rnum' }, String(i + 1)), h('span', { class: 'lt' }, skillTitle(s)), h('span', { class: 'sl ' + x }, SK_LABEL[x])));
    })));
}

function SkillPanel(pid, sid, redraw) {
  const s = PD.skills[sid], st = skillState(sid), r = PD.results[sid];
  const linked = PD.links.filter((l) => l.skill_id === sid);
  const box = h('section', { class: 'panel skillp', id: 'skillp' },
    h('div', { class: 'rhead' }, h('h3', { style: 'margin:0' }, s.title), h('span', { class: 'sl ' + st }, SK_LABEL[st])),
    h('p', null, s.description));

  if (st === 'locked') {
    const miss = hardEdges(sid).filter((e) => !isMastered(e.requires_id));
    box.append(h('p', { class: 'meta' }, 'مقفولة لحد ما تتقن: ', miss.flatMap((e, i) => [i ? '، ' : '',
      h('a', { href: '#', onclick: (ev) => { ev.preventDefault(); pathSel = e.requires_id; redraw(); } }, skillTitle(e.requires_id))])));
  }
  if (r) box.append(h('p', { class: 'meta' }, 'محاولاتك: ' + r.attempts + ' - آخر نتيجة: ' + r.last_score + '% - أفضل نتيجة: ' + r.best_score + '%'));
  if (failing(sid)) {
    const rev = reviewEdges(sid).filter((e) => !isMastered(e.requires_id));
    if (rev.length) box.append(h('div', { class: 'adapt' }, 'المسار اتعدّل بناءً على نتيجتك. راجع الأول: ',
      rev.flatMap((e, i) => [i ? '، ' : '', h('a', { href: '#', onclick: (ev) => { ev.preventDefault(); pathSel = e.requires_id; redraw(); } }, skillTitle(e.requires_id))])));
  }

  if (linked.length) {
    box.append(h('b', null, 'كورسات المهارة'), h('ul', { class: 'tasks' }, linked.map((l) => {
      const c = courses.find((x) => x.id === l.course_id);
      if (!c) return null;
      return h('li', { class: 'task' }, h('a', { href: '#/course/' + c.id }, c.title), h('p', null, progressText(courseStat(c, prog[c.id]))),
        isAdmin ? h('button', { class: 'btn danger', type: 'button', onclick: async () => {
          const { error } = await sb.from('skill_courses').delete().eq('skill_id', sid).eq('course_id', c.id);
          if (error) toast(error.message); else { await ensurePaths(true); redraw(); }
        } }, 'فك الربط') : null);
    })));
  } else {
    box.append(h('p', { class: 'meta' }, 'لسه مفيش كورس مرتبط بالمهارة دي.' + (isAdmin ? ' اربط واحد من تحت.' : '')));
  }

  if (st === 'locked') {
    box.append(h('p', { class: 'meta' }, 'الاختبار هيفتح لما تتقن المتطلبات السابقة.'));
  } else {
    box.append(h('div', { class: 'row' },
      st === 'done' ? h('span', { class: 'meta' }, 'أتقنت المهارة دي') : null,
      h('button', { class: 'btn' + (st === 'done' ? ' ghost' : ''), type: 'button', onclick: () => openQuiz(sid, redraw) }, r ? 'أعد الاختبار' : 'اختبر مستواك'),
      !r ? h('span', { class: 'meta' }, 'لو كنت عارفها، اعمل الاختبار وتخطّاها.') : null));
  }

  if (isAdmin) {
    const free = courses.filter((c) => c.approved && !linked.some((l) => l.course_id === c.id));
    if (free.length) {
      const sel = h('select', { class: 'in', 'aria-label': 'اختار كورس' }, free.map((c) => h('option', { value: c.id }, c.title)));
      box.append(h('div', { class: 'row' }, h('span', { class: 'meta' }, 'أدمن:'), sel,
        h('button', { class: 'btn ghost', type: 'button', onclick: async () => {
          const { error } = await sb.from('skill_courses').insert({ skill_id: sid, course_id: sel.value });
          if (error) toast(error.message); else { await ensurePaths(true); redraw(); }
        } }, 'اربط الكورس بالمهارة')));
    }
  }
  return box;
}

// ---------------------------------------------------------------- quiz (grading happens on the server)
async function openQuiz(sid, redraw) {
  const dlg = document.getElementById('quizDlg'), body = document.getElementById('quizBody');
  document.getElementById('quizTitle').textContent = 'اختبار: ' + skillTitle(sid);
  body.replaceChildren(h('p', { class: 'meta' }, 'جاري تحميل الأسئلة...'));
  if (!dlg.open) dlg.showModal();
  const { data, error } = await sb.rpc('get_quiz', { p_skill: sid });
  if (error || !data || !data.length) {
    body.replaceChildren(h('p', { class: 'err' }, error ? error.message : 'مفيش أسئلة للمهارة دي لسه.'), h('button', { class: 'btn ghost', type: 'button', 'data-close': '' }, 'إغلاق'));
    return;
  }
  const form = h('form', { class: 'quiz' });
  data.forEach((q, i) => form.append(h('fieldset', null, h('legend', null, (i + 1) + '. ' + q.q),
    q.options.map((o, k) => h('label', { class: 'opt' }, h('input', { type: 'radio', name: 'q' + i, value: String(k) }), h('span', null, o))))));
  const err = h('div', { class: 'err', role: 'alert' });
  const go = h('button', { class: 'btn', type: 'submit' }, 'سلّم الإجابات');
  form.append(err, h('div', { class: 'row' }, go, h('button', { class: 'btn ghost', type: 'button', 'data-close': '' }, 'إغلاق')));
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const answers = data.map((q, i) => { const c = form.querySelector('input[name=q' + i + ']:checked'); return { id: q.id, a: c ? +c.value : -1 }; });
    if (answers.some((a) => a.a < 0) && !confirm('فيه أسئلة من غير إجابة. تسلّم كده؟')) return;
    go.disabled = true;
    const lockedBefore = Object.keys(PD.skills).filter((s) => skillState(s) === 'locked');
    const { data: res, error: e2 } = await sb.rpc('submit_quiz', { p_skill: sid, p_answers: answers });
    go.disabled = false;
    if (e2) { err.textContent = e2.message.includes('locked') ? 'المهارة دي لسه مقفولة.' : e2.message; return; }
    await ensurePaths(true);
    touchActivity();
    showQuizResult(sid, data, res, lockedBefore, redraw);
    redraw();
  });
  body.replaceChildren(form);
}

function showQuizResult(sid, qs, res, lockedBefore, redraw) {
  const body = document.getElementById('quizBody');
  const byId = Object.fromEntries(res.results.map((r) => [r.id, r]));
  const unlocked = lockedBefore.filter((s) => skillState(s) !== 'locked');
  const rev = reviewEdges(sid).filter((e) => !isMastered(e.requires_id));
  body.replaceChildren(
    h('p', { class: 'qscore ' + (res.passed ? 'ok' : 'bad') }, res.passed
      ? 'أتقنت «' + skillTitle(sid) + '» بنتيجة ' + res.score + '%.'
      : 'نتيجتك ' + res.score + '%. محتاج 67% على الأقل عشان تتقن المهارة.'),
    res.passed && unlocked.length ? h('p', null, 'اتفتحلك: ' + unlocked.map(skillTitle).join('، ')) : null,
    !res.passed && rev.length ? h('p', { class: 'adapt' }, 'المسار اتعدّل: راجع الأول ' + rev.map((e) => '«' + skillTitle(e.requires_id) + '»').join('، ') + ' وبعدها أعد الاختبار.') : null,
    h('ul', { class: 'qres' }, qs.map((q) => {
      const r = byId[q.id] || {};
      return h('li', { class: r.correct ? 'ok' : 'bad' }, h('b', null, (r.correct ? '✓ ' : '✗ ') + q.q),
        h('p', { class: 'meta' }, (r.correct ? '' : 'الإجابة الصحيحة: ' + q.options[r.answer] + '. ') + (r.note || '')));
    })),
    h('div', { class: 'row' },
      !res.passed ? h('button', { class: 'btn', type: 'button', onclick: () => openQuiz(sid, redraw) }, 'أعد الاختبار') : null,
      h('button', { class: 'btn ghost', type: 'button', 'data-close': '' }, 'إغلاق')));
}
