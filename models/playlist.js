const {Schema, model} = require('mongoose');

const PLaylistSchema = Schema({
    user: {
        type: Schema.ObjectId,
        ref: "User",
    },
    name: {
        type: String,
        required: true
    },
    songs: [{
        type: Schema.ObjectId,
        ref: "Song",
    }],
    created_at:{
        type: Date,
        default: Date.now
    }

});

module.exports = model("Playlist", PLaylistSchema, 'playlists');