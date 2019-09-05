const {Schema, model} = require('mongoose')

const userShema = new Schema({
    name: {
        type: String,
        required: true
    }
})

module.exports = model('User', userShema)