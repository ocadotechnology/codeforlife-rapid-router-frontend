import * as yup from "yup"
import { Box, Typography } from "@mui/material"
import { type FC, useRef, useState } from "react"
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels"
import DragIndicatorIcon from "@mui/icons-material/DragIndicator"
import { useParamsRequired } from "codeforlife/hooks"

import BlocklyWorkspace, {
  type BlocklyWorkspaceHandle,
} from "./BlocklyWorkspace"
import Controls from "./Controls"
import { paths } from "../../routes"
import { useSettings } from "../../app/hooks"

export interface LevelProps {}

interface LevelState {
  panels: 2 | 3
}

const Level: FC<LevelProps> = () => {
  const [level] = useState<LevelState>({
    panels: 2,
  })

  const settings = useSettings()
  const blocklyHandle = useRef<BlocklyWorkspaceHandle | null>(null)

  return useParamsRequired({
    shape: { id: yup.number().required().min(1) },
    children: () => (
      <Box sx={{ display: "flex" }}>
        <Controls />
        <Box component="main" sx={{ flexGrow: 1 }}>
          {/* TODO: fix style */}
          <PanelGroup
            direction="horizontal"
            style={{ height: "100vh", width: "100%" }}
            onLayout={() => {
              // Trigger Blockly workspace resize after layout change
              if (blocklyHandle.current) {
                blocklyHandle.current.resize()
              }
            }}
          >
            <Panel
              id="blockly-panel"
              style={{ width: "100%" }}
              defaultSize={50}
              minSize={20}
            >
              <BlocklyWorkspace
                ref={blocklyHandle}
                toolboxContents={[
                  { kind: "block", type: "logic_compare" },
                  { kind: "block", type: "logic_compare" },
                  { kind: "block", type: "logic_compare" },
                ]}
              />
            </Panel>
            {/* TODO: fix style */}
            <PanelResizeHandle
              style={{
                color: "#000",
                border: "1px solid gray",
                outline: "none",
                flex: "0 0 .5rem",
                justifyContent: "center",
                alignItems: "center",
                display: "flex",
              }}
            >
              <DragIndicatorIcon />
            </PanelResizeHandle>
            <Panel defaultSize={50} minSize={20}>
              <Typography>Settings: {JSON.stringify(settings)}</Typography>
              <Typography>Level state: {JSON.stringify(level)}</Typography>
            </Panel>
          </PanelGroup>
        </Box>
      </Box>
    ),
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
}

export default Level
