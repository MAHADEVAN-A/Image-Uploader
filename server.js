require('dotenv').config();
const express = require('express');
const app = express();

const cors = require('cors');

const hbs = require('express-handlebars');
const path = require('path');
app.use(cors());
app.use(express.json());

//serving static files
app.use(express.static(path.join(__dirname, 'public')));

//connect mongodb database
require('./server/database/database')();

//setup view engine
app.set('view engine', 'hbs');
app.engine(
  'hbs',
  hbs({
    extname: 'hbs',
    defaultView: 'default',
    layoutsDir: path.join(__dirname, 'views'),
    partialsDir: path.join(__dirname, 'views/partials'),
  })
);

//routes
app.use('/', require('./server/router/router'));

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`http://localhost:${port}`));
