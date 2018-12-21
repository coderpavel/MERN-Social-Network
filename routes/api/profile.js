const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

router.get('/test', (req, res) => {
    res.json({ msg: "Profile Works" });
});

module.exports = router;