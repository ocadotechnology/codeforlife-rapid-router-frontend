import BasePreloader from "../BasePreloader"
import { Scenes } from "../../enums"

/**
 * The Preloader Scene is responsible for loading all the assets required for
 * the game. It typically displays a loading bar or progress indicator to inform
 * the player about the loading progress. Once all assets are loaded, the
 * Preloader Scene transitions to the Gameplay Scene.
 */
export default class extends BasePreloader {
  constructor() {
    super(Scenes.Play.PRELOADER)
  }

  preload() {
    //  Load the assets for the game - Replace with your own assets
    // this.load.setPath("assets")
    // this.load.image("logo", "logo.png")
    // this.load.image("star", "star.png")
  }

  create() {
    // When all the assets have loaded, it's often worth creating global objects
    // here that the rest of the game can use. For example, you can define
    // global animations here, so we can use them in other scenes.

    // Call the base class's create() method to perform any necessary cleanup.
    super.create()

    // Start the game.
    this.scene.start(Scenes.Play.LEVEL)
  }
}
