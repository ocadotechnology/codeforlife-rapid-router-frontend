import Phaser from "phaser"

import BaseScene from "../BaseScene"

export type Tool = "add-road" | "delete-road"

type Button = {
  bg: Phaser.GameObjects.Rectangle
  label: Phaser.GameObjects.Text
  tool: Tool
}

/**
 * The Toolbox Scene for the Level Creator provides a toolbar on the left side
 * of the screen. It runs in parallel with the create Level scene and exposes
 * the active tool so that the Level scene can query it when handling pointer
 * input.
 */
export default class Toolbox extends BaseScene {
  static readonly KEY = "Toolbox"

  private static readonly PANEL_WIDTH = 160
  private static readonly BUTTON_HEIGHT = 48
  private static readonly BUTTON_GAP = 12
  private static readonly PANEL_PADDING = 16

  activeTool: Tool | null = null

  private buttons: Button[] = []

  create() {
    const panelHeight = this.cameras.main.height

    // Semi-transparent panel background.
    this.add
      .graphics()
      .fillStyle(0x1a1a2e, 0.85)
      .fillRect(0, 0, Toolbox.PANEL_WIDTH, panelHeight)

    this.createButtons({
      "add-road": "Add Road",
      "delete-road": "Delete Road",
    })
  }

  private createButtons(labels: Record<Tool, string>) {
    const entries = Object.entries(labels) as [Tool, string][]

    // Calculate dimensions and position.
    const x = Toolbox.PANEL_PADDING
    const width = Toolbox.PANEL_WIDTH - Toolbox.PANEL_PADDING * 2
    const height = Toolbox.BUTTON_HEIGHT
    const gap = Toolbox.BUTTON_HEIGHT + Toolbox.BUTTON_GAP

    entries.forEach(([tool, label], i) => {
      // Calculate y-offset.
      const y = Toolbox.PANEL_PADDING + i * gap

      // Create interactive background rectangle.
      const bg = this.add
        .rectangle(x, y, width, height, 0x16213e)
        .setOrigin(0, 0)
        .setInteractive({ useHandCursor: true })

      // Add hover and click events to the background rectangle.
      bg.on(Phaser.Input.Events.POINTER_OVER, () => {
        if (this.activeTool !== tool) bg.setFillStyle(0x0f3460)
      })
      bg.on(Phaser.Input.Events.POINTER_OUT, () => {
        if (this.activeTool !== tool) bg.setFillStyle(0x16213e)
      })
      bg.on(Phaser.Input.Events.POINTER_DOWN, () => {
        this.setActiveTool(this.activeTool === tool ? null : tool)
      })

      // Create label text.
      const labelText = this.add
        .text(x + width / 2, y + height / 2, label, {
          fontSize: "14px",
          color: "#e0e0e0",
          align: "center",
          wordWrap: { width: width - 8 },
        })
        .setOrigin(0.5, 0.5)

      // Store the button in the buttons array for later reference.
      this.buttons.push({ bg, label: labelText, tool })
    })
  }

  /** Sets the active tool and updates the button styles accordingly. */
  private setActiveTool(tool: Tool | null) {
    this.activeTool = tool

    for (const btn of this.buttons) {
      if (btn.tool === tool) {
        btn.bg.setFillStyle(0xe94560)
        btn.label.setColor("#ffffff")
      } else {
        btn.bg.setFillStyle(0x16213e)
        btn.label.setColor("#e0e0e0")
      }
    }
  }
}
