const mongoose = require('mongoose');

const companySchema = mongoose.Schema({
  email: {
    type: String,
    required: [true, 'email is required'],
    unique: true,
    match: [/^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/, 'Invalid email'],
  },
  password: {
    type: String,
    required: [true, 'password is required'],
    minlength: [6, 'password should contain at least 6 characters'],
  },
  username: {
    type: String,
    required: [true, 'user name is required'],
    minlength: [4, 'user name should contain at least 4 characters'],
  },
  products: [{
    
  }]
});

module.exports = mongoose.model('Company', companySchema);
