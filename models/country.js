const {
    Schema,
    model
} = require('mongoose')

const country = new Schema({
    country: {
        type: String,
        required: true,
        unique: true
    },
    code: String,
    alfa2: String,
    alfa3: String,
    fullName: String
})

module.exports = model('Country', country)