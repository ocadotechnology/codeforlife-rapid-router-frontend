// TODO: make general util
// import { path as _ } from "codeforlife/utils/router"

import * as TilesetUtils from "./utils/tileset"
import type { DeepNumbersOf, DeepStringsOf } from "./utils/general"

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

export const Scenes = {
  Create: {
    BOOT: "Boot",
    PRELOADER: "Preloader",
    LEVEL: "Level",
  },
  Play: {
    BOOT: "Boot",
    PRELOADER: "Preloader",
    LEVEL: "Level",
    HUD: "HUD",
    GAME_OVER: "GameOver",
  },
} as const
export type Scene = DeepStringsOf<typeof Scenes>
export type CreateScene = DeepStringsOf<typeof Scenes.Create>
export type PlayScene = DeepStringsOf<typeof Scenes.Play>

export const SVGs = {
  LOGO: "logo",
  Background: {
    GRASS: "grass",
    PAVEMENT: "pavement",
    SNOW: "snow",
  },
  Obstacles: {
    PIGEON: "pigeon",
    TrafficLight: {
      RED: "trafficLight.red",
      GREEN: "trafficLight.green",
    },
  },
  Road: {
    Asphalt: {
      CROSSROADS: "asphalt.crossroads",
      DEAD_END: "asphalt.deadEnd",
      STRAIGHT: "asphalt.straight",
      T_JUNCTION: "asphalt.TJunction",
      TURN: "asphalt.turn",
    },
    Dirt: {
      CROSSROADS: "dirt.crossroads",
      DEAD_END: "dirt.deadEnd",
      STRAIGHT: "dirt.straight",
      T_JUNCTION: "dirt.TJunction",
      TURN: "dirt.turn",
    },
  },
  Scenery: {
    City: {
      BUSH: "city.bush",
      HOSPITAL: "city.hospital",
      HOUSE: "city.house",
      SCHOOL: "city.school",
      SHOP: "city.shop",
      SOLAR_PANEL: "city.solarPanel",
    },
    Farm: {
      BUSH: "farm.bush",
      CFC_BLACK: "farm.cfcBlack",
      CFC: "farm.cfc",
      CROPS: "farm.crops",
      HOUSE1: "farm.house1",
      HOUSE2: "farm.house2",
      SOLAR_PANEL: "farm.solarPanel",
      TREE1: "farm.tree1",
      TREE2: "farm.tree2",
    },
    Grass: {
      BUSH: "grass.bush",
      CFC: "grass.cfc",
      HOUSE: "grass.house",
      POND: "grass.pond",
      SOLAR_PANEL: "grass.solarPanel",
      TREE1: "grass.tree1",
      TREE2: "grass.tree2",
    },
    Snow: {
      BARN: "snow.barn",
      BUSH: "snow.bush",
      CFC: "snow.cfc",
      CROPS: "snow.crops",
      HOSPITAL: "snow.hospital",
      HOUSE1: "snow.house1",
      HOUSE2: "snow.house2",
      HOUSE3: "snow.house3",
      POND: "snow.pond",
      SCHOOL: "snow.school",
      SHOP: "snow.shop",
      SOLAR_PANEL: "snow.solarPanel",
      TREE1: "snow.tree1",
      TREE2: "snow.tree2",
    },
  },
} as const
export type SVG = DeepStringsOf<typeof SVGs>
export type BackgroundSVG = DeepStringsOf<typeof SVGs.Background>
export type RoadSVG = DeepStringsOf<typeof SVGs.Road>
export type ObstacleSVG = DeepStringsOf<typeof SVGs.Obstacles>
export type ScenerySVG = DeepStringsOf<typeof SVGs.Scenery>

/**
 * Tilesets are defined in a way that allows us to easily map numeric tile IDs
 * from the Tiled map editor to descriptive string paths that we can use to
 * reference the corresponding assets in our code. The `setIDs` function takes
 * care of converting the nested object structure into a flat mapping of string
 * paths to numeric IDs, while also ensuring type safety.
 *
 * WARNING: The numeric IDs assigned to each tileset must match the tile IDs
 * used in the Tiled map editor. 🚫You should not recycle numeric IDs🚫 across
 * different tilesets, as this can lead to confusion and bugs when referencing
 * tiles in the code. Each unique tile in Tiled should have a unique numeric ID
 * in this mapping.
 */
