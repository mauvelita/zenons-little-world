function nick() {
  return getNickname();
}

async function enterHub({ first = false } = {}) {
  state.scene = "hub";
  if (first) setMood(Mood.OK);
  ui.setBg("assets/bg/hub.jpeg");
  ui.clearActors();
  ui.confetti(!!first);
  if (!first) ui.confetti(false);
  // keep confetti a bit on first visit then stop after a while
  if (first) setTimeout(() => ui.confetti(false), 12000);

  ui.showHud(true);
  ui.refreshHud();
  ui.showDock(true);

  ui.addProp("shrine", "assets/shrine/shrine-poster.jpg", () => onShrine());
  ui.addProp("spidey", "assets/props/spidey-poster.jpeg", () => onSpidey());
  ui.addProp("cup", "assets/props/iced-capp.png", () => onCappProp());
  if (!state.flags.wearingHalo) {
    ui.addProp("halo", "assets/props/crown.png", () => onHalo());
  }
  ui.addCat(() => onFeedCat());

  ui.makeChibi("sacha", { emoji: moodEmoji() });
  ui.makeChibi("zenon");
  ui.updateFaces();

  if (first) {
    await ui.say([
      { speaker: "Zenon", text: "She's… everywhere. Posters. Diamonds and pearls. Lilies. I'm going to combust." },
      { speaker: "Sacha", text: `Battery up, ${nick()}. Kiss me. Serve me. Survive me.` },
    ]);
  }

  maybeOfferFinale();
}

async function maybeOfferFinale() {
  if (!canFinale()) return;
  const go = await ui.openModal({
    title: "Bedroom unlocked",
    bodyHtml: `<p class="hint">Battery full. Sacha is pleased. One more kiss?</p>`,
    actions: [
      { label: "Go to bedroom 💋", value: "yes", primary: true },
      { label: "Stay in the garden", value: "no" },
    ],
  });
  if (go === "yes") await runFinale();
}

async function onKiss() {
  sfx.kiss();
  ui.flashFx("hearts", "💋");
  ui.popEmoji("❤️", 55, 35);
  addBattery(8);
  setMood(Mood.HAPPY);
  ui.refreshHud();
  ui.updateFaces();
  const zen = document.querySelector(".chibi.zenon");
  if (zen) {
    zen.classList.add("bounce");
    setTimeout(() => zen.classList.remove("bounce"), 900);
  }
  await ui.say([
    { speaker: "Sacha", text: "Good boy." },
    { speaker: "Zenon", text: "hehe" },
  ]);
  maybeOfferFinale();
}

async function onFeedCat() {
  sfx.click();
  state.flags.fedCat = true;
  if (state.scene === "hub" && !state.challenges.service) {
    state.serviceSteps.cat = true;
  }
  addBattery(4);
  setMood(Mood.HAPPY);
  ui.refreshHud();
  ui.popEmoji("🐱", 20, 55);
  await ui.say([
    { speaker: "Cat", text: "mrrp." },
    { speaker: "Sacha", text: "He fed the baby. Keep him." },
    { speaker: "Zenon", text: "I would die for this cat. And for you. Mostly you." },
  ]);
  checkServiceComplete();
  maybeOfferFinale();
}

async function onShrine() {
  sfx.kiss();
  state.flags.shrineKissed = true;
  state.serviceSteps.pearl = true;
  addBattery(5);
  setMood(Mood.HAPPY);
  ui.refreshHud();
  ui.updateFaces();
  await ui.openModal({
    title: "Sacha Shrine",
    bodyHtml: `<img class="shrine-view" src="assets/shrine/shrine-poster.jpg" alt="I love Sacha shrine" />
      <p class="hint">After the offering, he makes out with the poster.</p>`,
    actions: [{ label: "I ❤️ Sacha", value: "ok", primary: true }],
  });
  await ui.say([
    { speaker: "Sacha", text: "Relax. I only said diamonds and pearls." },
  ]);
  checkServiceComplete();
  maybeOfferFinale();
}

