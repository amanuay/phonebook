const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')


const app = express()

morgan.token('data', (request) => JSON.stringify(request.body))

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

//middleware?
app.use(express.static('dist'))
app.use(cors())
app.use(morgan('tiny'))
app.use(express.json())

let persons = []
Person.find().then(result => persons.push(...result))

app.get('/info', (request, response) => {
  const time = new Date()
  response.send(`<div>Phonebook has info for ${persons.length} people <br />${time.toDateString()} ${time.toTimeString()}</div>`)
})

app.get('/api/persons', (request, response) => {
  Person.find().then(result => {
    response.json(result)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person
    .findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.json(result).end()
    })
    .catch(error => next(error))
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({
      error: 'name missing'
    })
  }

  if (!body.number) {
    return response.status(400).json({
      error: 'number missing'
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save()
    .then(person => {
      response.json(person)
    })
    .catch(error => console.error(error))

})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  Person.findByIdAndUpdate(
    request.params.id,
    {
      name: body.name,
      number: body.number
    },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`open the link in your browser: http://localhost:${PORT}`)
})