const { Router } = require("express");
const User = require("../models/User");
const Song = require("../models/Song");
const Album = require('../models/Album');
const auth = require('../middleware/auth.middleware');

const router = Router();


// GET Artists
router.get('/artists', async (req, res) => {
    try {
        const artists = await User.find({}, {
            name: 1,
            _id: 1,
            followers: 1,
            avatar: 1,
            listenings: 1,
            albums: 1
        });

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
        let me = await User.findById({ _id: req.user.userId});

        if (me) {
            me.password = null;

            const albums = await Album.find({ artist_id: req.user.userId }) 

            if (albums) {
                me.albums = albums;
            }

            if (me.saved_songs && me.saved_songs.length > 0) {             
                let saved = await Song.find({ _id: { $in: me.saved_songs } })
                // await me.saved_songs.map(item => item.saved = true);
                me.saved_songs = saved;
            }

            let songs = await Song.find({ artist_id: me._id });
        
            if (songs) {
                
                // me.songs = await songs.map(item => {
                //     if (me.saved_songs && me.saved_songs.length > 0) {
                //         item.saved = me.saved_songs.some(elem => elem._id === item._id)
                //     }
                //     else {
                //         item.saved = false;
                //     }
                //     return item;
                // });

                me.songs = songs;
            }

            me.text = true;

            return res.status(200).json({isSuccess: true, profile: me});
        }
    }
    catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так...' });
    }
});

module.exports = router;