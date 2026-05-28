import { useEffect, useRef, useState, type FC } from "react"
import { CircularProgress } from "@mui/material"
// NOTE: `import type` is a TypeScript feature that only imports type
//  information for compile-time type checking. When our TypeScript code is
//  compiled into JavaScript, these type-only imports are completely erased.
//  They do not generate any JavaScript code that would cause the phaser module
//  to be loaded at runtime.
import type { Game } from "phaser"

import { useGameCommands } from "../app/hooks"

export interface PhaserGameProps {}

const PhaserGame: FC<PhaserGameProps> = () => {
  const gameCommands = useGameCommands()
  const [isMounted, setIsMounted] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const gameRef = useRef<Game>(null)

  const backgroundColor = "#a0c53a"

  useEffect(() => {
    // Tells the component it is safe to load Phaser now that we are in the browser
    setIsMounted(true)
    let active = true

    const initPhaser = async () => {
      if (!containerRef.current || !active) return

      // Dynamically import Phaser and our scenes.
      // NOTE: This makes Phaser a browser-only dependency.
      const Phaser = await import("phaser")
      const scenes = await import("./scenes")

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
        scene: [
          scenes.MainScene,
          // scenes.Boot,
          // scenes.Preloader,
          // scenes.MainMenu,
          // scenes.Game,
          // scenes.GameOver,
        ],
      })
    }

    void initPhaser()

    return () => {
      active = false
      if (gameRef.current) {
        gameRef.current.destroy(true)
        gameRef.current = null
      }
    }
  }, [])

  return (
    <>
      {!isMounted && <CircularProgress />}
      <div id="phaser-game" ref={containerRef} style={{ backgroundColor }} />
    </>
  )
}

export default PhaserGame
