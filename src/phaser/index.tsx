// WARN: Do not import Phaser or any file that statically imports Phaser as it
// will be imported by our SSR code and break the build!
export { default as PhaserGame, type PhaserGameProps } from "./PhaserGame"
