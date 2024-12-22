"use strict";
var objectView = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // index.js
  var index_exports = {};
  __export(index_exports, {
    ObjectView: () => ObjectView
  });

  // libs/utils.min.mjs
  function se(e, t, n) {
    return Math.min(n, Math.max(e, t));
  }
  function ae(e, t, n) {
    return e -= t, n -= t, e < 0 && (e = e % n + n), e >= n && (e = e % n), e + t;
  }

  // libs/object-matrix.min.mjs
  function a(t) {
    return typeof t == "object" && t !== null;
  }
  function l(t) {
    return Array && Array.isArray ? Array.isArray(t) : Object.prototype.toString.call(t) === "[object Array]";
  }
  function c(t) {
    return typeof t == "function";
  }
  function u(t) {
    let e;
    l(t) ? e = [] : e = {};
    for (let [n, r] of Object.entries(t)) a(r) ? e[n] = u(r) : e[n] = r;
    return e;
  }
  function o(t, e, n) {
    return t -= e, n -= e, t < 0 && (t = t % n + n), t >= n && (t = t % n), t + e;
  }
  function s(t, e) {
    let n = new Array(t);
    if (c(e)) for (let r = 0; r < t; r++) n[r] = e(r);
    else if (a(e)) for (let r = 0; r < t; r++) n[r] = u(e);
    else if (l(e)) for (let r = 0; r < t; r++) n[r] = u(e);
    else if (typeof e < "u") for (let r = 0; r < t; r++) n[r] = e;
    return n;
  }
  var i = class {
    constructor(e) {
      this.width = 0, this.height = 0, this.data = [], Object.assign(this, e || {});
    }
  };
  i.prototype.init = function() {
    return this.data = s(this.width * this.height, null), this;
  };
  i.prototype.getIndex = function(t, e) {
    return t = o(t, 0, this.width), e = o(e, 0, this.height), e * this.width + t;
  };
  i.prototype.getValue = function(t, e) {
    return this.data[this.getIndex(t, e)];
  };
  i.prototype.setValue = function(t, e, n) {
    return this.data[this.getIndex(t, e)] = n, this;
  };
  i.prototype.getRow = function(t) {
    let e = [];
    for (let n = 0; n < this.width; n++) e.push(this.getValue(n, t));
    return e;
  };
  i.prototype.getColumn = function(t) {
    let e = [];
    for (let n = 0; n < this.height; n++) e.push(this.getValue(t, n));
    return e;
  };
  i.prototype.toObject = function() {
    return u({ width: this.width, height: this.height, data: this.data });
  };

  // index.js
  function blobToURL(blob) {
    return URL.createObjectURL(blob);
  }
  function srcToObj(src) {
    if (typeof src === "object") {
      return src;
    } else {
      return {
        isLoaded: false,
        isRendered: false,
        src
      };
    }
  }
  function objToSrc(obj) {
    if (typeof obj === "string") {
      return obj;
    } else {
      return obj.src;
    }
  }
  function loadImageToBlob(src) {
    return new Promise(function(resolve, reject) {
      fetch(src).then(function(response) {
        return response.blob();
      }).then(function(blob) {
        resolve(blob);
      }).catch(function(err) {
        reject(err);
      });
    });
  }
  function loadImageToElement(src) {
    return new Promise(function(resolve, reject) {
      const image = new Image();
      image.onload = function() {
        resolve(image);
      };
      image.onerror = function() {
        reject(new Error(`Image could not be loaded: ${src}`));
      };
      image.src = src;
    });
  }
  var ObjectView = class extends i {
    constructor(obj) {
      super(obj);
      const self = this;
      const overrideProperties = {
        x: 0,
        y: 0,
        enableHorizontalLoop: true,
        enableVerticalLoop: true
      };
      const origProperties = Object.keys(overrideProperties).reduce(
        (acc, cur) => {
          if (typeof self[cur] != "undefined") {
            acc[cur] = self[cur];
          }
          return acc;
        },
        {}
      );
      Object.assign(this, overrideProperties, origProperties);
      this.data = this.data.map(srcToObj);
    }
  };
  ObjectView.prototype.loadImage = async function(image) {
    if (!image.isLoaded) {
      image.blob = await loadImageToBlob(image.src);
      image.url = blobToURL(image.blob);
      image.isLoaded = true;
    }
    return this;
  };
  ObjectView.prototype.loadImages = async function(cb) {
    for (let i2 = 0; i2 < this.data.length; i2++) {
      if (this.data[i2]) {
        await this.loadImage(this.data[i2]);
      }
      if (typeof cb === "function") {
        cb(this.data[i2], i2, this.data);
      }
    }
    return this;
  };
  ObjectView.prototype.renderImage = async function(image) {
    if (image.isLoaded && !image.isRendered) {
      image.element = await loadImageToElement(image.url);
      if (image.element.decode) {
        try {
          await image.element.decode();
        } catch (err) {
          console.error(err);
        }
      }
      image.isRendered = true;
    }
    return this;
  };
  ObjectView.prototype.renderImages = async function(cb) {
    for (let i2 = 0; i2 < this.data.length; i2++) {
      if (this.data[i2]) {
        await this.renderImage(this.data[i2]);
      }
      if (typeof cb === "function") {
        cb(this.data[i2], i2, this.data);
      }
    }
    return this;
  };
  ObjectView.prototype.getImage = ObjectView.prototype.getValue;
  ObjectView.prototype.setImage = function(x, y, src) {
    return this.setValue(x, y, srcToObj(src));
  };
  ObjectView.prototype.getCurrentImage = function() {
    return this.getImage(this.x, this.y);
  };
  ObjectView.prototype.getCurrentIndex = function() {
    return this.getIndex(this.x, this.y);
  };
  ObjectView.prototype.move = function(x, y) {
    if (x) {
      if (!this.enableHorizontalLoop) {
        this.x = se(this.x + x, 0, this.width - 1);
      } else {
        this.x = ae(this.x + x, 0, this.width);
      }
    }
    if (y) {
      if (!this.enableVerticalLoop) {
        this.y = se(this.y + y, 0, this.height - 1);
      } else {
        this.y = ae(this.y + y, 0, this.height);
      }
    }
    return this;
  };
  ObjectView.prototype.export = function() {
    return Object.assign({}, this, {
      data: this.data.map(objToSrc)
    });
  };
  return __toCommonJS(index_exports);
})();
