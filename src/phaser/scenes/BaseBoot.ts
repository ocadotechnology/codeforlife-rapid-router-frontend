import Phaser from "phaser"

import { SVGs } from "../enums"
import logo from "../../images/rr_logo.svg?url"

export default class extends Phaser.Scene {
  preload() {
    // Load any assets required for the Preloader Scene here.
    this.load.svg(SVGs.LOGO, logo)
  }
}
