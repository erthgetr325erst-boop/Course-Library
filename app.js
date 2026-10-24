const CATS = [
  ['dev', 'برمجة وتطوير'], ['design', 'تصميم وجرافيك'], ['security', 'الأمن السيبراني والشبكات'],
  ['data', 'بيانات وذكاء اصطناعي'], ['biz', 'أعمال وإدارة وتسويق'], ['lang', 'لغات'],
  ['science', 'علوم ورياضيات'], ['self', 'تطوير الذات ومهارات'], ['other', 'أخرى'],
];
const CAT = Object.fromEntries(CATS);

// ---------------------------------------------------------------- learning roadmaps (edit freely)
const LV = { b: 'مبتدئ', m: 'متوسط', a: 'متقدم' };
const S = (t, d, k) => ({ t, d, k });
const ROADMAPS = {
  dev: { intro: 'ترتيب مقترح للمبتدئ. خد كل خطوة لحد ما تحس إنك فاهمها وطبّقتها، وبعدين كمّل.', steps: [
    S('أساسيات البرمجة', 'متغيرات وشروط وتكرار ودوال، على لغة واحدة سهلة زي Python أو JavaScript.', 'b'),
    S('التفكير وحل المشكلات', 'خوارزميات وهياكل بيانات بسيطة: قوائم وقواميس وترتيب وبحث.', 'b'),
    S('الأدوات الأساسية', 'سطر الأوامر وGit وGitHub عشان تتابع شغلك وتشتغل مع فريق.', 'b'),
    S('اختار مسارك', 'ويب (HTML وCSS وJavaScript ثم إطار زي React)، أو باك إند وAPIs، أو تطبيقات موبايل.', 'm'),
    S('قواعد البيانات', 'SQL وتصميم الجداول، وإزاي التطبيق بيخزّن البيانات ويقراها.', 'm'),
    S('ابني مشاريع حقيقية', '3 مشاريع صغيرة تكبر تدريجياً، وارفعها على GitHub.', 'm'),
    S('الجودة والنشر', 'اختبارات آلية وCI/CD ونشر المشروع على سيرفر أو سحابة.', 'a')] },
  design: { intro: 'التصميم بيتعلّم بالتطبيق: اعمل تصميم صغير في كل خطوة قبل ما تعدّي للي بعدها.', steps: [
    S('أساسيات التصميم', 'التكوين والتباعد والتسلسل البصري، وإزاي العين بتقرا الصفحة.', 'b'),
    S('الألوان والخطوط', 'نظرية الألوان، واختيار خطوط وتوليفات مريحة وقابلة للقراءة.', 'b'),
    S('أداة واحدة كويس', 'Figma للواجهات، أو Photoshop وIllustrator للجرافيك. اتقن واحدة قبل ما تنتقل.', 'b'),
    S('الهوية البصرية', 'لوجو وألوان وخطوط تتجمع في نظام متكامل لمشروع واحد.', 'm'),
    S('تصميم الواجهات وتجربة المستخدم', 'UI وUX، رسم هيكلي ونماذج تفاعلية، وتصميم للموبايل والويب.', 'm'),
    S('الحركة والفيديو', 'موشن جرافيك ومونتاج بسيط لو عايز تتخصص أكتر.', 'a'),
    S('ملف الأعمال', 'اجمع أحسن 5 مشاريع في معرض أعمال واعرضه على منصات التصميم.', 'a')] },
  security: { intro: 'اتعلّم الأساس الأول وبعدها اختار تخصصك. جرّب دايماً على أجهزتك إنت أو في معامل تدريب قانونية.', steps: [
    S('أساسيات الشبكات', 'TCP/IP وDNS وHTTP والمنافذ، وإزاي الأجهزة بتتكلم مع بعض.', 'b'),
    S('لينكس وسطر الأوامر', 'التنقل والصلاحيات والعمليات والنصوص، لأن أغلب الأدوات شغالة عليه.', 'b'),
    S('أساسيات الأمن', 'السرية والسلامة والتوافر، والتشفير والتجزئة، والمصادقة، وأنواع الهجمات.', 'b'),
    S('برمجة للأتمتة', 'Python وBash لكتابة أدوات وسكريبتات صغيرة.', 'm'),
    S('اختار تخصصك', 'أمن الويب (OWASP)، اختبار الاختراق، الدفاع وSOC، التحقيق الجنائي، أو أمن السحابة.', 'm'),
    S('تدريب عملي قانوني', 'معامل افتراضية ومنصات CTF وبيئات تدريب، وأجهزتك إنت بس.', 'm'),
    S('الشهادات والتخصص', 'ابدأ بشهادة زي Security+ وبعدها شهادة حسب تخصصك.', 'a')] },
  data: { intro: 'الأساس هنا رياضيات وبرمجة، وبعدها تدرّج من التحليل لحد تعلّم الآلة.', steps: [
    S('رياضيات وإحصاء', 'احتمالات وإحصاء وصفي وجبر خطي بسيط.', 'b'),
    S('Python لتحليل البيانات', 'pandas وNumPy، وقراءة البيانات وتنضيفها.', 'b'),
    S('SQL', 'استخراج وتجميع البيانات من قواعد البيانات.', 'b'),
    S('التمثيل البصري والتقارير', 'رسوم بيانية ولوحات تحكم (Power BI أو Tableau) وحكاية قصة من الأرقام.', 'm'),
    S('تعلّم الآلة', 'الانحدار والتصنيف وتقييم النماذج بمكتبة scikit-learn.', 'm'),
    S('التعلّم العميق والذكاء الاصطناعي', 'الشبكات العصبية ومعالجة اللغة والنماذج اللغوية.', 'a'),
    S('مشاريع ونشر النماذج', 'مشاريع كاملة من البيانات للنموذج للنشر، وإدارة دورة حياة النموذج.', 'a')] },
  biz: { intro: 'ابدأ بالفهم العام للأعمال، وبعدها اتخصص في المجال اللي يناسبك.', steps: [
    S('أساسيات الأعمال والاقتصاد', 'إزاي الشركات بتكسب، والعرض والطلب، وأساسيات السوق.', 'b'),
    S('إدارة الوقت والمشاريع', 'تنظيم المهام والأولويات، ومنهجيات زي Agile وKanban.', 'b'),
    S('التسويق الرقمي', 'المحتوى وSEO والسوشيال ميديا والإعلانات المدفوعة وقياس النتائج.', 'm'),
    S('المبيعات والتفاوض', 'فهم العميل وعرض القيمة وإغلاق الصفقات.', 'm'),
    S('المحاسبة والمالية الأساسية', 'القوائم المالية والتدفق النقدي وتسعير المنتجات.', 'm'),
    S('ريادة الأعمال', 'نموذج العمل واختبار الفكرة قبل الاستثمار وخطة التشغيل.', 'a'),
    S('القيادة وبناء الفريق', 'إدارة الناس والتفويض والتحفيز واتخاذ القرار.', 'a')] },
  lang: { intro: 'اللغة بتتعلّم بالممارسة اليومية القصيرة أكتر من الجلسات الطويلة المتقطعة.', steps: [
    S('حدد هدفك ومستواك', 'اعرف مستواك الحالي واكتب هدف واضح ومدة، زي محادثة بسيطة بعد 3 شهور.', 'b'),
    S('النطق والمفردات الأساسية', 'أهم 500 كلمة وأصوات اللغة وطريقة نطقها الصحيحة.', 'b'),
    S('جمل وقواعد يومية', 'تركيب الجملة والأزمنة الأساسية بأمثلة من الحياة اليومية.', 'b'),
    S('الاستماع كل يوم', 'فيديوهات وبودكاست بسيطة، وكرر الجمل بصوت عالي مع المتحدث.', 'm'),
    S('القراءة والكتابة', 'قصص قصيرة ومقالات، واكتب يوميات بسيطة وصحّحها.', 'm'),
    S('المحادثة', 'تكلّم مع ناس أو شريك لغة بانتظام، حتى لو بتغلط.', 'm'),
    S('المستوى المتقدم والاختبار المعتمد', 'محتوى متخصص، واختبار معتمد زي IELTS لو محتاج شهادة.', 'a')] },
  science: { intro: 'العلوم بتبني على بعض، فمتعديش خطوة قبل ما تحل فيها تمارين كفاية.', steps: [
    S('رياضيات الأساسيات', 'الحساب والجبر والهندسة وحل المسائل خطوة بخطوة.', 'b'),
    S('فيزياء أساسية', 'الحركة والقوة والطاقة، والربط بين القانون والظاهرة.', 'b'),
    S('كيمياء وأحياء حسب اهتمامك', 'المفاهيم الأساسية قبل التفاصيل والحفظ.', 'b'),
    S('التفاضل والتكامل', 'النهايات والمشتقات والتكامل وتطبيقاتها.', 'm'),
    S('الجبر الخطي والإحصاء', 'المصفوفات والاحتمالات، وهي أساس أغلب العلوم الحديثة.', 'm'),
    S('تمرين يومي', 'حل مسائل كل يوم وراجع أخطاءك، ده أهم من كتر الفيديوهات.', 'm'),
    S('موضوعات متقدمة وبحث', 'اختار فرع تتعمق فيه، واقرا أبحاث وجرّب مشروع صغير.', 'a')] },
  self: { intro: 'الخطوات دي بتتعلم بالتطبيق اليومي. اختار عادة واحدة وابدأ بيها النهاردة.', steps: [
    S('حدد أهدافك', 'اكتب أهداف واضحة وقابلة للقياس بتواريخ، وقسّمها لخطوات صغيرة.', 'b'),
    S('إدارة الوقت والتركيز', 'ترتيب الأولويات، وتقليل المشتتات، وتخصيص وقت ثابت للشغل المهم.', 'b'),
    S('التعلّم الفعّال', 'تلخيص بأسلوبك، ومراجعة متباعدة، وتطبيق اللي اتعلمته.', 'b'),
    S('التواصل والعرض', 'الكلام بوضوح، والإنصات، وتقديم فكرتك قدام ناس.', 'm'),
    S('التفكير النقدي وحل المشكلات', 'تحليل المشكلة وتقييم الخيارات واتخاذ قرار.', 'm'),
    S('الذكاء العاطفي والقيادة', 'فهم مشاعرك ومشاعر غيرك، وإدارة الخلافات وتحفيز الفريق.', 'a'),
    S('التوازن والصحة', 'نوم ورياضة وراحة نفسية، عشان الأداء يفضل مستمر.', 'a')] },
};
const STATUS = { todo: 'لم يبدأ', doing: 'جاري', done: 'خلصته' };
const HUE = { fund: 190, net: 215, linux: 40, web: 275, pen: 350, blue: 150, dfir: 25, cert: 55 };
const RE_ID = /^[A-Za-z0-9_-]{11}$/;
const MAX_UPLOAD = 50 * 1024 * 1024;
const $ = (s) => document.querySelector(s);

