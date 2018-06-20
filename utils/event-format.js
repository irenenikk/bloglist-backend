const formatUser = require('../utils/user-format')

const formatEvent = (event) => {
  return {
    _id: event._id,
    type: event.type,
    description: event.description,
    time: event.time,
    user: formatUser(event.user),
    blog: event.blog
  }
}

module.exports = formatEvent
