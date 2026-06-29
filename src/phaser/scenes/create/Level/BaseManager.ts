import type Level from "."

export default class {
  /** The level this manager belongs to. */
  protected readonly level: Level

  constructor(level: Level) {
    this.level = level
  }
}
