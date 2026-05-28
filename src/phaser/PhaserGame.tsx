import { useEffect, useRef, useState, type FC } from "react"

import { useGameCommands } from "../app/hooks"

export interface PhaserGameProps {}

const PhaserGame: FC<PhaserGameProps> = () => {
  const gameCommands = useGameCommands()
  const [isMounted, setIsMounted] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const gameRef = useRef<any>(null)

  useEffect(() => {
    // Tells the component it is safe to load Phaser now that we are in the browser
    setIsMounted(true)
    let active = true

    const initPhaser = async () => {
      if (!containerRef.current || !active) return

      // Dynamically import Phaser and our scenes.
      // NOTE: This severs the SSR dependency graph!
      const Phaser = await import("phaser")
      const scenes = await import("./scenes")

      // Find out more information about the Game Config at:
      // https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
      gameRef.current = new Phaser.Game({
        type: Phaser.AUTO,
        width: 1024,
        height: 768,
        parent: containerRef.current,
        backgroundColor: "#028af8",
        scene: [
          scenes.Boot,
          scenes.Preloader,
          scenes.MainMenu,
          scenes.Game,
          scenes.GameOver,
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
    <div id="phaser-game" ref={containerRef}>
      {isMounted ? "Loading Game Canvas..." : "Loading Game Engine..."}
    </div>
  )
}

export default PhaserGame
