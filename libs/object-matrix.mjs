// libs/utils.mjs
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

// index.js
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
  x = getContainedNumber(x, 0, this.width);
  y = getContainedNumber(y, 0, this.height);
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
export {
  ObjectMatrix
};
