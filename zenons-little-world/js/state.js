const STORAGE_KEY = "zenon_little_world_nick";

export const Mood = {
  HAPPY: "happy",
  ANNOYED: "annoyed",
  FREAKY: "freaky",
};

function readStoredNick() {
  try {
    if (typeof localStorage === "undefined") return "";
    return localStorage.getItem(STORAGE_KEY) || "";
  } catch {
    return "";
  }
}

export const state = {
  nickname: readStoredNick(),
  battery: 0,
  mood: Mood.HAPPY,
  scene: "boot",
  challenges: {
    coffee: false,
    service: false,
    worship: false,
  },
  serviceSteps: {
    cat: false,
    capp: false,
    pearl: false,
  },
  flags: {
    fedCat: false,
    shrineKissed: false,
    introDone: false,
  },
};

export function saveNickname(name) {
  const clean = (name || "").trim().slice(0, 24) || "Zenon";
  state.nickname = clean;
  localStorage.setItem(STORAGE_KEY, clean);
  return clean;
}

export function getNickname() {
  return state.nickname || "Zenon";
}

export function addBattery(n) {
  state.battery = Math.min(100, Math.max(0, state.battery + n));
  return state.battery;
}

export function setMood(mood) {
  state.mood = mood;
  return state.mood;
}

export function canFinale() {
  return state.battery >= 100 && state.mood !== Mood.ANNOYED;
}

export function resetRun() {
  const nick = state.nickname;
  state.battery = 0;
  state.mood = Mood.HAPPY;
  state.challenges = { coffee: false, service: false, worship: false };
  state.serviceSteps = { cat: false, capp: false, pearl: false };
  state.flags = { fedCat: false, shrineKissed: false, introDone: true };
  state.nickname = nick;
  state.scene = "hub";
}

export function moodEmoji(mood = state.mood) {
  if (mood === Mood.ANNOYED) return "💢";
  if (mood === Mood.FREAKY) return "🔥";
  return "❤️";
}

export function sachaFace() {
  if (state.mood === Mood.ANNOYED) return "assets/faces/sacha/mean-circle.png";
  if (state.mood === Mood.FREAKY) return "assets/faces/sacha/pretty-circle.png";
  // HAPPY — big smile insert
  return "assets/faces/sacha/happy-circle.png";
}

export function zenonFace(override) {
  if (override) return `assets/faces/zenon/${override}.png`;
  if (state.mood === Mood.ANNOYED) return "assets/faces/zenon/ow.png";
  if (state.mood === Mood.FREAKY) return "assets/faces/zenon/flustered.png";
  if (state.battery >= 60) return "assets/faces/zenon/happy.png";
  return "assets/faces/zenon/neutral.png";
}
