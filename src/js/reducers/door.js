import { defaultList } from './lists.js';
import { URLToArray } from '../utils.js';

var params = URLToArray(window.location.search);

var trimForm = 'full';
if (('material' in params)) {
  if (defaultList.woodMaterials.indexOf(params.material) != -1) {
    trimForm = 'perpendicular';
  }
} else {
  if (defaultList.woodMaterials.indexOf(defaultList.material) != -1) {
    trimForm = 'perpendicular';
  }
};

var thickness = thickness = defaultList.notWoodThickness;
if (('material' in params)) {
  if (defaultList.woodMaterials.indexOf(params.material) != -1) {
    thickness = defaultList.woodThickness;
  }
} else {
  if (defaultList.woodMaterials.indexOf(defaultList.material) != -1) {
    thickness = defaultList.woodThickness;
  }
};

var furnitureMaterial = 2;
if ('furniture' in params) {
  if (params.furniture == 'gold') {
    furnitureMaterial = 1;
  }
}


const door = (state = {
  size: ('size' in params) ? params.size : 1,
  side: ('side' in params) ? params.side : 'outside',
  trim: ('trim' in params) ? params.trim : true,
  trimForm: trimForm, // full, perpendicular, triangle
  staticFold: ('staticFold' in params) ? params.staticFold : false,
  invert: ('invert' in params) ? params.invert : false,
  peephole: ('peephole' in params) ? params.peephole : true,
  furnitureMaterial: furnitureMaterial,
  sizes: {
    panel: {
      width: ('size' in params) ? defaultList.defaultSizes[params.size] : defaultList.defaultSizes[1],
      height: 200,
      thickness: thickness
    },
    hinge: {
      radius: 1,
      height: 10,
      top: [10, 30],
      bottom: [10]
    },
    box: {
      size: [[5, 5, 1, 5], [6, 6, 2, 6]], // clockwise from top
      thickness: [5, 1], // box and ledge thickness
      ledge: 1
    },
    handle: {
      bottom: 96,
      side: 7
    },
    trim: {
      width: 10,
      thickness: 1.6
    },
    gap: 0.3
  }
}, action) => {
  switch (action.type) {
    case 'CHANGE_ROOT':
      var newState = { ...state };
      newState[action.payload.key] = action.payload.value;
      return newState;
    case 'CHANGE_SIZES':
      var newState = { ...state };
      newState.sizes[action.payload.name][action.payload.key] = action.payload.value;
      return newState;
    default:
      return state;
  }
};

export default door;