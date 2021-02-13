const { Router } = require("express");
const User = require("../models/User");
const auth = require('../middleware/auth.middleware');

const router = Router();


// GET Artists
router.get('/artists', async (req, res) => {
    try {
        const artists = await User.find();
        res.json(artists);
    }
    catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так...' });
    }
});

// GET Artist
router.get('/artist/:id', async (req, res) => {
    try {
        const artists = await User.findById(req.params.id);
        res.json(artists);
    }
    catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так...' });
    }
});

// GET User
router.get('/profile', auth, async (req, res) => {
    try {
        const me = await User.findOne({ _id: req.user.userId});

        if (me) {
            // let profile = Object.assign(me._doc, { avatar });

            res.send(me);
        }
    }
    catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так...' });
    }
});

module.exports = router;