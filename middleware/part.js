const Part = require('../models/part')

module.exports = async function (req, res, next) {
  if (!req.session.part) {
    if (req.user) {
      if (req.user.lastPart) {
        req.session.part = req.user.lastPart
      } else {
        const parts = await Part.find().sort({
          created: -1
        })
        if (parts) {
          req.session.part = parts[0].part
        }
      }
    }
  }
  next()
}
