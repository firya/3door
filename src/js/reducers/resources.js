const resources = (state = {
  figure: SVGResource(),
  panelMaterial: MaterialResource(),
  trimMaterial: MaterialResource(),
  mirrorMaterial: MaterialResource(),
  moldingMaterial: MaterialResource(),
  hingeMaterial: MaterialResource(),
  furnitureMaterial: MaterialResource(),
  peephole: ObjectResource(),
  handle: ObjectResource(),
  lockTop: ObjectResource(),
  lockBottom: ObjectResource(),
  barashek: ObjectResource(),
  inProgressCount: null
}, action) => {
  switch (action.type) {
    case "LOAD_SOMETHING_FULFILLED":
      const { names, result } = action.payload;
      var newState = {
        ...state,
        inProgressCount: state.inProgressCount - 1
      };
      names.map((name, i) => {
        var newValue = {
          ...newState[name]
        };

        Object.keys(result).map((key, j) => {
          newValue[key] = result[key];
        });

        newState[name] = newValue;
      });

      return newState;
    case "LOAD_SOMETHING_PENDING":
      return {
        ...state,
        inProgressCount: state.inProgressCount + 1
      };
    case "LOAD_SOMETHING_REJECTED":
      return {
        ...state,
        inProgressCount: state.inProgressCount - 1
      };
    default:
      return state;
  }
};

const MaterialResource = () => {
  return {
    type: null,
    texture: null,
    bump: null,
    material: null
  };
};

const SVGResource = () => {
  return {
    id: null,
    resource: null
  };
};

const ObjectResource = () => {
  return {
    resource: null
  };
};



export default resources;