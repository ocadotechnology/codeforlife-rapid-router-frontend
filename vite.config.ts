import {
  viteConfig as workspaceViteConfig,
  vitestConfig as workspaceVitestConfig,
} from "@codeforlife/workspace/vite.config.ts"
import {
  mergeConfig as mergeViteConfig,
  defineConfig as defineViteConfig,
} from "vite"
import { mergeConfig as mergeVitestConfig } from "vitest/config"

const viteConfig = mergeViteConfig(
  workspaceViteConfig,
  defineViteConfig({
    ssr: {
      // Phaser is a browser-only game engine that relies on Web APIs like
      // Canvas and WebGL, which don't exist in a Node environment. By marking
      // Phaser as external, we prevent Vite from trying to bundle it for SSR,
      // which would lead to errors about missing modules or APIs. Instead,
      // Phaser will be treated as an external dependency that is only loaded
      // in the browser, allowing the SSR build to succeed without issues.
      external: ["phaser"],
    },
    build: {
      // Phaser is a massive game engine. Even when heavily minified, the core
      // engine often hovers around or above 500 KB (default) so setting to 1000
      // tells Vite, "I know this file is huge, don't warn me about it."
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          // Tells the bundler to isolate the entire Phaser engine into its own
          // dedicated file (e.g., phaser-[hash].js) rather than mixing it
          // together with the React UI code. This is necessary because:
          // 1. Browser caching: Phaser is a heavy dependency, but its code
          //  rarely changes (unless the version is upgraded). If Phaser is
          //  grouped into its own file, the user's browser will download it
          //  once and cache it permanently.
          // 2. Parallel Downloading: By isolating Phaser, the browser can
          //  download it in parallel with the app code, improving load times.
          // 3. Faster UI Render: Because the React code is separated from
          //  the massive engine block, the browser can parse and render the UI
          //  almost instantly, before it has even finished evaluating the heavy
          //  game engine logic.
          manualChunks: { phaser: ["phaser"] },
        },
      },
    },
  }),
)

export default mergeVitestConfig(viteConfig, workspaceVitestConfig)
