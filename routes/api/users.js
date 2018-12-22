const express = require('express');
const mongoose = require('mongoose');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const router = express.Router();

const User = require('../../models/User');

// @desc Register user
// @access Public
router.post('/register', (req, res) => {
    User.findOne({
        email: req.body.email
    })
        .then(user => {
            if (user) {
                return res.status(400).json({ email: 'email already exists' });
            } else {

                const avatar = gravatar.url(req.body.email, {
                    s: '200', // Size
                    r: 'pg', // Rating
                    d: 'rm' // Default
                });

                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    avatar, // the same: avatar: avatar
                    password: req.body.password
                });


                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser.save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err));

                    });
                });
            }
        });
});

// @desc Login user/ Return JWT
// @access Public

router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    
    User.findOne({ email: email})
    .then(user => {
        // Check for user
        if(!user) return res.status(404).json({email: "User not found"});
        
        // Check for pass
        bcrypt.compare(password, user.password).then((isMatch) => {
            if (!isMatch) return res.status(400).json({ password: "Passord Incorrect"}); 
            res.json({ msg: 'Succes' });
        });
    });
})

module.exports = router;



