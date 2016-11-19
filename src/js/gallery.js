'use strict';

var Gallery = function() {
  this.pictures = [];
  this.activePicture = null;

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

  show: function(url) {

    this.galleryOverlayClose.onclick = function() {
      this.hide();
    }.bind(this);

    this.galleryOverlayImage.onclick = function() {
      if (this.pictures.indexOf(this.pictures[++this.activePicture]) !== -1) {
        location.hash = 'photo/' + this.pictures[this.activePicture].url;
      } else {
        this.activePicture = 0;
        location.hash = 'photo/' + this.pictures[this.activePicture].url;
      }
    }.bind(this);

    this.galleryOverlay.classList.remove('invisible');
    this.setActivePicture(url);
  },

  hide: function() {
    location.hash = '';
  },

  close: function() {
    this.galleryOverlay.classList.add('invisible');
    this.galleryOverlayClose.onclick = null;
    this.galleryOverlayImage.onclick = null;
    this.activePicture = null;
  },

  setActivePicture: function(url) {
    for (this.activePicture = 0; this.activePicture < this.pictures.length; this.activePicture++) {
      if (this.pictures[this.activePicture].url === url) {
        this.galleryOverlayImage.src = url;
        this.galleryOverlay.querySelector('.likes-count').textContent = this.pictures[this.activePicture].likes;
        this.galleryOverlay.querySelector('.comments-count').textContent = this.pictures[this.activePicture].comments;
        break;
      } else {
        this.galleryOverlayImage.src = url;
        this.galleryOverlay.querySelector('.likes-count').textContent = null;
        this.galleryOverlay.querySelector('.comments-count').textContent = null;
      }
    }
  }
};

module.exports = new Gallery();
