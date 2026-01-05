import { type GameCommand } from "../../app/slices"
import { defineBlock } from "../utils"
import deliverIcon from "../../../../images/blocks/deliver.svg"
import emptyIcon from "../../../../images/blocks/empty.svg"
import moveForwardsIcon from "../../../../images/blocks/move_forwards.svg"
import turnAroundIcon from "../../../../images/blocks/turn_around.svg"
import turnLeftIcon from "../../../../images/blocks/turn_left.svg"
import turnRightIcon from "../../../../images/blocks/turn_right.svg"
import waitIcon from "../../../../images/blocks/wait.svg"

function defineCommandBlock<T extends GameCommand>(type: T, icon: string) {
  return defineBlock({
    type,
    tooltip: `%{BKY_${type.toLocaleUpperCase()}_TOOLTIP}`,
    colour: 160,
    message0: `%{BKY_${type.toLocaleUpperCase()}_TITLE} %1 %2`,
    args0: [
      {
        type: "field_image",
        src: icon,
        width: 15,
        height: 15,
        alt: "*",
        flipRtl: "FALSE",
      },
      {
        type: "input_dummy",
        name: "DUMMY",
      },
    ],
    previousStatement: null,
    nextStatement: null,
  })
}

export const MOVE_FORWARDS_BLOCK = defineCommandBlock(
  "moveForwards",
  moveForwardsIcon,
)
export const TURN_LEFT_BLOCK = defineCommandBlock("turnLeft", turnLeftIcon)
export const TURN_RIGHT_BLOCK = defineCommandBlock("turnRight", turnRightIcon)
export const TURN_AROUND_BLOCK = defineCommandBlock(
  "turnAround",
  turnAroundIcon,
)
export const WAIT_BLOCK = defineCommandBlock("wait", waitIcon)
export const DELIVER_BLOCK = defineCommandBlock("deliver", deliverIcon)
export const SOUND_HORN_BLOCK = defineCommandBlock("soundHorn", emptyIcon)

export const COMMAND_BLOCK_TYPES = [
  MOVE_FORWARDS_BLOCK.type,
  TURN_LEFT_BLOCK.type,
  TURN_RIGHT_BLOCK.type,
  TURN_AROUND_BLOCK.type,
  WAIT_BLOCK.type,
  DELIVER_BLOCK.type,
  SOUND_HORN_BLOCK.type,
] as const
export type CommandBlockType = (typeof COMMAND_BLOCK_TYPES)[number]
