# Deploy checklist (run on your desktop)

## 1. Push to GitHub

If your local clone is **empty** (just README from GitHub), copy this entire folder into it first, then:

```bash
cd ~/Desktop/zenons-little-world   # your clone path

git add -A
git status
git commit -m "Add Zenon's Little World birthday sim MVP"
git branch -M main
git push -u origin main
```

If you already have the files from Cursor / zip:

```bash
git add -A
git commit -m "Add Zenon's Little World birthday sim MVP"
git push -u origin main
```

## 2. Enable GitHub Pages

1. GitHub → **mauvelita/zenons-little-world** → **Settings** → **Pages**
2. **Source:** Deploy from branch
3. **Branch:** `main` → `/ (root)` → **Save**
4. Live URL (after ~1 min): `https://mauvelita.github.io/zenons-little-world/`

## 3. Run locally

```bash
cd ~/Desktop/zenons-little-world
python3 -m http.server 8080
```

Open **http://localhost:8080**

> Must use a local server (not `file://`) so ES modules load.

## 4. Optional: add Zenon faces

Replace placeholders in `assets/faces/zenon/`:
- `neutral.png`
- `happy.png`
- `flustered.png`
- `ow.png`

Use square/circle face crops (160×160 works well).

## 5. Optional: swap BGM

Drop an MP3/OGG into `assets/audio/bgm.mp3` and wire it in `js/audio.js` (instructions in README).
