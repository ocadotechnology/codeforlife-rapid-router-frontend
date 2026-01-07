import { createApi } from "codeforlife/api"

const api = createApi({
  tagTypes: ["Level"],
})

export default api
export const { useLogoutMutation } = api
