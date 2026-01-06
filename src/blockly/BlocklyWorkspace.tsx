import "blockly/blocks"
import * as Blockly from "blockly/core"
import { Box, debounce } from "@mui/material"
import {
  type FC,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react"

import {
  blocksToGameCommands,
  initializeWorkspace,
  resizeWorkspace,
  saveWorkspaceState,
} from "./utils"
import {
  useAppDispatch,
  useBlocklyWorkspaceContext,
  useCurrentGameCommand,
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
  const [workspace, setWorkspace] = useState<Blockly.WorkspaceSvg | null>(null)
  const dispatch = useAppDispatch()
  const currentGameCommand = useCurrentGameCommand()

  if (!blocklyWorkspaceContext)
    throw ReferenceError("Reference to Blockly workspace context not provided.")
  const { ref, toolboxContents } = blocklyWorkspaceContext

  // Expose workspace methods to parent components.
  useImperativeHandle(
    ref,
    () =>
      workspace ? { resize: resizeWorkspace(workspace) } : { resize: () => {} },
    [workspace],
  )

  // Workspace initialization and disposal.
  useEffect(() => {
    if (!divRef.current) return
    const newWorkspace = initializeWorkspace(
      divRef.current,
      startBlockType,
      toolboxContents,
    )

    function onBlocksChanged(event: Blockly.Events.Abstract) {
      // Only respond to block events that modify the workspace.
      const eventType = event.type as (typeof BLOCK_EVENTS)[number]
      if (!BLOCK_EVENTS.includes(eventType)) return

      dispatch(setGameCommands(blocksToGameCommands(newWorkspace)))
    }

    newWorkspace.addChangeListener(onBlocksChanged)
    setWorkspace(newWorkspace)

    return () => {
      saveWorkspaceState(newWorkspace)
      newWorkspace.removeChangeListener(onBlocksChanged)
      newWorkspace.dispose()
    }
  }, [dispatch, divRef, toolboxContents, startBlockType])

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
