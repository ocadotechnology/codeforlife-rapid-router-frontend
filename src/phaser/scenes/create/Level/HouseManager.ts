import Phaser from "phaser"
import RotateRightIcon from "@mui/icons-material/RotateRight"

import * as layers from "../../../layers"
import type { Direction, default as Level, Tile } from "."
import type { AddRoadEventData } from "./RoadManager"
import BaseManager from "./BaseManager"
import { Events } from "../../../globals"

type VariantKey =
  | keyof layers.objectGroup.objects.StraightRotationVariants
  | keyof layers.objectGroup.objects.endpoints.house.DiagonalRotationVariants
type Variant = { key: VariantKey; crossoverTiles: Tile[] }
type House = Tile & { obj: Phaser.GameObjects.Image; variant: Variant }

export default class extends BaseManager {
  /**
   * Persistent 2D array [row][col] indicating if a house is occupying a tile.
   * - A value of `null` means the tile is unoccupied.
   * - A value of `Tile` means the tile is occupied by a crossover tile of a
   *   house. The value points to the main tile of the house.
   * - A value of `Variant` means the tile is occupied by the main tile of a
   *   house.
   */
  private readonly _houses: (House | Tile | null)[][] = Array.from(
    { length: this.level.tilemap.height },
    () => Array.from({ length: this.level.tilemap.width }, () => null),
  )

  /** CSS cursor string for the rotate-right icon, pre-computed once. */
  private readonly rotateCursor = this.level.muiIconToCursor(RotateRightIcon)

