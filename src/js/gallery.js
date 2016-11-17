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
    this.pictures = this.pictures.concat(data);
  },

  removePictures: function() {
    this.pictures = [];
  },

  show: function(index) {

    this.galleryOverlayClose.onclick = function() {
      this.hide();
    }.bind(this);

    this.galleryOverlayImage.onclick = function() {
      if (this.pictures.indexOf(this.pictures[++index]) !== -1) {
        this.setActivePicture(index);
      } else {
        index = 0;
        this.setActivePicture(index);
      }
    }.bind(this);

    this.galleryOverlay.classList.remove('invisible');
    this.setActivePicture(index);
  },

  hide: function() {
    this.galleryOverlay.classList.add('invisible');
    this.galleryOverlayClose.onclick = null;
    this.galleryOverlayImage.onclick = null;
  },

  setActivePicture: function(index) {
    this.activePicture = index;
    this.galleryOverlayImage.src = this.pictures[this.activePicture].url;
    this.galleryOverlay.querySelector('.likes-count').textContent = this.pictures[this.activePicture].likes;
    this.galleryOverlay.querySelector('.comments-count').textContent = this.pictures[this.activePicture].comments;
  }
};

module.exports = new Gallery();
