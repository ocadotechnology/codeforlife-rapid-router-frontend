import { type Middleware, isAction } from "@reduxjs/toolkit"

import { setThreePanelLayout, setTwoPanelLayout } from "../slices"
import type { RootState } from "../store"
import { saveSettingsToCookie } from "../util"

// List of actions that will trigger saving the updated state of
// settings to a cookie when middleware is executed
const SETTINGS_WRITE_ACTIONS = [setThreePanelLayout, setTwoPanelLayout]

// Middleware to save settings to cookies whenever user makes changes
export const settingsCookiePersistenceMiddleware: Middleware =
  store => next => action => {
    const result = next(action)
    if (isAction(action) && SETTINGS_WRITE_ACTIONS.some(a => a.match(action))) {
      saveSettingsToCookie((store.getState() as RootState).settings)
    }
    return result
  }
