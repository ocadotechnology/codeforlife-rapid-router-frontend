// This file serves as a central hub for re-exporting pre-typed Redux hooks.
// These imports are restricted elsewhere to ensure consistent
// usage of typed hooks throughout the application.
// We disable the ESLint rule here because this is the designated place
// for importing and re-exporting the typed versions of hooks.
/* eslint-disable @typescript-eslint/no-restricted-imports */
import { useDispatch, useSelector } from "react-redux"

import type { AppDispatch, RootState } from "./store"
import { selectPanelCount, selectSettings, selectToolbox } from "./slices"

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()

export const useSettings = () => useSelector(selectSettings)

export const useLevelPanelCount = () => useSelector(selectPanelCount)
export const useLevelToolbox = () => useSelector(selectToolbox)
