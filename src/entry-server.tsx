import server from "codeforlife/server/entry/server"

import App from "./App"
import routes from "./routes"

export const { render } = await server({ App, routes })
