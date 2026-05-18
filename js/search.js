// LockLab — Site search (diacritic-tolerant)
(function () {
  "use strict";

  const ICONS = window.LOCKLAB_ICONS;

  function normalize(s) {
    return (s == null ? "" : String(s))
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "");
  }

  function buildIndex(tr) {
    const items = [];
    Object.entries(tr.services.items).forEach(([key, svc]) => {
      items.push({
        id: "service-" + key,
        section: tr.nav.services,
        title: svc.title,
        body: svc.description,
        target: "services",
        keywords: normalize(
          [svc.title, svc.description, ...(svc.bullets || [])].join(" "),
        ),
      });
    });
    items.push({
      id: "about",
      section: tr.nav.about,
      title: tr.about.title,
      body: tr.about.paragraph,
      target: "about",
      keywords: normalize(tr.about.title + " " + tr.about.paragraph),
    });
    tr.about.points.forEach((p) => {
      items.push({
        id: "about-" + p.k,
        section: tr.nav.about,
        title: p.title,
        body: p.body,
        target: "about",
        keywords: normalize(p.title + " " + p.body),
      });
    });
    tr.reviews.items.forEach((r, i) => {
      items.push({
        id: "review-" + i,
        section: tr.nav.reviews,
        title: r.name + " · " + r.role,
        body: r.text,
        target: "reviews",
        keywords: normalize(r.name + " " + r.role + " " + r.text),
      });
    });
    items.push({
      id: "contact",
      section: tr.nav.contact,
      title: tr.contact.title,
      body: tr.contact.subtitle,
      target: "contact",
      keywords: normalize(tr.contact.title + " " + tr.contact.subtitle),
    });
    return items;
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

  function attach(ctx) {
    const overlay = document.getElementById("search-overlay");
    const input = document.getElementById("search-input");
    const list = document.getElementById("search-results");
    const hint = document.getElementById("search-hint");
    const empty = document.getElementById("search-empty");
    const closeBtn = document.getElementById("search-close-btn");
    const openBtn = document.getElementById("open-search-btn");

    function open() {
      overlay.classList.add("is-open");
      input.value = "";
      render();
      document.body.classList.add("no-scroll");
      setTimeout(() => input.focus(), 80);
    }

    function close() {
      overlay.classList.remove("is-open");
      document.body.classList.remove("no-scroll");
    }

    function render() {
      const tr = ctx.getT();
      const q = normalize(input.value.trim());
      list.hidden = true;
      empty.hidden = true;
      hint.hidden = true;
      list.innerHTML = "";

      if (!q) {
        hint.hidden = false;
        return;
      }

      const tokens = q.split(/\s+/).filter(Boolean);
      const index = buildIndex(tr);
      const results = index
        .filter((it) => tokens.every((tok) => it.keywords.includes(tok)))
        .slice(0, 8);

      if (results.length === 0) {
        empty.hidden = false;
        return;
      }

      list.hidden = false;
      list.innerHTML = results
        .map(
          (r) => `
          <li>
            <button class="search-result" data-target="${esc(r.target)}" data-testid="search-result-${esc(r.id)}">
              <span class="search-result__section">${esc(r.section)}</span>
              <span class="search-result__body">
                <span class="search-result__title">${esc(r.title)}</span>
                <span class="search-result__desc">${esc(r.body)}</span>
              </span>
              <span class="search-result__arrow">${ICONS.arrowUpRight}</span>
            </button>
          </li>
        `,
        )
        .join("");
    }

    openBtn.addEventListener("click", open);
    closeBtn.addEventListener("click", close);
    input.addEventListener("input", render);

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) close();
    });

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && overlay.classList.contains("is-open")) {
        close();
      }
    });

    list.addEventListener("click", (e) => {
      const btn = e.target.closest(".search-result");
      if (!btn) return;
      const target = btn.getAttribute("data-target");
      close();
      setTimeout(() => {
        const node = document.getElementById(target);
        if (node) node.scrollIntoView({ behavior: "smooth" });
      }, 120);
    });
  }

  window.LockLabSearch = { attach };
})();
