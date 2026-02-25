import { prefersReducedMotion } from "./motion";

/**
 * Page transition animation using View Transitions API
 * Handles the animation for page transitions in the application
 */
export const pageAnimation = () => {
  if (prefersReducedMotion()) {
    return;
  }

  document.documentElement.animate(
    [
      {
        opacity: 1,
        scale: 1,
        transform: "translateY(0)",
      },
      {
        opacity: 0.5,
        scale: 0.9,
        transform: "translateY(-100px)",
      },
    ],
    {
      duration: 1000,
      easing: "cubic-bezier(0.76, 0, 0.24, 1)",
      fill: "forwards",
      pseudoElement: "::view-transition-old(root)",
    }
  );

  document.documentElement.animate(
    [
      {
        transform: "translateY(100%)",
      },
      {
        transform: "translateY(0)",
      },
    ],
    {
      duration: 1000,
      easing: "cubic-bezier(0.76, 0, 0.24, 1)",
      fill: "forwards",
      pseudoElement: "::view-transition-new(root)",
    }
  );
};

export const pageAnimationFromMenu = () => {
  if (prefersReducedMotion()) {
    return;
  }

  document.documentElement.animate([{ opacity: 0 }, { opacity: 1 }], {
    duration: 300,
    easing: "ease-out",
    fill: "forwards",
    pseudoElement: "::view-transition-new(root)",
  });
};
