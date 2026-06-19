import * as layers from "../../layers"
import * as tilemaps from "../../tilemaps"
import * as tilesets from "../../tilesets"
import BasePreloader from "../BasePreloader"
import Level from "./Level"

/**
 * The Preloader Scene is responsible for loading all the assets required for
 * the game. It typically displays a loading bar or progress indicator to inform
 * the player about the loading progress. Once all assets are loaded, the
 * Preloader Scene transitions to the Level Scene.
 */
export default class extends BasePreloader {
  preload() {
    const tilemap = tilemaps.makeOrthogonal({
      properties: { background: "grass" },
      tilesets: [
        // Road
        tilesets.road.asphalt.crossroads,
        tilesets.road.asphalt.deadEnd,
        tilesets.road.asphalt.straight,
        tilesets.road.asphalt.tJunction,
        tilesets.road.asphalt.turn,
        tilesets.road.dirt.crossroads,
        tilesets.road.dirt.deadEnd,
        tilesets.road.dirt.straight,
        tilesets.road.dirt.tJunction,
        tilesets.road.dirt.turn,
        // Environment
        tilesets.environment.city.hospital,
        tilesets.environment.city.house,
        tilesets.environment.city.school,
        tilesets.environment.city.shop,
        tilesets.environment.city.solarPanel,
        tilesets.environment.common.trafficLight.red,
        tilesets.environment.common.trafficLight.green,
        tilesets.environment.common.pigeon,
        tilesets.environment.farm.cfcBlack,
        tilesets.environment.farm.cfc,
        tilesets.environment.farm.crops,
        tilesets.environment.farm.house1,
        tilesets.environment.farm.house2,
        tilesets.environment.farm.solarPanel,
        tilesets.environment.grass.cfc,
        tilesets.environment.grass.house,
        tilesets.environment.grass.solarPanel,
        tilesets.environment.snow.barn,
        tilesets.environment.snow.cfc,
        tilesets.environment.snow.crops,
        tilesets.environment.snow.hospital,
        tilesets.environment.snow.house1,
        tilesets.environment.snow.house2,
        tilesets.environment.snow.house3,
        tilesets.environment.snow.school,
        tilesets.environment.snow.shop,
        tilesets.environment.snow.solarPanel,
        // Scenery
        tilesets.scenery.common.bush,
        tilesets.scenery.common.hay,
        tilesets.scenery.common.pond,
        tilesets.scenery.common.tree1,
        tilesets.scenery.common.tree2,
        tilesets.scenery.snow.bush,
        tilesets.scenery.snow.pond,
        tilesets.scenery.snow.tree1,
        tilesets.scenery.snow.tree2,
      ],
      layers: {
        road: { data: layers.tile.data.fillManyRows() },
        environment: { data: layers.tile.data.fillManyRows() },
        scenery: { objects: [] },
      },
    })

    this.loadTilemap(tilemap)
  }

  create() {
    this.startLevel(Level)
  }
}
