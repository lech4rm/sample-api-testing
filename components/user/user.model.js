const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')
const userSchema = new Schema(
  {
    name: {
      type: String
    },
    password: {
      type: String,
      default: ''
    },
    mobileNumber: {
      type: String,
      default: ''
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
)

userSchema.methods.validPassword = function(password) {
  let user = this
  return bcrypt.compareSync(password, user.password)
}

userSchema.pre('save', function(next) {
  let user = this
  user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(8), null)
  next()
})

module.exports = mongoose.model('User', userSchema)
