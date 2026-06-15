import { Route } from "react-router"

import Level from "../pages/level/Level"
import LevelCreator from "../pages/levelCreator/LevelCreator"
import paths from "./paths"

const level = (
  <>
    <Route path={paths.level.creator._} element={<LevelCreator />} />
    <Route
      path={paths.level.id[1]._}
      element={
        <Level
          id={1}
          mode="blockly"
          blockly_toolbox_block_types={[
            "move_forwards",
            "turn_left",
            "turn_right",
          ]}
        />
      }
    />
    <Route path={paths.level.id._} element={<Level />} />
  </>
)

export default level
