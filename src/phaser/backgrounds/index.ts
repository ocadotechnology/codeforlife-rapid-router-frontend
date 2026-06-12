import { createIdRegistry } from "codeforlife/utils/object"

export const Backgrounds = createIdRegistry({
  grass: "GRASS",
  snow: "SNOW",
  pavement: "PAVEMENT",
} as const)
export type Background = (typeof Backgrounds)[keyof typeof Backgrounds]

export function getSvgUrl(background: Background) {
  return new URL(`./${background}.svg`, import.meta.url).href
}
