const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('mongodb');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const PORT = 3000;

app.listen(PORT);

console.log('Server listen in port ' + PORT);