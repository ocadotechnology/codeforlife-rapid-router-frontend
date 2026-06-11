import * as backgrounds from "../backgrounds"
import { TILE_HEIGHT, TILE_WIDTH } from "../globals"
import BaseScene from "./BaseScene"
import logo from "../../images/logos/rr.svg?url"

export default class BaseBoot<
  Data extends object | undefined = undefined,
> extends BaseScene<Data> {
  static KEY = "Boot"

  preload() {
    // Load any assets required for the Preloader Scene here.
    const logoScale = 2
    this.load.svg("logo", logo, {
      width: 200 * logoScale,
      height: 140 * logoScale,
    })

    const background = backgrounds.Backgrounds.GRASS
    this.load.svg(background, backgrounds.getSvgUrl(background), {
      width: TILE_WIDTH,
      height: TILE_HEIGHT,
    })
  }
}
