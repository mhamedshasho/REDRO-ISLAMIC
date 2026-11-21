/* Compatibility helpers for older Android System WebView versions. */
(function () {
  if (!String.prototype.padStart) {
    String.prototype.padStart = function (length, fill) {
      var text = String(this);
      var filler = fill === undefined ? ' ' : String(fill);
      while (text.length < length) text = filler + text;
      return text.slice(-length);
    };
  }
  if (!String.prototype.includes) {
    String.prototype.includes = function (search, start) {
      return this.indexOf(search, start || 0) !== -1;
    };
  }
  if (!Array.prototype.includes) {
    Array.prototype.includes = function (value, start) {
      return this.indexOf(value, start || 0) !== -1;
    };
  }
  if (!Array.from) {
    Array.from = function (value) {
      return Array.prototype.slice.call(value);
    };
  }
  if (!Object.entries) {
    Object.entries = function (object) {
      var keys = Object.keys(object);
      var result = [];
      for (var i = 0; i < keys.length; i += 1) result.push([keys[i], object[keys[i]]]);
      return result;
    };
  }
  if (window.Element && !Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector || function (selector) {
      var nodes = (this.document || this.ownerDocument).querySelectorAll(selector);
      for (var i = 0; i < nodes.length; i += 1) if (nodes[i] === this) return true;
      return false;
    };
  }
  if (window.Element && !Element.prototype.closest) {
    Element.prototype.closest = function (selector) {
      var node = this;
      while (node && node.nodeType === 1) {
        if (node.matches ? node.matches(selector) : false) return node;
        node = node.parentElement;
      }
      return null;
    };
  }
}());
