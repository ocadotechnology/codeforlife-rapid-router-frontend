import {
  type FC,
  type ReactNode,
  createContext,
  createRef,
  useContext,
  useRef,
} from "react"

import { type BlocklyWorkspaceProps } from "../BlocklyWorkspace"

interface IBlocklyContext {
  workspaceRef: BlocklyWorkspaceProps["ref"]
}

const DEFAULT_CONTEXT: IBlocklyContext = {
  workspaceRef: createRef(),
}

const BlocklyContext = createContext(DEFAULT_CONTEXT)

const BlocklyContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const workspaceRef: BlocklyWorkspaceProps["ref"] = useRef(null)
  return (
    <BlocklyContext.Provider
      value={{
        workspaceRef,
      }}
    >
      {children}
    </BlocklyContext.Provider>
  )
}

/* eslint-disable-next-line react-refresh/only-export-components */
export const useBlocklyContext = () => useContext(BlocklyContext)

export default BlocklyContextProvider
