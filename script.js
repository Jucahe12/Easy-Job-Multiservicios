const WHATSAPP_PHONE = "573202095621";

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const yearEl = $("#year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

const header = $("#header");

window.addEventListener("scroll", () => {
  if (window.pageYOffset > 50) {
    header?.classList.add("scrolled");
  } else {
    header?.classList.remove("scrolled");
  }
});

const menuBtn = $("#menuBtn");
const navLinks = $("#navLinks");

menuBtn?.setAttribute("aria-expanded", "false");

menuBtn?.addEventListener("click", () => {
  navLinks?.classList.toggle("open");
  menuBtn?.setAttribute("aria-expanded", navLinks?.classList.contains("open"));
});

document.addEventListener("click", (e) => {
  if (navLinks?.classList.contains("open") &&
      !e.target.closest("#navLinks") &&
      !e.target.closest("#menuBtn")) {
    navLinks.classList.remove("open");
  }
});

$$("#navLinks a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks?.classList.remove("open");
  });
});

function initGalleryCarousel() {
  const track = $("#gcTrack");
  const filterBtns = $$(".gallery-filter-btn");
  if (!track || filterBtns.length === 0) return;

  const allItems = $$(".gallery-item");
  let currentFilter = "all";

  function applyFilter(filter) {
    currentFilter = filter;

    filterBtns.forEach(b => b.classList.remove("active"));
    const activeBtn = document.querySelector(`.gallery-filter-btn[data-filter="${filter}"]`);
    if (activeBtn) activeBtn.classList.add("active");

    allItems.forEach(item => {
      const category = item.dataset.category;
      item.classList.toggle("hidden", filter !== "all" && category !== filter);
    });

    track.scrollTo({ left: 0, behavior: "auto" });
    initCarouselWheelScroll(track);
  }

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => applyFilter(btn.dataset.filter));
  });

  applyFilter("all");
  initCarouselWheelScroll(track);
}

function initFAQ() {
  $$(".faq-item").forEach(item => {
    const question = item.querySelector(".faq-question");
    if (!question) return;

    question.addEventListener("click", () => {
      const isActive = item.classList.contains("active");
      $$(".faq-item").forEach(i => i.classList.remove("active"));
      if (!isActive) item.classList.add("active");
    });
  });
}

function initScrollAnimations() {
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      entry.target.classList.toggle("visible", entry.isIntersecting);
    });
  }, {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  });

  $$(".fade-in").forEach(el => fadeObserver.observe(el));

  $$(".grid-3 .service-card").forEach((el, i) => {
    el.style.transitionDelay = `${i * 100}ms`;
    fadeObserver.observe(el);
  });

  $$(".testimonials-grid .testimonial-card").forEach((el, i) => {
    el.style.transitionDelay = `${i * 150}ms`;
    fadeObserver.observe(el);
  });

  $$(".process-steps .process-step").forEach((el, i) => {
    el.style.transitionDelay = `${i * 120}ms`;
    fadeObserver.observe(el);
  });
}

function initFormValidation() {
  const form = $("#formCotizacion");
  if (!form) return;

  const inputs = form.querySelectorAll("input[required], select[required], textarea[required]");

  function validateField(field) {
    const value = field.value.trim();
    let isValid = true;

    if (!value) {
      isValid = false;
    } else if (field.type === "email") {
      isValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
    } else if (field.type === "tel" && !/^(\+?57)?[\s-]?[3][0-9]{9}$/.test(value.replace(/\s/g, ""))) {
      isValid = false;
    }

    field.classList.remove("invalid", "valid");
    const existingError = field.parentElement.querySelector(".field-error");
    if (existingError) existingError.remove();

    if (value && isValid) field.classList.add("valid");
    else if (value && !isValid) {
      field.classList.add("invalid");
      const error = document.createElement("span");
      error.className = "field-error";
      error.textContent = field.type === "email" ? "Correo inválido" : "Campo inválido";
      field.parentElement.appendChild(error);
    }

    return isValid;
  }

  inputs.forEach(input => {
    input.addEventListener("blur", () => validateField(input));
    input.addEventListener("input", () => {
      if (input.classList.contains("invalid")) validateField(input);
    });
  });
}

