/**
 * Get a list of existing bills from the DocParse api server
 */
function validateData(data, cb) {
  if (!data.hash) {
    return cb('"hash" Field missing from data parameter');
  }

  if (!data.config) {
    return cb('"config" field missing from data parameter');
  }
  if (!data.config.pdfer) {
    return cb('"pdfer" field missing from data.config parameter');
  }
  if (!data.config.pdfer.username) {
    return cb('"username" field missing from data.config.pdfer parameter');
  }
  if (!data.config.pdfer.password) {
    return cb('"password" field missing from data.config.pdfer parameter');
  }
  if (!data.config.pdfer.host) {
    return cb('"host" field missing from data.config.pdfer parameter');
  }
  if (!data.config.pdfer.port) {
    return cb('"port" field missing from data.config.pdfer parameter');
  }
  cb();
}
function getURL(data) {
  var config = data.config;
  var hash = data.hash;
  var url = 'http://'+config.pdfer.username + ':' + config.pdfer.password
        + '@'+config.pdfer.host + ':'+config.pdfer.port
        + '/api/fetch/' + hash;
  return url;
}
function parseResponse(request, cb) {
  var body = request.response;
  if (body === 'Unauthorized') {
    iimDisplay('fetch failed, "Unauthorized"');
    return cb('error fetching pdfer data, body: "Unauthorized"');
  }

  var resData = JSON.parse(body);
  var statusCode = request.status;
  if (statusCode !== 200) {
    iimDisplay('fetch failed, bad status code: ' + statusCode);
    return cb('error fetching data for hash, bad status code: ' + statusCode);
  }
  if (!resData.hasOwnProperty('text_pages')) {
    iimDisplay('fetch reply missing "text_pages" field');
    return cb('fetch reply missing "text_pages" property');
  }
  iimDisplay('fetch complete with result: ' + JSON.stringify(resData.download));
  cb(null, resData);
}

module.exports = function(data, cb) {
  iimDisplay('validating fetch data');
  validateData(data, function (err, reply) {
    if (err) { return cb(err); }
    iimDisplay('fetch data validated');
    if (!cb) {
      iimDisplay('no callback supplied to fetch data');
      alert('no callback supplied to fetch data');
      return;
    }
    iimDisplay('getting url');
    var url = getURL(data);
    iimDisplay('got url: ' + url);
    var request = new XMLHttpRequest();
    var async = false;
    request.open('GET', url, async);
    request.send();
    // because of "false" above, will block until the request is done and status
    // is available. Not recommended, however it works for simple cases.
    iimDisplay('parsing fetch response: ' + request.response);
    parseResponse(request, cb);
  });
};
