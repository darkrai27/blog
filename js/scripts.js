/* Reverse Log — theme + language controls */
(function () {
  'use strict';

  const STORAGE_THEME = 'reverse-log-theme';
  const STORAGE_LANG = 'reverse-log-lang';

  function getStoredTheme() {
    try {
      return localStorage.getItem(STORAGE_THEME);
    } catch (e) {
      return null;
    }
  }

  function getStoredLang() {
    try {
      return localStorage.getItem(STORAGE_LANG);
    } catch (e) {
      return null;
    }
  }

  function applyTheme(theme) {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }
    const btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.setAttribute('aria-pressed', String(theme === 'dark'));
      btn.setAttribute('aria-label', theme === 'dark' ? 'Cambiar a modo claro / Switch to light mode' : 'Cambiar a modo oscuro / Switch to dark mode');
      const esLabel = btn.querySelector('.lang-inline.lang-es');
      const enLabel = btn.querySelector('.lang-inline.lang-en');
      if (esLabel && enLabel) {
        esLabel.textContent = theme === 'dark' ? 'Claro' : 'Oscuro';
        enLabel.textContent = theme === 'dark' ? 'Light' : 'Dark';
      }
    }
  }

  function applyLang(lang) {
    const root = document.documentElement;
    root.setAttribute('data-lang', lang);
    root.setAttribute('lang', lang);
    try {
      localStorage.setItem(STORAGE_LANG, lang);
    } catch (e) {}
    const btn = document.getElementById('lang-toggle');
    if (btn) {
      btn.setAttribute('aria-label', lang === 'es' ? 'Switch to English' : 'Cambiar a español');
      const esLabel = btn.querySelector('.lang-es');
      const enLabel = btn.querySelector('.lang-en');
      if (esLabel && enLabel) {
        esLabel.textContent = lang === 'es' ? 'EN' : 'ES';
        enLabel.textContent = lang === 'es' ? 'EN' : 'ES';
      }
    }
  }

  function initTheme() {
    let theme = getStoredTheme();
    if (!theme) {
      theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    applyTheme(theme);
  }

  function initLang() {
    const lang = getStoredLang() || 'es';
    applyLang(lang);
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try {
      localStorage.setItem(STORAGE_THEME, next);
    } catch (e) {}
  }

  function toggleLang() {
    const current = document.documentElement.getAttribute('data-lang') || 'es';
    const next = current === 'es' ? 'en' : 'es';
    applyLang(next);
  }

  /* Article metadata for read-more sections */
  var ARTICLES = [
    {
      url: 'LVR-bypass.html',
      date: '12 Jul 2026',
      category: 'Bots',
      titleEs: 'Evitando Akamai 403 rate limits en la mayor boutique de Italia',
      titleEn: 'Bypassing Akamai 403 rate limits in the largest online Italian boutique',
      descEs: 'Analizando técnicas para evadir los rate limits de Akamai en LVR, la mayor boutique de lujo italiana, explotando un endpoint de envío de regalos sin protección.',
      descEn: 'Analyzing techniques to bypass Akamai rate limits on LVR, Italy\'s largest luxury boutique, by exploiting an unprotected gift-sending endpoint.'
    },
    {
      url: 'sneaker-bot.html',
      date: '16 May 2026',
      category: 'Bots',
      titleEs: 'Revolucionando la industria del "sneaker botting".',
      titleEn: 'Evolving the sneaker botting industry.',
      descEs: 'Analizando las estrategias y técnicas para construir un producto exitoso y su evolución.',
      descEn: 'Analyzing the strategies and techniques for building a successful product and its evolution.'
    },
    {
      url: 'PX-bypass.html',
      date: '12 may 2026',
      category: 'WAF',
      titleEs: 'Eludiendo Perimeter-X y su "Press & Hold" Captcha',
      titleEn: 'Bypassing Perimeter-X\'s "Press & Hold" captcha',
      descEs: 'Explorando técnicas para eludir la protección Perimeter-X en dos de los mayores retailers europeos.',
      descEn: 'Exploring techniques to bypass Perimeter-X protection on two of the largest European retailers.'
    }
  ];

  function renderArticleList() {
    var target = document.getElementById('article-list-target');
    if (!target) return;

    var html = '';
    for (var i = 0; i < ARTICLES.length; i++) {
      var a = ARTICLES[i];
      var parts = a.date.split(' ');
      var shortDate = parts[0] + ' ' + parts[1].toLowerCase();
      html += '<article class="log-row">' +
        '<span class="meta num">' + shortDate + '</span>' +
        '<div>' +
        '<a href="articles/' + a.url + '"><h3 class="lang-es">' + a.titleEs + '</h3></a>' +
        '<a href="articles/' + a.url + '"><h3 class="lang-en">' + a.titleEn + '</h3></a>' +
        '<p class="lang-es" style="margin: 4px 0 0; color: var(--muted); font-size: 14px;">' + a.descEs + '</p>' +
        '<p class="lang-en" style="margin: 4px 0 0; color: var(--muted); font-size: 14px;">' + a.descEn + '</p>' +
        '</div>' +
        '<span class="pull meta">' + a.category + '</span>' +
        '</article>';
    }
    target.innerHTML = html;
  }

  function renderReadMore() {
    var target = document.getElementById('read-more-target');
    if (!target) return;

    var path = window.location.pathname;
    var currentFile = path.substring(path.lastIndexOf('/') + 1);

    var others = [];
    for (var i = 0; i < ARTICLES.length; i++) {
      var a = ARTICLES[i];
      var urlFile = a.url.substring(a.url.lastIndexOf('/') + 1);
      if (urlFile !== currentFile) {
        others.push(a);
      }
    }

    if (others.length === 0) {
      target.remove();
      return;
    }

    var html = '<section class="section" data-od-id="read-more">' +
      '<div class="container">' +
      '<h2 style="margin-bottom: 32px;">' +
      '<span class="lang-inline lang-es">M\u00e1s art\u00edculos</span>' +
      '<span class="lang-inline lang-en">More articles</span>' +
      '</h2>' +
      '<div class="grid-2">';

    for (var j = 0; j < others.length; j++) {
      var art = others[j];
      html += '<a href="' + art.url + '" class="read-more-card">' +
        '<p class="meta">' + art.date + ' \u00b7 ' + art.category + '</p>' +
        '<h3 class="lang-es">' + art.titleEs + '</h3>' +
        '<h3 class="lang-en">' + art.titleEn + '</h3>' +
        '<p class="lang-es">' + art.descEs + '</p>' +
        '<p class="lang-en">' + art.descEn + '</p>' +
        '</a>';
    }

    html += '</div></div></section>';
    target.insertAdjacentHTML('afterend', html);
    target.remove();
  }

  document.addEventListener('DOMContentLoaded', function () {
    initTheme();
    initLang();

    const themeBtn = document.getElementById('theme-toggle');
    const langBtn = document.getElementById('lang-toggle');

    if (themeBtn) themeBtn.addEventListener('click', toggleTheme);
    if (langBtn) langBtn.addEventListener('click', toggleLang);

    renderReadMore();
    renderArticleList();
  });

  // Apply theme as early as possible to avoid flash.
  initTheme();
  initLang();
})();
