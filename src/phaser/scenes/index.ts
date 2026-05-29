import CreateBoot from "./create/Boot"
import CreateLevelCreator from "./create/LevelCreator"
import CreatePreloader from "./create/Preloader"

export const create = [CreateBoot, CreatePreloader, CreateLevelCreator]

import PlayBoot from "./play/Boot"
import PlayGameOver from "./play/GameOver"
import PlayGameplay from "./play/Gameplay"
import PlayHUD from "./play/HUD"
import PlayPreloader from "./play/Preloader"

export const play = [
  PlayBoot,
  PlayPreloader,
  PlayHUD,
  PlayGameplay,
  PlayGameOver,
]
