import { RAL } from '../RAL.js';
import { URLToArray } from '../utils.js';

var params = URLToArray(window.location.search);
// figure: 203, material: 'pvh', texture: 72, bump: ''
export const defaultList = {
  material: ('material' in params) ? params.material : 'pvh',
  figure: ('figure' in params) ? params.figure : 1,
  texture: ('texture' in params) ? params.texture : 1,
  bump: ('bump' in params) ? params.bump : '',
  figures: {
    1: [1, 101, 201, 202, 203, 204, 205, 301, 302, 303, 304, 305, 306, 307, 401, 402, 403, 404, 501, 502, 503, 601, 602, 603, 604, 605, 701, 702, 801, 802, 803],
    1.5: [1, 2],
    2: [1],
  },
  bumps: ['', 1, 2, 3, 4, 5],
  materials: {
    pvh: new Array(73).fill(0).map((item, i) => i + 1),
    shpon: new Array(42).fill(0).map((item, i) => i + 1),
    vinil: new Array(21).fill(0).map((item, i) => i + 1),
    powder: new Array(7).fill(0).map((item, i) => i + 1),
    croco: new Array(6).fill(0).map((item, i) => i + 1),
    paint: new Array(Object.keys(RAL).length).fill(0).map((item, i) => i + 1)
  },
  sides: ['outside', 'iniside'],
  sizes: [1, 1.5, 2],
  trimForm: ['perpendicular', 'triangle', 'full'],
  woodMaterials: ['pvh', 'shpon'],
  woodTrimForm: 0,
  notWoodTrimForm: 2,
  woodThickness: 1.6,
  notWoodThickness: 0.3,
  trimNotAsPanel: {
    'vinil': {
      type: 'paint',
      texture: 203
    }
  },
  hingeAsPanel: ['paint', 'powder', 'croco'],
  hingeDefault: {
    type: 'paint',
    texture: 209
  },
  defaultSizes: {
    1: 80,
    1.5: 110,
    2: 160
  }
};

const lists = (state = defaultList, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

export default lists;