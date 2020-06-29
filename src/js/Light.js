import React from 'react';
import { useResource } from 'react-three-fiber';

const Light = (props) => {
  const shadowMapSize = (process.env.NODE_ENV === 'production') ? 1024 * 8 : 1024;

  const [ref, light] = useResource()
  const [ref2, light2] = useResource()

  return (
    <group>
      <hemisphereLight
        skyColor={0xffffff}
        groundColor={0xffffff}
        intensity={0.3}
      />
      <spotLight
        ref={ref}
        color={0xffffff}
        intensity={0.3}
        position={[-100, 200, 500]}
        castShadow
        shadow-mapSize-width={shadowMapSize}
        shadow-mapSize-height={shadowMapSize}
        shadow-camera-far={1000}
        shadow-camera-near={0.1}
      />
      <spotLight
        ref={ref2}
        color={0xffffff}
        intensity={0.2}
        position={[100, -100, 500]}
      />
      {light && props.helpers && <spotLightHelper args={[light, 0xCCCCCC]} />}
      {light2 && props.helpers && <spotLightHelper args={[light2, 0xCCCCCC]} />}
    </group>
  )
}

export default Light;