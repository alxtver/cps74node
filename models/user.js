const {Schema, model} = require('mongoose')

const User = new Schema({
    username: {
        type: String,
        required: true
    },
    password: String,
    group: String
})

module.exports = model('User', User)