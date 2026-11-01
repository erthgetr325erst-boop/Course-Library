// missions.js - Mission System UI.
// Grading, hints, scoring and the choice of the next mission all happen on the server (edge function "missions");
// this file only shows the missions and sends answers. Uses app globals at call time: sb, h, toast, touchActivity.

let MS = null;   // { missions, progress }
const M_TRACK = { web: 'تطوير الويب', python: 'حل المشكلات (Python)', security: 'تحليل أمني' };
const M_ERR = {
  locked: 'المهمة دي لسه مقفولة. خلّص المهمات اللي قبلها الأول.',
  not_found: 'المهمة دي مش موجودة.',
  too_fast: 'استنى ثواني قبل المحاولة الجاية.',
  login_required: 'سجّل دخولك الأول.',
};

async function callMissions(body) {
  const { data, error } = await sb.functions.invoke('missions', { body });
  if (error) {
    let code = '';
    try { code = (await error.context.json()).error; } catch (e) {}
    const err = new Error(code || 'network'); err.code = code; throw err;
  }
  return data;
}

async function ensureMissions(force) {
  if (MS && !force) return MS;
  const [m, p] = await Promise.all([sb.from('missions').select('*').order('position'), sb.from('mission_progress').select('*')]);
  const bad = [m, p].find((x) => x.error);
  if (bad) throw new Error(bad.error.message);
  MS = { missions: m.data || [], progress: Object.fromEntries((p.data || []).map((r) => [r.mission_id, r])) };
  return MS;
}

const mDone = (id) => !!(MS.progress[id] && MS.progress[id].status === 'done');
const mLocked = (m) => (m.prereq || []).some((id) => !mDone(id));
const mDots = (n) => '●'.repeat(n) + '○'.repeat(5 - n);
const mMeta = (m) => 'الصعوبة ' + mDots(m.difficulty) + '  -  ' + m.minutes + ' دقيقة';

// ---------------------------------------------------------------- list page
function missionCard(m) {
  const p = MS.progress[m.id];
  if (mLocked(m)) {
    const need = (m.prereq || []).find((id) => !mDone(id));
    const t = MS.missions.find((x) => x.id === need);
    return h('div', { class: 'card locked' },
      h('span', { class: 'tag' }, 'مقفولة'), h('h3', null, m.title),
      h('span', { class: 'meta' }, 'بتتفتح بعد: ' + (t ? t.title : need)));
  }
  return h('a', { class: 'card', href: '#/mission/' + m.id },
    h('span', { class: 'tag' }, M_TRACK[m.track] || m.track),
    h('h3', null, m.title),
    h('p', { class: 'meta' }, m.goal),
    h('span', { class: 'meta' }, mMeta(m)),
    p && p.status === 'done' ? h('span', { class: 'pill done' }, 'خلصتها - ' + p.best_score + '%')
      : p ? h('span', { class: 'pill doing' }, 'جاري') : null);
}

function NextMissionCard(m, reason) {
  return h('div', { class: 'cont' },
    h('div', { class: 'cont-info' },
      h('span', { class: 'tag' }, 'المهمة المقترحة ليك'),
      h('h3', null, m.title),
      h('p', null, m.goal),
      h('span', { class: 'meta' }, (M_TRACK[m.track] || m.track) + '  -  ' + mMeta(m)),
      reason ? h('p', { class: 'adapt' }, reason) : null),
    h('a', { class: 'btn', href: '#/mission/' + m.id }, 'ابدأ المهمة'));
}

