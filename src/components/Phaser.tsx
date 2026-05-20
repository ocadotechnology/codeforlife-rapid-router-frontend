import { forwardRef, useEffect, useRef } from "react"
import { EventBus } from "./game/EventBus"
// import StartGame from "./game/main"

export interface IRefPhaser {
  game: Phaser.Game | null
  scene: Phaser.Scene | null
}

interface IProps {
  currentActiveScene?: (scene_instance: Phaser.Scene) => void
}

export const Phaser = forwardRef<IRefPhaser, IProps>(function Phaser(
  { currentActiveScene },
  ref,
) {
  const game = useRef<Phaser.Game | null>(null)

  useEffect(() => {
    if (game.current === null) {
      import("./game/main")
        .then(module => {
          // Handles both default or named exports safely
          const StartGame = module.StartGame || module.default

          game.current = StartGame("game-container")

          if (typeof ref === "function") {
            ref({ game: game.current, scene: null })
          } else if (ref) {
            ref.current = { game: game.current, scene: null }
          }
        })
        .catch(error => {
          console.error("Failed to load the Phaser game module:", error)
        })
    }

    return () => {
      if (game.current) {
        game.current.destroy(true)
        if (game.current !== null) {
          game.current = null
        }
      }
    }
  }, [ref])

  useEffect(() => {
    EventBus.on("current-scene-ready", (scene_instance: Phaser.Scene) => {
      if (currentActiveScene && typeof currentActiveScene === "function") {
        currentActiveScene(scene_instance)
      }

      if (typeof ref === "function") {
        ref({ game: game.current, scene: scene_instance })
      } else if (ref) {
        ref.current = { game: game.current, scene: scene_instance }
      }
    })
    return () => {
      EventBus.removeListener("current-scene-ready")
    }
  }, [currentActiveScene, ref])

  return <div id="game-container"></div>
})
