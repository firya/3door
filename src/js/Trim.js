import React, { useRef, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as THREE from 'three';

import allActions from './actions';

const Trim = (props) => {
  // This reference will give us direct access to the mesh
  const trim = useRef();

  const dispatch = useDispatch();

  const params = useSelector(state => state.door);
  const resources = useSelector(state => state.resources);
  const lists = useSelector(state => state.lists);

  useEffect(() => {
    var materialOptions = {
      type: resources.panelMaterial.type ? resources.panelMaterial.type : lists.material,
      texture: resources.panelMaterial.texture ? resources.panelMaterial.texture : lists.texture
    };

    const differentMaterial = Object.keys(lists.trimNotAsPanel).indexOf(materialOptions.type);
    if (differentMaterial != -1) {
      materialOptions = {
        type: lists.trimNotAsPanel[Object.keys(lists.trimNotAsPanel)[differentMaterial]].type,
        texture: lists.trimNotAsPanel[Object.keys(lists.trimNotAsPanel)[differentMaterial]].texture
      };
    }

    dispatch(allActions.resourcesActions.loadMaterial(['trimMaterial'], materialOptions));

    var trimForm = lists.trimForm[lists.notWoodTrimForm];
    if (lists.woodMaterials.indexOf(materialOptions.type) != -1) {
      trimForm = lists.trimForm[lists.woodTrimForm];
    }
    dispatch(allActions.doorActions.changeRootProps(['trimForm'], trimForm));
  }, [resources.panelMaterial]);

  useEffect(() => {
    dispatch(allActions.doorActions.changeSizesProps('trim', 'thickness', params.sizes.panel.thickness));
  }, [params.sizes.panel.thickness])

  const createTrim = () => {
    if (params.trimForm == 'full') {
      return createArc();
    } else {
      return (
        <group>
          {createPlank('left')}
          {createPlank('right')}
          {createPlank('top')}
        </group>
      );
    }
  }

  const createPlank = (side) => {
    var width, height, position, cut;

    switch (side) {
      case 'left':
        width = params.sizes.trim.width;
        height = (params.side == 'outside') ? params.sizes.panel.height + params.sizes.box.ledge : params.sizes.panel.height - params.sizes.gap;
        position = [
          (params.side == 'outside') ? 0 : params.sizes.box.ledge,
          0,
          0
        ];
        cut = (params.side == 'outside' && lists.woodMaterials.indexOf(resources.trimMaterial.type) != -1 && params.size != 1 && !params.staticFold);
        break;
      case 'right':
        width = params.sizes.trim.width;
        height = (params.side == 'outside') ? params.sizes.panel.height + params.sizes.box.ledge : params.sizes.panel.height - params.sizes.gap;
        position = [
          (params.side == 'outside') ? params.sizes.panel.width + params.sizes.trim.width + params.sizes.gap * 2 : params.sizes.panel.width + params.sizes.trim.width - params.sizes.box.ledge,
          0,
          0
        ];
        cut = (params.side == 'outside' && lists.woodMaterials.indexOf(resources.trimMaterial.type) != -1);
        break;
      case 'top':
        width = (params.side == 'outside') ? params.sizes.panel.width + (params.sizes.trim.width + params.sizes.gap) * 2 : params.sizes.panel.width + (params.sizes.trim.width - params.sizes.box.ledge) * 2;
        height = params.sizes.trim.width;
        position = [
          (params.side == 'outside') ? 0 : params.sizes.box.ledge,
          (params.side == 'outside') ? params.sizes.panel.height + params.sizes.gap + params.sizes.box.ledge : params.sizes.panel.height,
          0
        ];
        break;
    }

    var shape = new THREE.Shape();

    if (params.trimForm == 'triangle' && side == 'top') {
      shape.moveTo(position[0] + height, position[1]);
      shape.lineTo(position[0] + width - height, position[1]);
    } else {
      shape.moveTo(position[0], position[1]);
      shape.lineTo(position[0] + width, position[1]);
    }

    if (cut && side == 'left') {
      for (let i = 0; i < params.sizes.hinge.bottom.length; i++) {
        shape = addCut(shape, [position[0] + width, params.sizes.hinge.bottom[i] - 1], -1, [params.sizes.hinge.radius * 2, params.sizes.hinge.height + 2]);
      }
      for (let i = params.sizes.hinge.top.length - 1; i >= 0; i--) {
        shape = addCut(shape, [position[0] + width, height - (params.sizes.hinge.top[i] + params.sizes.hinge.height + 2)], -1, [params.sizes.hinge.radius * 2, params.sizes.hinge.height + 2]);
      }
    }

    if (params.trimForm == 'triangle' && side == 'right') {
      shape.lineTo(position[0] + width, position[1] + height + width);
    } else {
      shape.lineTo(position[0] + width, position[1] + height);
    }

    if (params.trimForm == 'triangle' && side == 'left') {
      shape.lineTo(position[0], position[1] + height + width);
    } else {
      shape.lineTo(position[0], position[1] + height);
    }

    if (cut && side == 'right') {
      for (let i = 0; i < params.sizes.hinge.top.length; i++) {
        shape = addCut(shape, [position[0], height - params.sizes.hinge.top[i]], 1, [params.sizes.hinge.radius * 2, params.sizes.hinge.height + 2]);
      }
      for (let i = params.sizes.hinge.bottom.length - 1; i >= 0; i--) {
        shape = addCut(shape, [position[0], params.sizes.hinge.bottom[i] + params.sizes.hinge.height + 1], 1, [params.sizes.hinge.radius * 2, params.sizes.hinge.height + 2]);
      }
    }

    if (params.trimForm == 'triangle' && side == 'top') {
      shape.lineTo(position[0] + height, position[1]);
    } else {
      shape.lineTo(position[0], position[1]);
    }

    return <ExtrudeGeometry
      shape={shape}
      options={{
        depth: params.sizes.trim.thickness - 0.3,
        bevelEnabled: true,
        bevelSize: 0.3,
        bevelOffset: -0.3,
        bevelSegments: 5,
        bevelThickness: 0.3
      }}
      material={resources.trimMaterial.material} />;
  }

  const createArc = () => {
    const cut = (params.side == 'outside' && lists.woodMaterials.indexOf(resources.trimMaterial.type) != -1);
    const offset = (params.side == 'outside') ? 0 : params.sizes.box.ledge;
    const width = (params.side == 'outside') ? params.sizes.panel.width + (params.sizes.trim.width + params.sizes.gap) * 2 : params.sizes.panel.width - params.sizes.box.ledge * 2 + params.sizes.trim.width * 2;
    const height = (params.side == 'outside') ? params.sizes.panel.height + params.sizes.gap + params.sizes.trim.width + params.sizes.box.ledge : params.sizes.panel.height + params.sizes.trim.width;

    var shape = new THREE.Shape();

    shape.moveTo(offset, 0);
    shape.lineTo(offset + params.sizes.trim.width, 0);

    if (cut && !params.staticFold && params.size != 1) {
      for (let i = params.sizes.hinge.bottom.length - 1; i >= 0; i--) {
        shape = addCut(
          shape,
          [
            offset + params.sizes.trim.width,
            params.sizes.hinge.bottom[i] - params.sizes.box.ledge
          ],
          -1,
          [
            params.sizes.hinge.radius * 2,
            params.sizes.hinge.height + 2
          ]
        );
      }
      for (let i = params.sizes.hinge.top.length - 1; i >= 0; i--) {
        shape = addCut(
          shape,
          [
            offset + params.sizes.trim.width,
            height - params.sizes.trim.width - params.sizes.hinge.top[i] - params.sizes.hinge.height - 2
          ],
          -1,
          [
            params.sizes.hinge.radius * 2,
            params.sizes.hinge.height + 2
          ]
        );
      }
    }

    shape.lineTo(offset + params.sizes.trim.width, height - params.sizes.trim.width);
    shape.lineTo(offset + width - params.sizes.trim.width, height - params.sizes.trim.width);

    if (cut) {
      for (let i = 0; i < params.sizes.hinge.top.length; i++) {
        shape = addCut(
          shape,
          [
            offset + width - params.sizes.trim.width,
            height - params.sizes.trim.width - params.sizes.hinge.top[i]
          ],
          1,
          [
            params.sizes.hinge.radius * 2,
            params.sizes.hinge.height + 2
          ]
        );
      }
      for (let i = params.sizes.hinge.bottom.length - 1; i >= 0; i--) {
        shape = addCut(
          shape,
          [
            offset + width - params.sizes.trim.width,
            params.sizes.hinge.bottom[i] + params.sizes.hinge.height + params.sizes.box.ledge
          ],
          1,
          [
            params.sizes.hinge.radius * 2,
            params.sizes.hinge.height + 2
          ]
        );
      }
    }

    shape.lineTo(offset + width - params.sizes.trim.width, 0);
    shape.lineTo(offset + width, 0);
    shape.lineTo(offset + width, height);
    shape.lineTo(offset, height);
    shape.lineTo(offset, 0);

    return <ExtrudeGeometry
      shape={shape}
      options={{
        depth: params.sizes.trim.thickness - 0.3,
        bevelEnabled: true,
        bevelSize: 0.3,
        bevelOffset: -0.3,
        bevelSegments: 5,
        bevelThickness: 0.3
      }}
      material={resources.trimMaterial.material} />;
  }
  const addCut = (shape, position, i = 1, size = [2, 12]) => {
    shape.lineTo(position[0], position[1]);
    shape.lineTo(position[0] + size[0] * i, position[1]);
    shape.lineTo(position[0] + size[0] * i, position[1] - size[1] * i);
    shape.lineTo(position[0], position[1] - size[1] * i);

    return shape;
  }

  return (
    <group
      ref={trim}
      position={[0, 0, params.sizes.box.thickness[0] + params.sizes.box.thickness[1]]}
    >
      {resources.inProgressCount == 0 && params.trim && createTrim()}
    </group>
  );
}

const ExtrudeGeometry = (props) => {
  return (
    <mesh scale={props.scale} position={props.position}>
      <extrudeGeometry attach="geometry" args={[props.shape, props.options]} />
      {props.material}
    </mesh>
  );
}

export default Trim;