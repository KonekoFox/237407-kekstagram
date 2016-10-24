'use strick';

var PICTURES_LOAD_URL = 'http://localhost:1507/api/pictures';
var filters = document.querySelector('.filters');
var container = document.querySelector('.pictures');
var template = document.querySelector('#picture-template');
var templateContainer = 'content' in template ? template.content : template;

var load = function(url, callback, callbackName) {
  if (!callbackName) {
    callbackName = 'cb' + Date.now();
  }

  window[callbackName] = function(data) {
    callback(data);
  }

  var script = document.createElement('script');
  script.src = url + '?callback=' + callbackName;
  document.body.appendChild(script);
};

filters.classList.add('hidden');

var getPictureElement = function(picture) {
  var pictureElement = templateContainer.querySelector('.picture').cloneNode(true);

  var image = new Image();

  image.onload = function(evt) {
    pictureElement.querySelector('img').src = picture.url;
    pictureElement.querySelector('img').width = '182';
    pictureElement.querySelector('img').height = '182';
  };

  image.onerror = function() {
    pictureElement.classList.add('picture-load-failure');
  };

  image.src = picture.url;
  pictureElement.querySelector('.picture-likes').textContent = picture.likes;
  pictureElement.querySelector('.picture-comments').textContent = picture.comments;

  return pictureElement;
};

var showPictures = function(pictures) {
  pictures.forEach(function(picture) {
    container.appendChild(getPictureElement(picture));
  });
};

load(PICTURES_LOAD_URL, showPictures, 'loadPictures');

filters.classList.remove('hidden');
