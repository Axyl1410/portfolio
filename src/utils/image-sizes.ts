/**
 * `sizes` hints for `next/image` with `fill`.
 * @see https://nextjs.org/docs/app/api-reference/components/image#sizes
 */

/** Home intro hero stack (see `loader.css` + `responsive.css`). */
export const LOADER_IMAGE_SIZES =
  "(max-width: 540px) 50vw, (max-width: 860px) 42vw, min(35vw, 31.25rem)";

/** Home “Latest project” card thumb (`w-[12em]`); hidden below 860px layout but hint stays conservative. */
export const PROJECT_CARD_IMAGE_SIZES =
  "(max-width: 860px) 85vw, min(40vw, 14rem)";
