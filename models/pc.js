const {Schema, model} = require('mongoose')

const pc = new Schema({
    serial_number: {
        type: String,
        required: true,
        unique: true
    },
    execution: {
        type: String
    },
    fdsi: {
        type: String,
        required: true
    },
    part: {
        type: String,
        required: true
    },
    arm: {
        type: String        
    },
    pc_unit: Array,
    system_case_unit: Array,
    created: {
        type: Date,
        default: () => Date.now() + 3*60*60*1000 //время МСК
      },
    back_color: String,
    attachment: String
})

module.exports = model('Pc', pc)