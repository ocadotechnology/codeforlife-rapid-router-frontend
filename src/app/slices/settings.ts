import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice } from "codeforlife/slices"

import { getSettingsCookie } from "../utils"

export const TwoPanelLayouts = ["auto", "vertical", "horizontal"] as const
export const ThreePanelLayouts = [
  "auto",
  "verticalWithLeftHorizontal",
  "vertical",
  "horizontal",
] as const
export type TwoPanelLayout = (typeof TwoPanelLayouts)[number]
export type ThreePanelLayout = (typeof ThreePanelLayouts)[number]
export type Layout = TwoPanelLayout | ThreePanelLayout

export interface SettingsState {
  twoPanelLayout: TwoPanelLayout
  threePanelLayout: ThreePanelLayout
}

const DEFAULT_SETTINGS: SettingsState = Object.freeze({
  twoPanelLayout: "auto",
  threePanelLayout: "auto",
})

const settingsSlice = createSlice({
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
  }),
  selectors: {
    selectSettings: settings => settings,
  },
})

export default settingsSlice
export const { setTwoPanelLayout, setThreePanelLayout } = settingsSlice.actions
export const { selectSettings } = settingsSlice.selectors
