import Phaser from "phaser"

import Graphics from "../graphics"

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

  addGraphics = () => this.add.existing(new Graphics(this))
}
