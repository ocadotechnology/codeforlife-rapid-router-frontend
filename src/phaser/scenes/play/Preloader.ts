import BasePreloader from "../BasePreloader"
import Level from "./Level"
import type { OrthogonalTilemap } from "../../tilemaps"
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

    void this.lazyLoadTilemap()
  }

  async lazyLoadTilemap() {
    // Get the level ID from the registry.
    const levelId = this.game.registry.get(Variables.LEVEL_ID) as number

    // Dynamically import the tilemap JSON file based on the level ID.
    const { default: tilemap } = (await import(
      `../../tilemaps/level${levelId}`
    )) as { default: OrthogonalTilemap }

    this.loadTilemap(tilemap)

    this.startLevel(Level)
  }
}
