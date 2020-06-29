import React, { useRef, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import allActions from './actions';
import Peephole from './Peephole.js';

const Panel = (props) => {
  const panel = useRef();

  const dispatch = useDispatch();

  const params = useSelector(state => state.door);
  const resources = useSelector(state => state.resources);
  const lists = useSelector(state => state.lists);

  const panelPosition = [
    (params.side == 'outside') ? params.sizes.trim.width + params.sizes.gap : params.sizes.trim.width,
    params.sizes.panel.height + params.sizes.box.ledge,
    (params.side == 'outside') ? params.sizes.box.thickness[0] + params.sizes.box.thickness[1] : params.sizes.box.thickness[0] - params.sizes.panel.thickness
  ];

  useEffect(() => {
    const defaultTextureType = resources.panelMaterial.type ? resources.panelMaterial.type : lists.material;
    const defaultTextureNumber = resources.panelMaterial.texture ? resources.panelMaterial.texture : lists.texture;
    const defaultBump = resources.panelMaterial.bump ? resources.panelMaterial.bump : lists.bump;

    dispatch(allActions.resourcesActions.loadSVG(params.size, lists.figure));
    dispatch(allActions.resourcesActions.loadMaterial(['panelMaterial'], { size: params.size, type: defaultTextureType, texture: defaultTextureNumber, bump: defaultBump }));
    dispatch(allActions.resourcesActions.loadMaterial(['mirrorMaterial'], { type: 'mirror' }));
    dispatch(allActions.resourcesActions.loadMaterial(['moldingMaterial'], { type: 'metal', materialType: 2 }));
    if (params.peephole) {
      dispatch(allActions.resourcesActions.loadModel('peephole', 'peephole'));
      // dispatch(allActions.resourcesActions.loadMaterial(['glassMaterial'], { type: 'glass' }));
    }
  }, []);

  const createGeometry = () => {
    const { thickness, width, height } = params.sizes.panel;

    return resources.figure.resource.paths.map((path, i) => {
      const shapes = path.toShapes(true);
      var shape = shapes[0];

      switch (path.userData.node.id) {
        case 'base':
          return <ExtrudeGeometry
            shape={shape}
            options={{ depth: thickness / 2, bevelEnabled: false }}
            material={resources.panelMaterial.material}
            key={`panel_geometry_${i}`} />

        case 'main':
          return <ExtrudeGeometry
            shape={shape}
            options={{
              depth: thickness - 0.3,
              bevelEnabled: true,
              bevelSize: 0.3,
              bevelOffset: -0.3,
              bevelSegments: 3,
              bevelThickness: 0.3
            }}
            material={resources.panelMaterial.material}
            key={`panel_geometry_${i}`} />

        case 'panel':
          return <ExtrudeGeometry
            shape={shape}
            options={{
              depth: thickness - 0.3,
              bevelEnabled: true,
              bevelSize: 0.3,
              bevelOffset: -0.3,
              bevelSegments: 3,
              bevelThickness: 0.3
            }}
            material={resources.panelMaterial.material}
            key={`panel_geometry_${i}`} />

        case 'mirror':
          return <ExtrudeGeometry
            shape={shape}
            options={{
              depth: thickness / 2,
              bevelEnabled: false
            }}
            material={resources.mirrorMaterial.material}
            key={`panel_geometry_${i}`} />

        case 'molding':
          return <ExtrudeGeometry
            shape={shape}
            options={{
              depth: thickness + 0.2,
              bevelEnabled: true,
              bevelSize: 0.3,
              bevelOffset: -0.3,
              bevelSegments: 2,
              bevelThickness: 0.3
            }}
            material={resources.moldingMaterial.material}
            key={`panel_geometry_${i}`} />

        case 'peephole':
          if (params.peephole) {
            return <Peephole key={`peephole`} position={[shape.curves[0].aX * width / resources.figure.resource.xml.width.baseVal.value, -shape.curves[0].aY * height / resources.figure.resource.xml.height.baseVal.value, thickness]} />
          }

        default:
          break;
      }

    });
  }

  return (
    <group
      ref={panel}
      position={panelPosition}
    >
      {resources.inProgressCount == 0 && createGeometry()}
    </group>
  );
}

const ExtrudeGeometry = (props) => {
  return (
    <mesh scale={[1, -1, 1]} position={props.position} receiveShadow>
      <extrudeGeometry attach="geometry" args={[props.shape, props.options]} />
      {props.material}
    </mesh>
  );
}

export default Panel;