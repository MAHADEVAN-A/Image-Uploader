const route = require('express').Router();

const controller = require('../controller/controller')
const store = require('../middleware/multer')

route.get('/',controller.home);

route.get('/product',controller.getProduct);

route.delete('/product/:id',controller.deleteProduct);

route.post('/product/:id',store.array('images',12),controller.uploadProduct)

route.get('/company',controller.fetchAllCompany);

route.post('/company',controller.createCompany);




module.exports = route;
