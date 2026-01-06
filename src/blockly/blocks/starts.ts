import { defineBlock } from "../utils"

function defineStartBlock<T extends string>(type: T, imageName: string) {
  return defineBlock({
    type,
    tooltip: "%{BKY_START_TOOLTIP}",
    colour: 50,
    message0: "%{BKY_START_TITLE} %1 %2",
    args0: [
      {
        type: "field_image",
        src: new URL(
          `../../images/characters/top_view/${imageName}.svg`,
          import.meta.url,
        ).href,
        width: 30,
        height: 30,
        alt: "*",
        flipRtl: "FALSE",
      },
      {
        type: "input_dummy",
        name: "DUMMY",
      },
    ],
    nextStatement: null,
  })
}

export const VAN_BLOCK = defineStartBlock("van", "Van")

export const START_BLOCK_TYPES = [VAN_BLOCK.type] as const
export type StartBlockType = (typeof START_BLOCK_TYPES)[number]
