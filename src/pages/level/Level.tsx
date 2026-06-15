import * as yup from "yup"
import { type FC, useRef } from "react"
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

type DefinedLevelProps = Pick<
  LevelModel,
  "id" | "mode" | "blockly_toolbox_block_types"
>

const DefinedLevel: FC<DefinedLevelProps> = ({
  id,
  mode,
  blockly_toolbox_block_types,
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
      <Box sx={{ display: "flex" }}>
        <Controls level={{ mode }} />
        {/* TODO: fix style*/}
        <Box component="main" sx={{ flex: 1, minWidth: 0, height: "100vh" }}>
          <Panels level={{ id, mode }} />
        </Box>
      </Box>
    </BlocklyWorkspaceContext.Provider>
  )
}

const InnerCustomLevel: FC<Pick<LevelModel, "id">> = ({ id }) =>
  handleResultState(useRetrieveLevelQuery(id), level => (
    <DefinedLevel {...level} />
  ))

const CustomLevel: FC = () =>
  useParamsRequired({
    shape: { id: yup.number().required().min(1) },
    children: ({ id }) => <InnerCustomLevel id={id} />,
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

export type LevelProps = DefinedLevelProps | {}

const Level: FC<LevelProps> = level =>
  "id" in level ? <DefinedLevel {...level} /> : <CustomLevel />

export default Level
