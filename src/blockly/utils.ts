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

export function defineBlock<T extends string>(
  blockDefinition: BlockDefinition<T>,
): BlockDefinition<T> {
  return blockDefinition
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

  if (!startBlock) {
    startBlock = workspace.newBlock(startBlockType)
    startBlock.initSvg()
    startBlock.render()
    startBlock.moveBy(10, 10)
  }
  if (startBlock.isDeletable()) startBlock.setDeletable(false)

  return startBlock
}

function initializeWorkspace(
  div: HTMLDivElement,
  toolboxContents: Blockly.utils.toolbox.ToolboxItemInfo[],
) {
  const workspace = Blockly.inject(div, {
    toolbox: { kind: "flyoutToolbox", contents: toolboxContents },
    trashcan: true,
  })

  loadWorkspaceState(workspace)

  return workspace
}

let DEFINED_CUSTOM_BLOCKS = false

export function initializeBlockly(
  div: HTMLDivElement,
  startBlockType: StartBlockType,
  toolboxContents: Blockly.utils.toolbox.ToolboxItemInfo[],
) {
  // @ts-expect-error Locale type isn't inferred correctly after export
  Blockly.setLocale({ ...en_default, ...en_custom })

  // Define custom blocks.
  if (!DEFINED_CUSTOM_BLOCKS) {
    Blockly.common.defineBlocks(
      Blockly.common.createBlockDefinitionsFromJsonArray(CUSTOM_BLOCKS),
    )
    DEFINED_CUSTOM_BLOCKS = true
  }

  // Override block selection visuals to disable them.
  Blockly.BlockSvg.prototype.addSelect = () => {}
  Blockly.BlockSvg.prototype.removeSelect = () => {}

  const workspace = initializeWorkspace(div, toolboxContents)

  const startBlock = initializeStartBlock(workspace, startBlockType)

  return { workspace, startBlock }
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
 * Convert the blocks connected to the given start block into game commands.
 * Non-command blocks are converted to "wait" commands.
 * @param startBlock The starting block to convert from.
 * @returns An array of game commands.
 */
export function getGameCommandsFromStartBlock(
  startBlock: Blockly.BlockSvg,
): GameCommand[] {
  if (!START_BLOCK_TYPES.includes(startBlock.type as StartBlockType))
    throw Error("Block is not one of the accepted start types.")

  return getNextBlocks(startBlock).map(block => {
    const blockType = block.type as CommandBlockType
    return COMMAND_BLOCK_TYPES.includes(blockType) ? blockType : "wait"
  })
}

export function getNextBlocks(block: Blockly.BlockSvg) {
  const blocks: Blockly.BlockSvg[] = []

  let currentBlock = block.getNextBlock()
  while (currentBlock) {
    blocks.push(currentBlock)
    currentBlock = currentBlock.getNextBlock()
  }

  return blocks
}
