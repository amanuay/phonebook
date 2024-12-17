const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

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

let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": "1"
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": "2"
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": "3"
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": "4"
    }
]

const generateId = () => {
    return Math.floor(Math.random() * 99999)
}

app.get('/', (request, response) => {
    response.send(`<h1> total no of persons: ${persons.length}</h1>`)
})

app.get('/info', (request, response) => {
    const time = new Date()
    response.send(`<div>Phonebook has info for ${generateId() - 1} people <br />${time.toDateString()} ${time.toTimeString()}</div>`)
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(dude => dude.id === id)
    if (person) {
        response.send(person.name)
    } else {
        response.status(404).send("Data does not exist")
    }

})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const deletedPerson = persons.find(p => p.id === id)
    const editedPersons = persons.filter(person => person.id !== id)
    persons = editedPersons
    response.json(deletedPerson)
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

    const person = {
        name: body.name,
        number: body.number,
        id: generateId().toString(),
    }

    const existingPerson = persons.find(p => p.name == person.name)


    if (existingPerson) {
        console.log("duplicate name")
        console.log(existingPerson)
        response.status(403).json({ error: "name already exists" })
        return
    }

    persons = persons.concat(person)

    response.json(person)
})

app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
    console.log(`open the link in your browser: http://localhost:${PORT}`)
})