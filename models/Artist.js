const { Schema, Types, model } = require("mongoose");

const schema = new Schema({
    id: {type: Types.ObjectId, required: true, unique: true },
    name: {type: String, required: true},
    listenings: {type: Number, required: true},
    albums: {type: Number, required: true},
    img: {type: String, required: true},
    tags: [{type: String, default: ''}],
    songs: [{ type: Types.ObjectId, required: true}],
    owner: [{type: Types.ObjectId, required: true}]
})

module.exports = model('Artist', schema);