// ---------------------------------------------------------------- motion helpers
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduceMotion) document.documentElement.classList.add('anim');
if ((navigator.deviceMemory && navigator.deviceMemory <= 4) || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4)) document.documentElement.classList.add('lite');
let loading = false, routed = false, revealIO = null;

function reveal(root) {
  if (reduceMotion) return;
  if (!revealIO) revealIO = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    revealIO.unobserve(e.target);
    e.target.classList.add('in');
    setTimeout(() => e.target.classList.remove('rv', 'in'), 1000);
  }), { threshold: 0.08 });
  root.querySelectorAll('.rv:not([data-rv])').forEach((el) => { el.dataset.rv = '1'; revealIO.observe(el); });
}

function skeletonView() {
  return h('div', { 'aria-busy': 'true' }, h('div', { class: 'sk sk-h' }),
    h('div', { class: 'grid' }, Array.from({ length: 6 }, () => h('div', { class: 'sk sk-card' }))));
}

const cfg = window.CYBERLEARN || {};
const configured = cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY && !/YOUR-/.test(cfg.SUPABASE_URL + cfg.SUPABASE_ANON_KEY);
const sb = configured ? window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY, { auth: { flowType: 'pkce' } }) : null;

let me = null, isAdmin = false, courses = [], prog = {};
let filter = 'all', query = '', openId = null, authMode = 'in', confirmDel = false, noteTimer, cleanup = null;
let activity = {}, view = 'home', pathId = null, lastTouch = 0, courseUi = {};
const soonTimers = {};

function h(tag, props, ...kids) {
  const e = document.createElement(tag);
  for (const k in props || {}) {
    const v = props[k];
    if (k === 'class') e.className = v;
    else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
    else if (v !== false && v != null) e.setAttribute(k, v);
  }
  kids.flat().filter((c) => c != null && c !== false).forEach((c) => e.append(c));
  return e;
}
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg; t.style.display = 'block';
  clearTimeout(toast.t); toast.t = setTimeout(() => (t.style.display = 'none'), 3500);
}

