const { Router } = require('express');
const path = require('path')
const { getAudioDurationInSeconds } = require('get-audio-duration');

const Song = require('../models/Song');
const User = require('../models/User');
const Album = require('../models/Album');

const multer = require('multer');

const uuid = require('uuid');
const router = Router();

const auth = require('../middleware/auth.middleware');

const timeTemplate = s => {
    return (s - (s %= 60)) / 60 + (10 < s ? ':' : ':0') + ~~(s);
}

let getDuration = (track) => {
    getAudioDurationInSeconds(track).then((dur) => {
        if (dur) {
            return timeTemplate(dur)
        }
        else {
            return '0:00'
        }
    });
}

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
  
let upload = multer({ storage });

// router.post('/cover', (req, res) => {
//     res.status(200).json({ message: 'uploaded' })
// })


// Post upload album 
router.post('/album', upload.fields([
    {
        name: 'cover',
        maxCount: 1
    }, {
        name: 'track',
        maxCount: 12
    }    
    ]), auth, async (req, res) => {
    try {
        const { name, genre, lyrics, type } = req.body;
        const artist = await User.findById({ _id: req.user.userId });
    
        let tracks = req.files.track;
        let cover = req.files.cover[0];
        let tracksId = [];

        await tracks.forEach(async item => {
            const song = await new Song({
                name: item.originalname.substring(0, item.originalname.length - 4),
                type,
                cover: cover.path,
                artist_name: artist.name,
                artist_id: req.user.userId,
                album_name: name,
                src: item.path,
                genre, 
                duration: getDuration(item.path),
                filename: item.filename,
                lyrics
            });

            tracksId.push(song._id);
            await song.save()
        });

        const album = new Album ({
            type,
            name: name,
            cover: cover.path,
            artist_name: artist.name,
            artist_id: artist._id,
            songs: tracksId
        })
        await album.save()
        console.log(tracks);
        res.status(200).json({ message: 'ok', album })
    }
    catch (e) {
        res.status(500).json({ message: `Error - ${e}` })
    }
})


// POST upload track
router.post('/track', upload.fields([
    {
        name: 'cover',
        maxCount: 1
    }, {
        name: 'track',
        maxCount: 1
    }    
    ]), auth, async (req, res) => {
    try {
        const { name, genre, lyrics, type } = req.body;

        const artist = await User.findById({ _id: req.user.userId });
        const isExist = await Song.findOne({ name, artist_id: req.user.userId }); 

        if (isExist) {
            return res.status(400).json({ message: 'Такой трек у вас уже есть' })
        }

        let track = req.files.track[0];
        let cover = req.files.cover[0];
        
            

        let duration = await getAudioDurationInSeconds(track.path).then((dur) => {
            if (dur) {
                return timeTemplate(dur)
            }
            else {
                return '0:00'
            }
        });

        const song = new Song({
            name: track.originalname.substring(0, track.originalname.length - 4),
            type,
            cover: cover.path,
            artist_name: artist.name,
            artist_id: req.user.userId,
            src: track.path,
            genre, 
            duration: duration,
            filename: track.filename,
            lyrics
        })

        console.log(song)
        await song.save()
        res.status(200).json({ message: "Track is uploaded", track: song })        
    }
    catch (e) {
        res.status(500).json({ message: `Что-то пошло не так... ${e}` })
    }

});

module.exports = router;