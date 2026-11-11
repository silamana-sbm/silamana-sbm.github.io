/* ---- Langue FR / EN (bascule sur place, mémorisée) ---- */
(function () {
  var KEY = 'sbmLang';
  var translatable = !!document.querySelector('[data-t]');
  function get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function put(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  var q = (location.search.match(/[?&]lang=(fr|en)/) || [])[1];
  var lang = 'fr';
  if (translatable) {
    lang = q || get(KEY) || (/^en/i.test(navigator.language || '') ? 'en' : 'fr');
    if (q) put(KEY, q);
  }
  document.documentElement.lang = lang;
  Object.defineProperty(window, 'EN', { get: function () { return document.documentElement.lang === 'en'; } });
  if (!translatable) return;
  function dec(s) { var t = document.createElement('textarea'); t.innerHTML = s; return t.value; }
  function apply() {
    var en = document.documentElement.lang === 'en';
    var D = window.I18N_EN || {};
    document.querySelectorAll('[data-t]').forEach(function (el) {
      var id = el.getAttribute('data-t'), tag = el.tagName;
      if (tag === 'TITLE') { if (el.__fr == null) el.__fr = el.textContent; document.title = en && D[id] != null ? dec(D[id]) : el.__fr; return; }
      if (tag === 'META') { if (el.__fr == null) el.__fr = el.getAttribute('content'); el.setAttribute('content', en && D[id] != null ? dec(D[id]) : el.__fr); return; }
      if (el.__fr == null) el.__fr = el.innerHTML;
      if (el.querySelector('input')) {
        var tmp = document.createElement('div');
        tmp.innerHTML = en && D[id] != null ? D[id] : el.__fr;
        var ns = tmp.querySelector('span'), os = el.querySelector('span');
        if (ns && os) os.innerHTML = ns.innerHTML;
        return;
      }
      if (en) {
        if (D[id] == null) return;
        var svgs = el.__fr.match(/<svg[\s\S]*?<\/svg>/g) || [], i = 0;
        el.innerHTML = D[id].replace(/⟦svg⟧/g, function () { return svgs[i++] || ''; });
      } else { el.innerHTML = el.__fr; }
    });
    document.querySelectorAll('[data-ta]').forEach(function (el) {
      if (!el.__frA) el.__frA = {};
      el.getAttribute('data-ta').split(',').forEach(function (p) {
        var a = p.split(':'), n = a[0], id = a[1];
        if (el.__frA[n] == null) el.__frA[n] = el.getAttribute(n);
        el.setAttribute(n, en && D[id] != null ? dec(D[id]) : el.__frA[n]);
      });
    });
    document.querySelectorAll('[data-tv]').forEach(function (el) {
      if (el.__frV == null) el.__frV = el.value;
      var id = el.getAttribute('data-tv'); el.value = en && D[id] != null ? dec(D[id]) : el.__frV;
    });
    document.querySelectorAll('a[data-href-en]').forEach(function (a) {
      if (a.__frH == null) a.__frH = a.getAttribute('href');
      a.setAttribute('href', en ? a.getAttribute('data-href-en') : a.__frH);
    });
    var sub = document.querySelector('input[name="subject"]');
    if (sub) sub.value = en ? 'New quote request from silamana.com (English)' : 'Nouvelle demande de devis depuis silamana.com';
    document.querySelectorAll('.lang-toggle button').forEach(function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-lang') === (en ? 'en' : 'fr') ? 'true' : 'false');
    });
    window.dispatchEvent(new Event('langchange'));
  }
  function ensureDict(cb) {
    if (window.I18N_EN) return cb();
    var sc = document.createElement('script');
    sc.src = '/i18n-en.js?v=20261114'; sc.onload = cb; document.head.appendChild(sc);
  }
  function setLang(l) {
    document.documentElement.lang = l; put(KEY, l);
    if (l === 'en') ensureDict(apply); else apply();
  }
  document.querySelectorAll('.lang-toggle button').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
  });
  document.querySelectorAll('.lang-toggle button').forEach(function (b) {
    b.setAttribute('aria-pressed', b.getAttribute('data-lang') === lang ? 'true' : 'false');
  });
  if (lang === 'en') ensureDict(apply);
})();
const observer = new IntersectionObserver((entries) => {
  entries.forEach(el => { if (el.isIntersecting) el.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

function openLightbox(src) {
  const lbImg = document.getElementById('lightbox-img');
  lbImg.src = src;
  const source = Array.from(document.querySelectorAll('.portfolio-img, .proof-img')).find(function(i) { return i.src === lbImg.src; });
  lbImg.alt = source ? source.alt : '';
  document.getElementById('lightbox').classList.add('active');
}
function closeLightbox() {
  document.getElementById('lightbox').classList.remove('active');
}
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && document.getElementById('lightbox').classList.contains('active')) {
    closeLightbox();
  }
});
function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  const isOpen = item.classList.toggle('open');
  btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
}
function toggleMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  const btn = document.getElementById('navToggle');
  const isOpen = menu.classList.toggle('open');
  btn.classList.toggle('active', isOpen);
  btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  btn.setAttribute('aria-label', EN ? (isOpen ? 'Close menu' : 'Open menu') : (isOpen ? 'Fermer le menu' : 'Ouvrir le menu'));
}
function closeMobileMenu() {
  document.getElementById('mobileMenu').classList.remove('open');
  const btn = document.getElementById('navToggle');
  btn.classList.remove('active');
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-label', EN ? 'Open menu' : 'Ouvrir le menu');
}
function loadYoutubeVideo(el) {
  const id = el.getAttribute('data-video-id');
  const title = el.getAttribute('data-title') || (EN ? 'YouTube video' : 'Vidéo YouTube');
  const allow = el.getAttribute('data-allow');
  const iframe = document.createElement('iframe');
  iframe.src = 'https://www.youtube.com/embed/' + id + '?autoplay=1';
  iframe.title = title;
  iframe.allowFullscreen = true;
  iframe.setAttribute('allowfullscreen', '');
  iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
  if (allow) iframe.setAttribute('allow', allow);
  iframe.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;border:none;';
  el.replaceWith(iframe);
}
function quoteNeeds(form) {
  return Array.from(form.querySelectorAll('input[name="need_opt"]:checked')).map(function (i) { return i.value; }).join(', ');
}
function buildWhatsAppText(form) {
  const f = (n) => (form.elements[n] ? form.elements[n].value.trim() : '');
  const L = EN
    ? {hi: 'Hello Silamana Business Model AGENCY, I would like a quote (request from your website).', name: 'Name', phone: 'Phone', sector: 'Sector', needs: 'Need(s)', pack: 'Package', budget: 'Budget', deadline: 'Timeline', project: 'Project'}
    : {hi: 'Bonjour Silamana Business Model AGENCY, je souhaite un devis (demande depuis votre site web).', name: 'Nom', phone: 'Téléphone', sector: 'Secteur', needs: 'Besoin(s)', pack: 'Formule', budget: 'Budget', deadline: 'Délai', project: 'Projet'};
  let text = `${L.hi}\n\n${L.name} : ${f('name')}\nEmail : ${f('email')}`;
  if (f('phone')) text += `\n${L.phone} : ${f('phone')}`;
  text += `\n${L.sector} : ${f('sector')}\n${L.needs} : ${quoteNeeds(form)}`;
  if (f('pack')) text += `\n${L.pack} : ${f('pack')}`;
  if (f('budget')) text += `\n${L.budget} : ${f('budget')}`;
  if (f('deadline')) text += `\n${L.deadline} : ${f('deadline')}`;
  text += `\n${L.project} : ${f('message')}`;
  return text;
}
function sendWhatsApp() {
  const form = document.querySelector('.contact-form');
  if (window.quoteValidate && !window.quoteValidate()) return;
  window.open(`https://wa.me/224621849578?text=${encodeURIComponent(buildWhatsAppText(form))}`, '_blank');
}
async function handleForm(e) {
  e.preventDefault();
  const form = e.target;
  const btn = document.getElementById('contact-submit');
  const status = document.getElementById('form-status');
  const label = btn.textContent;
  status.className = 'form-status';
  status.textContent = '';
  if (form.botcheck && form.botcheck.checked) return;
  if (window.quoteValidate && !window.quoteValidate()) return;
  document.getElementById('contact-need-value').value = quoteNeeds(form);
  btn.disabled = true;
  btn.textContent = EN ? 'Sending…' : 'Envoi en cours…';
  const data = {};
  new FormData(form).forEach((v, k) => { if (k !== 'botcheck' && k !== 'need_opt') data[k] = v; });
  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (res.ok && json.success) {
      form.reset();
      if (window.quoteShow) window.quoteShow(1);
      form.querySelectorAll('.quote-error').forEach(function (x) { x.classList.remove('show'); });
      status.className = 'form-status ok';
      status.textContent = EN ? 'Thank you! Your message has been sent. We will reply quickly at the address provided.' : 'Merci ! Votre message a bien été envoyé. Nous vous répondons rapidement à l\'adresse indiquée.';
    } else {
      throw new Error(json.message || 'Erreur');
    }
  } catch (err) {
    status.className = 'form-status err';
    status.textContent = EN ? 'Sending failed. Please try again, or write to us on WhatsApp or at direction@silamana.com.' : 'L\'envoi a échoué. Réessayez, ou écrivez-nous sur WhatsApp ou à direction@silamana.com.';
  } finally {
    btn.disabled = false;
    btn.textContent = label;
  }
}

