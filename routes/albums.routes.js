const { Router } = require("express");
const fs = require('fs');

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


// POST save songs
router.post('/save/:id', auth, async (req, res) => {
    try {
        let song = await Song.findById(req.params.id);
        const user = await User.findById(req.user.userId);

        user.saved_songs.push(song);

        await user.save();
        res.status(200).json({ message: 'saved'})
    }
    catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так...' });
    }
})


// 4 tracks
// 4 covers

// POST delete album
router.delete('/delete/:id', auth, async (req, res) => {
    try {
        await Album.findOneAndDelete({ _id: req.params.id}, async (err, album) => {
            if (err) {
                return res.status(500).json({message: `Не удалось удалить альбом ${err}`})
            }

            await fs.unlink(album.cover, (err, cover) => {
                if (err) {
                    return res.status(500).json({ message: `Не удалось удалить обложку - ${err}`, isSuccess: false });
                }

            })

            await album.songs.forEach(async item => {
                await Song.findByIdAndRemove(item, (err, song) => {
                    if (err) {
                        return res.status(500).json({message: `Не удалось удалить песню - ${err}`, isSuccess: false})
                    }

                    return fs.unlink(song.src, () => {
                        console.log('deleted song - ', song)
                    })
                });
            })
            return res.status(200).json({ message: 'Удален 1 альбом', isSuccess: true})

        });
    }
    catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так...' });
    }
});

// GET my songs
router.get('/myAlbums', auth, async (req, res) => {
    try {
        const album = await Album.find({ artist_id: req.user.userId });
        
        if (album) {
            res.status(200).json(album);
        }
        
        else {
            res.status(404).json({ message: "404 not found" });
        }

    }
    catch (e) {
        res.status(500).json({ message: e })
    }
})


// Get songs of album
router.get('/album/:id', async (req, res) => {
    try {
        const album = await Album.findById(req.params.id);
        const songs = await Song.find({ album_id: req.params.id })

        if (songs) {
            // const newAlbum = {...album, songs: songs}
            // album.songs = songs
            album.songs = songs;
            return res.status(200).json({album, isSuccess: true})
        }
        else {
            return res.status(404).json({ message: "404 not found" });
        }
    }
    catch (e) {
        res.status(500).json({ message: e })
    }
})

module.exports = router;