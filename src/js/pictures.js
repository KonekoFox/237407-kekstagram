'use strict';

var load = require('./load');
var getPictureElement = require('./picture');

var PICTURES_LOAD_URL = 'http://localhost:1507/api/pictures';
var filters = document.querySelector('.filters');
var container = document.querySelector('.pictures');

var showPictures = (function() {

  filters.classList.add('hidden');

  var showPictures = function(pictures) {
    pictures.forEach(function(picture) {
      container.appendChild(getPictureElement(picture));
    });
  };

  load(PICTURES_LOAD_URL, showPictures, 'loadPictures');

  filters.classList.remove('hidden');
})();

module.exports = showPictures;