async function onSpidey() {
  sfx.click();
  await ui.say([
    { speaker: "Zenon", text: "Spidey. Obviously." },
    { speaker: "Sacha", text: "Nerd. Cute nerd. Kissable nerd." },
  ]);
}

async function onCappProp() {
  sfx.click();
  addBattery(3);
  ui.refreshHud();
  await ui.say([
    { speaker: "Zenon", text: "Tim Hortons iced capp. Sacred." },
    { speaker: "Sacha", text: "Cute. Now make me coffee. Office. Go." },
  ]);
}

async function onHalo() {
  if (state.flags.wearingHalo) return;
  sfx.reveal();
  await ui.say([
    { speaker: "Sacha", text: "My angel. Put it on." },
  ]);
  state.flags.wearingHalo = true;
  ui.wearHalo();
  await ui.say([
    { speaker: "Zenon", text: "*puts it on. nervous laugh* Stop looking at me!!!" },
  ]);
}

function checkServiceComplete() {
  // pearl step via challenges menu or shrine pearl
  const { cat, coffee, pearl } = state.serviceSteps;
  if (cat && coffee && pearl && !state.challenges.service) {
    state.challenges.service = true;
    addBattery(15);
    setMood(Mood.HAPPY);
    ui.refreshHud();
    sfx.happy();
    ui.say([
      { speaker: "Sacha", text: "Offerings accepted. The shrine is fed. Don't stop." },
      { speaker: "Zenon", text: "I'll bring more. I'll bring everything." },
    ]);
  }
}

async function onChomp() {
  const target = await ui.openModal({
    title: "Chomp where?",
    bodyHtml: ``,
    actions: [
      { label: "Arm", value: "arm", primary: true },
      { label: "Face", value: "face" },
      { label: "Side", value: "side" },
      { label: "Head", value: "head" },
      { label: "Cancel", value: "cancel" },
    ],
  });
  if (target === "cancel") return;

  // Player is Zenon — he chomps. Sacha is the one who gets bitten and comments.
  await ui.say([
    { speaker: "Zenon", text: "I'll eat you!" },
    { speaker: "Sacha", text: "Eat me!" },
  ]);
  sfx.chomp();
  ui.flashFx("", "🦷");
  ui.popEmoji("💢", 50, 40);
  addBattery(6);
  setMood(Mood.MAD);
  ui.refreshHud();
  ui.updateFaces();
  await ui.say([
    { speaker: "Sacha", text: "ow:(" },
    { speaker: "Zenon", text: `*chomps ${target} like a dog on a bone*` },
    { speaker: "Sacha", text: "Disgusting. Do it again." },
  ]);
  maybeOfferFinale();
}

async function openChallenges() {
  const c = state.challenges;
  const pick = await ui.openModal({
    title: "Let's have some fun?",
    bodyHtml: `<p class="hint">Pick one. Don't make me wait.</p>`,
    actions: [
      { label: c.coffee ? "Meet me at the office ✓" : "Meet me at the office", value: "coffee", primary: !c.coffee, className: c.coffee ? "done" : "" },
      { label: c.service ? "Make offerings ✓" : "Make offerings", value: "service", className: c.service ? "done" : "" },
      { label: c.worship ? "Sanctuary ✓" : "Sanctuary", value: "worship", className: c.worship ? "done" : "" },
      { label: canFinale() ? "Bedroom — Final kiss" : "Bedroom (locked)", value: "bedroom", disabled: !canFinale() },
      { label: "Back", value: "back" },
    ],
  });
  if (pick === "coffee") await runCoffee();
  else if (pick === "service") await runService();
  else if (pick === "worship") await runWorship();
  else if (pick === "bedroom") await runFinale();
}

