import * as THREE from 'three';

export function leftPad(str, len, pad = '0') {
  str = str.toString();
  while (str.length < len) str = pad + str;
  return str;
}

export function smoothGeometry(geometry) {
  var tempGeometry = new THREE.Geometry().fromBufferGeometry(geometry);
  tempGeometry.mergeVertices();
  tempGeometry.computeVertexNormals();
  return new THREE.BufferGeometry().fromGeometry(tempGeometry);
}

export function URLToArray(url) {
  var request = {};
  var arr = [];
  var pairs = url.substring(url.indexOf('?') + 1).split('&');
  for (var i = 0; i < pairs.length; i++) {
    var pair = pairs[i].split('=');

    //check we have an array here - add array numeric indexes so the key elem[] is not identical.
    if (endsWith(decodeURIComponent(pair[0]), '[]')) {
      var arrName = decodeURIComponent(pair[0]).substring(0, decodeURIComponent(pair[0]).length - 2);
      if (!(arrName in arr)) {
        arr.push(arrName);
        arr[arrName] = [];
      }

      arr[arrName].push(decodeURIComponent(pair[1]));
      request[arrName] = checkBoolean(arr[arrName]);
    } else {
      request[decodeURIComponent(pair[0])] = checkBoolean(decodeURIComponent(pair[1]));
    }
  }
  return request;
}
function checkBoolean(value) {
  if (value == 'true' || value == 'false') {
    if (value == 'true') {
      return true;
    } else {
      return false;
    }
  } else {
    return value;
  }
}
function endsWith(str, suffix) {
  return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

export function centerObject(object, exclude = []) {
  var newObject = object.clone();

  if (exclude) {
    for (let i = 0; i < newObject.children.length; i++) {
      for (let j = 0; j < exclude.length; j++) {
        if (exclude[j] == newObject.children[i].name) {
          newObject.remove(newObject.children[i]);
        }
      }
    }
  }

  const box = new THREE.Box3().setFromObject(newObject);
  const size = new THREE.Vector3();
  box.getSize(size);

  const xOffset = -size.x / 2;
  const yOffset = -size.y / 2;
  const zOffset = -size.z / 2;

  return [xOffset, yOffset, zOffset];
}

export function floatLimit(value, min = 0, max = 1) {
  if (value > max) {
    return max;
  } else if (value < min) {
    return min;
  } else {
    return value
  }
}

export function getAverageColor(img, options = {}) {
  options = {
    // image split into blocks of x pixels wide, 1 high
    blocksize: options.blocksize || 5,
    fallbackColor: options.fallbackColor || '#000',
    lighten: parseInt(options.lighten, 10) || 0
  };

  var canvas = document.createElement('canvas'),
    context = canvas.getContext && canvas.getContext('2d'),
    i = -4,
    count = 0,
    rgb = {
      r: 0,
      g: 0,
      b: 0
    },
    data, width, height, length;

  height = canvas.height = img.naturalHeight || img.offsetHeight || img.height;
  width = canvas.width = img.naturalWidth || img.offsetWidth || img.width;

  // draw image in canvas to make calculation easier
  context.drawImage(img, 0, 0);

  data = context.getImageData(0, 0, width, height);

  length = data.data.length;

  // get rgb values for each pixel at the end of the block
  while ((i += options.blocksize * 4) < length) {
    ++count;
    rgb.r += data.data[i];
    rgb.g += data.data[i + 1];
    rgb.b += data.data[i + 2];
  }

  // ~~used to floor values
  rgb.r = ~~(rgb.r / count) + options.lighten;
  rgb.g = ~~(rgb.g / count) + options.lighten;
  rgb.b = ~~(rgb.b / count) + options.lighten;

  return `#${leftPad(rgb.r.toString(16), 2)}${leftPad(rgb.g.toString(16), 2)}${leftPad(rgb.b.toString(16), 2)}`;
}