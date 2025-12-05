import cowIcon from "../../../../images/blocks/cow_crossing.svg"
import emptyIcon from "../../../../images/blocks/empty.svg"
import pigeonIcon from "../../../../images/blocks/pigeon_crossing.svg"

const DEFAULT_COLOUR = 210

const conditionDefinitions = [
  {
    type: "road_exists",
    colour: DEFAULT_COLOUR,
    message0: "%1 %2 %3",
    args0: [
      {
        type: "input_dummy",
        name: "DUMMY",
      },
      {
        type: "field_dropdown",
        name: "CHOICE",
        options: [
          ["%{BKY_ROAD_EXISTS_FORWARD_TITLE}", "FORWARD"],
          ["%{BKY_ROAD_EXISTS_LEFT_TITLE}", "LEFT"],
          ["%{BKY_ROAD_EXISTS_RIGHT_TITLE}", "RIGHT"],
        ],
      },
      {
        type: "field_image",
        src: emptyIcon,
        width: 30,
        height: 30,
        alt: "*",
        flipRtl: "FALSE",
      },
    ],
    output: "Boolean",
  },
  {
    type: "traffic_light",
    colour: DEFAULT_COLOUR,
    message0: "%1 %2 %3",
    args0: [
      {
        type: "input_dummy",
        name: "DUMMY",
      },
      {
        type: "field_dropdown",
        name: "CHOICE",
        options: [
          ["%{BKY_TRAFFIC_LIGHT_RED_TITLE}", "RED"],
          ["%{BKY_TRAFFIC_LIGHT_GREEN_TITLE}", "GREEN"],
        ],
      },
      {
        type: "field_image",
        src: emptyIcon,
        width: 30,
        height: 30,
        alt: "*",
        flipRtl: "FALSE",
      },
    ],
    output: "Boolean",
  },
  {
    type: "dead_end",
    colour: DEFAULT_COLOUR,
    message0: "%1 %2",
    args0: [
      {
        type: "field_label",
        text: "%{BKY_DEAD_END_TITLE}",
      },
      {
        type: "field_image",
        src: emptyIcon,
        width: 30,
        height: 30,
        alt: "*",
        flipRtl: "FALSE",
      },
    ],
    output: "Boolean",
  },
  {
    type: "at_destination",
    colour: DEFAULT_COLOUR,
    message0: "%1 %2",
    args0: [
      {
        type: "field_label",
        text: "%{BKY_AT_DESTINATION_TITLE}",
      },
      {
        type: "field_image",
        src: emptyIcon,
        width: 30,
        height: 30,
        alt: "*",
        flipRtl: "FALSE",
      },
    ],
    output: "Boolean",
  },
  {
    type: "cow_crossing",
    colour: DEFAULT_COLOUR,
    message0: "%1 %2",
    args0: [
      {
        type: "field_label",
        text: "%{BKY_COW_CROSSING_TITLE}",
      },
      {
        type: "field_image",
        src: cowIcon,
        width: 30,
        height: 30,
        alt: "*",
        flipRtl: "FALSE",
      },
    ],
    output: "Boolean",
  },
  {
    type: "pigeon_crossing",
    colour: DEFAULT_COLOUR,
    message0: "%1 %2",
    args0: [
      {
        type: "field_label",
        text: "%{BKY_PIGEON_CROSSING_TITLE}",
      },
      {
        type: "field_image",
        src: pigeonIcon,
        width: 30,
        height: 30,
        alt: "*",
        flipRtl: "FALSE",
      },
    ],
    output: "Boolean",
  },
]

export default conditionDefinitions
