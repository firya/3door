import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";

import Material from '../Materials.js';
import { RAL } from '../RAL.js';
import { leftPad } from '../utils.js';

const defaults = {
  figureFolder: '/figures',
  bumpFolder: '/bump',
  modelFolder: '/models',
  textureFolder: '/textures',
  mirrorEnv: 'textures/env.jpg',
  furnitureEnv: 'textures/env2.jpg',
  sizes: {
    1: {
      prefix: 0
    },
    1.5: {
      prefix: 1
    },
    2: {
      prefix: 2
    }
  }
}

const loadMaterial = (names, props) => {
  props.repeat = props.repeat || [1 / 80, 1 / 200];
  return {
    type: "LOAD_SOMETHING",
    payload: new Promise((resolve, reject) => {
      var texturePromiseList = [];

      if (props.texture && props.type != 'paint' && props.type != 'metal') { texturePromiseList.push({ type: 'map', promise: loadTexture(`${defaults.textureFolder}/${props.type}/${leftPad(props.texture, 3)}.jpg`) }); }
      if (props.bump) { texturePromiseList.push({ type: 'bump', promise: loadTexture(`${defaults.bumpFolder}/${defaults.sizes[props.size].prefix}${leftPad(props.bump, 3)}.jpg`) }); }
      if (props.type == 'mirror' || props.type == 'glass') { texturePromiseList.push({ type: 'env', promise: loadTexture(`${defaults.mirrorEnv}`) }); }
      if (props.type == 'molding' || props.type == 'metal') { texturePromiseList.push({ type: 'env', promise: loadTexture(`${defaults.furnitureEnv}`) }); }
      if (props.type == 'paint') {
        texturePromiseList.push({ type: 'bump', promise: loadTexture(`${defaults.textureFolder}/${props.type}/${leftPad(1, 3)}.jpg`) });
        props.materialType = props.texture;
      }
      if (props.type == 'metal') {
        props.materialType = props.texture;
      }

      Promise.allSettled(texturePromiseList.map((item, i) => item.promise)).then((result) => {
        var textures = {};
        result.map((res, i) => {
          if (res.status == 'fulfilled') {
            textures[texturePromiseList[i].type] = res.value;
          }
        });

        if (Object.keys(textures).length) {
          var resultObj = {
            material: new Material({ type: props.type, materialType: props.materialType, textures: textures, repeat: props.repeat }).generate()
          };
          if (props.type) { resultObj.type = props.type; }
          if (props.texture) { resultObj.texture = props.texture; }
          if (props.bump) { resultObj.bump = props.bump; }

          resolve({
            names: names,
            result: resultObj
          });
        } else {
          reject();
        }
      });
    })
  }
}

const loadTexture = (url) => {
  return new Promise((resolve, reject) => {
    new THREE.TextureLoader().load(url, function (data) {
      resolve(data);
    }, undefined, (err) => {
      reject(err);
    });
  });
}

const loadSVG = (size, id) => {
  return {
    type: "LOAD_SOMETHING",
    payload: new Promise((resolve, reject) => {
      const url = `${defaults.figureFolder}/${defaults.sizes[size].prefix}${leftPad(id, 3)}.svg`;
      new SVGLoader().load(url, function (data) {
        resolve({
          names: ['figure'],
          result: {
            id: id,
            resource: data
          }
        });
      }, undefined, (err) => {
        reject(err);
      });
    })
  }
}

const loadModel = (name, filleName) => {
  return {
    type: "LOAD_SOMETHING",
    payload: new Promise((resolve, reject) => {
      const url = `${defaults.modelFolder}/${filleName}.glb`;
      new GLTFLoader().load(url, function (data) {
        resolve({
          names: [name],
          result: {
            resource: data
          }
        });
      }, undefined, (err) => {
        reject(err);
      });
    })
  }
}

export default {
  loadMaterial,
  loadSVG,
  loadModel
}