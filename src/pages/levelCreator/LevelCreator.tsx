import { Box } from "@mui/material"
import { type FC } from "react"

import Controls from "./Controls"
import { PhaserGame } from "../../phaser"

export interface LevelCreatorProps {}

const LevelCreator: FC<LevelCreatorProps> = () => (
  <Box sx={{ display: "flex" }}>
    <Controls />
    <Box component="main" sx={{ flex: 1, minWidth: 0, height: "100vh" }}>
      <PhaserGame mode="create" />
    </Box>
  </Box>
)

export default LevelCreator
