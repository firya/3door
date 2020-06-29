import React, { useRef } from 'react';
import { useSelector } from 'react-redux';

import { smoothGeometry } from './utils.js';

const Peephole = (props) => {
  const peephole = useRef();
  const resources = useSelector(state => state.resources);

  return (
    <group
      ref={peephole}
      position={props.position}
      rotation={[Math.PI / 2, Math.PI / 2, 0]}
      scale={[0.5, 1, 0.5]}
    >
      {
        resources.peephole.resource.scene.children.map((child, i) => {
          return (
            <mesh
              geometry={smoothGeometry(child.geometry)}
              castShadow
              key={`peephole_${i}`}
            >
              {resources.furnitureMaterial.material}
            </mesh>
          )
        })
      }
    </group>
  );
}

export default Peephole;