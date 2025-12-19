import type { BlockDefinition } from "./definition"
import deliverIcon from "../../../../images/blocks/deliver.svg"
import emptyIcon from "../../../../images/blocks/empty.svg"
import moveForwardsIcon from "../../../../images/blocks/move_forwards.svg"
import turnAroundIcon from "../../../../images/blocks/turn_around.svg"
import turnLeftIcon from "../../../../images/blocks/turn_left.svg"
import turnRightIcon from "../../../../images/blocks/turn_right.svg"
import waitIcon from "../../../../images/blocks/wait.svg"

const BLOCK_COLOUR = 160,
  BLOCK_IMAGE_WIDTH = 15,
  BLOCK_IMAGE_HEIGHT = 15

const actionBlock = (type: string, icon: string): BlockDefinition => ({
  type,
  tooltip: `%{BKY_${type.toLocaleUpperCase()}_TOOLTIP}`,
  colour: BLOCK_COLOUR,
  message0: `%{BKY_${type.toLocaleUpperCase()}_TITLE} %1 %2`,
  args0: [
    {
      type: "field_image",
      src: icon,
      width: BLOCK_IMAGE_WIDTH,
      height: BLOCK_IMAGE_HEIGHT,
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

export const MOVE_FORWARDS = actionBlock("move_forwards", moveForwardsIcon)
export const TURN_LEFT = actionBlock("turn_left", turnLeftIcon)
export const TURN_RIGHT = actionBlock("turn_right", turnRightIcon)
export const TURN_AROUND = actionBlock("turn_around", turnAroundIcon)
export const WAIT = actionBlock("wait", waitIcon)
export const DELIVER = actionBlock("deliver", deliverIcon)
export const SOUND_HORN = actionBlock("sound_horn", emptyIcon)
