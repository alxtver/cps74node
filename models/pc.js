const {Schema, model} = require('mongoose')

const pc = new Schema({
    serial_number: {
        type: String,
        required: true
    },
    execution: {
        type: String,
        required: true
    },
    fdsi: {
        type: String,
        required: true
    },
    part: {
        type: String,
        required: true
    },
    pc_unit : [{
        type : String,
        name : String,
        serial_number: String,
        notes: String
         },
        {

        }]
    

module.exports = model('Pc', pc)