const tempy = require('tempy')
const fs = require('fs')

const fileDownload = async (req, res) => {
  try {
    const tempFile = tempy.file();

    await req.app.locals.gfs.openDownloadStreamByName(req.params.filename)
    .pipe(fs.createWriteStream(tempFile))
    .on('finish', () => {
      console.log('Download finshed');
      res.download(tempFile, req.params.filename.slice(30).replace(/--/g, ''))
    })
  } catch (err) {
    console.log(err)
    res.status(500).send(`Error while downloading file : ${err.name}` )
  }
}

module.exports = fileDownload