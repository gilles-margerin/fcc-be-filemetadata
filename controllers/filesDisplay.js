const filesDisplay = async (req, res) => {
  try {
    await req.app.locals.gfs.find().toArray((err, files) => {
    if (!files || files.length === 0) {
      res.status(404).send('No files available')
      return
    }
    
    res.render('download', {files: files})
  })
  } catch (err) {
    console.log(err)
    res.status(500).send('Internal server error')
  }
}

module.exports = filesDisplay