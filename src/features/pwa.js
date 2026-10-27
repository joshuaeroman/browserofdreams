/**
 * Browser of Dreams - Progressive Web App (PWA) Controller
 * Manages service worker lifecycle, installation prompts, standalone mode,
 * dynamic era theme-color synchronization, and window controls.
 */

let deferredPrompt = null;
let pwaListeners = [];

export const pwaState = {
  isSupported: typeof navigator !== "undefined" && "serviceWorker" in navigator,
  isRegistered: false,
  isInstallable: false,
  isStandalone: false,
  registration: null
};

/**
 * Check if the app is currently running in standalone (installed) mode.
 */
export function isStandaloneMode() {
  if (typeof window === "undefined") return false;

  const isStandaloneMedia = window.matchMedia && window.matchMedia("(display-mode: standalone)").matches;
  const isIosStandalone = window.navigator && Boolean(window.navigator.standalone);
  const isAndroidTwa = typeof document !== "undefined" && document.referrer && document.referrer.includes("android-app://");

  return Boolean(isStandaloneMedia || isIosStandalone || isAndroidTwa);
}

/**
 * Update DOM element classes and visibility states according to standalone execution mode.
 */
export function syncStandaloneDOM(showStandaloneTitlebar = false) {
  if (typeof document === "undefined") return;

  const standalone = isStandaloneMode();
  const root = document.documentElement;
  const win = document.getElementById("browser-window");
  const installBtn = document.getElementById("btn-install-app");
  const menuInstallBtn = document.getElementById("menu-install-btn");
  const menuEraPill = document.getElementById("menu-era-pill");

  if (standalone) {
    if (root && root.classList) root.classList.add("is-standalone");
    if (win && win.classList) {
      win.classList.add("is-standalone");
      if (showStandaloneTitlebar) {
        win.classList.add("show-standalone-titlebar");
      } else {
        win.classList.remove("show-standalone-titlebar");
      }
    }
    if (installBtn) installBtn.hidden = true;
    if (menuInstallBtn) menuInstallBtn.hidden = true;
    if (menuEraPill && !showStandaloneTitlebar) menuEraPill.hidden = false;
  } else {
    if (root && root.classList) root.classList.remove("is-standalone");
    if (win && win.classList) {
      win.classList.remove("is-standalone");
      win.classList.remove("show-standalone-titlebar");
    }
    if (menuEraPill) menuEraPill.hidden = true;
    if (canPromptInstall() && installBtn) {
      installBtn.hidden = false;
    }
    if (menuInstallBtn) {
      menuInstallBtn.hidden = false;
    }
  }
}

/**
 * Register a change listener for PWA install state transitions.
 */
export function onPwaStateChange(callback) {
  if (typeof callback === "function") {
    pwaListeners.push(callback);
  }
}

function notifyPwaStateChange() {
  for (const cb of pwaListeners) {
    try {
      cb(pwaState);
    } catch (e) {
      console.warn("[PWA] Error in listener:", e);
    }
  }
}

/**
 * Register service worker and bind installation event listeners.
 */
export function initPWA(options = {}) {
  if (typeof window === "undefined") return pwaState;

  pwaState.isStandalone = isStandaloneMode();
  syncStandaloneDOM(Boolean(options.showStandaloneTitlebar));

  if (window.matchMedia) {
    const mq = window.matchMedia("(display-mode: standalone)");
    const handleMqChange = function(e) {
      pwaState.isStandalone = Boolean(e && e.matches);
      syncStandaloneDOM(Boolean(options.showStandaloneTitlebar));
      notifyPwaStateChange();
    };
    if (mq.addEventListener) {
      mq.addEventListener("change", handleMqChange);
    } else if (mq.addListener) {
      mq.addListener(handleMqChange);
    }
  }

  // Listen for native beforeinstallprompt event
  window.addEventListener("beforeinstallprompt", function(event) {
    // Prevent the default mini-infobar from appearing automatically
    event.preventDefault();
    deferredPrompt = event;
    pwaState.isInstallable = true;
    syncStandaloneDOM(Boolean(options.showStandaloneTitlebar));
    notifyPwaStateChange();
  });

  // Listen for successful installation
  window.addEventListener("appinstalled", function() {
    deferredPrompt = null;
    pwaState.isInstallable = false;
    pwaState.isStandalone = true;
    syncStandaloneDOM(Boolean(options.showStandaloneTitlebar));
    notifyPwaStateChange();
  });

  // Register the service worker
  if (pwaState.isSupported && options.registerWorker !== false) {
    const swPath = options.swPath || "./sw.js";
    navigator.serviceWorker.register(swPath, { scope: "./" })
      .then(function(reg) {
        pwaState.isRegistered = true;
        pwaState.registration = reg;
        notifyPwaStateChange();
      })
      .catch(function(err) {
        console.warn("[PWA] Service Worker registration failed:", err);
      });
  }

  return pwaState;
}

/**
 * Trigger the PWA installation prompt if available.
 * Returns a Promise<{ outcome: "accepted" | "dismissed" | "unsupported" | "already_installed" }>.
 */
export async function promptInstall() {
  if (isStandaloneMode()) {
    return { outcome: "already_installed" };
  }

  if (!deferredPrompt) {
    return { outcome: "unsupported" };
  }

  try {
    // Show the installation prompt
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice && choice.outcome === "accepted") {
      deferredPrompt = null;
      pwaState.isInstallable = false;
      notifyPwaStateChange();
    }
    return choice || { outcome: "dismissed" };
  } catch (err) {
    console.error("[PWA] Error invoking prompt:", err);
    return { outcome: "error", error: err };
  }
}

/**
 * Check if the browser currently has an active install prompt ready.
 */
export function canPromptInstall() {
  return Boolean(deferredPrompt && !isStandaloneMode());
}

/**
 * Dynamically synchronize the OS window header and browser status bar
 * with the active retro design era's theme color.
 */
export function syncEraThemeColor(colorHex) {
  if (typeof document === "undefined" || !colorHex) return;

  let meta = document.getElementById("meta-theme-color");
  if (!meta) {
    meta = document.querySelector('meta[name="theme-color"]');
  }
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("name", "theme-color");
    meta.setAttribute("id", "meta-theme-color");
    document.head.appendChild(meta);
  }
  meta.setAttribute("content", colorHex);
}

/**
 * Wire interactive behaviors to retro window title bar controls:
 * - Maximize (□): Toggles fullscreen mode
 * - Minimize (_): Toggles compact toolbar view
 * - Close (×): Navigates back to Home Directory (about:dreams)
 */
export function setupWindowControls(elements = {}, onHomeNav) {
  const { btnMin, btnMax, btnClose } = elements;

  if (btnMax) {
    btnMax.addEventListener("click", function() {
      if (!document.fullscreenElement) {
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen().catch(function() {});
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen().catch(function() {});
        }
      }
    });
  }

  if (btnMin) {
    btnMin.addEventListener("click", function() {
      // Toggle compact UI view class on body
      document.body.classList.toggle("retro-compact-mode");
    });
  }

  if (btnClose) {
    btnClose.addEventListener("click", function() {
      if (typeof onHomeNav === "function") {
        onHomeNav();
      }
    });
  }
}
