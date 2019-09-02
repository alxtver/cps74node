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
    type: String    
  },
  img: String

})

module.exports = model('Pki', pki)