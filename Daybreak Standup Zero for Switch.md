# Daybreak: Standup Zero for Switch

*Project design draft · Flip the Switch Hackathon, Track 1 (Best Business Workflow) · prepared Nov 7, 2026*

## 1. The one-minute pitch

**Daybreak** is a Switch room where two or three AI agents and your team replace the daily standup and the status-chasing around it.

Every morning the room posts what each person actually worked on (pulled from GitHub, with links), flags the pull requests and issues that are quietly stuck, and, only after a human taps approve, nudges the right person and updates the tracker.

- **Who it is for:** dev teams of 2 to 10 people, and solo developers with side projects.
- **The change they will notice:** by 9:30 AM the standup is already written, a stuck PR gets reviewed by lunch instead of on day three, and nobody retypes status into a tracker.
- **Why it needs Switch:** the room is the shared memory (team rules, snoozes, decisions), the agents come from different providers, and every action that touches other people goes through a human approval inside chat.
- **Scope:** one GitHub repo, one chat room, three agent roles, one scoreboard. Deliberately small.

## 2. Time reality

Submissions close **tonight, Nov 7, at 11:59 PM IST**. This is a one-day sprint, so the plan in section 9 has explicit cut lines and a shippable version at roughly the halfway point. Per the hackathon rules the Switch setup and the workflow must be built during the event (libraries and templates are fine). Re-read the Rules tab before you start.

## 3. The problem

Three small frictions that repeat every working day:

1. **Status theatre.** People write or speak updates by hand even though the facts already exist in commits, PRs and issues. A 10 to 15 minute standup for a team of five costs roughly an hour of combined attention each day (this figure is an assumption; the scoreboard lets users enter their own).
2. **Rotting work.** A review request waits two days, CI fails and nobody notices, an approved PR is never merged. Nobody wants to be the person who nags, so it quietly slows everything.
3. **Tracker drift.** The tracker disagrees with reality because updating it is a second job. Common complaints about project tools are exactly this: updating the tool feels slower than doing the work.

## 4. A day with Daybreak (what the user observes)

- **9:30 AM.** The room posts a brief. Each person gets a three-line draft of yesterday and today, with links to the commits and PRs behind every line. Priya replies in the thread, "shorten mine and mention the auth bug", and the Scribe edits it.
- **9:32 AM.** The Sentinel posts three proposed actions: "PR #42 has waited 31 hours for review from Arjun", "CI on PR #45 has been red for 14 hours", "PR #39 is approved but unmerged for 26 hours". Each comes with evidence and a drafted nudge.
- **9:40 AM.** The lead replies `approve 1 3` and `snooze 2 1d`. The Clerk posts the comments on GitHub and requests the review. The snooze is saved as a room decision.
- **Noon.** PR #42 is reviewed. No meeting happened.
- **Friday.** The scoreboard reports median time-to-first-review, number of stuck items resolved, and standup minutes saved, compared with the baseline from the first day.

The user sees fewer meetings, faster reviews and a tracker that is already correct, all within the first week.

## 5. Features

### P0: must ship tonight

| ID | Feature | What the user sees | Acceptance test |
| --- | --- | --- | --- |
| F1 | Daily brief | One message per day with a section per person | Brief posts within 60 seconds of the trigger and every line links to evidence |
| F2 | Evidence rule | No claim without a URL | A seeded repo with zero activity for a person produces "no activity found", never invented work |
| F3 | Thread edits | Reply to adjust your own update | "shorten mine" changes only that person's section |
| F4 | Blocker detection | A short list of stuck items with reasons | All seeded stuck items found, the healthy PR is not flagged |
| F5 | Approval-gated actions | `approve 1 3`, `skip 2`, `snooze 2 2d` | Nothing is posted to GitHub before approval, and approved items post exactly once |
| F6 | Room rules and memory | Team rules and snoozes persist | A snooze set today is respected in tomorrow's run |

### P1: if time allows

| ID | Feature | Notes |
| --- | --- | --- |
| F7 | Scheduled trigger | A cron job or GitHub Action posts the trigger at 09:30 IST. For the demo you can trigger manually |
| F8 | Scoreboard | Weekly message: median review wait, stuck items resolved, standup minutes saved |
| F9 | Nudge budget | At most N nudges per person per day, plus quiet hours |
| F10 | Reviewer digest | A short "PRs waiting on you" summary sent to each reviewer |