// ---------------------------------------------------------------- links from any platform
function parseLink(raw) {
  raw = (raw || '').trim();
  let u;
  try { u = new URL(raw); } catch (e) { return RE_ID.test(raw) ? { p: 'youtube', s: raw } : null; }
  if (u.protocol !== 'https:' && u.protocol !== 'http:') return null;
  const host = u.hostname.replace(/^www\./, '').toLowerCase();
  if (['youtube.com', 'm.youtube.com', 'music.youtube.com', 'youtu.be'].includes(host)) {
    const list = u.searchParams.get('list');
    let v = u.searchParams.get('v');
    if (!v && host === 'youtu.be') v = u.pathname.slice(1);
    if (!v) { const m = u.pathname.match(/^\/(?:shorts|embed|live)\/([\w-]{11})/); if (m) v = m[1]; }
    if (list && /^[\w-]{11,64}$/.test(list)) return { p: 'youtube', list, s: v && RE_ID.test(v) ? v : null };
    if (v && RE_ID.test(v)) return { p: 'youtube', s: v };
    return null;
  }
  if (host === 'vimeo.com' || host === 'player.vimeo.com') {
    const m = u.pathname.match(/(\d{5,})/); return m ? { p: 'vimeo', s: m[1] } : null;
  }
  if (host === 'dailymotion.com' || host === 'dai.ly') {
    const m = u.pathname.replace(/^\/video\//, '/').match(/^\/?([a-z0-9]{5,10})/i);
    return m ? { p: 'dailymotion', s: m[1] } : null;
  }
  if (host === 't.me' || host === 'telegram.me' || host === 'telegram.dog') {
    if (/^\/c\/\d+\/\d+/.test(u.pathname)) return { p: 'tgprivate' };
    const m = u.pathname.match(/^\/(?:s\/)?([A-Za-z]\w{3,31})\/(\d+)\/?$/);
    return m ? { p: 'telegram', s: m[1] + '/' + m[2] } : null;
  }
  if (host === 'drive.google.com') {
    const m = u.pathname.match(/\/file\/d\/([\w-]+)/); return m ? { p: 'drive', s: m[1] } : null;
  }
  if (u.protocol === 'https:' && /\.(mp4|webm|ogg|m4v)$/i.test(u.pathname)) return { p: 'file', s: u.href };
  if (u.protocol === 'https:') return { p: 'embed', s: u.href };
  return null;
}

// Re-validated at render time: never trust stored values.
function lessonSrc(l) {
  const s = String((l && l.s) || '');
  switch (l && l.p) {
    case 'youtube': return RE_ID.test(s) ? 'https://www.youtube.com/embed/' + s + '?rel=0' : null;
    case 'vimeo': return /^\d{5,}$/.test(s) ? 'https://player.vimeo.com/video/' + s : null;
    case 'dailymotion': return /^[a-z0-9]{5,10}$/i.test(s) ? 'https://www.dailymotion.com/embed/video/' + s : null;
    case 'drive': return /^[\w-]+$/.test(s) ? 'https://drive.google.com/file/d/' + s + '/preview' : null;
    case 'telegram': return /^[A-Za-z]\w{3,31}\/\d+$/.test(s)
      ? 'https://t.me/' + s + '?embed=1&mode=tme' + (window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? '&dark=1' : '') : null;
    case 'embed': return /^https:\/\//i.test(s) ? s : null;
  }
  return null;
}
const ALLOW = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen; web-share';

function renderLesson(l) {
  if (l && l.p === 'telegram') {
    // Official Telegram post widget: handles sizing and playback inside the page.
    const s = String(l.s || '');
    if (!/^[A-Za-z]\w{3,31}\/\d+$/.test(s)) return h('span', null, 'الفيديو ده مش متاح.');
    const sc = document.createElement('script');
    sc.async = true;
    sc.src = 'https://telegram.org/js/telegram-widget.js?22';
    sc.setAttribute('data-telegram-post', s);
    sc.setAttribute('data-width', '100%');
    if (window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches) sc.setAttribute('data-dark', '1');
    return h('div', { class: 'tgbox' }, sc, h('p', { class: 'meta' }, 'لو الفيديو مش بيشتغل هنا: ',
      h('a', { href: 'https://t.me/' + s, target: '_blank', rel: 'noopener noreferrer' }, 'افتح البوست في تليجرام')));
  }
  if (l && l.p === 'file') {
    const s = String(l.s || '');
    if (/^https:\/\/.+\.(mp4|webm|ogg|m4v)(\?.*)?$/i.test(s)) return h('video', { controls: '', preload: 'metadata', src: s });
    return h('span', null, 'الفيديو ده مش متاح.');
  }
  const src = lessonSrc(l);
  if (!src) return h('span', null, 'الفيديو ده مش متاح.');
  const p = { src, title: l.t || 'درس', allow: ALLOW, allowfullscreen: '', loading: 'lazy', referrerpolicy: 'strict-origin-when-cross-origin' };
  if (l.p === 'embed') p.sandbox = 'allow-scripts allow-same-origin allow-presentation allow-popups';
  return h('iframe', p);
}

function lessonItem(i, key, title, thumb, active, done, onPick, onToggle) {
  return h('div', { class: 'lesson' + (active ? ' on' : '') + (done ? ' done' : ''), 'data-key': key },
    h('button', { class: 'pick', type: 'button', onclick: () => onPick(i) },
      thumb ? h('img', { src: thumb, alt: '', loading: 'lazy', width: '96', height: '54' }) : h('span', { class: 'ph' }, String(i + 1)),
      h('span', { class: 'lt' }, title)),
    me ? h('button', { class: 'chk', type: 'button', title: 'علّم الدرس كمكتمل', 'aria-label': 'علّم الدرس كمكتمل',
      onclick: (e) => { e.stopPropagation(); onToggle(i); } }, '✓') : null);
}

// ---------------------------------------------------------------- YouTube playlist: pick any video
let ytApi;
function ytReady() {
  if (window.YT && window.YT.Player) return Promise.resolve();
  if (!ytApi) ytApi = new Promise((res) => {
    window.onYouTubeIframeAPIReady = res;
    const s = document.createElement('script'); s.src = 'https://www.youtube.com/iframe_api'; document.head.append(s);
  });
  return ytApi;
}
const titleCache = {};
async function ytTitle(id) {
  if (titleCache[id]) return titleCache[id];
  try {
    const r = await fetch('https://www.youtube.com/oembed?format=json&url=' + encodeURIComponent('https://www.youtube.com/watch?v=' + id));
    if (r.ok) { titleCache[id] = (await r.json()).title; return titleCache[id]; }
  } catch (e) {}
  return null;
}

function playlistWatch(c) {
  const p0 = progOf(c.id);
  const list = h('div', { class: 'lessons' }, h('div', { class: 'meta' }, 'جاري تحميل قايمة الدروس...'));
  courseUi.list = list;
  const box = h('div', { class: 'watch' }, h('div', { class: 'stage' }, h('div', { id: 'ytp' })), list);
  let player = null, io = null, dead = false, ids = [], playing = false, tick = null;
  cleanup = () => { dead = true; clearInterval(tick); if (io) io.disconnect(); try { player && player.destroy(); } catch (e) {} };

  const here = () => { let i = -1, sec = 0; try { i = player.getPlaylistIndex(); sec = Math.floor(player.getCurrentTime() || 0); } catch (e) {} return { i, sec }; };
  const remember = (i, sec) => {
    if (!me || i < 0 || !ids[i]) return;
    saveProgSoon(c.id, { last_key: ids[i], last_title: titleCache[ids[i]] || 'درس ' + (i + 1), last_pos: i, last_sec: sec, last_at: new Date().toISOString() });
  };

  ytReady().then(() => {
    if (dead) return;
    const vars = { listType: 'playlist', list: c.yt, rel: 0 };
    if (me && p0.last_pos) vars.index = p0.last_pos;   // resume where the student stopped
    if (me && p0.last_sec) vars.start = p0.last_sec;
    player = new window.YT.Player('ytp', {
      width: '100%', height: '100%', playerVars: vars,
      events: {
        onReady: () => fill(0),
        onStateChange: (e) => {
          if (!ids.length) fill(12);
          const { i, sec } = here();
          list.querySelectorAll('.lesson').forEach((b, k) => b.classList.toggle('on', k === i));
          playing = e.data === 1;
          if (e.data === 0 && ids[i]) { setDone(c, ids[i], true); remember(i, 0); }
          else if (e.data === 1 || e.data === 2) { remember(i, sec); touchActivity(); }
        },
      },
    });
    tick = setInterval(() => { if (playing) { const { i, sec } = here(); remember(i, sec); touchActivity(); } }, 30000);
  });

  function fill(tries) {
    if (dead || list.dataset.filled) return;
    try { ids = player.getPlaylist() || []; } catch (e) { ids = []; }
    if (!ids.length) {
      if (tries < 12) return setTimeout(() => fill(tries + 1), 700);
      list.textContent = 'اضغط تشغيل على الفيديو عشان تظهر قايمة الدروس.'; return;
    }
    if (me && progOf(c.id).total !== ids.length) saveProg(c.id, { total: ids.length });
    list.textContent = ''; list.dataset.filled = '1';
    io = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      ytTitle(e.target.dataset.id).then((t) => { if (t && !dead) e.target.querySelector('.lt').textContent = t; });
    }), { root: list });
    const startAt = me ? Math.min(p0.last_pos || 0, ids.length - 1) : 0;
    ids.forEach((id, i) => {
      const b = lessonItem(i, id, 'درس ' + (i + 1), 'https://i.ytimg.com/vi/' + encodeURIComponent(id) + '/mqdefault.jpg', i === startAt, isDone(c, id),
        (k) => { try { player.playVideoAt(k); } catch (e) {} },
        (k) => setDone(c, ids[k], !isDone(c, ids[k])));
      b.dataset.id = id;
      list.append(b); io.observe(b);
    });
    syncLessonUi(c);
  }
  return box;
}

