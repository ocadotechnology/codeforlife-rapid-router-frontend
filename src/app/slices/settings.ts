import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice } from "codeforlife/slices"

import { getSettingsCookie } from "../utils"

export const TWO_PANEL_LAYOUTS = ["vertical", "horizontal"] as const
export const THREE_PANEL_LAYOUTS = [
  "verticalWithLeftHorizontal",
  "vertical",
  "horizontal",
] as const
export type TwoPanelLayout = (typeof TWO_PANEL_LAYOUTS)[number]
export type ThreePanelLayout = (typeof THREE_PANEL_LAYOUTS)[number]
export type PanelLayout = TwoPanelLayout | ThreePanelLayout

export const PLAY_SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2] as const
export type PlaySpeed = (typeof PLAY_SPEEDS)[number]

export interface SettingsState {
  twoPanelLayout?: TwoPanelLayout
  threePanelLayout?: ThreePanelLayout
  playSpeed: PlaySpeed
}

const DEFAULT_SETTINGS: SettingsState = Object.freeze({
  twoPanelLayout: undefined,
  threePanelLayout: undefined,
  playSpeed: 1,
})

export const settingsSlice = createSlice({
  name: "settings",
  initialState: getSettingsCookie() ?? DEFAULT_SETTINGS,
  reducers: create => ({
    setTwoPanelLayout: create.reducer(
      (state, action: PayloadAction<TwoPanelLayout>) => {
        state.twoPanelLayout = action.payload
      },
    ),
    setThreePanelLayout: create.reducer(
      (state, action: PayloadAction<ThreePanelLayout>) => {
        state.threePanelLayout = action.payload
      },
    ),
    setPlaySpeed: create.reducer((state, action: PayloadAction<PlaySpeed>) => {
      state.playSpeed = action.payload
    }),
  }),
  selectors: { selectSettings: settings => settings },
})

export const { setTwoPanelLayout, setThreePanelLayout, setPlaySpeed } =
  settingsSlice.actions
export const { selectSettings } = settingsSlice.selectors