/* Menu déroulant « Plateformes » */
(function () {
  var boxes = document.querySelectorAll('.nav-dd');
  function closeAll() {
    boxes.forEach(function (b) {
      b.classList.remove('open');
      var btn = b.querySelector('.nav-dd-btn');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
  }
  boxes.forEach(function (box) {
    var btn = box.querySelector('.nav-dd-btn');
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var willOpen = !box.classList.contains('open');
      closeAll();
      if (willOpen) { box.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); }
    });
  });
  document.addEventListener('click', closeAll);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeAll(); });
})();

/* Anciens liens du type silamana.com/#contact : redirige vers la bonne page */
(function () {
  var map = {
    apropos: 'a-propos.html', pourquoi: 'a-propos.html', methode: 'a-propos.html', partenaires: 'a-propos.html',
    services: 'services.html', packs: 'services.html',
    portfolio: 'realisations.html', 'dai-services': 'realisations.html', 'etudes-de-cas': 'realisations.html',
    videos: 'realisations.html', temoignage: 'realisations.html',
    academy: 'sbm-academy.html', plateforme: 'guinee-business-connect.html',
    faq: 'contact.html', contact: 'contact.html', 'mentions-legales': 'mentions-legales.html'
  };
  var h = (location.hash || '').replace('#', '');
  if (h && map[h] && !document.getElementById(h)) {
    location.replace(map[h] + '#' + h);
  }
})();

