import Phaser from "phaser"
// import type { default as TiledMap } from "tiled-types"

import { Events, SVGs, Scenes, Variables } from "../../enums"
import BaseLevel from "../BaseLevel"
import type { GameCommand } from "../../../app/slices"

/**
 * The Gameplay Scene is the main scene where the core game mechanics and
 * interactions take place. The Gameplay Scene is responsible for managing the
 * game world, handling player input, updating game objects, and implementing
 * the game logic. It typically runs in parallel with the HUD Scene, which
 * displays essential information to the player without interfering with the
 * gameplay experience.
 */
export default class extends BaseLevel {
  // private mapData: TiledMap
  private commands: GameCommand[] = []
  private gameText!: Phaser.GameObjects.Text

  constructor() {
    super(Scenes.Play.LEVEL)
  }

  // init({ mapData }: { mapData: TiledMap }) {
  //   this.mapData = mapData
  // }

  create() {
    this.createTilemap({
      key: "level",
      backgroundTilesetNames: [
        SVGs.Background.GRASS,
        SVGs.Background.SNOW,
        SVGs.Background.Road.CROSSROADS,
        SVGs.Background.Road.DEAD_END,
        SVGs.Background.Road.STRAIGHT,
        SVGs.Background.Road.T_JUNCTION,
        SVGs.Background.Road.TURN,
      ],
      obstacleTilesetNames: [
        SVGs.Obstacles.PIGEON,
        SVGs.Obstacles.TrafficLight.RED,
        SVGs.Obstacles.TrafficLight.GREEN,
      ],
      sceneryObjectTypes: [SVGs.Scenery.TREE1, SVGs.Scenery.TREE2],
    })

    // Listen for updates to the game commands.
    const handleNewCommands = () => this.handleNewCommands()
    this.game.events.on(Events.SET_COMMANDS, handleNewCommands)
    this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.game.events.off(Events.SET_COMMANDS, handleNewCommands)
    })

    // WARN: This must come after the objects have been added!
    // Launch the HUD scene in parallel with the Gameplay scene. Phaser dictates
    // the visual stacking order (z-index) based on the order scenes are
    // initialized. By having this scene launch the HUD scene after the level is
    // built, the HUD is naturally drawn on top.
    this.scene.launch(Scenes.Play.HUD)

    // WARN: This must come last!
    this.game.events.emit(Events.GAMEPLAY_SCENE_READY)
  }

  private gameOver() {
    this.scene.pause(Scenes.Play.HUD)
    this.scene.pause()
    this.scene.launch(Scenes.Play.GAME_OVER)
  }

  private getCommands() {
    this.commands = this.game.registry.get(Variables.COMMANDS) as GameCommand[]
  }

  private handleNewCommands() {
    this.getCommands()
    this.runCommands()
  }

  private runCommands() {
    // TODO: Implement the logic to process the character commands and update
    // the game state accordingly.
  }
}
