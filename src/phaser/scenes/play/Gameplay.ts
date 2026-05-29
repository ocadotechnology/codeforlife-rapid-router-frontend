import { Scene } from "phaser"

/**
 * The Gameplay Scene is the main scene where the core game mechanics and
 * interactions take place. The Gameplay Scene is responsible for managing the
 * game world, handling player input, updating game objects, and implementing
 * the game logic. It typically runs in parallel with the HUD Scene, which
 * displays essential information to the player without interfering with the
 * gameplay experience.
 */
export default class extends Scene {
  private camera!: Phaser.Cameras.Scene2D.Camera
  // private background!: Phaser.GameObjects.Image
  private gameText!: Phaser.GameObjects.Text

  constructor() {
    super("Gameplay")
  }

  create() {
    this.camera = this.cameras.main

    this.add.image(512, 384, "logo")

    this.add
      .text(512, 500, "Click to trigger game over", {
        fontFamily: "Arial",
        fontSize: 32,
        color: "#000000",
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", this.gameOver, this)

    // WARN: This must come last!
    // Launch the HUD scene in parallel with the Gameplay scene. Phaser dictates
    // the visual stacking order (z-index) based on the order scenes are
    // initialized. By having this scene launch the HUD scene after the level is
    // built, the HUD is naturally drawn on top.
    this.scene.launch("HUD")
  }

  update(time: number, delta: number): void {
    // TODO: Add game logic here.
  }

  gameOver() {
    this.scene.pause("HUD")
    this.scene.pause()
    this.scene.launch("GameOver")
  }
}
