const route = require('express').Router();

const controller = require('../controller/controller');
const store = require('../middleware/multer');

route.get('/', controller.home);

route.get('/product/:id', controller.getProducts);

route.delete('/product/:id', controller.deleteProduct);

route.post('/product/:id', store.single('images'), controller.uploadProduct);

route.get('/company', controller.fetchAllCompany);

route.post('/company', controller.createCompany);

route.delete('/company/:id', controller.deleteCompany);

module.exports = route;
