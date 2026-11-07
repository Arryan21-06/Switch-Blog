DAYBREAK

Blog Context & Content Plan

A systematic brief for the team before drafting the final hackathon blog

| Purpose This document captures the complete blog direction: the story, section structure, content to include, evidence required, assets to collect, technical claims to verify, and responsibilities. It is a planning/context document—not the final public blog. |

| --- |

# ## 1. Executive summary

Daybreak is the team's Switch hackathon project. Its core idea is to reduce the manual coordination around daily engineering standups by turning recent GitHub activity into a concise team brief, surfacing potential blockers, and proposing follow-up actions. The system is designed around three agent roles—Scribe, Sentinel and Clerk—with a human approval gate before GitHub write actions.

The blog will explain the problem, show how the workflow operates, demonstrate why Switch is central, document the engineering decisions, and close with what the team actually learned during implementation. The blog must distinguish clearly between planned behaviour, implemented behaviour and behaviour verified in the demo.

# ## 2. Blog identity and editorial direction

| Working title | Daybreak: Standup Zero for Switch |

| --- | --- |

| Subtitle | An evidence-backed daily engineering brief, with human-approved follow-up actions. |

| Core message | Daybreak drafts updates from GitHub activity, identifies potential blockers and proposes actions; a human approves actions before they are executed. |

| Voice | First-person plural: we / our team. |

| Tone | Direct, clear, technical and honest. Avoid cinematic language, hype and unsupported claims. |

| Length target | Approximately 800–1,200 words; keep it scannable and readable in around three minutes. |

| Platform | DEV Community (dev.to) is the current recommended default, not a hackathon requirement confirmed by the available rules. |

| Primary purpose | Explain the project and provide credible evidence of the team's implementation. |

| Secondary purpose | Compete for the Best Blog side prize, if the team chooses to submit for it. |

## Editorial rules

- Do not write planned features as if they are already working.

- After implementation is verified, use direct present/past-tense descriptions instead of repeatedly saying “designed to” or “intended to”.

- Use real screenshots, real repository links and tested commands only.

- Do not claim time saved, productivity gains or measured impact unless the team has actually measured them.

- Do not claim Slack integration if the demo uses Mattermost. Describe the platform that actually ran.

- Do not claim Plane, Forgejo or other tracker integrations as built; these are roadmap items in the current design.

- Do not invent the origin story. Obtain one honest sentence from the teammate(s) who initiated the idea.

# ## 3. The agreed five-section structure

Keep this exact numbering and section order throughout drafting. The concept belongs inside Section 2; do not create a separate concept section or shift the numbering.

## Section 1 — The problem

Purpose: Explain the concrete coordination problem that Daybreak addresses and why the team chose to work on it.

- Open with a specific, relatable engineering moment rather than a generic statement about scattered information.

- Explain that developers may repeat updates already visible in GitHub, while review delays or CI failures can remain unnoticed.

- Include one honest origin sentence from the team: what specifically frustrated or motivated someone to build this?

- If no real team incident can be shared, use a clearly labelled seeded demo example, such as “In our seeded demo, PR #42 has been waiting for review for 31 hours.” Use those exact details only if they exist in the seeded test.

- Keep the problem narrow: collecting daily updates and chasing reviews. Do not imply Daybreak solves broad project-tracker drift.

Evidence/assets needed: One real origin sentence; optionally one verified seeded scenario; no product screenshots required if the demo is not ready.

## Section 2 — How Daybreak works

Purpose: Introduce the product concept, the three agents, the end-to-end flow and the human approval model.

- Explain that Daybreak uses a shared Switch room as the team's coordination space. Rules, decisions and approvals are intended to live in that conversation; describe only the room capabilities that have been verified.

- Scribe: prepares a daily brief from recent GitHub activity and attaches evidence links.

- Sentinel: checks for potential blockers and proposes follow-up actions.

- Clerk: executes permitted GitHub actions only after a human approves them.

- Retain the key line: “Scribe drafts, Sentinel recommends, Clerk acts only after human approval.”

- Explain the evidence principle: “No link, no claim.” If there is no supporting GitHub activity, the brief should report “No activity found” rather than inventing work. Include this as a demonstrated behaviour only after the seeded test passes.

