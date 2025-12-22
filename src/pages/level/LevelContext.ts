import { type RefObject, createContext, useContext } from "react"

export type BlocklyWorkspace = {
  resize: () => void
}

const LevelContext = createContext<{
  blocklyWorkspaceRef: RefObject<BlocklyWorkspace | null>
} | null>(null)

export default LevelContext

export const useLevelContext = () => useContext(LevelContext)
