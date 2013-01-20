var async = require('async');
var should = require('should');
var fetch = require('../index');
var readFile = require('imacros-read-file');
runTests(function (err, reply) {
  if (err) {
    alert('check test suite fails with error: ' + JSON.stringify(err));
    return false;
  }
  iimDisplay('Success! Checks test suite passes');
});

function runTests(cb) {
  var filePath = 'file:///users/noah/src/node/docparse-scraper-skeleton/docparse-imacros/docparse-fetch-imacros/test/localConfig.json'
  loadConfigFile(filePath, function (err, config) {
    should.not.exist(err, 'error loading config file')
    async.series([
      function (cb) {
        fetchExistingDocument(config, cb);
      },
      function (cb) {
        fetchNullDocument(config, cb);
      },
    ], cb)
  });
}

function fetchExistingDocument(config, cb) {
  iimDisplay('fetching existing document');
  var hash = '030f4f991961031d959dc1a9b077b0452e646dd7';
  var data = {
    config: config,
    hash: hash
  }
  fetch(data, function (err, reply) {
    if (err) { return cb(err); }
    if (!reply.text_pages) {
      return cb('"text_pages" field missing in fetch response from pdfer api');
    }
    cb();
  });
}

function fetchNullDocument(config, cb) {
  iimDisplay('fetching null document');
  var hash = 'dummy hash value here';
  var data = {
    config: config,
    hash: hash
  }
  fetch(data, function (err, reply) {
    if (!err) {
      return cb('fetch api request did not through an error for an invalid hash value like it should have');
    }
    cb();
  });
}

function loadConfigFile(filePath, cb) {
  readFile(filePath, function (err, reply) {
    if (err) { return cb(err); }
    var data = JSON.parse(reply);
    cb(null, data);
  });
}
