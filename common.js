'use strict';

Function.prototype.bind = Function.prototype.bind || require('function-bind');

var CommonUtils = {};
CommonUtils.forEach = [].forEach;
CommonUtils.slice = [].slice;

CommonUtils.extend = function extend(target, source, shallow) {
  var array = '[object Array]',
    object = '[object Object]',
    targetMeta, sourceMeta,
    setMeta = function(value) {
      var meta,
        jclass = {}.toString.call(value);
      if (value === undefined) return 0;
      if (typeof value !== 'object') return false;
      if (jclass === array) {
        return 1;
      }
      if (jclass === object) return 2;
    };
  for (var key in source) {
    if (source.hasOwnProperty(key)) {
      targetMeta = setMeta(target[key]);
      sourceMeta = setMeta(source[key]);
      if (source[key] !== target[key]) {
        if (!shallow && sourceMeta && targetMeta && targetMeta === sourceMeta) {
          target[key] = extend(target[key], source[key], true);
        } else if (sourceMeta !== 0) {
          target[key] = source[key];
        }
      }
    } else break; // ownProperties are always first (see jQuery's isPlainObject function)
  }
  return target;
};

CommonUtils.bindAll = function bindAll(obj) {
  var funcs = this.slice.call(arguments, 1);

  if (funcs.length === 0) {
    throw new Error('bindAll must be passed function names');
  }

  this.forEach.call(funcs, function(f) {
    obj[f] = Function.prototype.bind.call(obj[f], obj);
  });

  return obj;
};

CommonUtils.random32 = function random32() {
  return Math.random().toString(32).slice(2);
};

/**
 * @param {String} url
 * @return {Boolean} true if the url is valid, otherwise false.
 */
CommonUtils.isValidUrl = function isValidUrl(url) {
  var urlRegexp = RegExp(
    "^" +
    // protocol identifier
    "(?:(?:https?|ftp)://)?" +
    // user:pass authentication
    "(?:\\S+(?::\\S*)?@)?" +
    "(?:" +
    // IP address exclusion
    // private & local networks
    "(?!(?:10|127)(?:\\.\\d{1,3}){3})" +
    "(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})" +
    "(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})" +
    // IP address dotted notation octets
    // excludes loopback network 0.0.0.0
    // excludes reserved space >= 224.0.0.0
    // excludes network & broacast addresses
    // (first & last IP address of each class)
    "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
    "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
    "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
    "|" +
    // host name
    "(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)" +
    // domain name
    "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*" +
    // TLD identifier
    "(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))" +
    ")" +
    // port number
    "(?::\\d{2,5})?" +
    // resource path
    "(?:/[^\\s]*)?" +
    "$", "i"
  );

  return urlRegexp.test(CommonUtils.formatLink(url));
};

/**
 * Alpha numeric random string
 * ability to set charts to use
 *
 * @param  {int} length
 * @param  {string} chars  chars to use
 * @return {string} defaults to returning 10 alphanumeric
 */
CommonUtils.randomString = function randomString(length, chars) {
  var cs = chars || '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var l = length || 10;
  var result = '';
  for (var i = l; i > 0; --i) {
    result += cs[Math.round(Math.random() * (cs.length - 1))];
  }
  return result;
};

CommonUtils.formatLink = function formatLink(value) {
  var prefixRegex = /^https?:\/\//;

  if (value.match(prefixRegex)) {
    return value;
  }

  return 'http://' + value;
};

module.exports = CommonUtils;
