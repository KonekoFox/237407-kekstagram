'use strict';

var Gallery = function(elem, index, data) {
  this.pictures = [];
  this.activePicture = 0;

  this.galleryOverlay = document.querySelector('.gallery-overlay');
  this.galleryOverlayClose = document.querySelector('.gallery-overlay-close');
  this.galleryOverlayImage = document.querySelector('.gallery-overlay-image');
  this.element = document.querySelector('.picture');
  var self = this;

  this.element.onclick = function(evt) {
    if (evt.target.classList.contains('picture')) {
      evt.preventDefault();
      openGallery(self.pictures);
    }
  };

  this.remove = function() {
    this.element.removeEventListener('click', this.onBackgroundClick);
  };
};

Gallery.prototype.openGallery = function(elem, index, data) {
  self.setPictures = function(data) {
    self.pictures = data;
  };

  self.show = function(index) {
    self.galleryOverlayClose.onclick = function() {
      self.hide();
    };
    self.galleryOverlayImage.onclick = function() {
      self.setActivePicture(index + 1 || this.activePicture);
    };
    self.galleryOverlay.classList.remove('invisible');
    self.setActivePicture(index);
  };

  self.hide = function() {
    self.galleryOverlay.classList.add('invisible');
    self.galleryOverlayClose.onclick = null;
    self.galleryOverlayImage.onclick = null;
  };

  self.setActivePicture = function(index) {
    self.activePicture = index;
    self.galleryOverlayImage.src = self.pictures[self.activePicture].url;
    self.galleryOverlay.querySelector('.likes-count').textContent = self.pictures[self.activePicture].likes;
    self.galleryOverlay.querySelector('.comments-count').textContent = self.pictures[self.activePicture].comments;
  };
};

module.exports = Gallery();
