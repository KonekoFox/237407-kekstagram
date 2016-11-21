'use strict';

var utils = {
  inherit: function(ChildComponent, BaseComponent) {
    var EmptyConstructor = function() {};
    EmptyConstructor.prototype = BaseComponent.prototype;
    ChildComponent.prototype = new EmptyConstructor();
  }
};

module.exports = utils;
