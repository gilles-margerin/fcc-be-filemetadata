const File = require("../models/File")

const fileUpload = async (req, res) => {
  try {
    const file = await new File({
      originalname: req.file.originalname,
      encoding: req.file.encoding,
      mimetype: req.file.mimetype,
      filename: res.req.file.filename,
      path: req.file.path,
      size: req.file.size
    }).save()
    
    res.json({
      "name": file.originalname,
      "type": file.mimetype,
      "size": file.size
    })
  } catch (err) {
    res.sendStatus(500)
  }
}

module.exports = fileUpload