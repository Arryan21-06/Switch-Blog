/**
 * interactions.js — Two simulated interactions for the Daybreak blog
 * Interaction A: Approval flow simulator (seeded demo data)
 * Interaction B: Friday-rule toggle illustration
 *
 * Client-side only. Keyboard accessible. No network calls.
 */

"use strict";

/* ══════════════════════════════════════════════════════════════════════════
   SEEDED DEMO DATA
   ══════════════════════════════════════════════════════════════════════ */

const BRIEF = `<div class="sim-brief">
  <div class="sim-msg">
    <div class="sim-avatar" aria-hidden="true">DB</div>
    <div class="sim-msg-body">
      <div class="sim-msg-meta"><strong class="sim-agent">Daybreak</strong> <span class="sim-ts">9:30 AM</span></div>
      <p class="sim-msg-text"><strong>Daily Brief — seeded demo</strong></p>
      <div class="sim-brief-person">
        <p><strong>@priya</strong><br>
        Yesterday: Fixed token refresh bug
        <a class="sim-link" href="#" onclick="return false;">PR #41</a>,
        started rate limiter
        <a class="sim-link" href="#" onclick="return false;">PR #44 (draft)</a><br>
        Today: Finish rate limiter, review #42<br>
        <span class="sim-evidence">Evidence: PR #41 merged 08:14, PR #44 opened 09:02</span></p>
      </div>
      <div class="sim-brief-person">
        <p><strong>@arjun</strong><br>
        Yesterday: No GitHub activity found<br>
        Today: (no prediction without evidence)<br>
        <span class="sim-evidence">Evidence: no commits, PRs or reviews in last 24h</span></p>
      </div>
      <p class="sim-hint">↩ Reply in this thread to edit your section.</p>
    </div>
  </div>
</div>`;

const PROPOSALS = `<div class="sim-proposals">
  <div class="sim-msg">
    <div class="sim-avatar" aria-hidden="true">DB</div>
    <div class="sim-msg-body">
      <div class="sim-msg-meta"><strong class="sim-agent">Daybreak</strong> <span class="sim-ts">9:32 AM</span></div>
      <p class="sim-msg-text"><strong>Proposed actions — seeded demo</strong></p>
      <ol class="sim-proposal-list" id="sim-proposal-list">
        <li class="sim-proposal" id="sim-p1" data-id="nudge-pr42-2026-11-07">
          <span class="sim-proposal-num">1.</span>
          <div class="sim-proposal-detail">
            <strong>PR #42 has waited 31h for review from @arjun</strong> (rule: 24h)<br>
            Draft nudge: "Hi Arjun, PR #42 is waiting on your review since yesterday morning."<br>
            <span class="sim-evidence">Evidence: PR #42 opened, review requested 2026-11-06 08:10</span>
          </div>
        </li>
        <li class="sim-proposal" id="sim-p2" data-id="ci-pr45-2026-11-07">
          <span class="sim-proposal-num">2.</span>
          <div class="sim-proposal-detail">
            <strong>CI on PR #45 failing for 14h</strong> (rule: 12h red CI)<br>
            Draft nudge: "CI has been failing on PR #45 since yesterday evening."<br>
            <span class="sim-evidence">Evidence: status check failed 2026-11-06 19:22</span>
          </div>
        </li>
        <li class="sim-proposal" id="sim-p3" data-id="merge-pr39-2026-11-07">
          <span class="sim-proposal-num">3.</span>
          <div class="sim-proposal-detail">
            <strong>PR #39 approved but unmerged for 26h</strong> (rule: 24h)<br>
            Draft nudge: "PR #39 was approved yesterday — it may be ready to merge."<br>
            <span class="sim-evidence">Evidence: approved 2026-11-06 07:45, still open</span>
          </div>
        </li>
      </ol>
      <p class="sim-hint">Reply: <code>approve 1 3</code> &nbsp;|&nbsp; <code>skip 2</code> &nbsp;|&nbsp; <code>approve all</code></p>
    </div>
  </div>
</div>`;

function buildGitHubCards(approved, skipped) {
  const items = {
    1: { id: "nudge-pr42-2026-11-07", label: "PR #42 — review nudge", comment: "[Daybreak, approved by @lead] Hi Arjun, PR #42 has been waiting for your review since yesterday morning. Requested: 2026-11-06 08:10." },
    2: { id: "ci-pr45-2026-11-07",   label: "PR #45 — CI alert",    comment: "[Daybreak, approved by @lead] CI has been failing on PR #45 for 14 hours. Flagged for attention." },
    3: { id: "merge-pr39-2026-11-07", label: "PR #39 — merge reminder", comment: "[Daybreak, approved by @lead] PR #39 was approved yesterday and appears ready to merge." },
  };

  let html = `<div class="sim-results">
    <div class="sim-msg">
      <div class="sim-avatar" aria-hidden="true">DB</div>
      <div class="sim-msg-body">
        <div class="sim-msg-meta"><strong class="sim-agent">Clerk</strong> <span class="sim-ts">9:40 AM</span></div>
        <p class="sim-msg-text"><strong>Actions taken — seeded demo</strong></p>`;

  approved.forEach(n => {
    const item = items[n];
    html += `<div class="sim-gh-card">
      <div class="sim-gh-card-header">
        <svg class="sim-gh-icon" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
        <span class="sim-gh-label">${item.label}</span>
        <span class="sim-gh-status sim-gh-status--posted">posted</span>
      </div>
      <p class="sim-gh-comment">${item.comment}</p>
      <p class="sim-gh-meta">Hidden idempotency marker embedded · Action ID: <code>${item.id}</code></p>
    </div>`;
  });

  skipped.forEach(n => {
    const item = items[n];
    html += `<div class="sim-gh-card sim-gh-card--skipped">
      <div class="sim-gh-card-header">
        <span class="sim-gh-label">${item.label}</span>
        <span class="sim-gh-status sim-gh-status--skipped">skipped</span>
      </div>
      <p class="sim-gh-comment sim-muted">Skipped by @lead — no action taken.</p>
    </div>`;
  });

  html += `</div></div></div>`;
  return html;
}

