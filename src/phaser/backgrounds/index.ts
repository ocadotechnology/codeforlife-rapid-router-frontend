export const Backgrounds = {
  GRASS: "grass",
  SNOW: "snow",
  PAVEMENT: "pavement",
} as const
export type Background = (typeof Backgrounds)[keyof typeof Backgrounds]

export function getSvgUrl(background: Background) {
  return new URL(`./${background}.svg`, import.meta.url).href
}
