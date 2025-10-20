import { Route } from "react-router"

import Level from "../pages/level/Level"
import paths from "./paths"

const level = (
  <>
    <Route path={paths.level._} element={<Level />} />
  </>
)

export default level
