// LockLab — Main app (vanilla JS)
(function () {
  "use strict";

  const I18N = window.LOCKLAB_I18N;
  const ICONS = window.LOCKLAB_ICONS;
  const CONTACT = window.LOCKLAB_CONTACT;
  const SERVICE_KEYS = ["auto", "door", "ignition", "replace"];
  const SERVICE_ICONS = { auto: "car", door: "door", ignition: "key", replace: "wrench" };
  const SERVICE_IMAGES = {
    auto: "https://images.unsplash.com/photo-1610374634235-b51ef357f905?crop=entropy&cs=srgb&fm=jpg&q=85",
    door: "https://images.unsplash.com/photo-1575908539614-ff89490f4a78?crop=entropy&cs=srgb&fm=jpg&q=85",
    ignition: "https://images.unsplash.com/photo-1541702467897-41915a07d3a7?crop=entropy&cs=srgb&fm=jpg&q=85",
    replace: "https://images.unsplash.com/photo-1521159936751-ff7c25fd187b?crop=entropy&cs=srgb&fm=jpg&q=85",
  };
  const STORAGE_KEY = "locklab.locale";

  const state = {
    locale: getInitialLocale(),
    mobileOpen: false,
    searchOpen: false,
  };

  function getInitialLocale() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && I18N.locales.includes(stored)) return stored;
    } catch (_) {}
    return "pl";
  }

  function t() {
    return I18N.get(state.locale);
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      }[c];
    });
  }

  function el(id) {
    return document.getElementById(id);
  }

  // -----------------------------------------------------------------
  // Renderers
  // -----------------------------------------------------------------
  function renderHeader() {
    const tr = t();
    el("logo-img").src = CONTACT.logo;

    // Desktop nav
    const nav = el("nav-desktop");
    nav.innerHTML = ["services", "about", "reviews", "contact"]
      .map(
        (id) =>
          `<button data-testid="nav-${id}-btn" data-scroll="${id}">${esc(
            tr.nav[id],
          )}</button>`,
      )
      .join("");

    // Mobile nav
    const mnav = el("mobile-nav");
    mnav.innerHTML = ["services", "about", "reviews", "contact"]
      .map(
        (id) =>
          `<button data-testid="mobile-nav-${id}-btn" data-scroll="${id}" data-close-mobile>${esc(
            tr.nav[id],
          )}</button>`,
      )
      .join("");

    // Language switchers
    const langDesktop = el("lang-switcher");
    const langMobile = el("mobile-lang");
    const langHtml = I18N.locales
      .map(
        (loc) =>
          `<button data-locale="${loc}" data-testid="lang-switch-${loc}" class="${
            loc === state.locale ? "is-active" : ""
          }">${I18N.labels[loc]}</button>`,
      )
      .join("");
    langDesktop.innerHTML = langHtml;
    langMobile.innerHTML = I18N.locales
      .map(
        (loc) =>
          `<button data-locale="${loc}" data-testid="mobile-lang-switch-${loc}" class="${
            loc === state.locale ? "is-active" : ""
          }">${I18N.labels[loc]}</button>`,
      )
      .join("");

    // Search trigger
    el("open-search-btn").innerHTML = ICONS.search;
    el("open-search-btn").setAttribute("aria-label", tr.nav.open_search);

    // Menu toggle
    el("menu-toggle").innerHTML = state.mobileOpen ? ICONS.close : ICONS.menu;
    el("menu-toggle").setAttribute(
      "aria-label",
      state.mobileOpen ? tr.nav.close_menu : tr.nav.open_menu,
    );

    // Header call CTA
    el("header-call").href = CONTACT.phoneHref;
    el("header-call").innerHTML = `${ICONS.phone}<span>${esc(
      CONTACT.phone,
    )}</span>`;

    // Mobile call CTA
    el("mobile-call").href = CONTACT.phoneHref;
    el("mobile-call").innerHTML = `${ICONS.phone}<span>${esc(
      CONTACT.phone,
    )}</span>`;
  }

  function renderHero() {
    const tr = t();
    el("hero-eyebrow").textContent = tr.hero.eyebrow;
    el("hero-title-1").textContent = tr.hero.title_1;
    el("hero-title-2").textContent = tr.hero.title_2;
    el("hero-title-3").textContent = tr.hero.title_3;
    el("hero-sub").textContent = tr.hero.subtitle;
    el("hero-call-btn").href = CONTACT.phoneHref;
    el("hero-call-btn").innerHTML = `${ICONS.phone}<span>${esc(
      tr.hero.cta_call,
    )} · ${esc(CONTACT.phone)}</span>`;
    el("hero-form-btn").innerHTML = `<span>${esc(tr.hero.cta_form)}</span>${
      ICONS.arrowRight
    }`;

    el("hero-meta").innerHTML = `
      <span>${ICONS.mapPin}<span>Warszawa</span></span>
      <span class="dot-sep" aria-hidden="true"></span>
      <span>${ICONS.clock}<span>24 / 7</span></span>
    `;

    // Stats panel
    el("hero-stats-label").textContent = tr.hero.live_status;
    el("hero-stats-grid").innerHTML = [
      {
        id: "response",
        v: tr.hero.stat_response_value,
        l: tr.hero.stat_response,
      },
      { id: "jobs", v: tr.hero.stat_jobs_value, l: tr.hero.stat_jobs },
      { id: "rating", v: tr.hero.stat_rating_value, l: tr.hero.stat_rating },
      { id: "hours", v: tr.hero.stat_hours_value, l: tr.hero.stat_hours },
    ]
      .map(
        (s) => `
        <div class="stat" data-testid="stat-${s.id}">
          <div class="stat__value">${esc(s.v)}</div>
          <div class="stat__label">${esc(s.l)}</div>
        </div>
      `,
      )
      .join("");

    // Chart bars (animated by IntersectionObserver via inline style)
    const heights = [40, 60, 35, 78, 52, 88, 70, 95, 64, 82, 58, 90];
    el("hero-chart").innerHTML = heights
      .map(
        (h, i) =>
          `<span style="height:0;transition-delay:${i * 0.04}s" data-grow-to="${h}%"></span>`,
      )
      .join("");
    el("hero-chart-caption").textContent = tr.hero.chart_caption;

    // Ticker (build once but re-translatable — keep static set of words)
    const words = [
      "Otwieranie 24/7",
      "Bez uszkodzeń",
      "Warszawa",
      "Klucze z immo",
      "Wymiana wkładek",
      "Stacyjki",
      "Faktura VAT",
    ];
    const buildGroup = () =>
      words
        .map(
          (w) =>
            `<span>${esc(w)}</span><span class="slash">/</span>`,
        )
        .join("");
    el("ticker").innerHTML = buildGroup() + buildGroup() + buildGroup() + buildGroup();
  }

  function renderServices() {
    const tr = t();
    el("services-eyebrow").textContent = tr.services.eyebrow;
    el("services-title").textContent = tr.services.title;
    el("services-count").innerHTML = `<span class="accent">04</span> / 04 ${esc(
      tr.services.services_count,
    )}`;
    el("services-grid").innerHTML = SERVICE_KEYS.map((k, i) => {
      const s = tr.services.items[k];
      return `
        <article class="service reveal" data-testid="service-card-${k}">
          <div class="service__bg"><img src="${SERVICE_IMAGES[k]}" alt=""></div>
          <span class="service__corner">+</span>
          <div class="service__index">0${i + 1} — service</div>
          <div class="service__body">
            <div class="service__icon">${ICONS[SERVICE_ICONS[k]]}</div>
            <h3 class="service__title">${esc(s.title)}</h3>
            <p class="service__desc">${esc(s.description)}</p>
            <ul class="service__list">
              ${s.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}
            </ul>
            <button class="service__cta" data-scroll="contact" data-testid="service-cta-${k}">
              <span>${esc(tr.services.learn_more)}</span>${ICONS.arrowRight}
            </button>
          </div>
        </article>
      `;
    }).join("");
  }

  function renderAbout() {
    const tr = t();
    el("about-eyebrow").textContent = tr.about.eyebrow;
    el("about-title").textContent = tr.about.title;
    el("about-paragraph").textContent = tr.about.paragraph;
    el("about-metric-label").textContent = tr.about.metric_label;
    el("about-metric-years-cap").textContent = tr.about.metric_years;
    el("about-metric-hours-cap").textContent = tr.about.metric_hours;
    el("about-points").innerHTML = tr.about.points
      .map(
        (p) => `
        <div class="point reveal" data-testid="about-point-${esc(p.k)}">
          <div class="point__num">${esc(p.k)}</div>
          <h3 class="point__title">${esc(p.title)}</h3>
          <p class="point__body">${esc(p.body)}</p>
        </div>
      `,
      )
      .join("");
  }

  function renderReviews() {
    const tr = t();
    el("reviews-eyebrow").textContent = tr.reviews.eyebrow;
    el("reviews-title").textContent = tr.reviews.title;
    el("reviews-stars").innerHTML =
      Array.from({ length: 5 })
        .map(() => ICONS.star)
        .join("") +
      `<span class="reviews__score">4.9 · 312</span>`;

    el("reviews-grid").innerHTML = tr.reviews.items
      .map(
        (r, i) => `
        <figure class="review reveal" data-testid="review-card-${i}">
          <span class="review__quote">${ICONS.quote}</span>
          <div class="review__stars">${Array.from({ length: r.stars })
            .map(() => ICONS.star)
            .join("")}</div>
          <blockquote class="review__text">“${esc(r.text)}”</blockquote>
          <figcaption class="review__foot">
            <div class="review__name">${esc(r.name)}</div>
            <div class="review__role">${esc(r.role)}</div>
          </figcaption>
        </figure>
      `,
      )
      .join("");
  }

  function renderContact() {
    const tr = t();
    el("contact-eyebrow").textContent = tr.contact.eyebrow;
    el("contact-title").textContent = tr.contact.title;
    el("contact-subtitle").textContent = tr.contact.subtitle;

    // Info cards
    el("contact-phone-link").href = CONTACT.phoneHref;
    el("contact-phone-link").innerHTML = `
      ${ICONS.phone}
      <div>
        <div class="label">${esc(tr.contact.info_title)}</div>
        <div class="value">${esc(CONTACT.phone)}</div>
      </div>
    `;
    el("contact-email-link").href = CONTACT.emailHref;
    el("contact-email-link").innerHTML = `
      ${ICONS.mail}
      <div>
        <div class="label">${esc(tr.contact.info_email)}</div>
        <div class="value">${esc(CONTACT.email)}</div>
      </div>
    `;
    el("contact-address-link").href = CONTACT.mapHref;
    el("contact-address-link").innerHTML = `
      ${ICONS.mapPin}
      <div>
        <div class="label">${esc(tr.contact.info_address)}</div>
        <div class="value">${esc(CONTACT.addressLine1)}<br>${esc(
          CONTACT.addressLine2,
        )}</div>
      </div>
    `;
    el("contact-hours").innerHTML = `${ICONS.clock}<span>${esc(
      tr.contact.hours,
    )} · ${esc(CONTACT.hours)}</span>`;

    // Form labels & placeholders
    document.querySelectorAll("[data-i18n-label]").forEach((node) => {
      const key = node.getAttribute("data-i18n-label");
      const value = key.split(".").reduce((o, k) => (o ? o[k] : null), tr);
      if (value) node.textContent = value;
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
      const key = node.getAttribute("data-i18n-placeholder");
      const value = key.split(".").reduce((o, k) => (o ? o[k] : null), tr);
      if (value) node.placeholder = value;
    });

    // Service options
    const select = el("contact-service-select");
    select.innerHTML =
      `<option value="">${esc(tr.contact.placeholders.service)}</option>` +
      SERVICE_KEYS.map(
        (k) =>
          `<option value="${k}">${esc(tr.services.items[k].title)}</option>`,
      ).join("");

    el("contact-consent").textContent = tr.contact.consent;

    const submitBtn = el("contact-submit-btn");
    submitBtn.innerHTML = `${ICONS.send}<span data-submit-label>${esc(
      tr.contact.submit,
    )}</span>`;
  }

  function renderFooter() {
    const tr = t();
    el("footer-logo").src = CONTACT.logo;
    el("footer-tagline").textContent = tr.footer.tagline;
    el("footer-phone-link").href = CONTACT.phoneHref;
    el("footer-phone-link").innerHTML = `${ICONS.phone}<span>${esc(
      CONTACT.phone,
    )}</span>`;

    el("footer-services-title").textContent = tr.footer.sections;
    el("footer-services-list").innerHTML = SERVICE_KEYS.map(
      (k) =>
        `<li><button data-scroll="services">${esc(
          tr.services.items[k].title,
        )}</button></li>`,
    ).join("");

    el("footer-company-title").textContent = tr.footer.company;
    el("footer-company-list").innerHTML = [
      { id: "about", label: tr.nav.about },
      { id: "reviews", label: tr.nav.reviews },
      { id: "contact", label: tr.nav.contact },
    ]
      .map(
        (x) =>
          `<li><button data-scroll="${x.id}">${esc(x.label)}</button></li>`,
      )
      .join("");

    el("footer-contact-title").textContent = tr.footer.contact;
    el("footer-contact-list").innerHTML = `
      <li>${ICONS.mapPin}<span>${esc(CONTACT.addressLine1)}<br>${esc(
      CONTACT.addressLine2,
    )}</span></li>
      <li>${ICONS.mail}<span>${esc(CONTACT.email)}</span></li>
    `;

    el("footer-legal").textContent = tr.footer.legal.replace(
      "{year}",
      new Date().getFullYear(),
    );
  }

  function renderSticky() {
    const tr = t();
    const callBtn = el("sticky-call-btn");
    callBtn.href = CONTACT.phoneHref;
    callBtn.innerHTML = `${ICONS.phone}<span>${esc(tr.sticky.call)}</span>`;
    el(
      "sticky-form-btn",
    ).innerHTML = `${ICONS.send}<span>${esc(tr.sticky.form)}</span>`;
  }

  function renderSearchStatic() {
    const tr = t();
    el("search-input").placeholder = tr.nav.search_placeholder;
    el("search-close-btn").innerHTML = ICONS.close;
    el("search-label").textContent = tr.search.title;
    el("search-hint").textContent = tr.search.hint;
    el("search-empty").textContent = tr.search.empty;
  }

  function renderAll() {
    renderHeader();
    renderHero();
    renderServices();
    renderAbout();
    renderReviews();
    renderContact();
    renderFooter();
    renderSticky();
    renderSearchStatic();
    document.documentElement.lang = state.locale;
    document.title = t().meta.title;
  }

  // -----------------------------------------------------------------
  // Behavior: language, scroll, mobile menu
  // -----------------------------------------------------------------
  function setLocale(loc) {
    if (!I18N.locales.includes(loc) || loc === state.locale) return;
    state.locale = loc;
    try {
      localStorage.setItem(STORAGE_KEY, loc);
    } catch (_) {}
    renderAll();
    setupReveal(); // re-attach observer to newly rendered .reveal elements
    growChartBars();
  }

  function scrollToId(id) {
    const target = document.getElementById(id);
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function setMobileOpen(open) {
    state.mobileOpen = open;
    const menu = el("mobile-menu");
    menu.classList.toggle("is-open", open);
    document.body.classList.toggle("no-scroll", open);
    const tr = t();
    const btn = el("menu-toggle");
    btn.innerHTML = open ? ICONS.close : ICONS.menu;
    btn.setAttribute("aria-label", open ? tr.nav.close_menu : tr.nav.open_menu);
  }

  function bindGlobalClicks() {
    document.body.addEventListener("click", (e) => {
      const scrollEl = e.target.closest("[data-scroll]");
      if (scrollEl) {
        const id = scrollEl.getAttribute("data-scroll");
        if (scrollEl.hasAttribute("data-close-mobile")) setMobileOpen(false);
        scrollToId(id);
        return;
      }
      const localeEl = e.target.closest("[data-locale]");
      if (localeEl) {
        setLocale(localeEl.getAttribute("data-locale"));
        return;
      }
    });

    el("menu-toggle").addEventListener("click", () => {
      setMobileOpen(!state.mobileOpen);
    });

    el("logo-home-btn").addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // -----------------------------------------------------------------
  // Scroll-state header + reveal animations
  // -----------------------------------------------------------------
  function setupScrollState() {
    const header = el("site-header");
    const onScroll = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 20);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  let revealObserver;
  function setupReveal() {
    if (revealObserver) revealObserver.disconnect();
    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "-60px 0px", threshold: 0.1 },
    );
    document
      .querySelectorAll(".reveal, .reveal-stagger")
      .forEach((node) => revealObserver.observe(node));
  }

  function growChartBars() {
    setTimeout(() => {
      document.querySelectorAll("#hero-chart [data-grow-to]").forEach((n) => {
        n.style.height = n.getAttribute("data-grow-to");
      });
    }, 250);
  }



  function setupLockScrollBackground() {
    const frame = document.getElementById("lock-scroll-frame");
    const progressBar = document.getElementById("lock-scroll-progress");
    if (!frame) return;

    const totalFrames = 151;
    const framePath = (index) => {
      const num = String(index).padStart(3, "0");
      return `/assets/lock-animation/ezgif-frame-${num}.jpg`;
    };

    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
    let currentFrame = 1;
    let ticking = false;

    // Preload every frame from the archive so the scroll animation stays smooth.
    for (let i = 1; i <= totalFrames; i += 1) {
      const img = new Image();
      img.src = framePath(i);
    }

    const update = () => {
      ticking = false;
      const doc = document.documentElement;
      const maxScroll = Math.max(1, doc.scrollHeight - window.innerHeight);
      const progress = clamp(window.scrollY / maxScroll, 0, 1);
      const nextFrame = Math.round(1 + progress * (totalFrames - 1));

      if (nextFrame !== currentFrame) {
        currentFrame = nextFrame;
        frame.src = framePath(nextFrame);
      }

      if (progressBar) {
        progressBar.style.width = `${Math.round(progress * 100)}%`;
      }
    };

    const requestUpdate = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
  }

  // -----------------------------------------------------------------
  // Boot
  // -----------------------------------------------------------------
  document.addEventListener("DOMContentLoaded", () => {
    renderAll();
    bindGlobalClicks();
    setupScrollState();
    setupReveal();
    setupLockScrollBackground();
    growChartBars();

    // Hand-off to other modules
    if (window.LockLabSearch) window.LockLabSearch.attach({ state, getT: t });
    if (window.LockLabContact) window.LockLabContact.attach({ getT: t });
  });

  // Expose minimal API for other modules
  window.LockLabApp = {
    getState: () => state,
    getT: t,
  };
})();
