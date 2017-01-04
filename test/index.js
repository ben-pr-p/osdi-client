const nock = require('nock')
const sampleAep = require('./sample-aep')
const expect = require('chai').expect

const testBase = 'https://osdi-sample-system.org/api/v1/'

const osdi = require('..')

describe('constructor', () => {
  const scope = nock(testBase)
    .get('/')
    .reply(200, sampleAep)

  describe('if given an endpoint', () => {
    it('should throw an error if not a valid url', done => {
      osdi.client('bad url')
        .then(client => done(new Error(`did not invalidate bad url`)))
        .catch(err => {
          expect(err.message).to.equal('Not a valid URL')
          done()
        })
    })

    it('should throw an error if not https', done => {
      osdi.client('http://osdi-sample-system.org/api/v1/')
        .then(client => done(new Error('did not invalidate http')))
        .catch(err => {
          expect(err.message).to.equal('HTTPS required')
          done()
        })
    })

    it('should correctly parse the aep and initialize properties', done => {
      osdi.client(testBase)
        .then(client => {
          expect(client).to.have.all.keys(
            'motd', 'vendorName', 'productName', 'osdiVersion', 'maxPagesize',
            'namespace', 'getPeople', 'getPetitions', 'getEvents', 'getForms',
            'getFundraisingPages', 'getDonations', 'getTags', 'getQueries',
            'getQuestions', 'getSharePages', 'getPersonSignupHelper', 'getLists'
          )

          done()
        })
        .catch(err => done(err))
    })
  })

  describe('if given json', () => {
    it('shoud correctly parse the aep and initialize properties', done => {
      osdi.client(sampleAep)
        .then(client => {
          expect(client).to.have.all.keys(
            'motd', 'vendorName', 'productName', 'osdiVersion', 'maxPagesize',
            'namespace', 'getPeople', 'getPetitions', 'getEvents', 'getForms',
            'getFundraisingPages', 'getDonations', 'getTags', 'getQueries',
            'getQuestions', 'getSharePages', 'getPersonSignupHelper', 'getLists'
          )

          done()
        })
        .catch(err => done(err))
    })
  })
})
