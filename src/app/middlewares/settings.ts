import { type Middleware, isAction } from "@reduxjs/toolkit"

import { setPlaySpeed, setThreePanelLayout, setTwoPanelLayout } from "../slices"
import type { RootState } from "../store"
import { setSettingsCookie } from "../utils"

// List of actions that will trigger saving the updated state of
// settings to a cookie when middleware is executed
const SETTINGS_WRITE_ACTIONS = [
  setThreePanelLayout,
  setTwoPanelLayout,
  setPlaySpeed,
]

// Middleware to save settings to cookies whenever user makes changes
export const settingsMiddleware: Middleware<any, RootState> =
  store => next => action => {
    const result = next(action)
    if (isAction(action) && SETTINGS_WRITE_ACTIONS.some(a => a.match(action))) {
      setSettingsCookie(store.getState().settings)
    }
    return result
  }
