const CHARACTER_NAME = "Van"

const startBlock = (characterName: string) => ({
  type: "start",
  tooltip: "%{BKY_START_TOOLTIP}",
  colour: 50,
  deletable: false,
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

export default [startBlock(CHARACTER_NAME)]
