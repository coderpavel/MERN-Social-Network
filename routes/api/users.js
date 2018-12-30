const express = require('express');
const mongoose = require('mongoose');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const router = express.Router();
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');


// Load input validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

const User = require('../../models/User');

// @desc Register user
// @access Public
router.post('/register', (req, res) => {

    const { errors, isValid } = validateRegisterInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

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
    const { errors, isValid } = validateLoginInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email: email })
        .then(user => {
            // Check for user
            if (!user) {
                errors.email = 'User not found';
                return res.status(404).json(errors);
            }

            // Check for pass
            bcrypt.compare(password, user.password).then(isMatch => {


                if (!isMatch) {
                    errors.password = 'Password incorrect';
                    return res.status(400).json(errors);
                }

                const payload = { id: user.id, name: user.name, avatar: user.avatar };

                // JWT
                jwt.sign(
                    payload,
                    keys.secretOrKey,
                    { expiresIn: 3600 },
                    (err, token) => {
                        console.log('OK');
                        res.json({
                            success: true,
                            token: 'Bearer ' + token
                        })
                    });



            });
        });
})

// @desc Return current User
// @access Private

router.get('/current', passport.authenticate('jwt', { session: false }),
    (req, res) => {
        res.json({
            id: req.user.id,
            name: req.user.name,
            email: req.user.email
        });
    });

module.exports = router;



