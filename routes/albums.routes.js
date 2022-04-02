const { Router } = require("express");
const fs = require('fs');
const path = require('path');

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
});


// POST delete album
router.delete('/delete/:id', auth, async (req, res) => {
    try {
        const album = await Album.findById(req.params.id);

        if (!album) {
            return res.status(200).json({message: `Альбом не найден`, error: err, isSuccess: false});
        }

        const albumSongs = await Song.find({album_id : album._id }, {
            _id: 1,
            src: 1
        });

        album.songs = albumSongs;
        
        if (album.cover && fs.existsSync(path.resolve(album.cover))) {
            await fs.unlink(album.cover, (err, cover) => {
                if (err) {
                    return res.status(500).json({ message: `Не удалось удалить обложку - ${cover}`, error: err, isSuccess: false });
                }
            });
        }

        await album.songs.forEach(async (item) => {
            fs.unlink(item.src, (err) => {
                if (err) {
                    console.log(err);
                    return res.status(200).json({message: `Не удалось удалить файл - ${item.src}`, isSuccess: false, error: err});
                }
            });
        });

        await album.songs.forEach(async item => {
            await User.updateMany({saved_songs: { $all: [item._id] }}, {
                $pull: {
                   saved_songs: item._id
                } 
            });
        })

        await Song.deleteMany({album_id: album._id});

        await album.delete();

        return res.status(200).json({ message: 'Удален 1 альбом', isSuccess: true})
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