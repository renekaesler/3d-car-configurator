import Mesh from "./mesh";

export default class Sphere extends Mesh {
  constructor(radius = 2, lat = 30, long = 30) {
    const indices = [];
    const positions = [];
    const uvs = [];
    const normals = [];

    for (let latNumber=0; latNumber <= lat; latNumber++) {
      const theta = latNumber * Math.PI / lat;
      const sinTheta = Math.sin(theta);
      const cosTheta = Math.cos(theta);

      for (let longNumber=0; longNumber <= long; longNumber++) {
        const phi = longNumber * 2 * Math.PI / long;
        const sinPhi = Math.sin(phi);
        const cosPhi = Math.cos(phi);

        const x = cosPhi * sinTheta;
        const y = cosTheta;
        const z = sinPhi * sinTheta;
        const u = 1 - (longNumber / long);
        const v = 1 - (latNumber / lat);

        normals.push(x);
        normals.push(y);
        normals.push(z);
        uvs.push(u);
        uvs.push(v);
        positions.push(radius * x);
        positions.push(radius * y);
        positions.push(radius * z);
      }
    }

    for (let latNumber=0; latNumber < lat; latNumber++) {
      for (let longNumber=0; longNumber < long; longNumber++) {
        const first = (latNumber * (long + 1)) + longNumber;
        const second = first + long + 1;
        indices.push(first);
        indices.push(second);
        indices.push(first + 1);

        indices.push(second);
        indices.push(second + 1);
        indices.push(first + 1);
      }
    }

    super({indices, positions, normals, uvs});
  }
}
