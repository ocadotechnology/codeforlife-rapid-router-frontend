import { Box, Typography } from "@mui/material"
import type { FC } from "react"
import { usePhaserGameCommandQueue } from "../../app/hooks"

const PhaserGame: FC = () => {
  const commands = usePhaserGameCommandQueue()
  return (
    <Box>
      <Typography variant="h3">Mock Phaser Game content</Typography>
      <Typography variant="subtitle2">
        <pre>{JSON.stringify(commands, null, 2)}</pre>
      </Typography>
    </Box>
  )
}

export default PhaserGame
