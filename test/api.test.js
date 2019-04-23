let User = require('../components/user/user.model')
let chai = require('chai')
let chaiHttp = require('chai-http')
let should = chai.should()
let { expect } = chai
chai.use(chaiHttp)

describe('Authentication', () => {
  beforeEach(() => {
    server = require('../app').listen(1339)
  })

  describe('/POST login', () => {
    it('Validate request body', done => {
      chai
        .request(server)
        .post('/login')
        .end((err, res) => {
          res.should.have.status(400)
          res.body.should.be.a('object')
          res.body.should.have.property('message').eql('Invalid Input')
          done()
        })
    })

    it('Validate non-existing account', done => {
      let payload = {
        mobileNumber: '9876543210',
        password: 'RandomPass123!'
      }
      chai
        .request(server)
        .post('/login')
        .send(payload)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
          expect(res.body).to.nested.include({ 'data.success': false })
          done()
        })
    })

    it('Validate improper password', done => {
      let payload = {
        mobileNumber: '9876543210',
        password: 'test'
      }
      chai
        .request(server)
        .post('/login')
        .send(payload)
        .end((err, res) => {
          res.should.have.status(400)
          res.body.should.be.a('object')
          res.body.should.have.property('message').eql('Invalid Input')
          done()
        })
    })

    it('Validate short mobile number', done => {
      let payload = {
        mobileNumber: '987654',
        password: 'RandomPass123!'
      }
      chai
        .request(server)
        .post('/login')
        .send(payload)
        .end((err, res) => {
          res.should.have.status(400)
          res.body.should.be.a('object')
          res.body.should.have.property('message').eql('Invalid Input')
          done()
        })
    })

    it('Validate login success', done => {
      ;(async () => {
        let newUser = new User({
          name: 'Leo',
          password: 'RandomPass123!',
          mobileNumber: '1234567890',
          isActive: true
        })
        newUser = await newUser.save()

        let payload = {
          mobileNumber: '1234567890',
          password: 'RandomPass123!'
        }
        chai
          .request(server)
          .post('/login')
          .send(payload)
          .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('object')
            expect(res.body).to.nested.include({ 'data.success': true })
            done()
          })
      })()
    })
  })

  describe('/POST Signup', () => {
    it('Check if user exists already', done => {
      ;(async () => {
        let newUser = new User({
          name: 'Leo',
          password: 'RandomPass123!',
          mobileNumber: '1234567890',
          isActive: true
        })
        newUser = await newUser.save()

        let payload = {
          mobileNumber: '1234567890',
          password: 'RandomPass123!',
          name: 'Leo'
        }
        chai
          .request(server)
          .post('/signup')
          .send(payload)
          .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('object')
            expect(res.body).to.nested.include({ 'data.success': false })
            done()
          })
      })()
    })
  })
})
