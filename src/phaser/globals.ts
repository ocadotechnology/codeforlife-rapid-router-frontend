import { createIdRegistry } from "codeforlife/utils/object"

// Define the dimensions of the tilemap. These constants ensure that all layers
// and tilesets are created with consistent dimensions, which is crucial for
// proper rendering and interaction in the game.
export const COLS = 10
export const ROWS = 8
export const TILE_WIDTH = 64
export const TILE_HEIGHT = 64
export const MAP_WIDTH = COLS * TILE_WIDTH
export const MAP_HEIGHT = ROWS * TILE_HEIGHT

export const Events = createIdRegistry({
  "set-commands": "SET_COMMANDS",
  "set-level-id": "SET_LEVEL_ID",
  "gameplay-scene-ready": "GAMEPLAY_SCENE_READY",
  "add-road": "ADD_ROAD",
  "delete-road": "DELETE_ROAD",
  "drag-end": "DRAG_END",
} as const)
export type Event = (typeof Events)[keyof typeof Events]

export const Variables = createIdRegistry({
  commands: "COMMANDS",
  levelId: "LEVEL_ID",
} as const)
export type Variable = (typeof Variables)[keyof typeof Variables]
