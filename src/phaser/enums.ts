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
  Environment: {
    City: {
      HOSPITAL: "city.hospital",
      HOUSE: "city.house",
      SCHOOL: "city.school",
      SHOP: "city.shop",
      SOLAR_PANEL: "city.solarPanel",
    },
    Farm: {
      CFC_BLACK: "farm.cfcBlack",
      CFC: "farm.cfc",
      CROPS: "farm.crops",
      HOUSE1: "farm.house1",
      HOUSE2: "farm.house2",
      SOLAR_PANEL: "farm.solarPanel",
    },
    Grass: {
      CFC: "grass.cfc",
      HOUSE: "grass.house",
      SOLAR_PANEL: "grass.solarPanel",
    },
    Snow: {
      BARN: "snow.barn",
      CFC: "snow.cfc",
      CROPS: "snow.crops",
      HOSPITAL: "snow.hospital",
      HOUSE1: "snow.house1",
      HOUSE2: "snow.house2",
      HOUSE3: "snow.house3",
      SCHOOL: "snow.school",
      SHOP: "snow.shop",
      SOLAR_PANEL: "snow.solarPanel",
    },
    TrafficLight: {
      GREEN: "trafficLight.green",
      RED: "trafficLight.red",
    },
    PIGEON: "pigeon",
  },
  Scenery: {
    Snow: {
      BUSH: "snow.bush",
      POND: "snow.pond",
      TREE1: "snow.tree1",
      TREE2: "snow.tree2",
    },
    BUSH: "bush",
    HAY: "hay",
    POND: "pond",
    TREE1: "tree1",
    TREE2: "tree2",
  },
} as const
export type SVG = DeepStringsOf<typeof SVGs>
export type BackgroundSVG = DeepStringsOf<typeof SVGs.Background>
export type RoadSVG = DeepStringsOf<typeof SVGs.Road>
export type EnvironmentSVG = DeepStringsOf<typeof SVGs.Environment>
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
  4: { Road: { Asphalt: "STRAIGHT" } },
  5: { Road: { Asphalt: "TURN" } },
  6: { Road: { Asphalt: "T_JUNCTION" } },
  7: { Road: { Asphalt: "CROSSROADS" } },
  8: { Road: { Asphalt: "DEAD_END" } },
  9: { Road: { Dirt: "STRAIGHT" } },
  10: { Road: { Dirt: "TURN" } },
  11: { Road: { Dirt: "T_JUNCTION" } },
  12: { Road: { Dirt: "CROSSROADS" } },
  13: { Road: { Dirt: "DEAD_END" } },
  14: { Environment: { City: "HOSPITAL" } },
  15: { Environment: { City: "HOUSE" } },
  16: { Environment: { City: "SCHOOL" } },
  17: { Environment: { City: "SHOP" } },
  18: { Environment: { City: "SOLAR_PANEL" } },
  19: { Environment: { Farm: "CFC_BLACK" } },
  20: { Environment: { Farm: "CFC" } },
  21: { Environment: { Farm: "CROPS" } },
  22: { Environment: { Farm: "HOUSE1" } },
  23: { Environment: { Farm: "HOUSE2" } },
  24: { Environment: { Farm: "SOLAR_PANEL" } },
  25: { Environment: { Grass: "CFC" } },
  26: { Environment: { Grass: "HOUSE" } },
  27: { Environment: { Grass: "SOLAR_PANEL" } },
  28: { Environment: { Snow: "BARN" } },
  29: { Environment: { Snow: "CFC" } },
  30: { Environment: { Snow: "CROPS" } },
  31: { Environment: { Snow: "HOSPITAL" } },
  32: { Environment: { Snow: "HOUSE1" } },
  33: { Environment: { Snow: "HOUSE2" } },
  34: { Environment: { Snow: "HOUSE3" } },
  35: { Environment: { Snow: "SCHOOL" } },
  36: { Environment: { Snow: "SHOP" } },
  37: { Environment: { Snow: "SOLAR_PANEL" } },
  38: { Environment: { TrafficLight: "GREEN" } },
  39: { Environment: { TrafficLight: "RED" } },
  40: { Environment: "PIGEON" },
  41: { Scenery: { Snow: "BUSH" } },
  42: { Scenery: { Snow: "POND" } },
  43: { Scenery: { Snow: "TREE1" } },
  44: { Scenery: { Snow: "TREE2" } },
  45: { Scenery: "BUSH" },
  46: { Scenery: "HAY" },
  47: { Scenery: "POND" },
  48: { Scenery: "TREE1" },
  49: { Scenery: "TREE2" },
} as const)
export type Tileset = DeepNumbersOf<typeof Tilesets>
// NOTE: Background tiles cannot be empty.
export type BackgroundTileset = DeepNumbersOf<typeof Tilesets.Background>
export type RoadTileset =
  | typeof Tilesets.EMPTY
  | DeepNumbersOf<typeof Tilesets.Road>
export type EnvironmentTileset =
  | typeof Tilesets.EMPTY
  | DeepNumbersOf<typeof Tilesets.Environment>
export type SceneryTileset = DeepNumbersOf<typeof Tilesets.Scenery>
