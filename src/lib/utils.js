import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/* Join class names, letting a later Tailwind class win over an earlier one
   that sets the same property. The shadcn helper; components in
   src/components/ui import it as "@/lib/utils". */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
