(function () {
  /*
   * The dream frame runs with a sandboxed opaque origin, so the real
   * localStorage/sessionStorage throw SecurityError on any access. Generated
   * era pages still expect the Web Storage API (hit counters, guestbook names,
   * theme toggles), so install an in-memory store per document. Nothing is
   * persisted and nothing is shared with the host app: a stolen "storage"
   * reference can only read values the same page wrote.
   */
  function makeStore() {
    var data = Object.create(null);
    var api = {
      getItem: function (key) {
        var k = String(key);
        return Object.prototype.hasOwnProperty.call(data, k) ? data[k] : null;
      },
      setItem: function (key, value) {
        data[String(key)] = String(value);
      },
      removeItem: function (key) {
        delete data[String(key)];
      },
      clear: function () {
        data = Object.create(null);
      },
      key: function (index) {
        var keys = Object.keys(data);
        var i = Number(index);
        return i >= 0 && i < keys.length ? keys[i] : null;
      }
    };
    Object.defineProperty(api, "length", {
      get: function () {
        return Object.keys(data).length;
      }
    });
    return api;
  }

  function install(name) {
    var store = makeStore();
    try {
      Object.defineProperty(window, name, {
        configurable: true,
        enumerable: true,
        get: function () {
          return store;
        }
      });
    } catch (e) {}
  }

  install("localStorage");
  install("sessionStorage");
})();
