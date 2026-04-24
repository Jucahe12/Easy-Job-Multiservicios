// ===== Configuración =====
const WHATSAPP_PHONE = "573202095621";
const COMPANY_EMAIL = "easy.jobmultiserviciossas@gmail.com";

// ===== Utilidades =====
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// ===== Año en footer =====
$("#year").textContent = new Date().getFullYear();

// ===== Header scroll effect =====
const header = $("#header");

window.addEventListener("scroll", () => {
  if (window.pageYOffset > 50) {
    header?.classList.add("scrolled");
  } else {
    header?.classList.remove("scrolled");
  }
});

// ===== Menú móvil =====
const menuBtn = $("#menuBtn");
const navLinks = $("#navLinks");

menuBtn?.addEventListener("click", () => {
  navLinks?.classList.toggle("open");
  menuBtn?.setAttribute("aria-expanded", navLinks?.classList.contains("open"));
});

// Cerrar menú al hacer clic fuera
document.addEventListener("click", (e) => {
  if (navLinks?.classList.contains("open") &&
      !e.target.closest("#navLinks") &&
      !e.target.closest("#menuBtn")) {
    navLinks.classList.remove("open");
  }
});

// Cerrar menú al hacer clic en enlace
$$("#navLinks a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks?.classList.remove("open");
  });
});

// ===== Smooth scroll para enlaces =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function(e) {
    const href = this.getAttribute("href");
    if (href !== "#" && href.length > 1) {
      const target = $(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  });
});

// ===== Carrusel Principal =====
function initCarousel() {
  const carouselContainer = $("#carouselContainer");
  const prevBtn = $("#prevBtn");
  const nextBtn = $("#nextBtn");
  const dotsContainer = $("#carouselDots");

  if (!carouselContainer) return;

  const slides = carouselContainer.querySelectorAll(".carousel-slide");
  const totalSlides = slides.length;
  let currentSlide = 0;
  let autoPlayInterval;
  let isHovering = false;
  let touchStartX = 0;

  // Crear puntos
  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement("button");
    dot.classList.add("carousel-dot");
    if (i === 0) dot.classList.add("active");
    dot.setAttribute("aria-label", `Ir a imagen ${i + 1}`);
    dot.addEventListener("click", () => goToSlide(i));
    dotsContainer?.appendChild(dot);
  }

  const dots = dotsContainer?.querySelectorAll(".carousel-dot") || [];

  function updateCarousel() {
    carouselContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === currentSlide);
    });
  }

  function goToSlide(n) {
    currentSlide = n;
    updateCarousel();
    resetAutoPlay();
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateCarousel();
  }

  function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateCarousel();
  }

  function startAutoPlay() {
    autoPlayInterval = setInterval(() => {
      if (!isHovering) nextSlide();
    }, 5000);
  }

  function resetAutoPlay() {
    clearInterval(autoPlayInterval);
    startAutoPlay();
  }

  // Event listeners
  prevBtn?.addEventListener("click", () => { prevSlide(); resetAutoPlay(); });
  nextBtn?.addEventListener("click", () => { nextSlide(); resetAutoPlay(); });

  // Teclado
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") { prevSlide(); resetAutoPlay(); }
    if (e.key === "ArrowRight") { nextSlide(); resetAutoPlay(); }
  });

  // Hover pause
  const carousel = carouselContainer.closest(".gallery-carousel");
  carousel?.addEventListener("mouseenter", () => { isHovering = true; });
  carousel?.addEventListener("mouseleave", () => { isHovering = false; });

  // Touch gestures
  carouselContainer.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  carouselContainer.addEventListener("touchend", (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? nextSlide() : prevSlide();
      resetAutoPlay();
    }
  }, { passive: true });

  startAutoPlay();
}

