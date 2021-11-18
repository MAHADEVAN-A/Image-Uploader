const multer = require('multer');

//set Storage

var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads');
//   },
  filename: function (req, file, cb) {
    // console.log(req.files);
    var ext = file.originalname.substr(file.originalname.lastIndexOf('.'));
    cb(null, file.fieldname + '-' + Date.now() + ext);
  },
});

store = multer({ storage: storage });

module.exports = store;
