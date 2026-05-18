// LockLab — Contact form (POST /api/contact)
(function () {
  "use strict";

  const ICONS = window.LOCKLAB_ICONS;
  // Relative path works on GitHub Pages subpaths and on normal hosting
  const API_BASE = "./api";

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function attach(ctx) {
    const form = document.getElementById("contact-form");
    const submitBtn = document.getElementById("contact-submit-btn");
    const successEl = document.getElementById("contact-success");
    const errorEl = document.getElementById("contact-error");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const tr = ctx.getT();
      const data = new FormData(form);
      const payload = {
        name: (data.get("name") || "").toString().trim(),
        phone: (data.get("phone") || "").toString().trim(),
        service: (data.get("service") || "").toString(),
        address: (data.get("address") || "").toString().trim(),
        message: (data.get("message") || "").toString().trim(),
        locale: window.LockLabApp ? window.LockLabApp.getState().locale : "pl",
      };
      if (!payload.name || !payload.phone) return;

      // Map service key -> localized title for telegram readability
      const titles = tr.services.items;
      if (payload.service && titles[payload.service]) {
        payload.service = titles[payload.service].title;
      }

      successEl.hidden = true;
      errorEl.hidden = true;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `${ICONS.send}<span>${esc(tr.contact.sending)}</span>`;

      try {
        const res = await fetch(API_BASE + "/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          throw new Error("HTTP " + res.status);
        }
        await res.json();
        successEl.textContent = "";
        successEl.appendChild(makeIcon(ICONS.check));
        const t1 = document.createElement("span");
        t1.textContent = tr.contact.success;
        successEl.appendChild(t1);
        successEl.hidden = false;
        form.reset();
      } catch (err) {
        errorEl.textContent = tr.contact.error;
        errorEl.hidden = false;
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `${ICONS.send}<span data-submit-label>${esc(
          tr.contact.submit,
        )}</span>`;
      }
    });
  }

  function makeIcon(svgStr) {
    const wrap = document.createElement("span");
    wrap.innerHTML = svgStr;
    return wrap.firstChild;
  }

  window.LockLabContact = { attach };
})();
