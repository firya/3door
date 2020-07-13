import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useControl } from 'react-three-gui';
import { URLToArray } from './utils.js';

import allActions from './actions';

const DoubleSidedControls = () => {
  useControl('Static fold', {
    group: 'trim',
    type: 'boolean',
    onChange: (value) => {
      window.setParams({ staticFold: value });
    }
  });

  return (
    <></>
  )
}

const TrimControls = () => {
  const lists = useSelector(state => state.lists);

  useControl('Trim form', {
    group: 'trim',
    type: 'select',
    items: lists.trimForm,
    onChange: (value) => {
      window.setParams({ trimForm: value });
    }
  });

  return (
    <></>
  )
}

const PanelFigureControl1 = (props) => {
  const lists = useSelector(state => state.lists);

  useControl('Figure', {
    group: 'panel',
    type: 'select',
    items: lists.figures[1],
    onChange: (value) => {
      window.setParams({ figure: value });
    }
  });

  return <></>;
}

const PanelFigureControl15 = (props) => {
  const lists = useSelector(state => state.lists);

  useControl('Figure', {
    group: 'panel',
    type: 'select',
    items: lists.figures[1.5],
    onChange: (value) => {
      window.setParams({ figure: value });
    }
  });

  return <></>;
}

const PanelFigureControl2 = (props) => {
  const lists = useSelector(state => state.lists);

  useControl('Figure', {
    group: 'panel',
    type: 'select',
    items: lists.figures[2],
    onChange: (value) => {
      window.setParams({ figure: value });
    }
  });

  return <></>;
}

const PVHMaterialControl = (props) => {
  const lists = useSelector(state => state.lists);

  useControl(`Pvh texture`, {
    group: 'panel',
    type: 'select',
    items: lists.materials.pvh,
    onChange: (value) => {
      window.setParams({ texture: value });
    }
  });

  return <></>;
}

const ShponMaterialControl = (props) => {
  const lists = useSelector(state => state.lists);

  useControl(`Shpon texture`, {
    group: 'panel',
    type: 'select',
    items: lists.materials.shpon,
    onChange: (value) => {
      window.setParams({ texture: value });
    }
  });

  return <></>;
}

const PaintMaterialControl = (props) => {
  const lists = useSelector(state => state.lists);

  useControl(`Paint texture`, {
    group: 'panel',
    type: 'select',
    items: lists.materials.paint,
    onChange: (value) => {
      window.setParams({ texture: value });
    }
  });

  return <></>;
}

const PowderMaterialControl = (props) => {
  const lists = useSelector(state => state.lists);

  useControl(`Pwoder texture`, {
    group: 'panel',
    type: 'select',
    items: lists.materials.powder,
    onChange: (value) => {
      window.setParams({ texture: value });
    }
  });

  return <></>;
}

const CrocoMaterialControl = (props) => {
  const lists = useSelector(state => state.lists);

  useControl(`Croco texture`, {
    group: 'panel',
    type: 'select',
    items: lists.materials.croco,
    onChange: (value) => {
      window.setParams({ texture: value });
    }
  });

  return <></>;
}

const VinilMaterialControl = (props) => {
  const lists = useSelector(state => state.lists);

  useControl(`Vinil texture`, {
    group: 'panel',
    type: 'select',
    items: lists.materials.vinil,
    onChange: (value) => {
      window.setParams({ texture: value });
    }
  });

  useControl(`Panel bump`, {
    group: 'panel',
    type: 'select',
    items: lists.bumps,
    onChange: (value) => {
      window.setParams({ bump: value });
    }
  });

  return <></>;
}

