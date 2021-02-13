const {Schema, Types, model} = require('mongoose');

let shema = new Schema({
    name: {type: String, required: true},

    artist_name: {type: String, required: true},
    artist_id: {type: Types.ObjectId, ref: "User"},
    
    album_name: { type: String },
    album_id : { type: Types.ObjectId, ref: "Album", default: Types.ObjectId },

    lyrics: {type: String, default: ""},
    src: {type: String, required: true},
    // duration: {type: String, default: '0:00' },
    date: {type: Date, default: Date.now()},
    cover: {type: String, default: "https://fwrental.com/wp-content/uploads/2019/02/retro-record-rug.jpg"},
    listenings: { type: Number, default: 0 }
})


module.exports = model('Song', shema);