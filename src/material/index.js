import Json from "../loader/json";
import Img from '../loader/img';

import Texture2D from "../gl/texture-2d";
import gl from "../gl";

export default class Material {
  static async fetch(url) {
    const pathArr           = url.split('/');
    const filename          = pathArr.pop();
    const workingDirectory  =  url.replace(new RegExp(`${filename}$`), '');

    const promises      = [];
    const materials     = await Json.fetch(url);
    const materialNames = Object.keys(materials);

    // resolve all images that needs to be loaded asynchronous
    for(let name of materialNames) {
      const material = materials[name];

      for(let attribute in material) {
        let value = material[attribute];

        if (typeof value === 'string') {
          const promise = Img.fetch(`${workingDirectory}/${value}`).then(img => {
            material[attribute] = img;
          });

          promises.push(promise);
        }
      }

      material.name = name;
    }

    // wait until all images have been loaded
    await Promise.all(promises);

    return materials;
  }

  static createMap(value, format = gl.RGB) {
    if (value instanceof Image) {
      return new Texture2D(value, { internalFormat: format });
    } else {
      return Texture2D.fromValue(value);
    }
  }

  constructor({ name, isTransparent }) {
    this.name           = name;
    this.isTransparent  = isTransparent;
  }
}