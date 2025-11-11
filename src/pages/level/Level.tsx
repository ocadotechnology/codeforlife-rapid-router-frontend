import * as yup from "yup"
import { Box, Typography } from "@mui/material"
import { type FC, useCallback, useRef, useState } from "react"
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels"
import DragIndicatorIcon from "@mui/icons-material/DragIndicator"
import { useParamsRequired } from "codeforlife/hooks"

import BlocklyWorkspace, {
  type BlocklyWorkspaceProps,
  type ToolboxItemInfo,
} from "./BlocklyWorkspace"
import {
  type ThreePanelLayout,
  ThreePanelLayouts,
  type TwoPanelLayout,
  TwoPanelLayouts,
  setThreePanelLayout,
  setTwoPanelLayout,
} from "../../app/slices"
import { useAppDispatch, useSettings } from "../../app/hooks"
import Controls from "./Controls"
import { paths } from "../../routes"

export interface LevelProps {}

type Direction = "horizontal" | "vertical"
interface LevelState {
  panels: 2 | 3
  toolbox_contents: ToolboxItemInfo[]
}

const THREE_PANEL_VERTICAL_WITH_LEFT_HORIZONTAL = ThreePanelLayouts[1]

function calculatePanelsConfig(
  panels: number,
  layout: TwoPanelLayout | ThreePanelLayout,
): {
  innerPGDirection: Direction
  outerPGDirection: Direction
  defaultPanelSizes: number[]
} {
  let defaultPanelSizes: number[],
    innerPGDirection: Direction,
    outerPGDirection: Direction

  if (panels === 2) {
    // Does not affect 2 panel layouts
    outerPGDirection = "horizontal"
    defaultPanelSizes = [100, 50, 50]
    switch (layout) {
      case "horizontal":
        innerPGDirection = "vertical"
        break
      case "auto":
      case "vertical":
      default:
        innerPGDirection = "horizontal"
        break
    }
  } else {
    // 3 panels
    switch (layout) {
      case "verticalWithLeftHorizontal":
        innerPGDirection = "vertical"
        outerPGDirection = "horizontal"
        defaultPanelSizes = [50, 50, 50, 50]
        break
      case "horizontal":
        innerPGDirection = "vertical"
        outerPGDirection = "vertical"
        defaultPanelSizes = [100, 33, 33, 33]
        break
      case "auto":
      case "vertical":
      default:
        innerPGDirection = "horizontal"
        outerPGDirection = "horizontal"
        defaultPanelSizes = [100, 33, 33, 33]
    }
  }
  return {
    innerPGDirection,
    outerPGDirection,
    defaultPanelSizes,
  }
}

const Panel3: FC = () => (
  <>
    <Typography variant="h2">This is Panel #3</Typography>
    <Typography>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
      commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
      velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
      cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
      est laborum.
    </Typography>
  </>
)

const AppResizeHandle: FC = () => (
  /* TODO: fix style */
  <PanelResizeHandle
    style={{
      color: "#000",
      border: "1px solid gray",
      outline: "none",
      flex: "0 0 .5rem",
      justifyContent: "center",
      alignItems: "center",
      display: "flex",
    }}
  >
    <DragIndicatorIcon />
  </PanelResizeHandle>
)

const Level: FC<LevelProps> = () => {
  const [level] = useState<LevelState>({
    panels: 2,
    toolbox_contents: [
      { kind: "block", type: "logic_compare" },
      { kind: "block", type: "logic_compare" },
      { kind: "block", type: "logic_compare" },
    ],
  })
  const dispatch = useAppDispatch()
  const settings = useSettings()
  const blocklyWorkspaceRef: BlocklyWorkspaceProps["ref"] = useRef(null)
  const resizeBlockly = useCallback(() => {
    if (blocklyWorkspaceRef.current) blocklyWorkspaceRef.current.resize()
  }, [blocklyWorkspaceRef])

  const twoPanels = level.panels === 2,
    threePanels = !twoPanels
  const { innerPGDirection, outerPGDirection, defaultPanelSizes } =
    calculatePanelsConfig(
      level.panels,
      threePanels ? settings.threePanelLayout : settings.twoPanelLayout,
    )

  return useParamsRequired({
    shape: { id: yup.number().required().min(1) },
    children: () => (
      <Box sx={{ display: "flex" }}>
        {twoPanels && (
          <Controls
            layout={settings.twoPanelLayout}
            layoutOptions={TwoPanelLayouts}
            onLayoutChange={l => {
              dispatch(setTwoPanelLayout(l as TwoPanelLayout))
            }}
          />
        )}
        {threePanels && (
          <Controls
            layout={settings.threePanelLayout}
            layoutOptions={ThreePanelLayouts}
            onLayoutChange={l => {
              dispatch(setThreePanelLayout(l as ThreePanelLayout))
            }}
          />
        )}
        <Box component="main" sx={{ flexGrow: 1 }}>
          {/* TODO: fix style */}
          <PanelGroup
            direction={outerPGDirection}
            style={{ height: "100vh" }}
            onLayout={resizeBlockly}
          >
            <Panel defaultSize={defaultPanelSizes[0]} minSize={20}>
              <PanelGroup direction={innerPGDirection} onLayout={resizeBlockly}>
                <Panel
                  id="blockly-panel"
                  defaultSize={defaultPanelSizes[1]}
                  minSize={20}
                >
                  <BlocklyWorkspace
                    ref={blocklyWorkspaceRef}
                    toolboxContents={[
                      { kind: "block", type: "logic_compare" },
                      { kind: "block", type: "logic_compare" },
                      { kind: "block", type: "logic_compare" },
                    ]}
                  />
                </Panel>
                <AppResizeHandle />
                <Panel
                  id="panel-2"
                  defaultSize={defaultPanelSizes[2]}
                  minSize={20}
                >
                  <Typography>Settings: {JSON.stringify(settings)}</Typography>
                  <Typography>Level state: {JSON.stringify(level)}</Typography>
                </Panel>
                {threePanels &&
                  settings.threePanelLayout !==
                    THREE_PANEL_VERTICAL_WITH_LEFT_HORIZONTAL && (
                    <>
                      <AppResizeHandle />
                      <Panel
                        id="panel-3"
                        defaultSize={defaultPanelSizes[3]}
                        minSize={20}
                      >
                        <Panel3 />
                      </Panel>
                    </>
                  )}
              </PanelGroup>
            </Panel>
            {threePanels &&
              settings.threePanelLayout ===
                THREE_PANEL_VERTICAL_WITH_LEFT_HORIZONTAL && (
                <>
                  <AppResizeHandle />
                  <Panel
                    id="panel-3"
                    defaultSize={defaultPanelSizes[3]}
                    minSize={20}
                  >
                    <Panel3 />
                  </Panel>
                </>
              )}
          </PanelGroup>
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
