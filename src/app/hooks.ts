// This file serves as a central hub for re-exporting pre-typed Redux hooks.
// These imports are restricted elsewhere to ensure consistent
// usage of typed hooks throughout the application.
// We disable the ESLint rule here because this is the designated place
// for importing and re-exporting the typed versions of hooks.
/* eslint-disable @typescript-eslint/no-restricted-imports */
import { useDispatch, useSelector } from "react-redux"
import Cookies from "js-cookie"

import type { AppDispatch, RootState } from "./store"
import packageJson from "../../package.json"

export type TwoPanelLayout = "auto" | "vertical" | "horizontal"
export type ThreePanelLayout =
  | "auto"
  | "verticalWithLeftHorizontal"
  | "vertical"
  | "horizontalSplit"

export interface Settings {
  twoPanelLayout: TwoPanelLayout
  threePanelLayout: ThreePanelLayout
}

const COOKIE_NAME = packageJson.name

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()

export const DEFAULT_SETTINGS: Settings = Object.freeze({
  twoPanelLayout: "auto",
  threePanelLayout: "auto",
})

export function useSettings(): Settings {
  const settings = Cookies.get(COOKIE_NAME)
  if (settings) {
    return JSON.parse(settings) as Settings
  } else {
    Cookies.set(COOKIE_NAME, JSON.stringify(DEFAULT_SETTINGS))
    return DEFAULT_SETTINGS
  }
}
