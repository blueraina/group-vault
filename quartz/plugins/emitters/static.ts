import { FilePath, QUARTZ, joinSegments } from "../../util/path"
import { QuartzEmitterPlugin } from "../types"
import fs from "fs"
import { glob } from "../../util/glob"
import { dirname, join, relative } from "path"

function staticDestination(output: string, fp: string): FilePath {
  if (fp.startsWith("_") && !fp.includes("/")) {
    return joinSegments(output, fp) as FilePath
  }

  return joinSegments(output, "static", fp) as FilePath
}

function toFilePath(fp: string): FilePath {
  return fp.split("\\").join("/") as FilePath
}

function collectGeneratedAiSearchFiles(staticPath: string): FilePath[] {
  const generated: FilePath[] = []
  const index = join(staticPath, "ai-search-index.json")
  const shardRoot = join(staticPath, "ai-search-index-shards")

  if (fs.existsSync(index)) {
    generated.push("ai-search-index.json" as FilePath)
  }

  if (!fs.existsSync(shardRoot)) return generated

  const visit = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const absolute = join(dir, entry.name)
      if (entry.isDirectory()) {
        visit(absolute)
      } else if (entry.isFile()) {
        generated.push(toFilePath(relative(staticPath, absolute)))
      }
    }
  }

  visit(shardRoot)
  return generated
}

export const Static: QuartzEmitterPlugin = () => ({
  name: "Static",
  async *emit({ argv, cfg }) {
    const staticPath = joinSegments(QUARTZ, "static")
    const fps = await glob("**", staticPath, cfg.configuration.ignorePatterns)
    for (const fp of collectGeneratedAiSearchFiles(staticPath)) {
      if (!fps.includes(fp)) fps.push(fp)
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