/* Bouton WhatsApp : icône, message pré-rempli, bulle d'accueil */
(function () {
  var btn = document.querySelector('.wa-float');
  if (!btn) return;
  function waUrl() { return 'https://wa.me/224621849578?text=' + encodeURIComponent(EN ? 'Hello SBM, I am contacting you from silamana.com regarding ' : 'Bonjour SBM, je vous contacte depuis silamana.com au sujet de '); }
  function waBubble() { return EN ? '<strong>A question?</strong><br>Write to us on WhatsApp, quick reply.' : '<strong>Une question ?</strong><br>Écrivez-nous sur WhatsApp, réponse rapide.'; }
  var url = waUrl();
  btn.href = url;
  window.addEventListener('langchange', function () {
    url = waUrl(); btn.href = url;
    var ba = document.querySelector('.wa-bubble a');
    if (ba) { ba.href = url; ba.innerHTML = waBubble(); }
  });
  btn.innerHTML = '<svg class="wa-logo" viewBox="0 0 32 32" aria-hidden="true"><path d="M16.04 3C8.84 3 3 8.8 3 15.95c0 2.28.6 4.5 1.74 6.46L3 29l6.76-1.7a13.1 13.1 0 0 0 6.28 1.6c7.2 0 13.04-5.8 13.04-12.95C29.08 8.8 23.24 3 16.04 3zm0 23.7c-1.96 0-3.88-.52-5.56-1.5l-.4-.24-4.02 1.02 1.08-3.9-.26-.4a10.6 10.6 0 0 1-1.64-5.7c0-5.9 4.84-10.7 10.8-10.7 5.94 0 10.78 4.8 10.78 10.7 0 5.9-4.84 10.72-10.78 10.72zm5.92-8c-.32-.16-1.92-.94-2.22-1.05-.3-.1-.5-.16-.72.16-.22.32-.84 1.05-1.03 1.26-.19.22-.38.24-.7.08-.32-.16-1.36-.5-2.6-1.6-.96-.85-1.6-1.9-1.8-2.22-.18-.32-.02-.5.14-.66.15-.14.32-.38.48-.57.16-.19.22-.32.32-.54.1-.22.05-.4-.03-.57-.08-.16-.72-1.74-1-2.38-.26-.62-.52-.54-.72-.55h-.6c-.22 0-.57.08-.86.4-.3.32-1.13 1.1-1.13 2.7s1.16 3.13 1.32 3.35c.16.22 2.28 3.5 5.54 4.9.78.34 1.38.54 1.85.68.78.25 1.5.22 2.06.13.63-.1 1.92-.78 2.2-1.54.27-.76.27-1.4.19-1.54-.08-.14-.3-.22-.62-.38z"/></svg>';
  var seen = false;
  try { seen = sessionStorage.getItem('waBubble') === '1'; } catch (e) {}
  if (seen) return;
  var b = document.createElement('div');
  b.className = 'wa-bubble';
  b.innerHTML = '<a href="' + url + '" target="_blank" rel="noopener noreferrer">' + waBubble() + '</a><button type="button" aria-label="×">×</button>';
  document.body.appendChild(b);
  function hide() { b.classList.remove('show'); try { sessionStorage.setItem('waBubble', '1'); } catch (e) {} }
  b.querySelector('button').addEventListener('click', hide);
  setTimeout(function () { b.classList.add('show'); }, 6000);
  setTimeout(hide, 16000);
})();

