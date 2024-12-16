import RenderList from './renderlist';
import Environment from './environment';
import Ibl from './ibl.js';
import Obj from './loader/obj';
import createFromObj from './mesh/obj';
import BasicMaterial from './material/basic-material';

const ibl  = new Ibl();
const brdf = ibl.generateBrdfLutTexture();

export default class Scene extends RenderList {
  static async load(name) {
    const url = `scenes/${name}`;

    let [model, materials] = await Promise.all([
      Obj.fetch(`${url}/model.obj`),
      BasicMaterial.fetch(`${url}/materials.json`),
    ]);

    const models = createFromObj(model).map(([mesh, materialName]) => {
      return { mesh, material: materials[materialName] };
    });

    const environment = await Environment.load(url);
    environment.brdf  = brdf;

    return new Scene(models, environment);
  }

  constructor(models, environment) {
    super(models);
    this.environment = environment;
  }

  destroy() {
    super.destroy();
    this.environment.destroy();
  }
}