  constructor(level: Level) {
    super(level)

    const onAddRoad = (data: AddRoadEventData) => this.onAddRoad(data)
    level.game.events.on(Events.ADD_ROAD, onAddRoad)

    level.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
      level.game.events.off(Events.ADD_ROAD, onAddRoad)
    })
  }

  /**
   * Get the house variant for a given tile.
   * If the tile is a crossover tile, returns the main house variant.
   */
  private houses(tile: Tile): House | null
  /**
   * Set the house variant for a given tile.
   * If the tile is already occupied by a house, it's main and crossover tiles
   * will first be removed before the new house is placed.
   */
  private houses(tile: Tile, house: Omit<House, keyof Tile> | null): void
  private houses(tile: Tile, house?: Omit<House, keyof Tile> | null) {
    // Get the main house tile or null.
    const get = ({ row, col }: Tile) => {
      const house = this._houses[row][col]

      return house === null || "variant" in house
        ? house
        : (this._houses[house.row][house.col] as House)
    }

    const set = ({ row, col }: Tile, value: House | Tile | null) => {
      const currentHouse = get({ row, col })

      // Clear the current house's main and crossover tiles.
      if (currentHouse !== null) {
        // Check if the current tile is a crossover tile.
        // If so, clear the main tile.
        const house = this._houses[row][col]
        if (house !== null && !("variant" in house)) {
          this._houses[house.row][house.col] = null
        }

        // Clear the current tile (may be a main or crossover tile).
        this._houses[row][col] = null

        // Clear the crossover tiles.
        currentHouse.variant.crossoverTiles.forEach(cTile => {
          this._houses[cTile.row][cTile.col] = null
        })
      }

      // Set the new current (may be null, a main, or a crossover tile).
      this._houses[row][col] = value

      // Set the crossover tiles if the current tile is a main tile.
      if (value !== null && "variant" in value) {
        value.variant.crossoverTiles.forEach(cTile => set(cTile, { row, col }))
      }
    }

    if (house === undefined) return get(tile)

    set(tile, house === null ? null : { ...tile, ...house })
  }

  get type() {
    // TODO: select the house type from the toolbox.
    return layers.objectGroup.objects.endpoints.house.common.orange
  }

  /** Checks if a house can be added at the given tile. */
  private canAdd = (tile: Tile) =>
    this.level.road.dirs(tile).size > 0 && !this.houses(tile)

  /** Checks if a house can be rotated at the given tile. */
  private canRotate(tile: Tile) {
    const house = this.houses(tile)
    return house !== null && this.variants(house).length >= 2
  }

  /** Adds a house variant to the given tile. */
  private addVariant({
    variant,
    ...tile
  }: Pick<House, keyof Tile | "variant">) {
    // Add the house object to the endpoints layer.
    const obj = this.level.addObject(
      "ObjectGroup.ENDPOINTS",
      // TODO: fix the +1 offset so the house is centered on the tile.
      this.type[variant.key]({ col: tile.col + 1, row: tile.row + 1 }),
    )

    // Occupy the tile and any crossover tiles for the house variant.
    this.houses(tile, { obj, variant })
  }

  /** Adds a house to the given tile, using the first available variant. */
  private add(tile: Tile) {
    // Get the first available house variant for the tile.
    const variants = this.variants(tile)
    if (variants.length > 0) this.addVariant({ ...tile, variant: variants[0] })
  }

  /** Destroys the given house object. */
  private destroy({ obj, ...tile }: Pick<House, keyof Tile | "obj">) {
    this.houses(tile, null)
    this.level.destroyObject("ObjectGroup.ENDPOINTS", obj)
  }

  /** Destroys the current house object and adds a new variant to the tile. */
  private destroyAndAddVariant(house: House) {
    this.destroy(house)
    this.addVariant(house)
  }

  /** Rotates the house at the given tile to the next available variant. */
  private rotate(tile: Tile) {
    const house = this.houses(tile)
    if (!house) return

    const variants = this.variants(house)
    if (variants.length < 2) return // No other variants to rotate to.

    let variantIndex = variants.findIndex(v => v.key === house.variant.key)
    // Current variant is no longer valid, so reset to first.
    if (variantIndex === -1 || ++variantIndex >= variants.length)
      variantIndex = 0

    this.destroyAndAddVariant({ ...house, variant: variants[variantIndex] })
  }

  /**
   * Returns the house variants for a given road ID.
   *
   * Variants are ordered in a clockwise direction starting from left:
   * 1. Left
   * 2. Top Left
   * 3. Top
   * 4. Top Right
   * 5. Right
   * 6. Bottom Right
   * 7. Bottom
   * 8. Bottom Left
   */
  private roadIdToVariantKeys(roadId: layers.tile.data.RoadID): VariantKey[] {
    // Straight
    if (roadId === this.level.road.ids.Straight.HORIZONTAL)
      return ["top", "bottom"]
    if (roadId === this.level.road.ids.Straight.VERTICAL)
      return ["left", "right"]
    // Dead end
    if (roadId === this.level.road.ids.DeadEnd.TOP)
      return ["left", "top", "right"]
    if (roadId === this.level.road.ids.DeadEnd.BOTTOM)
      return ["left", "right", "bottom"]
    if (roadId === this.level.road.ids.DeadEnd.LEFT)
      return ["left", "top", "bottom"]
    if (roadId === this.level.road.ids.DeadEnd.RIGHT)
      return ["top", "right", "bottom"]
    // Turn
    if (roadId === this.level.road.ids.Turn.TOP_LEFT)
      return ["outTopLeft", "inBottomRight"]
    if (roadId === this.level.road.ids.Turn.TOP_RIGHT)
      return ["outTopRight", "inBottomLeft"]
    if (roadId === this.level.road.ids.Turn.BOTTOM_LEFT)
      return ["inTopRight", "outBottomLeft"]
    if (roadId === this.level.road.ids.Turn.BOTTOM_RIGHT)
      return ["inTopLeft", "outBottomRight"]
    // T-junction
    if (roadId === this.level.road.ids.TJunction.TOP_LEFT_RIGHT)
      return ["top", "inBottomRight", "inBottomLeft"]
    if (roadId === this.level.road.ids.TJunction.LEFT_RIGHT_BOTTOM)
      return ["inTopLeft", "inTopRight", "bottom"]
    if (roadId === this.level.road.ids.TJunction.TOP_RIGHT_BOTTOM)
      return ["inTopLeft", "right", "inBottomLeft"]
    if (roadId === this.level.road.ids.TJunction.TOP_LEFT_BOTTOM)
      return ["left", "inTopRight", "inBottomRight"]
    // Crossroads
    if (roadId === this.level.road.ids.CROSSROADS)
      return ["inTopLeft", "inTopRight", "inBottomRight", "inBottomLeft"]
    // No road tile means no house can be placed, so skip.
    return []
  }

  /** Returns the tiles that a house variant crosses over into. */
  private variantKeyToCrossoverTiles(
    tile: Tile,
    variantKey: VariantKey,
  ): Tile[] {
    const step = (dirs: Direction[]) => {
      const destination = this.level.moveFromTile(tile, dirs)
      return destination ? [destination] : []
    }

    // Precompute the neighbouring tiles in each direction.
    const left = step(["left"])
    const right = step(["right"])
    const top = step(["top"])
    const bottom = step(["bottom"])
    const topRight = step(["top", "right"])
    const topLeft = step(["top", "left"])
    const bottomRight = step(["bottom", "right"])
    const bottomLeft = step(["bottom", "left"])

    // Return the crossover tiles based on the house variant.
    if (variantKey === "top") return bottom
    if (variantKey === "bottom") return top
    if (variantKey === "left") return right
    if (variantKey === "right") return left
    if (variantKey === "inTopLeft") return [...bottom, ...right, ...bottomRight]
    if (variantKey === "inTopRight") return [...bottom, ...left, ...bottomLeft]
    if (variantKey === "inBottomLeft") return [...top, ...right, ...topRight]
    if (variantKey === "inBottomRight") return [...top, ...left, ...topLeft]

    return [] // No crossover tiles for variant.
  }

  /** Returns the house variants that can be placed on a given tile. */
  private variants(tile: Tile, roadId?: layers.tile.data.RoadID): Variant[] {
    roadId ??= this.level.road.dirsToId(this.level.road.dirs(tile))

    return (
      this.roadIdToVariantKeys(roadId)
        // Map each variant key to its crossover tiles.
        .map(variantKey => ({
          key: variantKey,
          crossoverTiles: this.variantKeyToCrossoverTiles(tile, variantKey),
        }))
        // Filter out variants that have crossover tiles already occupied by
        // other houses. A crossover tile is considered occupied if it is either
        // a main tile of another house or a crossover tile of another house.
        .filter(({ crossoverTiles }) =>
          crossoverTiles.every(cTile => {
            const house = this.houses(cTile)
            return (
              house === null ||
              (house.row === tile.row && house.col === tile.col)
            )
          }),
        )
    )
  }

  /** Handles the addition of a road on the map. */
  private onAddRoad({ id: roadId, tile }: AddRoadEventData) {
    const house = this.houses(tile)
    if (!house) return

    // If the road change is on a crossover tile, ignore it — variants are
    // determined by the road at the main tile, not at crossover tiles.
    if (house.row !== tile.row || house.col !== tile.col) return

    const variants = this.variants(tile, roadId)
    if (variants.length === 0) {
      this.destroy(house)
    } else if (variants.every(v => v.key !== house.variant.key)) {
      this.destroyAndAddVariant({ ...house, variant: variants[0] })
    }
  }

  onPointerDown(pointer: Phaser.Input.Pointer) {
    const tool = this.level.toolbox?.activeTool
    if (tool !== "add-house") return

    this.level.graphics.clear() // Clear any previous hover highlight.

    const tile = this.level.worldToTile(pointer.worldX, pointer.worldY)
    if (!tile) return

    if (this.canAdd(tile)) this.add(tile)
    else if (this.canRotate(tile)) this.rotate(tile)
  }

  onPointerMove(pointer: Phaser.Input.Pointer) {
    const tool = this.level.toolbox?.activeTool
    if (tool !== "add-house") return

    // Clear any highlighted squares.
    this.level.graphics.clear()

    // Get the tile under the cursor (if in map).
    const tile = this.level.worldToTile(pointer.worldX, pointer.worldY)
    if (!tile) return

    if (this.canRotate(tile)) {
      this.level.highlightTile(tile, 0xffff00)
      this.level.input.setDefaultCursor(this.rotateCursor)
    } else {
      this.level.input.setDefaultCursor("pointer")
      if (this.canAdd(tile)) this.level.highlightTile(tile, 0x00ff00)
    }
  }
}
