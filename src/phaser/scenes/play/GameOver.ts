import { Scene } from "phaser"

/**
 * The GameOver Scene is responsible for displaying a game over message and
 * providing the player with an option to reset the game. This scene is launched
 * when the player fails a level. It serves as a transition point between the
 * end of one game session and the start of a new one, allowing players to see
 * where they went wrong before resetting the game objects.
 */
export default class extends Scene {
  constructor() {
    super("GameOver")
  }

  create() {
    this.cameras.main.setBackgroundColor("#000000").setAlpha(0.25)

    this.add
      .text(512, 300, "WRONG WAY!", {
        fontFamily: "Arial Black",
        fontSize: 64,
        color: "#ffffff",
      })
      .setOrigin(0.5)

    this.add
      .text(512, 450, "Click to Reset", {
        fontFamily: "Arial",
        fontSize: 32,
        color: "#ffff00",
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => {
        // Manually stop the paused HUD to completely wipe its state from memory.
        this.scene.stop("HUD")
        // Start a new Gameplay scene - this destroys the paused Gameplay scene.
        this.scene.start("Gameplay")
      })
  }
}
