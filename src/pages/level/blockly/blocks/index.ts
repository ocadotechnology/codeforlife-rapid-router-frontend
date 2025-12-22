import * as Blockly from "blockly/core"

import * as actions from "./actions"
import * as conditions from "./conditions"
import * as other from "./other"

let ALREADY_REGISTERED = false

export const registerCustomBlockDefinitions = () => {
  if (ALREADY_REGISTERED) return
  ALREADY_REGISTERED = true

  Blockly.common.defineBlocks(
    Blockly.common.createBlockDefinitionsFromJsonArray([
      ...Object.values(actions),
      ...Object.values(conditions),
      ...Object.values(other),
    ]),
  )
}

export default { actions, conditions, other }
