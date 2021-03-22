const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const filesDisplay = require('./controllers/filesDisplay');
const fileDownload = require('./controllers/fileDownload');
const fileUpload = require('./controllers/fileUpload');
const multerGridFsUpload = require('./controllers/multerGridFsUpload')
require('dotenv').config();

mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  retryWrites: true,
})

const app = express();

let gfs;

const connection = mongoose.connection;
connection.on('error', () => console.error(console, 'connection error'))
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");

  gfs = new mongoose.mongo.GridFSBucket(connection.db, {
    bucketName: "uploads"
  })

  app.locals.gfs = gfs
});


app.set('view engine', 'ejs')

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', (req, res) => res.render('index'));
app.get('/api/download', filesDisplay)
app.get('/api/download/:filename?', fileDownload);
app.post('/api/fileanalyse', multerGridFsUpload.array('upfile'), fileUpload)

app.use((req, res) => res.status(404).render('404'))

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});

