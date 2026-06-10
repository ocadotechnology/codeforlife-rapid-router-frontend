import BaseScene from "./BaseScene"

export default class BasePreloader<
  Data extends object | undefined = undefined,
> extends BaseScene<Data> {
  static KEY = "Preloader"

  // Blob URLs created during preload; revoked in create() once textures are
  // cached by Phaser.
  private blobUrls: string[] = []

  init() {
    // We loaded this image in our Boot Scene, so we can display it here
    this.add.image(512, 384, "logo")

    // A simple progress bar. This is the outline of the bar.
    this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff)

    // This is the progress bar itself. It will increase in size from the left
    // based on the % of progress.
    const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff)

    // Use the 'progress' event emitted by the LoaderPlugin to update the
    // loading bar
    this.load.on("progress", (progress: number) => {
      //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
      bar.width = 4 + 460 * progress
    })
  }

  /**
   * This helper function creates a Blob URL from the given SVG content.
   * Phaser's XHRLoader can load SVGs from URLs, but it doesn't handle data URLs
   * that are URI-encoded (which is what Vite produces for small assets by
   * default). By creating a Blob URL, we can ensure that Phaser can load the
   * SVGs correctly.
   *
   * This requires us to keep track of the generated Blob URLs so that we can
   * revoke them after Phaser has cached the textures, which we do in the
   * create() method.
   *
   * All SVGs should imported as raw strings (using ?raw) and passed through
   * this function to create Blob URLs.
   *
   * @param svgContent The raw SVG content as a string (?raw).
   * @returns The Blob URL representing the SVG content.
   */
  makeSvgBlobUrl(svgContent: string): string {
    const blob = new Blob([svgContent], { type: "image/svg+xml" })
    const url = URL.createObjectURL(blob)
    this.blobUrls.push(url)
    return url
  }

  create() {
    // Revoke blob URLs now that Phaser has cached all textures.
    this.blobUrls.forEach(url => URL.revokeObjectURL(url))
    this.blobUrls = []
  }
}