function initFormSubmit() {
  const form = $("#formCotizacion");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector("[type=submit]");
    if (submitBtn?.disabled) return;
    if (submitBtn) submitBtn.disabled = true;

    const nombre = $("#nombre")?.value.trim();
    const telefono = $("#telefono")?.value.trim();
    const email = $("#email")?.value.trim();
    const servicio = $("#servicio")?.value || "No especificado";
    const detalle = $("#detalle")?.value.trim();

    if (!nombre || !telefono) {
      const target = !nombre ? $("#nombre") : $("#telefono");
      const fieldName = !nombre ? "nombre" : "teléfono";
      target?.classList.add("invalid");
      target?.focus();
      const existing = target?.parentElement.querySelector(".field-error");
      if (!existing && target) {
        const err = document.createElement("span");
        err.className = "field-error";
        err.textContent = `Ingresa tu ${fieldName}`;
        target.parentElement.appendChild(err);
      }
      if (submitBtn) submitBtn.disabled = false;
      return;
    }

    let mensaje = `Hola, mi nombre es ${nombre}.\n`;
    mensaje += `Quiero cotizar: ${servicio}.\n`;
    if (detalle) mensaje += `Detalles: ${detalle.replace(/[\r\n]+/g, " ")}.\n`;
    if (telefono) mensaje += `Teléfono: ${telefono}\n`;
    if (email) mensaje += `Correo: ${email}`;

    const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(mensaje)}`;
    window.location.href = url;
  });
}

function initTestimonialCarousel() {
  const track = $("#tcTrack");
  if (!track) return;
  initCarouselWheelScroll(track);
}

function initLogoTrace() {
  const path = document.querySelector(".logo-edge-trace");
  if (!path) return;
  const update = () => {
    const len = Math.ceil(path.getTotalLength());
    path.style.setProperty("--path-len", len);
  };
  update();
  window.addEventListener("resize", update, { passive: true });
}

function initScrollToTop() {
  const btn = document.querySelector(".scroll-top-float");
  if (!btn) return;
  window.addEventListener("scroll", () => {
    btn.classList.toggle("visible", window.scrollY > 300);
  }, { passive: true });
}

const wheelInitSet = new WeakSet();
function initCarouselWheelScroll(track) {
  if (!track || wheelInitSet.has(track)) return;
  wheelInitSet.add(track);

  track.addEventListener("wheel", (e) => {
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX) && track.scrollWidth > track.clientWidth) {
      e.preventDefault();
      track.scrollBy({ left: e.deltaY, behavior: "smooth" });
    }
  }, { passive: false });
}

function initCarouselHints() {
  const carousels = document.querySelectorAll(".gallery-carousel, .testimonials-carousel");
  carousels.forEach(carousel => {
    const hint = carousel.querySelector(".carousel-hint");
    const track = carousel.querySelector(".gallery-track, .testimonials-track");
    if (!hint || !track) return;

    let hidden = false;
    const hideHint = () => {
      if (hidden) return;
      hidden = true;
      hint.classList.add("hidden");
    };

    track.addEventListener("scroll", () => {
      if (track.scrollLeft > 20) hideHint();
    }, { passive: true });

    track.addEventListener("touchstart", hideHint, { once: true, passive: true });
    track.addEventListener("pointerdown", hideHint, { once: true });
  });
}

function initWhatsAppLinks() {
  document.querySelectorAll("[data-wa-msg]").forEach(el => {
    el.addEventListener("click", function(e) {
      e.preventDefault();
      const msg = this.getAttribute("data-wa-msg");
      if (msg) {
        window.location.href = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(msg)}`;
      }
    });
  });
}

function init() {
  initGalleryCarousel();
  initFAQ();
  initScrollAnimations();
  initFormValidation();
  initFormSubmit();
  initWhatsAppLinks();
  initTestimonialCarousel();
  initCarouselHints();
  initLogoTrace();
  initScrollToTop();

  setTimeout(() => {
    document.body.classList.add("loaded");
  }, 100);
}

function boot() {
  try {
    init();
  } catch (err) {
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      console.error("Easy-Job: Error en init():", err);
    }
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
