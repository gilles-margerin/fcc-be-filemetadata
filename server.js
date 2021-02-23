const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose')
const fileUpload = require('./controllers/fileUpload');
const multerUpload = require('./controllers/multerUpload')
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

app.set('view engine', 'ejs')

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', (req, res) => res.render('index'));
app.get('/api/download', (req, res) => res.render('download'))

app.post('/api/fileanalyse', multerUpload.array('upfile'), fileUpload)

app.use((req, res) => res.status(404).render('404'))

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});

