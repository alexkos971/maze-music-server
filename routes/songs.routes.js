const { Router } = require("express");

const Song = require('../models/Song');
const User = require('../models/User');

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


// POST delete songs
router.delete('/delete/:id', auth, async (req, res) => {
    try {
        let song = await Song.findOneAndDelete({ _id: req.params.id}, (err, obj) => {
            if (err) {
                return res.status(500).json({ message: "Трек не найден" })
            }
            return res.status(200).json({ message: 'Удален 1 трек'})
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