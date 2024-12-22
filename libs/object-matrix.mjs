// libs/utils.min.mjs
function a(e) {
  return typeof e == "object" && e !== null;
}
function s(e) {
  return Array && Array.isArray ? Array.isArray(e) : Object.prototype.toString.call(e) === "[object Array]";
}
function O(e) {
  return typeof e == "function";
}
function S(e) {
  let t;
  s(e) ? t = [] : t = {};
  for (let [n, r] of Object.entries(e)) a(r) ? t[n] = S(r) : t[n] = r;
  return t;
}
function ae(e, t, n) {
  return e -= t, n -= t, e < 0 && (e = e % n + n), e >= n && (e = e % n), e + t;
}
function Ae(e, t) {
  let n = new Array(e);
  if (O(t)) for (let r = 0; r < e; r++) n[r] = t(r);
  else if (a(t)) for (let r = 0; r < e; r++) n[r] = S(t);
  else if (s(t)) for (let r = 0; r < e; r++) n[r] = S(t);
  else if (typeof t < "u") for (let r = 0; r < e; r++) n[r] = t;
  return n;
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
  this.data = Ae(this.width * this.height, null);
  return this;
};
ObjectMatrix.prototype.getIndex = function(x, y) {
  x = ae(x, 0, this.width);
  y = ae(y, 0, this.height);
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
  return S({
    width: this.width,
    height: this.height,
    data: this.data
  });
};
export {
  ObjectMatrix
};
