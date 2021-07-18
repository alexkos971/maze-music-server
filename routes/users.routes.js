const { Router } = require("express");
const User = require("../models/User");
const Song = require("../models/Song");
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
        const artist = await User.findById(req.params.id);

        if (!artist) {
            return res.json(404).json({ message: 'Не найдено' })
        }
        const {avatar, email, name, songs, albums, _id, followers, listenings} = artist;

        const newArtist = { 
            avatar, email, name, songs, albums, _id, followers, listenings
        };
        res.json(newArtist);
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
            me.saved_songs.map(async (item) => {
                const songs = await Song.find({ _id: item })
                me.saved_songs = songs;
                res.status(200).send(me);
                return item;
            })
            // let profile = Object.assign(me._doc, { avatar });
        }
    }
    catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так...' });
    }
});

module.exports = router;