- State the deliberately small scope: one GitHub repository, one chat room and three agent roles.

Evidence/assets needed: A simple architecture/workflow diagram and screenshots of the daily brief, Sentinel proposal and Clerk approval/result. Only use real captured UI.

## Section 3 — Why Switch

Purpose: Show why Switch is essential to the workflow rather than merely a place where messages are posted.

- Explain the shared-room approach and the value of coordinating multiple specialised agents in one team conversation.

- Describe room memory, rules, decisions and agent handoffs only if the implementation and Switch behaviour have been confirmed.

- The strongest proof is the Friday-rule demonstration: change a rule in chat (for example, no nudges on Fridays), then show that the next run respects it.

- Show the human approval taking place in the room, if that is how the actual demo works.

- Use Mattermost in the blog if that is the actual demo client. Do not write that Slack is integrated unless the team has run and verified it.

Evidence/assets needed: A short GIF or screen recording of the Friday-rule change and next-run behaviour; evidence of the actual chat client and approval interaction.

## Section 4 — Engineering decisions

Purpose: Document the important implementation choices, safety boundaries, constraints and trade-offs.

- Evidence handling: updates must link to supporting GitHub activity; absent activity must not be fabricated.

- Permissions: clarify which agents are read-only and which component has GitHub write permissions.

- Approval gate: explain precisely what a human approves and which GitHub actions can follow.

- Idempotency: describe duplicate-action prevention only if it is implemented and tested.

- Blocker rules: list the actual thresholds used only after checking the running implementation. The current design draft includes PR waiting for review over 24 hours, red CI over 12 hours, approved-but-unmerged over 24 hours, and assigned issue with no activity over 3 days.

- Scope and trade-offs: one repository, one room, three roles; manual demo trigger is acceptable if scheduling is not implemented.

- Security and setup: explain token scope, environment variables, dry-run behaviour and setup steps only as actually implemented.

Evidence/assets needed: Verified implementation details, relevant code/config screenshots if useful, and a concise permissions/workflow diagram.

## Section 5 — What we learned and what's next

Purpose: Close with implementation reality: what failed, what changed, what works, what remains limited and what the team would do next.

- Describe real bugs, integration friction, failed tests and fixes. Do not pre-write fictional challenges.

- Report only tests that were actually run and their outcomes.

- State limitations plainly, including any planned Switch capability or integration that was not completed.

- Separate shipped features from roadmap items.

- Possible roadmap items from the design: scheduled trigger, weekly scoreboard, nudge budget/quiet hours, reviewer digest, solo Telegram mode, Plane/Forgejo adapters, release-day brief and voice recap. Mark only as future work unless completed.

Evidence/assets needed: A short verified test summary, one or two genuine lessons, limitations and a clearly separated next-steps list.

# ## 4. Product facts and boundaries to preserve

## Core agent responsibilities

| Agent | Role | Boundary |

| --- | --- | --- |

| Scribe | Drafts per-person daily updates from recent GitHub activity; includes evidence links. | Read-only; must not invent work when activity is absent. |

| Sentinel | Detects configured potential blockers and proposes a limited set of follow-up actions. | Recommends; does not execute GitHub write actions. |

| Clerk | Carries out approved GitHub comments, labels or review requests and returns result links. | Write-capable role; acts only after explicit human approval. |

## Feature priority from the project design

| Priority | Items | How to describe in blog |

| --- | --- | --- |

| P0 — Core | Daily brief; evidence rule; thread edits; blocker detection; approval-gated actions; room rules/memory. | Call these implemented only after each is verified. Otherwise say planned/in progress. |

| P1 — If time permits | Scheduled trigger; weekly scoreboard; nudge budget/quiet hours; reviewer digest. | Do not imply these are part of the shipped demo unless they are. |

| P2 — Roadmap | Solo Telegram mode; Plane/Forgejo adapters; release-day brief; voice recap. | Keep in future work only. |

## Explicit non-goals

- Agents do not modify source code.

- Agents do not merge pull requests.

- No automatic assignment of work.

- No multi-repository organisation dashboard in the initial scope.

- No custom standalone UI is required for the initial demo.

# ## 5. Claims that must be verified before publication

Use this checklist as a release gate. A claim should move from “planned” to “working” only after the teammate responsible can demonstrate it.

