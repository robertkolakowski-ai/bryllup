/* =========================================================
   Felles oppførsel for hele nettstedet.
   Alt er progressivt: uten JS fungerer sidene fortsatt som
   vanlige dokumenter, og RSVP-skjemaet kan sendes som e-post.
   ========================================================= */
(function () {
  'use strict';

  var CFG = window.WEDDING || {};

  /* Kort hjelper for tekst som lages i JavaScript. */
  function T(no, en) {
    return document.documentElement.getAttribute('data-lang') === 'en' ? en : no;
  }

  /* ---------- Header: fast bakgrunn så snart man scroller ---------- */
  var header = document.querySelector('.site-header');
  if (header) {
    var solid = function () {
      header.classList.toggle('is-solid', window.scrollY > 12);
    };
    solid();
    window.addEventListener('scroll', solid, { passive: true });
  }

  /* ---------- Mobilmeny ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.textContent = open ? T('Lukk', 'Close') : T('Meny', 'Menu');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A' && nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.textContent = T('Meny', 'Menu');
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.textContent = T('Meny', 'Menu');
        toggle.focus();
      }
    });
  }

  /* ---------- Marker gjeldende side i menyen ---------- */
  var here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav a[href]').forEach(function (a) {
    var target = a.getAttribute('href').split('#')[0];
    if (target && target === here) a.setAttribute('aria-current', 'page');
  });

  /* ---------- Nedtelling ---------- */
  var cdRoot = document.getElementById('countdown');
  if (cdRoot && CFG.dateISO) {
    var target = new Date(CFG.dateISO);
    var el = {
      d: document.getElementById('cd-days'),
      h: document.getElementById('cd-hours'),
      m: document.getElementById('cd-min'),
      s: document.getElementById('cd-sec')
    };
    var pad = function (n) { return String(n).padStart(2, '0'); };
    var tick = function () {
      var diff = target - new Date();
      if (diff <= 0) {
        cdRoot.innerHTML =
          '<div><div class="num"><span class="no">I dag!</span>' +
          '<span class="en">Today!</span></div>' +
          '<div class="lab"><span class="no">Vi gifter oss</span>' +
          '<span class="en">We are getting married</span></div></div>';
        clearInterval(timer);
        return;
      }
      if (el.d) el.d.textContent = Math.floor(diff / 86400000);
      if (el.h) el.h.textContent = pad(Math.floor(diff / 3600000) % 24);
      if (el.m) el.m.textContent = pad(Math.floor(diff / 60000) % 60);
      if (el.s) el.s.textContent = pad(Math.floor(diff / 1000) % 60);
    };
    tick();
    var timer = setInterval(tick, 1000);
  }

  /* ---------- Innhold som tones inn ved scroll ---------- */
  var reveals = document.querySelectorAll('[data-reveal]');
  if (reveals.length) {
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
      reveals.forEach(function (el) { io.observe(el); });
    } else {
      reveals.forEach(function (el) { el.classList.add('in'); });
    }
  }

  /* ---------- Kartlenker ---------- */
  document.querySelectorAll('[data-map-link]').forEach(function (a) {
    a.href = 'https://www.google.com/maps/search/?api=1&query=' +
      encodeURIComponent(CFG.mapQuery || CFG.venueName || '');
    a.target = '_blank';
    a.rel = 'noopener';
  });

  /* ---------- «Legg til i kalender» ---------- */
  function icsStamp(iso) {
    return new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  }
  document.querySelectorAll('[data-calendar]').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var ics = [
        'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//bryllup//NO',
        'BEGIN:VEVENT',
        'UID:' + Date.now() + '@bryllup',
        'DTSTAMP:' + icsStamp(new Date().toISOString()),
        'DTSTART:' + icsStamp(CFG.dateISO),
        'DTEND:' + icsStamp(CFG.endISO || CFG.dateISO),
        'SUMMARY:Bryllup — ' + (CFG.couple || ''),
        'LOCATION:' + [CFG.venueName, CFG.venueStreet, CFG.venuePostal].filter(Boolean).join(', '),
        'DESCRIPTION:Vi gleder oss til å feire med dere! / We can\'t wait to celebrate with you!',
        'END:VEVENT', 'END:VCALENDAR'
      ].join('\r\n');
      var blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'bryllup-alexander-og-tonje.ics';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    });
  });

  /* ---------- Språkvalg / Language ---------- */
  var LANG_KEY = 'bryllup-lang';
  var root = document.documentElement;

  function currentLang() {
    return root.getAttribute('data-lang') === 'en' ? 'en' : 'no';
  }

  function applyLang(lang) {
    root.setAttribute('data-lang', lang);
    root.setAttribute('lang', lang === 'en' ? 'en' : 'no');

    // Sidetittel
    var t = root.getAttribute('data-title-' + lang);
    if (t) document.title = t;

    // Attributter som må oversettes (placeholder, aria-label, alt, value ...)
    document.querySelectorAll('[data-' + lang + '-placeholder]').forEach(function (el) {
      el.setAttribute('placeholder', el.getAttribute('data-' + lang + '-placeholder'));
    });
    document.querySelectorAll('[data-' + lang + '-label]').forEach(function (el) {
      var text = el.getAttribute('data-' + lang + '-label');
      // Bilder trenger alt-tekst; alt annet trenger aria-label.
      if (el.tagName === 'IMG') el.setAttribute('alt', text);
      else el.setAttribute('aria-label', text);
    });
    document.querySelectorAll('[data-' + lang + '-text]').forEach(function (el) {
      el.textContent = el.getAttribute('data-' + lang + '-text');
    });

    // Knappene i språkvelgeren
    document.querySelectorAll('.lang-switch button').forEach(function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-lang') === lang ? 'true' : 'false');
    });

    // Menyknappen på mobil
    var t2 = document.querySelector('.nav-toggle');
    if (t2 && t2.getAttribute('aria-expanded') !== 'true') {
      t2.textContent = lang === 'en' ? 'Menu' : 'Meny';
    }

    fillConfigText();
    try { localStorage.setItem(LANG_KEY, lang); } catch (err) { /* privat modus */ }
  }

  document.querySelectorAll('.lang-switch button').forEach(function (b) {
    b.addEventListener('click', function () { applyLang(b.getAttribute('data-lang')); });
  });

  /* ---------- Tekst som fylles fra config ---------- */
  function fillConfigText() {
    var lang = currentLang();
    document.querySelectorAll('[data-cfg]').forEach(function (el) {
      var val = CFG;
      el.getAttribute('data-cfg').split('.').forEach(function (k) {
        val = (val && typeof val === 'object') ? val[k] : undefined;
      });
      if (val && typeof val === 'object') val = val[lang];
      if (val) el.textContent = val;
    });
    document.querySelectorAll('[data-cfg-href]').forEach(function (el) {
      var val = CFG;
      el.getAttribute('data-cfg-href').split('.').forEach(function (k) {
        val = (val && typeof val === 'object') ? val[k] : undefined;
      });
      if (val) el.setAttribute('href', val);
    });
    document.querySelectorAll('[data-cfg-mailto]').forEach(function (el) {
      var val = CFG;
      el.getAttribute('data-cfg-mailto').split('.').forEach(function (k) {
        val = (val && typeof val === 'object') ? val[k] : undefined;
      });
      if (val) { el.setAttribute('href', 'mailto:' + val); el.textContent = val; }
    });
  }

  applyLang(currentLang());

  /* ---------- Galleri-lightbox ---------- */
  var lb = document.querySelector('.lightbox');
  if (lb) {
    var lbBody = lb.querySelector('[data-lb-body]');
    var lbCap = lb.querySelector('.lb-caption');
    var lastFocus = null;

    var openLb = function (btn) {
      lastFocus = btn;
      var img = btn.querySelector('img');
      var caption = btn.getAttribute('data-caption') || '';
      if (img) {
        lbBody.innerHTML = '';
        var clone = new Image();
        clone.src = img.currentSrc || img.src;
        clone.alt = img.alt || '';
        lbBody.appendChild(clone);
      } else {
        lbBody.innerHTML = '<div class="lb-ph">' +
          (btn.getAttribute('data-caption') || 'Bilde kommer') + '</div>';
      }
      if (lbCap) lbCap.textContent = caption;
      lb.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      lb.querySelector('.lb-close').focus();
    };
    var closeLb = function () {
      lb.classList.remove('is-open');
      document.body.style.overflow = '';
      if (lastFocus) lastFocus.focus();
    };

    document.querySelectorAll('.tile-btn').forEach(function (btn) {
      btn.addEventListener('click', function () { openLb(btn); });
    });
    lb.querySelector('.lb-close').addEventListener('click', closeLb);
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lb.classList.contains('is-open')) closeLb();
    });
  }

  /* ---------- RSVP: dynamiske gjestefelt ---------- */
  var guestList = document.querySelector('[data-guest-list]');
  var addGuest = document.querySelector('[data-add-guest]');
  if (guestList && addGuest) {
    var addRow = function () {
      var n = guestList.children.length + 1;
      var row = document.createElement('div');
      row.className = 'guest-row';
      var ph = T('Navn på gjest ', 'Name of guest ') + n;
      row.innerHTML =
        '<input type="text" name="gjest_' + n + '" placeholder="' + ph + '" aria-label="' + ph + '">' +
        '<button type="button" class="remove" aria-label="' +
        T('Fjern gjest ', 'Remove guest ') + n + '">&times;</button>';
      row.querySelector('.remove').addEventListener('click', function () {
        row.remove();
      });
      guestList.appendChild(row);
      row.querySelector('input').focus();
    };
    addGuest.addEventListener('click', addRow);
  }

  /* ---------- RSVP: vis/skjul felt ut fra svar ---------- */
  var toggles = document.querySelectorAll('[data-toggle-target]');
  if (toggles.length) {
    var syncToggles = function () {
      var wanted = {};
      toggles.forEach(function (i) {
        var sel = i.getAttribute('data-toggle-target');
        if (!(sel in wanted)) wanted[sel] = false;
        if (i.checked && i.value === 'ja') wanted[sel] = true;
      });
      Object.keys(wanted).forEach(function (sel) {
        var el = document.querySelector(sel);
        if (el) el.hidden = !wanted[sel];
      });
    };
    toggles.forEach(function (i) { i.addEventListener('change', syncToggles); });
    syncToggles();
  }

  /* ---------- Skjemainnsending (RSVP, tale, kontakt) ---------- */
  document.querySelectorAll('form[data-form]').forEach(function (form) {
    var statusBox = form.parentElement.querySelector('[data-form-status]');

    var summarise = function () {
      var data = new FormData(form);
      var lines = [];
      data.forEach(function (v, k) {
        if (k === '_gotcha' || !String(v).trim()) return;
        lines.push(k.replace(/_/g, ' ') + ': ' + v);
      });
      return lines.join('\n');
    };

    var show = function (cls, title, html) {
      if (!statusBox) return;
      statusBox.className = 'form-status ' + cls;
      statusBox.innerHTML = '<h3>' + title + '</h3>' + html;
      statusBox.hidden = false;
      statusBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    form.addEventListener('submit', function (e) {
      // Honningkrukke: fylt ut = bot.
      if (form.querySelector('[name="_gotcha"]') &&
          form.querySelector('[name="_gotcha"]').value) {
        e.preventDefault();
        return;
      }

      var endpoint = CFG.rsvpEndpoint;
      if (!endpoint) {
        // Ingen backend satt opp ennå — send som e-post i stedet.
        e.preventDefault();
        var subject = encodeURIComponent(
          (form.getAttribute('data-subject') || 'Melding') + ' — bryllup ' + (CFG.couple || '')
        );
        var body = encodeURIComponent(summarise());
        var mail = 'mailto:' + (CFG.rsvpEmail || CFG.contactEmail || '') +
                   '?subject=' + subject + '&body=' + body;
        show('is-warn', T('Nesten i mål', 'Almost there'),
          '<p>' + T('Skjemaet er ikke koblet til en database ennå. Trykk under, så åpnes ' +
            'svaret ferdig utfylt i e-postprogrammet ditt.',
            'The form is not connected to a database yet. Tap below and your reply opens ' +
            'ready-filled in your email app.') + '</p>' +
          '<p style="margin-top:16px"><a class="btn btn-primary" href="' + mail + '">' +
          T('Send som e-post', 'Send as email') + '</a></p>');
        return;
      }

      // Backend er satt opp: send i bakgrunnen.
      e.preventDefault();
      var btn = form.querySelector('[type="submit"]');
      if (btn) { btn.disabled = true; btn.dataset.label = btn.textContent; btn.textContent = T('Sender \u2026', 'Sending \u2026'); }

      fetch(endpoint, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      }).then(function (res) {
        if (!res.ok) throw new Error('Feil fra skjematjenesten');
        form.hidden = true;
        show('is-ok', T('Tusen takk!', 'Thank you!'),
          '<p>' + T('Svaret ditt er registrert. Vi gleder oss allerede.',
                    'Your reply is registered. We are already looking forward to it.') + '</p>');
      }).catch(function () {
        if (btn) { btn.disabled = false; btn.textContent = btn.dataset.label || 'Send'; }
        show('is-warn', T('Noe gikk galt', 'Something went wrong'),
          '<p>' + T('Vi fikk ikke sendt svaret. Prøv igjen, eller send oss en e-post på ',
                    'We could not send your reply. Please try again, or email us at ') +
          '<a href="mailto:' + (CFG.contactEmail || '') + '">' + (CFG.contactEmail || '') + '</a>.</p>');
      });
    });
  });
})();
