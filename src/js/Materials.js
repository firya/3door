import React from 'react';
import * as THREE from 'three';

import { RAL } from './RAL.js';

export default class Material {
  constructor(props) {
    this.props = props ? props : {};

    const { textures, repeat } = this.props;
    this.props.materialType = this.props.materialType || 2;

    if (textures.map) {
      textures.map.wrapS = textures.map.wrapT = THREE.RepeatWrapping;
    }
    if (textures.bump) {
      textures.bump.wrapS = textures.bump.wrapT = THREE.RepeatWrapping;
    }

    if (repeat) {
      textures[Object.keys(textures)[0]].repeat.set(repeat[0], -repeat[1]);
    } else {
      textures[Object.keys(textures)[0]].map.repeat.set(1, -1);
    }
  }

  generate = () => {
    var functionName = `${this.props.type}Material`;
    return this[functionName]();
  }

  pvhMaterial = () => {
    const { textures } = this.props;

    return (
      <meshStandardMaterial
        attach="material"
        name='pvh'
        map={textures.map}
        bumpMap={textures.map}
        bumpScale={0.05}
        roughness={0.4}
        metalness={0.0} />
    );
  }

  shponMaterial = () => {
    const { textures } = this.props;

    return (
      <meshStandardMaterial
        attach="material"
        name='shpon'
        map={textures.map}
        bumpMap={textures.map}
        bumpScale={0.05}
        roughness={0.45}
        metalness={0.0} />
    );
  }

  vinilMaterial = () => {
    const { textures } = this.props;

    var bumpSize = 1;
    if (!textures.bump) {
      bumpSize = 0.05;
      textures.bump = textures.map;
    }

    return (
      <meshStandardMaterial
        attach="material"
        name='vinil'
        map={textures.map}
        bumpMap={textures.bump}
        bumpScale={bumpSize}
        roughness={0.4}
        metalness={0.0} />
    );
  }

  crocoMaterial = () => {
    const { textures } = this.props;

    return (
      <meshStandardMaterial
        attach="material"
        name='croco'
        map={textures.map}
        bumpMap={textures.map}
        side={THREE.DoubleSide}
        bumpScale={0.3}
        roughness={0.3}
        metalness={0.0} />
    );
  }

  powderMaterial = () => {
    const { textures } = this.props;

    return (
      <meshStandardMaterial
        attach="material"
        name='powder'
        map={textures.map}
        bumpMap={textures.map}
        side={THREE.DoubleSide}
        bumpScale={0.4}
        roughness={0.45}
        metalness={0.5} />
    );
  }

  paintMaterial = () => {
    const { textures, materialType } = this.props;

    var color = new THREE.Color(RAL[Object.keys(RAL)[materialType]]);
    color.convertGammaToLinear(2.2);

    return (
      <meshStandardMaterial
        attach="material"
        name='powder'
        color={color}
        side={THREE.DoubleSide}
        bumpMap={textures.bump}
        bumpScale={0.03}
        roughness={0.35}
        metalness={0.0} />
    );
  }

  mirrorMaterial = () => {
    const { textures } = this.props;

    textures.env.mapping = THREE.EquirectangularReflectionMapping;
    textures.env.encoding = THREE.sRGBEncoding;

    return (
      <meshLambertMaterial
        attach="material"
        name='mirror'
        side={THREE.DoubleSide}
        envMap={textures.env} />
    );
  }

  glassMaterial = () => {
    const { textures } = this.props;

    textures.env.mapping = THREE.EquirectangularReflectionMapping;
    textures.env.encoding = THREE.sRGBEncoding;

    return (
      <meshLambertMaterial
        attach="material"
        name='mirror'
        side={THREE.DoubleSide}
        envMap={textures.env}
        reflectivity={0.65}
        color={0x666666} />
    );
  }

  metalMaterial = () => {
    const { textures } = this.props;

    textures.env.mapping = THREE.EquirectangularReflectionMapping;
    textures.env.encoding = THREE.sRGBEncoding;

    var metalTypes = [
      {
        color: 0xBA5C1B, // bronze
        roughness: 0
      },
      {
        color: 0xF2D696, // gold
        roughness: 0
      },
      {
        color: 0xcccccc, // silver
        roughness: 0.5
      }
    ];

    return (
      <meshLambertMaterial
        attach="material"
        name='molding'
        side={THREE.DoubleSide}
        envMap={textures.env}
        color={metalTypes[this.props.materialType].color}
        roughness={metalTypes[this.props.materialType].roughness}
        metalness={1} />
    );
  }
}