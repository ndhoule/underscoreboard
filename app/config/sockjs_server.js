(function() {
  'use strict';

  define(['sockjs'], function (sockjs) {
    var sockjs_opts = {
      sockjs_url: 'http://cdn.sockjs.org/sockjs-0.3.min.js'
    };

    return sockjs.createServer(sockjs_opts);
  });
}());
