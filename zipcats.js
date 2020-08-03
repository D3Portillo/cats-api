const sharp = require("sharp")
const gresize = require("@gumlet/gif-resize")
const fs = require("fs")
/**
 * The Width to resize cats to
 * @type {Number}
 */
const CATS_WIDTH = 340

/**
 * List of files inside gatos folder to ignore
 * @type {Array<string>}
 */
const ommit = ["./gatos/example.png", "./gatos/README.md"]
const destinationPath = "./src/zippedcats"

/**
 * .gif image resizer
 * @type { ( imageBuffer: Buffer ) => Promise<Buffer> }
 */
const resize = gresize({
  width: CATS_WIDTH,
  optimizationLevel: 3,
  colors: 98,
})

/**
 * Returns a "Unnique" filename to save the cat
 * @type { ( catName: string ) => string }
 */
const giveMeAHash = (name) => {
  const things = "abcdefghijlklmnopqrstuvwxyz0123456789_-"
  const lilHash = [...Array(5)].map(() => {
    const randomIndex = Math.floor(things.length * Math.random())
    return things[randomIndex]
  })
  return `${name}-${new Date().getTime()}${lilHash.join("")}`
}
/**
 * Tries to shrink cat image and return a buffer
 * @param {Buffer} defaultBuffer
 * @param {string} type
 */
const buffCatUp = (defaultBuffer, type) => {
  return new Promise((completeWith) => {
    try {
      if (type != "gif") {
        return sharp(defaultBuffer)
          .flatten()
          .resize({
            width: CATS_WIDTH,
          })
          .jpeg({
            force: true,
            progressive: true,
            quality: 65,
          })
          .toBuffer()
          .then((buffer) => completeWith(buffer))
      }
      resize(defaultBuffer).then((buffer) => completeWith(buffer))
    } catch (error) {
      console.error({ error })
      completeWith(defaultBuffer)
    }
  })
}
fs.readdirSync("./gatos").map((gato) => {
  const catToRead = `./gatos/${gato}`
  const [name, type] = gato.split(".")
  if (!ommit.includes(catToRead)) {
    const cat = fs.readFileSync(catToRead)
    const catPath = `${destinationPath}/${giveMeAHash(name)}`
    buffCatUp(cat, type).then((data) => {
      const fileType = type == "gif" ? type : "jpg"
      fs.writeFileSync(`${catPath}.${fileType}`, data)
    })
  }
})
