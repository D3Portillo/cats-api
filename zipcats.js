const sharp = require("sharp")
const gresize = require("@gumlet/gif-resize")
const fs = require("fs")
const zlib = require("zlib")
const CATS_WIDTH = 385
const ommit = ["./gatos/example.png", "./gatos/README.md"]
const destinationPath = "./src/api/zippedcats"

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
const theCats = []
fs.readdirSync("./gatos").map((gato, index, arr) => {
  const catToRead = `./gatos/${gato}`
  const isLast = index == arr.length - 1
  const [name, type] = gato.split(".")
  if (!ommit.includes(catToRead)) {
    const cat = fs.readFileSync(catToRead)
    const catPath = `${destinationPath}/${giveMeAHash(name)}`
    theCats.push(gato)
    if (type != "gif") {
      sharp(cat)
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
    } else {
      resize(cat).then((croppedCat) => {
        writeOut({ buffer: croppedCat, path: catPath })
      })
    }
  }
  if (isLast) fs.writeFileSync(`${destinationPath}/list`, theCats.join("|"))
})
