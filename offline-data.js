/* Offline Quran storage. Data is saved locally after an explicit user action. */
(function (window) {
  var DB_NAME = 'redro-islamic-offline';
  var DB_VERSION = 1;
  var SURAH_STORE = 'surahs';
  var AUDIO_CACHE = 'redro-quran-audio-v1';
  var INTERFACE_CACHE = 'redro-interface-assets-v1';

  function openDb() {
    return new Promise(function (resolve, reject) {
      if (!window.indexedDB) return reject(new Error('indexeddb-unavailable'));
      var request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = function () {
        if (!request.result.objectStoreNames.contains(SURAH_STORE)) request.result.createObjectStore(SURAH_STORE, { keyPath: 'number' });
      };
      request.onsuccess = function () { resolve(request.result); };
      request.onerror = function () { reject(request.error || new Error('indexeddb-open-failed')); };
    });
  }
  function putSurah(record) {
    return openDb().then(function (db) {
      return new Promise(function (resolve, reject) {
        var tx = db.transaction(SURAH_STORE, 'readwrite');
        tx.objectStore(SURAH_STORE).put(record);
        tx.oncomplete = function () { db.close(); resolve(record); };
        tx.onerror = function () { db.close(); reject(tx.error || new Error('indexeddb-write-failed')); };
      });
    });
  }
  function getSurah(number) {
    return openDb().then(function (db) {
      return new Promise(function (resolve, reject) {
        var req = db.transaction(SURAH_STORE, 'readonly').objectStore(SURAH_STORE).get(number);
        req.onsuccess = function () { db.close(); resolve(req.result || null); };
        req.onerror = function () { db.close(); reject(req.error); };
      });
    });
  }
  function getAllSurahs() {
    return openDb().then(function (db) {
      return new Promise(function (resolve, reject) {
        var req = db.transaction(SURAH_STORE, 'readonly').objectStore(SURAH_STORE).getAll();
        req.onsuccess = function () { db.close(); resolve(req.result || []); };
        req.onerror = function () { db.close(); reject(req.error); };
      });
    });
  }
  function cacheAudio(url, response) {
    if (!window.caches) return Promise.resolve();
    return caches.open(AUDIO_CACHE).then(function (cache) { return cache.put(url, response); });
  }
  function getCachedAudio(url) {
    if (!window.caches) return Promise.resolve(null);
    return caches.open(AUDIO_CACHE).then(function (cache) { return cache.match(url); }).then(function (response) {
      return response ? response.blob().then(function (blob) { return URL.createObjectURL(blob); }) : null;
    });
  }
  function cacheInterfaceAssets(urls) {
    if (!window.caches) return Promise.reject(new Error('cache-unavailable'));
    return caches.open(INTERFACE_CACHE).then(function (cache) {
      return Promise.all(urls.map(function (url) { return fetch(url).then(function (response) { if (!response.ok) throw new Error('resource-download-failed'); return cache.put(url, response); }); }));
    });
  }
  function getInterfaceAssetCount() {
    if (!window.caches) return Promise.resolve(0);
    return caches.open(INTERFACE_CACHE).then(function (cache) { return cache.keys(); }).then(function (requests) { return requests.length; });
  }
  function clearOffline() {
    var dbPromise = openDb().then(function (db) {
      return new Promise(function (resolve, reject) {
        var tx = db.transaction(SURAH_STORE, 'readwrite');
        tx.objectStore(SURAH_STORE).clear();
        tx.oncomplete = function () { db.close(); resolve(); };
        tx.onerror = function () { db.close(); reject(tx.error); };
      });
    });
    var cachePromise = window.caches ? caches.delete(AUDIO_CACHE) : Promise.resolve();
    var interfacePromise = window.caches ? caches.delete(INTERFACE_CACHE) : Promise.resolve();
    return Promise.all([dbPromise, cachePromise, interfacePromise]);
  }
  window.RedroOffline = {
    putSurah: putSurah,
    getSurah: getSurah,
    getAllSurahs: getAllSurahs,
    cacheAudio: cacheAudio,
    getCachedAudio: getCachedAudio,
    cacheInterfaceAssets: cacheInterfaceAssets,
    getInterfaceAssetCount: getInterfaceAssetCount,
    clearOffline: clearOffline,
    audioCacheName: AUDIO_CACHE
  };
}(window));