/* Devis guidé en 3 étapes */
(function () {
  var form = document.querySelector('.quote-form');
  if (!form) return;
  form.classList.add('js-quote');
  document.documentElement.classList.add('js-quote-on');
  var steps = form.querySelectorAll('.quote-step');
  var bars = form.querySelectorAll('.quote-progress span');
  function names() { return EN ? ['Your project', 'Budget and timeline', 'Your contact details'] : ['Votre projet', 'Budget et délai', 'Vos coordonnées']; }
  var cur = 1;
  function show(n) {
    cur = n;
    steps.forEach(function (s) { s.classList.toggle('active', +s.getAttribute('data-step') === n); });
    bars.forEach(function (b, i) { b.classList.toggle('on', i < n); });
    document.getElementById('quote-stepname').textContent = (EN ? 'Step ' + n + ' of 3 · ' : 'Étape ' + n + ' sur 3 · ') + names()[n - 1];
    var top = form.getBoundingClientRect().top + window.scrollY - 90;
    window.scrollTo({ top: top, behavior: 'smooth' });
  }
  function err(n, msg) {
    var e = document.getElementById('quote-err' + n);
    e.textContent = msg || '';
    e.classList.toggle('show', !!msg);
  }
  function valid(n) {
    err(n, '');
    if (n === 1) {
      if (!form.querySelector('input[name="need_opt"]:checked')) { err(1, EN ? 'Choose at least one service.' : 'Choisissez au moins un service.'); return false; }
      if (!form.elements.sector.value) { err(1, EN ? 'Select your business sector.' : 'Indiquez votre secteur d\'activité.'); form.elements.sector.focus(); return false; }
    }
    if (n === 2) {
      if (!form.elements.message.value.trim()) { err(2, EN ? 'Briefly describe your project.' : 'Décrivez brièvement votre projet.'); form.elements.message.focus(); return false; }
    }
    if (n === 3) {
      if (!form.elements.name.value.trim()) { err(3, EN ? 'Enter your name.' : 'Indiquez votre nom.'); form.elements.name.focus(); return false; }
      var em = form.elements.email;
      if (!em.value.trim() || !em.checkValidity()) { err(3, EN ? 'Enter a valid email address.' : 'Indiquez une adresse e-mail valide.'); em.focus(); return false; }
    }
    return true;
  }
  window.addEventListener('langchange', function () { var el = document.getElementById('quote-stepname'); if (el) el.textContent = (EN ? 'Step ' + cur + ' of 3 · ' : 'Étape ' + cur + ' sur 3 · ') + names()[cur - 1]; });
  window.quoteValidate = function () { for (var i = 1; i <= 3; i++) { if (!valid(i)) { show(i); return false; } } return true; };
  form.querySelectorAll('[data-go]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var to = +btn.getAttribute('data-go');
      var from = +btn.closest('.quote-step').getAttribute('data-step');
      if (to > from && !valid(from)) return;
      show(to);
    });
  });
  window.quoteShow = show;
  steps.forEach(function (s) { s.classList.remove('active'); });
  steps[0].classList.add('active');
})();

