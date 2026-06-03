import { type FC, useEffect, useRef, useState } from "react"
import { CircularProgress } from "@mui/material"
// NOTE: `import type` is a TypeScript feature that only imports type
//  information for compile-time type checking. When our TypeScript code is
//  compiled into JavaScript, these type-only imports are completely erased.
//  They do not generate any JavaScript code that would cause the phaser module
//  to be loaded at runtime.
import type { Game } from "phaser"

import { Events, Variables } from "./enums"
import type { Level } from "../api/level"
import { useGameCommands } from "../app/hooks"

export type PhaserGameProps =
  | { mode: "play"; levelId: Level["id"] }
  | { mode: "create"; levelId?: never }

const PhaserGame: FC<PhaserGameProps> = ({ mode, levelId }) => {
  const gameCommands = useGameCommands()
  const [gameIsInitialized, setGameIsInitialized] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const gameRef = useRef<Game>(null)

  const backgroundColor = "#a0c53a"

  // Initialize Phaser when on mount and destroy it when it's unmounted.
  useEffect(() => {
    let active = true // Used to synchronously guard initialization logic.

    const initPhaser = async () => {
      // Check if the container ref is set and the component is still active.
      if (!containerRef.current || !active) return

      // Dynamically import Phaser and our scenes.
      // NOTE: This makes Phaser a browser-only dependency.
      const Phaser = await import("phaser")
      const scenes = await import("./scenes")

      // Run the checks again to ensure that the component was not unmounted
      // and remounted while the imports were being asynchronously fetched.
      // Otherwise, we might try to create multiple Phaser games on top of each
      // other in the latest component's container.
      if (!containerRef.current || !active) return

      // Find out more information about the Game Config at:
      // https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
      gameRef.current = new Phaser.Game({
        type: Phaser.AUTO,
        scale: {
          // Scale the game to fit inside the parent container while maintaining
          // the aspect ratio.
          mode: Phaser.Scale.FIT,
          // Keep the game canvas centered horizontally and vertically within
          // its container.
          autoCenter: Phaser.Scale.CENTER_BOTH,
          width: "100%", // Use the full width of the parent container.
          height: "100%", // Use the full height of the parent container.
          resizeInterval: 100, // Check for resize every 100ms.
        },
        parent: containerRef.current,
        backgroundColor,
        scene: scenes[mode],
      })
      gameRef.current.registry.set(Variables.LEVEL_ID, levelId)

      setGameIsInitialized(true) // Used to asynchronously trigger a rerender.
    }

    void initPhaser()

    return () => {
      active = false
      if (gameRef.current) {
        gameRef.current.destroy(true)
        gameRef.current = null
      }
    }
  }, [mode])

  // Pass the current game commands to Phaser.
  useEffect(() => {
    // Only set the commands if we're in play mode and the game has been
    // initialized.
    if (mode !== "play" || !gameRef.current) return

    // Save the current commands into the registry.
    gameRef.current.registry.set(Variables.COMMANDS, gameCommands)

    // Tells any currently active scenes to fetch the new data.
    const emitSetCommandsEvent = () => {
      if (gameRef.current) gameRef.current.events.emit(Events.SET_COMMANDS)
    }

    // Immediately emit an event for any active scenes to get the new commands.
    emitSetCommandsEvent()

    // Re-emit the event when the gameplay scene is ready.
    gameRef.current.events.on(Events.GAMEPLAY_SCENE_READY, emitSetCommandsEvent)

    return () => {
      if (!gameRef.current) return
      gameRef.current.events.off(
        Events.GAMEPLAY_SCENE_READY,
        emitSetCommandsEvent,
      )
    }
  }, [mode, gameCommands])

  // // Pass the current level ID to Phaser.
  // useEffect(() => {
  //   if (mode !== "play" || !gameRef.current) return

  //   gameRef.current.registry.set(Variables.LEVEL_ID, levelId)

  //   // // Tells any currently active scenes to fetch the new data.
  //   // const emitSetLevelIdEvent = () => {
  //   //   if (gameRef.current) gameRef.current.events.emit(Events.SET_LEVEL_ID)
  //   // }

  //   // // Immediately emit an event for any active scenes to get the new level ID.
  //   // emitSetLevelIdEvent()
  //   // return () => {}
  // }, [mode, levelId])

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {!gameIsInitialized && (
        <CircularProgress
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      )}
      <div
        id="phaser-game"
        ref={containerRef}
        style={{
          width: "100%",
          height: "100%",
          // Match the background color of the game and the game's container.
          backgroundColor: gameIsInitialized ? backgroundColor : "transparent",
        }}
      />
    </div>
  )
}

export default PhaserGame
