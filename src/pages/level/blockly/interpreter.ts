import type * as Blockly from "blockly/core"

import {
  type GameCommand,
  pushToCommandQueue,
} from "../../../app/slices/phaserGame"
import { ACTION_BLOCK_TYPES as AB } from "./blocks"
import type { AppDispatch } from "../../../app/store"

interface Command {
  blockId: string
  gc: GameCommand
}

const DEFAULT_PLAY_INTERVAL = 700

class Interpreter {
  private dispatch: AppDispatch
  private queue: Command[] | undefined
  private at: number
  private highlightBlock: (blockId: string) => void
  private speed: number = 1
  private interval: NodeJS.Timeout | undefined

  constructor(
    dispatch: AppDispatch,
    highlightBlock: (blockId: string) => void,
  ) {
    this.dispatch = dispatch
    this.at = 0
    this.highlightBlock = highlightBlock
  }

  private resetHighlight() {
    this.highlightBlock("")
  }

  private sendToGame(cmd: GameCommand) {
    this.dispatch(pushToCommandQueue(cmd))
  }

  private hasNextCommand() {
    return this.queue && this.at < this.queue.length
  }

  private getNextCommand() {
    const next = this.queue![this.at]
    this.at++
    return next
  }

  private evalNextCommand() {
    const next = this.getNextCommand()
    this.highlightBlock(next.blockId)
    this.sendToGame(next.gc)
  }

  setSpeed(speed: number) {
    this.speed = speed
  }

  interpretBlocks(blocks: Blockly.Block[]) {
    const result: Command[] = []
    let nextBlock = blocks[0]
    while (nextBlock) {
      switch (nextBlock.type) {
        case AB.MOVE_FORWARDS:
        case AB.TURN_LEFT:
        case AB.TURN_RIGHT:
        case AB.TURN_AROUND:
        case AB.WAIT:
        case AB.DELIVER:
        case AB.SOUND_HORN:
          result.push({ gc: { type: nextBlock.type }, blockId: nextBlock.id })
          break
      }
      nextBlock = nextBlock.getChildren(false)[0]
    }

    this.queue = result
  }

  stop() {
    this.at = 0
    this.sendToGame({ type: "reset" })
  }

  step() {
    if (this.hasNextCommand()) this.evalNextCommand()
    else this.resetHighlight()
  }

  play() {
    if (this.interval) return

    this.interval = setInterval(() => {
      if (this.hasNextCommand()) {
        this.evalNextCommand()
      } else {
        this.resetHighlight()
        clearInterval(this.interval)
        this.interval = undefined
      }
    }, DEFAULT_PLAY_INTERVAL / this.speed)
  }
}

export default Interpreter
