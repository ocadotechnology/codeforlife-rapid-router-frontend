import "blockly/blocks"
import * as Blockly from "blockly/core"
import {
  type FC,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react"
import { Box } from "@mui/material"

import {
  getGameCommandsFromStartBlock,
  getNextBlocks,
  initializeBlockly,
  resizeWorkspace,
  saveWorkspaceState,
} from "./utils"
import {
  useAppDispatch,
  useBlocklyWorkspaceContext,
  useGameCommandIndex,
  useGameInPlay,
} from "../app/hooks"
import { type StartBlockType } from "./blocks"
import { setGameCommands } from "../app/slices"

const BLOCK_EVENTS = [
  Blockly.Events.BLOCK_CREATE,
  Blockly.Events.BLOCK_DELETE,
  Blockly.Events.BLOCK_MOVE,
]

export interface BlocklyWorkspaceProps {
  startBlockType?: StartBlockType
}

const BlocklyWorkspace: FC<BlocklyWorkspaceProps> = ({
  startBlockType = "van",
}) => {
  const blocklyWorkspaceContext = useBlocklyWorkspaceContext()
  const divRef = useRef<HTMLDivElement | null>(null)
  const [blockly, setBlockly] = useState<null | ReturnType<
    typeof initializeBlockly
  >>(null)
  const dispatch = useAppDispatch()
  const gameInPlay = useGameInPlay()
  const gameCommandIndex = useGameCommandIndex()

  if (!blocklyWorkspaceContext)
    throw ReferenceError("Blockly workspace context not provided.")
  const { ref, toolboxContents } = blocklyWorkspaceContext

  // Expose workspace methods to parent components.
  useImperativeHandle(
    ref,
    () =>
      blockly
        ? { resize: resizeWorkspace(blockly.workspace) }
        : { resize: () => {} },
    [blockly],
  )

  // Workspace initialization and disposal.
  useEffect(() => {
    if (!divRef.current) return
    const blockly = initializeBlockly(
      divRef.current,
      startBlockType,
      toolboxContents,
    )
    setBlockly(blockly)

    // Set up event listener to update game commands on block changes.
    function onBlocksChanged(event: Blockly.Events.Abstract) {
      // Only respond to block events that modify the workspace.
      const eventType = event.type as (typeof BLOCK_EVENTS)[number]
      if (!BLOCK_EVENTS.includes(eventType)) return

      const gameCommands = getGameCommandsFromStartBlock(blockly.startBlock)
      dispatch(setGameCommands(gameCommands))
    }
    blockly.workspace.addChangeListener(onBlocksChanged)

    return () => {
      saveWorkspaceState(blockly.workspace)
      blockly.workspace.removeChangeListener(onBlocksChanged)
      blockly.workspace.dispose()
    }
  }, [dispatch, divRef, toolboxContents, startBlockType])

  // Highlight the current block during game play.
  useEffect(() => {
    if (!blockly) return

    const blockId = gameInPlay
      ? getNextBlocks(blockly.startBlock)[gameCommandIndex].id
      : null // Clear any highlighted blocks when the game is not in play.

    blockly.workspace.highlightBlock(blockId)
  }, [blockly, gameInPlay, gameCommandIndex])

  return (
    <Box
      component="div"
      id="blockly-workspace"
      ref={divRef}
      sx={{ height: "100%" }}
    />
  )
}

export default BlocklyWorkspace
