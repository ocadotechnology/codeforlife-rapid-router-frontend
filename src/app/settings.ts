import { getSetting, setup } from "codeforlife/utils/settings"

// Set up the settings using environment variables and get the common settings.
export const {
  SERVICE_NAME,
  SERVICE_TITLE,
  SERVICE_API_URL,
  SESSION_COOKIE_NAME,
  SESSION_METADATA_COOKIE_NAME,
} = setup(import.meta.env)

// Example of how to get a custom setting.
export const EXAMPLE = getSetting("EXAMPLE", { defaultValue: "DEFAULT_VALUE" })
