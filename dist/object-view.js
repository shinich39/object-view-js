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
  var object_view_js_exports = {};
  __export(object_view_js_exports, {
    ObjectView: () => ObjectView
  });

  // libs/utils.mjs
  function getClampedNumber(num, min, max) {
    return Math.min(max, Math.max(num, min));
  }
  function getContainedNumber(num, min, max) {
    num -= min;
    max -= min;
    if (num < 0) {
      num = num % max + max;
    }
    if (num >= max) {
      num = num % max;
    }
    return num + min;
  }

  // libs/object-matrix.mjs
  function isObject(obj) {
    return typeof obj === "object" && obj !== null;
  }
  function isArray(obj) {
    if (Array && Array.isArray) {
      return Array.isArray(obj);
    } else {
      return Object.prototype.toString.call(obj) === "[object Array]";
    }
  }
  function isFunction(obj) {
    return typeof obj === "function";
  }
  function getContainedNumber2(num, min, max) {
    num -= min;
    max -= min;
    if (num < 0) {
      num = num % max + max;
    }
    if (num >= max) {
      num = num % max;
    }
    return num + min;
  }
  function createArray(len, value) {
    let arr = new Array(len);
    if (isFunction(value)) {
      for (let i = 0; i < len; i++) {
        arr[i] = value(i);
      }
    } else if (isObject(value)) {
      for (let i = 0; i < len; i++) {
        arr[i] = copyObject(value);
      }
    } else if (isArray(value)) {
      for (let i = 0; i < len; i++) {
        arr[i] = copyObject(value);
      }
    } else if (typeof value !== "undefined") {
      for (let i = 0; i < len; i++) {
        arr[i] = value;
      }
    }
    return arr;
  }
  function copyObject(obj) {
    let result;
    if (isArray(obj)) {
      result = [];
    } else {
      result = {};
    }
    for (const [key, value] of Object.entries(obj)) {
      if (isObject(value)) {
        result[key] = copyObject(value);
      } else {
        result[key] = value;
      }
    }
    return result;
  }
  var ObjectMatrix = class {
    constructor(obj) {
      this.width = 0;
      this.height = 0;
      this.data = [];
      Object.assign(this, obj || {});
    }
  };
  ObjectMatrix.prototype.init = function() {
    this.data = createArray(this.width * this.height, null);
    return this;
  };
  ObjectMatrix.prototype.getIndex = function(x, y) {
    x = getContainedNumber2(x, 0, this.width);
    y = getContainedNumber2(y, 0, this.height);
    return y * this.width + x;
  };
  ObjectMatrix.prototype.getValue = function(x, y) {
    return this.data[this.getIndex(x, y)];
  };
  ObjectMatrix.prototype.setValue = function(x, y, value) {
    this.data[this.getIndex(x, y)] = value;
    return this;
  };
  ObjectMatrix.prototype.getRow = function(y) {
    const result = [];
    for (let i = 0; i < this.width; i++) {
      result.push(this.getValue(i, y));
    }
    return result;
  };
  ObjectMatrix.prototype.getColumn = function(x) {
    const result = [];
    for (let i = 0; i < this.height; i++) {
      result.push(this.getValue(x, i));
    }
    return result;
  };
  ObjectMatrix.prototype.toObject = function() {
    return copyObject({
      width: this.width,
      height: this.height,
      data: this.data
    });
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
  var ObjectView = class extends ObjectMatrix {
    constructor(obj) {
      super(obj);
      const self = this;
      const overrideProperties = {
        x: 0,
        y: 0,
        enableHorizontalLoop: true,
        enableVerticalLoop: true
      };
      const origProperties = Object.keys(overrideProperties).reduce((acc, cur) => {
        if (typeof self[cur] != "undefined") {
          acc[cur] = self[cur];
        }
        return acc;
      }, {});
      Object.assign(
        this,
        overrideProperties,
        origProperties
      );
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
    for (let i = 0; i < this.data.length; i++) {
      if (this.data[i]) {
        await this.loadImage(this.data[i]);
      }
      if (typeof cb === "function") {
        cb(this.data[i], i, this.data);
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
    for (let i = 0; i < this.data.length; i++) {
      if (this.data[i]) {
        await this.renderImage(this.data[i]);
      }
      if (typeof cb === "function") {
        cb(this.data[i], i, this.data);
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
        this.x = getClampedNumber(this.x + x, 0, this.width - 1);
      } else {
        this.x = getContainedNumber(this.x + x, 0, this.width);
      }
    }
    if (y) {
      if (!this.enableVerticalLoop) {
        this.y = getClampedNumber(this.y + y, 0, this.height - 1);
      } else {
        this.y = getContainedNumber(this.y + y, 0, this.height);
      }
    }
    return this;
  };
  ObjectView.prototype.export = function() {
    return Object.assign({}, this, {
      data: this.data.map(objToSrc)
    });
  };
  return __toCommonJS(object_view_js_exports);
})();