// ===== Lightbox =====
function initLightbox() {
  const lightbox = $("#lightbox");
  const lightboxImg = $("#lightboxImg");
  const lightboxClose = $("#lightboxClose");

  if (!lightbox) return;

  // Abrir desde imágenes del carrusel
  document.addEventListener("click", (e) => {
    const img = e.target.closest(".carousel-slide img");
    if (!img) return;

    lightboxImg.src = img.src;
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
  });

  // Cerrar
  lightboxClose?.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Teclado
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });

  function closeLightbox() {
    lightbox.classList.remove("active");
    document.body.style.overflow = "";
    setTimeout(() => { lightboxImg.src = ""; }, 300);
  }
}

// ===== Slider Antes y Después =====
function initBeforeAfter() {
  const slider = $("#baSlider");
  if (!slider) return;

  const slides = slider.querySelectorAll(".ba-slide");
  const handles = slider.querySelectorAll(".ba-handle");
  const prevBtn = $("#baPrev");
  const nextBtn = $("#baNext");
  const dotsContainer = $("#baDots");

  if (slides.length === 0) return;

  let currentSlide = 0;
  let isDragging = false;
  let autoPlayInterval;

  // Crear puntos de navegación
  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.classList.add("ba-dot");
    if (i === 0) dot.classList.add("active");
    dot.setAttribute("aria-label", `Ver proyecto ${i + 1}`);
    dot.addEventListener("click", () => goToSlide(i));
    dotsContainer?.appendChild(dot);
  });

  const dots = dotsContainer?.querySelectorAll(".ba-dot") || [];

  // Inicializar primera slide
  slides[0]?.classList.add("active");

  // Configurar handles interactivos
  handles.forEach((handle, index) => {
    const afterImage = slides[index]?.querySelector(".ba-image-after");
    if (!afterImage) return;

    let position = 50;

    // Mouse/touch events
    handle.addEventListener("mousedown", startDrag);
    handle.addEventListener("touchstart", startDrag, { passive: true });

    function startDrag(e) {
      isDragging = true;
      document.body.style.cursor = "ew-resize";
      clearInterval(autoPlayInterval);

      const container = slides[index]?.querySelector(".ba-image-container");

      function drag(e) {
        if (!isDragging || !container) return;

        const rect = container.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const x = ((clientX - rect.left) / rect.width) * 100;
        position = Math.max(0, Math.min(100, x));

        handle.style.left = `${position}%`;
        afterImage.style.clipPath = `polygon(${position}% 0, 100% 0, 100% 100%, ${position}% 100%)`;
      }

      function stopDrag() {
        isDragging = false;
        document.body.style.cursor = "";
        startAutoPlay();
      }

      document.addEventListener("mousemove", drag);
      document.addEventListener("touchmove", drag, { passive: true });
      document.addEventListener("mouseup", stopDrag);
      document.addEventListener("touchend", stopDrag);
    }
  });

  function updateSlide() {
    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === currentSlide);
      dots.forEach((dot, j) => dot.classList.toggle("active", j === currentSlide));
    });

    // Resetear handles a posición inicial
    handles.forEach((handle, i) => {
      if (i !== currentSlide) {
        handle.style.left = "50%";
        const afterImg = slides[i]?.querySelector(".ba-image-after");
        if (afterImg) afterImg.style.clipPath = "polygon(50% 0, 100% 0, 100% 100%, 50% 100%)";
      }
    });
  }

  function goToSlide(n) {
    currentSlide = n;
    updateSlide();
    resetAutoPlay();
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    updateSlide();
  }

  function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    updateSlide();
  }

  function startAutoPlay() {
    autoPlayInterval = setInterval(nextSlide, 6000);
  }

  function resetAutoPlay() {
    clearInterval(autoPlayInterval);
    startAutoPlay();
  }

  // Event listeners
  prevBtn?.addEventListener("click", () => { prevSlide(); resetAutoPlay(); });
  nextBtn?.addEventListener("click", () => { nextSlide(); resetAutoPlay(); });

  // Teclado
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") { prevSlide(); resetAutoPlay(); }
    if (e.key === "ArrowRight") { nextSlide(); resetAutoPlay(); }
  });

  startAutoPlay();
}

