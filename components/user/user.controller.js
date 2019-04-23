const { error, log, info } = require('../../utils/logging')
const { success, fail } = require('../../utils/response')
const {
  password,
  userExists,
  isSignUpDataValid,
  isLoginDataValid
} = require('../../utils/validators')
const User = require('./user.model')
const jwt = require('jsonwebtoken')

function userCtrl() {
  const methods = {
    login: async (req, res) => {
      try {
        if (!isLoginDataValid(req.body)) {
          return fail(res, 400)
        }

        let user = await userExists(req.body.mobileNumber)

        if (!user) {
          return success(res, 200, { success: false, message: 'Invalid credentials' })
        }

        if (!user.validPassword(req.body.password)) {
          return success(res, 200, { success: false, message: 'Invalid credentials' })
        }

        user = user.toObject()

        let token = jwt.sign(
          { _id: user._id, name: user.name, mobileNumber: user.mobileNumber },
          process.env.SECRET
        )

        return success(res, 200, { success: true, message: 'User logged in successfully', token })
      } catch (e) {
        error(e)
        fail(res, 500, e)
      }
    },
    signUp: async (req, res) => {
      try {
        if (!isSignUpDataValid(req.body)) {
          return fail(res, 400)
        }

        let user = await userExists(req.body.mobileNumber)

        if (user) {
          return success(res, 200, { success: false, message: 'User already exists' })
        }

        let newUser = new User({
          name: req.body.name,
          mobileNumber: req.body.mobileNumber,
          password: req.body.password
        })

        await newUser.save()

        return success(res, 200, { success: true, message: 'User created successfully' })
      } catch (e) {
        error(e)
        fail(res, 500, e)
      }
    },

    verifyToken: async (req, res, next) => {
      try {
        jwt.verify(token, process.env.SECRET, (err, decoded) => {
          if (err) {
            return fail(res, 401)
          } else {
            next()
          }
        })
      } catch (e) {
        error(e)
        fail(res, 500, e)
      }
    },

    forgetPassword: async (req, res) => {
      res.status(200).send('something else')
    }
  }
  return Object.freeze(methods)
}

module.exports = userCtrl()
