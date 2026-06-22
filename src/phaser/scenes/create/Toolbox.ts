import Phaser from "phaser"

import BaseScene from "../BaseScene"

export type Tool = "add-road" | "delete-road" | "add-house" | "delete-house"

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

  private static readonly BUTTON_BG_DEFAULT_COLOR = 0x16213e
  private static readonly BUTTON_BG_HOVER_COLOR = 0x0f3460
  private static readonly BUTTON_BG_ACTIVE_COLOR = 0xe94560

  private static readonly BUTTON_TEXT_COLOR = "#e0e0e0"
  private static readonly BUTTON_TEXT_ACTIVE_COLOR = "#ffffff"

  activeTool: Tool | null = null

  private buttons = {} as Record<Tool, Phaser.GameObjects.Button>

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
      "add-house": "Add House",
      "delete-house": "Delete House",
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

      const button = this.add.button(
        x,
        y,
        width,
        height,
        label,
        {
          fontSize: "14px",
          color: Toolbox.BUTTON_TEXT_COLOR,
          align: "center",
          wordWrap: { width: width - 8 },
        },
        { color: Toolbox.BUTTON_BG_DEFAULT_COLOR },
      )

      // Add hover and click events to the background rectangle.
      button.bg.on(Phaser.Input.Events.POINTER_OVER, () => {
        if (this.activeTool !== tool)
          button.bg.setFillStyle(Toolbox.BUTTON_BG_HOVER_COLOR)
      })
      button.bg.on(Phaser.Input.Events.POINTER_OUT, () => {
        if (this.activeTool !== tool)
          button.bg.setFillStyle(Toolbox.BUTTON_BG_DEFAULT_COLOR)
      })
      button.bg.on(Phaser.Input.Events.POINTER_DOWN, () => {
        this.setActiveTool(this.activeTool === tool ? null : tool)
      })

      // Store the button in the buttons array for later reference.
      this.buttons[tool] = button
    })
  }

  /** Sets the active tool and updates the button styles accordingly. */
  private setActiveTool(tool: Tool | null) {
    this.activeTool = tool

    for (const [btnTool, btn] of Object.entries(this.buttons) as [
      Tool,
      Phaser.GameObjects.Button,
    ][]) {
      if (btnTool === tool) {
        btn.bg.setFillStyle(Toolbox.BUTTON_BG_ACTIVE_COLOR)
        btn.label.setColor(Toolbox.BUTTON_TEXT_ACTIVE_COLOR)
      } else {
        btn.bg.setFillStyle(Toolbox.BUTTON_BG_DEFAULT_COLOR)
        btn.label.setColor(Toolbox.BUTTON_TEXT_COLOR)
      }
    }
  }
}
