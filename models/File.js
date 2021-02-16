const mongoose = require('mongoose')
const {Schema} = mongoose

const fileSchema = new Schema({
  originalname: String,
  encoding: String,
  mimetype: String,
  filename: String,
  size: Number
})

const File = mongoose.model('File', fileSchema);

module.exports = File