"use strict";
(() => {
  const MEASUREMENT_ID = "G-HWNLJN7DJ1";
  const KEY = "cyberfriday_analytics_consent_v1";
  let enabled = false;
  const getChoice = () => { try { return localStorage.getItem(KEY); } catch { return null; } };
  const saveChoice = (value) => { try { localStorage.setItem(KEY, value); } catch {} };

  function enableAnalytics() {
    if (enabled) return;
    enabled = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", MEASUREMENT_ID, { anonymize_ip: true });
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
    document.head.appendChild(script);
  }

  function renderConsent() {
    const panel = document.createElement("aside");
    panel.id = "cookieConsent";
    panel.className = "cookie-consent";
    panel.setAttribute("aria-label", "Analytics cookie preferences");
    panel.innerHTML = `<p><strong>Privacy & analytics</strong></p>
      <p>CyberFriday uses optional Google Analytics cookies to understand visits. Analytics only loads if you accept. You can change your choice anytime.</p>
      <div class="cookie-actions"><button type="button" data-choice="reject">Reject</button><button type="button" data-choice="accept">Accept analytics</button></div>`;
    panel.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-choice]");
      if (!button) return;
      const consent = button.dataset.choice === "accept";
      saveChoice(consent ? "accepted" : "rejected");
      if (consent) enableAnalytics();
      else if (enabled) { window.location.reload(); return; }
      panel.remove();
    });
    document.body.appendChild(panel);
  }
  document.addEventListener("DOMContentLoaded", () => {
    const choice = getChoice();
    if (choice === "accepted") enableAnalytics();
    else if (choice !== "rejected") renderConsent();
    const footer = document.querySelector(".footer-links") || document.querySelector(".footer-inner") || document.querySelector(".footer__inner");
    if (footer) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "privacy-button";
      button.textContent = "Cookie settings";
      button.addEventListener("click", () => {
        document.getElementById("cookieConsent")?.remove();
        renderConsent();
      });
      footer.appendChild(button);
    }
  });
})();
