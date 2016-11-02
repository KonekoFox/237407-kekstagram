'use strict';

var load = require('./load');
var getPictureElement = require('./picture');

var PICTURES_LOAD_URL = 'http://localhost:1507/api/pictures';
var filters = document.querySelector('.filters');
var container = document.querySelector('.pictures');
filters.classList.add('hidden');

var showPictures = (function() {

  filters.classList.add('hidden');

  var showPics = function(pictures) {
    pictures.forEach(function(picture, index, pictures) {
      container.appendChild(getPictureElement(picture, index, pictures));
    });
  };

  load(PICTURES_LOAD_URL, showPics, 'loadPictures');

  filters.classList.remove('hidden');
})();

module.exports = showPictures;
