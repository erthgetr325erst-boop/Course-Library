const TG_KIND = { video: 'فيديو', round: 'فيديو دائري', photo: 'صورة', document: 'ملف', audio: 'صوت', text: 'نص' };
const TG_ERR = {
  admin_only: 'الصفحة دي للأدمن بس.',
  bad_channel: 'اسم القناة مش صحيح. اكتبه من غير @ (مثال: my_channel).',
  no_public_posts: 'مفيش منشورات عامة ظاهرة. تأكد إن القناة عامة (ليها يوزر) وإن معاينتها على الويب شغّالة.',
  channel_not_found: 'القناة مش موجودة.',
  rate_limited: 'تليجرام طلب منّا نستنى شوية. جرّب تاني بعد دقيقة.',
  telegram_unreachable: 'مقدرتش أوصل لتليجرام دلوقتي. جرّب بعد شوية.',
};
const TGI = { channel: '', title: '', posts: [], sel: new Set(), next: null, all: false };

async function callTg(body) {
  const { data, error } = await sb.functions.invoke('tg', { body });
  if (error) {
    let code = '';
    try { code = (await error.context.json()).error; } catch (e) {}
    const err = new Error(code || 'network'); err.code = code; throw err;
  }
  return data;
}

// ---------------------------------------------------------------- small pure helpers
function tgChannelName(raw) {
  let s = String(raw || '').trim();
  s = s.replace(/^https?:\/\//i, '').replace(/^(www\.)?(t|telegram)\.me\//i, '').replace(/^s\//, '').replace(/^@/, '');
  s = s.split(/[/?#]/)[0];
  return /^[A-Za-z][A-Za-z0-9_]{3,31}$/.test(s) ? s : '';
}
function tgTitle(p, i) {
  const first = String(p.text || '').split('\n').map((x) => x.trim()).find(Boolean) || '';
  const t = first.replace(/https?:\/\/\S+/g, '').replace(/#[^\s#]+/g, '').replace(/\s+/g, ' ').trim().slice(0, 80);
  return t || (p.file ? p.file.replace(/\.[^.]+$/, '') : 'درس ' + (i + 1));
}
const tgIsVideo = (p) => p.kind === 'video' || p.kind === 'round';
// hashtags that tag at least 2 videos are suggested as ready-made courses
function tgTagGroups(posts) {
  const m = {};
  posts.filter(tgIsVideo).forEach((p) => (String(p.text || '').match(/#[^\s#]+/g) || []).forEach((t) => { (m[t] = m[t] || []).push(p.id); }));
  return Object.entries(m).filter(([, ids]) => ids.length >= 2).sort((a, b) => b[1].length - a[1].length).slice(0, 12);
}
function tgOkUrl(u) {
  try { const x = new URL(u); return x.protocol === 'https:' && /(^|\.)(telesco\.pe|cdn-telegram\.org|telegram\.org|t\.me)$/i.test(x.hostname); } catch (e) { return false; }
}

// ---------------------------------------------------------------- player
// progress hooks for any native <video>: resume position, periodic position saves, completion on end
function hookVideo(v, opts) {
  opts = opts || {};
  let last = 0;
  v.addEventListener('loadedmetadata', () => {
    if (opts.start > 5 && isFinite(v.duration) && opts.start < v.duration - 10) v.currentTime = opts.start;
  });
  v.addEventListener('ended', () => { if (opts.onEnded) opts.onEnded(); });
  v.addEventListener('timeupdate', () => {
    if (opts.onTime && Math.abs(v.currentTime - last) >= 30) { last = v.currentTime; opts.onTime(Math.floor(v.currentTime)); }
  });
  v.addEventListener('pause', () => { if (opts.onTime && !v.ended) opts.onTime(Math.floor(v.currentTime)); });
  return v;
}

const tgCache = {};
function tgMedia(post) {
  if (!tgCache[post]) tgCache[post] = callTg({ action: 'media', post }).catch(() => ({ src: null }));
  return tgCache[post];
}

// Telegram's own embed widget: always works for public posts, but cannot report progress
function tgWidgetNodes(s) {
  const sc = document.createElement('script');
  sc.async = true;
  sc.src = 'https://telegram.org/js/telegram-widget.js?22';
  sc.setAttribute('data-telegram-post', s);
  sc.setAttribute('data-width', '100%');
  if (window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches) sc.setAttribute('data-dark', '1');
  return [sc, h('p', { class: 'meta' }, 'لو الفيديو مش بيشتغل هنا: ',
    h('a', { href: 'https://t.me/' + s, target: '_blank', rel: 'noopener noreferrer' }, 'افتح البوست في تليجرام'))];
}

function TelegramPlayer(l, opts) {
  const s = String((l && l.s) || '');
  if (!/^[A-Za-z]\w{3,31}\/\d+$/.test(s)) return h('span', null, 'الفيديو ده مش متاح.');
  const box = h('div', { class: 'tgbox tgnative' }, h('div', { class: 'tgload meta' }, 'جاري تجهيز الفيديو...'));
  const widget = () => box.replaceChildren(...tgWidgetNodes(s));
  tgMedia(s).then((m) => {
    if (!m || !m.src || !tgOkUrl(m.src)) return widget();
    const v = h('video', { controls: '', playsinline: '', preload: 'metadata', src: m.src, poster: m.poster && tgOkUrl(m.poster) ? m.poster : null });
    hookVideo(v, opts);
    v.addEventListener('error', () => { delete tgCache[s]; widget(); });   // expired or blocked link: use the official widget
    box.replaceChildren(v, h('p', { class: 'meta' }, 'لو الفيديو مش بيتحمّل: ',
      h('a', { href: 'https://t.me/' + s, target: '_blank', rel: 'noopener noreferrer' }, 'افتح البوست في تليجرام')));
  });
  return box;
}

// ---------------------------------------------------------------- admin page: import a channel as a course
function ImportView() {
  const box = h('div', { class: 'imp' },
    h('h2', { class: 'sec' }, 'استيراد كورسات من قناة تليجرام'),
    h('p', { class: 'meta' }, 'اكتب اسم قناتك العامة، واجلب منشوراتها، واختار الفيديوهات اللي هتكوّن الكورس. الدروس بتتشغّل بعد كده جوه المنصة.'));
  if (!isAdmin) { box.append(h('div', { class: 'empty' }, 'الصفحة دي للأدمن بس.')); return box; }

  const chIn = h('input', { class: 'in', dir: 'ltr', placeholder: 'اسم القناة، مثال: my_channel', 'aria-label': 'اسم القناة',
    value: TGI.channel || ((window.CYBERLEARN || {}).TG_CHANNEL || '') });
  const status = h('p', { class: 'meta', role: 'status' }, '');
  const fetchBtn = h('button', { class: 'btn', type: 'button' }, 'اجلب المنشورات');
  const moreBtn = h('button', { class: 'btn ghost', type: 'button', hidden: '' }, 'حمّل منشورات أقدم');
  const chips = h('div', { class: 'chips' });
  const listEl = h('div', { class: 'tglist' });
  const count = h('span', { class: 'meta' }, '');
  const allCb = h('input', { type: 'checkbox' });
  const titleIn = h('input', { class: 'in', placeholder: 'اسم الكورس', maxlength: '120', 'aria-label': 'اسم الكورس' });
  const catSel = h('select', { class: 'in', 'aria-label': 'التصنيف' }, CATS.map(([id, name]) => h('option', { value: id }, name)));
  const descIn = h('textarea', { class: 'in', maxlength: '600', placeholder: 'وصف قصير (اختياري)', style: 'min-height:70px' });
  const createBtn = h('button', { class: 'btn', type: 'button' }, 'أنشئ الكورس من المختار');
  const panel = h('section', { class: 'panel', hidden: '' },
    h('div', { class: 'row' }, count, h('button', { class: 'btn ghost', type: 'button', onclick: () => { TGI.posts.filter((p) => tgIsVideo(p)).forEach((p) => TGI.sel.add(p.id)); redraw(); } }, 'اختار كل الفيديوهات'),
      h('button', { class: 'btn ghost', type: 'button', onclick: () => { TGI.sel.clear(); redraw(); } }, 'امسح الاختيار'),
      h('label', { class: 'meta' }, allCb, ' إظهار كل المنشورات (مش الفيديوهات بس)')),
    chips, listEl,
    h('div', { class: 'imp-form' }, titleIn, catSel, descIn, createBtn));
  box.append(h('div', { class: 'row' }, chIn, fetchBtn), status, panel, h('div', { class: 'row' }, moreBtn));

  allCb.checked = TGI.all;
  allCb.addEventListener('change', () => { TGI.all = allCb.checked; redraw(); });

  function updateCount() { count.textContent = TGI.sel.size + ' مختار'; }

  function row(p) {
    const cb = h('input', { type: 'checkbox', 'aria-label': 'اختيار المنشور' });
    cb.checked = TGI.sel.has(p.id);
    cb.addEventListener('change', () => { if (cb.checked) TGI.sel.add(p.id); else TGI.sel.delete(p.id); updateCount(); });
    const when = p.date ? new Date(p.date).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' }) : '';
    return h('label', { class: 'tgrow' + (tgIsVideo(p) ? '' : ' dim') }, cb,
      p.thumb && tgOkUrl(p.thumb) ? h('img', { src: p.thumb, alt: '', loading: 'lazy', width: '64', height: '36' }) : h('span', { class: 'ph' }, '#'),
      h('span', { class: 'tgt' }, h('b', null, tgTitle(p, 0)),
        h('small', { class: 'meta' }, [TG_KIND[p.kind] || p.kind, p.duration, p.size, when, '#' + p.id].filter(Boolean).join(' - '))));
  }

  function redraw() {
    panel.hidden = !TGI.posts.length;
    moreBtn.hidden = !TGI.next;
    const shown = TGI.all ? TGI.posts : TGI.posts.filter(tgIsVideo);
    listEl.replaceChildren(...(shown.length ? shown.map(row) : [h('p', { class: 'meta' }, 'مفيش فيديوهات في المنشورات اللي اتجلبت. فعّل «إظهار كل المنشورات» أو حمّل منشورات أقدم.')]));
    chips.replaceChildren(...tgTagGroups(TGI.posts).map(([tag, ids]) => h('button', { class: 'chip-s tagchip', type: 'button',
      onclick: () => { TGI.sel = new Set(ids); titleIn.value = tag.slice(1).replace(/_/g, ' '); redraw(); } }, tag + ' (' + ids.length + ')')));
    if (chips.children.length) chips.prepend(h('span', { class: 'meta' }, 'اقتراحات حسب الهاشتاج: '));
    updateCount();
  }

  async function load(more) {
    const ch = tgChannelName(chIn.value);
    if (!ch) { status.textContent = TG_ERR.bad_channel; return; }
    if (!more || ch !== TGI.channel) { TGI.posts = []; TGI.sel = new Set(); TGI.next = null; }
    TGI.channel = ch;
    fetchBtn.disabled = moreBtn.disabled = true;
    status.textContent = 'جاري الجلب من تليجرام...';
    try {
      const r = await callTg({ action: 'channel', channel: ch, before: more ? TGI.next : null, pages: 2 });
      TGI.title = r.title || ch;
      const have = new Set(TGI.posts.map((p) => p.id));
      TGI.posts = TGI.posts.concat(r.posts.filter((p) => !have.has(p.id))).sort((a, b) => b.id - a.id);
      TGI.next = r.next_before;
      const vids = TGI.posts.filter(tgIsVideo).length;
      status.textContent = 'اتجلب ' + TGI.posts.length + ' منشور (' + vids + ' فيديو) من «' + TGI.title + '».';
    } catch (e) {
      status.textContent = TG_ERR[e.code] || ('حصل خطأ: ' + e.message);
    }
    fetchBtn.disabled = moreBtn.disabled = false;
    redraw();
  }

  async function create() {
    const chosen = TGI.posts.filter((p) => TGI.sel.has(p.id)).sort((a, b) => a.id - b.id);
    const title = titleIn.value.trim();
    if (!chosen.length) return toast('اختار منشور واحد على الأقل');
    if (title.length < 2) return toast('اكتب اسم الكورس');
    if (chosen.length > 300) return toast('الحد الأقصى 300 درس في الكورس.');
    createBtn.disabled = true;
    const lessons = chosen.map((p, i) => ({ t: tgTitle(p, i), p: 'telegram', s: TGI.channel + '/' + p.id }));
    const { data, error } = await sb.from('courses').insert({
      title, description: descIn.value.trim(), cat: catSel.value, kind: 'lessons', yt: null, lessons, approved: true,
    }).select('id').single();
    createBtn.disabled = false;
    if (error) return toast(error.message);
    toast('اتضاف الكورس بـ ' + lessons.length + ' درس.');
    TGI.sel = new Set();
    await loadAll();
    location.hash = '#/course/' + data.id;
  }

  fetchBtn.addEventListener('click', () => load(false));
  moreBtn.addEventListener('click', () => load(true));
  chIn.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); load(false); } });
  createBtn.addEventListener('click', create);
  if (TGI.posts.length) { status.textContent = 'اتجلب ' + TGI.posts.length + ' منشور من «' + TGI.title + '».'; redraw(); }
  return box;
}
