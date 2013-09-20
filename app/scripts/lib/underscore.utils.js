(function(root) {
  var _u = {
    throwIf: function(condition, message) {
      message = message === undefined ? 'Error' : message;

      if (condition) {
        throw new Error(message);
      }
    }
  };

  // CommonJS export
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports)
      module.exports = _u;

    exports._u = _u;
  }

  // AMD export
  if (typeof define === 'function' && define.amd) {
    define('underscore.utils', [], function(){ return _u; });
  }

  root._ = root._ || {};
  root._.utils = root._.u = _u;
}(this));
