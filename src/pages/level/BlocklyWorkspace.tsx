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

export interface BlocklyWorkspaceHandle {
  resize: () => void
}

export interface BlocklyWorkspaceProps {
  toolboxContents: Blockly.utils.toolbox.ToolboxItemInfo[]
  ref: RefObject<BlocklyWorkspaceHandle | null>
}

const BlocklyWorkspace: FC<BlocklyWorkspaceProps> = ({
  toolboxContents,
  ref,
}) => {
  const injectionDivRef = useRef(null)
  const [workspace, setWorkspace] = useState<WorkspaceSvg | null>(null)

  // Handle to imperatively trigger (debounced) resize from parent
  useImperativeHandle(ref, () => {
    return {
      resize: debounce(() => {
        if (workspace) {
          Blockly.svgResize(workspace)
        }
      }, 10),
    }
  }, [workspace])

  // Workspace creation
  useEffect(() => {
    if (!injectionDivRef.current) {
      return
    }
    // @ts-expect-error Locale type isn't inferred correctly after export
    Blockly.setLocale(En)
    const newWorkspace = Blockly.inject(injectionDivRef.current, {
      toolbox: {
        kind: "flyoutToolbox",
        contents: toolboxContents,
      },
      trashcan: true,
    })
    setWorkspace(newWorkspace)
    return () => {
      newWorkspace.dispose()
    }
  }, [injectionDivRef, toolboxContents])

  return (
    <>
      <Box
        sx={{
          height: "100%",
        }}
        ref={injectionDivRef}
        id="blocklyDiv"
      />
    </>
  )
}

export default BlocklyWorkspace
