export const Events = {
  SET_COMMANDS: "set-commands",
  SET_LEVEL_ID: "set-level-id",
  GAMEPLAY_SCENE_READY: "gameplay-scene-ready",
} as const
export type Events = (typeof Events)[keyof typeof Events]

export const Variables = {
  COMMANDS: "commands",
  LEVEL_ID: "levelId",
} as const
export type Variables = (typeof Variables)[keyof typeof Variables]

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
export type Scenes = (typeof Scenes)[keyof typeof Scenes]

export const SVGs = {
  LOGO: "logo",
  Background: {
    GRASS: "grass",
    SNOW: "snow",
  },
  Obstacles: {
    PIGEON: "pigeon",
    TrafficLight: {
      RED: "trafficLight.red",
      GREEN: "trafficLight.green",
    },
  },
  Scenery: {
    TREE1: "tree1",
    TREE2: "tree2",
  },
} as const
export type SVGs = (typeof SVGs)[keyof typeof SVGs]

export const Tilemaps = {
  LEVEL1: "level1",
} as const
export type Tilemaps = (typeof Tilemaps)[keyof typeof Tilemaps]

export const Tilesets = {
  EMPTY: 0,
  GRASS: 1,
  SNOW: 2,
  PIGEON: 3,
  TRAFFIC_LIGHT_RED: 4,
  TRAFFIC_LIGHT_GREEN: 5,
  TREE1: 6,
  TREE2: 7,
} as const
export type Tilesets = (typeof Tilesets)[keyof typeof Tilesets]
