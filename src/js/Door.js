import React, { useRef, forwardRef, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import * as THREE from 'three';

import Panel from "./Panel.js";
import Box from "./Box.js";
import Trim from "./Trim.js";
import Handle from "./Handle.js";
import Hinge from "./Hinge.js";

const Door = (props, ref) => {
  const door = useRef();

  const params = useSelector(state => state.door);

  const doorPositionZ = (params.trim) ? -(params.sizes.box.thickness[0] + params.sizes.box.thickness[1] + params.sizes.trim.thickness) : -(params.sizes.box.thickness[0] + params.sizes.box.thickness[1]);
  var doorPositionX = (params.side == 'outside') ? -(params.sizes.panel.width + params.sizes.trim.width * 2 + params.sizes.gap * 2) / 2 : -(params.sizes.panel.width + params.sizes.trim.width * 2) / 2;

  return (
    <group
      ref={ref}
      scale={[params.invert ? -1 : 1, 1, 1]}
      position-z={doorPositionZ}
      position-x={params.invert ? -doorPositionX : doorPositionX}
    >
      <Box />
      <Panel />
      <Trim />
      <Handle />
      <Hinge />
    </group>
  )
}

export default forwardRef(Door);