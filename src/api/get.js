const fs = require("fs")
const zlib = require("zlib")
module.exports = (req, res) => {
  console.log(__dirname)
  const cats = fs.readdirSync(`${__dirname}/../zippedcats`)
  const rindex = Math.floor(Math.random() * cats.length)
  if (cats[rindex]) {
    const cat = fs.readFileSync(`${__dirname}/../zippedcats/${cats[rindex]}`)
    res.writeHead(200, {
      "Content-Type": "image/gif",
      "Content-Length": Buffer.byteLength(cat),
    })
    res.end(cat)
  } else res.send({ error: "Oh, no. There are no cats :(" })
}
