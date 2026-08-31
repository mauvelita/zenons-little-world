const STORAGE_KEY = "zenon_little_world_nick";

const Mood = {
  HAPPY: "happy",
  MAD: "mad",
  OK: "ok",
};

const FACES = {
  sacha: {
    happy: "assets/faces/sacha/happysacha.jpeg",
    mad: "assets/faces/sacha/madsacha.jpeg",
    ok: "assets/faces/sacha/oksacha.jpeg",
  },
  zenon: {
    happy: "assets/faces/zenon/happyzenon.jpeg",
    mad: "assets/faces/zenon/sadzenon.jpeg",
    ok: "assets/faces/zenon/okzenon.jpeg",
  },
};

function readStoredNick() {
  try {
    if (typeof localStorage === "undefined") return "";
    return localStorage.getItem(STORAGE_KEY) || "";
  } catch {
    return "";
  }
}

const state = {
  nickname: readStoredNick(),
  battery: 0,
  mood: Mood.OK,
  scene: "boot",
  challenges: {
    coffee: false,
    service: false,
    worship: false,
  },
  serviceSteps: {
    cat: false,
    coffee: false,
    pearl: false,
  },
  flags: {
    fedCat: false,
    shrineKissed: false,
    introDone: false,
  },
};

function saveNickname(name) {
  const clean = (name || "").trim().slice(0, 24) || "Zenon";
  state.nickname = clean;
  localStorage.setItem(STORAGE_KEY, clean);
  return clean;
}

function getNickname() {
  return state.nickname || "Zenon";
}

function addBattery(n) {
  state.battery = Math.min(100, Math.max(0, state.battery + n));
  return state.battery;
}

function setMood(mood) {
  state.mood = mood;
  return state.mood;
}

function canFinale() {
  return state.battery >= 100 && state.mood !== Mood.MAD;
}

function resetRun() {
  const nick = state.nickname;
  state.battery = 0;
  state.mood = Mood.OK;
  state.challenges = { coffee: false, service: false, worship: false };
  state.serviceSteps = { cat: false, coffee: false, pearl: false };
  state.flags = { fedCat: false, shrineKissed: false, introDone: true };
  state.nickname = nick;
  state.scene = "hub";
}

function moodEmoji(mood = state.mood) {
  if (mood === Mood.MAD) return "💢";
  if (mood === Mood.HAPPY) return "❤️";
  return "♡";
}

function sachaFace() {
  return FACES.sacha[state.mood] || FACES.sacha.ok;
}

function zenonFace() {
  return FACES.zenon[state.mood] || FACES.zenon.ok;
}