### P2: stretch (mention in the README as roadmap)

Solo mode in Telegram for personal projects, a Plane or Forgejo adapter, release-day variant of the brief, and a voice recap.

### Non-goals

No code changes by agents, no merging, no auto-assigning, no multi-repo org dashboards, no custom UI. The chat is the UI.

## 6. Why Switch is load-bearing

A cron job plus a webhook could post a digest. Daybreak is built so that it would fall apart without Switch:

- **Room memory drives behavior.** Rules ("review within 24 hours", "no nudges on Fridays", "quiet hours 20:00 to 09:00"), snoozes and decisions live in the Room. Every agent reads them on every run, and humans change them by talking in chat.
- **Multiple agents, different providers.** The Scribe runs on Claude Code, the Sentinel on Codex or OpenCode. They hand off through the room, and a human sits between the Sentinel's proposals and the Clerk's actions.
- **Human-in-the-loop by design.** Approvals are first-class and every outbound action is attributable to the person who approved it.
- **Chat-native.** The same room works in Mattermost for the demo and in Slack, Teams, Discord or Telegram for real teams.

| Judging criterion | How Daybreak answers it |
| --- | --- |
| Use of Switch | Room rules and decisions, multi-agent handoff, approval gates, chat-native UX |
| Technical execution | One-command setup, seeded demo repo, deterministic test scenarios, idempotent actions |
| Creativity and impact | Replaces a daily ritual, measurable before/after scoreboard |
| Presentation | 3-minute demo that follows one real morning end to end |

## 7. Architecture

### 7.1 Overview

```
  Scheduler (cron / GitHub Action)          GitHub repo(s)
  04:00 UTC = 09:30 IST                      ^  (gh CLI, fine-grained token)
        | posts trigger via webhook          |
        v                                    |
  +---------------------------------------------------------+
  |  Chat channel #daybreak  (Mattermost; swap Slack/Discord) |
  +---------------------------+-----------------------------+
                              | Collaboration Bridge
                              v
                +-----------------------------+
                |  Switch Room (Postgres)     |
                |  rules . decisions . tasks  |
                +--------------+--------------+
                               | Agent Bridge
         +---------------------+----------------------+
         v                     v                      v
   Scribe (Claude Code)   Sentinel (Codex /      Clerk (Claude Code,
   builds per-person      OpenCode) finds        write-only after
   briefs, edits          blockers, drafts       approval: comments,
                          proposals              labels, review requests
```

### 7.2 Components

| Component | Role | Notes |
| --- | --- | --- |
| Switch Console + local server | Runs the agents and the Room | Mac for the main build; use the Docker-based local server from the quickstart |
| Mattermost | Chat surface | Bundled with Switch, so no workspace admin needed for the demo |
| Scribe agent | Collect and write | Read-only GitHub access |
| Sentinel agent | Detect and propose | Read-only GitHub access, applies Room rules |
| Clerk agent | Execute approved actions | The only agent with write scope, and it acts only on approved items |
| Scheduler | Daily trigger | Posts a message into the channel through a Mattermost incoming webhook |
| Metrics script | Scoreboard numbers | Small Python or Node script reading GitHub JSON |

The three roles can collapse to two agents if time is short (Clerk becomes a mode of the Scribe), but three visible roles read better in the demo.

### 7.3 Data flow, step by step

1. The scheduler (or you, in the demo) posts "brief" into #daybreak.
2. The Scribe reads the Room rules, runs `gh` queries for the last 24 hours, and posts one message with a section per person.
3. The Sentinel reads the same data plus the Room rules and snoozes, and posts a numbered list of proposals as a thread under the brief.
4. A human replies `approve 1 3`, `skip 2` or `snooze 2 2d`.
5. The Clerk executes approved items through `gh`, posts the resulting links back in the thread, and the decision is recorded in the Room.
6. Once a week the Scribe posts the scoreboard.

### 7.4 GitHub access

Use the `gh` CLI authenticated with a fine-grained token limited to the demo repo. Read scope for Scribe and Sentinel. Write scope (issues and pull requests comments, labels, review requests) only for the Clerk. Useful commands:

```
gh pr list --state open --json number,title,author,createdAt,updatedAt,isDraft,reviewDecision,reviewRequests,statusCheckRollup,url
gh issue list --state open --json number,title,assignees,labels,updatedAt,url
gh api "repos/OWNER/REPO/commits?since=2026-11-06T00:00:00Z"
```

### 7.5 Default Room rules

Seeded into the Room on setup and editable by talking to the agents:

- Review requests should be answered within 24 hours.
- A red CI on an open PR older than 12 hours is a blocker.
- An approved PR unmerged for more than 24 hours is a blocker.
- An assigned issue with no activity for 3 days is stale.
- At most 3 proposals per run and 2 nudges per person per day.
- Quiet hours 20:00 to 09:00 IST. No nudges on Fridays after 17:00.
- **No link, no claim:** every statement about someone's work must include a URL.

### 7.6 Message formats

**Brief (per person):**

```
@priya
Yesterday: Fixed token refresh bug (PR #41, merged), started rate limiter (PR #44, draft)
Today: Finish rate limiter, review #42
Evidence: <links>
Reply in this thread to edit.
```

**Proposal list:**

```
1. PR #42 has waited 31h for review from @arjun (rule: 24h)
   Draft nudge: "Hi Arjun, PR #42 is waiting on your review since yesterday morning."
   Evidence: <PR link>, requested at 2026-11-06 08:10
2. CI on PR #45 failing for 14h (rule: 12h)
   ...
Reply: approve 1 3 | skip 2 | snooze 2 2d
```

### 7.7 Approval protocol and idempotency

- Proposals carry an id made of type, target and date (for example `nudge-pr42-2026-11-07`). The Clerk refuses to act on an id it has already completed, so a second run never double-posts.
- Approval is by typed reply in the thread. Use emoji reactions only if the docs confirm Switch exposes them.
- Every posted comment starts with a clear prefix such as "\[Daybreak, approved by @lead\]" so teammates know where it came from.

### 7.8 Guardrails

- Read-only by default, write only after approval, and only comments, labels and review requests.
- Nudge budget and quiet hours enforced from Room rules.
- Evidence rule to reduce hallucinated status.
- No secrets in the repo. Provide `.env.example`, and keep tokens fine-grained and revocable.
- Dry-run mode (`DAYBREAK_DRY_RUN=1`) lets the Clerk print what it would do. Use it for the demo rehearsal.

### 7.9 Agent instructions (sketch)

**Scribe:** "You write standup briefs from GitHub data. For each person list what they did in the last 24 hours and what they are likely doing today. Every sentence must cite a URL. If there is no activity, say so. Never guess. Respect edit requests from the named person only."

**Sentinel:** "Read the Room rules. Find items that break a rule using the GitHub data. Propose at most three actions, ranked by impact, each with evidence, the rule it breaks, and a polite draft message. Do not post to GitHub. Respect snoozes and quiet hours."

**Clerk:** "Act only on proposals a human has approved in the thread. Use the `gh` CLI. Post the result link. Refuse anything not approved or already completed. Record decisions in the Room."

## 8. Repo structure and config sketch

```
daybreak/
  README.md                 one-command setup, demo GIF, architecture diagram
  .env.example
  switch/room-template.yaml room, roles, rules (adapt to the real schema)
  agents/scribe.md          instructions
  agents/sentinel.md
  agents/clerk.md
  scripts/setup.sh          checks Docker, gh auth, Switch Console, creates room
  scripts/seed_demo.sh      creates the demo repo with seeded PRs and issues
  scripts/trigger_brief.sh  posts the trigger via Mattermost webhook
  scripts/metrics.py        scoreboard numbers
  docs/ARCHITECTURE.md
  docs/DEMO.md
```

Illustrative room sketch (replace with the real template schema from the Switch docs; use the docs MCP in your coding agent to generate it):

```
room: daybreak
rules:
  - review_sla_hours: 24
  - red_ci_hours: 12
  - no_link_no_claim: true
agents:
  scribe:   { type: claude-code, access: read }
  sentinel: { type: codex,       access: read }
  clerk:    { type: claude-code, access: write-after-approval }
```

## 9. Build plan (one-day sprint with cut lines)

Times are hours from the moment you start. Aim to submit by about 9 PM IST, leaving buffer before the 11:59 PM deadline.