async function runCoffee() {
  state.scene = "office";
  ui.showDock(false);
  ui.setBg("assets/bg/office.jpeg");
  ui.clearActors();
  ui.confetti(false);
  ui.makeChibi("sacha", { emoji: "☕" });
  ui.makeChibi("zenon");
  ui.showHud(true);

  await ui.say([
    { speaker: "Sacha", text: `Desk. Coffee. Now, ${nick()}. Make it perfect.` },
    { speaker: "Zenon", text: "Yes. Immediately. I know how high." },
  ]);

  const choice = await ui.say(
    [{ speaker: "Player", text: "How does Zenon brew?" }],
    [
      { label: "Careful, devoted, tasting every step", value: "good", primary: true },
      { label: "Nervous chaos — too much of everything", value: "bad" },
    ]
  );

  if (choice === "good") {
    sfx.happy();
    setMood(Mood.HAPPY);
    addBattery(20);
    state.challenges.coffee = true;
    state.serviceSteps.coffee = true;
    ui.refreshHud();
    ui.updateFaces();
    document.querySelector(".chibi.zenon")?.classList.add("bounce");
    await ui.say([
      { speaker: "Sacha", text: "Oh? Not bad. Don't let it go to your head." },
      { speaker: "Zenon", text: "*blushes so hard he almost levitates*" },
    ]);
    await rewardScene();
  } else {
    sfx.splash();
    ui.flashFx("splash", "☕");
    setMood(Mood.MAD);
    addBattery(5);
    ui.refreshHud();
    const z = document.querySelector(".chibi.zenon");
    if (z) z.classList.add("drenched");
    ui.updateFaces();
    ui.popEmoji("☕", 62, 38);
    await ui.say([
      { speaker: "Sacha", text: "This is a crime." },
      { speaker: "Zenon", text: "*drenched* …I'm weirdly happy though." },
      { speaker: "Sacha", text: "Knees. Now." },
    ]);
    await punishRewardScene();
    state.challenges.coffee = true;
    state.serviceSteps.coffee = true;
    addBattery(15);
    ui.refreshHud();
  }
  await enterHub();
}

async function punishRewardScene() {
  ui.showDock(false);
  const z = document.querySelector(".chibi.zenon");
  if (z) z.classList.add("timeout");
  setMood(Mood.MAD);
  ui.updateFaces();
  await ui.say([
    { speaker: "Zenon", text: "Please. Mercy. I'll do better. I'll—" },
    { speaker: "Sacha", text: "Quiet." },
  ]);
  sfx.slap();
  ui.flashFx("", "👋");
  ui.popEmoji("💢", 60, 35);
  await ui.say([{ speaker: "Zenon", text: "ow:(" }]);
  sfx.kiss();
  ui.flashFx("hearts", "💋");
  setMood(Mood.HAPPY);
  addBattery(10);
  ui.refreshHud();
  if (z) z.classList.remove("timeout", "drenched");
  ui.updateFaces();
  await ui.say([
    { speaker: "Sacha", text: "I slap you. Then I kiss you." },
    { speaker: "Zenon", text: "Again." },
  ]);
}

async function rewardScene() {
  setMood(Mood.HAPPY);
  ui.updateFaces();
  document.querySelector(".chibi.zenon")?.classList.add("bounce");
  sfx.kiss();
  await ui.say([
    { speaker: "Sacha", text: "Reward: you may kiss me. Don't get shy now." },
    { speaker: "Zenon", text: "*kisses cheek, melts into floor tiles*" },
  ]);
}

