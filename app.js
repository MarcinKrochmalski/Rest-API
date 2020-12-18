const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const users = require('./routes/users');
const mongoose = require('mongoose');
require('dotenv').config();

//Parse json
app.use(bodyParser.json())

//Routes
app.use('/users/', users);
//..

//connect to MongoDB
mongoose.connect(
    process.env.DB_CONNECTION,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => {
        console.log('connect to MongoDB');
    }
)

app.listen(3000);
