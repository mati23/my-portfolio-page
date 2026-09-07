import { BasicPipeline, Vibrant } from "@vibrant/core"
import { BrowserImage } from "@vibrant/image-browser"
import { MMCQ } from "@vibrant/quantizer-mmcq"
import { DefaultGenerator } from "@vibrant/generator-default"

// Use the browser implementation only: no Node image parsers or React peer dependency.
const pipeline = new BasicPipeline()
  .filter.register("default", (r, g, b, a) => a >= 125 && !(r > 250 && g > 250 && b > 250))
  .quantizer.register("mmcq", MMCQ)
  .generator.register("default", DefaultGenerator)
Vibrant.use(pipeline)
Object.assign(Vibrant.DefaultOpts, {
  ImageClass: BrowserImage,
  quantizer: "mmcq",
  generators: ["default"],
  filters: ["default"],
})

export async function extractColors(source) {
  const palette = await Vibrant.from(source).maxColorCount(64).getPalette()
  return Object.values(palette).filter(Boolean).map(swatch => swatch.hex)
}
