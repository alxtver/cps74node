const {Schema, model} = require('mongoose')

const country = new Schema({
    country: {
        type: String,
        required: true
    }
})

