import { flattenNumberValues } from "codeforlife/utils/object"

import * as road from "../road"
import * as tilesets from "../../tilesets"

const _IDs = tilesets.IDs.Road.Dirt
export const IDs = flattenNumberValues(_IDs)
export type ID = (typeof IDs)[number]

export const { crossroads, deadEnd, straight, tJunction, turn } =
  road.makeAll<ID>(import.meta.url, {
    crossroads: {
      image: "./crossroads.svg",
      firstgid: _IDs.CROSSROADS,
    },
    deadEnd: {
      image: "./dead_end.svg",
      firstgid: _IDs.DEAD_END,
    },
    straight: {
      image: "./straight.svg",
      firstgid: _IDs.STRAIGHT,
    },
    tJunction: {
      image: "./t_junction.svg",
      firstgid: _IDs.T_JUNCTION,
    },
    turn: {
      image: "./turn.svg",
      firstgid: _IDs.TURN,
    },
  })
