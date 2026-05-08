import cookies from "codeforlife/utils/cookies"

import { SERVICE_NAME } from "../settings"
import { type SettingsState } from "../slices/settings"

export function getSettingsCookie() {
  return cookies.get(SERVICE_NAME) as SettingsState | undefined
}

export function setSettingsCookie(settings: SettingsState) {
  cookies.set(SERVICE_NAME, settings)
}
