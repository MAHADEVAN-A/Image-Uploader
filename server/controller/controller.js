const fs = require('fs');
const Product = require('../model/productSchema');
const Company = require('../model/companySchema');

exports.home = async (req, res) => {
  const all_images = await Product.find();
  res.render('main', { images: all_images });
};

exports.createCompany = async (req, res) => {
  try {
    const data = req.body;
    const comp = await Company.create(data);
    res.send(comp);
  } catch (err) {
    console.log(err);
  }
};

exports.fetchCompany = async (req, res) => {
  try {
    const email = req.body.email;
    const comp = await Company.findOne({ email: email });
    res.status(200).json({ comp });
  } catch (error) {
    console.log(error);
  }
};

exports.getImage = async (req, res) => {
  const all_images = await Product.find();
  res.json(all_images);
};

exports.deleteImage = async (req, res) => {
  const imgID = req.params.id;
  const image = await Product.findOneAndDelete({ _id: imgID });
  if (!image) {
    return res.status(404).json({ msg: `No task with id:${imgID}` });
  }
  res.status(200).json({ image });
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
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      company: req.body.company,
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
