import CreatePreload from "./create/Preload"

export const create = [CreatePreload]

import PlayBoot from "./play/Boot"
import PlayPreload from "./play/Preload"
import PlayGameplay from "./play/Gameplay"
import PlayGameOver from "./play/GameOver"
import PlayHUD from "./play/HUD"

export const play = [PlayBoot, PlayPreload, PlayHUD, PlayGameplay, PlayGameOver]
