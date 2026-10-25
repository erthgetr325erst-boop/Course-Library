function courseTotal(c, p) {
  if (c.kind === 'video') return 1;
  if (c.kind === 'lessons') return Array.isArray(c.lessons) ? c.lessons.length : 0;
  return (p && p.total) || 0;
}

function courseStat(c, p) {
  p = p || {};
  const w = (p.watched || []).length;
  const total = courseTotal(c, p);
  const done = total ? Math.min(w, total) : w;
  const complete = p.status === 'done' || (total > 0 && done >= total);
  const pct = complete ? 100 : total ? Math.round((done / total) * 100) : 0;
  const started = complete || done > 0 || p.status === 'doing' || !!p.last_at;
  return { total, done, pct, complete, started, active: started && !complete };
}

function dayStr(d) {
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

function streakOf(activity) {
  let n = 0;
  const d = new Date();
  if (!activity[dayStr(d)]) d.setDate(d.getDate() - 1);
  while (activity[dayStr(d)]) { n++; d.setDate(d.getDate() - 1); }
  return n;
}

function dashSummary(courses, prog, activity) {
  const ts = (p) => (p && Date.parse(p.last_at || p.updated_at || '')) || 0;
  const items = courses.filter((c) => c.approved).map((c) => ({ c, p: prog[c.id] || {}, s: courseStat(c, prog[c.id]) }));
  const active = items.filter((x) => x.s.active).sort((a, b) => ts(b.p) - ts(a.p));
  return {
    items, active,
    completed: items.filter((x) => x.s.complete),
    cont: active[0] || null,
    lessonsDone: items.reduce((n, x) => n + x.s.done, 0),
    streak: streakOf(activity),
  };
}

function nextLesson(c, p) {
  const w = new Set((p && p.watched) || []);
  if (c.kind === 'lessons' && Array.isArray(c.lessons)) {
    const i = c.lessons.findIndex((_, k) => !w.has(String(k)));
    return i < 0 ? null : 'الدرس الجاي: ' + (c.lessons[i].t || 'درس ' + (i + 1));
  }
  if (c.kind === 'playlist') return 'كمّل من: ' + ((p && p.last_title) || 'درس ' + (((p && p.last_pos) || 0) + 1));
  return null;
}

// ---------------------------------------------------------------- small components
function Bar(pct) {
  return h('div', { class: 'bar', role: 'progressbar', 'aria-valuemin': '0', 'aria-valuemax': '100', 'aria-valuenow': String(pct) },
    h('i', { style: 'width:' + pct + '%' }));
}

function StatCard(label, value, hint) {
  return h('div', { class: 'stat' }, h('b', null, String(value)), h('span', null, label), hint ? h('small', { class: 'meta' }, hint) : null);
}

function progressText(s) {
  if (!s.started) return 'لسه متبدأش';
  return s.total ? s.done + ' من ' + s.total + ' درس (' + s.pct + '%)' : s.done + ' درس مكتمل';
}

function ProgressCard(x) {
  const { c, s } = x;
  return h('a', { class: 'card pcard', href: '#/course/' + c.id },
    h('span', { class: 'tag' }, CAT[c.cat]),
    h('h3', null, c.title),
    Bar(s.pct),
    h('span', { class: 'meta' }, progressText(s)));
}

function ContinueCard(x) {
  const { c, p, s } = x;
  const lesson = p.last_title || (c.kind === 'playlist' ? 'درس ' + ((p.last_pos || 0) + 1) : '');
  return h('div', { class: 'cont' },
    h('div', { class: 'cont-info' },
      h('span', { class: 'tag' }, 'كمّل من حيث توقفت'),
      h('h3', null, c.title),
      lesson ? h('p', { class: 'meta' }, 'آخر درس: ' + lesson) : null,
      Bar(s.pct),
      h('span', { class: 'meta' }, progressText(s))),
    h('a', { class: 'btn', href: '#/course/' + c.id }, 'كمّل من حيث توقفت'));
}

function WeekChart(activity) {
  const days = [];
  for (let k = 6; k >= 0; k--) { const d = new Date(); d.setDate(d.getDate() - k); days.push({ d, n: activity[dayStr(d)] || 0 }); }
  const max = Math.max(1, ...days.map((x) => x.n));
  return h('div', { class: 'week', role: 'img', 'aria-label': 'نشاطك في آخر 7 أيام' },
    days.map((x) => h('div', { class: 'wcol' + (x.n ? '' : ' off') },
      h('i', { style: 'height:' + Math.max(4, Math.round((x.n / max) * 90)) + 'px', title: x.n + ' نشاط' }),
      h('small', null, x.d.toLocaleDateString('ar-EG', { weekday: 'short' })))));
}

function TasksPanel(active) {
  if (!active.length) return h('p', { class: 'meta' }, 'مفيش مهام متبقية دلوقتي. ابدأ كورس جديد من «مقترح ليك».');
  return h('ul', { class: 'tasks' }, active.slice(0, 6).map((x) => {
    const left = x.s.total ? x.s.total - x.s.done : 0;
    const nxt = nextLesson(x.c, x.p);
    return h('li', { class: 'task' },
      h('a', { href: '#/course/' + x.c.id }, x.c.title),
      h('p', null, (left ? 'متبقي ' + left + ' درس' : 'كمّل الدروس') + (nxt ? ' - ' + nxt : '')));
  }));
}

function SkillsPanel(items) {
  const rows = CATS.map(([id, name]) => {
    const inCat = items.filter((x) => x.c.cat === id);
    return { name, total: inCat.length, done: inCat.filter((x) => x.s.complete), started: inCat.some((x) => x.s.started) };
  }).filter((r) => r.started);
  if (!rows.length) return h('p', { class: 'meta' }, 'كمّل أول كورس عشان تظهر مهاراتك هنا.');
  return h('div', null, rows.map((r) => h('div', { class: 'skill' },
    h('div', { class: 'skill-head' }, h('b', null, r.name), h('span', { class: 'meta' }, r.done.length + ' من ' + r.total + ' كورس')),
    Bar(Math.round((r.done.length / r.total) * 100)),
    r.done.length ? h('div', { class: 'chips' }, r.done.map((x) => h('span', { class: 'chip-s' }, x.c.title))) : null)));
}

function SuggestPanel(items, focusCat) {
  const pick = items.filter((x) => !x.s.started)
    .sort((a, b) => (b.c.cat === focusCat) - (a.c.cat === focusCat)).slice(0, 3);
  if (!pick.length) return null;
  return h('section', { class: 'panel' }, h('h3', null, 'مقترح ليك'), h('div', { class: 'grid' }, pick.map(ProgressCard)));
}

// ---------------------------------------------------------------- the page
function DashboardView() {
  const sum = dashSummary(courses, prog, activity);
  const name = me && me.email ? me.email.split('@')[0] : '';
  const box = h('div', { class: 'dash' },
    h('div', null, h('h2', { class: 'sec' }, 'لوحتي'), h('p', { class: 'meta' }, 'أهلاً ' + name + '، دي صورة تقدمك في التعلّم.')));

  if (!sum.items.some((x) => x.s.started)) {
    box.append(h('div', { class: 'empty' }, 'لسه ممشيتش في أي كورس. افتح كورس واعلّم الدروس اللي بتخلصها، وتقدمك هيظهر هنا. ',
      h('a', { class: 'btn', href: '#/' }, 'تصفّح الكورسات')));
  } else {
    if (sum.cont) box.append(ContinueCard(sum.cont));
    box.append(h('div', { class: 'stats4' },
      StatCard('درس مكتمل', sum.lessonsDone),
      StatCard('كورس خلصته', sum.completed.length),
      StatCard('كورس جاري', sum.active.length),
      StatCard('يوم متتالي', sum.streak, sum.streak ? 'كمّل النهارده عشان تحافظ عليه' : 'ابدأ النهارده')));
    box.append(h('div', { class: 'two' },
      h('section', { class: 'panel' }, h('h3', null, 'كورساتك الجارية'),
        sum.active.length ? h('div', { class: 'grid' }, sum.active.slice(0, 4).map(ProgressCard)) : h('p', { class: 'meta' }, 'مفيش كورسات جارية.')),
      h('section', { class: 'panel' }, h('h3', null, 'المهام المتبقية'), TasksPanel(sum.active))));
    box.append(h('div', { class: 'two' },
      h('section', { class: 'panel' }, h('h3', null, 'نشاطك آخر 7 أيام'), WeekChart(activity)),
      h('section', { class: 'panel' }, h('h3', null, 'المهارات اللي أتقنتها'), SkillsPanel(sum.items))));
  }
  const sg = SuggestPanel(sum.items, sum.cont ? sum.cont.c.cat : (sum.completed[0] || {}).c && sum.completed[0].c.cat);
  if (sg) box.append(sg);
  return box;
}
