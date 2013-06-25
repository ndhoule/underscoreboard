(function() {
  'use strict';

  define(['sockjs'], function (sockjs) {
    return sockjs.createServer();
  });
}());
