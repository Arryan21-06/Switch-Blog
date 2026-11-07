/**
 * assets.config.js — Real asset presence map and dynamic swap logic
 * Daybreak: Standup Zero for Switch
 *
 * HOW IT WORKS:
 *   1. Drop real files into assets/real/ (e.g. brief.png, cockpit.png, friday-rule.gif).
 *   2. Either set REAL_ASSETS[key] = true, OR let the dynamic probe detect the file on load.
 *   3. The page automatically swaps the illustration for the real asset and removes
 *      the "Illustration of the intended flow" caption.
 */

"use strict";

const REAL_ASSETS = {
  brief: false,
  proposals: false,
  "approval-github": false,
  "friday-rule": false,
  cockpit: false,
  demo: false,
};

const ASSET_PATHS = {
  brief: {
    real: "assets/real/brief.png",
    realCaption: "Verified capture: Daily brief with evidence links",
    illustration: "assets/panels/panel-05-chat-800.webp",
    illustrationAlt: "Illustration of the intended flow: Switch channel showing the daily brief with proposed actions",
  },
  proposals: {
    real: "assets/real/proposals.png",
    realCaption: "Verified capture: Sentinel proposal list",
    illustration: "assets/panels/panel-05-chat-800.webp",
    illustrationAlt: "Illustration of the intended flow: Sentinel proposals list",
  },
  "approval-github": {
    real: "assets/real/approval-github.png",
    realCaption: "Verified capture: GitHub comment posted after approval",
    illustration: "assets/panels/panel-06-github-800.webp",
    illustrationAlt: "Illustration of the intended flow: GitHub comment posted after approval",
  },
  "friday-rule": {
    real: "assets/real/friday-rule.gif",
    realCaption: "Verified capture: Friday rule change and next-run compliance",
    illustration: "assets/panels/panel-06-github-800.webp",
    illustrationAlt: "Illustration of the intended flow: Flow checklist and GitHub comment",
  },
  cockpit: {
    real: "assets/real/cockpit.png",
    realCaption: "Verified capture: Daybreak Cockpit read-only dashboard",
    illustration: "assets/panels/panel-04-flow-800.webp",
    illustrationAlt: "Daybreak Cockpit dashboard visual",
  },
  demo: {
    real: "assets/real/demo.mp4",
    realCaption: "Verified demo recording",
    illustration: null,
    illustrationAlt: null,
  },
};

/**
 * Activate real asset on a given slot DOM element
 */
function activateRealAsset(slot, config) {
  const realEl = slot.querySelector(".asset-slot__real");
  const illustEl = slot.querySelector(".asset-slot__illustration");
  const labelEl = slot.querySelector(".asset-slot__label");
  const frame = slot.querySelector(".tilt-frame");

  if (realEl) {
    realEl.removeAttribute("hidden");
    realEl.style.display = "block";
    realEl.src = config.real;
  }
  if (illustEl) {
    illustEl.setAttribute("hidden", "");
    illustEl.style.display = "none";
  }
  if (labelEl) {
    labelEl.textContent = "";
  }
  if (frame) {
    frame.removeAttribute("data-illustration");
    const fig = frame.querySelector("figcaption");
    if (fig && config.realCaption) {
      fig.textContent = config.realCaption;
    }
  }
}

/**
 * Activate illustration on a given slot DOM element
 */
function activateIllustration(slot, config) {
  const realEl = slot.querySelector(".asset-slot__real");
  const illustEl = slot.querySelector(".asset-slot__illustration");
  const labelEl = slot.querySelector(".asset-slot__label");
  const frame = slot.querySelector(".tilt-frame");

  if (illustEl) {
    illustEl.removeAttribute("hidden");
    illustEl.style.display = "block";
    if (config.illustrationAlt) illustEl.alt = config.illustrationAlt;
  }
  if (realEl) {
    realEl.setAttribute("hidden", "");
    realEl.style.display = "none";
  }
  if (labelEl) {
    labelEl.textContent = "Illustration of the intended flow";
    labelEl.style.fontStyle = "italic";
  }
  if (frame) {
    frame.setAttribute("data-illustration", "");
  }
}

/**
 * Check and swap assets
 */
function swapAssets() {
  document.querySelectorAll("[data-asset-key]").forEach((slot) => {
    const key = slot.dataset.assetKey;
    const config = ASSET_PATHS[key];
    if (!config) return;

    if (REAL_ASSETS[key]) {
      activateRealAsset(slot, config);
      return;
    }

    // Default to illustration
    activateIllustration(slot, config);

    // Dynamic test: attempt to probe if real image exists and is a valid image (naturalWidth > 1)
    if (config.real && !config.real.endsWith(".mp4")) {
      const probe = new Image();
      probe.onload = () => {
        // If file exists and is a genuine image (> 1px dimension)
        if (probe.naturalWidth > 1) {
          activateRealAsset(slot, config);
        }
      };
      probe.onerror = () => {
        // Keeps illustration active
      };
      probe.src = config.real + "?t=" + Date.now();
    }
  });

  // Check demo video slot
  const demoSlot = document.querySelector(".demo-slot");
  if (demoSlot) {
    const video = demoSlot.querySelector("video");
    const placeholder = demoSlot.querySelector(".demo-slot__placeholder");
    if (REAL_ASSETS.demo && video && placeholder) {
      video.removeAttribute("hidden");
      placeholder.style.display = "none";
      demoSlot.classList.remove("dev-placeholder");
    }
  }
}

document.addEventListener("DOMContentLoaded", swapAssets);
