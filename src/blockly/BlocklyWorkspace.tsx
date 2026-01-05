import "blockly/blocks"
import * as Blockly from "blockly/core"
import * as en_default from "blockly/msg/en"
import { Box, debounce } from "@mui/material"
import {
  type FC,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react"

import * as en_custom from "./messages/en"
import { type GameCommand, setGameCommands } from "../app/slices"
import {
  useAppDispatch,
  useBlocklyWorkspaceContext,
  useCurrentGameCommand,
} from "../app/hooks"
import { registerCustomBlockDefinitions } from "./utils"

const RESIZE_DEBOUNCE_MS = 10
const LOCAL_STORAGE_KEY = "blockly-workspace-state"

export interface BlocklyWorkspaceProps {}

const BlocklyWorkspace: FC<BlocklyWorkspaceProps> = () => {
  const blocklyWorkspaceContext = useBlocklyWorkspaceContext()
  const divRef = useRef<HTMLDivElement | null>(null)
  const [workspace, setWorkspace] = useState<Blockly.WorkspaceSvg | null>(null)
  const [blocks, setBlocks] = useState<Blockly.BlockSvg[]>([])
  const dispatch = useAppDispatch()
  const currentGameCommand = useCurrentGameCommand()

  if (!blocklyWorkspaceContext)
    throw ReferenceError("Reference to Blockly workspace context not provided.")
  const { ref, toolboxContents } = blocklyWorkspaceContext

  useImperativeHandle(ref, () => {
    return {
      resize: debounce(() => {
        if (workspace) Blockly.svgResize(workspace)
      }, RESIZE_DEBOUNCE_MS),
    }
  }, [workspace])

  // Workspace creation
  useEffect(() => {
    if (!divRef.current) return

    // @ts-expect-error Locale type isn't inferred correctly after export
    Blockly.setLocale({ ...en_default, ...en_custom })

    registerCustomBlockDefinitions()

    const newWorkspace = Blockly.inject(divRef.current, {
      toolbox: { kind: "flyoutToolbox", contents: toolboxContents },
      trashcan: true,
    })
    const state = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (state) {
      Blockly.serialization.workspaces.load(
        JSON.parse(state) as ReturnType<
          typeof Blockly.serialization.workspaces.save
        >,
        newWorkspace,
      )
    }
    if (!newWorkspace.getTopBlocks().some(b => b.type === "start")) {
      newWorkspace.newBlock("start").setDeletable(false)
    }

    function onBlocksChanged(event: Blockly.Events.Abstract) {
      const BLOCK_EVENTS = [
        Blockly.Events.BLOCK_CREATE,
        Blockly.Events.BLOCK_DELETE,
        Blockly.Events.BLOCK_MOVE,
      ] as string[]
      if (!BLOCK_EVENTS.includes(event.type)) return

      const gameCommands = newWorkspace
        .getTopBlocks(true)
        .map(block => block.type as GameCommand)

      dispatch(setGameCommands(gameCommands))
    }

    newWorkspace.addChangeListener(onBlocksChanged)
    setWorkspace(newWorkspace)

    return () => {
      const state = Blockly.serialization.workspaces.save(newWorkspace)
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state))
      newWorkspace.removeChangeListener(onBlocksChanged)
      newWorkspace.dispose()
    }
  }, [dispatch, divRef, toolboxContents])

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
