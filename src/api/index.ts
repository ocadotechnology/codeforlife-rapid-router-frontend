import { createApi } from "codeforlife/api"

import { SERVICE_API_URL } from "../app/settings"
import { logout } from "../app/slices"

const api = createApi({
  serviceApiUrl: SERVICE_API_URL,
  logoutAction: logout,
  tagTypes: ["Level"],
})

export default api
export const { useLogoutMutation } = api
