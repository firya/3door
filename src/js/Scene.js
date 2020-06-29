import ReactDOM from 'react-dom';
import React, { useEffect, useRef } from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider, useSelector } from 'react-redux';
import promise from 'redux-promise-middleware';
import thunk from 'redux-thunk';
import * as THREE from 'three';

import { Canvas, extend, useThree } from 'react-three-fiber';
import { Controls } from 'react-three-gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import rootReducer from './reducers';

import Light from './Light.js';
import Door from './Door.js';
import ControlsGUI from './Controls.js';

extend({ OrbitControls });

const store = createStore(
  rootReducer, {}, applyMiddleware(
    thunk,
    promise
  )
);

const Scene = (props) => {
  const {
    camera,
    gl: { domElement }
  } = useThree();
  const door = useRef();
  const oControls = useRef();

  const params = useSelector(state => state.door);
  const resources = useSelector(state => state.resources);

  useEffect(() => {
    window.allResourcesLoaded = false;
    if (resources.inProgressCount === 0) {
      setTimeout(() => {
        console.log('All Resources loaded');
        window.allResourcesLoaded = true;
      }, 500);
    }
    if (resources.inProgressCount === 0) {
      cameraToFit();
      centerDoor();
    }
  }, [resources.inProgressCount]);

  useEffect(() => {
    centerDoor();
    cameraToFit();
  }, [params]);

  const cameraToFit = () => {
    const boundingBox = new THREE.Box3();

    boundingBox.setFromObject(door.current);
    const size = new THREE.Vector3();
    boundingBox.getSize(size);

    const maxDim = Math.max(size.x, size.y, size.z);
    window.viewportRatio = size.x / size.y;

    const fov = camera.fov * (Math.PI / 180);
    let cameraZ = Math.abs((maxDim / 2) / Math.tan(fov / 2));

    camera.position.z = cameraZ;
    oControls.current.update();
  }

  const centerDoor = () => {
    const boundingBox = new THREE.Box3();

    boundingBox.setFromObject(door.current);
    const size = new THREE.Vector3();
    boundingBox.getSize(size);
    door.current.position.y = -size.y / 2;
  }

  return (
    <>
      <orbitControls ref={oControls} args={[camera, domElement]} />
      <Light />
      <Door ref={door} />
      <ControlsGUI />
    </>
  )
}

ReactDOM.render(
  <>
    <Canvas
      shadowMap
      colorManagement={true}
      alpha="true"
      camera={{
        fov: 45,
        near: 0.1,
        far: 10000,
        position: [0, 0, 200]
      }}
      gl2={true}
      gl={{
        preserveDrawingBuffer: true
      }}
    >
      <Provider store={store}>
        <Scene />
      </Provider>
    </Canvas>
    <Controls />
  </>,
  document.getElementById('canvas_containner')
)