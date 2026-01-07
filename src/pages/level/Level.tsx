import * as yup from "yup"
import { type FC, useRef } from "react"
import { Box } from "@mui/material"
// import { handleResultState } from "codeforlife/utils/api"
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

export interface LevelProps {}

const InnerLevel: FC<Pick<LevelModel, "id">> = ({ id }) => {
  const blocklyWorkspaceRef = useRef<BlocklyWorkspaceRef>(null)
  // TODO: swap these when pulling from the API
  // const result = useRetrieveLevelQuery(id)
  const level = useRetrieveLevelQuery(id)

  // TODO: swap these when pulling from the API
  // return handleResultState(result, level => (
  return (
    <BlocklyWorkspaceContext.Provider
      value={{
        ref: blocklyWorkspaceRef,
        toolboxContents: level.blockly_toolbox_block_types.map(type => ({
          kind: "block",
          type,
        })),
      }}
    >
      <Box sx={{ display: "flex" }}>
        <Controls panelCount={level.panel_count} />
        {/* TODO: fix style*/}
        <Box component="main" sx={{ height: "100vh" }}>
          <Panels count={level.panel_count} />
        </Box>
      </Box>
    </BlocklyWorkspaceContext.Provider>
  )
}

const Level: FC<LevelProps> = () =>
  useParamsRequired({
    shape: { id: yup.number().required().min(1) },
    children: ({ id }) => <InnerLevel id={id} />,
    onValidationSuccess: params => {
      console.log(`Level ID from URL: ${params.id}`)
      // TODO: call API
    },
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

export default Level
