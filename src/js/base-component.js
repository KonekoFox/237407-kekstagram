'use strict';

var BaseComponent = function(el) {
  this.element = el;
};

BaseComponent.prototype = {
  onClick: function(evt) {
    evt.preventDefault();
  },

  removeListener: function() {
    this.element.removeEventListener('click', this.onClick);
  },

  removeElement: function() {
    this.element.parentNode.removeChild(this.element);
  }
};

module.exports = BaseComponent;
