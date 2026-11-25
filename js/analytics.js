/**
 * Global NGO Services — Analytics Event Tracking
 * Privacy-safe GA4 events via gtag() and dataLayer.
 *
 * Rules enforced here:
 *  - No form contents, personal data, phone numbers or email addresses are sent.
 *  - No user-provided text is transmitted.
 *  - Events fire at most once per interaction (no duplicate firing).
 *  - gtag() is called only after it is defined by the GA4 script in <head>.
 */
(() => {
  "use strict";

  /**
   * Push a named event to both GA4 (via gtag) and the GTM dataLayer.
   * Parameters must never contain PII.
   *
   * @param {string} eventName  - Snake_case event name.
   * @param {Object} [params]   - Optional, non-PII parameters only.
   */
  function track(eventName, params) {
    // Send to GA4 directly via gtag (defined in <head>)
    if (typeof window.gtag === "function") {
      window.gtag("event", eventName, params || {});
    }
    // Also push to dataLayer so GTM can pick up custom tags if configured
    if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push(
        Object.assign({ event: eventName }, params || {})
      );
    }
  }

  // Expose for use by main.js if needed
  window.trackAnalyticsEvent = track;

  /**
   * Single delegated click listener — avoids attaching multiple handlers.
   * Determines event type from the clicked element's href or class.
   */
  document.addEventListener("click", (e) => {
    const link = e.target instanceof Element
      ? e.target.closest("a[href], button[type]")
      : null;
    if (!link) return;

    const href = link.getAttribute("href") || "";

    // Phone click
    if (href.startsWith("tel:")) {
      track("click_call", { link_type: "phone" });
      return;
    }

    // Email click
    if (href.startsWith("mailto:")) {
      track("click_email", { link_type: "email" });
      return;
    }

    // WhatsApp click (wa.me or api.whatsapp.com)
    if (/^https?:\/\/(?:wa\.me|api\.whatsapp\.com)/i.test(href)) {
      track("click_whatsapp", { link_type: "whatsapp" });
      return;
    }

    // Instagram click
    if (/instagram\.com/i.test(href)) {
      track("click_instagram", { link_type: "instagram" });
      return;
    }

    // CTA clicks — Free Consultation button / contact section links
    if (
      link.classList.contains("nav-consultation") ||
      (href.includes("#contact") && link.classList.contains("btn"))
    ) {
      track("consultation_cta_click", { cta_location: "nav" });
      return;
    }
  });

  /**
   * Service card "Know More" — fires service_view when modal opens.
   * Delegates from the grid container so it works after dynamic rendering.
   */
  document.addEventListener("click", (e) => {
    const btn = e.target instanceof Element
      ? e.target.closest(".know-more")
      : null;
    if (!btn) return;

    const card = btn.closest("[data-service-id]");
    const serviceId = card ? card.dataset.serviceId : "unknown";
    // Service ID is a slug like "csr-1-registration" — not PII
    track("service_view", { service_id: serviceId });
  });

  /**
   * Contact section visibility — fires contact_section_view once
   * when the #contact section enters the viewport.
   */
  const contactSection = document.getElementById("contact");
  if (contactSection && "IntersectionObserver" in window) {
    let fired = false;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !fired) {
          fired = true;
          track("contact_section_view");
          obs.disconnect();
        }
      });
    }, { threshold: 0.25 });
    obs.observe(contactSection);
  }

})();
