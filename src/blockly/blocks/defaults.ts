// https://github.com/RaspberryPiFoundation/blockly/blob/blockly-v12.3.1/blocks/logic.ts

// Block for if/elseif/else condition.
export const IF_BLOCK_TYPE = "controls_if"

export const DEFAULT_BLOCK_TYPES = [IF_BLOCK_TYPE] as const
export type DefaultBlockType = (typeof DEFAULT_BLOCK_TYPES)[number]
