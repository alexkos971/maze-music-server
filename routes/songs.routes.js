const { Router } = require("express");

const Song = require('../models/Song');
const User = require('../models/User');
const fs = require('fs');

const auth = require('../middleware/auth.middleware');

const router = Router();

// GET Songs for you
router.get('/recomendation', async (req, res) => {
    try {
        const songs = await Song.find({ type: 'Single track' });
        res.json(songs);
    }
    catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так...' });
    }
});

// GET saved songs
router.get('/saved', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);

        if (user.saved_songs && user.saved_songs.length > 0) {
            const songs = await Song.find({ _id: { $in: user.saved_songs } })
            
            if (songs) {
                console.log(songs)
                return res.status(200).json(songs);
            }
        }
        else {
            return res.status(404).json({message: 'Нет сохраненныйх песен'})
        }
    }
    catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так...' })
    }
})


// POST save song
router.put('/save/:id', auth, async (req, res) => {
    try {
        const isSaved = req.body.isSaved;

        if (isSaved) {
            await User.findOneAndUpdate({_id: req.user.userId}, {
                $pull: {
                    saved_songs: req.params.id
                }
            });
        }
        else {
            await User.findOneAndUpdate({_id: req.user.userId}, {
                $push: {
                    saved_songs: req.params.id
                }
            });
        }
        
        return res.status(200).json({
            message: isSaved ? 'unsaved' : 'saved',
            isSuccess: true,
            song: req.params.id
        });
    }
    catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так...', isSuccess: false });
    }
})


// POST delete songs
router.delete('/delete/:id', auth, async (req, res) => {
    try {
        return await Song.findOneAndDelete({ _id: req.params.id}, async (err, song) => {
            if (err) {
                return res.status(500).json({ message: "Не удалось удалить трек", isSuccess: false })
            }

            await fs.unlink(song.cover, (err, cover) => {
                if (err) {
                    return res.status(500).json({ message: `Не удалось удалить обложку - ${err}`, isSuccess: false });
                }
                
            })
            
            await fs.unlink(song.src, (err, song) => {
                if (err) {
                    return res.status(500).json({ message: `Не удалось удалить трек - ${err}`, isSuccess: false });
                }
            });
            return res.status(200).json({ message: 'Удален 1 трек', isSuccess: true, song: song._id})
        });
        
    }
    catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так...' });
    }
});

// GET my songs
router.get('/mySongs', auth, async (req, res) => {
    try {
        const songs = await Song.find({ artist_id: req.user.userId, type: 'Single track' });
        if (songs) {
            res.status(200).json(songs)
        }
        else {
            res.status(404).json({ message: "404 not found" });
        }

    }
    catch (e) {
        res.status(500).json({ message: e })
    }
})

module.exports = router;