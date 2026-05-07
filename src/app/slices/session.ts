import { createSessionSlice } from "codeforlife/slices"

import { SESSION_METADATA_COOKIE_NAME } from "../settings"

export const sessionSlice = createSessionSlice(SESSION_METADATA_COOKIE_NAME)

export const { login, logout } = sessionSlice.actions
export const { selectIsLoggedIn } = sessionSlice.selectors
