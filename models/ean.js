const {Schema, model} = require('mongoose')

const ean = new Schema({
  ean_code: {
    type: String,
    required: true,
    unique: true
  },
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
  country: {
    type: String,
    required: true
  }
})

module.exports = model('EAN', ean)