async function runService() {
  ui.showDock(false);
  await ui.say([
    { speaker: "Sacha", text: "Make me an offering." },
    { speaker: "Sacha", text: "1) Feed the cat  2) Make me coffee  3) Diamonds and pearls at my shrine." },
  ]);

  // pearl offering happens here as dedicated step
  const doPearl = await ui.say(
    [{ speaker: "Player", text: "Offer diamonds and pearls?" }],
    [
      { label: "Leave diamonds and pearls + a lily", value: "yes", primary: true },
      { label: "Half-ass it and hope", value: "no" },
    ]
  );

  if (doPearl === "yes") {
    state.serviceSteps.pearl = true;
    sfx.reveal();
    addBattery(8);
    ui.refreshHud();
  } else {
    setMood(Mood.MAD);
    ui.refreshHud();
    ui.updateFaces();
    document.querySelector(".chibi.zenon")?.classList.add("timeout");
    await ui.say([
      { speaker: "Sacha", text: "Timeout corner. Think about what you did." },
      { speaker: "Zenon", text: "I deserve this. I also miss you from three meters away." },
    ]);
    await punishRewardScene();
    state.serviceSteps.pearl = true; // after punishment he does it properly
    addBattery(8);
  }

  if (!state.serviceSteps.cat || !state.serviceSteps.coffee) {
    await ui.say([
      {
        speaker: "Sacha",
        text: `Still missing: ${[!state.serviceSteps.cat && "feed the cat", !state.serviceSteps.coffee && "make me coffee"].filter(Boolean).join(" + ")}.`,
      },
    ]);
  }

  checkServiceComplete();
  if (!state.challenges.service && state.serviceSteps.cat && state.serviceSteps.coffee && state.serviceSteps.pearl) {
    state.challenges.service = true;
    addBattery(12);
    setMood(Mood.HAPPY);
    ui.refreshHud();
  }
  await enterHub();
}

async function runWorship() {
  state.scene = "worship";
  setMood(Mood.OK);
  ui.showDock(false);
  ui.setBg("assets/bg/hub.jpeg");
  ui.clearActors();
  ui.makeChibi("sacha", { emoji: "😈" });
  ui.makeChibi("zenon");

  await ui.say([
    { speaker: "Sacha", text: `Look at me, ${nick()}.` },
    { speaker: "Zenon", text: "I am. I always am. I forgot what we were talking about—" },
  ]);

  const tone = await ui.say(
    [{ speaker: "Sacha", text: "How do you want me." }],
    [
      { label: "Soft. Praise me.", value: "soft", primary: true },
      { label: "Mean. Make me stumble.", value: "mean" },
    ]
  );

  if (tone === "soft") {
    setMood(Mood.HAPPY);
    addBattery(18);
    ui.refreshHud();
    ui.updateFaces();
    document.querySelector(".chibi.zenon")?.classList.add("bounce");
    await ui.say([
      { speaker: "Sacha", text: "You're doing so well. My devoted little CEO." },
      { speaker: "Zenon", text: "Say it again. I'll build you a temple. I already did." },
    ]);
    await rewardScene();
  } else {
    setMood(Mood.MAD);
    ui.updateFaces();
    await ui.say([
      { speaker: "Sacha", text: "On your knees. Use your words." },
      { speaker: "Zenon", text: "I— you— goddess— wait what was the question—" },
    ]);
    await punishRewardScene();
    addBattery(18);
    ui.refreshHud();
  }
  state.challenges.worship = true;
  await enterHub();
}

async function runFinale() {
  state.scene = "bedroom";
  setMood(Mood.HAPPY);
  ui.showDock(false);
  ui.confetti(true);
  ui.setBg("assets/bg/bedroom.jpeg");
  ui.clearActors();
  ui.makeChibi("sacha", { emoji: "❤️" });
  ui.makeChibi("zenon");
  ui.showHud(true);

  await ui.say([
    { speaker: "Sacha", text: `Happy birthday, ${nick()}.` },
    { speaker: "Sacha", text: "One more kiss." },
  ]);
  sfx.kiss();
  ui.flashFx("hearts", "💋");
  await ui.say([
    { speaker: "Zenon", text: "I'd still be kissing the poster. Even from timeout. You're so sexy!!!" },
    { speaker: "Sacha", text: "Come here." },
  ]);

  await ui.openModal({
    title: "Happy birthday",
    bodyHtml: `<div class="end-card">
      <p>Happy birthday, ${nick()}.</p>
    </div>`,
    actions: [
      { label: "Play again", value: "replay", primary: true },
      { label: "Stay", value: "stay" },
    ],
  }).then(async (v) => {
    ui.confetti(false);
    if (v === "replay") {
      resetRun();
      await enterHub({ first: true });
      ui.confetti(true);
      setTimeout(() => ui.confetti(false), 8000);
    } else {
      ui.showDock(true);
    }
  });
}
