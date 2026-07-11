/**
 * Theme, navigation, scroll reveal, contact form placeholder
 * UX rules aligned with ui-ux-pro-max checklist
 */
(function () {
  "use strict";

  const THEME_KEY = "hf-theme";

  function t(key, fallback) {
    return window.HF_I18N ? window.HF_I18N.t(key) : fallback;
  }

  /* ---------- Theme ---------- */
  function getPreferredTheme() {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved === "light" || saved === "dark") return saved;
    } catch (_) {
      /* ignore */
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    const metaLight = document.querySelector(
      'meta[name="theme-color"][media*="light"]'
    );
    const metaDark = document.querySelector(
      'meta[name="theme-color"][media*="dark"]'
    );
    if (metaLight)
      metaLight.setAttribute(
        "content",
        theme === "dark" ? "#07090f" : "#f5f5f7"
      );
    if (metaDark)
      metaDark.setAttribute(
        "content",
        theme === "dark" ? "#07090f" : "#f5f5f7"
      );
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (_) {
      /* ignore */
    }
  }

  function initTheme() {
    applyTheme(getPreferredTheme());
    const btn = document.getElementById("themeToggle");
    if (!btn) return;
    btn.addEventListener("click", () => {
      const current =
        document.documentElement.getAttribute("data-theme") || "light";
      applyTheme(current === "dark" ? "light" : "dark");
    });
  }

  /* ---------- Mobile nav ---------- */
  function initNav() {
    const toggle = document.getElementById("navToggle");
    const menu = document.getElementById("navMenu");
    if (!toggle || !menu) return;

    function setOpen(open) {
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      menu.classList.toggle("is-open", open);
      document.body.style.overflow = open ? "hidden" : "";
    }

    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") !== "true";
      setOpen(open);
    });

    menu.querySelectorAll("a[href^='#']").forEach((link) => {
      link.addEventListener("click", () => setOpen(false));
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setOpen(false);
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) setOpen(false);
    });
  }

  /* ---------- Active nav highlight ---------- */
  function initSectionSpy() {
    const links = Array.from(
      document.querySelectorAll('.nav-links a[href^="#"]')
    );
    const sections = links
      .map((a) => {
        const id = a.getAttribute("href").slice(1);
        return document.getElementById(id);
      })
      .filter(Boolean);

    if (!sections.length || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.id;
          links.forEach((link) => {
            link.classList.toggle(
              "is-active",
              link.getAttribute("href") === `#${id}`
            );
          });
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((sec) => observer.observe(sec));
  }

  /* ---------- Scroll reveal + stagger ---------- */
  function initReveal() {
    const els = document.querySelectorAll(".reveal");
    if (!els.length) return;

    // Stagger siblings inside common grids (~40ms)
    document
      .querySelectorAll(
        ".timeline, .edu-grid, .project-grid, .skills-grid, .pub-list, .two-col, .achieve-grid, .hero-inner"
      )
      .forEach((group) => {
        const children = group.querySelectorAll(":scope > .reveal, :scope > .card.reveal");
        children.forEach((child, i) => {
          child.style.setProperty("--delay", `${Math.min(i * 40, 200)}ms`);
        });
      });

    if (
      !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    els.forEach((el) => observer.observe(el));
  }

  /* ---------- Contact form (placeholder, no backend) ---------- */
  function setFieldError(input, errorEl, message) {
    if (!input || !errorEl) return;
    if (message) {
      input.classList.add("error");
      input.setAttribute("aria-invalid", "true");
      errorEl.hidden = false;
      errorEl.textContent = message;
    } else {
      input.classList.remove("error");
      input.removeAttribute("aria-invalid");
      errorEl.hidden = true;
      errorEl.textContent = "";
    }
  }

  function initContactForm() {
    const form = document.getElementById("contactForm");
    const status = document.getElementById("formStatus");
    if (!form || !status) return;

    const name = form.querySelector("#name");
    const email = form.querySelector("#email");
    const message = form.querySelector("#message");
    const nameErr = form.querySelector("#name-error");
    const emailErr = form.querySelector("#email-error");
    const messageErr = form.querySelector("#message-error");

    // Inline validate on blur (not keystroke)
    [
      [name, nameErr, "contact.form.errName", () => name && name.value.trim()],
      [
        email,
        emailErr,
        "contact.form.errEmail",
        () =>
          email &&
          email.value.trim() &&
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()),
      ],
      [
        message,
        messageErr,
        "contact.form.errMessage",
        () => message && message.value.trim(),
      ],
    ].forEach(([field, errEl, key, ok]) => {
      if (!field) return;
      field.addEventListener("blur", () => {
        if (!field.value.trim()) {
          setFieldError(field, errEl, null);
          return;
        }
        setFieldError(
          field,
          errEl,
          ok() ? null : t(key, "Invalid field")
        );
      });
      field.addEventListener("input", () => {
        if (field.classList.contains("error") && ok()) {
          setFieldError(field, errEl, null);
        }
      });
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const nameOk = name && name.value.trim();
      const emailOk =
        email &&
        email.value.trim() &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
      const messageOk = message && message.value.trim();

      setFieldError(
        name,
        nameErr,
        nameOk ? null : t("contact.form.errName", "Please enter your name.")
      );
      setFieldError(
        email,
        emailErr,
        emailOk
          ? null
          : t("contact.form.errEmail", "Please enter a valid email address.")
      );
      setFieldError(
        message,
        messageErr,
        messageOk
          ? null
          : t("contact.form.errMessage", "Please enter a message.")
      );

      if (!nameOk || !emailOk || !messageOk) {
        status.hidden = false;
        status.className = "form-status is-error";
        status.textContent = t(
          "contact.form.validation",
          "Please fill in all fields with a valid email."
        );
        const firstInvalid = !nameOk ? name : !emailOk ? email : message;
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      status.hidden = false;
      status.className = "form-status is-info";
      status.textContent = t(
        "contact.form.placeholder",
        "The form is not connected yet. Please email hwfan0930@gmail.com."
      );
      form.reset();
      setFieldError(name, nameErr, null);
      setFieldError(email, emailErr, null);
      setFieldError(message, messageErr, null);
    });

    window.addEventListener("languagechange", () => {
      if (status.hidden || !window.HF_I18N) return;
      if (status.classList.contains("is-info")) {
        status.textContent = window.HF_I18N.t("contact.form.placeholder");
      } else if (status.classList.contains("is-error")) {
        status.textContent = window.HF_I18N.t("contact.form.validation");
      }
    });
  }

  function boot() {
    initTheme();
    initNav();
    initSectionSpy();
    initReveal();
    initContactForm();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
