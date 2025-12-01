import { type FC, useCallback } from "react"
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels"
import DragIndicatorIcon from "@mui/icons-material/DragIndicator"

import {
  useLevelPanelCount,
  useLevelToolbox,
  useSettings,
} from "../../app/hooks"
import BlocklyWorkspace from "./BlocklyWorkspace"
import PhaserGame from "./PhaserGame"
import PythonEditor from "./PythonEditor"
import { useBlocklyContext } from "./context/BlocklyContext"

type Direction = "horizontal" | "vertical"

interface PanelProps {
  order?: number
  defaultSize: number
}

interface LayoutProps {
  onResize: () => void
  direction: Direction
  reverseOrder: boolean
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
  const blocklyCtx = useBlocklyContext()
  const levelToolbox = useLevelToolbox()
  return (
    <Panel
      id="blockly-panel"
      defaultSize={defaultSize}
      order={order}
      minSize={20}
    >
      <BlocklyWorkspace
        ref={blocklyCtx.workspaceRef}
        toolboxContents={levelToolbox}
      />
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

const PhaserGamePanel: FC<PanelProps> = ({ order, defaultSize }) => (
  <Panel
    id="phaser-game-panel"
    defaultSize={defaultSize}
    order={order}
    minSize={20}
  >
    <PhaserGame />
  </Panel>
)

const Flat2PanelLayout: FC<LayoutProps> = ({
  onResize,
  direction,
  reverseOrder,
}) => {
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
    />,
  ]
  if (reverseOrder) panels.reverse()
  return (
    <PanelGroup onLayout={onResize} direction={direction}>
      {panels[0]}
      <AppResizeHandle />
      {panels[1]}
    </PanelGroup>
  )
}

const Flat3PanelLayout: FC<LayoutProps> = ({
  direction,
  reverseOrder,
  onResize,
}) => {
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
    />,
  ]
  if (reverseOrder) panels.reverse()
  return (
    <PanelGroup direction={direction} onLayout={onResize}>
      {panels[0]}
      <AppResizeHandle />
      {panels[1]}
      <AppResizeHandle />
      {panels[2]}
    </PanelGroup>
  )
}

const Nested3PanelLayout: FC<Pick<LayoutProps, "onResize">> = ({
  onResize,
}) => {
  return (
    <PanelGroup direction="horizontal" onLayout={onResize}>
      <Panel defaultSize={50} minSize={20}>
        <PanelGroup direction="vertical" onLayout={onResize}>
          <BlocklyPanel defaultSize={50} />
          <AppResizeHandle />
          <Panel key="panel-2" id="panel-2" defaultSize={50} minSize={20}>
            <PythonEditor />
          </Panel>
        </PanelGroup>
      </Panel>
      <AppResizeHandle />
      <PhaserGamePanel defaultSize={50} />
    </PanelGroup>
  )
}

const Panels: FC = () => {
  const settings = useSettings()
  const panels = useLevelPanelCount()

  const blocklyContext = useBlocklyContext()
  const resizeBlockly = useCallback(() => {
    const { workspaceRef } = blocklyContext
    if (workspaceRef.current) workspaceRef.current.resize()
  }, [blocklyContext])

  let direction: Direction | undefined,
    reverseOrder = false
  if (panels === 2) {
    switch (settings.twoPanelLayout) {
      case "horizontal":
        direction = "vertical"
        reverseOrder = true
        break
      case "auto":
      case "vertical":
      default:
        direction = "horizontal"
        break
    }
    return (
      <Flat2PanelLayout
        direction={direction}
        onResize={resizeBlockly}
        reverseOrder={reverseOrder}
      />
    )
  }
  switch (settings.threePanelLayout) {
    case "verticalWithLeftHorizontal":
      return <Nested3PanelLayout onResize={resizeBlockly} />
    case "horizontal":
      direction = "vertical"
      reverseOrder = true
      break
    case "auto":
    case "vertical":
    default:
      direction = "horizontal"
      break
  }
  return (
    <Flat3PanelLayout
      direction={direction}
      onResize={resizeBlockly}
      reverseOrder={reverseOrder}
    />
  )
}

export default Panels
