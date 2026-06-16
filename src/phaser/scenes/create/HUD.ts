import Phaser from "phaser"

import BaseScene from "../BaseScene"

export type Tool = "add-road" | "delete-road" | null

/**
 * The HUD Scene for the Level Creator provides a toolbar on the left side of
 * the screen. It runs in parallel with the create Level scene and exposes the
 * active tool so that the Level scene can query it when handling pointer input.
 */
export default class HUD extends BaseScene {
  static KEY = "CreateHUD"

  private static readonly PANEL_WIDTH = 160
  private static readonly BUTTON_HEIGHT = 48
  private static readonly BUTTON_GAP = 12
  private static readonly PANEL_PADDING = 16

  activeTool: Tool = null

  private buttons: Array<{
    bg: Phaser.GameObjects.Rectangle
    label: Phaser.GameObjects.Text
    tool: Exclude<Tool, null>
  }> = []

  create() {
    const panelHeight = this.cameras.main.height

    // Semi-transparent panel background.
    this.add
      .graphics()
      .fillStyle(0x1a1a2e, 0.85)
      .fillRect(0, 0, HUD.PANEL_WIDTH, panelHeight)

    const buttonDefs: Array<{ label: string; tool: Exclude<Tool, null> }> = [
      { label: "Add Road", tool: "add-road" },
      { label: "Delete Road", tool: "delete-road" },
    ]

    buttonDefs.forEach(({ label, tool }, i) => {
      const x = HUD.PANEL_PADDING
      const y = HUD.PANEL_PADDING + i * (HUD.BUTTON_HEIGHT + HUD.BUTTON_GAP)
      const width = HUD.PANEL_WIDTH - HUD.PANEL_PADDING * 2
      const height = HUD.BUTTON_HEIGHT

      const bg = this.add
        .rectangle(x, y, width, height, 0x16213e)
        .setOrigin(0, 0)
        .setInteractive({ useHandCursor: true })

      const labelText = this.add
        .text(x + width / 2, y + height / 2, label, {
          fontSize: "14px",
          color: "#e0e0e0",
          align: "center",
          wordWrap: { width: width - 8 },
        })
        .setOrigin(0.5, 0.5)

      bg.on(Phaser.Input.Events.POINTER_OVER, () => {
        if (this.activeTool !== tool) {
          bg.setFillStyle(0x0f3460)
        }
      })

      bg.on(Phaser.Input.Events.POINTER_OUT, () => {
        if (this.activeTool !== tool) {
          bg.setFillStyle(0x16213e)
        }
      })

      bg.on(Phaser.Input.Events.POINTER_DOWN, () => {
        this.setActiveTool(this.activeTool === tool ? null : tool)
      })

      this.buttons.push({ bg, label: labelText, tool })
    })
  }

  private setActiveTool(tool: Tool) {
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
