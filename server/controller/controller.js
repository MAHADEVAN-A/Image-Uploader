const fs = require('fs');
const UploadModel = require('../model/schema');

exports.home = async (req, res) => {
  const all_images = await UploadModel.find();
  res.render('main', { images: all_images });
};

exports.uploads = (req, res, next) => {
  const files = req.files;
  if (!files) {
    const error = new Error('Please choose files');
    error.httpStatusCode = 400;
    return next(error);
  }

  //convert images into base64 encoding
  let imgArray = files.map((file) => {
    let img = fs.readFileSync(file.path);
    return (encode__image = img.toString('base64'));
  });

  let result = imgArray.map((src, index) => {
    //create object to store data in collection
    let finalimg = {
      filename: files[index].originalname,
      contentType: files[index].mimetype,
      imageBase64: src,
    };
    let newUpload = new UploadModel(finalimg);
    return newUpload
      .save()
      .then(() => {
        return {
          msg: `${files[index].originalname} image Uploaded Successfully...!`,
        };
      })
      .catch((error) => {
        if (error) {
          if (error.name === 'MongoError' && error.code === 11000) {
            return Promise.reject({
              error: `Duplicate ${files[index].originalname}. File already exists`,
            });
          }
          return Promise.reject({
            error:
              error.message ||
              `Cannot upload ${files[index].originalname} something missing`,
          });
        }
      });
  });

  Promise.all(result)
    .then((msg) => {
      // res.json(msg)
      res.redirect('/');
    })
    .catch((error) => {
      res.json(error);
    });
};
