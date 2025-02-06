require('dotenv').config()
const mongoose = require('mongoose')


const url = process.env.DB_URL


mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

// personSchema.set('toJSON', {
//     transform(document, returnedObject) {
//         returnedObject.id = returnedObject._id.toString()
//         delete returnedObject._id
//         delete returnedObject.__v
//     }
// });

const Person = mongoose.model('Person', personSchema)

// const person = new Person({
//     name: 'name one',
//     number: '888-999-888',
// })

// person.save().then(result => {
//     console.log('contact saved!')
//     mongoose.connection.close()
// })

Person.find({}).then(result => {
  console.log(JSON.stringify(result))
  mongoose.connection.close()
})