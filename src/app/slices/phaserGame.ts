import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice } from "codeforlife/slices"

import { type ACTION_BLOCK_TYPES as AB } from "../../pages/level/blockly/blocks"

type GameCommandType = (typeof AB)[keyof typeof AB] | "reset"

export interface GameCommand {
  type: GameCommandType
}

export interface PhaserGameState {
  commandQueue: GameCommand[]
}

const initialState: PhaserGameState = Object.freeze({
  commandQueue: [],
})

const phaserGameSlice = createSlice({
  name: "phaserGame",
  initialState,
  reducers: create => ({
    pushToCommandQueue: create.reducer(
      (state, action: PayloadAction<GameCommand>) => {
        state.commandQueue.push(action.payload)
      },
    ),
    popCommandQueue: create.reducer(state => {
      state.commandQueue.pop()
    }),
  }),
  selectors: {
    selectCommandQueue: state => state.commandQueue,
  },
})

export default phaserGameSlice
export const { pushToCommandQueue, popCommandQueue } = phaserGameSlice.actions
export const { selectCommandQueue } = phaserGameSlice.selectors
