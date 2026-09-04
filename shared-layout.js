(function () {
  var fallbackTemplates = {
    "shared-navbar-template":
      '<nav class="navbar">' +
      '<div class="navbar-container">' +
      '<a href="/" class="navbar-brand">🎮 Bezejmeny</a>' +
      '<div class="navbar-menu">' +
      '<a href="/" class="navbar-item" data-nav="home">HOME</a>' +
      '<a href="/about/" class="navbar-item" data-nav="about">ABOUT US</a>' +
      '<a href="/tos/" class="navbar-item" data-nav="tos">TOS</a>' +
      '<div class="navbar-dropdown">' +
      '<button class="navbar-item navbar-dropdown-toggle">MORE ▼</button>' +
      '<div class="navbar-dropdown-menu">' +
      '<a href="/report-a-bug/" class="navbar-dropdown-item">REPORT BUG</a>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '</nav>',
    "shared-footer-template":
      '<footer class="footer">' +
      '<p>© 2026 Bezejmeny. All rights reserved.</p>' +
      '<p><a href="mailto:hello@bezejmeny.xyz">EMAIL US</a></p>' +
      '<p>Created by <a href="https://sayouri.dev/" target="_blank" rel="noopener noreferrer">Sayouri</a></p>' +
      '</footer>',
  };

  function getRootUrl(path) {
    var scriptEl = document.currentScript;
    if (scriptEl && scriptEl.src) {
      return new URL(path, new URL(".", scriptEl.src)).toString();
    }
    return path;
  }

  function getTemplateHtmlFromCurrentPage(templateId) {
    var template = document.getElementById(templateId);
    return template ? template.innerHTML : "";
  }

  async function getTemplateHtmlFromRootIndex(templateId) {
    try {
      var response = await fetch(getRootUrl("index.html"));
      if (!response.ok) return "";

      var html = await response.text();
      var doc = new DOMParser().parseFromString(html, "text/html");
      var template = doc.getElementById(templateId);
      return template ? template.innerHTML : "";
    } catch (error) {
      console.error("Failed to load shared templates from index.html:", error);
      return "";
    }
  }

  function setActiveNav() {
    var page = document.body.getAttribute("data-page");
    if (!page) return;

    var activeLink = document.querySelector('[data-nav="' + page + '"]');
    if (activeLink) {
      activeLink.classList.add("active");
    }
  }

  async function loadSharedFragment(targetId, templateId) {
    var mount = document.getElementById(targetId);
    if (!mount) return;

    var currentPageTemplate = getTemplateHtmlFromCurrentPage(templateId);
    if (currentPageTemplate) {
      mount.innerHTML = currentPageTemplate;
      return;
    }

    var rootTemplate = await getTemplateHtmlFromRootIndex(templateId);
    if (rootTemplate) {
      mount.innerHTML = rootTemplate;
      return;
    }

    if (fallbackTemplates[templateId]) {
      mount.innerHTML = fallbackTemplates[templateId];
    }
  }

  async function initSharedLayout() {
    await Promise.all([
      loadSharedFragment("shared-navbar", "shared-navbar-template"),
      loadSharedFragment("shared-footer", "shared-footer-template"),
    ]);

    setActiveNav();
    document.dispatchEvent(new CustomEvent("shared-layout:ready"));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSharedLayout);
  } else {
    initSharedLayout();
  }
})();