| Hours | Task | Output |
| --- | --- | --- |
| 0:00 to 0:45 | Install Console, start the local server, run the quickstart room, connect the docs MCP, authenticate `gh`, create the Mattermost incoming webhook. Resolve the open questions in section 14 | A working "hello" room and agents |
| 0:45 to 1:30 | Demo repo and `seed_demo.sh` | Repeatable seeded scenarios (section 10) |
| 1:30 to 3:30 | Scribe: queries, per-person brief, evidence rule, thread edits | **F1, F2, F3** |
| 3:30 to 5:30 | Sentinel: rules from the Room, proposals with evidence | **F4. Level 1 is shippable here** |
| 5:30 to 7:00 | Approval flow and Clerk write-back with idempotency | **F5. Level 2** |
| 7:00 to 8:00 | Snoozes and rules as Room decisions, scheduler | **F6, F7** |
| 8:00 to 8:45 | Scoreboard script and weekly message | **F8** |
| 8:45 to 10:15 | README, setup script, record the demo, submit | Deliverables |
| After | Blog, #HowISwitch post, Wispr scorecard screenshot | Side prizes |

**Record a backup demo video the moment Level 1 works.** If time runs short, cut in this order: scoreboard, scheduler (trigger manually), Clerk write-back (show nudges as approved drafts). Never cut the evidence rule or the approval gate, because they are what make the project trustworthy.

## 10. Test scenarios (seeded demo repo)

| Seed | Expected result |
| --- | --- |
| PR A: review requested 30h ago | Flagged, nudge drafted |
| PR B: CI red for 14h | Flagged |
| PR C: approved, unmerged 26h | Flagged |
| Issue D: assigned, untouched 4 days | Flagged as stale |
| PR E: opened 2h ago, healthy | Not flagged (false-positive check) |
| Person with no activity | "No activity found", nothing invented |
| Approve the same proposal twice | Exactly one GitHub comment |
| Snooze set today | Item absent from tomorrow's proposals |

## 11. Demo script (about 3 minutes) and submission checklist

1. (15s) The problem: standups, stuck PRs, tracker drift.
2. (30s) Trigger the brief. Show each person's section with evidence links.
3. (20s) Edit one update in the thread.
4. (45s) Sentinel proposals. Approve two, snooze one. Show the actual GitHub comments and review request.
5. (30s) Change a rule in chat ("no nudges on Fridays") and show the next run obeying it.
6. (20s) The scoreboard before and after.
7. (20s) Why Switch: room memory, two providers, approval gate, and the same room in Slack or Discord.

**Submission checklist:** public repo, README with one-command setup and architecture diagram, demo video, `.env.example`, seeded demo script, template YAML, note listing which parts are Switch. Optional: blog post, #HowISwitch post, Wispr Insights screenshot, star the Switch repo.

## 12. Risks and mitigations

| Risk | Mitigation |
| --- | --- |
| Switch has no native scheduler | Post the trigger from cron or a GitHub Action. The agents still respond in the room |
| Agent invents status | Evidence rule, "no activity found" fallback, test scenario in section 10 |
| Spammy nudges | Max proposals per run, nudge budget, quiet hours, human approval |
| GitHub rate limits or auth problems | Single small repo, cached JSON per run, fine-grained token |
| Running out of time | Cut lines in section 9 and an early backup demo video |
| Reproducibility | `setup.sh`, seeded repo, `.env.example`, tested from a clean clone |
| Overstated impact | The scoreboard measures baseline versus after. Label demo numbers as seeded |

## 13. Stretch roadmap (for the README)

Solo mode in Telegram for side projects, Plane and Forgejo adapters, a reviewer digest, release-day brief, and a lightweight per-agent cost line in the scoreboard.

## 14. Verify in the first 30 minutes

I could not read the Switch template schema or the examples folder, so confirm these in the docs (use the docs MCP) before building:

- The exact room template and role configuration format.
- How agents receive and parse thread replies, and what typed command syntax Switch supports.
- Whether emoji reactions reach the agents.
- How Room rules and decisions are written and read by agents.
- Whether Mattermost incoming webhooks are enabled in the bundled instance.
- Whether two agent types (Claude Code plus Codex or OpenCode) can run side by side in one room on your machine and subscriptions.
