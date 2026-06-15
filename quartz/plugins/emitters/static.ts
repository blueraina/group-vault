import { FilePath, QUARTZ, joinSegments } from "../../util/path"
import { QuartzEmitterPlugin } from "../types"
import fs from "fs"
import { glob } from "../../util/glob"
import { dirname } from "path"

function staticDestination(output: string, fp: string): FilePath {
  if (fp.startsWith("_") && !fp.includes("/")) {
    return joinSegments(output, fp) as FilePath
  }

  return joinSegments(output, "static", fp) as FilePath
}

export const Static: QuartzEmitterPlugin = () => ({
  name: "Static",
  async *emit({ argv, cfg }) {
    const staticPath = joinSegments(QUARTZ, "static")
    const fps = await glob("**", staticPath, cfg.configuration.ignorePatterns)
    const aiSearchIndex = "ai-search-index.json" as FilePath
    if (
      !fps.includes(aiSearchIndex) &&
      fs.existsSync(joinSegments(staticPath, aiSearchIndex) as FilePath)
    ) {
      fps.push(aiSearchIndex)
    }
    const outputStaticPath = joinSegments(argv.output, "static")
    await fs.promises.mkdir(outputStaticPath, { recursive: true })
    for (const fp of fps) {
      const src = joinSegments(staticPath, fp) as FilePath
      const dest = staticDestination(argv.output, fp)
      await fs.promises.mkdir(dirname(dest), { recursive: true })
      await fs.promises.copyFile(src, dest)
      yield dest
    }
  },
  async *partialEmit() {},
})
