import { type FC, useCallback } from "react"
import {
  Panel,
  Group as _Group,
  type GroupProps as _GroupProps,
  Separator as _Separator,
} from "react-resizable-panels"
import { type Theme, styled } from "@mui/material/styles"
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

type PanelProps = { defaultSize: string }

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

const BlocklyPanel: FC<PanelProps> = ({ defaultSize }) => {
  return (
    <Panel id="blockly-panel" defaultSize={defaultSize} minSize="20%">
      <BlocklyWorkspace />
    </Panel>
  )
}

const PythonEditorPanel: FC<PanelProps> = ({ defaultSize }) => (
  <Panel id="python-editor-panel" defaultSize={defaultSize} minSize="20%">
    <PythonEditor />
  </Panel>
)

const StyledSeparator = styled(_Separator)(({ theme }: { theme: Theme }) => ({
  alignItems: "center",
  backgroundColor: theme.palette.divider,
  display: "flex",
  justifyContent: "center",
  "&[data-separator='hover']": {
    backgroundColor: theme.palette.action.hover,
  },
  "&[data-separator='active'], &[data-separator='focus']": {
    backgroundColor: theme.palette.primary.main,
  },
}))

const Separator: FC<Pick<GroupProps, "orientation">> = ({ orientation }) => (
  <StyledSeparator>
    <DragIndicatorIcon
      sx={{
        fontSize: 15,
        ...(orientation === "vertical" ? { transform: "rotate(90deg)" } : {}),
      }}
    />
  </StyledSeparator>
)

const PhaserGamePanel: FC<PanelProps & { levelId: Level["id"] }> = ({
  defaultSize,
  levelId,
}) => (
  <Panel id="phaser-game-panel" defaultSize={defaultSize} minSize="20%">
    <PhaserGame mode="play" levelId={levelId} />
  </Panel>
)

type GroupProps = Omit<_GroupProps, "orientation"> & {
  orientation: "horizontal" | "vertical"
}

const Group: FC<GroupProps> = _Group

const BlocklyGroup: FC<Omit<GroupProps, "onLayoutChanged">> = props => {
  const blocklyWorkspaceContext = useBlocklyWorkspaceContext()

  const resizeBlocklyWorkspace = useCallback(() => {
    if (blocklyWorkspaceContext && blocklyWorkspaceContext.ref.current)
      blocklyWorkspaceContext.ref.current.resize()
  }, [blocklyWorkspaceContext])

  return <Group onLayoutChanged={resizeBlocklyWorkspace} {...props} />
}

const Flat2PanelLayout: FC<
  Pick<GroupProps, "orientation"> & {
    reverseOrder?: boolean
    level: { id: Level["id"]; mode: "blockly" | "python" }
  }
> = ({ orientation, reverseOrder = false, level }) => {
  const children = [
    level.mode === "blockly" ? (
      <BlocklyPanel key="blockly-panel" defaultSize="50%" />
    ) : (
      <PythonEditorPanel key="python-editor-panel" defaultSize="50%" />
    ),
    <Separator key="separator" orientation={orientation} />,
    <PhaserGamePanel
      key="phaser-game-panel"
      defaultSize="50%"
      levelId={level.id}
    />,
  ]
  if (reverseOrder) children.reverse()
  return level.mode === "blockly" ? (
    <BlocklyGroup orientation={orientation}>{...children}</BlocklyGroup>
  ) : (
    <Group orientation={orientation}>{...children}</Group>
  )
}

const Flat3PanelLayout: FC<
  Pick<GroupProps, "orientation"> & {
    reverseOrder?: boolean
    levelId: Level["id"]
  }
> = ({ orientation, reverseOrder = false, levelId }) => {
  const panels = [
    <BlocklyPanel key="blockly-panel" defaultSize="34%" />,
    <PythonEditorPanel key="python-editor-panel" defaultSize="33%" />,
    <PhaserGamePanel
      key="phaser-game-panel"
      defaultSize="33%"
      levelId={levelId}
    />,
  ]
  if (reverseOrder) panels.reverse()
  return (
    <BlocklyGroup orientation={orientation}>
      {panels[0]}
      <Separator orientation={orientation} />
      {panels[1]}
      <Separator orientation={orientation} />
      {panels[2]}
    </BlocklyGroup>
  )
}

const Nested3PanelLayout: FC<{ levelId: Level["id"] }> = ({ levelId }) => {
  return (
    <BlocklyGroup orientation="horizontal">
      <Panel defaultSize="50%" minSize="20%">
        <BlocklyGroup orientation="vertical">
          <BlocklyPanel defaultSize="50%" />
          <Separator orientation="vertical" />
          <Panel key="panel-2" id="panel-2" defaultSize="50%" minSize="20%">
            <PythonEditor />
          </Panel>
        </BlocklyGroup>
      </Panel>
      <Separator orientation="horizontal" />
      <PhaserGamePanel defaultSize="50%" levelId={levelId} />
    </BlocklyGroup>
  )
}

export interface PanelsProps {
  level: Pick<Level, "id" | "mode">
}

const Panels: FC<PanelsProps> = ({ level: { id, mode } }) => {
  const settings = useSettings()
  const screenOrientation = useScreenOrientation()
  const breakpoint = useBreakpoint()

  if (mode === "blockly" || mode === "python") {
    switch (
      settings.twoPanelLayout ??
      AUTO_TWO_PANEL_LAYOUTS[screenOrientation][breakpoint]
    ) {
      case "horizontal":
        return (
          <Flat2PanelLayout
            orientation="vertical"
            reverseOrder
            level={{ id, mode }}
          />
        )
      case "vertical":
      default:
        return (
          <Flat2PanelLayout orientation="horizontal" level={{ id, mode }} />
        )
    }
  }

  switch (
    settings.threePanelLayout ??
    AUTO_THREE_PANEL_LAYOUTS[screenOrientation][breakpoint]
  ) {
    case "verticalWithLeftHorizontal":
      return <Nested3PanelLayout levelId={id} />
    case "horizontal":
      return (
        <Flat3PanelLayout orientation="vertical" reverseOrder levelId={id} />
      )
    case "vertical":
    default:
      return <Flat3PanelLayout orientation="horizontal" levelId={id} />
  }
}

export default Panels
