const express = require('express');
const mongoose = require('mongoose');
const app = express();

const db = require('./config/keys').mongoURI;

mongoose.connect(db, {
    useCreateIndex: true,
    useNewUrlParser: true
}).then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log(err));


app.get('/', function (req, res) {
    res.send('Hello World!');
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Example app listening on port ${5000}!`);
});
