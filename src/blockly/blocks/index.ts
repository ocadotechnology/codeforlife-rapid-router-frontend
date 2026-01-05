import * as booleans from "./booleans"
import * as commands from "./commands"
import * as defaults from "./defaults"
import * as starts from "./starts"
import { type BlockDefinition } from "../utils"

export { booleans, commands, defaults, starts }

export const CUSTOM_BLOCKS: BlockDefinition<any>[] = [
  // booleans
  booleans.ROAD_EXISTS_BLOCK,
  booleans.TRAFFIC_LIGHT_BLOCK,
  booleans.DEAD_END_BLOCK,
  booleans.AT_DESTINATION_BLOCK,
  booleans.COW_CROSSING_BLOCK,
  booleans.PIGEON_CROSSING_BLOCK,
  // commands
  commands.MOVE_FORWARDS_BLOCK,
  commands.TURN_LEFT_BLOCK,
  commands.TURN_RIGHT_BLOCK,
  commands.TURN_AROUND_BLOCK,
  commands.WAIT_BLOCK,
  commands.DELIVER_BLOCK,
  commands.SOUND_HORN_BLOCK,
  // starts
  starts.VAN_BLOCK,
]

export type BlockType =
  | booleans.BooleanBlockType
  | commands.CommandBlockType
  | defaults.DefaultBlockType
  | starts.StartBlockType
