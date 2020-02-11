const {Schema, model} = require('mongoose')

const logs = new Schema({
    event: {
    type: String,
    required: true
  },

  note: {
    type: String,
    required: true
  },

  user: {
    type: String,
    required: true
  },

  part: {
    type: String
  },

  created: {
    type: Date,
    default: () => Date.now() + 3*60*60*1000 //время МСК
  }
})


module.exports = model('Logs', logs)