const mongoose = require('mongoose')

const Event = mongoose.model('Event', {
  type: String,
  description: String,
  time: Date,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' 
  },
  blog: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog' 
  }
})

module.exports = Event
