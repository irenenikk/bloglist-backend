const eventsRouter = require('express').Router()
const formatEvent = require('../utils/event-format')
const Event = require('../models/event')
const User = require('../models/user')
const Blog = require('../models/blog')
const jwt = require('jsonwebtoken')


const CREATED_NEW_USER = 'CREATED_NEW_USER'
const CREATED_NEW_BLOG = 'CREATED_NEW_BLOG'
const LIKED_BLOG = 'LIKED_BLOG'

eventsRouter.createdBlogEventObject = {
  type: CREATED_NEW_BLOG,
  description: 'created a new blog'
}

eventsRouter.newUserEventObject = {
  type: CREATED_NEW_USER,
  description: 'joined Blogster'
}

eventsRouter.likedBlogEventObject = {
  type: LIKED_BLOG,
  description: 'liked the blog'
}

const validateEvent = (event) => {
  let errors = []
  if (event.user === undefined) {
    errors.push('Event must be associated with an user')
  }   
  if (event.type.trim() === '') {
    errors.push('Event must have a type')
  }
  if (event.description.trim() === '') {
    errors.push('Event must have a description')
  }
}

eventsRouter.get('/', async (request, response) => {
  const events = await Event.find().populate('user').populate('blog')
  response.json(events.map(e => formatEvent(e)))
})

eventsRouter.post('/', async (request, response) => {
  if (!request.body) {
    return response.status(401).send('Missing content')
  }
  if (!request.token && !request.body.user) {
    return response.status(401).send('Missing user id or token')
  }
  let id
  if (request.token) {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).send('Invalid token')
    }
    id = decodedToken.id
  } else {
    id = request.body.user._id
  }
  try {
    const event = request.body
    const errors = validateEvent(event)
    if (errors) {
      response.status(500).send('Error saving event')
    }
    const user = await User.findById(id)
    let blog
    if (request.body.blog) {
      blog = await Blog.findById(request.body.blog._id)
    }
    const eventObj = await
    new Event({
      ...event,
      blog: blog ? blog._id : undefined,
      user: user._id,
      time: new Date()
    })
      .save()
    response.json(eventObj)
  } catch (e) {
    response.status(400).send('Could not create event')
  }
})

eventsRouter.createEvent = async (event, user_id, target_blog) => {
  try {
    const user = await User.findById(user_id)

    let blog
    if (target_blog) {
      blog = await Blog.findById(target_blog._id)
    }
    const eventObj = await
    new Event({
      ...event,
      blog: blog ? blog._id : undefined,
      user: user._id,
      time: new Date()
    })
      .save()
    return eventObj
  } catch (e) {
    console.log('Could not create event')
  }
}

module.exports = eventsRouter
