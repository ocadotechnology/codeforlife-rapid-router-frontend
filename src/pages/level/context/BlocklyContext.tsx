import { type RefObject, createContext, createRef, useContext } from "react"

interface IBlocklyContext {
  workspaceRef: RefObject<{
    resize: () => void
    step: () => void
    play: () => void
    stop: () => void
  } | null>
}

const DEFAULT_CONTEXT: IBlocklyContext = {
  workspaceRef: createRef(),
}

const BlocklyContext = createContext(DEFAULT_CONTEXT)

export const useBlocklyContext = () => useContext(BlocklyContext)
