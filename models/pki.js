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
    type: String    
  },

  number_machine: String,
  ean_code: String,
  szz1: String,
  sp_unit: Array,  
  
  created: {
    type: Date,
    default: () => Date.now() + 3*60*60*1000 //время МСК
  },

  viborka: {
    type: Boolean,
    default: false
  }

})


module.exports = model('Pki', pki)