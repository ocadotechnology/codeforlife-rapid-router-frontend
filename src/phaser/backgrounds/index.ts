export const Backgrounds = ["grass", "snow", "pavement"] as const
export type Background = (typeof Backgrounds)[number]

export function getSvgUrl(background: Background) {
  return new URL(`./${background}.svg`, import.meta.url).href
}
