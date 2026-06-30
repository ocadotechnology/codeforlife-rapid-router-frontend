import Phaser from "phaser"
import type { SvgIcon } from "@mui/material"
import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"

import "../gameObjects" // Register custom game objects.
import { TILE_HEIGHT, TILE_WIDTH } from "../globals"

export default class BaseScene<
  Data extends object | undefined = undefined,
> extends Phaser.Scene {
  static KEY: string

  initData!: Data

  constructor() {
    super(new.target.KEY)
  }

  init(data: Data) {
    this.initData = data
  }

  /** Converts a MUI icon to a CSS cursor string. */
  muiIconToCursor(
    icon: typeof SvgIcon,
    {
      width = TILE_WIDTH / 2,
      height = TILE_HEIGHT / 2,
      color = "white",
    }: Partial<{ width: number; height: number; color: string }> = {},
  ): string {
    const svg = renderToStaticMarkup(
      createElement(icon, {
        xmlns: "http://www.w3.org/2000/svg",
        width,
        height,
        fill: color,
      }),
    )

    return (
      `url('data:image/svg+xml,${encodeURIComponent(svg)}')` +
      ` ${width / 2} ${height / 2}, auto`
    )
  }
}
