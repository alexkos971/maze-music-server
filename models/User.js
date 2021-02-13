const {Schema, Types, model} = require('mongoose');

let shema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},

    avatar: {type: String, default: 'https://i.mycdn.me/i?r=AyH4iRPQ2q0otWIFepML2LxR21EoY7T_GZpDBwrrF3W6uw'},
    listenings: { type: Number, default: 0 },
    followers: [{ type: Number, default: 0 }],
    
    saved_songs: [{ type: Types.ObjectId, ref: 'Song'}],
    saved_artists: [{ type: Types.ObjectId, ref: 'User'}],
    saved_albums: [{ type: Types.ObjectId, ref: 'Album'}],
    saved_playlists: [{ type: Types.ObjectId, ref: 'Playlist'}],
    
    playlists: [{ type: Types.ObjectId, ref: 'Playlist'}],
    songs: [{
        type: Types.ObjectId,
        ref: 'Song'
    }],
    albums: [{
        type: Types.ObjectId,
        ref: 'Album'
    }]
})

module.exports = model('User', shema);