const File = require("../models/File")

const fileUpload = async (req, res) => {
  try {    
    const filesData = []

    for (const file of req.files) {
        const savedFile = await new File({
        originalname: file.originalname,
        encoding: file.encoding,
        mimetype: file.mimetype,
        filename: file.filename,
        path: file.path,
        size: file.size
      }).save()

      filesData.push({
        name: savedFile.originalname,
        type: savedFile.mimetype,
        size: savedFile.size
      })
    }
    
    res.render('upload-confirm', {filesData: filesData})
  } catch (err) {
    res.status(500).send(`Error: ${err.name}`)
  }
}

module.exports = fileUpload