'use strict';

var Gallery = function() {
  this.pictures = [];
  this.activePicture = 0;

  this.galleryOverlay = document.querySelector('.gallery-overlay');
  this.galleryOverlayClose = document.querySelector('.gallery-overlay-close');
  this.galleryOverlayImage = document.querySelector('.gallery-overlay-image');
};

Gallery.prototype = {

  setPictures: function(data) {
    this.pictures = data;
  },

  show: function(index) {
    var self = this;

    this.galleryOverlayClose.onclick = function() {
      self.hide();
    };

    this.galleryOverlayImage.onclick = function() {
      if (self.pictures.indexOf(self.pictures[++index]) !== -1) {
        self.setActivePicture(index);
      } else {
        self.setActivePicture(index = 0);
      }
    };

    this.galleryOverlay.classList.remove('invisible');
    this.setActivePicture(index);
  },

  hide: function() {
    this.galleryOverlay.classList.add('invisible');
    this.galleryOverlayClose.onclick = null;
    this.galleryOverlayImage.onclick = null;
  },

  setActivePicture: function(index) {
    var self = this;

    this.activePicture = index;
    this.galleryOverlayImage.src = self.pictures[self.activePicture].url;
    this.galleryOverlay.querySelector('.likes-count').textContent = self.pictures[self.activePicture].likes;
    this.galleryOverlay.querySelector('.comments-count').textContent = self.pictures[self.activePicture].comments;
  }
};

module.exports = new Gallery();
