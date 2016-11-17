'use strict';

var Gallery = require('./gallery');

var Picture = function(picture, index) {
  this.data = picture;
  this.index = index;
  this.element = this.getPictureElement(this.data);

  this.onClick = this.onClick.bind(this);
  this.element.addEventListener('click', this.onClick);
};

Picture.prototype = {

  onClick: function(evt) {
    evt.preventDefault();
    Gallery.show(this.index);
  },

  remove: function() {
    this.element.onclick = null;
  },

  getPictureElement: function(picture) {
    var template = document.querySelector('#picture-template');
    var templateContainer = 'content' in template ? template.content : template;
    var pictureElement = templateContainer.querySelector('.picture').cloneNode(true);
    var image = new Image();

    image.src = picture.url;
    pictureElement.querySelector('.picture-likes').textContent = picture.likes;
    pictureElement.querySelector('.picture-comments').textContent = picture.comments;

    image.onload = function() {
      pictureElement.querySelector('img').src = picture.url;
      pictureElement.querySelector('img').width = '182';
      pictureElement.querySelector('img').height = '182';
    };

    image.onerror = function() {
      pictureElement.classList.add('picture-load-failure');
    };

    return pictureElement;
  }
};

module.exports = Picture;
