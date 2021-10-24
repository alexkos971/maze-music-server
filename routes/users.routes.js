const { Router } = require("express");
const User = require("../models/User");
const Song = require("../models/Song");
const Album = require('../models/Album');
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
        const {avatar, email, name, albums, _id, followers, listenings, description} = artist;
        
        const songs = await Song.find({ artist_id: artist._id });

        const newArtist = { 
            avatar, email, name, songs, albums, _id, followers, listenings, description
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
            me.password = null;

            const songs = await Song.find({ artist_id: me._id, type: 'Single track' });
            
            if (songs) {
                me.songs = songs;
            }

            const albums = await Album.find({ artist_id: me._id }) 

            if (albums) {
                me.albums = albums;
            }

            if (me.saved_songs && me.saved_songs.length > 0) {             
                const saved = await Song.find({ _id: { $in: me.saved_songs } })
                me.saved_songs = saved;
            }

            return res.status(200).json(me);
        }
    }
    catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так...' });
    }
});

module.exports = router;