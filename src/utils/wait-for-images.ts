interface WaitForImagesOptions {
  /** Max wait in ms before resolving anyway (avoids hanging forever). */
  timeout?: number;
  /** Wait until at least this many <img> nodes exist (e.g. Next.js Image hydration). */
  minCount?: number;
}

function waitForSingleImage(img: HTMLImageElement): Promise<void> {
  if (img.complete && img.naturalHeight > 0) {
    return img.decode?.().catch(() => undefined) ?? Promise.resolve();
  }

  return new Promise((resolve) => {
    const done = () => {
      img.removeEventListener("load", done);
      img.removeEventListener("error", done);
      resolve();
    };
    img.addEventListener("load", done);
    img.addEventListener("error", done);
  });
}

/**
 * Resolves when all images inside `root` have loaded (or failed).
 * Uses decode() when available so pixels are ready before paint/animation.
 */
async function collectImages(
  root: HTMLElement,
  minCount: number
): Promise<HTMLImageElement[]> {
  const deadline = Date.now() + 2000;

  while (Date.now() < deadline) {
    const images = [...root.querySelectorAll("img")];
    const hasEnough =
      minCount > 0 ? images.length >= minCount : images.length > 0;
    if (hasEnough) {
      return images;
    }
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => resolve());
    });
  }

  return [...root.querySelectorAll("img")];
}

export async function waitForImages(
  root: HTMLElement,
  options: WaitForImagesOptions = {}
): Promise<void> {
  const { timeout = 10_000, minCount = 0 } = options;
  const images = await collectImages(root, minCount);

  if (images.length === 0) {
    return;
  }

  const loadAll = Promise.all(images.map(waitForSingleImage)).then(
    () => undefined
  );

  if (timeout <= 0) {
    return loadAll;
  }

  const timeoutPromise = new Promise<void>((resolve) => {
    setTimeout(resolve, timeout);
  });

  return Promise.race([loadAll, timeoutPromise]);
}