| Claim / behaviour | Current status from design | Evidence required | Blog wording until verified |

| --- | --- | --- | --- |

| Scribe produces evidence-backed daily brief | P0 design | Run against seeded GitHub activity; inspect links and output. | “The workflow is designed to…” |

| No-activity fallback | P0 design | Run seeded empty-activity test and capture “No activity found”. | Do not call it a demonstrated feature yet. |

| Sentinel blocker detection | P0 design | Trigger each blocker rule or document which rules were tested. | Say “configured to detect” only if implemented. |

| Clerk approval gate | P0 design | Show approval, resulting GitHub action and result link. | Do not say actions are safely gated until tested. |

| Duplicate-action prevention | Design requirement | Repeat the same approval/action and verify no duplicate side effect. | Do not claim idempotency until tested. |

| Switch room memory / rules | Open question in design | Demonstrate rule storage and retrieval across runs. | Avoid claims about persistent memory until confirmed. |

| Agent handoffs / multiple providers | Open question in design | Show actual agents, message flow and providers in use. | Describe only the observed arrangement. |

| Friday-rule proof | Critical Switch proof to secure | Change rule in room; run workflow again; show no nudge on Friday. | Do not claim Switch-specific value without this or equivalent evidence. |

| Chat client | Mattermost planned for demo | Capture actual running client and verify deployment. | Name Mattermost if that is what ran; do not claim Slack integration. |

| Scheduler | P1 / optional | Show scheduled trigger operating without manual initiation. | If absent, say the demo is manually triggered. |

| Tracker adapters | P2 roadmap | Working integration with named tracker. | Do not claim Plane/Forgejo or generic tracker updates as built. |

# ## 6. Visual and interactive elements for the blog

Keep the blog visually useful without building a custom website. Use the blogging platform's native features and real project captures.

- Hero/first-screen: title, one-line value proposition, demo GIF directly after the hook.

- GIF 1: daily brief plus evidence links.

- GIF 2: Sentinel proposes a nudge, a human approves it, Clerk posts the GitHub action. Prefer one compact GIF if it tells the whole flow clearly.

- Screenshot: architecture/workflow diagram showing GitHub → Switch room → Scribe/Sentinel/Clerk → approval → GitHub.

- Screenshot: actual Mattermost/Switch room showing a rule or approval interaction.

- Optional collapsible technical details: architecture, blocker thresholds, permissions and setup notes.

- Copy-paste setup command near the top, but only after the command is tested on a clean environment.

- All screenshots must come from the actual running project. Do not create mock UI and present it as a product screenshot.

# ## 7. What we need from teammates

The blog can be assembled quickly once the repository and screenshots arrive. Ask teammates for concrete artifacts, not a general project explanation.

| Requested item | What exactly to provide | Why it is needed | Owner / status |

| --- | --- | --- | --- |

| Public GitHub repository | Final public repo URL; confirm README is present and repository can be accessed without permission. | Link near the top and reproducibility for judges/readers. | Teammate building project — pending |

| Verified setup command | Exact commands to clone, configure environment and run seeded demo; test on a clean setup if possible. | Copy-paste reproducibility block near the top. | Project teammate — pending |

| Daily brief screenshot | Actual screenshot showing output and evidence links; redact secrets/private data. | Section 2 and demo visuals. | Project teammate — pending |

| Approval-flow screenshot/GIF | Sentinel proposal → human approval → Clerk result; show actual GitHub outcome if available. | Main workflow proof and hero/demo GIF. | Project teammate — pending |

| Friday-rule proof | Screenshot or short recording of changing a rule in the room and the next run obeying it. | Most important evidence for why Switch is central. | Project teammate — high priority |

| No-activity test | Screenshot/log from seeded test showing “No activity found”. | Supports the evidence-first principle. | Project teammate — pending |

| Architecture diagram | Simple diagram of GitHub, Switch room, agents, approval and GitHub action. | Makes technical flow understandable. | Project teammate — pending |

| Implementation facts | Which P0 features work; which are partial; which remain unbuilt; exact client used; known limitations. | Prevents overclaiming in Sections 2–5. | Project teammate — pending |

| Origin sentence | One honest sentence describing the specific frustration or incident that motivated the idea. | Makes Section 1 personal and distinctive. | User / teammate — needs input |

