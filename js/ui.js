const $ = (id) => document.getElementById(id);

const ui = {
  el: {
    hud: $("hud"),
    batteryFill: $("battery-fill"),
    batteryPct: $("battery-pct"),
    moodEmoji: $("mood-emoji"),
    bg: $("bg"),
    confetti: $("confetti"),
    actors: $("actors"),
    emojiPop: $("emoji-pop"),
    hotspots: $("hotspots"),
    dialogue: $("dialogue"),
    speaker: $("speaker"),
    bubbleText: $("bubble-text"),
    choices: $("choices"),
    btnNext: $("btn-next"),
    dock: $("dock"),
    modal: $("modal"),
    modalTitle: $("modal-title"),
    modalBody: $("modal-body"),
    modalActions: $("modal-actions"),
    nameGate: $("name-gate"),
    nickInput: $("nickname-input"),
    fx: $("fx"),
  },

  refreshHud() {
    this.el.batteryFill.style.width = `${state.battery}%`;
    this.el.batteryPct.textContent = `${state.battery}%`;
    this.el.moodEmoji.textContent = moodEmoji();
  },

  showHud(on = true) {
    this.el.hud.classList.toggle("hidden", !on);
  },

  showDock(on = true) {
    this.el.dock.classList.toggle("hidden", !on);
  },

  setBg(src) {
    this.el.bg.style.backgroundImage = `url("${src}")`;
  },

  confetti(on) {
    const box = this.el.confetti;
    box.classList.toggle("hidden", !on);
    if (!on) {
      box.innerHTML = "";
      return;
    }
    if (box.childElementCount) return;
    const colors = ["#e8a0b0", "#d4b56a", "#7cb389", "#a8c8e8", "#f4efe6"];
    for (let i = 0; i < 36; i++) {
      const s = document.createElement("span");
      s.style.left = `${Math.random() * 100}%`;
      s.style.background = colors[i % colors.length];
      s.style.animationDuration = `${2.5 + Math.random() * 2.5}s`;
      s.style.animationDelay = `${Math.random() * 2}s`;
      s.style.width = `${6 + (i % 3) * 2}px`;
      box.appendChild(s);
    }
  },

  clearActors() {
    this.el.actors.innerHTML = "";
    this.el.hotspots.innerHTML = "";
    // remove stray props/cats attached to stage
    document.querySelectorAll(".stage .prop, .stage .cat-sprite").forEach((n) => n.remove());
  },

  makeChibi(who, opts = {}) {
    const div = document.createElement("div");
    div.className = `chibi ${who}` + (opts.className ? ` ${opts.className}` : "");
    div.dataset.who = who;
    const face = document.createElement("img");
    face.className = "face";
    face.alt = who;
    face.src = who === "sacha" ? (opts.face || sachaFace()) : (opts.face || zenonFace());
    face.onerror = () => {
      face.style.background = who === "sacha" ? "#c9a48a" : "#8a9bb0";
    };
    const body = document.createElement("div");
    body.className = "body";
    const legs = document.createElement("div");
    legs.className = "legs";
    legs.innerHTML = "<i></i><i></i>";
    body.appendChild(legs);
    div.appendChild(body);
    div.appendChild(face);
    if (opts.emoji) {
      const e = document.createElement("span");
      e.className = "emoji-tag";
      e.textContent = opts.emoji;
      div.appendChild(e);
    }
    this.el.actors.appendChild(div);
    if (who === "zenon" && state.flags.wearingHalo) this.wearHalo(div);
    return div;
  },

  wearHalo(zen) {
    const el = zen || this.el.actors.querySelector(".chibi.zenon");
    if (!el || el.querySelector(".halo-wear")) return;
    document.querySelector(".prop.halo")?.remove();
    const img = document.createElement("img");
    img.className = "halo-wear";
    img.src = "assets/props/halo-wear.png?v=1";
    img.alt = "";
    el.insertBefore(img, el.firstChild);
    el.classList.add("halo-on");
  },

  updateFaces() {
    const s = this.el.actors.querySelector('.chibi.sacha .face');
    const z = this.el.actors.querySelector('.chibi.zenon .face');
    if (s) s.src = sachaFace();
    if (z) z.src = zenonFace();
    const tag = this.el.actors.querySelector(".chibi.sacha .emoji-tag");
    if (tag) tag.textContent = moodEmoji();
    const zen = this.el.actors.querySelector(".chibi.zenon");
    if (zen) {
      zen.classList.toggle("bounce", state.mood === "happy");
      zen.classList.toggle("timeout", state.mood === "mad");
    }
  },

  addProp(className, src, onClick) {
    const img = document.createElement("img");
    img.className = `prop ${className}`;
    img.src = src;
    img.alt = className;
    if (onClick) img.addEventListener("click", (e) => { e.stopPropagation(); onClick(); });
    document.getElementById("stage").appendChild(img);
    return img;
  },

  addCat(onClick) {
    const img = document.createElement("img");
    img.className = "cat-sprite";
    img.src = "assets/props/cat.png?v=10";
    img.alt = "cat";
    if (onClick) img.addEventListener("click", () => onClick());
    document.getElementById("stage").appendChild(img);
    return img;
  },

  popEmoji(emoji, x = 50, y = 40) {
    const el = this.el.emojiPop;
    el.textContent = emoji;
    el.style.left = `${x}%`;
    el.style.top = `${y}%`;
    el.classList.add("show");
    setTimeout(() => el.classList.remove("show"), 500);
  },

  flashFx(kind, text) {
    const fx = this.el.fx;
    fx.className = `fx ${kind}`;
    fx.textContent = text;
    fx.classList.remove("hidden");
    setTimeout(() => fx.classList.add("hidden"), 700);
  },

  hideDialogue() {
    this.el.dialogue.classList.add("hidden");
    this.el.choices.innerHTML = "";
  },

  /**
   * lines: [{speaker, text}]
   * choices?: [{label, value}]
   * returns Promise resolving to choice value or null
   */
  busy: false,
  actionLock: false,

  say(lines, choices = null) {
    return new Promise((resolve) => {
      this.busy = true;
      this.el.dock.style.pointerEvents = "none";
      this.el.dialogue.classList.remove("hidden");
      let i = 0;
      const finish = (value) => {
        this.hideDialogue();
        this.busy = false;
        this.el.dock.style.pointerEvents = "";
        resolve(value);
      };
      const show = () => {
        const line = lines[i];
        this.el.speaker.textContent = line.speaker || "";
        this.el.bubbleText.textContent = line.text;
        this.el.choices.innerHTML = "";
        const last = i >= lines.length - 1;
        if (last && choices && choices.length) {
          this.el.btnNext.classList.add("hidden");
          choices.forEach((c) => {
            const b = document.createElement("button");
            b.type = "button";
            b.textContent = c.label;
            if (c.primary) b.classList.add("primary");
            b.addEventListener("click", () => {
              sfx.click();
              finish(c.value);
            });
            this.el.choices.appendChild(b);
          });
        } else {
          this.el.btnNext.classList.remove("hidden");
          this.el.btnNext.onclick = () => {
            sfx.click();
            if (i < lines.length - 1) {
              i += 1;
              show();
            } else {
              finish(null);
            }
          };
        }
      };
      show();
    });
  },

  openModal({ title, bodyHtml, actions }) {
    return new Promise((resolve) => {
      this.el.modalTitle.textContent = title;
      this.el.modalBody.innerHTML = bodyHtml || "";
      this.el.modalActions.innerHTML = "";
      this.el.modal.classList.remove("hidden");
      (actions || []).forEach((a) => {
        const b = document.createElement("button");
        b.type = "button";
        b.textContent = a.label;
        if (a.primary) b.classList.add("primary");
        if (a.className) b.className += ` ${a.className}`;
        b.disabled = !!a.disabled;
        b.addEventListener("click", () => {
          sfx.click();
          this.el.modal.classList.add("hidden");
          resolve(a.value);
        });
        this.el.modalActions.appendChild(b);
      });
    });
  },

  closeModal() {
    this.el.modal.classList.add("hidden");
  },

  askName() {
    return new Promise((resolve) => {
      this.el.nameGate.classList.remove("hidden");
      if (state.nickname) this.el.nickInput.value = state.nickname;
      const go = () => {
        sfx.reveal();
        this.el.nameGate.classList.add("hidden");
        resolve(this.el.nickInput.value);
      };
      $("btn-save-name").onclick = go;
      this.el.nickInput.onkeydown = (e) => {
        if (e.key === "Enter") go();
      };
    });
  },

  checkFinalePrompt() {
    if (!canFinale()) return false;
    return true;
  },
};
