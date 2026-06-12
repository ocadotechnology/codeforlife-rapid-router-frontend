import Phaser from "phaser"

import BaseLevel, { type BaseLevelData } from "../BaseLevel"
import { Events, Variables } from "../../globals"
import type { GameCommand } from "../../../app/slices"
import HUD from "./HUD"

export interface LevelData extends BaseLevelData {}

/**
 * The Gameplay Scene is the main scene where the core game mechanics and
 * interactions take place. The Gameplay Scene is responsible for managing the
 * game world, handling player input, updating game objects, and implementing
 * the game logic. It typically runs in parallel with the HUD Scene, which
 * displays essential information to the player without interfering with the
 * gameplay experience.
 */
export default class extends BaseLevel<LevelData> {
  private commands: GameCommand[] = []

  create() {
    super.create()

    // Listen for updates to the game commands.
    const getCommands = () => this.getCommands()
    this.game.events.on(Events.SET_COMMANDS, getCommands)
    this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.game.events.off(Events.SET_COMMANDS, getCommands)
    })

    // WARN: This must come after the objects have been added!
    // Launch the HUD scene in parallel with the Gameplay scene. Phaser dictates
    // the visual stacking order (z-index) based on the order scenes are
    // initialized. By having this scene launch the HUD scene after the level is
    // built, the HUD is naturally drawn on top.
    this.scene.launch(HUD.KEY)

    // WARN: This must come last!
    this.game.events.emit(Events.GAMEPLAY_SCENE_READY)
  }

  // @ts-expect-error will be used in the future
  private pause() {
    this.scene.pause(HUD.KEY)
    this.scene.pause()
  }

  private getCommands() {
    this.commands = this.game.registry.get(Variables.COMMANDS) as GameCommand[]
  }

  // @ts-expect-error will be used in the future
  private runCommands() {
    // TODO: Implement the logic to process the character commands and update
    // the game state accordingly.
    console.log(this.commands)
  }
}
