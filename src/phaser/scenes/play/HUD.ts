import Phaser from "phaser"

import { Scenes } from "../../enums"

/**
 * The HUD (Heads-Up Display) Scene is responsible for displaying game
 * information such as score, health, and other relevant data to the player.
 * It typically runs in parallel with the main gameplay scene and is designed to
 * be non-intrusive, allowing players to focus on the game while still providing
 * essential information at a glance.
 */
export default class extends Phaser.Scene {
  private scoreText!: Phaser.GameObjects.Text

  constructor() {
    super(Scenes.Play.HUD)
  }

  create() {
    // This text will stay glued to the top-left of the screen.
    this.scoreText = this.add.text(20, 20, "Score: 0", {
      font: "24px Arial",
      color: "#ffffff",
    })
  }
}
