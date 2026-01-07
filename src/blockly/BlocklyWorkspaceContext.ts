import type * as Blockly from "blockly/core"
import { type RefObject, createContext } from "react"

export type BlocklyWorkspaceRef = {
  resize: () => void
  clear: () => void
}

export type BlocklyWorkspaceContextValue = {
  ref: RefObject<BlocklyWorkspaceRef | null>
  toolboxContents: Blockly.utils.toolbox.ToolboxItemInfo[]
}

const BlocklyWorkspaceContext =
  createContext<BlocklyWorkspaceContextValue | null>(null)

export default BlocklyWorkspaceContext
