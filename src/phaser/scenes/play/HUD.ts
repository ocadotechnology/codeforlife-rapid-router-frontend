import Phaser from "phaser"

import { Scenes } from "."

/**
 * The HUD (Heads-Up Display) Scene is responsible for displaying game
 * information such as score, health, and other relevant data to the player.
 * It typically runs in parallel with the main gameplay scene and is designed to
 * be non-intrusive, allowing players to focus on the game while still providing
 * essential information at a glance.
 */
export default class extends Phaser.Scene {
  constructor() {
    super(Scenes.HUD)
  }

  create() {
    // This text will stay glued to the bottom-right of the screen.
    this.add
      .text(
        this.cameras.main.width - 20,
        this.cameras.main.height - 20,
        "Remaining Fuel: 100",
        { font: "24px Arial", color: "#ffffff" },
      )
      .setOrigin(1, 1)
  }
}
