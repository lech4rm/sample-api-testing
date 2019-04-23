const User = require('../components/user/user.model')

function validators() {
  const methods = {
    validPassword: str => {
      if (!str) return false
      // regex for min 8 chars with atleast one alpha, uppercase alpha, digit and special chars
      let valid = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/
      return valid.test(str)
    },
    validMobile: num => {
      if (!num) return false
      typeof num === 'string' ? num : num.toString()
      let valid = /^[0-9]{10}$/
      return valid.test(num)
    },

    isLoginDataValid: data => {
      let criteria = [
        { key: 'mobileNumber', verify: methods.validMobile, message: 'Invalid mobile number' },
        { key: 'password', verify: methods.validPassword, message: 'Invalid password' }
      ]
      return criteria.reduce((acc, x) => {
        return acc && x.verify(data[x.key])
      }, true)
    },

    isSignUpDataValid: data => {
      let criteria = [
        { key: 'mobileNumber', verify: methods.validMobile, message: 'Invalid mobile number' },
        { key: 'password', verify: methods.validPassword, message: 'Invalid mobile number' },
        { key: 'name', verify: str => !!str, message: 'Name cannot be empty' }
      ]
      return criteria.reduce((acc, x) => {
        return acc && x.verify(data[x.key])
      }, true)
    },

    userExists: mobileNumber => {
      return new Promise((resolve, reject) => {
        User.findOne({
          mobileNumber,
          isActive: true
        })
          .exec()
          .then(user => {
            console.log(user)
            user ? resolve(user) : resolve(false)
          })
          .catch(reject)
      })
    }
  }

  return Object.freeze(methods)
}

module.exports = validators()
