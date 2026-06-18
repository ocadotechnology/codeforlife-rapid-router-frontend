import type { DeepNumbersOf } from "codeforlife/utils/object"
import type { Tuple } from "codeforlife/utils/general"

import * as tilesets from "../../tilesets"
import { COLS, ROWS } from "../../globals"

const H = 0x80000000
const V = 0x40000000
const D = 0x20000000
const MASK = H | V | D

function extract(id: number): [number, number, number] {
  return [(id >>> 31) & 1, (id >>> 30) & 1, (id >>> 29) & 1]
}

function encode<ID extends tilesets.ID>(
  id: ID,
  h: number,
  v: number,
  d: number,
): ID {
  return ((id & ~MASK) | (h * H) | (v * V) | (d * D)) as ID
}

type Flip<D extends "H" | "V"> = { readonly __flip: D }
type Degrees = 90 | 180 | 270
type Rotate<D extends Degrees> = { readonly __rotate: D }

/** Flip a tile horizontally. */
// @ts-expect-error not yet used
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function flipH<ID extends tilesets.ID>(id: ID): ID & Flip<"H"> {
  const [h, v, d] = extract(id)
  return encode(id, h ^ 1, v, d) as ID & Flip<"H">
}

/** Flip a tile vertically. */
// @ts-expect-error not yet used
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function flipV<ID extends tilesets.ID>(id: ID): ID & Flip<"V"> {
  const [h, v, d] = extract(id)
  return encode(id, h, v ^ 1, d) as ID & Flip<"V">
}

/** Rotate a tile clockwise. */
function rotateC<ID extends tilesets.ID, D extends Degrees>(
  id: ID,
  degrees: D,
): ID & Rotate<D> {
  const [h, v, d] = extract(id)
  if (degrees === 90) return encode(id, v ^ 1, h, d ^ 1) as ID & Rotate<D>
  if (degrees === 180) return encode(id, h ^ 1, v ^ 1, d) as ID & Rotate<D>
  return encode(id, v, h ^ 1, d ^ 1) as ID & Rotate<D> // 270
}

/** Create a set of clockwise rotations for a tile. */
const createCRotations = <
  ID extends tilesets.ID,
  N0 extends string,
  N90 extends string = "",
  N180 extends string = "",
  N270 extends string = "",
>(
  id: ID,
  _0: N0,
  rotations:
    | { 90: N90; 180?: undefined; 270?: undefined }
    | { 90: N90; 180: N180; 270?: undefined }
    | { 90: N90; 180?: undefined; 270: N270 }
    | { 90?: undefined; 180?: undefined; 270: N270 }
    | { 90?: undefined; 180: N180; 270?: undefined }
    | { 90?: undefined; 180: N180; 270: N270 }
    | { 90: N90; 180: N180; 270: N270 },
) =>
  ({
    [_0]: id,
    ...(rotations[90] ? { [rotations[90]]: rotateC(id, 90) } : {}),
    ...(rotations[180] ? { [rotations[180]]: rotateC(id, 180) } : {}),
    ...(rotations[270] ? { [rotations[270]]: rotateC(id, 270) } : {}),
  }) as Record<N0, ID> &
    (N90 extends "" ? {} : Record<N90, ID & Rotate<90>>) &
    (N180 extends "" ? {} : Record<N180, ID & Rotate<180>>) &
    (N270 extends "" ? {} : Record<N270, ID & Rotate<270>>)

/** Create road tile variants with clockwise rotations. */
const createRoads = <
  S extends tilesets.road.ID,
  S0 extends string,
  S90 extends string,
  T extends tilesets.road.ID,
  T0 extends string,
  T90 extends string,
  T180 extends string,
  T270 extends string,
  TJ extends tilesets.road.ID,
  TJ0 extends string,
  TJ90 extends string,
  TJ180 extends string,
  TJ270 extends string,
  C extends tilesets.road.ID,
  C0 extends string,
  DE extends tilesets.road.ID,
  DE0 extends string,
  DE90 extends string,
  DE180 extends string,
  DE270 extends string,
