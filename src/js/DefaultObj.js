import React, { useRef, useState } from 'react';
import { useFrame } from 'react-three-fiber';

export default function DefaultObj(props) {
  // This reference will give us direct access to the mesh
  const mesh = useRef()

  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)

  // Rotate mesh every frame, this is outside of React without overhead
  useFrame(() => (mesh.current.rotation.x = mesh.current.rotation.y += 0.01))

  return (
    <group>
      <mesh
        scale={[100, 100, 100]}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -10, 0]}
        receiveShadow
      >
        <planeGeometry attach="geometry" args={[1, 1, 1]} />
        <meshStandardMaterial attach="material" color={0xFFFFFF} />
      </mesh>
      <mesh
        {...props}
        ref={mesh}
        scale={active ? [1.5, 1.5, 1.5] : [1, 1, 1]}
        onClick={(e) => setActive(!active)}
        onPointerOver={(e) => setHover(true)}
        onPointerOut={(e) => setHover(false)}
        castShadow>
        <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
        <meshStandardMaterial attach="material" color={hovered ? 0x5B3A29 : 'orange'} />
      </mesh>
    </group>
  )
}