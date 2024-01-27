const express = require('express');
const bodyParser = require('body-parser');
const {sequelize} = require('./models/index')
const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize)

const {jobRouter, contractRouter, adminRouter} = require('./routes/index')

app.use('/', jobRouter);
app.use('/', contractRouter);
app.use('/', adminRouter);

module.exports = app;
