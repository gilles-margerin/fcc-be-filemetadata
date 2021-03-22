const cors = require('cors');
const express = require('express');
const fs = require('fs')
const mongoose = require('mongoose')
const tempy = require('tempy')
const fileUpload = require('./controllers/fileUpload');
const multerGridFsUpload = require('./controllers/multerGridFsUpload')
require('dotenv').config();

mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  retryWrites: true,
})

let gfs;

const connection = mongoose.connection;
connection.on('error', () => console.error(console, 'connection error'))
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");

  gfs = new mongoose.mongo.GridFSBucket(connection.db, {
    bucketName: "uploads"
  })
});

const app = express();

app.set('view engine', 'ejs')

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', (req, res) => res.render('index'));

app.get('/api/download', async (req, res) => {
  try {
    await gfs.find().toArray((err, files) => {
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
})

app.get('/api/download/:filename?', async (req, res) => {
  try {
    const tempFile = tempy.file();

    const data = await gfs.openDownloadStreamByName(req.params.filename)
    data.pipe(fs.createWriteStream(tempFile))
    .on('finish', () => {
      console.log('Download finshed');
      console.log(data)
      res.download(tempFile, req.params.filename.slice(30).replace(/--/g, ''))
    })
  } catch (err) {
    console.log(err)
    res.status(500).send(`Error while downloading file : ${err.name}` )
  }
});

app.post('/api/fileanalyse', multerGridFsUpload.array('upfile'), fileUpload)

app.use((req, res) => res.status(404).render('404'))

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});

