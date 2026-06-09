import { path as _ } from "codeforlife/utils/router"

export const Events = {
  SET_COMMANDS: "set-commands",
  SET_LEVEL_ID: "set-level-id",
  GAMEPLAY_SCENE_READY: "gameplay-scene-ready",
} as const
export type Event = (typeof Events)[keyof typeof Events]

export const Variables = {
  COMMANDS: "commands",
  LEVEL_ID: "levelId",
} as const
export type Variable = (typeof Variables)[keyof typeof Variables]

export const SVGs = _("images", {
  Logos: _("/logos", {
    RR: _("/rr.svg"),
  }),
  Background: _("/background", {
    GRASS: _("/grass.svg"),
    PAVEMENT: _("/pavement.svg"),
    SNOW: _("/snow.svg"),
  }),
  Road: _("/road", {
    Asphalt: _("/asphalt", {
      CROSSROADS: _("/crossroads.svg"),
      DEAD_END: _("/dead_end.svg"),
      STRAIGHT: _("/straight.svg"),
      T_JUNCTION: _("/t_junction.svg"),
      TURN: _("/turn.svg"),
    }),
    Dirt: _("/dirt", {
      CROSSROADS: _("/crossroads.svg"),
      DEAD_END: _("/dead_end.svg"),
      STRAIGHT: _("/straight.svg"),
      T_JUNCTION: _("/t_junction.svg"),
      TURN: _("/turn.svg"),
    }),
  }),
  Environment: _("/environment", {
    City: _("/city", {
      HOSPITAL: _("/hospital.svg"),
      HOUSE: _("/house.svg"),
      SCHOOL: _("/school.svg"),
      SHOP: _("/shop.svg"),
      SOLAR_PANEL: _("/solar_panel.svg"),
    }),
    Farm: _("/farm", {
      CFC_BLACK: _("/cfc_black.svg"),
      CFC: _("/cfc.svg"),
      CROPS: _("/crops.svg"),
      HOUSE1: _("/house1.svg"),
      HOUSE2: _("/house2.svg"),
      SOLAR_PANEL: _("/solar_panel.svg"),
    }),
    Grass: _("/grass", {
      CFC: _("/cfc.svg"),
      HOUSE: _("/house.svg"),
      SOLAR_PANEL: _("/solar_panel.svg"),
    }),
    Snow: _("/snow", {
      BARN: _("/barn.svg"),
      CFC: _("/cfc.svg"),
      CROPS: _("/crops.svg"),
      HOSPITAL: _("/hospital.svg"),
      HOUSE1: _("/house1.svg"),
      HOUSE2: _("/house2.svg"),
      HOUSE3: _("/house3.svg"),
      SCHOOL: _("/school.svg"),
      SHOP: _("/shop.svg"),
      SOLAR_PANEL: _("/solar_panel.svg"),
    }),
    TrafficLight: _("/trafficLight", {
      GREEN: _("/green.svg"),
      RED: _("/red.svg"),
    }),
    PIGEON: _("/pigeon.svg"),
  }),
  Scenery: _("/scenery", {
    Snow: _("/snow", {
      BUSH: _("/bush.svg"),
      POND: _("/pond.svg"),
      TREE1: _("/tree1.svg"),
      TREE2: _("/tree2.svg"),
    }),
    BUSH: _("/bush.svg"),
    HAY: _("/hay.svg"),
    POND: _("/pond.svg"),
    TREE1: _("/tree1.svg"),
    TREE2: _("/tree2.svg"),
  }),
} as const)
