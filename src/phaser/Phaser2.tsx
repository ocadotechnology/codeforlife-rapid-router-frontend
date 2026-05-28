import { forwardRef, useEffect, useLayoutEffect, useRef } from "react"
import { EventBus } from "./game/EventBus"
import StartGame from "./game/main"

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

  useLayoutEffect(() => {
    if (game.current === null) {
      game.current = StartGame("game-container")

      if (typeof ref === "function") {
        ref({ game: game.current, scene: null })
      } else if (ref) {
        ref.current = { game: game.current, scene: null }
      }
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

//////

// function PhaserGame2() {
//   // The sprite can only be moved in the MainMenu Scene
//   const [canMoveSprite, setCanMoveSprite] = useState(true)

//   //  References to the Phaser component (game and scene are exposed)
//   const phaserRef = useRef<IRefPhaser | null>(null)
//   const [spritePosition, setSpritePosition] = useState({ x: 0, y: 0 })

//   const changeScene = () => {
//     if (phaserRef.current) {
//       const scene = phaserRef.current.scene as MainMenu

//       if (scene) {
//         scene.changeScene()
//       }
//     }
//   }

//   const moveSprite = () => {
//     if (phaserRef.current) {
//       const scene = phaserRef.current.scene as MainMenu

//       if (scene && scene.scene.key === "MainMenu") {
//         // Get the update logo position
//         scene.moveLogo(({ x, y }) => {
//           setSpritePosition({ x, y })
//         })
//       }
//     }
//   }

//   const addSprite = () => {
//     if (phaserRef.current) {
//       const scene = phaserRef.current.scene

//       if (scene) {
//         // Add more stars
//         const x = Phaser.Math.Between(64, scene.scale.width - 64)
//         const y = Phaser.Math.Between(64, scene.scale.height - 64)

//         //  `add.sprite` is a Phaser GameObjectFactory method and it returns a Sprite Game Object instance
//         const star = scene.add.sprite(x, y, "star")

//         //  ... which you can then act upon. Here we create a Phaser Tween to fade the star sprite in and out.
//         //  You could, of course, do this from within the Phaser Scene code, but this is just an example
//         //  showing that Phaser objects and systems can be acted upon from outside of Phaser itself.
//         scene.add.tween({
//           targets: star,
//           duration: 500 + Math.random() * 1000,
//           alpha: 0,
//           yoyo: true,
//           repeat: -1,
//         })
//       }
//     }
//   }

//   // Event emitted from the PhaserGame component
//   const currentScene = (scene: Phaser.Scene) => {
//     setCanMoveSprite(scene.scene.key !== "MainMenu")
//   }

//   return (
//     <div id="app">
//       <PhaserGame ref={phaserRef} currentActiveScene={currentScene} />
//       <div>
//         <div>
//           <button className="button" onClick={changeScene}>
//             Change Scene
//           </button>
//         </div>
//         <div>
//           <button
//             disabled={canMoveSprite}
//             className="button"
//             onClick={moveSprite}
//           >
//             Toggle Movement
//           </button>
//         </div>
//         <div className="spritePosition">
//           Sprite Position:
//           <pre>{`{\n  x: ${spritePosition.x}\n  y: ${spritePosition.y}\n}`}</pre>
//         </div>
//         <div>
//           <button className="button" onClick={addSprite}>
//             Add New Sprite
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }
