import CreatePreloader from "./create/Preloader"

export const create = [CreatePreloader]

import PlayBoot from "./play/Boot"
import PlayPreloader from "./play/Preloader"
import PlayGameplay from "./play/Gameplay"
import PlayGameOver from "./play/GameOver"
import PlayHUD from "./play/HUD"

export const play = [
  PlayBoot,
  PlayPreloader,
  PlayHUD,
  PlayGameplay,
  PlayGameOver,
]
