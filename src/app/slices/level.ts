import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice } from "codeforlife/slices"

import { type ToolboxItemInfo } from "../../pages/level/BlocklyWorkspace"

export type PanelCount = 2 | 3

export interface LevelState {
  panels: PanelCount
  toolbox_contents: ToolboxItemInfo[]
}

const initialState: LevelState = Object.freeze({
  panels: 3,
  toolbox_contents: [
    { kind: "block", type: "moveForwards" },
    // { kind: "block", type: "turn_left" },
    // { kind: "block", type: "turn_right" },
    // { kind: "block", type: "turn_around" },
    // { kind: "block", type: "wait" },
    // { kind: "block", type: "deliver" },
    // { kind: "block", type: "sound_horn" },
    // { kind: "block", type: "road_exists" },
    // { kind: "block", type: "traffic_light" },
    // { kind: "block", type: "dead_end" },
    // { kind: "block", type: "at_destination" },
    // { kind: "block", type: "cow_crossing" },
    // { kind: "block", type: "pigeon_crossing" },
  ],
})

export const levelSlice = createSlice({
  name: "level",
  initialState,
  reducers: create => ({
    // TODO: unused for now, "reducers" prop required for createSlice()
    setPanelsCount: create.reducer(
      (state, action: PayloadAction<PanelCount>) => {
        state.panels = action.payload
      },
    ),
  }),
  selectors: {
    selectToolbox: level => level.toolbox_contents,
    selectPanelCount: level => level.panels,
  },
})

export const { setPanelsCount } = levelSlice.actions
export const { selectToolbox, selectPanelCount } = levelSlice.selectors
