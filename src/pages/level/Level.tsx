import * as yup from "yup"

import { Box, Typography } from "@mui/material"
import { type FC, useState } from "react"
import { useParamsRequired } from "codeforlife/hooks"

import LevelMiniDrawer from "./MiniDrawer"
import { paths } from "../../routes"

export interface LevelProps {}

interface LevelState {
  panels: 2 | 3
}

const Level: FC<LevelProps> = () => {
  const [level] = useState<LevelState>({ panels: 2 })

  return useParamsRequired({
    shape: { id: yup.number().required().min(1) },
    children: () => (
      <Box sx={{ display: "flex" }}>
        <LevelMiniDrawer />
        <Box component="main" sx={{ flexGrow: 1 }}>
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
