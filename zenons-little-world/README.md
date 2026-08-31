# Zenon's Little World

A short mobile-friendly birthday simulation gift for **Zenon**.

Static site — vanilla HTML / CSS / JS. No backend.

## Play

Live: [https://mauvelita.github.io/zenons-little-world/](https://mauvelita.github.io/zenons-little-world/)

Local:

```bash
cd zenons-little-world
python3 -m http.server 8080
```

Open `http://localhost:8080`.

## Deploy (GitHub Pages)

1. Push to `main`.
2. Settings → Pages → **Source: GitHub Actions**.
3. Play at [https://mauvelita.github.io/zenons-little-world/](https://mauvelita.github.io/zenons-little-world/).

## Controls

- Enter a nickname for Zenon (saved in `localStorage`).
- Hub actions: Kiss, Feed cat, Chomp, Go (challenges).
- Challenges: Coffee (office), Make offerings, Worship Scene.
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