// ---------------------------------------------------------------- manual lessons (any platform)
function lessonsWatch(ls, c) {
  ls = ls.filter((l) => l && l.p);
  if (!ls.length) return h('div', { class: 'empty' }, 'مفيش دروس في الكورس ده.');
  const p0 = progOf(c.id);
  const start = me && (p0.last_pos || 0) < ls.length ? (p0.last_pos || 0) : 0;   // resume
  const stage = h('div', { class: 'stage' });
  const list = h('div', { class: 'lessons' });
  courseUi.list = list;
  const show = (i, silent) => {
    stage.textContent = ''; stage.className = 'stage' + (ls[i].p === 'telegram' ? ' tall' : ''); stage.append(renderLesson(ls[i]));
    list.querySelectorAll('.lesson').forEach((b, k) => b.classList.toggle('on', k === i));
    if (me && !silent) {
      saveProgSoon(c.id, { last_key: String(i), last_title: ls[i].t || 'درس ' + (i + 1), last_pos: i, last_sec: 0, last_at: new Date().toISOString() });
      touchActivity();
    }
  };
  ls.forEach((l, i) => list.append(lessonItem(i, String(i), l.t || 'درس ' + (i + 1),
    l.p === 'youtube' && RE_ID.test(String(l.s)) ? 'https://i.ytimg.com/vi/' + l.s + '/mqdefault.jpg' : null,
    i === start, isDone(c, String(i)), (k) => show(k), (k) => setDone(c, String(k), !isDone(c, String(k))))));
  show(start, true);
  if (ls.length === 1) {
    const one = h('button', { class: 'btn ghost', type: 'button', onclick: () => setDone(c, '0', !isDone(c, '0')) }, '');
    courseUi.one = one;
    return h('div', null, h('div', { class: 'watch one' }, stage), me ? h('div', { class: 'row' }, one) : null);
  }
  return h('div', { class: 'watch' }, stage, list);
}

function watchView(c) {
  if (c.kind === 'playlist') return playlistWatch(c);
  if (c.kind === 'video') return lessonsWatch([{ t: c.title, p: 'youtube', s: c.yt }], c);
  return lessonsWatch(Array.isArray(c.lessons) ? c.lessons : [], c);
}
const kindLabel = (c) => c.kind === 'playlist' ? 'بلاي ليست' : c.kind === 'video' ? 'فيديو واحد'
  : (Array.isArray(c.lessons) ? c.lessons.length : 0) + ' درس';
const ytLink = (c) => c.kind === 'playlist' ? 'https://www.youtube.com/playlist?list=' + encodeURIComponent(c.yt)
  : c.kind === 'video' ? 'https://www.youtube.com/watch?v=' + encodeURIComponent(c.yt) : null;

// ---------------------------------------------------------------- data
let loadingNow = false;
async function loadAll() {
  if (loadingNow) return;
  loadingNow = true; loading = true;
  if (!courses.length) renderMain();
  try {
    const [cr, pr, ac, ad] = await Promise.all([
      sb.from('courses').select('*').order('created_at', { ascending: false }),
      me ? sb.from('progress').select('*') : null,
      me ? sb.from('activity').select('day,events').order('day', { ascending: false }).limit(60) : null,
      me ? sb.from('admins').select('user_id').eq('user_id', me.id) : null,
    ]);
    if (cr.error) toast('مقدرتش أحمّل الكورسات: ' + cr.error.message);
    courses = cr.data || [];
    prog = {}; activity = {};
    if (pr) (pr.data || []).forEach((r) => (prog[r.course_id] = r));
    if (ac) (ac.data || []).forEach((r) => (activity[r.day] = r.events));
    isAdmin = !!(ad && ad.data && ad.data.length);
  } finally {
    loading = false; loadingNow = false;
  }
  renderAll();
}

const progOf = (cid) => prog[cid] || { status: 'todo', notes: '', watched: [], total: 0, last_pos: 0, last_sec: 0 };

async function saveProg(cid, patch) {
  prog[cid] = { ...progOf(cid), ...patch, course_id: cid };
  const p = prog[cid];
  const row = {
    course_id: cid, status: p.status, notes: p.notes, watched: p.watched || [], total: p.total || 0,
    last_key: p.last_key || null, last_title: p.last_title ? String(p.last_title).slice(0, 200) : null,
    last_pos: p.last_pos || 0, last_sec: p.last_sec || 0, last_at: p.last_at || null, updated_at: new Date().toISOString(),
  };
  const { error } = await sb.from('progress').upsert(row, { onConflict: 'user_id,course_id' });
  if (error) toast('مقدرتش أحفظ: ' + error.message);
}