>({
  Straight,
  Turn,
  TJunction,
  Crossroads,
  DeadEnd,
}: {
  Straight: [S, S0, { 90: S90 }]
  Turn: [T, T0, { 90: T90; 180: T180; 270: T270 }]
  TJunction: [TJ, TJ0, { 90: TJ90; 180: TJ180; 270: TJ270 }]
  Crossroads: [C, C0]
  DeadEnd: [DE, DE0, { 90: DE90; 180: DE180; 270: DE270 }]
}) => ({
  Straight: createCRotations(...Straight),
  Turn: createCRotations(...Turn),
  TJunction: createCRotations(...TJunction),
  ...({ [Crossroads[1]]: Crossroads[0] } as Record<C0, C>),
  DeadEnd: createCRotations(...DeadEnd),
})

/**
 * Global registry ID variants to use in tile layers, including flipped and
 * rotated versions of the base tilesets.IDs.
 */
export const IDs = {
  EMPTY: 0, // 0 is reserved by Phaser as a special "empty" tile.
  Road: {
    Asphalt: createRoads({
      Straight: [
        tilesets.IDs.Road.Asphalt.STRAIGHT,
        "VERTICAL",
        { 90: "HORIZONTAL" },
      ],
      Turn: [
        tilesets.IDs.Road.Asphalt.TURN,
        "BOTTOM_LEFT",
        { 90: "TOP_LEFT", 180: "TOP_RIGHT", 270: "BOTTOM_RIGHT" },
      ],
      TJunction: [
        tilesets.IDs.Road.Asphalt.T_JUNCTION,
        "TOP_LEFT_BOTTOM",
        {
          90: "TOP_LEFT_RIGHT",
          180: "TOP_RIGHT_BOTTOM",
          270: "LEFT_RIGHT_BOTTOM",
        },
      ],
      Crossroads: [tilesets.IDs.Road.Asphalt.CROSSROADS, "CROSSROADS"],
      DeadEnd: [
        tilesets.IDs.Road.Asphalt.DEAD_END,
        "BOTTOM",
        { 90: "LEFT", 180: "TOP", 270: "RIGHT" },
      ],
    }),
    Dirt: createRoads({
      Straight: [
        tilesets.IDs.Road.Dirt.STRAIGHT,
        "VERTICAL",
        { 90: "HORIZONTAL" },
      ],
      Turn: [
        tilesets.IDs.Road.Dirt.TURN,
        "BOTTOM_LEFT",
        { 90: "TOP_LEFT", 180: "TOP_RIGHT", 270: "BOTTOM_RIGHT" },
      ],
      TJunction: [
        tilesets.IDs.Road.Dirt.T_JUNCTION,
        "TOP_LEFT_BOTTOM",
        {
          90: "TOP_LEFT_RIGHT",
          180: "TOP_RIGHT_BOTTOM",
          270: "LEFT_RIGHT_BOTTOM",
        },
      ],
      Crossroads: [tilesets.IDs.Road.Dirt.CROSSROADS, "CROSSROADS"],
      DeadEnd: [
        tilesets.IDs.Road.Dirt.DEAD_END,
        "BOTTOM",
        { 90: "LEFT", 180: "TOP", 270: "RIGHT" },
      ],
    }),
  },
  Environment: {
    City: {
      Hospital: createCRotations(
        tilesets.IDs.Environment.City.HOSPITAL,
        "TOP",
        { 90: "RIGHT", 180: "BOTTOM", 270: "LEFT" },
      ),
      House: createCRotations(tilesets.IDs.Environment.City.HOUSE, "LEFT", {
        90: "TOP",
        180: "RIGHT",
        270: "BOTTOM",
      }),
      School: createCRotations(tilesets.IDs.Environment.City.SCHOOL, "BOTTOM", {
        90: "LEFT",
        180: "TOP",
        270: "RIGHT",
      }),
      Shop: createCRotations(tilesets.IDs.Environment.City.SHOP, "LEFT", {
        90: "TOP",
        180: "RIGHT",
        270: "BOTTOM",
      }),
      SolarPanel: createCRotations(
        tilesets.IDs.Environment.City.SOLAR_PANEL,
        "BOTTOM",
        { 90: "LEFT", 180: "TOP", 270: "RIGHT" },
      ),
    },
    Common: {
      Pigeon: createCRotations(
        tilesets.IDs.Environment.Common.PIGEON,
        "RIGHT",
        { 90: "BOTTOM", 180: "LEFT", 270: "TOP" },
      ),
      TrafficLight: {
        Green: createCRotations(
          tilesets.IDs.Environment.Common.TrafficLight.GREEN,
          "BOTTOM",
          { 90: "LEFT", 180: "TOP", 270: "RIGHT" },
        ),
        Red: createCRotations(
          tilesets.IDs.Environment.Common.TrafficLight.RED,
          "BOTTOM",
          { 90: "LEFT", 180: "TOP", 270: "RIGHT" },
        ),
      },
    },
    Farm: {
      CFCBlack: createCRotations(
        tilesets.IDs.Environment.Farm.CFC_BLACK,
        "TOP",
        { 90: "RIGHT", 180: "BOTTOM", 270: "LEFT" },
      ),
      CFC: createCRotations(tilesets.IDs.Environment.Farm.CFC, "TOP", {
        90: "RIGHT",
        180: "BOTTOM",
        270: "LEFT",
      }),
      Crops: createCRotations(
        tilesets.IDs.Environment.Farm.CROPS,
        "HORIZONTAL",
        { 90: "VERTICAL" },
      ),
      House1: createCRotations(tilesets.IDs.Environment.Farm.HOUSE1, "LEFT", {
        90: "TOP",
        180: "RIGHT",
        270: "BOTTOM",
      }),
      House2: createCRotations(tilesets.IDs.Environment.Farm.HOUSE2, "LEFT", {
        90: "TOP",
        180: "RIGHT",
        270: "BOTTOM",
      }),
      SolarPanel: createCRotations(
        tilesets.IDs.Environment.Farm.SOLAR_PANEL,
        "VERTICAL",
        { 90: "HORIZONTAL" },
      ),
    },
    Grass: {
      CFC: createCRotations(tilesets.IDs.Environment.Grass.CFC, "TOP", {
        90: "RIGHT",
        180: "BOTTOM",
        270: "LEFT",
      }),
      House: createCRotations(tilesets.IDs.Environment.Grass.HOUSE, "LEFT", {
        90: "TOP",
        180: "RIGHT",
        270: "BOTTOM",
      }),
      SolarPanel: createCRotations(
        tilesets.IDs.Environment.Grass.SOLAR_PANEL,
        "VERTICAL",
        { 90: "HORIZONTAL" },
      ),
    },
    Snow: {
      Barn: createCRotations(tilesets.IDs.Environment.Snow.BARN, "TOP", {
        90: "RIGHT",
        180: "BOTTOM",
        270: "LEFT",
      }),
      CFC: createCRotations(tilesets.IDs.Environment.Snow.CFC, "TOP", {
        90: "RIGHT",
        180: "BOTTOM",
        270: "LEFT",
      }),
      Crops: createCRotations(
        tilesets.IDs.Environment.Snow.CROPS,
        "HORIZONTAL",
        { 90: "VERTICAL" },
      ),
      Hospital: createCRotations(
        tilesets.IDs.Environment.Snow.HOSPITAL,
        "TOP",
        { 90: "RIGHT", 180: "BOTTOM", 270: "LEFT" },
      ),
      House1: createCRotations(tilesets.IDs.Environment.Snow.HOUSE1, "LEFT", {
        90: "TOP",
        180: "RIGHT",
        270: "BOTTOM",
      }),
      House2: createCRotations(tilesets.IDs.Environment.Snow.HOUSE2, "LEFT", {
        90: "TOP",
        180: "RIGHT",
        270: "BOTTOM",
      }),
      House3: createCRotations(tilesets.IDs.Environment.Snow.HOUSE3, "LEFT", {
        90: "TOP",
        180: "RIGHT",
        270: "BOTTOM",
      }),
      School: createCRotations(tilesets.IDs.Environment.Snow.SCHOOL, "BOTTOM", {
        90: "LEFT",
        180: "TOP",
        270: "RIGHT",
      }),
      Shop: createCRotations(tilesets.IDs.Environment.Snow.SHOP, "LEFT", {
        90: "TOP",
        180: "RIGHT",
        270: "BOTTOM",
      }),
      SolarPanel: createCRotations(
        tilesets.IDs.Environment.Snow.SOLAR_PANEL,
        "VERTICAL",
        { 90: "HORIZONTAL" },
      ),
    },
  },
} as const
export type ID = DeepNumbersOf<typeof IDs>
export type RoadID = typeof IDs.EMPTY | DeepNumbersOf<typeof IDs.Road>
export type EnvironmentID =
  | typeof IDs.EMPTY
  | DeepNumbersOf<typeof IDs.Environment>

