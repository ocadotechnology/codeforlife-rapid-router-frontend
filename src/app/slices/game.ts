import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice } from "codeforlife/slices"

export const GAME_COMMANDS = [
  "moveForwards",
  "turnLeft",
  "turnRight",
  "turnAround",
  "wait",
  "deliver",
  "soundHorn",
] as const
export type GameCommand = (typeof GAME_COMMANDS)[number]

export interface GameState {
  gameCommands: GameCommand[]
  gameCommandIndex: number
}

const startGameCommandIndex = -1 // indicates start before the first command
const initialState: GameState = Object.freeze({
  gameCommands: [],
  gameCommandIndex: startGameCommandIndex,
})

// Helper functions to determine game state.
function gameIsDefined(state: GameState): boolean {
  return state.gameCommands.length > 0
}
function gameHasStarted(state: GameState): boolean {
  return state.gameCommandIndex > startGameCommandIndex
}
function gameHasFinished(state: GameState): boolean {
  return state.gameCommandIndex === state.gameCommands.length
}
function gameInPlay(state: GameState): boolean {
  return gameHasStarted(state) && !gameHasFinished(state)
}

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: create => ({
    setGameCommands: create.reducer(
      (state, action: PayloadAction<GameCommand[]>) => {
        state.gameCommands = action.payload
        state.gameCommandIndex = startGameCommandIndex
      },
    ),
    nextGameCommand: create.reducer(state => {
      if (gameIsDefined(state)) {
        state.gameCommandIndex = gameHasFinished(state)
          ? startGameCommandIndex
          : state.gameCommandIndex + 1
      }
    }),
    restartGame: create.reducer(state => {
      state.gameCommandIndex = startGameCommandIndex
    }),
  }),
  selectors: {
    selectGameCommands: state => state.gameCommands,
    selectCurrentGameCommand: state =>
      gameInPlay(state)
        ? state.gameCommands[state.gameCommandIndex]
        : undefined,
    selectGameHasStarted: gameHasStarted,
    selectGameHasFinished: gameHasFinished,
  },
})

export const { setGameCommands, nextGameCommand, restartGame } =
  gameSlice.actions
export const {
  selectGameCommands,
  selectCurrentGameCommand,
  selectGameHasStarted,
  selectGameHasFinished,
} = gameSlice.selectors
