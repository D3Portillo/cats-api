const sharp = require("sharp")
const gresize = require("@gumlet/gif-resize")
const fs = require("fs")
const zlib = require("zlib")
const CATS_WIDTH = 385
const resize = gresize({
  width: CATS_WIDTH,
  optimizationLevel: 3,
})
const giveMeAHash = (name) => {
  const things = "abcdefghijlklmnopqrstuvwxyz0123456789_-"
  const lilHash = [...Array(5)].map(() => {
    const randomIndex = Math.floor(things.length * Math.random())
    return things[randomIndex]
  })
  return `${name}-${new Date().getTime()}${lilHash.join("")}`
}
const writeOut = ({ buffer, path }) => {
  const data = zlib.deflateSync(buffer, {
    level: 9,
    memLevel: 4,
    strategy: 2,
  })
  fs.writeFileSync(path, data)
}
fs.readdirSync("./cats").map((catName) => {
  const cat = fs.readFileSync(`./cats/${catName}`)
  const [name, type] = catName.split(".")
  const catPath = `./encoded/${giveMeAHash(name)}`
  if (type != "gif") {
    return sharp(cat)
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
      .then((buffer) => writeOut({ buffer, path: catPath }))
  }
  resize(cat).then((croppedCat) => {
    writeOut({ buffer: croppedCat, path: catPath })
  })
})
