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

var showPictures = (function() {

  filters.classList.add('hidden');

  var showPics = function(pictures) {
    Gallery.setPictures(pictures);

    container.innerHTML = '';

    pictures.forEach(function(picture, index) {
      container.appendChild(new Picture(picture, index).element);
    });
  };

  var addPictures = function() {
    if (container.getBoundingClientRect().height - 120 < window.innerHeight - footer.getBoundingClientRect().height) {
      loadPictures(activeFilter, ++pageNumber);
    }
  };

  var loadPictures = function(filter, page) {
    load(PICTURES_LOAD_URL, {
      from: 0,
      to: page * PAGE_SIZE + PAGE_SIZE,
      filter: filter },
      showPics);
  };

  loadPictures(activeFilter, pageNumber);
  addPictures();

  filters.classList.remove('hidden');

  filters.addEventListener('change', function(evt) {
    if (evt.target.classList.contains('filters-radio')) {
      changeFilter(evt.target.id);
    }
  });

  var changeFilter = function(filterID) {
    container.innerHTML = '';
    activeFilter = filterID;
    pageNumber = 0;
    loadPictures(filterID, pageNumber);
    addPictures();
  };

  var THROTTLE_DELAY = 100;
  var lastCall = Date.now();


  window.addEventListener('scroll', function() {
    if (Date.now() - lastCall >= THROTTLE_DELAY) {
      if (footer.getBoundingClientRect().bottom - window.innerHeight <= GAP) {
        loadPictures(activeFilter, ++pageNumber);
        addPictures();
      }

      lastCall = Date.now();
    }
  });

})();

module.exports = showPictures;
