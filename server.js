const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose')
const multer = require('multer');
const upFile = require('./models/file');
require('dotenv').config();
require('./models/file');
const upload = multer({dest: './uploads'})

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

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/fileanalyse', upload.single('upfile'), async (req, res) => {
  const file = new upFile(req.file);
  const result = await file.save().catch(err => console.log(err))

  res.send({
    name: result.originalname,
    type: result.mimetype,
    size: result.size
  })
})

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});
