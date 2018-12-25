const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

const app = express();
/*
const db = require('./config/keys').mongoURI;

mongoose.connect(db, {
    useCreateIndex: true,
    useNewUrlParser: true
}).then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log(err));

*/

mongoose.connect('mongodb://localhost/mern', {
    useCreateIndex: true,
    useNewUrlParser: true
}).then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log('Could not connect to MongoDB'));

app.use(passport.initialize());
// Passport config
require('./config/passport')(passport);

// parse various different custom JSON types as JSON
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json({ type: 'application/*+json' }))


app.get('/', function (req, res) {
    res.send('Hello World!');
});

// Routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Example app listening on port ${5000}!`);
});
