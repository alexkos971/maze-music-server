const { Router } = require('express');
const path = require('path')
const { getAudioDurationInSeconds } = require('get-audio-duration');

const Song = require('../models/Song');
const User = require('../models/User');

const multer = require('multer');

const uuid = require('uuid');
const router = Router();

const auth = require('../middleware/auth.middleware');

router.post('/cover', (req, res) => {
    res.status(200).json({ message: 'uploaded' })
})

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname == 'track') {
            cb(null, './static/tracks')
        }
        else if (file.fieldname == 'cover') {
            cb(null, './static/covers')
        }
    },
    filename: (req, file, cb) => {
      cb(null, uuid.v4() + path.extname(file.originalname))
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
        cb(null, 'image')
    }
    else if (file.mimetype === 'audio/mpeg' || file.mimetype === 'audio/wave') {
        cb(null, 'audio')
    }
}
  
let upload = multer({ storage, fileFilter}).fields([
    {
        name: 'cover',
        maxCount: 1
    }, {
        name: 'track',
        maxCount: 1
    }    
]);


// POST upload track
router.post('/track', auth, async (req, res) => {
    try {
        const { name, lyrics } = req.body;
        console.log(req.body, '57')

        const artist = await User.findById({ _id: req.user.userId });
        const isExist = await Song.findOne({ name, artist_id: req.user.userId }); 

        if (isExist) {
            return res.status(400).json({ message: 'Такой трек у вас уже есть' })
        }

        return await upload(req, res, async err => {
            if (err) {
                return res.json({message: `Error - ${err}`})   
            }

            let track = req.files.track;
            let cover = req.files.cover;
            console.log(req.body.name, '73')
        
            
            let timeTemplate = s => {
                return (s - (s %= 60)) / 60 + (10 < s ? ':' : ':0') + ~~(s);
            }

            let duration = await getAudioDurationInSeconds(track[0].path).then((dur) => {
                if (dur) {
                    return timeTemplate(dur)
                }
                else {
                    return '0:00'
                }
            });

            const song = new Song({
                name,
                cover: cover[0].path,
                artist_name: artist.name,
                artist_id: req.user.userId,
                src: track[0].path,
                duration: duration,
                filename: track[0].filename,
                lyrics: lyrics
            })

            console.log(song, '100')
            // await song.save()
            res.status(200).json({ message: "Track is uploaded", track: song })
        });
        

    }
    catch (e) {
        res.status(500).json({ message: `Что-то пошло не так... ${e}` })
    }

});

module.exports = router;