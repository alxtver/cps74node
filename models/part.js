const {Schema, model} = require('mongoose')

const part = new Schema({
    country: {
        type: String,
        required: true
    }
})

module.exports = model('Part', part)