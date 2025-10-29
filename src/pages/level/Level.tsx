import * as yup from "yup"
import { Box, Typography } from "@mui/material"
import { type FC, useState } from "react"
import { useParamsRequired } from "codeforlife/hooks"

import Controls from "./Controls"
import { paths } from "../../routes"
import { useSettings } from "../../app/hooks"

export interface LevelProps {}

interface LevelState {
  panels: 2 | 3
}

const Level: FC<LevelProps> = () => {
  const [level] = useState<LevelState>({
    panels: 2,
  })

  const settings = useSettings()

  return useParamsRequired({
    shape: { id: yup.number().required().min(1) },
    children: () => (
      <Box sx={{ display: "flex" }}>
        <Controls />
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Typography>Settings: {JSON.stringify(settings)}</Typography>
          <Typography>Level state: {JSON.stringify(level)}</Typography>
        </Box>
      </Box>
    ),
    onValidationSuccess: params => {
      console.log(`Level ID from URL: ${params.id}`)
      // TODO: call API
    },
    onValidationError: navigate => {
      // Redirect to home with error message
      navigate(paths._, {
        state: {
          notifications: [
            { props: { error: true, children: "Invalid level ID" } },
          ],
        },
      })
    },
  })
}

export default Level
