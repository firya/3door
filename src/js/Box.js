import React, { useRef, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as THREE from 'three';

import allActions from './actions';

const Box = (props) => {
  // This reference will give us direct access to the mesh
  const box = useRef();

  const dispatch = useDispatch();

  const params = useSelector(state => state.door);
  const resources = useSelector(state => state.resources);

  useEffect(() => {
    dispatch(allActions.resourcesActions.loadMaterial(['boxMaterial'], { type: 'paint', texture: 203 }));
  }, []);

  const createBox = (boxIndex = 0) => {
    var width, height;

    if (boxIndex == 0) {
      width = params.sizes.panel.width + params.sizes.box.size[boxIndex][1] + params.sizes.box.size[boxIndex][3];
      height = params.sizes.panel.height + params.sizes.box.size[boxIndex][0] + params.sizes.box.size[boxIndex][2];
    } else {
      width = params.sizes.panel.width + params.sizes.box.size[boxIndex][1] + params.sizes.box.size[boxIndex][3] - params.sizes.box.ledge * 2;
      height = params.sizes.panel.height + params.sizes.box.size[boxIndex][0] + params.sizes.box.size[boxIndex][2] - params.sizes.box.ledge * 2;
    }

    if (params.side == 'outside') {
      width -= 1;
      height -= 1;
    }

    const thickness = params.sizes.box.thickness[boxIndex];
    var positionZ = 0;
    if (params.side == 'outside' && boxIndex == 0) {
      positionZ = params.sizes.box.thickness[1];
    } else if (params.side != 'outside' && boxIndex == 1) {
      positionZ = params.sizes.box.thickness[0];
    }
    const position = [
      (params.side == 'outside') ? (params.sizes.panel.width + (params.sizes.trim.width + params.sizes.gap) * 2) / 2 - width / 2 : (params.sizes.panel.width + params.sizes.trim.width * 2) / 2 - width / 2,
      0,
      positionZ
    ];
    const size = params.sizes.box.size[boxIndex];

    var shape = new THREE.Shape();

    shape.moveTo(0, 0);
    shape.lineTo(0, height);
    shape.lineTo(width, height);
    shape.lineTo(width, 0);
    shape.lineTo(0, 0);

    var hole = new THREE.Shape();
    hole.moveTo(size[3], size[2]);
    hole.lineTo(width - size[1], size[2]);
    hole.lineTo(width - size[1], height - size[0]);
    hole.lineTo(size[3], height - size[0]);
    hole.lineTo(size[3], size[2]);

    shape.holes.push(hole);

    return <ExtrudeGeometry
      position={position}
      shape={shape}
      options={{
        depth: thickness - 0.5,
        bevelEnabled: true,
        bevelSize: 0.3,
        bevelOffset: -0.3,
        bevelSegments: 3,
        bevelThickness: 0.5
      }}
      material={resources.boxMaterial.material} />;
  }

  return (
    <group
      ref={box}
    >
      {resources.inProgressCount == 0 && createBox()}
      {resources.inProgressCount == 0 && createBox(1)}
    </group>
  );
}

const ExtrudeGeometry = (props) => {
  return (
    <mesh position={props.position}>
      <extrudeGeometry attach="geometry" args={[props.shape, props.options]} />
      {props.material}
    </mesh>
  );
}

export default Box;