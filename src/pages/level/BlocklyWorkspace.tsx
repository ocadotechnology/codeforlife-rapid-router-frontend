import "blockly/blocks"
import * as Blockly from "blockly/core"
import * as En from "blockly/msg/en"
import { Box, debounce } from "@mui/material"
import {
  type FC,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react"
import EnTokens from "./blockly/messages/en"
import { type WorkspaceSvg } from "blockly/core"
import { registerCustomBlockDefinitions } from "./blockly/blocks"
import { useBlocklyContext } from "./context/BlocklyContext"
import { useLevelToolbox } from "../../app/hooks"

export type ToolboxItemInfo = Blockly.utils.toolbox.ToolboxItemInfo

export interface BlocklyWorkspaceProps {}

const RESIZE_DEBOUNCE_MS = 10
const LOCAL_STORAGE_KEY = "blockly-workspace-state"

const BlocklyWorkspace: FC<BlocklyWorkspaceProps> = () => {
  const blocklyCtx = useBlocklyContext()
  const toolboxContents = useLevelToolbox()
  const divRef = useRef<HTMLDivElement | null>(null)
  const [workspace, setWorkspace] = useState<WorkspaceSvg | null>(null)

  // Handle to imperatively trigger (debounced) resize from parent
  useImperativeHandle(
    blocklyCtx.workspaceRef,
    () => {
      return {
        resize: debounce(() => {
          if (workspace) Blockly.svgResize(workspace)
        }, RESIZE_DEBOUNCE_MS),
      }
    },
    [workspace],
  )

  // Workspace creation
  useEffect(() => {
    if (!divRef.current) return
    // @ts-expect-error Locale type isn't inferred correctly after export
    Blockly.setLocale(En)
    Blockly.setLocale(EnTokens)
    registerCustomBlockDefinitions()
    const newWorkspace = Blockly.inject(divRef.current, {
      toolbox: { kind: "flyoutToolbox", contents: toolboxContents },
      trashcan: true,
    })
    const state = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (state) {
      Blockly.serialization.workspaces.load(
        JSON.parse(state) as { [key: string]: any },
        newWorkspace,
      )
    }
    if (!newWorkspace.getTopBlocks().some(b => b.type === "start")) {
      newWorkspace.newBlock("start").setDeletable(false)
    }
    setWorkspace(newWorkspace)
    return () => {
      const state = Blockly.serialization.workspaces.save(newWorkspace)
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state))
      newWorkspace.dispose()
    }
  }, [divRef, toolboxContents])

  return (
    <Box
      component={"div"}
      id="blockly-workspace"
      ref={divRef}
      sx={{ height: "100%" }}
    />
  )
}

export default BlocklyWorkspace