// Define the structure of the tilemap data for our game, including the tilesets
// and layers. This structure will be used to create the tilemap in Phaser and
// ensure that all necessary information is provided in a type-safe manner.
export type Row<DID extends ID = ID, COLS extends number = typeof COLS> = Tuple<
  DID,
  COLS
>
export type ManyRows<
  DID extends ID = ID,
  COLS extends number = typeof COLS,
  ROWS extends number = typeof ROWS,
> = Tuple<Tuple<DID, COLS>, ROWS>

export type FillRowOptions<
  DID extends ID = typeof IDs.EMPTY,
  COLS extends number = typeof COLS,
> = Partial<{ id: DID; cols: COLS }>

/**
 * Creates a single row of tile data filled with the specified tile ID. This is
 * useful for quickly generating uniform layers in the tilemap.
 *
 * @param id The tile ID to fill the row with. Defaults to `IDs.EMPTY` if not
 *  provided.
 * @param cols The number of columns in the row. Defaults to the width of the
 *  tilemap if not provided.
 * @returns A row of tile data with the specified tile ID.
 */
export function fillRow<
  DID extends ID = typeof IDs.EMPTY,
  COLS extends number = typeof COLS,
>(options: FillRowOptions<DID, COLS> = {}) {
  const { id = IDs.EMPTY as DID, cols = COLS as COLS } = options
  return Array(cols).fill(id) as Row<DID, COLS>
}

export type FillManyRowsOptions<
  DID extends ID = typeof IDs.EMPTY,
  COLS extends number = typeof COLS,
  ROWS extends number = typeof ROWS,
> = FillRowOptions<DID, COLS> & Partial<{ rows: ROWS }>

/**
 * Creates a tilemap filled with the specified tile ID. This is useful for
 * quickly generating uniform layers in the tilemap.
 *
 * @param id The tile ID to fill the row with. Defaults to `IDs.EMPTY` if not
 *  provided.
 * @param cols The number of columns in the row. Defaults to the width of the
 *  tilemap if not provided.
 * @param rows The number of rows in the tilemap. Defaults to the height of the
 *  tilemap if not provided.
 * @returns A tilemap with all rows filled with the specified tile ID.
 */
export function fillManyRows<
  DID extends ID = typeof IDs.EMPTY,
  COLS extends number = typeof COLS,
  ROWS extends number = typeof ROWS,
>(options: FillManyRowsOptions<DID, COLS, ROWS> = {}) {
  const { rows = ROWS as ROWS, ...fillRowOptions } = options
  return Array(rows).fill(fillRow(fillRowOptions)) as ManyRows<DID, COLS, ROWS>
}
