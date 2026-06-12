// Define the dimensions of the tilemap. These constants ensure that all layers
// and tilesets are created with consistent dimensions, which is crucial for
// proper rendering and interaction in the game.
export const COLS = 10
export const ROWS = 8
export const TILE_WIDTH = 64
export const TILE_HEIGHT = 64
export const MAP_WIDTH = COLS * TILE_WIDTH
export const MAP_HEIGHT = ROWS * TILE_HEIGHT

export const Events = {
  SET_COMMANDS: "set-commands",
  SET_LEVEL_ID: "set-level-id",
  GAMEPLAY_SCENE_READY: "gameplay-scene-ready",
} as const
export type Event = (typeof Events)[keyof typeof Events]

export const Variables = {
  COMMANDS: "commands",
  LEVEL_ID: "levelId",
} as const
export type Variable = (typeof Variables)[keyof typeof Variables]
