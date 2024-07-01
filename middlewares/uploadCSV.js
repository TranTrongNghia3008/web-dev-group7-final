const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '../public/files'));
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  })

const csvFilter = function(req, file, cb) {
    // Chỉ chấp nhận file .csv
    if (!file.originalname.match(/\.(csv)$/)) {
        req.fileValidationError = 'Only .csv files are allowed!';
        return cb(new Error('Only .csv files are allowed!'), false);
    }
    // Giới hạn kích thước file không quá 1MB
    if (file.size > 1000000) {
        req.fileValidationError = 'File size exceeds 1MB!';
        return cb(new Error('File size exceeds 1MB!'), false);
    }
    cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: csvFilter }).single('csvFile');

module.exports = upload;
