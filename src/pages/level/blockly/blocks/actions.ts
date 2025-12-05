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

const actionBlock = (type: string, icon: string) => ({
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

const actionBlocks = [
  actionBlock("move_forwards", moveForwardsIcon),
  actionBlock("turn_left", turnLeftIcon),
  actionBlock("turn_right", turnRightIcon),
  actionBlock("turn_around", turnAroundIcon),
  actionBlock("wait", waitIcon),
  actionBlock("deliver", deliverIcon),
  actionBlock("sound_horn", emptyIcon),
]

export default actionBlocks
