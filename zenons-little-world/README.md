# Zenon's Little World

A short mobile-friendly birthday simulation gift for **Zenon**.

Static site — vanilla HTML / CSS / JS. No backend.

## Play locally

```bash
cd zenons-little-world
python3 -m http.server 8080
```

Open `http://localhost:8080`.

## Deploy (GitHub Pages)

1. Create a new repo under `mauvelita` (e.g. `zenons-little-world`).
2. Push this folder to `main`.
3. Settings → Pages → Deploy from branch `main` / root (or `/docs` if you prefer).

## Controls

- Enter a nickname for Zenon (saved in `localStorage`).
- Hub actions: Kiss, Feed cat, Chomp, Go (challenges).
- Challenges: Coffee (office), Acts of Service, Worship Scene.
- Fill Battery to 100% with Sacha not annoyed → Bedroom finale.

## Assets

| Path | Use |
|------|-----|
| `assets/faces/sacha/` | Pretty / mean / happy (+ circle crops) |
| `assets/faces/zenon/` | **Placeholders** — drop Jooheon likeness faces named `neutral.png`, `happy.png`, `flustered.png`, `ow.png` (circle PNGs work best) |
| `assets/shrine/shrine-poster.jpg` | Sofa shrine with “I ❤️ Sacha” |
| `assets/bg/` | Pixel garden / office / bedroom / party |
| `assets/props/` | Cat, iced capp, crown, Spidey poster |

## Audio

MVP uses generated cartoon SFX + soft Web Audio pad BGM. Replace later by dropping files into `assets/audio/` and wiring them in `js/audio.js`.

## MVP scope

See the approved game design: hybrid life-sim hub + 3 challenges, punish/reward reactions, no movie night, no battery drain, nickname persists across resets.
