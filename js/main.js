(() => {
  "use strict";

  const services = window.SERVICES;
  if (!Array.isArray(services) || services.length === 0) {
    throw new Error("Service data is missing or invalid.");
  }
  const siteStats = window.SERVICE_STATS;
  if (!siteStats || !Number.isSafeInteger(siteStats.totalOfferings) || siteStats.totalOfferings < services.length ||
      !Number.isSafeInteger(siteStats.statesServed) || siteStats.statesServed < 1 ||
      !Number.isSafeInteger(siteStats.clientsServed) || siteStats.clientsServed < 1) {
    throw new Error("Website reach statistics are missing or invalid.");
  }
  const translations = window.TRANSLATIONS || {};
  const grid = document.getElementById("serviceGrid");
  const searchInput = document.getElementById("serviceSearch");
  const searchStatus = document.getElementById("serviceSearchStatus");
  const serviceSelect = document.getElementById("contactService");
  const form = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");
  const contactWhatsAppFallback = document.getElementById("contactWhatsAppFallback");
  const submitButton = document.getElementById("submitButton");
  const floatingWhatsApp = document.getElementById("floatingWhatsApp");
  const heroWhatsApp = document.getElementById("heroWhatsApp");
  const contactWhatsApp = document.getElementById("contactWhatsApp");
  const reviewForm = document.getElementById("reviewForm");
  const reviewStatus = document.getElementById("reviewStatus");
  const reviewSubmitButton = document.getElementById("reviewSubmitButton");
  const reviewWhatsAppFallback = document.getElementById("reviewWhatsAppFallback");
  const modal = document.getElementById("serviceModal");
  const modalPanel = modal.querySelector(".service-modal");
  const modalClose = document.getElementById("modalClose");
  let activeLanguage = "en";
  let activeFilter = "All";
  let returnFocusTo = null;
  let isSubmitting = false;
  let revealObserver = null;

  // Get a free access key at web3forms.com and replace this placeholder before deployment.
  const WEB3FORMS_ACCESS_KEY = "06f17b3c-cf1f-4c00-a2f9-3a3811b5f8f1";
  const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
  const WHATSAPP_NUMBER = "919971836974";

  const iconPaths = {
    checklist: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 3.5h6M8 9l1.5 1.5L12 8M14 9h3M8 14l1.5 1.5L12 13M14 14h3M8 18h9"/>',
    building: '<path d="M3 21h18M5 21V8l7-5 7 5v13M9 11h.01M15 11h.01M9 15h.01M15 15h.01M10 21v-4h4v4"/>',
    shield: '<path d="M12 3 20 6v5c0 5-3.4 8.5-8 10-4.6-1.5-8-5-8-10V6z"/><path d="m9 12 2 2 4-4"/>',
    rocket: '<path d="M14 5c2-2 4.7-2.7 7-2-0.7 2.3-0.1 5-2 7l-6 6-5-5z"/><path d="m8 11-4 1-2 4 5-1M13 16l-1 4-4 2 1-5M14 7h.01M5 19l-2 2"/>',
    trademark: '<path d="M12 3 20 6v5c0 5-3.4 8.5-8 10-4.6-1.5-8-5-8-10V6z"/><text x="6.8" y="15.3" fill="currentColor" stroke="none" font-size="7" font-weight="700">TM</text>',
    food: '<circle cx="11" cy="12" r="8"/><path d="M11 4V2M18.5 7.5 21 5M8 12l2 2 4-4"/>',
    certificate: '<rect x="4" y="3" width="16" height="15" rx="2"/><path d="M8 7h8M8 11h5M8 15h3M8 18l-1 4 5-2 5 2-1-4"/>',
    document: '<path d="M6 3h8l4 4v14H6zM14 3v5h5M9 13h6M9 17h6"/>',
    government: '<path d="m3 9 9-6 9 6M4 20h16M6 9v9M10 9v9M14 9v9M18 9v9M3 21h18"/>',
    digitalSignature: '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="2"/><path d="M5.5 16c.5-1.5 1.7-2.2 3.5-2.2M13 10h5M13 14h3M14 18l5-5 2 2-5 5-3 1z"/>',
    grant: '<path d="M6 3h8l4 4v13H6zM14 3v5h5M9 13h4M9 17h3"/><circle cx="17.5" cy="16.5" r="3.5"/><path d="M17.5 14.5v4M16.5 15.2h1.7a.8.8 0 0 1 0 1.6h-1.4"/>',
    taxChart: '<path d="M3 5h8M3 8h8M4 5c5 0 5 5 0 5H3l6 9M15 16v4M18 12v8M21 8v12"/>',
    chart: '<path d="M4 20h17M6 17v-5h3v5M12 17V7h3v10M18 17v-8h3v8M5 8l5-4 4 2 6-4"/>',
    clipboard: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V2h6v2M8 9h8M8 13h8M8 17h5"/>',
    receipt: '<path d="M5 3h14v18l-3-2-3 2-3-2-3 2-2-2zM8 8h8M8 12h5"/><circle cx="16" cy="15" r="2.5"/>',
    pen: '<path d="m4 17 9-9 4 4-9 9H4zM13 8l2-2 4 4-2 2M4 21h16"/><path d="m4 17 4 4"/>',
    browser: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M7 6.5h.01M10 6.5h.01M7 13h4M7 16h10M15 12h3v5h-3z"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18M5 6h14M5 18h14"/>',
    profile: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2.5"/><path d="M5 17c.7-2 2-3 4-3s3.3 1 4 3M15 9h3M15 13h3M15 17h3"/>'
  };

  function getMessage(path) {
    return path.split(".").reduce((value, key) => value && value[key], translations[activeLanguage]);
  }

  function revealVisibleElements() {
    document.querySelectorAll(".reveal:not(.is-visible)").forEach(element => {
      const bounds = element.getBoundingClientRect();
      if (bounds.top < window.innerHeight && bounds.bottom > 0) {
        element.classList.add("is-visible");
      }
    });
  }

  function applyTranslations() {
    document.documentElement.lang = activeLanguage;
    document.querySelectorAll("[data-i18n]").forEach(element => {
      const translated = getMessage(element.dataset.i18n);
      if (typeof translated === "string") element.textContent = translated;
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(element => {
      const translated = getMessage(element.dataset.i18nPlaceholder);
      if (typeof translated === "string") element.placeholder = translated;
    });
    const languageButton = document.getElementById("languageToggle");
    languageButton.textContent = activeLanguage === "en" ? "हिन्दी" : "English";
    languageButton.setAttribute("aria-label", activeLanguage === "en" ? "Switch to Hindi" : "Switch to English");
    if (grid.children.length) renderServices();
    refreshSubmitButton();
  }

  function readSavedLanguage() {
    try {
      const saved = window.localStorage.getItem("global-ngo-language");
      return saved === "hi" || saved === "en" ? saved : "en";
    } catch (error) {
      console.warn("Language preference could not be read from local storage.", error);
      return "en";
    }
  }

  function saveLanguage(language) {
    try {
      window.localStorage.setItem("global-ngo-language", language);
    } catch (error) {
      console.warn("Language preference could not be saved to local storage.", error);
    }
  }

  function createIcon(name) {
    const path = iconPaths[name] || iconPaths.document;
    const wrapper = document.createElement("span");
    wrapper.className = "service-card-icon";
    wrapper.setAttribute("aria-hidden", "true");
    wrapper.innerHTML = `<svg viewBox="0 0 24 24" focusable="false">${path}</svg>`;
    return wrapper;
  }

  function watchForReveal(element) {
    if (revealObserver) {
      revealObserver.observe(element);
      revealVisibleElements();
    } else {
      element.classList.add("is-visible");
    }
  }

  function renderServices() {
    const query = searchInput.value.trim().toLocaleLowerCase();
    const visibleServices = services
      .map((service, index) => ({ service, index }))
      .filter(item => {
        const matchesFilter = activeFilter === "All" || item.service.category === activeFilter;
        const searchableText = `${item.service.name} ${item.service.shortDescription} ${item.service.category}`.toLocaleLowerCase();
        return matchesFilter && (!query || searchableText.includes(query));
      });

    grid.replaceChildren();
    const countMessage = getMessage("services.resultCount");
    searchStatus.textContent = countMessage.replace("{count}", String(visibleServices.length));
    if (visibleServices.length === 0) {
      const emptyState = document.createElement("p");
      emptyState.className = "service-empty";
      emptyState.textContent = getMessage("services.noResults");
      grid.append(emptyState);
      return;
    }

    visibleServices.forEach(({ service, index }) => {
      const card = document.createElement("article");
      card.className = "service-card reveal";
      card.dataset.serviceId = service.id;

      const top = document.createElement("div");
      top.className = "service-card-top";
      top.append(createIcon(service.icon));
      const number = document.createElement("span");
      number.className = `service-number badge-color-${index % 6}`;
      number.textContent = String(index + 1).padStart(2, "0");
      top.append(number);

      const title = document.createElement("h3");
      title.textContent = service.name;
      const description = document.createElement("p");
      description.textContent = service.shortDescription;
      const knowMore = document.createElement("button");
      knowMore.className = "know-more";
      knowMore.type = "button";
      knowMore.textContent = "Know More";
      knowMore.setAttribute("aria-label", `Know more about ${service.name}`);
      knowMore.addEventListener("click", () => openServiceModal(service, knowMore));

      card.append(top, title, description, knowMore);
      grid.append(card);
      watchForReveal(card);
    });
  }

  function fillServiceSelect() {
    services.forEach(service => {
      const option = document.createElement("option");
      option.value = service.name;
      option.textContent = service.name;
      serviceSelect.append(option);
    });
  }

  function createWhatsAppUrl(serviceName, extraMessage) {
    const message = extraMessage || `Namaste, mujhe ${serviceName} ke baare mein jaankari chahiye.`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  }

  function updateFloatingWhatsApp(serviceName) {
    const selectedService = serviceName || serviceSelect.value || "Global NGO Services";
    floatingWhatsApp.href = createWhatsAppUrl(selectedService);
  }

  function updateHeroWhatsApp() {
    heroWhatsApp.href = createWhatsAppUrl(
      "Global NGO Services",
      "Namaste, mujhe Global NGO Services ki services ke baare mein jaankari chahiye."
    );
  }

  function updateContactWhatsApp() {
    contactWhatsApp.href = createWhatsAppUrl(
      "Global NGO Services",
      "Namaste, mujhe Global NGO Services ki consultancy ke baare mein jaankari chahiye."
    );
  }

  function openServiceModal(service, trigger) {
    returnFocusTo = trigger;
    document.getElementById("modalTitle").textContent = service.name;
    document.getElementById("modalDescription").textContent = service.shortDescription;
    document.getElementById("modalTime").textContent = service.time;

    const documents = document.getElementById("modalDocuments");
    documents.replaceChildren();
    service.documents.forEach(documentName => {
      const item = document.createElement("li");
      item.textContent = documentName;
      documents.append(item);
    });

    const enquiry = document.getElementById("modalWhatsApp");
    enquiry.href = createWhatsAppUrl(service.name);
    enquiry.setAttribute("aria-label", `Enquire about ${service.name} on WhatsApp`);
    updateFloatingWhatsApp(service.name);
    modal.hidden = false;
    modal.classList.add("is-open");
    modalPanel.focus();
  }

  function closeServiceModal() {
    modal.classList.remove("is-open");
    modal.hidden = true;
    if (returnFocusTo) returnFocusTo.focus();
  }

  function trapModalFocus(event) {
    if (event.key === "Escape" && !modal.hidden) {
      closeServiceModal();
      return;
    }
    if (event.key !== "Tab" || modal.hidden) return;

    const controls = [...modalPanel.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')];
    if (!controls.length) return;
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && (document.activeElement === first || document.activeElement === modalPanel)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function setFieldError(input, message, errorElement) {
    errorElement.textContent = message;
    input.setAttribute("aria-invalid", message ? "true" : "false");
  }

  function validateForm() {
    const nameInput = document.getElementById("contactName");
    const phoneInput = document.getElementById("contactPhone");
    const nameError = document.getElementById("nameError");
    const phoneError = document.getElementById("phoneError");
    const serviceError = document.getElementById("serviceError");
    const messages = translations[activeLanguage].contact;
    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    let firstInvalid = null;

    nameInput.value = name;
    setFieldError(nameInput, name.length >= 3 ? "" : messages.invalidName, nameError);
    setFieldError(phoneInput, /^[6-9]\d{9}$/.test(phone) ? "" : messages.invalidPhone, phoneError);
    setFieldError(serviceSelect, services.some(service => service.name === serviceSelect.value) ? "" : messages.invalidService, serviceError);

    [nameInput, phoneInput, serviceSelect].forEach(input => {
      if (!firstInvalid && input.getAttribute("aria-invalid") === "true") firstInvalid = input;
    });
    if (firstInvalid) firstInvalid.focus();
    return !firstInvalid;
  }

  function refreshSubmitButton() {
    const label = submitButton.querySelector('[data-i18n="contact.submit"]');
    if (label && !isSubmitting) label.textContent = getMessage("contact.submit");
  }

  function whatsappMessage(name, phone, serviceName) {
    return `Namaste, mujhe ${serviceName} ke baare mein jaankari chahiye. Mera naam ${name}, phone ${phone}.`;
  }

  function showContactWhatsAppFallback(serviceName, message) {
    contactWhatsAppFallback.href = createWhatsAppUrl(serviceName, message);
    contactWhatsAppFallback.hidden = false;
    formStatus.textContent = translations[activeLanguage].contact.fallback;
  }

  function clearContactWhatsAppFallback() {
    contactWhatsAppFallback.hidden = true;
    contactWhatsAppFallback.removeAttribute("href");
  }

  async function submitContactForm(event) {
    event.preventDefault();
    if (isSubmitting || !validateForm()) return;

    const honeypot = document.getElementById("botcheck");
    if (honeypot.value.trim()) {
      formStatus.textContent = translations[activeLanguage].contact.success;
      form.reset();
      return;
    }

    const messages = translations[activeLanguage].contact;
    const name = document.getElementById("contactName").value.trim();
    const phone = document.getElementById("contactPhone").value.trim();
    const serviceName = serviceSelect.value;
    const message = whatsappMessage(name, phone, serviceName);

    isSubmitting = true;
    submitButton.disabled = true;
    submitButton.querySelector('[data-i18n="contact.submit"]').textContent = messages.submitting;
    formStatus.textContent = "";
    clearContactWhatsAppFallback();

    if (WEB3FORMS_ACCESS_KEY === "YOUR_WEB3FORMS_ACCESS_KEY") {
      showContactWhatsAppFallback(serviceName, message);
      isSubmitting = false;
      submitButton.disabled = false;
      refreshSubmitButton();
      return;
    }

    try {
      const payload = new FormData(form);
      payload.set("access_key", WEB3FORMS_ACCESS_KEY);
      payload.set("subject", `Website enquiry: ${serviceName}`);
      payload.set("from_name", "Global NGO Services Website");
      payload.set("message", message);

      const response = await fetch(WEB3FORMS_ENDPOINT, {
        method: "POST",
        body: payload,
        headers: { Accept: "application/json" }
      });
      if (!response.ok) throw new Error(`Web3Forms responded with HTTP ${response.status}.`);
      const result = await response.json();
      if (!result.success) throw new Error(result.message || "Web3Forms did not accept the enquiry.");

      form.reset();
      formStatus.textContent = messages.success;
      clearContactWhatsAppFallback();
      updateFloatingWhatsApp("");
    } catch (error) {
      console.error("Web3Forms submission failed.", error);
      showContactWhatsAppFallback(serviceName, message);
    } finally {
      isSubmitting = false;
      submitButton.disabled = false;
      refreshSubmitButton();
    }
  }

  function validateReviewForm() {
    const nameInput = document.getElementById("reviewName");
    const ratingInput = document.getElementById("reviewRating");
    const reviewInput = document.getElementById("reviewText");
    const messages = translations[activeLanguage].reviews;
    const name = nameInput.value.trim();
    const review = reviewInput.value.trim();
    let firstInvalid = null;

    nameInput.value = name;
    reviewInput.value = review;
    setFieldError(nameInput, name.length >= 3 ? "" : messages.invalidName, document.getElementById("reviewNameError"));
    setFieldError(ratingInput, ratingInput.value ? "" : messages.invalidRating, document.getElementById("reviewRatingError"));
    setFieldError(reviewInput, review.length >= 10 ? "" : messages.invalidReview, document.getElementById("reviewTextError"));

    [nameInput, ratingInput, reviewInput].forEach(input => {
      if (!firstInvalid && input.getAttribute("aria-invalid") === "true") firstInvalid = input;
    });
    if (firstInvalid) firstInvalid.focus();
    return !firstInvalid;
  }

  function createReviewMessage() {
    const permission = document.getElementById("reviewPermission").checked
      ? "Yes, you may contact me to request permission to publish it."
      : "No permission to publish; this feedback is for the team.";
    return [
      "Namaste, I would like to share my review for Global NGO Services.",
      `Name: ${document.getElementById("reviewName").value.trim()}`,
      `Rating: ${document.getElementById("reviewRating").value}/5`,
      `Review: ${document.getElementById("reviewText").value.trim()}`,
      `Permission: ${permission}`
    ].join("\n");
  }

  async function submitReviewForm(event) {
    event.preventDefault();
    if (reviewSubmitButton.disabled || !validateReviewForm()) return;

    const messages = translations[activeLanguage].reviews;
    const message = createReviewMessage();
    reviewSubmitButton.disabled = true;
    reviewSubmitButton.textContent = messages.submitting;
    reviewStatus.textContent = "";
    reviewWhatsAppFallback.hidden = true;

    const sendToWhatsApp = () => {
      const url = createWhatsAppUrl("Global NGO Services", message);
      reviewWhatsAppFallback.href = url;
      reviewWhatsAppFallback.hidden = false;
      window.open(url, "_blank", "noopener,noreferrer");
      reviewStatus.textContent = messages.whatsappFallback;
    };

    if (WEB3FORMS_ACCESS_KEY === "YOUR_WEB3FORMS_ACCESS_KEY") {
      sendToWhatsApp();
      reviewSubmitButton.disabled = false;
      reviewSubmitButton.textContent = messages.submit;
      return;
    }

    try {
      const payload = new FormData(reviewForm);
      payload.set("access_key", WEB3FORMS_ACCESS_KEY);
      payload.set("subject", "Website review: Global NGO Services");
      payload.set("from_name", "Global NGO Services Website");
      payload.set("message", message);

      const response = await fetch(WEB3FORMS_ENDPOINT, {
        method: "POST",
        body: payload,
        headers: { Accept: "application/json" }
      });
      if (!response.ok) throw new Error(`Web3Forms responded with HTTP ${response.status}.`);
      const result = await response.json();
      if (!result.success) throw new Error(result.message || "Web3Forms did not accept the review.");

      reviewForm.reset();
      reviewStatus.textContent = messages.success;
    } catch (error) {
      console.error("Review submission failed; using WhatsApp fallback.", error);
      sendToWhatsApp();
    } finally {
      reviewSubmitButton.disabled = false;
      reviewSubmitButton.textContent = messages.submit;
    }
  }

  function initializeLanguage() {
    activeLanguage = readSavedLanguage();
    applyTranslations();
    document.getElementById("languageToggle").addEventListener("click", () => {
      activeLanguage = activeLanguage === "en" ? "hi" : "en";
      applyTranslations();
      saveLanguage(activeLanguage);
    });
  }

  function initializeNavigation() {
    const menuToggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".main-nav");
    const closeMenu = () => {
      nav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open menu");
    };
    menuToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    });
    nav.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener("click", closeMenu));
    document.querySelector(".nav-consultation").addEventListener("click", closeMenu);

    const sections = [...document.querySelectorAll("main section[id]")];
    const navLinks = [...nav.querySelectorAll('a[href^="#"]')];
    if ("IntersectionObserver" in window) {
      const navObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          navLinks.forEach(link => {
            link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
          });
        });
      }, { rootMargin: "-35% 0px -60%", threshold: 0 });
      sections.forEach(section => navObserver.observe(section));
    }
  }

  function initializeRevealAnimations() {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!("IntersectionObserver" in window) || reduceMotion) {
      document.querySelectorAll("main section, .service-card").forEach(element => element.classList.add("is-visible"));
      return;
    }

    revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.01 });
    document.body.classList.add("reveal-enabled");
    window.addEventListener("scroll", revealVisibleElements, { passive: true });
    document.querySelectorAll("main section").forEach(section => {
      section.classList.add("reveal");
      watchForReveal(section);
    });
    revealVisibleElements();
  }

  function initializeCounters() {
    const counters = [...document.querySelectorAll(".counter")];
    let hasAnimated = false;
    const animate = () => {
      if (hasAnimated) return;
      hasAnimated = true;
      counters.forEach(counter => {
        const target = Number(counter.dataset.target);
        const suffix = counter.dataset.suffix || "";
        const minDigits = Number(counter.dataset.minDigits) || 1;
        const duration = 900;
        const start = performance.now();
        counter.textContent = `${formatCounterNumber(0, minDigits)}${suffix}`;
        function tick(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          counter.textContent = `${formatCounterNumber(Math.round(target * eased), minDigits)}${suffix}`;
          if (progress < 1) window.requestAnimationFrame(tick);
        }
        window.requestAnimationFrame(tick);
      });
    };

    const target = document.querySelector(".hero-trust");
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          animate();
          observer.disconnect();
        }
      }, { threshold: 0.35 });
      observer.observe(target);
    } else {
      animate();
    }
  }

  function formatCounterNumber(value, minDigits) {
    if (value < 1000) return String(value).padStart(minDigits, "0");
    return value.toLocaleString("en-IN");
  }

  function initializeServiceCounts() {
    document.querySelectorAll("[data-service-count]").forEach(element => {
      element.textContent = `${siteStats.totalOfferings}+`;
    });
    document.querySelectorAll("[data-stat]").forEach(element => {
      const value = siteStats[element.dataset.stat];
      element.dataset.target = String(value);
      element.textContent = `${formatCounterNumber(value, Number(element.dataset.minDigits) || 1)}${element.dataset.suffix || ""}`;
    });
  }

  function initializeFilters() {
    document.querySelectorAll(".filter-button").forEach(button => {
      button.addEventListener("click", () => {
        activeFilter = button.dataset.filter;
        document.querySelectorAll(".filter-button").forEach(filter => {
          const selected = filter === button;
          filter.classList.toggle("active", selected);
          filter.setAttribute("aria-pressed", String(selected));
        });
        renderServices();
      });
    });
  }

  function initializeSearch() {
    searchInput.addEventListener("input", renderServices);
  }

  function initializeBackToTop() {
    const button = document.getElementById("backToTop");
    const updateVisibility = () => button.classList.toggle("is-visible", window.scrollY > 500);
    window.addEventListener("scroll", updateVisibility, { passive: true });
    updateVisibility();
    button.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  fillServiceSelect();
  initializeLanguage();
  initializeNavigation();
  initializeRevealAnimations();
  renderServices();
  initializeFilters();
  initializeSearch();
  initializeServiceCounts();
  initializeCounters();
  initializeBackToTop();
  updateFloatingWhatsApp();
  updateHeroWhatsApp();
  updateContactWhatsApp();
  serviceSelect.addEventListener("change", () => updateFloatingWhatsApp());
  form.addEventListener("submit", submitContactForm);
  form.addEventListener("input", () => {
    formStatus.textContent = "";
    clearContactWhatsAppFallback();
  });
  form.addEventListener("change", () => {
    formStatus.textContent = "";
    clearContactWhatsAppFallback();
  });
  reviewForm.addEventListener("submit", submitReviewForm);
  reviewForm.addEventListener("input", () => {
    reviewStatus.textContent = "";
    reviewWhatsAppFallback.hidden = true;
  });
  modalClose.addEventListener("click", closeServiceModal);
  modal.addEventListener("click", event => {
    if (event.target === modal) closeServiceModal();
  });
  document.addEventListener("keydown", trapModalFocus);
})();