| Challenges and lessons | Two or three actual problems encountered, what caused them and how they were resolved (or not). | Section 5; write after build. | All builders — after implementation |

# ## 8. Platform and hackathon submission notes

Current editorial decision: use DEV Community (dev.to) as the default publishing platform because it is suitable for technical write-ups and supports Markdown-style content, code blocks, tables and collapsible details. This is a team choice, not a confirmed hackathon platform mandate.

- The blog is treated as a side-prize entry (Best Blog), separate from the main project submission.

- The #HowISwitch social post is a separate side-prize activity; do not confuse its hashtag requirement with the blog's publishing requirements.

- Before publishing, re-open the official hackathon page and submission form to confirm the latest blog eligibility, link field, deadline and any tag/format requirements.

- The main project submission takes priority over polishing the blog if the build or submission is at risk.

Official hackathon page: https://www.wemakedevs.org/hackathons/switch

# ## 9. Suggested final blog flow (reader experience)

- Reader sees the title and understands the product in one sentence.

- Reader immediately sees a short real demo GIF/video and can open the public repository.

- Section 1 makes the problem concrete with an honest origin or labelled seeded example.

- Section 2 explains the three agents, the evidence rule and the approval model.

- Section 3 proves why Switch matters, preferably with the Friday-rule demonstration.

- Section 4 explains the engineering choices and safety boundaries without drowning the reader in implementation detail.

- Section 5 gives a candid account of what worked, what did not and what comes next.

- End with repository/setup links and a concise invitation to try the demo.

# ## 10. Immediate action plan

- Now — collect assets: Get the public repository URL, tested setup command and actual screenshots/GIF from the project teammate.

- Before drafting Sections 2–4: Get a written status for each P0 claim and verify Switch room behaviour, agent handoffs and the Friday-rule test.

- Draft Sections 1–2: Use the concrete problem, real origin sentence, product flow and agent responsibilities. Keep seeded examples labelled.

- Draft Sections 3–4: Use only verified evidence for Switch's role and engineering decisions.

- Draft Section 5: Ask builders for real failures, fixes, test outcomes and limitations after the build is stable.

- Final review: Check every claim against the running demo/repo; check links, screenshots, platform requirements and word count.

- Publish and submit: Publish on the chosen platform and submit the blog URL only where the official form requests it.

# ## 11. Ready-to-send request to the project teammate

Please send me these once the build is stable (ideally in the next 1–2 hours): 1. Public GitHub repository link. 2. Exact tested command to set up and run the demo. 3. Screenshot of the generated daily brief with evidence links. 4. Screenshot or GIF of Sentinel proposal → human approval → Clerk action/result. 5. Proof of the Friday-rule test: change the rule in the Switch/Mattermost room, then show the next run respecting it. 6. Screenshot/log of the “No activity found” seeded test, if it passes. 7. A simple architecture diagram, if already available. 8. A short status list: which P0 features are working, partial or not implemented; what client is used; and any known limitations. 9. Two or three real implementation challenges and how you handled them. Please don't spend time making special blog screenshots or mockups. Actual screenshots from the working project are enough.

# ## 12. Final accuracy checklist

- ☐ Title is “Daybreak: Standup Zero for Switch”.

- ☐ The five sections remain in the agreed order and numbering.

- ☐ The blog says Daybreak drafts and proposes; humans approve actions.

- ☐ The table has exactly two comparisons: collecting updates and chasing reviews.

- ☐ No claim that tracker drift is solved.

- ☐ No Slack integration claim unless it was actually run and verified.

- ☐ Mattermost is named if it is the actual demo client.

- ☐ Room memory, rules and multi-agent handoffs are described only to the extent verified.

- ☐ Friday-rule demonstration is included only if it passes.

- ☐ No-activity fallback is included as a working feature only if the seeded test passes.

- ☐ Idempotency, blocker thresholds and permissions are not claimed without evidence.

- ☐ P1 and P2 items are clearly labelled as optional/future work unless shipped.

- ☐ No unmeasured time-saving or productivity claims.

- ☐ Repo URL, setup command, screenshots and GIF are real and checked.

- ☐ The blog's platform/tag/link requirements are rechecked against the official submission form.

End of working brief
