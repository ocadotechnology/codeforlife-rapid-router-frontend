import * as yup from "yup"
import { Box, type Breakpoint } from "@mui/material"
import { type FC, useCallback } from "react"
import { useParamsRequired } from "codeforlife/hooks"

import {
  type PanelLayout,
  THREE_PANEL_LAYOUTS,
  TWO_PANEL_LAYOUTS,
  type ThreePanelLayout,
  type TwoPanelLayout,
  setThreePanelLayout,
  setTwoPanelLayout,
} from "../../app/slices"
import {
  type ScreenOrientation,
  useAppDispatch,
  useBreakpoint,
  useLevelPanelCount,
  useScreenOrientation,
  useSettings,
} from "../../app/hooks"
import Controls from "./Controls"
import Panels from "./Panels"
import { paths } from "../../routes"
import { useBlocklyContext } from "./context/BlocklyContext"

export interface LevelProps {}

const Level: FC<LevelProps> = () => {
  const dispatch = useAppDispatch()
  const settings = useSettings()
  const blocklyContext = useBlocklyContext()
  const resizeBlockly = useCallback(() => {
    const { workspaceRef } = blocklyContext
    if (workspaceRef.current) workspaceRef.current.resize()
  }, [blocklyContext])

  const levelPanelCount = useLevelPanelCount()

  const twoPanels = levelPanelCount === 2,
    threePanels = !twoPanels

  return useParamsRequired({
    shape: { id: yup.number().required().min(1) },
    children: () => (
      <Box sx={{ display: "flex" }}>
        {twoPanels && (
          <Controls
            layout={settings.twoPanelLayout}
            layoutOptions={TWO_PANEL_LAYOUTS}
            onLayoutChange={l => {
              dispatch(setTwoPanelLayout(l as TwoPanelLayout))
            }}
          />
        )}
        {threePanels && (
          <Controls
            layout={settings.threePanelLayout}
            layoutOptions={THREE_PANEL_LAYOUTS}
            onLayoutChange={l => {
              dispatch(setThreePanelLayout(l as ThreePanelLayout))
            }}
          />
        )}
        {/* TODO: fix style*/}
        <Box component="main" sx={{ height: "100vh" }}>
          <Panels onResize={resizeBlockly} />
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
