import { randomInt } from "node:crypto"

export function slugify(text, max = 48) {
  return String(text || "")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, max)
    .replace(/-+$/g, "")
}

// Unambiguous lowercase letters and digits: no 0/o, 1/l/i.
const ALPHABET = "abcdefghjkmnpqrstuvwxyz23456789"
export function randomSuffix(len = 6) {
  let out = ""
  for (let i = 0; i < len; i++) out += ALPHABET[randomInt(ALPHABET.length)]
  return out
}

export function gallerySlug(title) {
  return `${slugify(title) || "gallery"}-${randomSuffix(6)}`
}
