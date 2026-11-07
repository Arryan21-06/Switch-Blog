# Daybreak: Standup Zero for Switch — Hackathon Blog

> Official single-page engineering blog for **Daybreak: Standup Zero for Switch**.  
> **Team:** Attention is All You Need  
> **Hackathon:** WeMakeDevs × Switch "Flip the Switch" Hackathon (Track 1: Best Business Workflow)  
> **Repository:** [github.com/Arryan21-06/Flip-the-Switch](https://github.com/Arryan21-06/Flip-the-Switch)

---

## Quickstart (Run Locally)

This is a clean vanilla HTML/CSS/JS site with **no build step** and **no framework dependencies**.

### Option A: Using `npx serve` (recommended)
```bash
# In the project root directory:
npx serve .
# Open http://localhost:3000 in your browser
```

### Option B: Python built-in server
```bash
python -m http.server 8000
# Open http://localhost:8000 in your browser
```

---

## Dropping Real Project Screenshots

The site ships with fallback illustrations sliced from the design collage. When real screenshots or screen recordings are captured, simply drop them into `assets/real/` with these exact filenames:

| Filename | Where It Appears | Description |
|---|---|---|
| `assets/real/brief.png` | Section 2 (How It Works) | Daily brief output with clickable GitHub URLs |
| `assets/real/proposals.png` | Section 2 (How It Works) | Sentinel proposal list with review alerts |
| `assets/real/approval-github.png` | Section 4 (Engineering) | Clerk comment on GitHub after human approval |
| `assets/real/friday-rule.gif` | Section 3 (Why Switch) | Screen recording of the Friday rule toggle in Switch |
| `assets/real/cockpit.png` | Section 5 (What We Learned) | Daybreak Cockpit read-only web dashboard |
| `assets/real/demo.mp4` | Section 0 (Hero / Top) | 3-minute end-to-end walkthrough video |

**Automatic swap:**  
As soon as a valid image is placed in `assets/real/`, `js/assets.config.js` dynamically detects it on page load, swaps out the illustration, and removes the `[Illustration]` label automatically. Alternatively, you can explicitly set `REAL_ASSETS.<key> = true` in `js/assets.config.js`.

---

## Development Placeholders Toggle

To review unfilled team cards (Origin sentence, Builder challenges, Video slot, Dev notes):
- Open `js/main.js` and set:
  ```javascript
  window.SHOW_PLACEHOLDERS = true; // shows yellow dashed outline
  ```
- Before publishing to judges or the public, set:
  ```javascript
  window.SHOW_PLACEHOLDERS = false; // cleanly hides any remaining unfilled placeholder blocks
  ```

---

## Deployment

### Netlify / Vercel
Simply drag and drop the folder or point your repository to the root directory. Publish directory is `.`. A `netlify.toml` file is included for proper headers and cache settings.

### GitHub Pages
1. Go to repository **Settings** → **Pages**.
2. Select **Source:** Deploy from a branch (`main` / root).
3. The site is live immediately.

---

## License
MIT License — Attention is All You Need.

