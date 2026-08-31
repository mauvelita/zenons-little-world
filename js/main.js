async function boot() {
  const fit = () => {
    const raw = window.visualViewport?.height || window.innerHeight || 800;
    const h = Math.max(320, Math.round(raw));
    document.documentElement.style.setProperty("--app-h", `${h}px`);
  };
  fit();
  window.visualViewport?.addEventListener("resize", fit);
  window.visualViewport?.addEventListener("scroll", fit);
  window.addEventListener("orientationchange", () => setTimeout(fit, 250));

  // first gesture unlocks audio
  const kickAudio = () => unlockAudio();
  document.addEventListener("pointerdown", kickAudio, { capture: true });
  document.addEventListener("touchstart", kickAudio, { capture: true });
  document.addEventListener("click", kickAudio, { capture: true });

  ui.showHud(false);
  ui.showDock(false);
  ui.setBg("assets/faces/sacha/happysacha.jpeg");
  ui.confetti(true);
  ui.clearActors();
  setMood(Mood.HAPPY);
  ui.makeChibi("sacha", { emoji: "🎂" });

  await ui.say([
    { speaker: "Player", text: "A tiny birthday simulation. Tap to continue." },
  ]);

  const name = await ui.askName();
  saveNickname(name);
  sfx.reveal();

  // dock bindings
  ui.el.dock.addEventListener("click", async (e) => {
    const btn = e.target.closest("button[data-action]");
    if (!btn || ui.busy || ui.actionLock) return;
    sfx.click();
    const action = btn.dataset.action;
    if (state.scene !== "hub" && action !== "challenges") return;
    ui.actionLock = true;
    ui.el.dock.style.pointerEvents = "none";
    try {
      if (action === "kiss") await onKiss();
      else if (action === "feed") await onFeedCat();
      else if (action === "chomp") await onChomp();
      else if (action === "challenges") await openChallenges();
    } finally {
      ui.actionLock = false;
      ui.el.dock.style.pointerEvents = "";
    }
  });

  await enterHub({ first: true });
}

boot().catch((err) => {
  console.error(err);
  alert("Something broke in the garden. Check console.");
});

// expose for debug
window.__zenon = { state, getNickname, enterHub };
