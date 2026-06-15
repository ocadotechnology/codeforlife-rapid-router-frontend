import {
  AutoAwesomeMosaic as AutoAwesomeMosaicIcon,
  Delete as DeleteIcon,
  Pause as PauseIcon,
  PlayArrow as PlayArrowIcon,
  Redo as RedoIcon,
  Speed as SpeedIcon,
  Stop as StopIcon,
} from "@mui/icons-material"
import { type FC, useState } from "react"
import type { PayloadAction } from "@reduxjs/toolkit"

import * as miniDrawers from "../../components/miniDrawers"
import {
  PLAY_SPEEDS,
  THREE_PANEL_LAYOUTS,
  TWO_PANEL_LAYOUTS,
  nextGameCommand,
  restartGame,
  setPlaySpeed,
  setThreePanelLayout,
  setTwoPanelLayout,
} from "../../app/slices"
import {
  useAppDispatch,
  useBlocklyWorkspaceContext,
  useGameHasStarted,
  useGameInPlay,
  useGameIsDefined,
  usePlayInterval,
  useSettings,
} from "../../app/hooks"
import { type Level } from "../../api/level"

export type ControlsProps = { level: Pick<Level, "mode"> }

const Base: FC<{ panelCount: number; onClear: () => void }> = ({
  panelCount,
  onClear,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true)
  const dispatch = useAppDispatch()
  const settings = useSettings()
  const gameIsDefined = useGameIsDefined()
  const gameHasStarted = useGameHasStarted()
  const gameInPlay = useGameInPlay()
  const [playInterval, setPlayInterval, clearPlayInterval] = usePlayInterval()

  // Helper to map panel layout options to menu items.
  function mapPanelLayoutsToMenuItems<
    O extends readonly (string | undefined)[],
  >(
    panelLayoutOptions: O,
    setPanelLayout: (layout: O[number]) => PayloadAction<O[number]>,
  ): miniDrawers.MenuItemProps<O[number]>["menuItems"] {
    return panelLayoutOptions.map(panelLayout => ({
      value: panelLayout,
      key: panelLayout ?? "auto",
      onClick: () => dispatch(setPanelLayout(panelLayout)),
    }))
  }

  return (
    <miniDrawers.MiniDrawer
      open={isDrawerOpen}
      onToggle={() => {
        setIsDrawerOpen(!isDrawerOpen)
      }}
    >
      <miniDrawers.ButtonItem
        isDrawerOpen={isDrawerOpen}
        text="Clear"
        icon={<DeleteIcon />}
        onClick={() => {
          clearPlayInterval()
          onClear()
        }}
      />
      <miniDrawers.ButtonItem
        isDrawerOpen={isDrawerOpen}
        text={gameInPlay && playInterval ? "Pause" : "Play"}
        icon={gameInPlay && playInterval ? <PauseIcon /> : <PlayArrowIcon />}
        disabled={!gameIsDefined}
        onClick={() => {
          if (!clearPlayInterval()) setPlayInterval()
        }}
      />
      <miniDrawers.MenuItem
        isDrawerOpen={isDrawerOpen}
        icon={<SpeedIcon />}
        text="Speed"
        menuItems={PLAY_SPEEDS.map(playSpeed => ({
          value: playSpeed,
          key: playSpeed,
          onClick: () => dispatch(setPlaySpeed(playSpeed)),
        }))}
        selectedValue={settings.playSpeed}
      />
      <miniDrawers.ButtonItem
        isDrawerOpen={isDrawerOpen}
        text="Stop"
        icon={<StopIcon />}
        disabled={!gameHasStarted}
        onClick={() => {
          clearPlayInterval()
          dispatch(restartGame())
        }}
      />
      <miniDrawers.ButtonItem
        isDrawerOpen={isDrawerOpen}
        text="Step"
        icon={<RedoIcon />}
        disabled={!gameIsDefined}
        onClick={() => {
          clearPlayInterval()
          dispatch(nextGameCommand())
        }}
      />
      <miniDrawers.MenuItem
        isDrawerOpen={isDrawerOpen}
        text="Layout"
        icon={<AutoAwesomeMosaicIcon />}
        menuItems={
          panelCount === 2
            ? mapPanelLayoutsToMenuItems(TWO_PANEL_LAYOUTS, setTwoPanelLayout)
            : mapPanelLayoutsToMenuItems(
                THREE_PANEL_LAYOUTS,
                setThreePanelLayout,
              )
        }
        selectedValue={
          panelCount === 2 ? settings.twoPanelLayout : settings.threePanelLayout
        }
      />
    </miniDrawers.MiniDrawer>
  )
}

function clearBlocklyWorkspace(
  blocklyWorkspaceContext: ReturnType<typeof useBlocklyWorkspaceContext>,
) {
  if (blocklyWorkspaceContext?.ref.current) {
    blocklyWorkspaceContext.ref.current.clear()
  }
}

function clearPythonWorkspace() {}

const Blockly: FC = () => {
  const blocklyWorkspaceContext = useBlocklyWorkspaceContext()

  return (
    <Base
      panelCount={2}
      onClear={() => clearBlocklyWorkspace(blocklyWorkspaceContext)}
    />
  )
}

const Python: FC = () => (
  <Base panelCount={2} onClear={() => clearPythonWorkspace()} />
)

const BlocklyAndPython: FC = () => {
  const blocklyWorkspaceContext = useBlocklyWorkspaceContext()

  return (
    <Base
      panelCount={3}
      onClear={() => {
        clearBlocklyWorkspace(blocklyWorkspaceContext)
        clearPythonWorkspace()
      }}
    />
  )
}

const Controls: FC<ControlsProps> = ({ level }) =>
  ({
    blockly: <Blockly />,
    python: <Python />,
    blocklyAndPython: <BlocklyAndPython />,
  })[level.mode]

export default Controls
