const {
    Schema,
    model
} = require('mongoose')

const part = new Schema({
    part: {
        type: String,
        required: true,
        unique: true
    },
    created: {
        type: Date,
        default: () => Date.now() + 3*60*60*1000 //время МСК
      }
})

module.exports = model('Part', part)