const { Schema, model } = require("mongoose");

const systemCaseSchema = new Schema(
  {
    serialNumber: {
      type: String,
      required: true,
      unique: true,
    },
    execution: {
      type: String,
      default: ''
    },
    fdsi: {
      type: String,
      required: true,
    },
    part: {
      type: String,
      required: true,
    },
    systemCaseUnits: Array,
    pki: [{
      type: Schema.Types.ObjectId,
      ref: 'Pki'
    }],
    created: {
      type: Date,
      default: () => Date.now() + 3 * 60 * 60 * 1000, //время МСК
    },
    back_color: {
      type: String,
      default: "#8989a7",
    },
    attachment: {
      type: String,
      default: () => ''
    }
  },
  {
    versionKey: false,
  }
);

module.exports = model("SystemCase", systemCaseSchema);
