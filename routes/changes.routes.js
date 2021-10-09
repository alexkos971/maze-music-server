const { Router } = require('express');
const router = Router();


const User = require('../models/User');
const Song = require('../models/Song');

const auth = require('../middleware/auth.middleware');

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
});

router.post('/description', auth, async (req, res) => {
    try {
        let user = await User.findById(req.user.userId)

        user.description = req.body.description;
        user.description_large = req.body.description.substr(0, 130) + '...';
        await user.save();
            
        res.status(200).json({ message: "Description is updates", description: user.description, description_large: user.description_large})
    }
    catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так...' })
    }
})

module.exports = router;