/* Diaporama de l'accueil : défilement auto, pause au survol / toucher, flèches, points, balayage */
(function () {
  var box = document.getElementById('heroSlides');
  if (!box) return;
  var slides = Array.from(box.querySelectorAll('.slide'));
  var dotsBox = document.querySelector('.slider-dots');
  var cur = 0, timer = null, paused = false;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  slides.forEach(function (s, i) {
    var d = document.createElement('button');
    d.type = 'button'; d.setAttribute('role', 'tab');
    d.setAttribute('aria-label', (i + 1) + ' / ' + slides.length);
    d.addEventListener('click', function () { go(i); restart(); });
    dotsBox.appendChild(d);
  });
  var dots = dotsBox.querySelectorAll('button');
  function go(n) {
    cur = (n + slides.length) % slides.length;
    slides.forEach(function (s, i) {
      var on = i === cur;
      s.classList.toggle('active', on);
      s.setAttribute('aria-hidden', on ? 'false' : 'true');
      s.querySelectorAll('a').forEach(function (a) { if (on) a.removeAttribute('tabindex'); else a.setAttribute('tabindex', '-1'); });
    });
    dots.forEach(function (d, i) { d.setAttribute('aria-selected', i === cur ? 'true' : 'false'); });
  }
  function stop() { if (timer) { clearInterval(timer); timer = null; } }
  function start() { if (reduce || paused || timer || document.hidden) return; timer = setInterval(function () { go(cur + 1); }, 7000); }
  function restart() { stop(); start(); }
  document.querySelectorAll('.slider-btn').forEach(function (b) {
    b.addEventListener('click', function () { go(cur + (+b.getAttribute('data-dir'))); restart(); });
  });
  var hero = document.getElementById('accueil');
  hero.addEventListener('mouseenter', function () { paused = true; stop(); });
  hero.addEventListener('mouseleave', function () { paused = false; start(); });
  hero.addEventListener('focusin', function () { paused = true; stop(); });
  hero.addEventListener('focusout', function () { paused = false; start(); });
  var x0 = null;
  box.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; paused = true; stop(); }, { passive: true });
  box.addEventListener('touchend', function (e) {
    if (x0 !== null) { var dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 45) go(cur + (dx < 0 ? 1 : -1)); }
    x0 = null; paused = false; start();
  }, { passive: true });
  document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); else start(); });
  go(0); start();
})();
