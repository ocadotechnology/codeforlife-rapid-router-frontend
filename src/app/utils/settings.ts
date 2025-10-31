import Cookies from "js-cookie"
import { SERVICE_NAME } from "codeforlife/settings"

import { type SettingsState } from "../slices"

export function getSettingsCookie() {
  const settingsCookie = Cookies.get(SERVICE_NAME)
  if (settingsCookie === undefined) return settingsCookie

  try {
    return JSON.parse(settingsCookie) as SettingsState
  } catch (e: any) {
    console.error(`Error occurred while parsing settings from cookies: ${e}`)
  }
}

export function setSettingsCookie(settings: SettingsState) {
  Cookies.set(SERVICE_NAME, JSON.stringify(settings))
}
