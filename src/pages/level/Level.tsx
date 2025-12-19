import * as yup from "yup"
import { type FC, useRef } from "react"
import { Box } from "@mui/material"
import { useParamsRequired } from "codeforlife/hooks"

import LevelContext, { type BlocklyWorkspace } from "./LevelContext"
import {
  THREE_PANEL_LAYOUTS,
  TWO_PANEL_LAYOUTS,
  type ThreePanelLayout,
  type TwoPanelLayout,
  setThreePanelLayout,
  setTwoPanelLayout,
} from "../../app/slices"
import {
  useAppDispatch,
  useLevelPanelCount,
  useSettings,
} from "../../app/hooks"
import Controls from "./Controls"
import Panels from "./Panels"
import { paths } from "../../routes"

export interface LevelProps {}

const Level: FC<LevelProps> = () => {
  const dispatch = useAppDispatch()
  const settings = useSettings()
  const levelPanelCount = useLevelPanelCount()
  const blocklyWorkspaceRef = useRef<BlocklyWorkspace | null>(null)

  return useParamsRequired({
    shape: { id: yup.number().required().min(1) },
    children: () => (
      <LevelContext.Provider value={{ blocklyWorkspaceRef }}>
        <Box sx={{ display: "flex" }}>
          {levelPanelCount === 2 && (
            <Controls
              layout={settings.twoPanelLayout}
              layoutOptions={TWO_PANEL_LAYOUTS}
              onLayoutChange={l => {
                dispatch(setTwoPanelLayout(l as TwoPanelLayout))
              }}
            />
          )}
          {levelPanelCount === 3 && (
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
            <Panels />
          </Box>
        </Box>
      </LevelContext.Provider>
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
