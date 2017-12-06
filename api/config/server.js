const express = require('express');
const consign = require('consign');
const bodyParser = require('body-parser');
const multiparty = require('connect-multiparty');
const allowCors = require('./cors');

const api = express();

api.use(bodyParser.urlencoded({ extended: true }));
api.use(bodyParser.json());
api.use(multiparty());
api.use(allowCors);

consign()
  .include('api/routes')
  .then('config/dbConnection.js')
  .into(api);

module.exports = api;