/*! Notify - v0.0.2 - 2017-03-03
* Copyright (c) 2017 Martin Laritz;
* Contributor(s): David Castillo;
 Licensed MIT */

(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.vNotify = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = (function() {

  var positionOption = {
    topCenter: 'topCenter',
    topLeft: 'topLeft',
    topRight: 'topRight',
    bottomLeft: 'bottomLeft',
    bottomRight: 'bottomRight',
    center: 'center'
  };

  var options = {
    fadeInDuration: 600,
    fadeOutDuration: 1000,
    fadeInterval: 50,
    visibleDuration: 5000,
    postHoverVisibleDuration: 500,
    position: positionOption.topRight,
    sticky: false,
    showClose: true
  };

  var addText = function (text) {
    var item = document.createElement('div');
    item.classList.add('vnotify-text');
    item.innerHTML = text;
    return item;
  };

  var addTitle = function (title) {
    var item = document.createElement('div');
    item.classList.add('vnotify-title');
    item.innerHTML = title;
    return item;
  };

  var remove = function (item) {
    item.style.display = 'none';
    item.outerHTML = '';
    item = null;
  };

  var addClose = function (parent) {
    var item = document.createElement('span');
    item.classList.add('vn-close');
    item.addEventListener('click', function () {
      remove(parent);
    });
    return item;
  };

  var createNotifyContainer = function (positionClass) {
    var frag = document.createDocumentFragment();
    var container = document.createElement('div');
    container.classList.add('vnotify-container');
    container.classList.add(positionClass);
    container.setAttribute('role', 'alert');

    frag.appendChild(container);
    document.body.appendChild(frag);

    return container;
  };

  var getPositionClass = function (option) {
    if (option === positionOption.topCenter) {
      return 'vn-top-center';
    } else if (option === positionOption.topLeft) {
      return 'vn-top-left';
    } else if (option === positionOption.topRight) {
      return 'vn-top-right';
    } else if (option === positionOption.bottomRight) {
      return 'vn-bottom-right';
    } else if (option === positionOption.bottomLeft) {
      return 'vn-bottom-left';
    } else if (option === positionOption.center) {
      return 'vn-center';
    } else {
      return 'vn-top-right';
    }
  };

  var getNotifyContainer = function (position) {
    var positionClass = getPositionClass(position);
    var container = document.querySelector('.' + positionClass);
    return container ? container : createNotifyContainer(positionClass);
  };

  var getOptions = function (opts) {
    return {
      fadeInDuration: opts.fadeInDuration || options.fadeInDuration,
      fadeOutDuration: opts.fadeOutDuration || options.fadeOutDuration,
      fadeInterval: opts.fadeInterval || options.fadeInterval,
      visibleDuration: opts.visibleDuration || options.visibleDuration,
      postHoverVisibleDuration: opts.postHoverVisibleDuration || options.postHoverVisibleDuration,
      position: opts.position || options.position,
      sticky: opts.sticky !== null ? opts.sticky : options.sticky,
      showClose: opts.showClose !== null ? opts.showClose : options.showClose
    };
  };

  var checkRemoveContainer = function () {
    var item = document.querySelector('.vnotify-item');
    if (!item) {
      var container = document.querySelectorAll('.vnotify-container');
      for (var i = 0; i < container.length; i++) {
        container[i].outerHTML = '';
        container[i] = null;
      }
    }
  };

  //New fade - based on http://toddmotto.com/raw-javascript-jquery-style-fadein-fadeout-functions-hugo-giraudel/
  var fade = function (type, ms, el) {
    var isIn = type === 'in',
      opacity = isIn ? 0 : el.style.opacity || 1,
      goal = isIn ? 0.95 : 0,
      gap = options.fadeInterval / ms;

    if (isIn) {
      el.style.display = 'block';
      el.style.opacity = opacity;
    }

    var fading;

    var func = function () {
      opacity = isIn ? opacity + gap : opacity - gap;
      el.style.opacity = opacity;

      if (opacity <= 0) {
        remove(el);
        checkRemoveContainer();
      }
      if ((!isIn && opacity <= goal) || (isIn && opacity >= goal)) {
        window.clearInterval(fading);
      }
    };

    fading = window.setInterval(func, options.fadeInterval);
    return fading;
  };

  var addNotify = function (params) {
    if (!params.title && !params.text) {
      return null;
    }

    var frag = document.createDocumentFragment();

    var item = document.createElement('div');
    item.classList.add('vnotify-item');
    item.classList.add(params.notifyClass);
    item.style.opacity = 0;

    item.options = getOptions(params);

    if (params.title) {
      item.appendChild(addTitle(params.title));
    }
    if (params.text) {
      item.appendChild(addText(params.text));
    }
    if (item.options.showClose) {
      item.appendChild(addClose(item));
    }

    item.visibleDuration = item.options.visibleDuration; //option

    var hideNotify = function () {
      item.fadeInterval = fade('out', item.options.fadeOutDuration, item);
    };

    var resetInterval = function () {
      clearTimeout(item.interval);
      clearTimeout(item.fadeInterval);
      item.style.opacity = null;
      item.visibleDuration = item.options.postHoverVisibleDuration;
    };

    var hideTimeout = function () {
      item.interval = setTimeout(hideNotify, item.visibleDuration);
    };

    frag.appendChild(item);
    var container = getNotifyContainer(item.options.position);
    container.appendChild(frag);

    item.addEventListener('mouseover', resetInterval);

    fade('in', item.options.fadeInDuration, item);

    if (!item.options.sticky) {
      item.addEventListener('mouseout', hideTimeout);
      hideTimeout();
    }



    return item;
  };

  var info = function (params) {
    params.notifyClass = 'vnotify-info';
    return addNotify(params);
  };

  var success = function (params) {
    params.notifyClass = 'vnotify-success';
    return addNotify(params);
  };

  var error = function (params) {
    params.notifyClass = 'vnotify-error';
    return addNotify(params);
  };

  var warning = function (params) {
    params.notifyClass = 'vnotify-warning';
    return addNotify(params);
  };

  var notify = function (params) {
    params.notifyClass = 'vnotify-notify';
    return addNotify(params);
  };

  var custom = function (params) {
    return addNotify(params);
  };

  return {
    info: info,
    success: success,
    error: error,
    warning: warning,
    notify: notify,
    custom: custom,
    options: options,
    positionOption: positionOption
  };
})();

},{}]},{},[1])(1)
});