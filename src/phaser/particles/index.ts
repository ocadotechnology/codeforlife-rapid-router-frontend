import { createIdRegistry } from "codeforlife/utils/object"

export const Particles = createIdRegistry({
  fire: "FIRE",
  smoke: "SMOKE",
} as const)
export type Particle = (typeof Particles)[keyof typeof Particles]

export function getSvgUrl(particle: Particle) {
  return new URL(`./${particle}.svg`, import.meta.url).href
}
