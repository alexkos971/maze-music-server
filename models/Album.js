const { Schema, model, Types } = require('mongoose');

let shema = new Schema({
    name: { type: String, required: true },
    cover: { type: String, required: true },
    artist_name: { type: String, required: true },
    artist_id: { type: Types.ObjectId, ref: 'User', required: true },
    songs: [{ type: Types.ObjectId, ref: 'Song', required: true }],
    listenings: { type: Number, default: 0 }
})

module.exports = model('Album', shema)