// debounced save for frequent updates (lesson changes, playback position)
function saveProgSoon(cid, patch) {
  prog[cid] = { ...progOf(cid), ...patch, course_id: cid };
  clearTimeout(soonTimers[cid]);
  soonTimers[cid] = setTimeout(() => saveProg(cid, {}), 1500);
}

function touchActivity() {
  if (!me || Date.now() - lastTouch < 60000) return;
  lastTouch = Date.now();
  const day = dayStr(new Date());
  activity[day] = (activity[day] || 0) + 1;
  sb.rpc('touch_activity', { p_day: day });
}

const isDone = (c, key) => (progOf(c.id).watched || []).includes(String(key));

function setDone(c, key, on) {
  const p = progOf(c.id);
  const set = new Set(p.watched || []);
  if (on) set.add(String(key)); else set.delete(String(key));
  const watched = [...set];
  const patch = { watched };
  const total = courseTotal(c, p);
  if (total && watched.length >= total) patch.status = 'done';
  else if (watched.length && p.status === 'todo') patch.status = 'doing';
  else if (!on && p.status === 'done' && total && watched.length < total) patch.status = 'doing';
  saveProg(c.id, patch);
  touchActivity();
  const sel = document.getElementById('st');
  if (sel && patch.status) sel.value = patch.status;
  if (patch.status === 'done' && on) toast('أحسنت! خلصت الكورس');
  syncLessonUi(c);
  renderTracks();
}

function syncLessonUi(c) {
  const p = progOf(c.id), s = courseStat(c, p), w = p.watched || [];
  if (courseUi.list) courseUi.list.querySelectorAll('.lesson').forEach((el) => el.classList.toggle('done', w.includes(el.dataset.key)));
  if (courseUi.one) courseUi.one.textContent = w.includes('0') ? '✓ الدرس مكتمل' : 'علّم الدرس كمكتمل';
  if (courseUi.bar) courseUi.bar.style.width = s.pct + '%';
  if (courseUi.text) courseUi.text.textContent = s.complete ? 'خلصت الكورس' : s.total ? 'خلصت ' + s.done + ' من ' + s.total + ' درس' : s.done + ' درس مكتمل';
}

function courseProgressBar() {
  const i = h('i'), t = h('span', { class: 'meta' });
  courseUi.bar = i; courseUi.text = t;
  return h('div', { class: 'cprog' }, h('div', { class: 'bar' }, i), t);
}

