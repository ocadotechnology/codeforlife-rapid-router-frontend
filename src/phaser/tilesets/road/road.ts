import { flattenNumberValues } from "codeforlife/utils/object"

import * as tilesets from "../tilesets"

export const IDs = flattenNumberValues(tilesets.IDs.Road)
export type ID = (typeof IDs)[number]

type MakeKwArgs<GID extends ID> = Omit<tilesets.MakeKwArgs<GID>, "properties">

const make = <
  GID extends ID,
  F extends boolean,
  B extends boolean,
  L extends boolean,
  R extends boolean,
>(
  importMetaUrl: string,
  {
    properties: {
      canDriveForwards,
      canDriveBackwards,
      canTurnLeft,
      canTurnRight,
    },
    ...kwArgs
  }: MakeKwArgs<GID> & {
    properties: {
      canDriveForwards: F
      canDriveBackwards: B
      canTurnLeft: L
      canTurnRight: R
    }
  },
) =>
  tilesets.make(importMetaUrl, {
    properties: [
      { name: "canDriveForwards", value: canDriveForwards, type: "bool" },
      { name: "canDriveBackwards", value: canDriveBackwards, type: "bool" },
      { name: "canTurnLeft", value: canTurnLeft, type: "bool" },
      { name: "canTurnRight", value: canTurnRight, type: "bool" },
    ] as const,
    ...kwArgs,
  })

export const makeCrossroads = <GID extends ID>(
  importMetaUrl: string,
  kwArgs: MakeKwArgs<GID>,
) =>
  make(importMetaUrl, {
    properties: {
      canDriveForwards: true,
      canDriveBackwards: true,
      canTurnLeft: true,
      canTurnRight: true,
    },
    ...kwArgs,
  })

export const makeDeadEnd = <GID extends ID>(
  importMetaUrl: string,
  kwArgs: MakeKwArgs<GID>,
) =>
  make(importMetaUrl, {
    properties: {
      canDriveForwards: false,
      canDriveBackwards: true,
      canTurnLeft: false,
      canTurnRight: false,
    },
    ...kwArgs,
  })

export const makeStraight = <GID extends ID>(
  importMetaUrl: string,
  kwArgs: MakeKwArgs<GID>,
) =>
  make(importMetaUrl, {
    properties: {
      canDriveForwards: true,
      canDriveBackwards: true,
      canTurnLeft: false,
      canTurnRight: false,
    },
    ...kwArgs,
  })

export const makeTJunction = <GID extends ID>(
  importMetaUrl: string,
  kwArgs: MakeKwArgs<GID>,
) =>
  make(importMetaUrl, {
    properties: {
      canDriveForwards: false,
      canDriveBackwards: true,
      canTurnLeft: true,
      canTurnRight: true,
    },
    ...kwArgs,
  })

export const makeTurn = <GID extends ID>(
  importMetaUrl: string,
  kwArgs: MakeKwArgs<GID>,
) =>
  make(importMetaUrl, {
    properties: {
      canDriveForwards: false,
      canDriveBackwards: false,
      canTurnLeft: true,
      canTurnRight: true,
    },
    ...kwArgs,
  })

export const makeAll = <GID extends ID>(
  importMetaUrl: string,
  {
    crossroads,
    deadEnd,
    straight,
    tJunction,
    turn,
  }: {
    crossroads: MakeKwArgs<GID>
    deadEnd: MakeKwArgs<GID>
    straight: MakeKwArgs<GID>
    tJunction: MakeKwArgs<GID>
    turn: MakeKwArgs<GID>
  },
) => ({
  crossroads: makeCrossroads(importMetaUrl, crossroads),
  deadEnd: makeDeadEnd(importMetaUrl, deadEnd),
  straight: makeStraight(importMetaUrl, straight),
  tJunction: makeTJunction(importMetaUrl, tJunction),
  turn: makeTurn(importMetaUrl, turn),
})
