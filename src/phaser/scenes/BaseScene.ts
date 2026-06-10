import Phaser from "phaser"

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
}
