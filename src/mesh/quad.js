import Mesh from "./mesh";

export default class Quad extends Mesh {
  constructor() {
    const positions = [
      //          v1                 v2                 v3                 v4
      -1.0,-1.0, 0.0,     1.0,-1.0, 0.0,     1.0, 1.0, 0.0,    -1.0, 1.0, 0.0, // front
    ];

    const normals = [
      //          v1                 v2                 v3                 v4
       0.0, 0.0, 1.0,     0.0, 0.0, 1.0,     0.0, 0.0, 1.0,     0.0, 0.0, 1.0, // front
    ];

    const uvs = [
      //    t1           t2           t3           t4
      0.0, 0.0,    1.0, 0.0,    1.0, 1.0,    0.0, 1.0, // front
    ];

    const indices = [
      //  tri1           tri2
       0, 1, 2,       0, 2, 3, // front
    ];

    super({indices, positions, normals, uvs});
  }
}
