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
  btn.setAttribute('aria-label', isOpen ? 'Fermer le menu' : 'Ouvrir le menu');
}
function closeMobileMenu() {
  document.getElementById('mobileMenu').classList.remove('open');
  const btn = document.getElementById('navToggle');
  btn.classList.remove('active');
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-label', 'Ouvrir le menu');
}
function loadYoutubeVideo(el) {
  const id = el.getAttribute('data-video-id');
  const title = el.getAttribute('data-title') || 'Vidéo YouTube';
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
function buildWhatsAppText(form) {
  const f = (n) => (form.elements[n] ? form.elements[n].value.trim() : '');
  let text = `Bonjour Silamana Business Model AGENCY, je vous contacte depuis votre site web.\n\nNom : ${f('name')}\nEmail : ${f('email')}\nSecteur : ${f('sector')}\nBesoin principal : ${f('need')}`;
  if (f('deadline')) text += `\nDélai souhaité : ${f('deadline')}`;
  if (f('budget')) text += `\nBudget envisagé : ${f('budget')}`;
  text += `\nMessage : ${f('message')}`;
  return text;
}
function sendWhatsApp() {
  const form = document.querySelector('.contact-form');
  if (!form.reportValidity()) return;
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
  btn.disabled = true;
  btn.textContent = 'Envoi en cours…';
  const data = {};
  new FormData(form).forEach((v, k) => { if (k !== 'botcheck') data[k] = v; });
  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (res.ok && json.success) {
      form.reset();
      status.className = 'form-status ok';
      status.textContent = 'Merci ! Votre message a bien été envoyé. Nous vous répondons rapidement à l\'adresse indiquée.';
    } else {
      throw new Error(json.message || 'Erreur');
    }
  } catch (err) {
    status.className = 'form-status err';
    status.textContent = 'L\'envoi a échoué. Réessayez, ou écrivez-nous sur WhatsApp ou à direction@silamana.com.';
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
