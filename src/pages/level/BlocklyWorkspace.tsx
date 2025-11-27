import "blockly/blocks"
import * as Blockly from "blockly/core"
import * as En from "blockly/msg/en"
import { Box, debounce } from "@mui/material"
import {
  type FC,
  type RefObject,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react"
import { type WorkspaceSvg } from "blockly/core"

export type ToolboxItemInfo = Blockly.utils.toolbox.ToolboxItemInfo

export interface BlocklyWorkspaceProps {
  toolboxContents: Blockly.utils.toolbox.ToolboxItemInfo[]
  ref: RefObject<{ resize: () => void } | null>
}

const RESIZE_DEBOUNCE_MS = 10
const LOCAL_STORAGE_KEY = "blockly-workspace-state"

const BlocklyWorkspace: FC<BlocklyWorkspaceProps> = ({
  toolboxContents,
  ref,
}) => {
  const divRef = useRef<HTMLDivElement | null>(null)
  const [workspace, setWorkspace] = useState<WorkspaceSvg | null>(null)

  // Handle to imperatively trigger (debounced) resize from parent
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
    Blockly.setLocale(En)
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
