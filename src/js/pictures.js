'use strict';

var Gallery = require('./gallery');
var load = require('./load');
var Picture = require('./picture');

var PICTURES_LOAD_URL = '/api/pictures';

var filters = document.querySelector('.filters');
var container = document.querySelector('.pictures');
var footer = document.querySelector('.footer');
var DEFAULT_FILTER = 'filter-popular';
var activeFilter = DEFAULT_FILTER;
var PAGE_SIZE = 12;
var GAP = 100;
var pageNumber = 0;
var lastPicture;
var arrayPictures = [];

var showPictures = (function() {

  filters.classList.add('hidden');

  var showPics = function(pictures) {
    pictures.forEach(function(picture, index, pictures) {
      container.appendChild(new Picture(picture, index).element);
      arrayPictures = arrayPictures.concat(picture);
    });

    lastPicture = document.querySelector('.picture:last-child');

    while (container.getBoundingClientRect().right - lastPicture.getBoundingClientRect().right > 30 && pageNumber < 2) {
      loadPictures(activeFilter, ++pageNumber);
    }

    Gallery.setPictures(arrayPictures);

  };

  var loadPictures = function(filter, page) {
    load(PICTURES_LOAD_URL, {
         from: page * PAGE_SIZE,
         to: page * PAGE_SIZE + PAGE_SIZE,
         filter: filter },
         showPics);
  };

  loadPictures(activeFilter, pageNumber);

  filters.classList.remove('hidden');

  filters.addEventListener('change', function(evt) {
    if (evt.target.classList.contains('filters-radio')) {
      changeFilter(evt.target.id);
    }
  });

  var changeFilter = function(filterID) {
    var elements = document.querySelectorAll('.picture');
    elements.forEach.call(elements, function(elem) {
      elem.onclick = null;
    });

    container.innerHTML = '';
    arrayPictures = [];
    activeFilter = filterID;
    pageNumber = 0;
    loadPictures(filterID, pageNumber);
  };

  window.addEventListener('scroll', function() {
    if (footer.getBoundingClientRect().bottom - window.innerHeight <= GAP) {
      loadPictures(activeFilter, ++pageNumber);
    }
  });

})();

module.exports = showPictures;
