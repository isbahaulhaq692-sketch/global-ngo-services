/**
 * Global NGO Services — Analytics Event Tracking
 * Privacy-safe, lightweight GA4 events via window.gtag() and dataLayer.
 *
 * Architecture:
 *  - GTM (GTM-5MK3387T) fires the page_view through its GA4 Configuration tag.
 *  - This file fires custom interaction events only. No page_view is sent here.
 *  - window.gtag() is defined by the Google tag initialisation in <head>.
 *
 * Privacy rules enforced here:
 *  - No form contents, names, phone numbers, email addresses or personal data sent.
 *  - No user-entered text is transmitted in any event parameter.
 *  - Events fire at most once per interaction (delegated listeners, no duplicates).
 *  - Service IDs are URL slugs only (e.g. "csr-1-registration"), not personal data.
 */
(() => {
  "use strict";

  /**
   * Push a named event to GA4 (via gtag) and to the GTM dataLayer.
   * Parameters must never contain PII.
   *
   * @param {string} eventName - Snake_case GA4 event name.
   * @param {Object} [params]  - Optional non-PII parameters.
   */
  function track(eventName, params) {
    // Send to GA4 via window.gtag (initialised in <head>)
    if (typeof window.gtag === "function") {
      window.gtag("event", eventName, params || {});
    }
    // Also push to dataLayer so GTM can pick up events via custom triggers
    if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push(Object.assign({ event: eventName }, params || {}));
    }
  }

  // Expose for optional use by other scripts (e.g. main.js)
  window.trackAnalyticsEvent = track;

  // ─── Single delegated click listener ────────────────────────────────────────
  // One listener handles all link/button click tracking to avoid duplication.
  document.addEventListener("click", (e) => {
    if (!(e.target instanceof Element)) return;

    // ── Service card "Know More" modal ───────────────────────────────────────
    const knowMoreBtn = e.target.closest(".know-more");
    if (knowMoreBtn) {
      const card = knowMoreBtn.closest("[data-service-id]");
      // service_id is a URL slug, e.g. "fcra-registration" — not personal data
      track("service_view", { service_id: card ? card.dataset.serviceId : "unknown" });
      return;
    }

    // ── Link clicks ──────────────────────────────────────────────────────────
    const link = e.target.closest("a[href]");
    if (!link) return;
    const href = link.getAttribute("href") || "";

    // Phone
    if (href.startsWith("tel:")) {
      track("click_call");
      return;
    }
    // Email
    if (href.startsWith("mailto:")) {
      track("click_email");
      return;
    }
    // WhatsApp
    if (/^https?:\/\/(?:wa\.me|api\.whatsapp\.com)/i.test(href)) {
      track("click_whatsapp");
      return;
    }
    // Instagram
    if (/instagram\.com/i.test(href)) {
      track("click_instagram");
      return;
    }
    // Free Consultation CTA (nav button or btn linking to #contact)
    if (
      link.classList.contains("nav-consultation") ||
      (href.includes("#contact") && link.classList.contains("btn"))
    ) {
      track("consultation_cta_click");
      return;
    }
    // Internal navigation links (#section anchors in nav)
    if (href.startsWith("#") && link.closest(".main-nav")) {
      track("navigation_click", { nav_target: href });
      return;
    }
  });

  // ─── Language toggle ─────────────────────────────────────────────────────────
  // Fires when the user switches between English and Hindi.
  const langToggle = document.getElementById("languageToggle");
  if (langToggle) {
    langToggle.addEventListener("click", () => {
      // After the click, the button text has already toggled to the NEW language label
      const newLang = langToggle.textContent.trim() === "English" ? "hi" : "en";
      track("language_switch", { language: newLang });
    });
  }

  // ─── Contact section visibility ──────────────────────────────────────────────
  // Fires once when the Contact section scrolls into view.
  const contactSection = document.getElementById("contact");
  if (contactSection && "IntersectionObserver" in window) {
    let contactFired = false;
    const contactObs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !contactFired) {
          contactFired = true;
          track("contact_section_view");
          contactObs.disconnect();
        }
      });
    }, { threshold: 0.25 });
    contactObs.observe(contactSection);
  }

  // ─── Services section visibility ─────────────────────────────────────────────
  // Fires once when the Services section scrolls into view.
  const servicesSection = document.getElementById("services");
  if (servicesSection && "IntersectionObserver" in window) {
    let servicesFired = false;
    const servicesObs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !servicesFired) {
          servicesFired = true;
          track("services_section_view");
          servicesObs.disconnect();
        }
      });
    }, { threshold: 0.2 });
    servicesObs.observe(servicesSection);
  }

})();
