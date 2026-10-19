import { config } from "../config.js"
import { createR2Storage } from "./r2.js"
import { createLocalStorage } from "./local.js"

export const storage = config.storageDriver === "r2" ? createR2Storage() : createLocalStorage()

// Object key layout. Everything for a gallery lives under one prefix so a
// gallery purge is a prefix delete.
export const keys = {
  original: (galleryId, mediaId, filename) => `g/${galleryId}/o/${mediaId}/${safeName(filename)}`,
  derivative: (galleryId, mediaId, name) => `g/${galleryId}/d/${mediaId}/${name}`,
  logo: (galleryId, ext) => `g/${galleryId}/logo${ext}`,
  zip: (galleryId, albumId, size, version, part) => `g/${galleryId}/z/${albumId || "all"}-${size}-v${version}-${part}.zip`,
  galleryPrefix: (galleryId) => `g/${galleryId}/`,
}

export function safeName(name) {
  return name.replace(/[^\w.\-]+/g, "_").slice(-120) || "file"
}
