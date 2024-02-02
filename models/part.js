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
        default: () => new Date()
      }
})

module.exports = model('Part', part)