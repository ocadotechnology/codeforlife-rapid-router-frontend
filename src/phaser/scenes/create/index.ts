import Boot from "./Boot"
import Level from "./Level"
import Preloader from "./Preloader"

export const Scenes = {
  BOOT: "Boot",
  PRELOADER: "Preloader",
  LEVEL: "Level",
} as const

export default [Boot, Preloader, Level]
