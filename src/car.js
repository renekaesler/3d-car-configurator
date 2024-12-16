import Mat4 from "./gl/math/mat4";
import RenderList from './renderlist.js';
import Obj from './loader/obj';
import PbrMaterial from './material/pbr-material';
import Json from './loader/json';
import createFromObj from './mesh/obj';

export default class Car extends RenderList {
  static async load(name) {
    const url = `cars/${name}`;

    const [model, materials, parameters] = await Promise.all([
      Obj.fetch(`${url}/model.obj`),
      PbrMaterial.fetch(`${url}/material.json`),
      Json.fetch(`${url}/parameters.json`)
    ]);

    const models = createFromObj(model).map(([mesh, materialName]) => {

      const material = materials[materialName] || new PbrMaterial({ name: materialName });

      return { mesh, material };
    });

    return new Car(models, parameters);
  }

  constructor(models, { gauge, wheelBase }) {
    super(models);

    this.gauge            = gauge;
    this.wheelBase        = wheelBase;
    this.modelMatrix      = new Mat4();
    this.displacementBias = 0.0;
  }

  set displacementBias(bias) {
    this._displBias = bias;
    this.modelMatrix[13] = bias;
  }

  get materials() {
    const materials = [];

    for(let i = 0, len = this.models.length; i < len; ++i) {
      const model = this.models[i];
      materials.push(model.material);
    }

    for(let i = 0, len = this.transparentModels.length; i < len; ++i) {
      const model = this.transparentModels[i];
      materials.push(model.material);
    }

    return materials;
  }

  displace(displacement) {
    this.modelMatrix[13] =  this._displBias + displacement;
  }
}