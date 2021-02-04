const mongoose = require('mongoose')
const {Schema} = mongoose

const fileSchema = new Schema({
  originalname: String,
  encoding: String,
  mimetype: String,
  filename: String,
  path: String,
  size: Number
})

const upFile = mongoose.model('File', fileSchema);

module.exports = upFile