// ---------------------------------------------------------------- views
// Admin-only: upload a video file from the device to Supabase Storage (bucket "videos").
async function uploadVideo(file, ext, onPct) {
  const { data } = await sb.auth.getSession();
  const token = data.session && data.session.access_token;
  if (!token) throw new Error('سجّل دخولك الأول.');
  const base = file.name.replace(/\.[^.]+$/, '').replace(/[^A-Za-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'video';
  const path = me.id + '/' + Date.now() + '-' + base + '.' + ext;
  await new Promise((resolve, reject) => {
    const x = new XMLHttpRequest();
    x.open('POST', cfg.SUPABASE_URL + '/storage/v1/object/videos/' + path);
    x.setRequestHeader('Authorization', 'Bearer ' + token);
    x.setRequestHeader('apikey', cfg.SUPABASE_ANON_KEY);
    x.setRequestHeader('x-upsert', 'false');
    x.setRequestHeader('Content-Type', file.type || 'video/' + ext);
    x.upload.onprogress = (e) => { if (e.lengthComputable) onPct(Math.round((e.loaded / e.total) * 100)); };
    x.onload = () => (x.status >= 200 && x.status < 300 ? resolve() : reject(new Error('فشل الرفع (' + x.status + '): ' + x.responseText)));
    x.onerror = () => reject(new Error('فشل الرفع: مشكلة في الاتصال.'));
    x.send(file);
  });
  return sb.storage.from('videos').getPublicUrl(path).data.publicUrl;
}

// Delete the uploaded files of a course when the course is deleted (admin only).
async function purgeFiles(c) {
  const base = cfg.SUPABASE_URL + '/storage/v1/object/public/videos/';
  const paths = (Array.isArray(c.lessons) ? c.lessons : [])
    .filter((l) => l && l.p === 'file' && String(l.s).startsWith(base))
    .map((l) => decodeURIComponent(String(l.s).slice(base.length)));
  if (paths.length) await sb.storage.from('videos').remove(paths);
}

function renderHeader() {
  $('#addBtn').hidden = !isAdmin;
  $('#dashBtn').hidden = !me;
  $('#pathsBtn').hidden = !me;
  $('#authBtn').textContent = me ? 'خروج' : 'دخول';
  $('#authBtn').title = me ? (me.email || '') : '';
}

function renderTracks() {
  const nav = $('#tracks'); nav.textContent = '';
  const mk = (id, label, list) => {
    const done = list.filter((c) => prog[c.id] && prog[c.id].status === 'done').length;
    nav.append(h('button', { class: 'track', 'aria-current': filter === id && view === 'home' ? 'true' : null,
      onclick: () => { filter = id; location.hash = '#/'; openId = null; view = 'home'; renderMain(); renderTracks(); } },
      h('span', null, label), h('span', null, me ? done + '/' + list.length : String(list.length))));
  };
  const visible = courses.filter((c) => c.approved);
  mk('all', 'كل الكورسات', visible);
  CATS.forEach(([id, name]) => mk(id, name, visible.filter((c) => c.cat === id)));
}

function renderAdmin() {
  const box = $('#adminBox'); box.textContent = '';
  const pending = isAdmin ? courses.filter((c) => !c.approved) : [];
  if (!pending.length) return;
  const wrap = h('div', { class: 'admin' }, h('h3', null, 'كورسات مستنية الموافقة (' + pending.length + ')'));
  pending.forEach((c) => wrap.append(h('div', { class: 'row' },
    h('a', { href: '#/course/' + c.id }, c.title),
    h('span', { class: 'meta' }, CAT[c.cat]),
    h('button', { class: 'btn', onclick: async () => {
      const { error } = await sb.from('courses').update({ approved: true }).eq('id', c.id);
      if (error) toast(error.message); else loadAll();
    } }, 'وافق'),
    h('button', { class: 'btn danger', onclick: async () => {
      await purgeFiles(c);
      const { error } = await sb.from('courses').delete().eq('id', c.id);
      if (error) toast(error.message); else loadAll();
    } }, 'ارفض'))));
  box.append(wrap);
}

function courseCard(c, i) {
  const st = prog[c.id] ? prog[c.id].status : null;
  return h('a', { class: 'card rv', href: '#/course/' + c.id, style: '--i:' + Math.min(i || 0, 10) },
    h('span', { class: 'tag' }, CAT[c.cat]),
    h('h3', null, c.title),
    h('span', { class: 'meta' }, kindLabel(c)),
    !c.approved ? h('span', { class: 'pill' }, 'بانتظار الموافقة')
      : (st ? h('span', { class: 'pill ' + st }, STATUS[st]) : null));
}

function roadmapView(id) {
  const r = ROADMAPS[id];
  if (!r) return null;
  return h('details', { class: 'roadmap', open: '' },
    h('summary', null, 'خريطة الطريق: ' + CAT[id]),
    h('p', { class: 'meta' }, r.intro),
    h('ol', { class: 'rsteps' }, r.steps.map((s, i) => h('li', { class: 'rstep rv', style: '--i:' + i },
      h('span', { class: 'rnum' }, String(i + 1)),
      h('div', null,
        h('div', { class: 'rhead' }, h('b', null, s.t), h('span', { class: 'lvl ' + s.k }, LV[s.k])),
        h('p', null, s.d))))));
}

function listView() {
  if (loading && !courses.length) return skeletonView();
  const list = courses.filter((c) => (c.approved || (me && c.created_by === me.id)) &&
    (filter === 'all' || c.cat === filter) &&
    (c.title + ' ' + c.description).toLowerCase().includes(query));
  const box = h('div', null);
  if (me && filter === 'all' && !query) {
    const cont = dashSummary(courses, prog, activity).cont;
    if (cont) box.append(ContinueCard(cont));
  }
  const rm = (filter !== 'all' && !query) ? roadmapView(filter) : null;
  if (!list.length) {
    box.append(...[h('h2', { class: 'sec' }, filter === 'all' ? 'كل الكورسات' : CAT[filter]), rm,
      h('div', { class: 'empty' }, courses.length
        ? 'مفيش كورسات هنا. جرّب تصنيف تاني أو غيّر كلمة البحث.'
        : 'لسه مفيش كورسات هنا.')].filter(Boolean));
    return box;
  }
  if (filter === 'all' && !query) {
    // every course on one page, grouped by track
    CATS.forEach(([id, name]) => {
      const items = list.filter((c) => c.cat === id);
      if (!items.length) return;
      box.append(h('section', { class: 'group' },
        h('h2', { class: 'sec rv' }, name, h('span', { class: 'count' }, String(items.length))),
        h('div', { class: 'grid' }, items.map(courseCard))));
    });
  } else {
    box.append(...[h('h2', { class: 'sec' }, filter === 'all' ? 'نتائج البحث' : CAT[filter]), rm,
      rm ? h('h3', { class: 'sub' }, 'الكورسات المتاحة') : null,
      h('div', { class: 'grid' }, list.map(courseCard))].filter(Boolean));
  }
  return box;
}

function courseView(c) {
  courseUi = {};
  const p = prog[c.id] || { status: 'todo', notes: '' };
  const yl = ytLink(c);
  const box = h('div', null,
    h('a', { class: 'btn ghost', href: '#/' }, 'رجوع للكورسات'),
    h('h2', { class: 'sec', style: 'margin-top:16px' }, c.title),
    h('div', { class: 'meta' }, CAT[c.cat] + ' - ' + kindLabel(c) + (c.approved ? '' : ' - بانتظار الموافقة')),
    me && c.approved ? courseProgressBar() : null,
    watchView(c),
    c.description ? h('p', null, c.description) : null,
    yl ? h('p', { class: 'meta' }, 'لو الفيديو مش بيظهر، يبقى صاحب القناة مانع التضمين. ',
      h('a', { href: yl, target: '_blank', rel: 'noopener noreferrer' }, 'افتحه على يوتيوب')) : null);

  if (me && c.approved) {
    const sel = h('select', { class: 'in', id: 'st', 'aria-label': 'حالتك في الكورس',
      onchange: (e) => { saveProg(c.id, { status: e.target.value }); renderTracks(); } },
      Object.keys(STATUS).map((k) => h('option', { value: k, selected: p.status === k ? '' : null }, STATUS[k])));
    box.append(
      h('div', { class: 'row' }, h('label', { for: 'st' }, 'حالتك في الكورس:'), sel),
      h('label', { for: 'notes', class: 'meta' }, 'ملاحظاتك (محفوظة على حسابك)'),
      h('textarea', { id: 'notes', class: 'in', placeholder: 'اكتب اللي اتعلمته، الأوامر المهمة، الأسئلة...',
        oninput: (e) => { const v = e.target.value; clearTimeout(noteTimer); noteTimer = setTimeout(() => saveProg(c.id, { notes: v }), 700); } },
        p.notes || ''));
  } else if (!me) {
    box.append(h('div', { class: 'empty', style: 'margin-top:12px' }, 'سجّل دخولك عشان تتابع تقدمك وتكتب ملاحظاتك. ',
      h('button', { class: 'btn', onclick: () => openAuth('in') }, 'تسجيل الدخول')));
  }

  if (isAdmin || (me && c.created_by === me.id && !c.approved)) {
    box.append(h('div', { class: 'row' }, h('button', { class: 'btn danger', onclick: async (e) => {
      if (!confirmDel) { confirmDel = true; e.target.textContent = 'اضغط تاني للحذف'; return; }
      if (isAdmin) await purgeFiles(c);
      const { error } = await sb.from('courses').delete().eq('id', c.id);
      confirmDel = false;
      if (error) toast(error.message); else { location.hash = '#/'; loadAll(); }
    } }, 'احذف الكورس')));
  }
  syncLessonUi(c);
  return box;
}

function renderMain() { renderMainInner(); reveal($('#main')); }
function renderMainInner() {
  if (cleanup) { cleanup(); cleanup = null; }
  const main = $('#main'); main.textContent = '';
  if (!configured) {
    main.append(h('div', { class: 'empty' }, 'الموقع لسه مش متوصل بقاعدة البيانات. عدّل ملف config.js وحط بيانات Supabase بتاعتك.'));
    return;
  }
  if (view === 'dash') { main.append(DashboardView()); return; }
  if (view === 'paths') { main.append(PathsView()); return; }
  if (view === 'path') { main.append(PathView(pathId)); return; }
  if (openId) {
    const c = courses.find((x) => x.id === openId);
    if (c) { main.append(courseView(c)); return; }
    main.append(h('div', { class: 'empty' }, courses.length ? 'الكورس ده مش موجود أو لسه مستني الموافقة.' : 'جاري التحميل...'));
    return;
  }
  main.append(listView());
}
function renderAll() {
  renderHeader(); renderTracks(); renderAdmin(); renderMain(); syncTabs();
  if (!$('#chatPanel').hidden) renderChat();
}

function route() {
  const m = location.hash.match(/^#\/course\/([\w-]+)/);
  openId = m ? m[1] : null;
  const mp = location.hash.match(/^#\/path\/([\w-]+)/);
  pathId = mp ? mp[1] : null;
  view = location.hash === '#/dashboard' ? 'dash' : location.hash === '#/paths' ? 'paths' : mp ? 'path' : 'home';
  confirmDel = false;
  const go = () => { renderMain(); renderTracks(); syncTabs(); if (openId || view !== 'home') window.scrollTo({ top: 0, behavior: 'instant' }); };
  if (routed && !reduceMotion && document.startViewTransition) document.startViewTransition(go); else go();
  routed = true;
  if (!reduceMotion && document.startViewTransition) document.documentElement.classList.add('vt');
}

// ---------------------------------------------------------------- auth + add
function openAuth(mode) {
  authMode = mode;
  $('#authTitle').textContent = mode === 'in' ? 'تسجيل الدخول' : 'إنشاء حساب';
  $('#authGo').textContent = mode === 'in' ? 'دخول' : 'إنشاء الحساب';
  $('#authSwitch').textContent = mode === 'in' ? 'معنديش حساب' : 'عندي حساب';
  $('#pass').autocomplete = mode === 'in' ? 'current-password' : 'new-password';
  $('#authErr').textContent = '';
}

document.addEventListener('click', (e) => {
  if (e.target.dataset && e.target.dataset.close !== undefined) e.target.closest('dialog').close();
});
$('#authSwitch').addEventListener('click', () => openAuth(authMode === 'in' ? 'up' : 'in'));
$('#googleBtn').addEventListener('click', async () => {
  if (!configured) return;
  const { error } = await sb.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: location.origin + location.pathname } });
  if (error) $('#authErr').textContent = error.message;
});
$('#authBtn').addEventListener('click', async () => {
  if (!configured) return toast('لازم تظبط config.js الأول');
  if (me) { await sb.auth.signOut(); toast('اتسجل خروجك'); } else openAuth('in');
});
$('#addBtn').addEventListener('click', () => {
  if (!configured) return toast('لازم تظبط config.js الأول');
  if (!me) { toast('سجّل دخولك الأول عشان تضيف كورس'); openAuth('in'); return; }
  $('#addErr').textContent = '';
  $('#fileBox').hidden = !isAdmin;
  $('#addDlg').showModal();
});

$('#authForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = $('#email').value.trim(), password = $('#pass').value;
  const res = authMode === 'in'
    ? await sb.auth.signInWithPassword({ email, password })
    : await sb.auth.signUp({ email, password });
  if (res.error) { $('#authErr').textContent = res.error.message; return; }
  if (authMode === 'up' && !res.data.session) {
    $('#authErr').textContent = 'اتبعتلك إيميل تأكيد. افتحه وبعدها سجّل دخولك.';
    return;
  }
  $('#authForm').reset();
  toast('أهلاً بيك!');
});