function MissionsView() {
  const body = h('div', null, h('div', { class: 'sk sk-card' }));
  const box = h('div', { class: 'missv' },
    h('h2', { class: 'sec' }, 'المهمات'),
    h('p', { class: 'meta' }, 'مهام عملية على مستواك. كل مهمة ليها هدف ووقت مقترح وتلميحات بالتدريج، وبتتصحح تلقائياً على السيرفر، والمهمة الجاية بتتحدد حسب أدائك.'),
    body);
  Promise.all([ensureMissions(true), callMissions({ action: 'next' })]).then(([ms, nx]) => {
    if (!box.isConnected) return;
    const nextM = nx.mission && ms.missions.find((m) => m.id === nx.mission.id);
    const lv = Object.entries(nx.levels || {}).filter(([, l]) => l.done > 0)
      .map(([t, l]) => h('span', { class: 'chip-s' }, (M_TRACK[t] || t) + ': ' + l.done + ' مهمة، متوسط ' + l.avg + '%'));
    const parts = [nextM ? NextMissionCard(nextM, nx.reason) : h('div', { class: 'empty' }, nx.reason || 'مفيش مهمات متاحة دلوقتي.')];
    if (lv.length) parts.push(h('div', { class: 'chips' }, lv));
    Object.keys(M_TRACK).forEach((t) => {
      const list = ms.missions.filter((m) => m.track === t);
      if (list.length) parts.push(h('section', { class: 'group' }, h('h2', { class: 'sec' }, M_TRACK[t], h('span', { class: 'count' }, String(list.length))), h('div', { class: 'grid' }, list.map(missionCard))));
    });
    body.replaceChildren(...parts);
  }).catch((e) => { if (box.isConnected) body.replaceChildren(h('div', { class: 'empty' }, 'مقدرتش أحمّل المهمات: ' + (M_ERR[e.code] || e.message))); });
  return box;
}

// ---------------------------------------------------------------- one mission
function MissionView(id) {
  const box = h('div', { class: 'missv' }, h('div', { class: 'sk sk-card' }));
  Promise.all([ensureMissions(), callMissions({ action: 'start', mission: id })]).then(([ms, st]) => {
    if (!box.isConnected) return;
    const m = ms.missions.find((x) => x.id === id);
    if (!m) throw Object.assign(new Error('not_found'), { code: 'not_found' });
    drawMission(box, m, st);
  }).catch((e) => {
    if (box.isConnected) box.replaceChildren(h('a', { class: 'btn ghost', href: '#/missions' }, 'كل المهمات'),
      h('div', { class: 'empty', style: 'margin-top:14px' }, M_ERR[e.code] || ('مقدرتش أفتح المهمة: ' + e.message)));
  });
  return box;
}

