import BaseBoot from "../BaseBoot"
import { Scenes } from "../../enums"

/**
 * The Boot Scene is the first scene that runs when the game starts. It is
 * responsible for loading any assets that are required for the Preloader Scene,
 * such as a game logo or background. The Boot Scene itself does not have a
 * preloader, so it is important to keep the assets loaded in this scene as
 * small as possible to ensure a fast startup time.
 */
export default class extends BaseBoot {
  constructor() {
    super(Scenes.Create.BOOT)
  }

  create() {
    // Start preloading the assets.
    this.scene.start(Scenes.Create.PRELOADER)
  }
}
