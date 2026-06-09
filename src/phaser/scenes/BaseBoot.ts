import Phaser from "phaser"

import { SVGs } from "../enums"
import logo from "../../images/logos/rr.svg?url"

export default class extends Phaser.Scene {
  preload() {
    // Load any assets required for the Preloader Scene here.
    this.load.svg(SVGs.Logos.RR._, logo)
  }
}
