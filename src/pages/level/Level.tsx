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

/**
 * Function that calculates the required panel configuration (default sizes,
 * panel group directions, order of panels) based on the number of panels
 * and preferred layout option
 * Layout of panels contains 2 groups: inner and outer. Outer group is
 * used only for "vertical split with horizontal left split" 3-panel
 * layout. Inner group contains all 2 or 3 panels in all cases, except
 * this one when the 3rd panel moves to the outer group, while the rest stay
 * in the inner.
 */
function calculatePanelsConfig(
  panels: number,
  layout: TwoPanelLayout | ThreePanelLayout,
): {
  innerPGDirection: Direction
  outerPGDirection: Direction
  panels: {
    /*
      Array of default sizes of panels in %. First element is
      the size of the panel containing the entire inner
      panel group, followed by 2 or 3 numbers for panels
      inside the inner panel group
    */
    defaultSizes: number[]
    reverseOrder: boolean
  }
} {
  let panelsDefaultSizes: number[],
    reverseOrder = false,
    innerPGDirection: Direction,
    outerPGDirection: Direction = "horizontal"

  if (panels === 2) {
    panelsDefaultSizes = [100, 50, 50]
    switch (layout) {
      case "horizontal":
        innerPGDirection = "vertical"
        reverseOrder = true
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
        panelsDefaultSizes = [50, 50, 50, 50]
        break
      case "horizontal":
        innerPGDirection = "vertical"
        panelsDefaultSizes = [100, 34, 33, 33]
        reverseOrder = true
        break
      case "auto":
      case "vertical":
      default:
        innerPGDirection = "horizontal"
        panelsDefaultSizes = [100, 34, 33, 33]
    }
  }
  return {
    innerPGDirection,
    outerPGDirection,
    panels: {
      defaultSizes: panelsDefaultSizes,
      reverseOrder,
    },
  }
}

const Panel3Content: FC = () => (
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
    panels: 3,
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
  const {
    innerPGDirection,
    outerPGDirection,
    panels: { defaultSizes: defaultPanelSizes, reverseOrder },
  } = calculatePanelsConfig(
    level.panels,
    threePanels ? settings.threePanelLayout : settings.twoPanelLayout,
  )
  const panels = [
    <Panel
      key="blockly-panel"
      id="blockly-panel"
      defaultSize={defaultPanelSizes[1]}
      order={reverseOrder ? 3 : 1}
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
    </Panel>,
    <Panel
      key="panel-2"
      id="panel-2"
      defaultSize={defaultPanelSizes[2]}
      order={2}
      minSize={20}
    >
      <Typography>Settings: {JSON.stringify(settings)}</Typography>
      <Typography>Level state: {JSON.stringify(level)}</Typography>
    </Panel>,
    <Panel
      key="panel-3"
      id="panel-3"
      defaultSize={defaultPanelSizes[3]}
      order={reverseOrder ? 1 : 3}
      minSize={20}
    >
      <Panel3Content />
    </Panel>,
  ]
  if (reverseOrder) {
    panels.reverse()
  }
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
            id="outer-pg"
            direction={outerPGDirection}
            style={{ height: "100vh" }}
            onLayout={resizeBlockly}
          >
            <Panel defaultSize={defaultPanelSizes[0]} order={1} minSize={20}>
              <PanelGroup
                id="inner-pg"
                direction={innerPGDirection}
                onLayout={resizeBlockly}
              >
                {panels[0]}
                <AppResizeHandle />
                {panels[1]}
                {threePanels &&
                  settings.threePanelLayout !==
                    THREE_PANEL_VERTICAL_WITH_LEFT_HORIZONTAL && (
                    <>
                      <AppResizeHandle />
                      {panels[2]}
                    </>
                  )}
              </PanelGroup>
            </Panel>
            {threePanels &&
              settings.threePanelLayout ===
                THREE_PANEL_VERTICAL_WITH_LEFT_HORIZONTAL && (
                <>
                  <AppResizeHandle />
                  {panels[2]}
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
