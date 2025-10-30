import Cookies from "js-cookie"

import { type SettingsState } from "../slices"
import packageJson from "../../../package.json"

const COOKIE_NAME = packageJson.name

export function getSettingFromCookies(): SettingsState | null {
  const settingsCookie = Cookies.get(COOKIE_NAME)
  if (settingsCookie) {
    try {
      return JSON.parse(settingsCookie) as SettingsState
    } catch (e: any) {
      console.error(`Error occurred while parsing settings from cookies: ${e}`)
    }
  }
  return null
}

export function saveSettingsToCookie(settings: SettingsState) {
  Cookies.set(COOKIE_NAME, JSON.stringify(settings))
}
