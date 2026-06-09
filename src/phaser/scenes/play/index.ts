import Boot from "./Boot"
import GameOver from "./GameOver"
import HUD from "./HUD"
import Level from "./Level"
import Preloader from "./Preloader"

export const Scenes = {
  BOOT: "Boot",
  PRELOADER: "Preloader",
  LEVEL: "Level",
  HUD: "HUD",
  GAME_OVER: "GameOver",
} as const

export default [Boot, Preloader, HUD, Level, GameOver]
