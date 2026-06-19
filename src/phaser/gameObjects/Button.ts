import type Phaser from "phaser"

export default function (
  this: Phaser.GameObjects.GameObjectFactory,
  x: number,
  y: number,
  width: number,
  height: number,
  labelText: string,
  labelStyle: Phaser.Types.GameObjects.Text.TextStyle,
  bgStyle: Phaser.Types.GameObjects.Graphics.FillStyle,
): Phaser.GameObjects.Button {
  // Create interactive background rectangle.
  const bg = this.rectangle(x, y, width, height, bgStyle.color, bgStyle.alpha)
    .setOrigin(0, 0)
    .setInteractive({ useHandCursor: true })

  // Create centered text label.
  const label = this.text(
    x + width / 2,
    y + height / 2,
    labelText,
    labelStyle,
  ).setOrigin(0.5, 0.5)

  return { bg, label }
}
