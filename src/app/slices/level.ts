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
    { kind: "block", type: "logic_compare" },
    { kind: "block", type: "logic_compare" },
    { kind: "block", type: "logic_compare" },
  ],
})

const levelSlice = createSlice({
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

export default levelSlice
export const { setPanelsCount } = levelSlice.actions
export const { selectToolbox, selectPanelCount } = levelSlice.selectors
