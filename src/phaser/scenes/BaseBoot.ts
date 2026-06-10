import BaseScene from "./BaseScene"
import logo from "../../images/logos/rr.svg?url"

export default class BaseBoot<
  Data extends object | undefined = undefined,
> extends BaseScene<Data> {
  static KEY = "Boot"

  preload() {
    // Load any assets required for the Preloader Scene here.
    this.load.svg("logo", logo)
  }
}
