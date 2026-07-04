export type ThemeMode = "dark" | "light" | "system";

export type ThemeTransitionOrigin = "bottom-right" | "top-right";

const STYLE_ID = "theme-transition-styles";
const THEME_TRANSITION_ATTR = "data-theme-transition";

type DocumentWithViewTransition = Document & {
  startViewTransition?: (callback: () => void | Promise<void>) => {
    finished: Promise<void>;
  };
};

function resolveTheme(theme: ThemeMode): "dark" | "light" {
  if (theme === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  return theme;
}

function applyThemeToDocument(theme: "dark" | "light"): void {
  const root = document.documentElement;

  root.classList.remove("light", "dark");
  root.classList.add(theme);
  root.style.colorScheme = theme;
}

function createTransitionStyles(origin: ThemeTransitionOrigin): string {
  const isBottomRight = origin === "bottom-right";
  const maskPosition = isBottomRight ? "bottom right" : "top right";
  const transformOrigin = maskPosition;
  const circleCy = isBottomRight ? "40" : "0";
  const svgMask = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><defs><filter id="blur"><feGaussianBlur stdDeviation="2"/></filter></defs><circle cx="40" cy="${circleCy}" r="18" fill="white" filter="url(%23blur)"/></svg>`;

  // Match www set-theme-with-transition — unscoped pseudo selectors only.
  // View-transition pseudos are not descendants of html, so do not scope under html[...].
  return `
  ::view-transition-group(root) {
    animation-duration: 1.5s;
    animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
  }

  ::view-transition-image-pair(root) {
    animation: none !important;
  }

  ::view-transition-new(root) {
    mask: url('${svgMask}') ${maskPosition} / 0 no-repeat;
    -webkit-mask: url('${svgMask}') ${maskPosition} / 0 no-repeat;
    mask-origin: content-box;
    -webkit-mask-origin: content-box;
    animation: theme-reveal-scale 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    transform-origin: ${transformOrigin};
  }

  ::view-transition-old(root) {
    animation: none;
    z-index: -1;
  }

  @keyframes theme-reveal-scale {
    from {
      mask-size: 0;
    }
    to {
      mask-size: 350vmax;
    }
  }
`;
}

function injectTransitionStyles(origin: ThemeTransitionOrigin): void {
  removeTransitionStyles();

  const styleElement = document.createElement("style");
  styleElement.id = STYLE_ID;
  styleElement.textContent = createTransitionStyles(origin);
  document.head.appendChild(styleElement);
}

function removeTransitionStyles(): void {
  document.getElementById(STYLE_ID)?.remove();
}

function clearThemeTransitionFlag(): void {
  document.documentElement.removeAttribute(THEME_TRANSITION_ATTR);
}

function cleanupThemeTransition(): void {
  removeTransitionStyles();
  clearThemeTransitionFlag();
}

export function setThemeWithTransition(
  setTheme: (theme: ThemeMode) => void,
  theme: ThemeMode,
  origin: ThemeTransitionOrigin = "bottom-right"
): void {
  if (typeof window === "undefined") {
    setTheme(theme);
    return;
  }

  const doc = document as DocumentWithViewTransition;
  const resolvedTheme = resolveTheme(theme);

  if (!doc.startViewTransition) {
    applyThemeToDocument(resolvedTheme);
    setTheme(theme);
    return;
  }

  injectTransitionStyles(origin);
  document.documentElement.setAttribute(THEME_TRANSITION_ATTR, "");

  const transition = doc.startViewTransition(() => {
    applyThemeToDocument(resolvedTheme);
    setTheme(theme);
  });

  transition.finished
    .then(cleanupThemeTransition)
    .catch(cleanupThemeTransition);
}
