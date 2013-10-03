'use strict';

exports.User = function() {
  return Object.create(null, {
    _socket: {
      value: { write: function() {} }
    },
    id: { value: require('node-uuid').v4() }
  });
};
