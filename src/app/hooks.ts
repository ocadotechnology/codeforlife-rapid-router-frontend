// This file serves as a central hub for re-exporting pre-typed Redux hooks.
// These imports are restricted elsewhere to ensure consistent
// usage of typed hooks throughout the application.
// We disable the ESLint rule here because this is the designated place
// for importing and re-exporting the typed versions of hooks.
/* eslint-disable @typescript-eslint/no-restricted-imports */
import { type Breakpoint, useMediaQuery, useTheme } from "@mui/material"
import { useDispatch, useSelector } from "react-redux"

import type { AppDispatch, RootState } from "./store"
import { selectSettings } from "./slices"

export type ScreenOrientation = "portrait" | "landscape"

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()

export function useSettings() {
  return useSelector(selectSettings)
}

export function useScreenOrientation() {
  if (typeof window !== "undefined")
    return window.screen.orientation.type.split("-")[0] as ScreenOrientation
  else return "landscape"
}

export function useBreakpoint() {
  let result
  const theme = useTheme()
  for (const key of theme.breakpoints.keys) {
    // eslint-disable-next-line
    const matches = useMediaQuery(theme.breakpoints.only(key))
    if (matches) result = key
  }
  return result as Breakpoint
}
