import Phaser from "phaser"

import { Scenes } from "../../enums"

/**
 * The Level Creator Scene is responsible for providing a user interface and
 * tools for designing and creating game levels. This scene allows developers or
 * players to place game objects, set up the environment, and define the layout
 * of a level. It typically includes features such as a grid system, object
 * placement tools, and options for saving and loading created levels. The Level
 * Creator Scene is an essential part of the game development process, enabling
 * the creation of engaging and diverse gameplay experiences.
 */
export default class extends Phaser.Scene {
  constructor() {
    super(Scenes.Create.LEVEL_CREATOR)
  }

  create() {}
}