$('#addForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const fail = (m) => { $('#addErr').textContent = m; };
  const lines = $('#aLinks').value.split('\n').map((s) => s.trim()).filter(Boolean);
  const files = Array.from($('#aFiles').files || []);
  if (!lines.length && !files.length) return fail('ضيف لينك أو فيديو من جهازك.');
  if (files.length && !isAdmin) return fail('رفع الفيديوهات من الجهاز للأدمن بس.');
  if (lines.length > 300) return fail('الحد الأقصى 300 درس في الكورس.');
  const items = [];
  for (const line of lines) {
    let t = '', url = line;
    const i = line.indexOf('|');
    if (i > 0) { t = line.slice(0, i).trim(); url = line.slice(i + 1).trim(); }
    const rg = url.match(/^https?:\/\/(?:t|telegram)\.me\/(?:s\/)?([A-Za-z]\w{3,31})\/(\d+)-(\d+)\/?$/i);
    if (rg) {
      const a = +rg[2], b = +rg[3];
      if (!(b > a) || b - a >= 200) return fail('مدى بوستات تليجرام لازم يكون أقل من 200 بوست، مثال: https://t.me/channel/10-25');
      for (let n = a; n <= b; n++) items.push({ t: t ? (t + ' ' + (n - a + 1)).slice(0, 120) : '', p: { p: 'telegram', s: rg[1] + '/' + n } });
      continue;
    }
    const p = parseLink(url);
    if (!p) return fail('اللينك ده مش مفهوم: ' + line.slice(0, 60));
    if (p.p === 'tgprivate') return fail('قنوات تليجرام الخاصة مينفعش تتشغّل جوه الموقع. لازم القناة تكون عامة (ليها يوزر).');
    if (p.p === 'embed' && !isAdmin) return fail('المنصة دي مش مدعومة. المدعوم: يوتيوب، Vimeo، Dailymotion، Google Drive، وملفات mp4.');
    items.push({ t: t.slice(0, 120), p });
  }
  if (items.length > 300) return fail('الحد الأقصى 300 درس في الكورس.');
  const uploaded = [];
  if (files.length) {
    const go = $('#addGo'), bar = $('#upBar');
    go.disabled = true; bar.hidden = false;
    try {
      for (let i = 0; i < files.length; i++) {
        const f = files[i];
        const ext = ((f.name.match(/\.(mp4|webm|ogg)$/i) || [])[1] || '').toLowerCase();
        if (!ext) throw new Error('«' + f.name + '» لازم يكون mp4 أو webm أو ogg.');
        if (f.size > MAX_UPLOAD) throw new Error('«' + f.name + '» أكبر من 50 ميجا.');
        const url = await uploadVideo(f, ext, (pct) => {
          bar.value = pct;
          $('#addErr').textContent = 'جاري رفع ' + (i + 1) + ' من ' + files.length + '... ' + pct + '%';
        });
        uploaded.push({ t: f.name.replace(/\.[^.]+$/, '').slice(0, 120), p: 'file', s: url });
      }
    } catch (err) {
      go.disabled = false; bar.hidden = true;
      return fail(err.message);
    }
    go.disabled = false; bar.hidden = true; $('#addErr').textContent = '';
  }
  let row;
  const first = items[0] && items[0].p;
  if (items.length === 1 && !uploaded.length && first.p === 'youtube') {
    row = first.list ? { kind: 'playlist', yt: first.list } : { kind: 'video', yt: first.s };
  } else {
    if (items.some((x) => x.p.list)) return fail('البلاي ليست بتتضاف لوحدها في كورس خاص بيها.');
    row = { kind: 'lessons', yt: null, lessons: items.map((x, i) => ({ t: x.t || 'درس ' + (i + 1), p: x.p.p, s: x.p.s })).concat(uploaded) };
  }
  const { error } = await sb.from('courses').insert({
    title: $('#aTitle').value.trim(), description: $('#aDesc').value.trim(),
    cat: $('#aCat').value, approved: isAdmin, ...row,
  });
  if (error) return fail(error.message);
  $('#addDlg').close(); $('#addForm').reset();
  toast(isAdmin ? 'اتضاف الكورس.' : 'اتبعت للمراجعة وهيظهر بعد الموافقة.');
  loadAll();
});

