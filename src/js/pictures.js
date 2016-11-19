'use strict';

var Gallery = require('./gallery');
var load = require('./load');
var Picture = require('./picture');

var PICTURES_LOAD_URL = '/api/pictures';

var container = document.querySelector('.pictures');
var footer = document.querySelector('.footer');

var filters = document.querySelector('.filters');
var DEFAULT_FILTER = localStorage.getItem('filter') || 'filter-popular';
var activeFilter = DEFAULT_FILTER;
filters.querySelector('#' + activeFilter).checked = true;

var PAGE_SIZE = 12;
var GAP = 100;
var pageNumber = 0;

var showPictures = (function() {

  filters.classList.add('hidden');

  var showPics = function(pictures) {
    if (pictures.length > 0) {
      Gallery.setPictures(pictures);

      pictures.forEach(function(picture, index) {
        container.appendChild(new Picture(picture, index + pageNumber * PAGE_SIZE).element);
      });

      if (container.getBoundingClientRect().height - 120 < window.innerHeight - footer.getBoundingClientRect().height) {
        loadPictures(activeFilter, ++pageNumber);
      }

      restoreFromHash();
    }
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
    container.innerHTML = '';
    Gallery.removePictures();
    activeFilter = filterID;
    localStorage.setItem('filter', filterID);
    pageNumber = 0;
    loadPictures(filterID, pageNumber);
  };

  var THROTTLE_DELAY = 100;
  var lastCall = Date.now();

  window.addEventListener('scroll', function() {
    if (Date.now() - lastCall >= THROTTLE_DELAY) {
      if (footer.getBoundingClientRect().bottom - window.innerHeight <= GAP) {
        loadPictures(activeFilter, ++pageNumber);
      }

      lastCall = Date.now();
    }
  });

  var regexp = /#photo\/(\S+)/;

  var restoreFromHash = function() {
    if (location.hash.match(regexp)) {
      Gallery.show(location.hash.match(regexp)[1]);
    } else {
      Gallery.close();
    }
  };

  window.addEventListener('hashchange', restoreFromHash, false);

})();

module.exports = showPictures;
