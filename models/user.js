const {Schema, model} = require('mongoose')

const User = new Schema({
    username: {
        type: String,
        required: true
    },
    password: String,
    group: String,
    lastPart: String,
    lastType: String,
    lastPage: Number,
    pcCount: String,
    lastAssemblyPC: String
})

module.exports = model('User', User)