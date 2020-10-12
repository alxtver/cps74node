const {
  Schema,
  model
} = require('mongoose')

const apkzi = new Schema({
  apkzi_name: {
    type: String,
    required: true
  },

  kont_name: {
    type: String,
    required: true
  },

  fdsi: {
    type: String,
    required: true
  },

  fdsiKontr: {
    type: String,
    required: true
  },


  zav_number: {
    type: String,
    required: true
  },

  kontr_zav_number: {
    type: String,
    required: true
  },

  part: {
    type: String,
    required: true
  },

  number_machine: String,

  created: {
    type: Date,
    default: () => Date.now() + 3 * 60 * 60 * 1000 //время МСК
  }


})


module.exports = model('Apkzi', apkzi)