import * as Blockly from "blockly/core"
import * as en_default from "blockly/msg/en"
import { debounce } from "@mui/material"

import * as en_custom from "./messages/en"
import {
  COMMAND_BLOCK_TYPES,
  CUSTOM_BLOCKS,
  type CommandBlockType,
  START_BLOCK_TYPES,
  type StartBlockType,
} from "./blocks"
import type { GameCommand } from "../app/slices"

export type BlockDefinition<T extends string> = {
  type: T
  tooltip?: string
  colour: number
  message0: string
  args0: Array<
    | {
        type: "field_label"
        text: string
      }
    | {
        type: "field_image"
        src: string
        width: number
        height: number
        alt: string
        flipRtl: "FALSE" | "TRUE"
      }
    | {
        type: "input_dummy"
        name: string
      }
    | {
        type: "field_dropdown"
        name: string
        options: Array<[string, string]>
      }
  >
  output?: string
  previousStatement?: string | null
  nextStatement?: string | null
}

const BLOCK_TYPES: string[] = []

export function defineBlock<T extends string>({
  type,
  ...remainingBlockDefinition
}: BlockDefinition<T>): BlockDefinition<T> {
  if (BLOCK_TYPES.includes(type))
    throw Error(`Block type: "${type}" is already defined.`)
  BLOCK_TYPES.push(type)

  return { type, ...remainingBlockDefinition }
}

let ALREADY_REGISTERED = false

export function registerCustomBlockDefinitions() {
  if (ALREADY_REGISTERED) return
  ALREADY_REGISTERED = true

  Blockly.common.defineBlocks(
    Blockly.common.createBlockDefinitionsFromJsonArray(CUSTOM_BLOCKS),
  )
}

function initializeStartBlock(
  workspace: Blockly.WorkspaceSvg,
  startBlockType: StartBlockType,
) {
  let startBlock: Blockly.BlockSvg | undefined
  for (const block of workspace.getAllBlocks()) {
    const blockType = block.type as StartBlockType
    if (START_BLOCK_TYPES.includes(blockType)) {
      if (blockType === startBlockType && !startBlock) startBlock = block
      else block.dispose(false, false)
    }
  }

  if (!startBlock) startBlock = workspace.newBlock(startBlockType)
  if (startBlock.isDeletable()) startBlock.setDeletable(false)

  return startBlock
}

export function initializeWorkspace(
  div: HTMLDivElement,
  startBlockType: StartBlockType,
  toolboxContents: Blockly.utils.toolbox.ToolboxItemInfo[],
) {
  // @ts-expect-error Locale type isn't inferred correctly after export
  Blockly.setLocale({ ...en_default, ...en_custom })

  registerCustomBlockDefinitions()

  const workspace = Blockly.inject(div, {
    toolbox: { kind: "flyoutToolbox", contents: toolboxContents },
    trashcan: true,
  })

  loadWorkspaceState(workspace)

  initializeStartBlock(workspace, startBlockType)

  return workspace
}

const LOCAL_STORAGE_KEY = "blockly-workspace-state"

export function saveWorkspaceState(workspace: Blockly.WorkspaceSvg) {
  const state = Blockly.serialization.workspaces.save(workspace)
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state))
}

export function loadWorkspaceState(workspace: Blockly.WorkspaceSvg) {
  const rawState = localStorage.getItem(LOCAL_STORAGE_KEY)
  if (!rawState) return

  const state = JSON.parse(rawState) as ReturnType<
    typeof Blockly.serialization.workspaces.save
  >
  Blockly.serialization.workspaces.load(state, workspace)
}

export function resizeWorkspace(
  workspace: Blockly.WorkspaceSvg,
  debounceMs = 10,
) {
  return debounce(() => {
    Blockly.svgResize(workspace)
  }, debounceMs)
}

/**
 * Convert workspace blocks to game commands, defaulting to "wait" for unknown
 * blocks.
 * @param workspace the Blockly workspace containing the blocks.
 * @returns an array of game commands for each block in the workspace.
 */
export function blocksToGameCommands(
  workspace: Blockly.WorkspaceSvg,
): GameCommand[] {
  return workspace.getTopBlocks(true).map(block => {
    const blockType = block.type as CommandBlockType
    return COMMAND_BLOCK_TYPES.includes(blockType) ? blockType : "wait"
  })
}
