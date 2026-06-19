import Phaser from "phaser"

import Button from "./Button"
import CustomGraphics from "./CustomGraphics"

Phaser.GameObjects.GameObjectFactory.register("button", Button)

Phaser.GameObjects.GameObjectFactory.register(
  "customGraphics",
  function (
    this: Phaser.GameObjects.GameObjectFactory,
  ): Phaser.GameObjects.CustomGraphics {
    return this.scene.add.existing(new CustomGraphics(this.scene))
  },
)
