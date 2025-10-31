import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice } from "codeforlife/slices"

import { getSettingCookie } from "../utils"

export type TwoPanelLayout = "auto" | "vertical" | "horizontal"
export type ThreePanelLayout =
  | "auto"
  | "verticalWithLeftHorizontal"
  | "vertical"
  | "horizontal"

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
  initialState: getSettingCookie() ?? DEFAULT_SETTINGS,
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
