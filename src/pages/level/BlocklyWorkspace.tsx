import "blockly/blocks"
import * as Blockly from "blockly/core"
import * as En from "blockly/msg/en"
import {
  type FC,
  type ReactNode,
  createElement,
  useEffect,
  useRef,
  useState,
} from "react"
import { Box } from "@mui/material"
import { type WorkspaceSvg } from "blockly/core"

export interface BlockProps {
  type: string
  children?: ReactNode
}

export const Block: FC<BlockProps> = ({ children, ...props }) => {
  return createElement("block", { is: "Blockly", ...props }, children)
}

export interface BlocklyWorkspaceProps {
  children: ReactNode
}

const BlocklyWorkspace: FC<BlocklyWorkspaceProps> = ({ children }) => {
  const injectionDivRef = useRef(null)
  const toolboxRef = useRef(null)
  const [, setWorkspace] = useState<WorkspaceSvg | null>(null)
  // Workspace creation
  useEffect(() => {
    if (!injectionDivRef.current || !toolboxRef.current) {
      return
    }
    // @ts-expect-error Locale type isn't inferred correctly after export
    Blockly.setLocale(En)
    const newWorkspace = Blockly.inject(injectionDivRef.current, {
      toolbox: toolboxRef.current,
    })
    setWorkspace(newWorkspace)
    return () => {
      newWorkspace.dispose()
    }
  }, [injectionDivRef])

  return (
    <>
      <Box
        sx={{
          height: "100%",
        }}
        ref={injectionDivRef}
        id="blocklyDiv"
      />
      <xml
        xmlns="https://developers.google.com/blockly/xml"
        is="blockly"
        style={{ display: "none" }}
        ref={toolboxRef}
      >
        {children}
      </xml>
    </>
  )
}

export default BlocklyWorkspace
