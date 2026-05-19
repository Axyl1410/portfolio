export const INTRO_LOADER_SESSION_KEY = "home-loader-played";
export const INTRO_PENDING_CLASS = "intro-pending";
export const INTRO_READY_CLASS = "intro-ready";

export function markIntroPending() {
  document.documentElement.classList.add(INTRO_PENDING_CLASS);
  document.documentElement.classList.remove(INTRO_READY_CLASS);
}

export function markIntroReady() {
  document.documentElement.classList.add(INTRO_READY_CLASS);
}

export function clearIntroPending() {
  document.documentElement.classList.remove(
    INTRO_PENDING_CLASS,
    INTRO_READY_CLASS
  );
}
