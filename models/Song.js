const {Schema, Types, model} = require('mongoose');

let shema = new Schema({
    name: {type: String, required: true},

    artist_name: {type: String, required: true},
    artist_id: {type: Types.ObjectId, ref: "User"},
    type: {type: String, required: true},   
    album_name: { type: String },
    album_id : { type: Types.ObjectId, ref: "Album" },
    genre: {type: Array, required: true},
    lyrics: {type: String, default: ""},
    src: {type: String, required: true},
    duration: {type: String, default: '0:00', required: true },
    date: {type: Date, default: Date.now()},
    cover: { type: String, required: true },
    listenings: { type: Number, default: 0 }
})


module.exports = model('Song', shema);