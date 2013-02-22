var async = require('async')
var should = require('should')
var fetch = require('../index')
var readFile = require('imacros-read-file')
runTests(function (err, reply) {
  if (err) {
    alert('check test suite fails with error: ' + JSON.stringify(err))
    return false
  }
  iimDisplay('Success! Checks test suite passes')
})

function runTests(cb) {
  var filePath = 'file:///users/noah/src/node/docparse/scrapers/imacros/pdfer/fetch/test/config.json'
  loadConfigFile(filePath, function (err, config) {
    should.not.exist(err, 'error loading config file')
    fetchExistingDocument(config, function (err, reply) {
      if (err) { return cb(err) }
      fetchNullDocument(config, cb)
    })
  })
}

function fetchExistingDocument(config, cb) {
  iimDisplay('fetching existing document')
  var hash = '451457081c9996c7586049289751d4be082678dc';
  var data = {
    config: config,
    hash: hash
  }
  fetch(data, function (err, reply) {
    if (err) { return cb(err) }
    if (!reply.textPages) {
      return cb('"textPages" field missing in fetch response from pdfer api')
    }
    cb()
  })
}

function fetchNullDocument(config, cb) {
  iimDisplay('fetching null document')
  var hash = 'dummy hash value here'
  var data = {
    config: config,
    hash: hash
  }
  fetch(data, function (err, reply) {
    if (!err) {
      return cb('fetch api request did not through an error for an invalid hash value like it should have')
    }
    iimDisplay('fetch null document test passes');
    cb()
  })
}

function loadConfigFile(filePath, cb) {
  readFile(filePath, function (err, reply) {
    if (err) { return cb(err) }
    var data = JSON.parse(reply)
    cb(null, data)
  })
}
