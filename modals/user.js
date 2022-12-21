let mongoose = require('mongoose')
let bcrypt = require('bcrypt')
let Schema = mongoose.Schema
let userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profileImage: { type: String, required: true },
  admin: { type: Boolean, default: false },
  subscription: { type: String, default: 'free' },
})

userSchema.pre('save', function (next) {
  let adminEmail = ['me.naresh141@gmail.com']
  if (adminEmail.includes(this.email)) {
    this.admin = true
  }
  if (this.password && this.isModified('password')) {
    bcrypt.hash(this.password, 10, (err, hashed) => {
      if (err) return next(err)
      this.password = hashed
      return next()
    })
  }
})
// password
userSchema.methods.verifyPassword = function (password, cb) {
  bcrypt.compare(password, this.password, (err, result) => {
    return cb(err, result)
  })
}

module.exports = mongoose.model('User', userSchema)
