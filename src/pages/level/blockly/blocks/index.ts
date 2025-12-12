import * as Blockly from "blockly/core"

import actionDefinitions from "./actions"
import conditionDefinitions from "./conditions"
import otherDefinitions from "./other"

export { ACTION_BLOCK_TYPES } from "./actions"

let alreadyRegistered = false

export const registerCustomBlockDefinitions = () => {
  if (alreadyRegistered) return
  const definitions = Blockly.common.createBlockDefinitionsFromJsonArray([
    ...actionDefinitions,
    ...conditionDefinitions,
    ...otherDefinitions,
  ])

  Blockly.common.defineBlocks(definitions)
  alreadyRegistered = true
}
