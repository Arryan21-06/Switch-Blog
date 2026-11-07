/**
 * assets.config.js — Real asset presence map and swap logic
 * Daybreak: Standup Zero for Switch
 *
 * HOW IT WORKS:
 *   1. Add a key to REAL_ASSETS when a real file has been captured.
 *   2. Set the value to true.
 *   3. The page will automatically swap the illustration for the real file on load.
 *
 * REAL FILES LIVE IN: assets/real/
 * ILLUSTRATION PANELS LIVE IN: assets/panels/
 */

const REAL_ASSETS = {
  /** Daily brief screenshot — shows Scribe output with evidence links */
  brief: false,

  /** Sentinel proposals screenshot — numbered list with approve/snooze UI */
  proposals: false,

  /** Approval-to-GitHub screenshot — Clerk posting comment after approval */
  "approval-github": false,

  /** Friday-rule GIF — rule changed in room, next run obeys it */
  "friday-rule": false,

  /** Daybreak Cockpit screenshot — read-only web dashboard */
  cockpit: false,

  /** Full demo video */
  demo: false,
};

/**
 * Map: asset key → { real: path, illustration: path, illustrationAlt }
 * illustration paths point to the sliced collage panels.
 */
const ASSET_PATHS = {
  brief: {
    real: "assets/real/brief.png",
    illustration: "assets/panels/panel-05-chat-800.webp",
    illustrationAlt:
      "Illustration of the intended flow: Switch #daybreak channel showing the Daybreak daily brief with proposed actions",
  },
  proposals: {
    real: "assets/real/proposals.png",
    illustration: "assets/panels/panel-05-chat-800.webp",
    illustrationAlt:
      "Illustration of the intended flow: Sentinel proposal list with approve and dismiss buttons",
  },
  "approval-github": {
    real: "assets/real/approval-github.png",
    illustration: "assets/panels/panel-06-github-800.webp",
    illustrationAlt:
      "Illustration of the intended flow: GitHub comment posted by daybreak-bot after human approval",
  },
  "friday-rule": {
    real: "assets/real/friday-rule.gif",
    illustration: "assets/panels/panel-06-github-800.webp",
    illustrationAlt:
      "Illustration of the intended flow: The Flow checklist showing Draft → Recommend → Approve → Act sequence",
  },
  cockpit: {
    real: "assets/real/cockpit.png",
    illustration: "assets/panels/panel-04-flow-800.webp",
    illustrationAlt:
      "Illustration of the intended flow: GitHub–Daybreak–Switch integration diagram",
  },
  demo: {
    real: "assets/real/demo.mp4",
    illustration: null,
    illustrationAlt: null,
  },
};

/**
 * swapAssets()
 * Called on DOMContentLoaded.
 * For each [data-asset-key] element:
 *   - If REAL_ASSETS[key] is true: show real img, hide illustration img
 *   - If false: show illustration, update label text
 */
function swapAssets() {
  document.querySelectorAll("[data-asset-key]").forEach((slot) => {
    const key = slot.dataset.assetKey;
    const config = ASSET_PATHS[key];
    if (!config) return;

    const realEl = slot.querySelector(".asset-slot__real");
    const illustEl = slot.querySelector(".asset-slot__illustration");
    const labelEl = slot.querySelector(".asset-slot__label");

    if (REAL_ASSETS[key]) {
      // Real asset exists — show it
      if (realEl) {
        realEl.removeAttribute("hidden");
        realEl.src = config.real;
      }
      if (illustEl) illustEl.setAttribute("hidden", "");
      if (labelEl) labelEl.textContent = "";
    } else {
      // No real asset — show illustration with caption
      if (illustEl) {
        illustEl.removeAttribute("hidden");
        if (config.illustrationAlt) illustEl.alt = config.illustrationAlt;
      }
      if (realEl) realEl.setAttribute("hidden", "");
      if (labelEl) {
        labelEl.textContent = "Illustration of the intended flow";
        labelEl.style.fontStyle = "italic";
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", swapAssets);
