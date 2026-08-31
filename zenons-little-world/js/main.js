import { state, saveNickname, getNickname } from "./state.js";
import { unlockAudio, sfx } from "./audio.js";
import { ui } from "./ui.js";
import {
  runIntro,
  enterHub,
  onKiss,
  onFeedCat,
  onChomp,
  openChallenges,
} from "./scenes.js";

async function boot() {
  // first gesture unlocks audio
  const unlockOnce = async () => {
    await unlockAudio();
    document.body.removeEventListener("pointerdown", unlockOnce);
  };
  document.body.addEventListener("pointerdown", unlockOnce);

  ui.showHud(false);
  ui.showDock(false);
  ui.setBg("assets/bg/party.png");
  ui.confetti(true);
  ui.clearActors();
  ui.makeChibi("sacha", { face: "assets/faces/sacha/happy-circle.png", emoji: "🎂" });

  await ui.say([
    { speaker: "System", text: "Zenon's Little World" },
    { speaker: "System", text: "A tiny birthday simulation. Tap to continue." },
  ]);

  const name = await ui.askName();
  saveNickname(name);
  sfx.reveal();

  // dock bindings
  ui.el.dock.addEventListener("click", async (e) => {
    const btn = e.target.closest("button[data-action]");
    if (!btn || ui.busy) return;
    sfx.click();
    const action = btn.dataset.action;
    if (state.scene !== "hub" && action !== "challenges") return;
    ui.busy = true;
    try {
      if (action === "kiss") await onKiss();
      else if (action === "feed") await onFeedCat();
      else if (action === "chomp") await onChomp();
      else if (action === "challenges") await openChallenges();
    } finally {
      ui.busy = false;
    }
  });

  await runIntro();
}

boot().catch((err) => {
  console.error(err);
  alert("Something broke in the garden. Check console.");
});

// expose for debug
window.__zenon = { state, getNickname, enterHub };
