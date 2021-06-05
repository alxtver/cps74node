const { Schema, model } = require("mongoose");

const systemCaseSchema = new Schema(
  {
    serial_number: {
      type: String,
      required: true,
      unique: true,
    },
    execution: {
      type: String,
    },
    fdsi: {
      type: String,
      required: true,
    },
    part: {
      type: String,
      required: true,
    },
    systemCaseUnits: [{
      type: Schema.Types.ObjectId,
      ref: 'Pki'
    }],
    created: {
      type: Date,
      default: () => Date.now() + 3 * 60 * 60 * 1000, //время МСК
    },
    back_color: {
      type: String,
      default: "#3d3d3d",
    },
    attachment: String,
  },
  {
    versionKey: false,
  }
);

module.exports = model("SystemCase", systemCaseSchema);
