// middlewares/upload.js
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/images'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    const username = req.body['first-name'].replace(/\s+/g, '_') + '_' + req.body['last-name'].replace(/\s+/g, '_');
    console.log(username)
    cb(null, username + '-' + uniqueSuffix + extension);
  }
});
// console.log("middleware")

const upload = multer({ storage: storage });

module.exports = upload.single('image');
