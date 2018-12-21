const express = require('express');
const mongoose = require('mongoose');

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

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

// Routes
app.use('routes/api/users', users);
app.use('routes/api/profile', profile);
app.use('routes/api/posts', posts);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Example app listening on port ${5000}!`);
});
