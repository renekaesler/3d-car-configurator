import GUI from 'lil-gui';

import Vec4 from './gl/math/vec4';
import Material from './material';

const createGui = ({ scenes, cars, wheels, state, materialPresets }) => {
  const gui = new GUI({});
  const img = document.querySelector('#custom-texture');
  const input = document.querySelector('#file-input');

  const changeMaterial = (material) => {
    state.albedo    = material.albedo.slice(0, 3);
    state.alpha     = material.albedo[3];
    state.metallic  = material.metallic;
    state.roughness = material.roughness;
    state.occlusion = material.occlusion;
  }

  const changeMatrialProperties = () => {
    const { material, albedo, alpha, metallic, roughness, occlusion, } = state;

    if(!material) return;

    if (!Number.isNaN(albedo[0])) {
      material.albedo = new Vec4(albedo[0], albedo[1], albedo[2], alpha);
    }
  
    material.metallic = metallic;
    material.roughness = roughness;
    if(occlusion != undefined) material.occlusion = occlusion;
    material.isTransparent = alpha < 1.0;
  }

  gui.add(state, 'scene', scenes);
  gui.add(state, 'car', cars);
  gui.add(state, 'wheels', wheels);
  gui.add(state, 'displacement', -0.08, 0.03).step(0.005);

  const materials = gui.addFolder('materials');
  materials.addColor(state, 'albedo').listen().onChange(changeMatrialProperties);
  materials.add(state, 'alpha', 0.0, 1.0).step(0.01).listen().onChange(changeMatrialProperties);
  materials.add(state, 'metallic', 0.0, 1.0).step(0.01).listen().onChange(changeMatrialProperties);
  materials.add(state, 'roughness', 0.0, 1.0).step(0.01).listen().onChange(changeMatrialProperties);
  materials.add(state, 'occlusion', 0.0, 1.0).step(0.01).listen().onChange(changeMatrialProperties);

  input.addEventListener('change', () => {
    const src = window.URL.createObjectURL(input.files[0]);
    img.src = src;
    img.onload = () => {
      if(state.material) {
        state.material.albedoMap = Material.createMap(img);
      }
    };
  })
  
  state.loadTexture = () => {
    state.albedo = [NaN, NaN, NaN];
    input.click();
  }

  materials.add(state, 'loadTexture').name('Load Texture');

  Object.entries(materialPresets).forEach(([color, materialPreset]) => {
    state[color] = () => {
      Object.assign(state, materialPreset);
      changeMatrialProperties();
    }

    materials.add(state, color);
  });

  let materialCtrl;
  gui.refreshMaterialOptions = (options = []) => {
    
    if (materialCtrl) materialCtrl.destroy();
    state.material = null;
    materialCtrl = materials.add(state, 'material', options, ).onChange(changeMaterial);

    // Fast hack: Ensure car|bodypaint is loaded, when available
    const { $select } = materialCtrl;

    const opts = [...$select.childNodes];
    if (opts.some(opt => opt.value === 'car|bodypaint')) {
      $select.value = 'car|bodypaint'
      $select.dispatchEvent(new Event('change'))
    }
  }

  return gui;
}

export default createGui;