function drawMission(box, m, st) {
  let hints = st.hints || [], used = st.progress.hints_used, total = st.hints_total || 0;

  // success conditions (✓ / ✗ after each submission)
  const checks = h('ul', { class: 'mchecks' });
  const paintChecks = (res) => checks.replaceChildren(...(m.tasks || []).map((t) => {
    const r = (res || []).find((x) => x.id === t.id);
    return h('li', { class: r ? (r.ok ? 'ok' : 'bad') : '' }, h('span', { class: 'mk' }, r ? (r.ok ? '✓' : '✗') : '○'), t.text);
  }));
  paintChecks(st.progress.last_result);

  // progressive hints
  const hintList = h('ol', { class: 'hintlist' });
  const hintBtn = h('button', { class: 'btn ghost', type: 'button' }, '');
  const paintHints = () => {
    hintList.replaceChildren(...hints.map((x) => h('li', null, x)));
    const left = total - used;
    hintBtn.textContent = left > 0 ? 'اعرض تلميح (' + left + ' متبقي)' : 'مفيش تلميحات تانية';
    hintBtn.disabled = left <= 0;
  };
  hintBtn.addEventListener('click', async () => {
    hintBtn.disabled = true;
    try { const r = await callMissions({ action: 'hint', mission: m.id }); hints = r.hints; used = r.progress.hints_used; total = r.hints_total; }
    catch (e) { toast('مقدرتش أجيب التلميح، جرّب تاني.'); }
    paintHints();
  });
  paintHints();

  // workspace
  let workspace, collect;
  if (m.kind === 'html') {
    const key = 'mission.draft.' + m.id;
    let draft = ''; try { draft = localStorage.getItem(key) || ''; } catch (e) {}
    const ed = h('textarea', { class: 'in editor', spellcheck: 'false', dir: 'ltr', 'aria-label': 'محرر الكود' }, draft || m.starter || '');
    const pv = h('iframe', { class: 'preview', sandbox: '', title: 'معاينة الصفحة' });
    let tm; const upd = () => { pv.srcdoc = ed.value; try { localStorage.setItem(key, ed.value); } catch (e) {} };
    ed.addEventListener('input', () => { clearTimeout(tm); tm = setTimeout(upd, 350); });
    upd();
    workspace = h('div', { class: 'ws' }, h('div', null, h('label', { class: 'meta' }, 'الكود'), ed), h('div', null, h('label', { class: 'meta' }, 'المعاينة'), pv));
    collect = () => ({ html: ed.value });
  } else {
    const inputs = {};
    (m.fields || []).forEach((f) => {
      inputs[f.id] = h('input', { class: 'in', dir: 'ltr', inputmode: f.type === 'number' ? 'numeric' : 'text', autocomplete: 'off', 'aria-label': f.label });
    });
    const copy = h('button', { class: 'btn ghost', type: 'button', onclick: async () => {
      try { await navigator.clipboard.writeText(st.data || ''); toast('اتنسخت البيانات.'); } catch (e) { toast('انسخها بإيدك من الصندوق.'); }
    } }, 'انسخ البيانات');
    workspace = h('div', null,
      h('div', { class: 'row' }, h('b', null, 'بياناتك (مولّدة ليك إنت بس)'), copy),
      h('pre', { class: 'data', dir: 'ltr', tabindex: '0' }, st.data || ''),
      h('div', { class: 'afields' }, (m.fields || []).map((f) => h('label', { class: 'afield' }, h('span', null, f.label), inputs[f.id]))));
    collect = () => ({ answers: Object.fromEntries(Object.entries(inputs).map(([k, el]) => [k, el.value])) });
  }

  // submit + result
  const result = h('div', { class: 'mres', 'aria-live': 'polite' });
  const go = h('button', { class: 'btn', type: 'button' }, 'سلّم المهمة');
  go.addEventListener('click', async () => {
    const payload = Object.assign({ action: 'submit', mission: m.id }, collect());
    if (m.kind !== 'html' && Object.values(payload.answers).every((v) => !String(v).trim())) { toast('اكتب إجابة واحدة على الأقل.'); return; }
    go.disabled = true;
    try {
      const r = await callMissions(payload);
      paintChecks(r.checks); used = r.progress.hints_used;
      await ensureMissions(true).catch(() => {});
      touchActivity();
      showResult(r);
    } catch (e) { toast(M_ERR[e.code] || ('مقدرتش أسلّم المهمة: ' + (e.code || e.message))); }
    go.disabled = false;
  });
  function showResult(r) {
    const okN = r.checks.filter((c) => c.ok).length;
    const nm = r.next && r.next.mission && MS.missions.find((x) => x.id === r.next.mission.id);
    result.replaceChildren(...(r.passed
      ? [h('p', { class: 'qscore ok' }, 'أحسنت! خلصت المهمة بدرجة ' + r.score + '%.'),
         h('p', { class: 'meta' }, 'الدرجة بتتأثر بعدد التلميحات والمحاولات (محاولاتك: ' + r.progress.attempts + '، تلميحات: ' + r.progress.hints_used + ').'),
         nm ? NextMissionCard(nm, r.next.reason) : h('p', { class: 'meta' }, r.next && r.next.reason || ''),
         h('a', { class: 'btn ghost', href: '#/missions' }, 'كل المهمات')]
      : [h('p', { class: 'qscore bad' }, 'لسه مش كاملة: ' + okN + ' من ' + r.checks.length + ' شروط صح.'),
         h('p', { class: 'meta' }, 'راجع الشروط اللي عليها ✗. تقدر تاخد تلميح لو محتاج، وتسلّم تاني.')]));
    result.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  box.replaceChildren(
    h('a', { class: 'btn ghost', href: '#/missions' }, 'كل المهمات'),
    h('h2', { class: 'sec', style: 'margin-top:16px' }, m.title),
    h('div', { class: 'meta' }, (M_TRACK[m.track] || m.track) + '  -  ' + mMeta(m)),
    h('section', { class: 'panel' }, h('h3', null, 'الهدف'), h('p', null, m.goal), h('p', { class: 'meta' }, m.brief)),
    h('section', { class: 'panel' }, h('h3', null, 'شروط النجاح'), checks),
    h('section', { class: 'panel' }, h('h3', null, 'تلميحات'), hintList, h('p', { class: 'meta' }, 'كل تلميح بيخصم 10 نقاط من درجة المهمة.'), hintBtn),
    h('section', { class: 'panel' }, h('h3', null, 'مساحة الشغل'), workspace, h('div', { class: 'row' }, go)),
    result);
  if (st.progress.status === 'done') result.replaceChildren(h('p', { class: 'meta' }, 'خلصت المهمة دي قبل كده بدرجة ' + st.progress.best_score + '%. تقدر تسلّمها تاني للتدريب.'));
}
