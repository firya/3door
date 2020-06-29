import React, { useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { smoothGeometry } from './utils.js';
import allActions from './actions';

const Hinge = (props) => {
  const hinge = useRef();
  const dispatch = useDispatch();

  const params = useSelector(state => state.door);
  const resources = useSelector(state => state.resources);
  const lists = useSelector(state => state.lists);

  const hindePosition = [0, 0, params.sizes.box.thickness[0] + params.sizes.box.thickness[1] + params.sizes.hinge.radius / 2];
  if (params.trim && lists.woodMaterials.indexOf(resources.trimMaterial.type) == -1) {
    hindePosition[2] += params.sizes.panel.thickness;
  }

  const loadTexture = () => {
    if (lists.hingeAsPanel.indexOf(resources.panelMaterial.type) != -1 && params.trim) {
      dispatch(allActions.resourcesActions.loadMaterial(['hingeMaterial'], { type: resources.panelMaterial.type, texture: resources.panelMaterial.texture, repeat: [1 / 10, 1 / 10] }));
    } else {
      dispatch(allActions.resourcesActions.loadMaterial(['hingeMaterial'], { type: lists.hingeDefault.type, texture: lists.hingeDefault.texture, repeat: [1 / 10, 1 / 10] }));
    }
  }

  useEffect(() => {
    dispatch(allActions.resourcesActions.loadModel('hinge', 'hinge'));
    loadTexture();
  }, []);

  useEffect(() => {
    loadTexture();
  }, [resources.panelMaterial.type, resources.panelMaterial.texture, params.trim]);

  const createHinge = () => {
    var materials = [resources.hingeMaterial.material, resources.furnitureMaterial.material];

    var hinges = [];
    var positionX = params.sizes.panel.width + params.sizes.hinge.radius + params.sizes.trim.width + params.sizes.gap * 2;
    for (let i = 0; i < params.sizes.hinge.top.length; i++) {
      hinges.push({
        position: [
          positionX,
          params.sizes.panel.height - params.sizes.hinge.top[i] + params.sizes.box.ledge - params.sizes.hinge.height / 2 - 1,
          0
        ]
      });
    }
    for (let i = 0; i < params.sizes.hinge.bottom.length; i++) {
      hinges.push({
        position: [
          positionX,
          params.sizes.hinge.bottom[i] + params.sizes.box.ledge + params.sizes.hinge.height / 2 - 1,
          0
        ]
      });
    }

    if (!params.staticFold && params.size != 1) {
      positionX = params.sizes.trim.width - params.sizes.hinge.radius;
      var newHinges = [];
      for (let i = 0; i < hinges.length; i++) {
        var newHinge = { position: [positionX, hinges[i].position[1], hinges[i].position[2]] };
        newHinges.push(newHinge);
      }

      hinges = hinges.concat(newHinges);
    }

    return hinges.map((hinge, i) => {
      return resources.hinge.resource.scene.children.map((child, j) => {
        return (
          <mesh
            geometry={smoothGeometry(child.geometry)}
            position={hinge.position}
            castShadow
            key={`hinge_${i}_${j}`}
          >
            {materials[j]}
          </mesh>
        )
      });
    });
  }

  return (
    <group
      ref={hinge}
      position={hindePosition}
    >
      {resources.inProgressCount == 0 && params.side == 'outside' && createHinge()}
    </group>
  );
}

export default Hinge;