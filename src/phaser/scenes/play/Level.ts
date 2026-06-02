import Phaser from "phaser"

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
  private commands: GameCommand[] = []
  private gameText!: Phaser.GameObjects.Text

  constructor() {
    super(Scenes.Play.LEVEL)
  }

  create() {
    // Add objects to the scene.
    this.add.image(512, 150, SVGs.LOGO)
    this.add
      .text(512, 250, "Click to trigger game over", {
        fontFamily: "Arial",
        fontSize: 32,
        color: "#000000",
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => this.gameOver())
    this.gameText = this.add
      .text(512, 500, "", {
        fontFamily: "Arial",
        fontSize: 32,
        color: "#000000",
      })
      .setOrigin(0.5)

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
    this.gameText.setText(JSON.stringify(this.commands, null, 2))
  }
}
