const {
    Schema,
    model
} = require('mongoose')

const part = new Schema({
    part: {
        type: String,
        required: true,
        unique: true
    }
})

module.exports = model('Part', part)