export const Tilesets = TilesetUtils.setIDs({
  0: "EMPTY", // Phaser treats 0 as a special "empty" tile.
  1: { Background: "GRASS" },
  2: { Background: "SNOW" },
  3: { Background: "PAVEMENT" },
  4: { Obstacles: "PIGEON" },
  5: { Obstacles: { TrafficLight: "RED" } },
  6: { Obstacles: { TrafficLight: "GREEN" } },
  7: { Road: { Asphalt: "STRAIGHT" } },
  8: { Road: { Asphalt: "TURN" } },
  9: { Road: { Asphalt: "T_JUNCTION" } },
  10: { Road: { Asphalt: "CROSSROADS" } },
  11: { Road: { Asphalt: "DEAD_END" } },
  12: { Road: { Dirt: "STRAIGHT" } },
  13: { Road: { Dirt: "TURN" } },
  14: { Road: { Dirt: "T_JUNCTION" } },
  15: { Road: { Dirt: "CROSSROADS" } },
  16: { Road: { Dirt: "DEAD_END" } },
  17: { Scenery: { City: "BUSH" } },
  18: { Scenery: { City: "HOSPITAL" } },
  19: { Scenery: { City: "HOUSE" } },
  20: { Scenery: { City: "SCHOOL" } },
  21: { Scenery: { City: "SHOP" } },
  22: { Scenery: { City: "SOLAR_PANEL" } },
  23: { Scenery: { Farm: "BUSH" } },
  24: { Scenery: { Farm: "CFC_BLACK" } },
  25: { Scenery: { Farm: "CFC" } },
  26: { Scenery: { Farm: "CROPS" } },
  27: { Scenery: { Farm: "HOUSE1" } },
  28: { Scenery: { Farm: "HOUSE2" } },
  29: { Scenery: { Farm: "SOLAR_PANEL" } },
  30: { Scenery: { Farm: "TREE1" } },
  31: { Scenery: { Farm: "TREE2" } },
  32: { Scenery: { Grass: "BUSH" } },
  33: { Scenery: { Grass: "CFC" } },
  34: { Scenery: { Grass: "HOUSE" } },
  35: { Scenery: { Grass: "POND" } },
  36: { Scenery: { Grass: "SOLAR_PANEL" } },
  37: { Scenery: { Grass: "TREE1" } },
  38: { Scenery: { Grass: "TREE2" } },
  39: { Scenery: { Snow: "BARN" } },
  40: { Scenery: { Snow: "BUSH" } },
  41: { Scenery: { Snow: "CFC" } },
  42: { Scenery: { Snow: "CROPS" } },
  43: { Scenery: { Snow: "HOSPITAL" } },
  44: { Scenery: { Snow: "HOUSE1" } },
  45: { Scenery: { Snow: "HOUSE2" } },
  46: { Scenery: { Snow: "HOUSE3" } },
  47: { Scenery: { Snow: "POND" } },
  48: { Scenery: { Snow: "SCHOOL" } },
  49: { Scenery: { Snow: "SHOP" } },
  50: { Scenery: { Snow: "SOLAR_PANEL" } },
  51: { Scenery: { Snow: "TREE1" } },
  52: { Scenery: { Snow: "TREE2" } },
} as const)
export type Tileset = DeepNumbersOf<typeof Tilesets>
export type BackgroundTileset =
  | typeof Tilesets.EMPTY
  | DeepNumbersOf<typeof Tilesets.Background>
export type RoadTileset =
  | typeof Tilesets.EMPTY
  | DeepNumbersOf<typeof Tilesets.Road>
export type ObstacleTileset =
  | typeof Tilesets.EMPTY
  | DeepNumbersOf<typeof Tilesets.Obstacles>
export type SceneryTileset =
  | typeof Tilesets.EMPTY
  | DeepNumbersOf<typeof Tilesets.Scenery>
