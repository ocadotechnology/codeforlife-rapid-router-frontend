import { createIdRegistry } from "codeforlife/utils/object"

export const HudElements = createIdRegistry({
  btn_zoom_in: "BTN_ZOOM_IN",
  btn_zoom_out: "BTN_ZOOM_OUT",
  fuel_gauge_pointer: "FUEL_GAUGE_POINTER",
  fuel_gauge: "FUEL_GAUGE",
  trashcan_lid_closed: "TRASHCAN_LID_CLOSED",
  trashcan_lid_open: "TRASHCAN_LID_OPEN",
  trashcan: "TRASHCAN",
} as const)
export type HudElement = (typeof HudElements)[keyof typeof HudElements]

export function getSvgUrl(HudElement: HudElement) {
  return new URL(`./${HudElement}.svg`, import.meta.url).href
}
