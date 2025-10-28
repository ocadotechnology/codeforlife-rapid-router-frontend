import * as yup from "yup"
import { Box, Typography } from "@mui/material"
import { type FC, useEffect, useState } from "react"
import Cookies from "js-cookie"
import { useParamsRequired } from "codeforlife/hooks"

import Controls from "./Controls"
import { paths } from "../../routes"

export interface LevelProps {}

const COOKIE_NAME = "Rapid Router"

const TwoPanelsLayoutOptions = {
  Auto: "2.Auto",
  VerticalSplit: "2.VerticalSplit",
  HorizontalSplit: "2.HorizontalSplit",
} as const

// Value temporarily unused
// eslint-disable-next-line
const ThreePanelsLayoutOptions = {
  Auto: "3.Auto",
  VerticalSplitWithLeftHorizontal: "3.VerticalSplitWithLeftHorizontal",
  VerticalSplit: "3.VerticalSplit",
  HorizontalSplit: "3.HorizontalSplit",
} as const

type LayoutOption =
  | (typeof ThreePanelsLayoutOptions)[keyof typeof ThreePanelsLayoutOptions]
  | (typeof TwoPanelsLayoutOptions)[keyof typeof TwoPanelsLayoutOptions]

interface LevelState {
  panels: 2 | 3
  layoutOption: LayoutOption
}

const Level: FC<LevelProps> = () => {
  const [level] = useState<LevelState>({
    panels: 2,
    layoutOption: TwoPanelsLayoutOptions.Auto,
  })

  useEffect(() => {
    if (!Cookies.get(COOKIE_NAME)) {
      Cookies.set(COOKIE_NAME, JSON.stringify(level))
    }
  }, [level])

  return useParamsRequired({
    shape: { id: yup.number().required().min(1) },
    children: () => (
      <Box sx={{ display: "flex" }}>
        <Controls />
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
