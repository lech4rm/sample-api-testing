const chai = require('chai')
const chaiHttp = require('chai-http')
const { expect, assert } = chai
chai.use(chaiHttp)

const {
  validPassword,
  validMobile,
  isLoginDataValid,
  isSignUpDataValid,
  userExists
} = require('../utils/validators')

describe('Validators', () => {
  describe('Password validator', () => {
    it('Invalidate empty value', () => {
      assert.equal(validPassword(''), false)
    })

    it('Invalidate number only password', () => {
      assert.equal(validPassword('123213123'), false)
    })

    it('Invalidate alpha only password', () => {
      assert.equal(validPassword('randomPass'), false)
    })

    it('Invalidate missing special char', () => {
      assert.equal(validPassword('RandomPass123'), false)
    })

    it('Invalidate passwords shorter than 8 chars', () => {
      assert.equal(validPassword('Ran123!'), false)
    })

    it('Ideal case', () => {
      assert.equal(validPassword('Random@123'), true)
    })
  })

  describe('Mobile number validator', () => {
    it('Invalidate empty value', () => {
      assert.equal(validMobile(), false)
    })

    it('Number shorter than 10 digits', () => {
      assert.equal(validMobile('123213123'), false)
    })

    it('Validate ideal mobile number', () => {
      assert.equal(validMobile('9876543210'), true)
    })

    it('Should pass for number data type as well', () => {
      assert.equal(validMobile(9876543210), true)
    })
  })
})
