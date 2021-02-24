const dayjs = require('dayjs')
const multer = require('multer')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads')
  },

  filename: (req, file, cb) => {
    cb(null, dayjs().toString() + `--${file.originalname}--` )
  }
})

const multerUpload = multer({
  storage: storage,
  limits: {
    fileSize: 10485760,
    files: 5
  }
})

module.exports = multerUpload