const eventsRouter = require('express').Router()
const formatEvent = require('../utils/event-format')
const Event = require('../models/event')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const validateEvent = (event) => {
    let errors = []
    if (event.user == undefined) {
        errors.push('Event must be associated with an user')
    }   
    if (event.type.trim() == '') {
        errors.push('Event must have a type')
    }
    if (event.description.trim() == '') {
        errors.push('Event must have a description')
    }
}

eventsRouter.get('/', async (request, response) => {
  const events = await Event.find().populate('user')
  response.json(events.map(e => formatEvent(e)))
})

eventsRouter.post('/', async (request, response) => {
  if (!request.body) {
    return response.status(401).send('Missing content')
  }
  try {
    const event = request.body
    const errors = validateEvent(event)
    if (errors) {
        response.status(500).send('Error saving event')
    }
    const user = await User.findById(request.body.user._id)
    const eventObj = await
      new Event({
        ...event,
        user: user._id,
        time: new Date()
      })
        .save()
    response.json(eventObj)
  } catch (e) {
    response.status(400).send('Could not create event')
  }
})

module.exports = eventsRouter
