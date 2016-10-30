'use strict';

module.exports = function(picture) {
  var template = document.querySelector('#picture-template');
  var templateContainer = 'content' in template ? template.content : template;
  var pictureElement = templateContainer.querySelector('.picture').cloneNode(true);
  var image = new Image();

  image.onload = function() {
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