/* ══════════════════════════════════════════════════════════════════════════
   INTERACTION A — APPROVAL FLOW SIMULATOR
   ══════════════════════════════════════════════════════════════════════ */

function initApprovalFlow() {
  const root = document.getElementById("approval-sim");
  if (!root) return;

  // Track state
  let state = "idle"; // idle | brief | proposals | result
  const postedIds = new Set(); // idempotency store

  function render() {
    root.innerHTML = "";

    // Banner — always visible
    root.insertAdjacentHTML("beforeend", `
      <div class="sim-banner" role="note">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/>
          <path d="M8 5v4M8 10.5v.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        Simulated walkthrough with seeded demo data. Not the live system.
      </div>`);

    const stage = document.createElement("div");
    stage.className = "sim-stage";
    root.appendChild(stage);

    if (state === "idle") {
      stage.innerHTML = `
        <div class="sim-idle">
          <p class="sim-idle-label">Trigger the daily brief to see the flow</p>
          <button class="sim-btn sim-btn--primary" id="sim-run-brief" aria-label="Run daily brief simulation">
            ▶ Run Brief
          </button>
        </div>`;
      document.getElementById("sim-run-brief").addEventListener("click", () => {
        state = "brief";
        render();
      });
    }

    else if (state === "brief") {
      stage.innerHTML = BRIEF;
      stage.insertAdjacentHTML("beforeend", `
        <div class="sim-controls">
          <button class="sim-btn sim-btn--primary" id="sim-show-proposals">
            Sentinel proposals →
          </button>
        </div>`);
      document.getElementById("sim-show-proposals").addEventListener("click", () => {
        state = "proposals";
        render();
      });
    }

    else if (state === "proposals") {
      stage.innerHTML = BRIEF + PROPOSALS;
      stage.insertAdjacentHTML("beforeend", `
        <div class="sim-controls">
          <div class="sim-quick-btns" role="group" aria-label="Quick approval actions">
            <button class="sim-btn sim-btn--accent" data-cmd="approve 1 3">approve 1 3</button>
            <button class="sim-btn sim-btn--muted"  data-cmd="skip 2">skip 2</button>
            <button class="sim-btn sim-btn--muted"  data-cmd="approve all">approve all</button>
          </div>
          <form class="sim-cmd-form" id="sim-cmd-form" aria-label="Enter approval command">
            <label for="sim-input" class="sim-input-label">Or type a command:</label>
            <div class="sim-input-row">
              <input
                type="text"
                id="sim-input"
                class="sim-input"
                placeholder="approve 1 3"
                aria-label="Approval command"
                autocomplete="off"
                spellcheck="false">
              <button type="submit" class="sim-btn sim-btn--primary">Send</button>
            </div>
          </form>
        </div>`);

      // Quick buttons
      stage.querySelectorAll("[data-cmd]").forEach(btn => {
        btn.addEventListener("click", () => processCommand(btn.dataset.cmd));
      });

      // Form submit
      document.getElementById("sim-cmd-form").addEventListener("submit", e => {
        e.preventDefault();
        const val = document.getElementById("sim-input").value.trim();
        if (val) processCommand(val);
      });

      // Focus input
      setTimeout(() => {
        const inp = document.getElementById("sim-input");
        if (inp) inp.focus();
      }, 100);
    }

    else if (state === "result") {
      stage.innerHTML = root.dataset.resultHtml || "";
      stage.insertAdjacentHTML("beforeend", `
        <div class="sim-controls">
          <div class="sim-quick-btns">
            <button class="sim-btn sim-btn--muted" id="sim-retry-idem">
              Try approving 1 again (idempotency check)
            </button>
            <button class="sim-btn sim-btn--ghost" id="sim-reset">
              ↺ Reset
            </button>
          </div>
        </div>`);

      document.getElementById("sim-retry-idem").addEventListener("click", () => {
        // Show idempotency result
        const idemNote = document.createElement("div");
        idemNote.className = "sim-idem-note";
        idemNote.setAttribute("role", "alert");
        idemNote.innerHTML = `<strong>Already posted, skipped (idempotent).</strong><br>
          Action ID <code>nudge-pr42-2026-11-07</code> was found in the write-ahead log. No duplicate comment posted.`;
        const existing = stage.querySelector(".sim-idem-note");
        if (!existing) stage.insertBefore(idemNote, stage.querySelector(".sim-controls"));
        else existing.scrollIntoView({ behavior: "smooth", block: "nearest" });
      });

      document.getElementById("sim-reset").addEventListener("click", () => {
        state = "idle";
        postedIds.clear();
        root.dataset.resultHtml = "";
        render();
      });
    }
  }

  function processCommand(cmd) {
    cmd = cmd.toLowerCase().trim();
    const approved = [];
    const skipped  = [];

    // Parse command
    if (cmd === "approve all") {
      approved.push(1, 2, 3);
    } else {
      // extract numbers after "approve"
      const appMatch = cmd.match(/approve\s+([\d\s]+)/);
      if (appMatch) {
        appMatch[1].trim().split(/\s+/).forEach(n => {
          const num = parseInt(n);
          if ([1,2,3].includes(num)) approved.push(num);
        });
      }
      // extract numbers after "skip"
      const skipMatch = cmd.match(/skip\s+([\d\s]+)/);
      if (skipMatch) {
        skipMatch[1].trim().split(/\s+/).forEach(n => {
          const num = parseInt(n);
          if ([1,2,3].includes(num)) skipped.push(num);
        });
      }
      // any numbers not mentioned → skip
      [1,2,3].forEach(n => {
        if (!approved.includes(n) && !skipped.includes(n)) skipped.push(n);
      });
    }

    // Record posted IDs (for idempotency demo — just item 1 and 3 from default cmd)
    approved.forEach(n => postedIds.add(n));

    root.dataset.resultHtml = buildGitHubCards(approved, skipped);
    state = "result";
    render();
  }

  render();
}

