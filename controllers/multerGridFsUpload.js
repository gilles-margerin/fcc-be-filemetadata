const dayjs = require('dayjs')
const multer = require('multer')
const GridFsStorage = require('multer-gridfs-storage')
require('dotenv').config()

const storage = new GridFsStorage({
  url: process.env.DB_URI,
  file: (req, file) => {
    return {
      bucketName: 'uploads',
      filename: dayjs().toString() + '---' + file.originalname,
    }
  }
})

const multerGridFsUpload = multer({
  storage: storage,
  limits: {
    fileSize: 10485760,
    files: 5
  }
})

module.exports = multerGridFsUpload