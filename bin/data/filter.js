'use strict';

module.exports = function(list, filterID) {
  switch (filterID) {

    case 'filter-popular':
    return list.sort(function(a, b) {
      return b.likes - a.likes;
    });
    break;

    case 'filter-new':
    list = list.filter(function(item) {
        return new Date() - item.created <= (3 * 24 * 3600 * 1000);
      }).sort(function(a, b) {
        return b.created - a.created;
      });
    return list;
    break;

    case 'filter-discussed':
    return list.sort(function(a, b) {
      return b.comments - a.comments;
    });
    break;
  }

  return list;

};
