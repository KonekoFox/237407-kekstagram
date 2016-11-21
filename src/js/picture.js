'use strict';

var BaseComponent = require('./base-component');
var utils = require('./utils');

var Picture = function(picture) {
  this.data = picture;
  this.element = this.getPictureElement(this.data);

  BaseComponent.call(this, this.element);

  this.onClick = this.onClick.bind(this);
  this.element.addEventListener('click', this.onClick);
};

utils.inherit(Picture, BaseComponent);

Picture.prototype = {

  onClick: function(evt) {
    BaseComponent.prototype.onClick.call(this, evt);
    location.hash = 'photo/' + this.data.url;
  },

  remove: function() {
    BaseComponent.prototype.removeListener.call(this);
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