const ControlsGUI = () => {
  const dispatch = useDispatch();

  const params = useSelector(state => state.door);
  const resources = useSelector(state => state.resources);
  const lists = useSelector(state => state.lists);

  var URLparams = URLToArray(window.location.search);

  // setParams({ size: 1, side: 'outside', invert: false, trim: true, figure: 203, material: 'pvh', texture: 72, bump: '' })
  const setParams = window.setParams = (props) => {
    Object.keys(props).map((key, i) => {
      props[key] = (props[key] == 'false') ? false : props[key];
    });

    return new Promise((resolve, reject) => {
      var size = params.size || 1;
      var type = props.material || resources.panelMaterial.type;
      var texture = props.texture || resources.panelMaterial.texture || 1;
      var bump = props.bump || resources.panelMaterial.bump || '';

      var promiseList = [];
      if (props.size && props.size != params.size) {
        promiseList.push(dispatch(allActions.doorActions.changeRootProps('size', props.size)));
        promiseList.push(dispatch(allActions.doorActions.changeSizesProps('panel', 'width', lists.defaultSizes[props.size])));
        promiseList.push(dispatch(allActions.resourcesActions.loadSVG(props.size, 1)));
        if (!('material' in props) && !('texture' in props) && !('bump' in props)) {
          promiseList.push(dispatch(allActions.resourcesActions.loadMaterial(['panelMaterial'], { size: props.size, type: resources.panelMaterial.type || 'pvh', texture: resources.panelMaterial.texture || 1 })));
        }
      }
      if (props.side && props.side != params.side) {
        promiseList.push(dispatch(allActions.doorActions.changeRootProps('side', props.side)));
      }
      if ('invert' in props && props.invert != params.invert) {
        promiseList.push(dispatch(allActions.doorActions.changeRootProps('invert', props.invert)));
      }
      if ('staticFold' in props && props.staticFold != params.staticFold) {
        promiseList.push(dispatch(allActions.doorActions.changeRootProps('staticFold', props.staticFold)));
      }
      if ('trimForm' in props && props.trimForm != params.trimForm) {
        promiseList.push(dispatch(allActions.doorActions.changeRootProps('trimForm', props.trimForm)));
      }
      if ('trim' in props && props.trim != params.trim) {
        promiseList.push(dispatch(allActions.doorActions.changeRootProps('trim', props.trim)));
      }
      if ('figure' in props && props.figure != params.figure) {
        promiseList.push(dispatch(allActions.resourcesActions.loadSVG(props.size || params.size, props.figure)));
      }
      if ('material' in props || 'texture' in props || 'bump' in props) {

        texture = ('material' in props && !('texture' in props)) ? 1 : texture;
        bump = ('bump' in props) ? bump : '';

        promiseList.push(dispatch(allActions.resourcesActions.loadMaterial(['panelMaterial'], { size: size, type: type, texture: texture, bump: bump })));

        if ('material' in props) {
          if (lists.woodMaterials.indexOf(props.material) != -1) {
            promiseList.push(dispatch(allActions.doorActions.changeSizesProps('panel', 'thickness', lists.woodThickness)));
          } else {
            promiseList.push(dispatch(allActions.doorActions.changeSizesProps('panel', 'thickness', lists.notWoodThickness)));
          }
        }
      }

      Promise.allSettled(promiseList).then(() => {
        setTimeout(() => {
          resolve()
        }, 2000);
      })
    });
  }

  if (URLparams.edit) {
    useControl('Side', {
      group: 'door',
      type: 'select',
      items: lists.sides,
      onChange: (value) => {
        setParams({ side: value });
      }
    });

    useControl('Size', {
      group: 'door',
      type: 'select',
      items: lists.sizes,
      onChange: (value) => {
        setParams({ size: value });
      }
    });

    useControl('Invert', {
      group: 'door',
      type: 'boolean',
      onChange: (value) => {
        setParams({ invert: value });
      }
    });

    useControl('Trim', {
      group: 'trim',
      type: 'boolean',
      onChange: (value) => {
        setParams({ trim: value });
      }
    });

    useControl('Panel material', {
      group: 'panel',
      type: 'select',
      items: Object.keys(lists.materials),
      onChange: (value) => {
        setParams({ material: value });
      }
    });
  }

  return (
    <>
      {URLparams.edit && params.size != 1 && <DoubleSidedControls />}
      {URLparams.edit && params.size == 1 && <PanelFigureControl1 />}
      {URLparams.edit && params.size == 1.5 && <PanelFigureControl15 />}
      {URLparams.edit && params.size == 2 && <PanelFigureControl2 />}
      {URLparams.edit && params.trim && <TrimControls />}
      {URLparams.edit && resources.panelMaterial.type == 'pvh' && <PVHMaterialControl />}
      {URLparams.edit && resources.panelMaterial.type == 'shpon' && <ShponMaterialControl />}
      {URLparams.edit && resources.panelMaterial.type == 'paint' && <PaintMaterialControl />}
      {URLparams.edit && resources.panelMaterial.type == 'powder' && <PowderMaterialControl />}
      {URLparams.edit && resources.panelMaterial.type == 'croco' && <CrocoMaterialControl />}
      {URLparams.edit && resources.panelMaterial.type == 'vinil' && <VinilMaterialControl />}
    </>
  );
}
export default ControlsGUI;