import React, { useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { smoothGeometry } from './utils.js';
import allActions from './actions';

const Handle = (props) => {
  const handle = useRef();
  const dispatch = useDispatch();

  const params = useSelector(state => state.door);
  const resources = useSelector(state => state.resources);
  const lists = useSelector(state => state.lists);

  const offsetX = lists.defaultSizes[params.size] - lists.defaultSizes[1];
  const handlePosition = [
    (params.side == 'outside') ? params.sizes.trim.width + params.sizes.gap + params.sizes.handle.side + offsetX : params.sizes.trim.width + params.sizes.handle.side + offsetX,
    params.sizes.handle.bottom + params.sizes.box.ledge,
    (params.side == 'outside') ? params.sizes.box.thickness[0] + params.sizes.box.thickness[1] + params.sizes.panel.thickness : params.sizes.box.thickness[0]
  ];

  useEffect(() => {
    dispatch(allActions.resourcesActions.loadModel('handle', 'handle2'));
    dispatch(allActions.resourcesActions.loadModel('barashek', 'barashek'));
    dispatch(allActions.resourcesActions.loadModel('lockTop', 'lock2'));
    dispatch(allActions.resourcesActions.loadModel('lockBottom', 'lock1'));
    dispatch(allActions.resourcesActions.loadMaterial(['furnitureMaterial'], { type: 'metal', texture: params.furnitureMaterial }));
  }, []);

  const createHandle = () => {
    const modelList = {
      'handle': {
        position: [0, 0, 0],
        rotation: [-Math.PI / 2, 0, 0],
        scale: [0.12, 0.12, -0.12],
        offset: 0
      },
      'lockTop': {
        position: [-4, 14.5, -3.95],
        rotation: [Math.PI / 2, 0, 0],
        scale: [0.09, 0.09, -0.09],
        offset: 29
      },
      'lockBottom': {
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [0.11, 0.11, 0.11],
        offset: -9.5
      }
    };

    if (params.side != 'outside') {
      modelList.barashek = {
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [0.1, 0.1, -0.1],
        offset: 16
      };
    }

    return Object.keys(modelList).map((model, i) => {
      return (
        <group position={[0, modelList[model].offset, 0]} key={`furniture_group_${i}`}>
          {
            resources[model].resource.scene.children.map((child, j) => {
              return (
                <mesh
                  geometry={child.geometry}
                  position={modelList[model].position}
                  rotation={modelList[model].rotation}
                  scale={modelList[model].scale}
                  castShadow
                  key={`furniture_${i}_${j}`}
                >
                  {resources.furnitureMaterial.material}
                </mesh>
              )
            })
          }
        </group>
      );
    });
  }

  return (
    <group
      ref={handle}
      position={handlePosition}
    >
      {resources.inProgressCount == 0 && createHandle()}
    </group>
  );
}

export default Handle;