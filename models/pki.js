const {Schema, model} = require('mongoose')

const pki = new Schema({
  type_pki: {
    type: String,
    required: true
  },
  vendor: {
    type: String,
    required: true
  },
  model: {
    type: String,
    required: true
  },
  serial_number: {
    type: String,
    required: true
  },
  part: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  in_case: {
    type: Boolean,
    required: true
  }

})


module.exports = model('Pki', pki)