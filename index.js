"use strict";

import {
  copyObject,
  createArray,
  getClampedNumber,
  getContainedNumber,
} from "./libs/utils.min.mjs";
import { ObjectMatrix } from "./libs/object-matrix.min.mjs";

function blobToURL(blob) {
  return URL.createObjectURL(blob);
}

function removeURL(url) {
  return URL.revokeObjectURL(url);
}

function srcToObj(src) {
  if (typeof src === "object") {
    return src;
  } else {
    return {
      isLoaded: false,
      isRendered: false,
      src: src,
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
  return new Promise(function (resolve, reject) {
    fetch(src)
      .then(function (response) {
        return response.blob();
      })
      .then(function (blob) {
        resolve(blob);
      })
      .catch(function (err) {
        reject(err);
      });
  });
}

function loadImageToElement(src) {
  return new Promise(function (resolve, reject) {
    const image = new Image();
    image.onload = function () {
      resolve(image);
    };
    image.onerror = function () {
      reject(new Error(`Image could not be loaded: ${src}`));
    };
    image.src = src;
  });
}

class ObjectView extends ObjectMatrix {
  constructor(obj) {
    super(obj);

    const self = this;

    const overrideProperties = {
      x: 0,
      y: 0,
      enableHorizontalLoop: true,
      enableVerticalLoop: true,
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
}

ObjectView.prototype.loadImage = async function (image) {
  if (!image.isLoaded) {
    image.blob = await loadImageToBlob(image.src);
    image.url = blobToURL(image.blob);
    image.isLoaded = true;
  }
  return this;
};

ObjectView.prototype.loadImages = async function (cb) {
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

ObjectView.prototype.renderImage = async function (image) {
  if (image.isLoaded && !image.isRendered) {
    image.element = await loadImageToElement(image.url);
    if (image.element.decode) {
      try {
        // Bug: The image is too large: Size > 3.? MB
        await image.element.decode();
      } catch (err) {
        console.error(err);
      }
    }
    image.isRendered = true;
  }
  return this;
};

ObjectView.prototype.renderImages = async function (cb) {
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

// const origGetIndex = ObjectView.prototype.getIndex;
// ObjectView.prototype.getIndex = function(x, y) {
//   if (!this.enableHorizontalLoop) {
//     x = getClampedNumber(x, 0, this.width - 1);
//   }
//   if (!this.enableVerticalLoop) {
//     y = getClampedNumber(y, 0, this.height - 1);
//   }
//   return origGetIndex.apply(this, [x, y]);
// }

ObjectView.prototype.getImage = ObjectView.prototype.getValue;

ObjectView.prototype.setImage = function (x, y, src) {
  return this.setValue(x, y, srcToObj(src));
};

ObjectView.prototype.getCurrentImage = function () {
  return this.getImage(this.x, this.y);
};

ObjectView.prototype.getCurrentIndex = function () {
  return this.getIndex(this.x, this.y);
};

ObjectView.prototype.move = function (x, y) {
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

ObjectView.prototype.export = function () {
  return Object.assign({}, this, {
    data: this.data.map(objToSrc),
  });
};

export { ObjectView };
