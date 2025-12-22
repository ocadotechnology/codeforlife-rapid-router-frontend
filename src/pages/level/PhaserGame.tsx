import { Box, Typography } from "@mui/material"
import type { FC } from "react"
import { useGameCommands } from "../../app/hooks"

const PhaserGame: FC = () => {
  const gameCommands = useGameCommands()

  return (
    <Box>
      <Typography variant="h3">Mock Phaser Game content</Typography>
      <Typography variant="subtitle2">
        <pre>{JSON.stringify(gameCommands, null, 2)}</pre>
      </Typography>
    </Box>
  )
}

export default PhaserGame
