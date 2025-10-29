import Cookies from "js-cookie"
import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice } from "codeforlife/slices"

import packageJson from "../../../package.json"

export type TwoPanelLayout = "auto" | "vertical" | "horizontal"
export type ThreePanelLayout =
  | "auto"
  | "verticalWithLeftHorizontal"
  | "vertical"
  | "horizontalSplit"

export interface SettingsState {
  twoPanelLayout: TwoPanelLayout
  threePanelLayout: ThreePanelLayout
}

const COOKIE_NAME = packageJson.name
const DEFAULT_SETTINGS: SettingsState = Object.freeze({
  twoPanelLayout: "auto",
  threePanelLayout: "auto",
})

// Util functions to get and save slice state from and to cookies
function getSettingFromCookiesOrDefault(): SettingsState {
  const settingsCookie = Cookies.get(COOKIE_NAME)
  if (settingsCookie) {
    // JSON.parse() could throw
    try {
      return JSON.parse(settingsCookie) as SettingsState
    } catch (e: any) {
      console.error(`Error occurred while parsing settings from cookies: ${e}`)
      // Return default settings if failed to parse
      return DEFAULT_SETTINGS
    }
  } else {
    // Return default settings if no cookie present
    return DEFAULT_SETTINGS
  }
}
// Used to sync the state of cookies with the state of the store
function saveSettingsToCookies(settings: SettingsState) {
  Cookies.set(COOKIE_NAME, JSON.stringify(settings))
}

const initialState: SettingsState = getSettingFromCookiesOrDefault()

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: create => ({
    setTwoPanelLayout: create.reducer(
      (state, action: PayloadAction<TwoPanelLayout>) => {
        state.twoPanelLayout = action.payload
        saveSettingsToCookies(state)
      },
    ),
    setThreePanelLayout: create.reducer(
      (state, action: PayloadAction<ThreePanelLayout>) => {
        state.threePanelLayout = action.payload
        saveSettingsToCookies(state)
      },
    ),
  }),
  selectors: {
    selectWhole: settings => settings,
  },
})

export default settingsSlice
export const { setTwoPanelLayout, setThreePanelLayout } = settingsSlice.actions
export const { selectWhole } = settingsSlice.selectors
