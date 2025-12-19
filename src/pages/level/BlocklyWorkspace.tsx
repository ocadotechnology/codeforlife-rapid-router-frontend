import "blockly/blocks"
import * as Blockly from "blockly/core"
import * as en_default from "blockly/msg/en"
import { Box, debounce } from "@mui/material"
import {
  type FC,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react"

import { useAppDispatch, useLevelToolbox, useSettings } from "../../app/hooks"
import Interpreter from "./blockly/interpreter"
import { type WorkspaceSvg } from "blockly/core"

import * as en_custom from "./blockly/messages/en"
import { registerCustomBlockDefinitions } from "./blockly/blocks"
import { useLevelContext } from "./LevelContext"

export type ToolboxItemInfo = Blockly.utils.toolbox.ToolboxItemInfo

export interface BlocklyWorkspaceProps {}

const RESIZE_DEBOUNCE_MS = 10
const LOCAL_STORAGE_KEY = "blockly-workspace-state"

const BlocklyWorkspace: FC<BlocklyWorkspaceProps> = () => {
  const { blocklyWorkspaceRef } = useLevelContext()!
  const toolboxContents = useLevelToolbox()
  const divRef = useRef<HTMLDivElement | null>(null)
  const [workspace, setWorkspace] = useState<WorkspaceSvg | null>(null)
  const [interpreter, setInterpreter] = useState<Interpreter | null>(null)
  const { playSpeed } = useSettings()
  const dispatch = useAppDispatch()

  useImperativeHandle(blocklyWorkspaceRef, () => {
    return {
      resize: debounce(() => {
        if (workspace) Blockly.svgResize(workspace)
      }, RESIZE_DEBOUNCE_MS),
      play: () => {
        if (workspace && interpreter) {
          interpreter.setSpeed(playSpeed)
          interpreter.interpretBlocks(workspace.getTopBlocks())
          interpreter.play()
        }
      },
      step: () => {
        if (workspace && interpreter) {
          interpreter.interpretBlocks(workspace.getTopBlocks())
          interpreter.step()
        }
      },
      stop: () => {
        if (workspace && interpreter) interpreter.stop()
      },
    }
  }, [interpreter, playSpeed, workspace])

  // Workspace creation
  useEffect(() => {
    if (!divRef.current) return
    // @ts-expect-error Locale type isn't inferred correctly after export
    Blockly.setLocale({ ...en_default, ...en_custom })
    registerCustomBlockDefinitions()
    const newWorkspace = Blockly.inject(divRef.current, {
      toolbox: { kind: "flyoutToolbox", contents: toolboxContents },
      trashcan: true,
    })
    setInterpreter(
      new Interpreter(dispatch, (blockId: string) =>
        newWorkspace.highlightBlock(blockId),
      ),
    )
    const state = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (state) {
      Blockly.serialization.workspaces.load(
        JSON.parse(state) as { [key: string]: any },
        newWorkspace,
      )
    }
    if (!newWorkspace.getTopBlocks().some(b => b.type === "start")) {
      newWorkspace.newBlock("start").setDeletable(false)
    }
    setWorkspace(newWorkspace)
    return () => {
      const state = Blockly.serialization.workspaces.save(newWorkspace)
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state))
      newWorkspace.dispose()
    }
  }, [dispatch, divRef, toolboxContents])

  return (
    <Box
      component={"div"}
      id="blockly-workspace"
      ref={divRef}
      sx={{ height: "100%" }}
    />
  )
}

export default BlocklyWorkspace
