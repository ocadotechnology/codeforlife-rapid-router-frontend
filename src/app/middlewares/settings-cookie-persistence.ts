import { type Middleware, isAction } from "@reduxjs/toolkit"
import Cookies from "js-cookie"

import {
  type SettingsState,
  setThreePanelLayout,
  setTwoPanelLayout,
} from "../slices"
import type { RootState } from "../store"
import packageJson from "../../../package.json"

const COOKIE_NAME = packageJson.name
const DEFAULT_SETTINGS: SettingsState = Object.freeze({
  twoPanelLayout: "auto",
  threePanelLayout: "auto",
})
// List of actions that will trigger saving the updated state of
// settings to a cookie when middleware is executed
const SETTINGS_WRITE_ACTIONS = [setThreePanelLayout, setTwoPanelLayout]

function saveSettingsToCookie(settings: SettingsState) {
  Cookies.set(COOKIE_NAME, JSON.stringify(settings))
}

export function getSettingFromCookiesOrDefault(): SettingsState {
  const settingsCookie = Cookies.get(COOKIE_NAME)
  if (settingsCookie) {
    try {
      return JSON.parse(settingsCookie) as SettingsState
    } catch (e: any) {
      console.error(`Error occurred while parsing settings from cookies: ${e}`)
    }
  }
  return DEFAULT_SETTINGS
}

export const settingsCookiePersistenceMiddleware: Middleware =
  store => next => action => {
    const result = next(action)
    if (isAction(action) && SETTINGS_WRITE_ACTIONS.some(a => a.match(action))) {
      saveSettingsToCookie((store.getState() as RootState).settings)
    }
    return result
  }
