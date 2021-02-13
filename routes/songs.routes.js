const { Router } = require("express");
const getDuration = require('get-audio-duration');
const fs = require('fs');
const request = require('request');

const Song = require('../models/Song');
const User = require('../models/User');
const Album = require('../models/Album');

const auth = require('../middleware/auth.middleware');

const router = Router();

// GET Songs for you
router.get('/recomendation', async (req, res) => {
    try {
        const songs = await Song.find();
        res.json(songs);
    }
    catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так...' });
    }
});

// GET my songs
router.get('/saved', auth, async (req, res) => {
    try {
        const songs = await Song.find({ artist_id: req.user.userId });
        res.json(songs);
    }
    catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так...' });
    }
});

// POST save songs
router.post('/save/:id', auth, async (req, res) => {
    try {
        let song = await Song.findById(req.params.id);

        const userId = req.user.userId;

        let check = await song.owner.map(item => {
            if (item === userId) {
                return true;
            }
            return false;
        });

        if (check) {
            song.owner = song.owner.filter(item => item !== userId);
        }
        song.owner.push(userId);
        
        await song.save();
        
        res.json({ saved: check})
    }
    catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так...' });
    }
});

// POST upload track
router.post('/upload', auth, async (req, res) => {
    try {
        const { name, src, lyrics, cover } = req.body;

        const candidate = await Song.findOne({ src });

        if (candidate) {
            return res.status(400).json({ message: 'Такой трек уже существует' })
        } 

        // // Template of song time
        // let timeTemplate = s => {
        //     return (s - (s %= 60)) / 60 + (10 < s ? ':' : ':0') + ~~(s);
        // }


        const artist = await User.findById({ _id: req.user.userId });
        // const stream = fs.createReadStream(src);
        // const duration = await 
        // const stream = request.get(src)
        // .on('response', function(response) {
        //   console.log(response.statusCode) // 200
        //   console.log(response.headers['content-type']) // 'image/png'
        // })
        // getDuration.getAudioDurationInSeconds(stream).then((d) => {
            // console.log(d);
        // })
        // const album = await Album.findById(album_id);

        const song = new Song({
            name,
            artist_name: artist.name,
            artist_id: req.user.userId,
            // duration: duration,
            // album_name: album.name,
            // album_id,
            cover,
            src,
            lyrics
        })


        await song.save()

        artist.songs.push(song);
        
        await artist.save(); 

        res.status(200).json({ message: "Track is uploaded", track: song })

    }
    catch (e) {
        res.status(500).json({ message: `Что-то пошло не так... ${e}` })
    }

});

// GET my songs

router.get('/mySongs', auth, async (req, res) => {
    try {
        const songs = await Song.find({ artist_id: req.user.userId })

        if (songs) {
            return res.status(200).json({ songs, id: req.params.id })
        }
    }
    catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так...' })
    }
})

module.exports = router;