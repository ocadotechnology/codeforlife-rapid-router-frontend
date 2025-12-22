import type { Action, ThunkAction } from "@reduxjs/toolkit"
import { combineSlices } from "@reduxjs/toolkit"
import { logoutMiddleware } from "codeforlife/middlewares"
import { makeStore } from "codeforlife/utils/store"
import { sessionSlice } from "codeforlife/slices"

import { gameSlice, levelSlice, settingsSlice } from "./slices"
import api from "../api"
import { settingsMiddleware } from "./middlewares"

// `combineSlices` automatically combines the reducers using
// their `reducerPath`s, therefore we no longer need to call `combineReducers`.
const reducer = combineSlices(
  api,
  levelSlice,
  gameSlice,
  settingsSlice,
  sessionSlice,
)

// Infer the `RootState` type from the root reducer
export type RootState = ReturnType<typeof reducer>

// TODO: create middleware for api errors.
// https://redux-toolkit.js.org/rtk-query/usage/error-handling#handling-errors-at-a-macro-level
const store = makeStore({
  reducer,
  middlewares: [api.middleware, logoutMiddleware, settingsMiddleware],
})

export default store
export type AppStore = typeof store
export type AppDispatch = AppStore["dispatch"]
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>
