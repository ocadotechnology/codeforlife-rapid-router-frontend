import BasePreloader from "../BasePreloader"
import Level from "./Level"

// Tilemaps TODO: remove
import level1 from "../../tilemaps/level1"

/**
 * The Preloader Scene is responsible for loading all the assets required for
 * the game. It typically displays a loading bar or progress indicator to inform
 * the player about the loading progress. Once all assets are loaded, the
 * Preloader Scene transitions to the Level Scene.
 */
export default class extends BasePreloader {
  preload() {
    this.loadTilemap(level1)
  }

  create() {
    this.startLevel(Level)
  }
}