/* ══════════════════════════════════════════════════════════════════════════
   INTERACTION B — FRIDAY RULE TOGGLE
   ══════════════════════════════════════════════════════════════════════ */

function initFridayRule() {
  const root = document.getElementById("friday-sim");
  if (!root) return;

  let ruleOn = false;

  function render() {
    root.innerHTML = `
      <div class="friday-scenario">
        <div class="friday-scenario-header">
          <span class="friday-label label">Illustration of the intended behaviour</span>
          <div class="friday-toggle-row">
            <label class="toggle-label" for="friday-toggle">
              Friday rule: no nudges after 17:00
            </label>
            <button
              class="toggle-switch ${ruleOn ? "is-on" : ""}"
              id="friday-toggle"
              role="switch"
              aria-checked="${ruleOn}"
              aria-label="Toggle Friday no-nudge rule">
              <span class="toggle-thumb"></span>
            </button>
          </div>
        </div>

        <div class="sim-banner sim-banner--small" role="note">
          Scenario: Friday, 16:30 IST — Sentinel detects a delayed review
        </div>

        <div class="friday-chat">
          <div class="sim-msg">
            <div class="sim-avatar" aria-hidden="true">SN</div>
            <div class="sim-msg-body">
              <div class="sim-msg-meta">
                <strong class="sim-agent">Sentinel</strong>
                <span class="sim-ts">16:31</span>
              </div>
              ${ruleOn
                ? `<div class="friday-suppressed" role="status">
                    <p class="sim-msg-text sim-muted" style="text-decoration:line-through;">
                      Proposal: PR #42 has waited 31h — nudge @arjun
                    </p>
                    <p class="friday-rule-note">
                      ⏸ Nudge suppressed — Friday rule active (no nudges after 17:00 on Fridays).
                      Will re-evaluate Monday morning.
                    </p>
                   </div>`
                : `<div class="friday-active">
                    <p class="sim-msg-text">Proposed action:</p>
                    <div class="sim-proposal" style="margin-top:0.5rem;">
                      <span class="sim-proposal-num">1.</span>
                      <div class="sim-proposal-detail">
                        <strong>PR #42 has waited 31h for review from @arjun</strong><br>
                        Draft nudge: "Hi Arjun, PR #42 is waiting on your review."
                      </div>
                    </div>
                    <p class="sim-hint">Reply: <code>approve 1</code> | <code>skip 1</code></p>
                   </div>`}
            </div>
          </div>
        </div>

        <p class="friday-cta-note">
          ${ruleOn
            ? `Rule is <strong>on</strong>. Sentinel will not propose nudges on Fridays. Change by typing in the room.`
            : `Rule is <strong>off</strong>. Toggle it on to see the nudge suppressed.`}
        </p>
      </div>`;

    document.getElementById("friday-toggle").addEventListener("click", () => {
      ruleOn = !ruleOn;
      render();
    });

    // Keyboard: space/enter on the toggle
    document.getElementById("friday-toggle").addEventListener("keydown", (e) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        ruleOn = !ruleOn;
        render();
      }
    });
  }

  render();
}

/* ══════════════════════════════════════════════════════════════════════════
   BOOT
   ══════════════════════════════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {
  initApprovalFlow();
  initFridayRule();
});

