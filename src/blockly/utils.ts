import * as Blockly from "blockly/core"

import { CUSTOM_BLOCKS } from "./blocks"

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
