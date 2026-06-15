import * as yup from "yup"
import { type FC, type ReactNode, useRef } from "react"
import { Box } from "@mui/material"
import { handleResultState } from "codeforlife/utils/api"
import { useParamsRequired } from "codeforlife/hooks"

import {
  BlocklyWorkspaceContext,
  type BlocklyWorkspaceRef,
} from "../../blockly"
import {
  type Level as LevelModel,
  useRetrieveLevelQuery,
} from "../../api/level"
import Controls from "./Controls"
import Panels from "./Panels"
import { paths } from "../../routes"

const Base: FC<Pick<LevelModel, "id" | "mode">> = level => (
  <Box sx={{ display: "flex" }}>
    <Controls level={level} />
    {/* TODO: fix style*/}
    <Box component="main" sx={{ flex: 1, minWidth: 0, height: "100vh" }}>
      <Panels level={level} />
    </Box>
  </Box>
)

type BlocklyProps = Pick<LevelModel, "blockly_toolbox_block_types">

const BlocklyContext: FC<BlocklyProps & { children: ReactNode }> = ({
  blockly_toolbox_block_types,
  children,
}) => {
  const blocklyWorkspaceRef = useRef<BlocklyWorkspaceRef>(null)

  return (
    <BlocklyWorkspaceContext.Provider
      value={{
        ref: blocklyWorkspaceRef,
        toolboxContents: blockly_toolbox_block_types.map(type => ({
          kind: "block",
          type,
        })),
      }}
    >
      {children}
    </BlocklyWorkspaceContext.Provider>
  )
}

type PythonProps = {}

const PythonContext: FC<PythonProps & { children: ReactNode }> = ({
  children,
}) => <>{children}</>

const InnerCustom: FC<Pick<LevelModel, "id">> = ({ id }) =>
  handleResultState(useRetrieveLevelQuery(id), level => <Base {...level} />)

const Custom: FC = () =>
  useParamsRequired({
    shape: { id: yup.number().required().min(1) },
    children: ({ id }) => <InnerCustom id={id} />,
    onValidationError: navigate => {
      // Redirect to home with error message
      navigate(paths._, {
        state: {
          notifications: [
            { props: { error: true, children: "Invalid level ID" } },
          ],
        },
      })
    },
  })

export type LevelProps =
  | (Pick<LevelModel, "id"> &
      (
        | (BlocklyProps & { mode: "blockly" })
        | (PythonProps & { mode: "python" })
        | (BlocklyProps & PythonProps & { mode: "blocklyAndPython" })
      ))
  | {}

const Level: FC<LevelProps> = level =>
  "id" in level ? (
    level.mode === "blockly" ? (
      <BlocklyContext {...level}>
        <Base {...level} />
      </BlocklyContext>
    ) : level.mode === "python" ? (
      <PythonContext {...level}>
        <Base {...level} />
      </PythonContext>
    ) : (
      // blocklyAndPython
      <BlocklyContext {...level}>
        <PythonContext {...level}>
          <Base {...level} />
        </PythonContext>
      </BlocklyContext>
    )
  ) : (
    <Custom />
  )

export default Level
