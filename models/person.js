require('dotenv').config()
const mongoose = require('mongoose')


const url = process.env.DB_URL


mongoose.set('strictQuery', false)

console.log('connecting to MongoDB')

mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    validate: {
      validator(v) {
        return /^\d{2,3}-\d{7,}/.test(v)
      },
      message: props => `${props.value} is not a valid phone number`
    },
    minLength: 8,
    required: true
  }
})

personSchema.set('toJSON', {
  transform(document, returnedObject) {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Person = mongoose.model('Person', personSchema)

module.exports = Person