import type { BlockDefinition } from "./definition"

const startBlock = (characterName: string): BlockDefinition => ({
  type: "start",
  tooltip: "%{BKY_START_TOOLTIP}",
  colour: 50,
  message0: "%{BKY_START_TITLE} %1 %2",
  args0: [
    {
      type: "field_image",
      src: new URL(
        `../../../../images/characters/top_view/${characterName}.svg`,
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

export const START_VAN = startBlock("Van")
