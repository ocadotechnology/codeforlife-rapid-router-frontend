import Phaser from "phaser"

import { Events, SVGs, Variables } from "../../enums"
import BaseLevel from "../BaseLevel"
import type { GameCommand } from "../../../app/slices"
import { Scenes } from "."

/**
 * The Gameplay Scene is the main scene where the core game mechanics and
 * interactions take place. The Gameplay Scene is responsible for managing the
 * game world, handling player input, updating game objects, and implementing
 * the game logic. It typically runs in parallel with the HUD Scene, which
 * displays essential information to the player without interfering with the
 * gameplay experience.
 */
export default class extends BaseLevel {
  private commands: GameCommand[] = []

  constructor() {
    super(Scenes.LEVEL)
  }

  create() {
    this.createTilemap({
      key: "level",
      backgroundTilesetNames: [SVGs.Background.GRASS._],
      roadTilesetNames: [
        SVGs.Road.Asphalt.CROSSROADS._,
        SVGs.Road.Asphalt.DEAD_END._,
        SVGs.Road.Asphalt.STRAIGHT._,
        SVGs.Road.Asphalt.T_JUNCTION._,
        SVGs.Road.Asphalt.TURN._,
      ],
      environmentTilesetNames: [
        SVGs.Environment.Grass.CFC._,
        SVGs.Environment.Grass.HOUSE._,
        SVGs.Environment.Grass.SOLAR_PANEL._,
        SVGs.Environment.TrafficLight.RED._,
      ],
      sceneryObjectTypes: [
        SVGs.Scenery.BUSH._,
        SVGs.Scenery.POND._,
        SVGs.Scenery.TREE1._,
        SVGs.Scenery.TREE2._,
      ],
    })

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
    this.scene.launch(Scenes.HUD)

    // WARN: This must come last!
    this.game.events.emit(Events.GAMEPLAY_SCENE_READY)
  }

  private gameOver() {
    this.scene.pause(Scenes.HUD)
    this.scene.pause()
    this.scene.launch(Scenes.GAME_OVER)
  }

  private getCommands() {
    this.commands = this.game.registry.get(Variables.COMMANDS) as GameCommand[]
  }

  private runCommands() {
    // TODO: Implement the logic to process the character commands and update
    // the game state accordingly.
    console.log(this.commands)
  }
}