// ===== Galería Filtrable =====
function initGalleryFilter() {
  const filterBtns = $$(".gallery-filter-btn");
  const galleryItems = $$(".gallery-item");

  if (filterBtns.length === 0 || galleryItems.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;

      // Actualizar botones activos
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      // Filtrar items
      galleryItems.forEach(item => {
        const category = item.dataset.category;
        if (filter === "all" || category === filter) {
          item.classList.remove("hidden");
          // Pequeña animación
          item.style.opacity = "0";
          setTimeout(() => item.style.opacity = "1", 50);
        } else {
          item.classList.add("hidden");
        }
      });
    });
  });
}

// ===== FAQ Accordion =====
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

// ===== Animaciones al hacer scroll =====
function initScrollAnimations() {
  // Observer para elementos que aparecen suavemente
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  });

  $$(".fade-in").forEach(el => fadeObserver.observe(el));

  // Observer para animaciones en cascada (stagger)
  const staggerObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add("visible");
        }, index * 100);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: "0px 0px -80px 0px"
  });

  // Aplicar stagger a elementos agrupados
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

  // Observer para elementos que se deslizan desde los lados
  const slideObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("slide-visible");
      }
    });
  }, {
    threshold: 0.2,
    rootMargin: "0px"
  });

  $$(".slide-in-left, .slide-in-right").forEach(el => slideObserver.observe(el));
}

// ===== Contador animado de clientes satisfechos =====
function initAnimatedCounter() {
  const counterElement = $("#clientesSatisfechos");
  if (!counterElement) return;

  const target = parseInt(counterElement.dataset.target) || 500;
  let current = 0;
  const increment = target / 50;
  let animated = false;

  const counterObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !animated) {
      animated = true;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          counterElement.textContent = `+${target}`;
          clearInterval(timer);
        } else {
          counterElement.textContent = `+${Math.floor(current)}`;
        }
      }, 30);
    }
  }, { threshold: 0.5 });

  counterObserver.observe(counterElement);
}

// ===== Validación de formulario =====
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
      isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    } else if (field.type === "tel" && !/^[\d\s+-]{7,}$/.test(value)) {
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

// ===== Envío de formulario =====
function initFormSubmit() {
  const form = $("#formCotizacion");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nombre = $("#nombre")?.value.trim();
    const telefono = $("#telefono")?.value.trim();
    const email = $("#email")?.value.trim();
    const servicio = $("#servicio")?.value || "No especificado";
    const detalle = $("#detalle")?.value.trim();

    if (!nombre) {
      alert("Por favor, ingresa tu nombre.");
      $("#nombre")?.focus();
      return;
    }

    if (!telefono) {
      alert("Por favor, ingresa tu teléfono.");
      $("#telefono")?.focus();
      return;
    }

    // Construir mensaje
    let mensaje = `Hola, mi nombre es ${nombre}.\n`;
    mensaje += `Quiero cotizar: ${servicio}.\n`;
    if (detalle) mensaje += `Detalles: ${detalle}.\n`;
    if (telefono) mensaje += `Teléfono: ${telefono}\n`;
    if (email) mensaje += `Correo: ${email}`;

    // Enviar por WhatsApp
    const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  });
}

// ===== Inicializar todo =====
function init() {
  initCarousel();
  initLightbox();
  initBeforeAfter();
  initGalleryFilter();
  initFAQ();
  initScrollAnimations();
  initAnimatedCounter();
  initFormValidation();
  initFormSubmit();

  // Animación de entrada del hero
  setTimeout(() => {
    document.body.classList.add("loaded");
  }, 100);

  console.log("✅ Easy-Job - Landing Page optimizada lista");
}

// Ejecutar cuando el DOM esté listo
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
