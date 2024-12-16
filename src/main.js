import configurator from './configurator.js';
import createGui from './gui';
import Json from './loader/json.js';

const getMaterialOptions = () => {
  const options = {};

  const carMaterials = configurator?.car?.materials;
  const wheelMaterials = configurator?.wheels?.wheel?.materials;

  carMaterials && carMaterials.forEach(material => {
    options[`car|${material.name}`] = material;
  })

  wheelMaterials && wheelMaterials.forEach(material => {
    options[`wheel|${material.name}`] = material;
  });

  return options;
}

const { scenes, cars, wheels, materialPresets } = await Json.fetch('config.json');
const state = {
  scene: scenes.at(0),
  car: cars.at(0),
  wheels: wheels.at(0),
  displacement: 0.0,

  material: '',
  albedo: [1.0, 1.0, 1.0],
  alpha: 1.0,
  metallic: 1.0,
  roughness:  0.0,
  occlusion:  1.0,
};

const gui = createGui({ scenes, cars, wheels, state, materialPresets});

gui.onChange(async ({ property, value }) => {
  switch(property) {
    case 'displacement':
      configurator.car.displace(value);
      break;
    case 'scene':
      configurator.loadScene(value);
      break;
    case 'car':
      await configurator.loadCar(value);
      gui.refreshMaterialOptions(getMaterialOptions());
      break;
    case 'wheels':
      await configurator.loadWheels(value);
      gui.refreshMaterialOptions(getMaterialOptions());
      break;
  }
});

await configurator.run(state);
gui.refreshMaterialOptions(getMaterialOptions());

document.body.prepend(configurator.canvas);
