import VARIANTS from "../image-variants.json"

/* Props for an <img> that should not hand a phone a desktop-sized file.
 *
 * Only the images fetched before first paint carry variants; see
 * scripts/make-image-variants.mjs for why. Anything else falls through to a
 * plain src, so this is safe to spread onto any image.
 *
 * It also returns the intrinsic width and height, which lets the browser
 * reserve the right box before the file arrives.
 *
 *   <img {...responsive(src, "(min-width: 768px) 50vw, 100vw")} alt="" />
 */
export function responsive(src, sizes = "100vw") {
  const v = VARIANTS[src]
  if (!v) return { src }
  const srcSet = [...v.set.map(([u, w]) => `${u} ${w}w`), `${src} ${v.w}w`].join(", ")
  return { src, srcSet, sizes, width: v.w, height: v.h }
}
