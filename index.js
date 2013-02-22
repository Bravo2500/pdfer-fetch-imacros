/**
 * Get a list of existing bills from the DocParse api server
 */
function getURL(data) {
  var config = data.config;
  var hash = data.hash;
  var email = config.pdfer.email
  email = encodeURIComponent(email);
  apiKey = encodeURIComponent(apiKey);
  var apiKey = config.pdfer.apiKey
  var url = 'http://'+ email + ':' + apiKey
        + '@'+config.pdfer.host + ':'+config.pdfer.port
        + '/api/fetch/' + hash;
  return url;
}
function parseResponse(request, cb) {
  var resData;
  var body = request.response;
  if (body === 'Unauthorized') {
    iimDisplay('fetch failed, "Unauthorized"');
    return cb('error fetching pdfer data, body: "Unauthorized"');
  }

  try {
    resData = JSON.parse(body);
  }
  catch(err) {
    iimDisplay('error parsing pdfer fetch repsonse: ' + JSON.stringify(err, null, ' '));
    return cb(err);
  }
  var statusCode = request.status;
  if (statusCode !== 200) {
    iimDisplay('fetch failed, bad status code: ' + statusCode);
    return cb('error fetching data for hash, bad status code: ' + statusCode);
  }
  if (!resData.hasOwnProperty('textPages')) {
    iimDisplay('fetch reply missing "textPages" field');
    return cb('fetch reply missing "textPages" property');
  }
  iimDisplay('fetch complete with result: ' + JSON.stringify(resData.download));
  cb(null, resData);
}

module.exports = function(data, cb) {
  iimDisplay('validating fetch data');
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
};
