const { Router } = require('express');
const router = Router();

const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

const User = require('../models/User');
const Song = require('../models/Song');

const auth = require('../middleware/auth.middleware');

// change avatar
router.post('/avatar', upload.single('avatar'), auth, async (req, res) => {
    try {
        let user = await User.findById(req.user.userId)
        const {avatar} = req.files[0]
        
        user.avatar = req.body.avatar;
        
        await user.save();
        
        res.status(200).json({ message: "Avatar is updates", avatar: user.avatar})
        
    }
    catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так...' })
    }
})

// change name
router.post('/name', auth, async (req, res) => {
    try {
        let user = await User.findById(req.user.userId)
        user.songs.forEach(async songId => {
           const song = await Song.findById(songId);
           song.artist_name = req.body.name;
           await song.save();
        });        

        user.name = req.body.name;
        // console.log(songs)
        await user.save();
        
            // await songs.save();
            
        res.status(200).json({ message: "Name is updates", name: user.name})

    }
    catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так...' })
        console.log(e.message);
    }
})

module.exports = router;