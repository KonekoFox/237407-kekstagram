'use strict';

var load = function(url, params, callback) {
  var getSearchString = function() {
    return Object.keys(params).map(function(param) {
      return [param, params[param]].join('=');
    }).join('&');
  };

  var xhr = new XMLHttpRequest();
  xhr.onload = function(evt) {
    var loadedData = JSON.parse(evt.target.response);
    callback(loadedData);
  };
  xhr.open('GET', url + '?' + getSearchString(params));
  xhr.send();
};

module.exports = load;
