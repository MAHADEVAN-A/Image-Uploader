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
    res.json({ msg: 'Successfully created the company profile' });
  } catch (err) {
    console.log(err);
  }
};

exports.deleteCompany = async (req, res) => {
  const compID = req.params.id;
  const comp = await Company.findOneAndDelete({ _id: compID });
  if (!comp) {
    return res.status(404).json({ msg: `No company with id:${compID}` });
  }
  res.status(200).json({ msg: 'Success' });
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

exports.fetchAllCompany = async (req, res) => {
  try {
    // console.log('fetching...');
    const comp = await Company.find();
    res.status(200).json({ comp });
  } catch (error) {
    console.log(error);
  }
};

// exports.getProduct = async (req, res) => {
//   const all_products = await Product.find().populate('company');
//   res.json(all_products);
// };

exports.getProducts = async (req, res) => {
  const compID = req.params.id;
  const products = await Product.find({ company: compID });
  res.status(200).json({ products });
};

exports.deleteProduct = async (req, res) => {
  const prodID = req.params.id;
  const prod = await Product.findOneAndDelete({ _id: prodID });
  if (!prod) {
    return res.status(404).json({ msg: `No product with id:${prodID}` });
  }
  res.status(200).json({ msg: 'Success' });
};

exports.uploadProduct = (req, res, next) => {
  // console.log('files', req.files);
  console.log('body', req.body);
  // console.log(req.body.images.substring(22));
  // const files = req.files;
  // if (!files) {
  //   const error = new Error('Please choose files');
  //   error.httpStatusCode = 400;
  //   return next(error);
  // }

  //convert images into base64 encoding
  // let imgArray = files.map((file) => {
  //   let img = fs.readFileSync(file.path);
  //   return (encode__image = img.toString('base64'));
  // });

  // let result = imgArray.map((src, index) => {
  //create object to store data in collection
  let finalimg = {
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    company: req.params.id,
    filename: 'image' + new Date().valueOf(),
    contentType: req.body.images.substring(0, 23),
    imageBase64: req.body.images.substring(23),
  };
  console.log(finalimg);
  let newUpload = new Product(finalimg);
  newUpload
    .save()
    .then((data) => {
      console.log('successfully uploaded image');
      res.json({ msg: 'successfully uploaded image' });
    })
    .catch((error) => {
      if (error) {
        if (error.name === 'MongoError' && error.code === 11000) {
          res.json({
            error: `Duplicate. File already exists`,
          });
        }
        res.json({
          error: error.message || `Cannot upload, something missing`,
        });
      }
    });

  // Promise.all(result)
  //   .then((msg) => {
  //     res.json(msg);
  //     // res.redirect('/');
  //   })
  //   .catch((error) => {
  //     res.json(error);
  //   });
};
