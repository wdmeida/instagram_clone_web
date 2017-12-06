const express = require('express');
const consign = require('consign');
const bodyParser = require('body-parser');
const multiparty = require('connect-multiparty');
const allowCors = require('./cors');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(multiparty());
app.use(allowCors);

consign()
  .include('api/routes')
  .then('config/dbConnection.js')
  .into(app);

module.exports = app;