$('#q').addEventListener('input', (e) => {
  query = e.target.value.trim().toLowerCase();
  if (openId || view !== 'home') { view = 'home'; location.hash = '#/'; } else renderMain();
});

// ---------------------------------------------------------------- AI assistant (free LLM through a Supabase Edge Function; the API key never reaches the browser)
const chat = { msgs: [], busy: false };
const SUGGEST = ['ابدأ منين في تعلّم موضوع جديد؟', 'إزاي أنظّم وقتي للمذاكرة؟', 'إزاي أذاكر من فيديوهات الكورسات بشكل أفضل؟'];

function chatText(parent, text) {
  text.split(/```/).forEach((part, i) => {
    if (i % 2) parent.append(h('pre', null, h('code', null, part.replace(/^[\w+#.-]{0,20}\n/, '').replace(/\n$/, ''))));
    else if (part.trim()) parent.append(document.createTextNode(part.replace(/^\n+|\n+$/g, '')));
  });
}

function renderChat() {
  const log = $('#chatLog'); log.textContent = '';
  if (!chat.msgs.length) {
    log.append(h('div', { class: 'msg bot' }, 'أهلاً! أنا مساعد التعلّم. اسألني عن أي حاجة في الكورسات.' + (me ? '' : '\n\nسجّل دخولك الأول عشان تقدر تكلّمني.')));
    if (me) log.append(h('div', { class: 'sug' }, SUGGEST.map((q) => h('button', { type: 'button', onclick: () => sendChat(q) }, q))));
  }
  chat.msgs.forEach((m) => {
    const d = h('div', { class: 'msg ' + (m.role === 'user' ? 'user' : 'bot') });
    chatText(d, m.content); log.append(d);
  });
  if (chat.busy) log.append(h('div', { class: 'msg bot dots' }, h('span'), h('span'), h('span')));
  log.scrollTop = log.scrollHeight;
}

function chatError(code) {
  const admin = isAdmin && code ? ' (' + code + ')' : '';
  switch (code) {
    case 'login_required': return 'سجّل دخولك الأول.';
    case 'daily_limit': return 'وصلت للحد اليومي من الأسئلة. جرّب تاني بكرة.';
    case 'not_configured': return 'المساعد لسه مش متفعّل على السيرفر.' + admin;
    case 'busy': return 'المساعد مشغول دلوقتي (الاستخدام المجاني وصل حده مؤقتاً). جرّب بعد دقيقة.';
    case 'bad_key': case 'quota': case 'model_not_found': case 'upstream':
      return 'فيه مشكلة في إعداد المساعد على السيرفر. بلّغ صاحب الموقع.' + admin;
    default: return 'مقدرتش أوصل للمساعد. جرّب تاني.';
  }
}

async function sendChat(text) {
  text = (text || '').trim();
  if (!text || chat.busy || !configured) return;
  if (!me) { toast('سجّل دخولك الأول عشان تكلّم المساعد'); openAuth('in'); return; }
  chat.msgs.push({ role: 'user', content: text.slice(0, 1500) });
  chat.busy = true; renderChat();
  const course = openId ? ((courses.find((c) => c.id === openId) || {}).title || '') : '';
  try {
    const history = chat.msgs.filter((m) => !m.err).slice(-12).map(({ role, content }) => ({ role, content }));
    const { data, error } = await sb.functions.invoke('chat', { body: { messages: history, course } });
    if (error) {
      let code = '';
      try { code = (await error.context.json()).error; } catch (e) {}
      throw new Error(code || 'network');
    }
    chat.msgs.push({ role: 'assistant', content: (data && data.reply) || 'مفيش رد. جرّب تاني.' });
  } catch (e) {
    chat.msgs.push({ role: 'assistant', content: chatError(e.message), err: true });
  }
  chat.busy = false; renderChat();
}

function toggleChat(open) {
  $('#chatPanel').hidden = !open;
  $('#chatFab').setAttribute('aria-expanded', String(open));
  const ct = document.querySelector('#tabbar [data-act=chat]'); if (ct) ct.setAttribute('aria-pressed', String(open));
  if (open) { renderChat(); setTimeout(() => $('#chatIn').focus(), 60); }
}
$('#chatFab').addEventListener('click', () => toggleChat($('#chatPanel').hidden));
$('#chatClose').addEventListener('click', () => toggleChat(false));
$('#chatClear').addEventListener('click', () => { chat.msgs = []; renderChat(); });
$('#chatForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const t = $('#chatIn').value; $('#chatIn').value = ''; sendChat(t);
});
$('#chatIn').addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); $('#chatForm').requestSubmit(); }
});

// ---------------------------------------------------------------- iOS-style tab bar + nav bar
function syncTabs() {
  const cur = view === 'dash' ? 'dash' : (view === 'paths' || view === 'path') ? 'paths' : 'home';
  document.querySelectorAll('#tabbar .tab[data-tab]').forEach((t) => t.setAttribute('aria-current', t.dataset.tab === cur ? 'page' : 'false'));
}
$('#tabbar [data-tab=home]').addEventListener('click', () => {
  filter = 'all'; query = ''; $('#q').value = ''; openId = null;
  if (location.hash === '#/' || location.hash === '') { view = 'home'; renderMain(); renderTracks(); syncTabs(); window.scrollTo({ top: 0, behavior: 'smooth' }); }
});
$('#tabbar [data-act=chat]').addEventListener('click', () => toggleChat($('#chatPanel').hidden));
let scrolledNow = false, scrollTick = false;
window.addEventListener('scroll', () => {
  if (scrollTick) return;
  scrollTick = true;
  requestAnimationFrame(() => {
    scrollTick = false;
    const s = window.scrollY > 8;
    if (s !== scrolledNow) { scrolledNow = s; document.querySelector('.top').classList.toggle('scrolled', s); }
  });
}, { passive: true });

CATS.forEach(([id, name]) => $('#aCat').append(h('option', { value: id }, name)));
window.addEventListener('hashchange', route);
renderAll(); route();
// Login gate: nobody sees the site until they are signed in.
function applyGate() {
  const gated = configured && !me;
  $('#boot').hidden = true;
  $('#gate').hidden = !gated;
  document.querySelector('.wrap').hidden = gated;
  $('#chatFab').hidden = gated;
  $('#tabbar').hidden = gated;
  if (gated) toggleChat(false);
}
if (configured) {
  sb.auth.onAuthStateChange((ev, session) => {
    const next = session ? session.user : null;
    const sameUser = !!(next && me && next.id === me.id);
    me = next;
    if (sameUser && ev !== 'USER_UPDATED') return;   // focus / token refresh: keep the page as it is
    applyGate();
    renderHeader();
    if (me) setTimeout(loadAll, 0);
    else { courses = []; prog = {}; activity = {}; isAdmin = false; renderAll(); }
  });
  setTimeout(() => { if (!$('#boot').hidden) applyGate(); }, 5000);
} else {
  applyGate();
}
