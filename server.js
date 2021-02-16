const fs = require('fs')
const path = require('path')
const cors = require('cors');
const dayjs = require('dayjs')
const express = require('express');
const mongoose = require('mongoose')
const multer = require('multer');
const fileUpload = require('./controllers/fileUpload');
require('dotenv').config();

mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  retryWrites: true,
})

const connection = mongoose.connection;
connection.on('error', console.error.bind(console, 'connection error'))
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

const app = express();
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function(req, file, cb) {
    cb(null, dayjs().toString() + path.extname(file.originalname))
  }
})
const upload = multer({storage: storage})

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/fileanalyse', upload.single('upfile'), fileUpload)

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});
