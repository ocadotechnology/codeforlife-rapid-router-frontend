export const Events = {
  SET_COMMANDS: "set-commands",
  GAMEPLAY_SCENE_READY: "gameplay-scene-ready",
} as const
export type Events = (typeof Events)[keyof typeof Events]

export const Variables = {
  COMMANDS: "commands",
} as const
export type Values = (typeof Variables)[keyof typeof Variables]

export const Scenes = {
  Create: {
    BOOT: "Boot",
    PRELOADER: "Preloader",
    LEVEL_CREATOR: "LevelCreator",
  },
  Play: {
    BOOT: "Boot",
    PRELOADER: "Preloader",
    GAMEPLAY: "Gameplay",
    HUD: "HUD",
    GAME_OVER: "GameOver",
  },
} as const
export type Scenes = (typeof Scenes)[keyof typeof Scenes]

export const SVGs = {
  LOGO: "logo",
} as const
export type SVGs = (typeof SVGs)[keyof typeof SVGs]
