const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose')
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
  gfs = new mongoose.mongo.GridFSBucket(connection.db, {
    bucketName: "uploads"
  })

  console.log("MongoDB database connection established successfully");
});

const app = express();

app.set('view engine', 'ejs')

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', (req, res) => res.render('index'));
app.get('/api/download', async (req, res) => {
  await gfs.find().toArray((err, files) => {
    if (!files || files.lenght === 0) {
      res.status(200).json({
        success: false,
        message: 'No files available'
      })
    }
    
    files.map(file => {
      console.log(file)
    })
    
    res.render('download', {files: files})
  })
})
app.get('/api/download/:filename?', (req, res) => {
  const filename = req.params.filename

  res.send(filename);
})


app.post('/api/fileanalyse', multerGridFsUpload.array('upfile'), fileUpload)

app.use((req, res) => res.status(404).render('404'))

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});

