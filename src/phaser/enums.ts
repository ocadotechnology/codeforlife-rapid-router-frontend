export const Events = {
  SET_COMMANDS: "set-commands",
  GAMEPLAY_SCENE_READY: "gameplay-scene-ready",
} as const
export type Events = (typeof Events)[keyof typeof Events]

export const Variables = {
  COMMANDS: "commands",
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
