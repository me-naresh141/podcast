let mongoose = require('mongoose')
let Schema = mongoose.Schema

let podcastSchema = new Schema({
  title: { type: String, required: true },
  plane: { type: String, default: 'free' },
  poster: { type: String, required: true },
  audio: { type: String, required: true },
  like: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  artist: { type: String, required: true },
})

module.exports = mongoose.model('Podcast', podcastSchema)
