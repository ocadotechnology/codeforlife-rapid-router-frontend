import { type FC, useCallback } from "react"
import {
  Panel,
  PanelResizeHandle,
  PanelGroup as _PanelGroup,
  type PanelGroupProps as _PanelGroupProps,
} from "react-resizable-panels"
import { type Breakpoint } from "@mui/material"
import DragIndicatorIcon from "@mui/icons-material/DragIndicator"

import type {
  PanelLayout,
  ThreePanelLayout,
  TwoPanelLayout,
} from "../../app/slices"
import {
  type ScreenOrientation,
  useBlocklyWorkspaceContext,
  useBreakpoint,
  useScreenOrientation,
  useSettings,
} from "../../app/hooks"
import { BlocklyWorkspace } from "../../blockly"
import type { Level } from "../../api/level"
import { PhaserGame } from "../../phaser"
import PythonEditor from "./PythonEditor"

interface PanelProps {
  order?: number
  defaultSize: number
}

type AutoPanelLayout<PL extends PanelLayout> = Record<
  ScreenOrientation,
  Record<Breakpoint, PL>
>

const AUTO_TWO_PANEL_LAYOUTS: AutoPanelLayout<TwoPanelLayout> = {
  landscape: {
    xs: "vertical",
    sm: "vertical",
    md: "vertical",
    lg: "vertical",
    xl: "vertical",
  },
  portrait: {
    xs: "horizontal",
    sm: "horizontal",
    md: "vertical",
    lg: "vertical",
    xl: "vertical",
  },
}

const AUTO_THREE_PANEL_LAYOUTS: AutoPanelLayout<ThreePanelLayout> = {
  landscape: {
    xs: "verticalWithLeftHorizontal",
    sm: "verticalWithLeftHorizontal",
    md: "verticalWithLeftHorizontal",
    lg: "verticalWithLeftHorizontal",
    xl: "verticalWithLeftHorizontal",
  },
  portrait: {
    xs: "horizontal",
    sm: "horizontal",
    md: "vertical",
    lg: "vertical",
    xl: "vertical",
  },
}

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

const BlocklyPanel: FC<PanelProps> = ({ order, defaultSize }) => {
  return (
    <Panel
      id="blockly-panel"
      defaultSize={defaultSize}
      order={order}
      minSize={20}
    >
      <BlocklyWorkspace />
    </Panel>
  )
}

const PythonEditorPanel: FC<PanelProps> = ({ order, defaultSize }) => (
  <Panel
    id="python-editor-panel"
    defaultSize={defaultSize}
    order={order}
    minSize={20}
  >
    <PythonEditor />
  </Panel>
)

const PhaserGamePanel: FC<PanelProps & { levelId: Level["id"] }> = ({
  order,
  defaultSize,
  levelId,
}) => (
  <Panel
    id="phaser-game-panel"
    defaultSize={defaultSize}
    order={order}
    minSize={20}
  >
    <PhaserGame mode="play" levelId={levelId} />
  </Panel>
)

type PanelGroupProps = Omit<_PanelGroupProps, "onLayout">

const PanelGroup: FC<PanelGroupProps> = panelGroupProps => {
  const blocklyWorkspaceContext = useBlocklyWorkspaceContext()

  const resizeBlocklyWorkspace = useCallback(() => {
    if (blocklyWorkspaceContext && blocklyWorkspaceContext.ref.current)
      blocklyWorkspaceContext.ref.current.resize()
  }, [blocklyWorkspaceContext])

  return <_PanelGroup onLayout={resizeBlocklyWorkspace} {...panelGroupProps} />
}

const Flat2PanelLayout: FC<
  Pick<PanelGroupProps, "direction"> & {
    reverseOrder?: boolean
    levelId: Level["id"]
  }
> = ({ direction, reverseOrder = false, levelId }) => {
  const panels = [
    <BlocklyPanel
      key="blockly-panel"
      defaultSize={50}
      order={reverseOrder ? 2 : 1}
    />,
    <PhaserGamePanel
      key="phaser-game-panel"
      defaultSize={50}
      order={reverseOrder ? 1 : 2}
      levelId={levelId}
    />,
  ]
  if (reverseOrder) panels.reverse()
  return (
    <PanelGroup direction={direction}>
      {panels[0]}
      <AppResizeHandle />
      {panels[1]}
    </PanelGroup>
  )
}

const Flat3PanelLayout: FC<
  Pick<PanelGroupProps, "direction"> & {
    reverseOrder?: boolean
    levelId: Level["id"]
  }
> = ({ direction, reverseOrder = false, levelId }) => {
  const panels = [
    <BlocklyPanel
      key="blockly-panel"
      defaultSize={34}
      order={reverseOrder ? 3 : 1}
    />,
    <PythonEditorPanel key="python-editor-panel" defaultSize={33} order={2} />,
    <PhaserGamePanel
      key="phaser-game-panel"
      defaultSize={33}
      order={reverseOrder ? 1 : 3}
      levelId={levelId}
    />,
  ]
  if (reverseOrder) panels.reverse()
  return (
    <PanelGroup direction={direction}>
      {panels[0]}
      <AppResizeHandle />
      {panels[1]}
      <AppResizeHandle />
      {panels[2]}
    </PanelGroup>
  )
}

const Nested3PanelLayout: FC<{ levelId: Level["id"] }> = ({ levelId }) => {
  return (
    <PanelGroup direction="horizontal">
      <Panel defaultSize={50} minSize={20}>
        <PanelGroup direction="vertical">
          <BlocklyPanel defaultSize={50} />
          <AppResizeHandle />
          <Panel key="panel-2" id="panel-2" defaultSize={50} minSize={20}>
            <PythonEditor />
          </Panel>
        </PanelGroup>
      </Panel>
      <AppResizeHandle />
      <PhaserGamePanel defaultSize={50} levelId={levelId} />
    </PanelGroup>
  )
}

interface PanelsProps {
  count: number
  levelId: Level["id"]
}

const Panels: FC<PanelsProps> = ({ count, levelId }) => {
  const settings = useSettings()
  const screenOrientation = useScreenOrientation()
  const breakpoint = useBreakpoint()

  if (count === 2) {
    switch (
      settings.twoPanelLayout ??
      AUTO_TWO_PANEL_LAYOUTS[screenOrientation][breakpoint]
    ) {
      case "horizontal":
        return (
          <Flat2PanelLayout
            direction="vertical"
            reverseOrder
            levelId={levelId}
          />
        )
      case "vertical":
      default:
        return <Flat2PanelLayout direction="horizontal" levelId={levelId} />
    }
  }

  switch (
    settings.threePanelLayout ??
    AUTO_THREE_PANEL_LAYOUTS[screenOrientation][breakpoint]
  ) {
    case "verticalWithLeftHorizontal":
      return <Nested3PanelLayout levelId={levelId} />
    case "horizontal":
      return (
        <Flat3PanelLayout direction="vertical" reverseOrder levelId={levelId} />
      )
    case "vertical":
    default:
      return <Flat3PanelLayout direction="horizontal" levelId={levelId} />
  }
}

export default Panels
