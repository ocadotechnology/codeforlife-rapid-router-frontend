import Phaser from "phaser"
import type { TiledMap as Tilemap } from "tiled-types"

import BasePreloader from "../BasePreloader"
import Level from "./Level"
import { Variables } from "../../enums"

/**
 * The Preloader Scene is responsible for loading all the assets required for
 * the game. It typically displays a loading bar or progress indicator to inform
 * the player about the loading progress. Once all assets are loaded, the
 * Preloader Scene transitions to the Gameplay Scene.
 */
export default class extends BasePreloader {
  create() {
    // When all the assets have loaded, it's often worth creating global objects
    // here that the rest of the game can use. For example, you can define
    // global animations here, so we can use them in other scenes.

    // Call the base class's create() method to perform any necessary cleanup.
    super.create()

    void (async () => {
      const levelId = this.game.registry.get(Variables.LEVEL_ID) as number
      console.log("Preloader: Loading assets for level", levelId)
      const { default: data } = (await import(
        `../../tilemaps/level${levelId}`
      )) as { default: Tilemap }

      this.cache.tilemap.add("level", {
        format: Phaser.Tilemaps.Formats.TILED_JSON,
        data,
      })

      // TODO: Load tileset images.

      // Start the game.
      this.scene.start(Level.KEY)
    })()
  }
}
