const { Schema, model, Types } = require('mongoose');

let shema = new Schema({
    name: { type: String, required: true },
    author_name: { type: String, required: true },
    author_id: { type: Types.ObjectId, ref: 'User', required: true },
    songs: [{ type: Types.ObjectId, ref: 'Song', default: 0 }],
    listenings: { type: Number, default: 0 }
})

module.exports = model('Playlist', shema)