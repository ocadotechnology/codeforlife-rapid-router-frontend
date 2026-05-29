import { Scene } from "phaser"

/**
 * The Boot Scene is the first scene that runs when the game starts. It is
 * responsible for loading any assets that are required for the Preloader Scene,
 * such as a game logo or background. The Boot Scene itself does not have a
 * preloader, so it is important to keep the assets loaded in this scene as
 * small as possible to ensure a fast startup time.
 */
export default class extends Scene {
  constructor() {
    super("Boot")
  }

  preload() {
    // Load any assets required for the Preloader Scene here.
    // this.load.image("background", "assets/bg.png")
  }

  create() {
    // Start preloading the assets for the game.
    this.scene.start("Preloader")
  }
}
