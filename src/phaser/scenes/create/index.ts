import Boot from "./Boot"
import HUD from "./HUD"
import Level from "./Level"
import Preloader from "./Preloader"

// IMPORTANT: Phaser renders scenes in _scenes array order (last = on top).
// HUD must come after Level so it renders on top of the level content.
export default [Boot, Preloader, Level, HUD]
