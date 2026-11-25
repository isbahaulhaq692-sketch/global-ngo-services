(() => {
  "use strict";

  function trackAnalyticsEvent(eventName) {
    if (typeof window.gtag === "function") {
      window.gtag("event", eventName);
    }
  }

  window.trackAnalyticsEvent = trackAnalyticsEvent;

  document.addEventListener("click", event => {
    const target = event.target instanceof Element
      ? event.target.closest("a[href]")
      : null;
    if (!target) return;

    const href = target.getAttribute("href") || "";
    if (href.startsWith("tel:")) {
      trackAnalyticsEvent("phone_click");
    } else if (href.startsWith("mailto:")) {
      trackAnalyticsEvent("email_click");
    } else if (/^https:\/\/(?:wa\.me|api\.whatsapp\.com)(?:\/|$)/i.test(href)) {
      trackAnalyticsEvent("whatsapp_click");
    } else if (target.matches(".nav-consultation, a[href*='#contact']")) {
      trackAnalyticsEvent("consultation_cta_click");
    }
  });
})();
