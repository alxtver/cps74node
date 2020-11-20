const {
  Schema,
  model
} = require('mongoose')

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
  },
  countSymbols: String,
  sp_unit: Array,
  sp_unit1: Array,
  created: {
    type: Date,
    default: () => Date.now() + 3 * 60 * 60 * 1000 //время МСК
  },
})

module.exports = model('EAN', ean)